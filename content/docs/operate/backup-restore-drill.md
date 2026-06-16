---
title: Backup & restore drill
description: A stress-tested procedure for backing up a Syncropel instance, simulating corruption, restoring from backup, and verifying state. Run this drill on a test daemon before you need it in production. Target time-to-recover under 5 minutes.
---

## Why this drill exists

The runbook documents [backup discipline](./runbook.mdx#backup-discipline) and [recovery from corruption](./runbook.mdx#recovery-from-corruption-or-data-loss) separately. This page binds them together as one end-to-end drill you actually execute on a test daemon — so when you need the procedure in production you've already typed every command and seen every output.

The drill takes ~5 minutes start to finish on origin-desk hardware. If your run is materially slower, something is wrong and the runbook covers diagnosis.

> **Never run this drill against your production daemon.** The drill deliberately corrupts state. Use a separate daemon at `SYNCROPEL_HOME=/tmp/syncro-drill` (or any non-default path).

## Drill setup

Spawn a clean test daemon on a non-default port and isolated home directory:

```bash
export DRILL_HOME=/tmp/syncro-drill-$(date +%s)
mkdir -p "$DRILL_HOME"
SYNCROPEL_HOME="$DRILL_HOME" spl serve --port 9300

# Verify the test daemon is up + isolated from prod
SYNCROPEL_HOME="$DRILL_HOME" spl status 2>&1 | head -3
ls "$DRILL_HOME"
```

The status check should report `Status: ok` against the test daemon's port. The home dir should contain `hub.db`, `keys/`, `run/`, and `logs/`.

## Phase 1 — emit baseline records

Populate the daemon with enough state that "did the restore actually work" is testable:

```bash
SYNCROPEL_HOME="$DRILL_HOME" spl know "drill-baseline-fact-1" --thread th_drill
SYNCROPEL_HOME="$DRILL_HOME" spl know "drill-baseline-fact-2" --thread th_drill
SYNCROPEL_HOME="$DRILL_HOME" spl know "drill-baseline-fact-3" --thread th_drill

# Capture the baseline record count + most-recent record id for verification
BASELINE_COUNT=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_drill -o json | jq 'length')
BASELINE_LAST=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_drill -o json | jq -r '.[-1].id')
echo "baseline: $BASELINE_COUNT records, last=$BASELINE_LAST"
```

Expected: `baseline: 3 records, last=<sha256>`.

## Phase 2 — force a backup

The daemon's startup hook copies `hub.db` to the backup directory **once on each restart**. To capture a fresh backup mid-run, restart the daemon:

```bash
SYNCROPEL_HOME="$DRILL_HOME" spl stop
SYNCROPEL_HOME="$DRILL_HOME" spl serve --port 9300

# Verify the backup file exists and has non-trivial size
ls -lh "$HOME/.local/share/syncropel/backups/" | grep hub.db.bak
```

The backup directory layout depends on whether your test daemon has a content-addressed instance DID (see [Backup discipline](./runbook.mdx#backup-discipline) for the per-instance keying rules). The shape you'll see is one of:

```text
~/.local/share/syncropel/backups/instance-<did-tail>/hub.db.bak    # bootstrapped instance
~/.local/share/syncropel/backups/home-<short-hash>/hub.db.bak      # SYNCROPEL_HOME variant
~/.local/share/syncropel/backups/hub.db.bak                        # default single path
```

For the drill, also stash an off-host copy — you'll restore from this, not the daemon's auto-backup:

```bash
mkdir -p "$DRILL_HOME/offsite"
cp "$HOME/.local/share/syncropel/backups/"*/hub.db.bak "$DRILL_HOME/offsite/hub.db.drill.bak" 2>/dev/null \
  || cp "$HOME/.local/share/syncropel/backups/hub.db.bak" "$DRILL_HOME/offsite/hub.db.drill.bak"

ls -lh "$DRILL_HOME/offsite/"
```

The `offsite` copy here simulates the off-host snapshot the runbook tells you to maintain. In production, this would be a periodic `cp` to S3, B2, or a separate volume.

## Phase 3 — simulate corruption

Stop the daemon and damage `hub.db`. The drill uses the simplest possible corruption — overwriting the SQLite header — so the daemon's startup path fails fast and visibly:

```bash
SYNCROPEL_HOME="$DRILL_HOME" spl stop

# Move the good store aside so we can inspect later if needed
mv "$DRILL_HOME/hub.db" "$DRILL_HOME/hub.db.was-good.$(date +%s)"

# Synthesize a "corrupt" hub.db (all zeros — fails SQLite header check)
dd if=/dev/zero of="$DRILL_HOME/hub.db" bs=4096 count=1 2>/dev/null

# Confirm the daemon refuses to start cleanly
SYNCROPEL_HOME="$DRILL_HOME" spl serve --port 9300 2>&1 | tail -5
```

The daemon should fail to start with a SQLite-format error in the log. Verify:

```bash
tail -10 "$DRILL_HOME/logs/spl.log" 2>/dev/null | grep -iE 'error|panic|sqlite' || echo "log empty — check ~/.syncro instead"
```

## Phase 4 — restore from off-host backup

Replace the corrupt store with the off-host copy and restart:

```bash
# Move the corrupt store aside (don't delete — keep for forensics)
mv "$DRILL_HOME/hub.db" "$DRILL_HOME/hub.db.corrupt.$(date +%s)"
rm -f "$DRILL_HOME/hub.db-wal" "$DRILL_HOME/hub.db-shm"

# Restore from the off-host backup
cp "$DRILL_HOME/offsite/hub.db.drill.bak" "$DRILL_HOME/hub.db"

# Restart
SYNCROPEL_HOME="$DRILL_HOME" spl serve --port 9300

# Verify daemon up
SYNCROPEL_HOME="$DRILL_HOME" spl status 2>&1 | head -3
```

## Phase 5 — verify state recovered

Confirm the restored daemon sees exactly the baseline records:

```bash
RESTORED_COUNT=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_drill -o json | jq 'length')
RESTORED_LAST=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_drill -o json | jq -r '.[-1].id')

echo "baseline:  $BASELINE_COUNT records, last=$BASELINE_LAST"
echo "restored:  $RESTORED_COUNT records, last=$RESTORED_LAST"

[ "$BASELINE_COUNT" = "$RESTORED_COUNT" ] && [ "$BASELINE_LAST" = "$RESTORED_LAST" ] \
  && echo "✓ state matches baseline" \
  || echo "✗ state mismatch — investigate"
```

Both lines should match. If they don't, you restored from a stale backup (the auto-backup got overwritten before you copied it off-host, or the off-host copy itself is older than the baseline).

Trust scores, routing rules, AITL rules, and engine config rebuild automatically from the record log on startup — you don't restore them separately. Verify:

```bash
SYNCROPEL_HOME="$DRILL_HOME" spl trust 2>&1 | head -5
SYNCROPEL_HOME="$DRILL_HOME" spl config list-rules 2>&1 | head -5
```

If trust + rules look right and the record count matches, the restore is complete.

## Phase 6 — clean up

```bash
SYNCROPEL_HOME="$DRILL_HOME" spl stop
rm -rf "$DRILL_HOME"
```

The off-host copy under `$DRILL_HOME/offsite/` is removed with the rest. In production, off-host backups are retained on the schedule defined in your snapshot policy — typically 14 days rolling per the runbook's example cron.

## Time-to-recover budget

The drill on origin-desk WSL2 hardware (16 GB RAM, NVMe, 3-record baseline) clocks in at 30-90 seconds for the data path:

| Phase | Wall-clock |
|---|---|
| Stop daemon | ~5s |
| Move corrupt store aside | ~1s |
| Copy backup to `hub.db` | ~1s for typical hub.db (<100 MB) |
| Restart daemon | ~10s |
| Verify state | ~5s |

**Target time-to-recover for production restore: under 5 minutes.** That budget includes thinking time — finding your most recent off-host backup, deciding which one to restore from, and verifying state — not just the literal `cp` + restart.

If your production `hub.db` is in the multi-GB range (long-running instance with millions of records), expect Phase 4's `cp` to dominate and budget accordingly.

## What this drill does NOT cover

The drill exercises the **records + config** path. It does NOT exercise:

- **Identity restore** — `~/.syncro/keys/` and `~/.syncro/secrets/` are NOT in the auto-backup. If you lose the keys dir without your own off-host backup of it, you cannot recover the instance's DID. Federation pairs would need to be re-established under a new DID. Back up `keys/` + `secrets/` separately, to a different vault than `hub.db` (per [Security model](./security-model.mdx)).
- **Task content files** — `~/.syncro-data/tasks/<task-id>.md` and `~/.syncro-data/aliases.toml` are referenced by path during dispatch but are NOT in the records auto-backup. The runbook's snapshot example tars them separately; do the same in your production backup script.
- **Federation pair re-establishment** — if you restore from a backup that pre-dates a peer pair, the peer's records are in your store but the local pair record may be stale. `spl federation pair --refresh` (where supported) or re-running `spl federation pair <peer-url>` resolves this.
- **In-flight dispatches** — anything mid-flight when the daemon crashed is lost. Re-dispatch from the task ID after restore.

For the full breadth of what's protected vs what operator must mitigate, read [Security model — threat model summary](./security-model.mdx#threat-model-summary).

## See also

- [Operator runbook — backup discipline](./runbook.mdx#backup-discipline) — the underlying mechanism
- [Operator runbook — recovery from corruption or data loss](./runbook.mdx#recovery-from-corruption-or-data-loss) — recovery steps in narrative form
- [Rollback procedure](./rollback-procedure.md) — for downgrading a binary, not restoring data
- [Security model](./security-model.mdx) — what's NOT in the auto-backup and why
