---
title: Rollback procedure
description: How to downgrade a Syncropel daemon after a bad upgrade — when to roll back, how to install a previous version, what to expect from store-format compatibility, and a stress-tested drill you can run on a test daemon.
---

## When to roll back

Rolling back a binary is a recovery action, not a routine one. Most upgrade issues are better resolved by reading the daemon log + filing a bug than by reverting. Roll back only when:

- The new daemon refuses to start cleanly and the log doesn't surface an obvious config issue.
- The new daemon starts but a critical command path (record emit, sync, dispatch) is broken in a way that blocks production work.
- A regression in the new release affects data integrity and the only way to stop bleeding is to revert until a fixed release ships.

If you're rolling back because a feature works differently than you expected, file a bug and live with the new behavior — that path leads to a fix; rolling back leads to deferred incompatibility.

## Detect-rollback-needed signal patterns

The runbook covers [what can go wrong on upgrade](./runbook.mdx#what-can-go-wrong-and-how-to-recognize-it). The signals that warrant rollback (vs. config fix) are:

| Signal | Action |
|---|---|
| `spl version` reports old version after install | Install failed, not rollback territory — re-run the install script |
| Daemon panics on startup with `hub.db` schema error | Check release notes for explicit migration instructions before rolling back |
| Daemon starts but `spl status` returns 500 | Read `~/.syncro/logs/spl.log` first; rollback only if the log surfaces a regression in the new release |
| Records emit but reconciler stops processing them | Capture state, file bug, then roll back if blocking work |
| `spl federation pair` fails between paired peers post-upgrade | Often a transient peer-discovery issue; wait 60s, retry, then roll back if persistent |

For any rollback decision, snapshot `hub.db` and grab the last 200 lines of `~/.syncro/logs/spl.log` BEFORE you revert. The forensic trail is the only way the next release fixes the underlying issue.

## Rollback steps

### Step 1 — capture forensic state

```bash
SNAP_DIR="$HOME/backups/syncropel/rollback-forensics-$(date +%s)"
mkdir -p "$SNAP_DIR"

cp ~/.syncro/hub.db "$SNAP_DIR/hub.db.snapshot"
tail -500 ~/.syncro/logs/spl.log > "$SNAP_DIR/spl.log.tail"
spl version > "$SNAP_DIR/version.before-rollback" 2>&1
ls -la "$SNAP_DIR"
```

This snapshot is what you'll attach to the bug report. Don't skip it — even on an "obvious" regression, the next release's regression test needs the failing state.

### Step 2 — stop the daemon

```bash
spl serve --stop
```

If `--stop` reports the daemon isn't running but `pgrep -af "spl serve"` finds a process, follow the [recovery procedure for a stale PID](./runbook.mdx#when-spl-serve-stop-says-not-running-but-the-daemon-clearly-is).

### Step 3 — install the previous version

The install script accepts a `?v=<version>` query parameter to pin a specific release:

```bash
curl -sSf "https://get.syncropic.com/spl?v=0.30.5" | sh
```

Replace `0.30.5` with whichever release you want to roll back to. The install script accepts any released version tag.

Verify the new (older) binary is in place before restarting:

```bash
spl version
# expected: spl 0.30.5
```

### Step 4 — verify store-format compatibility

This is the critical question: **can the older daemon read records the newer daemon wrote?**

The answer for in-progress releases is: **usually yes, occasionally no, and the release notes always say so.** The daemon's store schema has been backward-compatible across the v0.X.Y range (records persist as JSON-canonicalized blobs in SQLite; new body kinds and fields are additive). When a release introduces a non-backward-compatible change, the release notes will say so explicitly under a "Breaking changes" or "Migration required" heading.

Check the release notes for the version you're rolling back to before restarting the daemon. If the notes say nothing about a breaking schema change between the version you have and the version you're rolling back to, the store should be readable. If they do, follow the migration guide instead of just reverting the binary.

### Step 5 — start the older daemon

```bash
spl serve --daemon

# Verify it came up cleanly
spl status
spl version
tail -20 ~/.syncro/logs/spl.log
```

The log on first startup should show `rebuild_from_store()` running cleanly (it walks every record and rebuilds folded state). If the older daemon panics here on a body kind it doesn't recognize, you've hit a forward-incompatibility — see [What if the older daemon refuses to start](#what-if-the-older-daemon-refuses-to-start).

### Step 6 — verify state intact

Spot-check the post-rollback state matches what you had before:

```bash
spl status
spl thread list 2>&1 | head -10
spl trust 2>&1 | head -5
```

Compare against the snapshot you took in Step 1. Counts should match; trust scores rebuild from records on startup so they should converge to roughly the same values within a few seconds.

### Step 7 — file the bug

The forensic snapshot from Step 1 is what makes the next release fix the regression. File at:

```text
https://github.com/syncropic/syncropel/issues/new
```

Include: version-before, version-rolled-back-to, the log tail, the symptom that triggered rollback, and reference the snapshot path (without uploading the actual `hub.db` — it contains your records).

## What if the older daemon refuses to start

You're in a forward-incompatibility — the newer daemon wrote a body kind, body field, or schema element the older daemon doesn't recognize. The right path is:

1. **Don't keep retrying the older binary on the upgraded store.** Each restart has the auto-backup overwrite trap (see [Backup discipline](./runbook.mdx#backup-discipline)) — your good off-host backup may quietly turn into a snapshot of broken state.
2. **Revert the store to the pre-upgrade snapshot.** This is what Step 1's forensic snapshot is for, but if you skipped Step 1, you may still have an off-host backup from before the upgrade. Restore it via the [Backup & restore drill](./backup-restore-drill.md) procedure.
3. **If you have neither a forensic snapshot nor a pre-upgrade off-host backup**, you have only two paths: (a) re-install the newer version + accept the regression until a fix ships, or (b) accept losing the records the newer daemon wrote during the brief window since upgrade. Pick based on which loss hurts less.

The third case is why [the runbook tells you to snapshot before upgrading](./runbook.mdx#the-supported-upgrade-path). Snapshot is one extra `cp` command; recovering from a missing snapshot is a multi-hour incident.

## Rollback drill (run on a test daemon)

Before you need to roll back in production, run the procedure on a test daemon to confirm the install URL works, the version pin lands, and your hands know the steps.

> **Never run this drill against your production daemon.** Use a separate `SYNCROPEL_HOME`.

```bash
export DRILL_HOME=/tmp/syncro-rollback-drill-$(date +%s)
mkdir -p "$DRILL_HOME"

# Phase 1 — install latest (assume current production version)
curl -sSf "https://get.syncropic.com/spl" | sh
spl version

# Phase 2 — emit a test record
SYNCROPEL_HOME="$DRILL_HOME" spl serve --daemon --port 9301
SYNCROPEL_HOME="$DRILL_HOME" spl know "rollback-drill-record" --thread th_rollback_drill
PRE_COUNT=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_rollback_drill -o json | jq 'length')
echo "pre-rollback: $PRE_COUNT records"

# Phase 3 — rollback to a known-good prior version
SYNCROPEL_HOME="$DRILL_HOME" spl serve --stop
curl -sSf "https://get.syncropic.com/spl?v=0.30.5" | sh
spl version
# expected: spl 0.30.5

# Phase 4 — start the older daemon, verify state
SYNCROPEL_HOME="$DRILL_HOME" spl serve --daemon --port 9301
SYNCROPEL_HOME="$DRILL_HOME" spl status
POST_COUNT=$(SYNCROPEL_HOME="$DRILL_HOME" spl thread records th_rollback_drill -o json | jq 'length')
echo "post-rollback: $POST_COUNT records"

[ "$PRE_COUNT" = "$POST_COUNT" ] \
  && echo "✓ records intact across rollback" \
  || echo "✗ record count mismatch — investigate"

# Phase 5 — restore latest, verify forward path also works
SYNCROPEL_HOME="$DRILL_HOME" spl serve --stop
curl -sSf "https://get.syncropic.com/spl" | sh
SYNCROPEL_HOME="$DRILL_HOME" spl serve --daemon --port 9301
SYNCROPEL_HOME="$DRILL_HOME" spl status

# Cleanup
SYNCROPEL_HOME="$DRILL_HOME" spl serve --stop
rm -rf "$DRILL_HOME"
```

If Phase 4's record count matches Phase 2's, the rollback drill passed. The rollback path is exercised + the install URL pin works.

## Time-to-roll-back budget

On origin-desk WSL2 with a typical (small) `hub.db`, the procedure clocks in at 1-3 minutes:

| Phase | Wall-clock |
|---|---|
| Forensic snapshot | ~10s |
| Stop daemon | ~5s |
| Install previous version (curl + atomic mv) | ~10-30s depending on bandwidth |
| Start older daemon + verify | ~15s |
| Spot-check state | ~30s |

**Target time-to-roll-back: under 5 minutes including the forensic snapshot.** Beyond that, you're either dealing with an incompatible store (jump to "older daemon refuses to start") or a network issue downloading the binary (re-run the curl).

## See also

- [Operator runbook — in-place upgrades](./runbook.mdx#in-place-upgrades) — the forward path this procedure reverses
- [Backup & restore drill](./backup-restore-drill.md) — what to do when the store itself is the problem
- [Operator runbook — what can go wrong on upgrade](./runbook.mdx#what-can-go-wrong-and-how-to-recognize-it) — diagnostic decision tree
- Project home: https://github.com/syncropic/syncropel
