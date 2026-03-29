# Install Test Report — 2026-03-29

**Tester**: AI agent (Claude Code, Opus 4.6)
**Environment**: Linux x86_64, Ubuntu (WSL2), Python 3.12+, curl 8.5.0
**Docs version**: Commit e44e381 (post-improvement changes)
**CLI version found**: syncropel-cli v0.3.0 (pre-existing install from prior session)
**Goal**: Follow docs.syncropel.com from zero to a working spl installation

---

## Summary

The install pipeline is broken. A fresh `curl -sSf https://get.syncropic.com/spl | sh` fails with a dependency resolution error. Additionally, the actual CLI (v0.3.0) diverges significantly from the documentation — command flags, directory paths, and config file formats don't match what the docs describe.

---

## Issue 1: Install Script Fails — BLOCKER

**Severity**: Critical — blocks all new users

**Command run**:
```bash
curl -sSf https://get.syncropic.com/spl | sh
```

**Error**:
```
Installing syncropel-cli via uv...
× Failed to resolve dependencies for `syncropel-cli` (v0.3.0)
╰─▶ Package `syncropel-registry-core` was included as a URL dependency.
    URL dependencies must be expressed as direct requirements
    or constraints. Consider adding `syncropel-registry-core @
    git+https://github.com/syncropic/syncropel-registry-core.git@v0.2.0` to
    your dependencies or constraints file.
```

**Root cause**: `syncropel-cli` v0.3.0 has a dependency on `syncropel-registry-core` specified as a git URL. `uv tool install` doesn't support URL dependencies in this context.

**Impact**: No new user can install spl. The entire onboarding flow is dead at step 1.

**Fix needed**: Either:
1. Publish `syncropel-registry-core` to PyPI so it resolves normally, or
2. Bundle it into `syncropel-cli`, or
3. Have the install script use `uv pip install` with `--extra-index-url` or explicit git constraints, or
4. Pin to a working version that doesn't have this dependency issue

---

## Issue 2: `spl init` Does Not Match Documentation — HIGH

**Severity**: High — docs describe a command that doesn't exist as described

**What the docs say** (quickstart + CLI reference + agent onboarding prompt):
```bash
spl init                    # "Interactive 4-step setup wizard (directory, integrations, model, daemon)"
spl init --yes              # "Non-interactive setup with defaults"
spl init --key <key>        # "Configure API key non-interactively"
spl init --key test --yes   # "Test mode — deterministic responses without API calls"
spl init --status           # "Show current configuration status"
```

**What actually exists** (v0.3.0):
```
Usage: spl init [OPTIONS] COMMAND [ARGS]...

Generate project discovery files.

Options:
  --force   -f       Regenerate even if files exist
  --dir     -d PATH  Project directory [default: .]
  --output  -o       Output format [default: table]
  --json    -j       JSON output
  --help             Show this message and exit.
```

**Key differences**:
- `spl init` is NOT a setup wizard — it only generates `.syncro/ABOUT.md` and `CONVENTIONS.md`
- `--yes` flag does not exist → `Error: No such option: --yes`
- `--key` flag does not exist
- `--status` flag does not exist
- There is no "4-step wizard" (directory, integrations, model, daemon)
- API key configuration is not handled by `spl init` at all

**Impact**: The agent onboarding prompt (step 5: `spl init --yes`) fails immediately. Quickstart "Configure" section is wrong. Every doc page referencing `spl init` as a setup wizard is misleading.

**Fix needed**: Either:
1. Update the CLI to add the `--yes` and `--key` flags as documented, or
2. Update the docs to match the actual CLI behavior, and document the real way to configure API keys (if one exists — `spl config` subcommands only show `show`, `path`, `validate` — there's no `set-key` either)

---

## Issue 3: Data Directory Is `~/.syncropel/` Not `~/.syncro/` — HIGH

**Severity**: High — docs point to wrong paths throughout

**What the docs say everywhere**: `~/.syncro/`
- Quickstart: "creates `~/.syncro/`"
- Quickstart verify: `ls ~/.syncro/config.toml && echo "OK"`
- CLI reference: `SPL_HOME` defaults to `~/.syncro`
- Local registry file layout: `~/.syncro/hub.db`, `~/.syncro/secrets/`, etc.
- Agent integration: `~/.syncro/hooks/syncropel_trace.py`

**What the actual CLI uses**: `~/.syncropel/`
```bash
$ spl config path
/home/dpwanjala/.syncropel

$ spl config show -j
{
  "config": {
    "trace_dir": "/home/dpwanjala/.syncropel/traces",
    "registry.db_path": "/home/dpwanjala/.syncropel/registry.duckdb",
    ...
  },
  "config_file": "/home/dpwanjala/.syncropel/config.json",
  ...
}
```

**Actual directory layout found**:
```
~/.syncropel/
  config.json          # NOT config.toml, NOT config.yaml
  registry.duckdb      # NOT hub.db
  hooks/
  traces/
```

**Three sub-discrepancies**:
1. Directory: `~/.syncropel/` not `~/.syncro/`
2. Config file: `config.json` not `config.toml` or `config.yaml`
3. Database file: `registry.duckdb` not `hub.db`

**Impact**: Every verification step in the docs fails. `ls ~/.syncro/config.toml && echo "OK"` outputs nothing. An agent following the docs would think init failed when it actually succeeded.

**Fix needed**: Either:
1. Update the CLI to use `~/.syncro/` with `config.toml` and `hub.db` as documented, or
2. Update ALL docs pages to reflect the actual paths (`~/.syncropel/`, `config.json`, `registry.duckdb`)

---

## Issue 4: `spl setup` Flags Don't Match Docs — MEDIUM

**Severity**: Medium — some flags work, some don't, naming is inconsistent

**What the docs say** (across different pages):
- Agent integration page: `spl setup --claude`
- CLI reference: `spl setup --claude` and `spl setup --skills`
- Integrations page: `spl setup --claude`
- Troubleshooting: `spl setup --claude`

**What actually exists** (v0.3.0):
```
Options:
  --claude-code    Install Claude Code skill
  --hooks          Install Claude Code trace hooks
  --all            Install all components (skill + hooks)
  --list     -l    List available integrations
  --remove   TEXT  Remove an integration
```

**Key difference**: The actual flag is `--claude-code`, not `--claude`. The docs were updated to say `--claude` but the binary still has `--claude-code`.

**Also**: `--hooks` and `--all` exist in the CLI but are not documented on the latest agent integration page (which only mentions `--claude`). The older CLI reference page still documents them correctly.

**Impact**: `spl setup --claude` would fail with "no such option". An agent would need to discover `--claude-code` via `--help`.

**Fix needed**: Align the flag name. Either rename in CLI to `--claude` or update docs back to `--claude-code`.

---

## Issue 5: `spl help-agent -j` Doesn't Accept `-j` Flag — MEDIUM

**Severity**: Medium — documented flag doesn't work

**What the docs say** (agent integration, CLI reference):
```bash
spl help-agent -j              # Tier 0: ~200 tokens
spl help-agent namespace -j    # Tier 1: ~400 tokens
spl help-agent --conventions -j # Tier 2: ~500 tokens
```

**What actually happens**:
```
$ spl help-agent -j
Error: No such option: -j
```

**From `spl help-agent --help`**: The actual flags need to be checked, but `-j` is documented as a global flag on "every command" — yet `help-agent` doesn't accept it.

**Impact**: An agent following the progressive discovery docs would fail on its first attempt to discover capabilities.

**Fix needed**: Either add `-j` support to `help-agent` or document the actual output format.

---

## Issue 6: `spl config set-key` Does Not Exist — MEDIUM

**Severity**: Medium — troubleshooting recommends a nonexistent command

**What the docs say** (troubleshooting page, "Proxy returns 502" and "API key not accepted"):
```bash
spl config set-key
```

**What actually exists**:
```
$ spl config --help
Commands:
  show      Show current configuration.
  path      Show the Syncropel home directory path.
  validate  Validate configuration file for errors.
```

No `set-key` subcommand. No `model` subcommand either (also documented in CLI reference).

**Impact**: Users hitting API key issues have no documented way to fix them. The troubleshooting page's advice doesn't work.

**Fix needed**: Either add `set-key` to the CLI, or document the actual method for configuring API keys (manual edit of config.json? Environment variable? Different command?).

---

## Issue 7: `spl serve --stop` / `--status` / `--logs` May Not Exist — LOW-MEDIUM

**Severity**: Needs verification — documented in troubleshooting and local registry pages

**What the docs say**:
```bash
spl serve --stop     # Stop the daemon
spl serve --status   # Check if running
spl serve --logs     # Check daemon logs
```

**What `spl serve --help` shows**:
```
Options:
  --port    -p  INTEGER  Port to bind to [default: 9100]
  --host        TEXT     Host to bind to [default: 127.0.0.1]
  --open                 Open browser to app.syncropel.com
  --memory               Use in-memory DB (no persistence)
  --seed                 Force re-seed patterns from taxonomy
  --help                 Show this message and exit.
```

No `--stop`, `--status`, or `--logs` flags visible.

**Impact**: Troubleshooting advice for killing/checking the server doesn't work. Users would need to use `pkill` instead.

**Fix needed**: Either add these flags or update docs to use `pkill -f "spl serve"` and `lsof -i :9100` instead.

---

## Issue 8: Skill File Path Discrepancy — LOW

**Severity**: Low — cosmetic but causes confusion

**What the docs say** (latest agent integration): `~/.claude/skills/syncropel/SKILL.md`

**What `spl setup --all` actually installed**: `~/.claude/skills/managing-syncropel/SKILL.md`

**Impact**: Docs point to wrong path for manual verification.

---

## Issue 9: No Documented Way to Configure API Keys — HIGH

**Severity**: High — fundamental gap in the onboarding flow

After removing the nonexistent commands (`spl init --key`, `spl config set-key`), there is **no documented way to provide an API key to the proxy**. The actual mechanism appears to be:
- A file at `~/.syncropel/secrets/anthropic_key` (seen in the old install)
- Or possibly an environment variable
- Or possibly manual editing of `config.json`

But none of these are documented. The quickstart's "Configure" step is entirely based on `spl init` which doesn't do what the docs say.

**Fix needed**: Document the actual API key configuration mechanism, whatever it is.

---

## Issue 10: Old Install Leaves Stale Hooks — LOW

**Severity**: Low — only affects users who had a previous install

When we uninstalled spl and removed `~/.syncropel/`, the Claude Code hooks in `~/.claude/settings.json` still pointed to the deleted tracer script at `/home/dpwanjala/.syncropel/hooks/syncropel_trace.py`. Every Claude Code tool call then failed the hook with a file-not-found error.

`spl setup --remove` should be run BEFORE uninstalling, or the uninstall docs should mention cleaning up hooks. The current uninstall instructions (`uv tool uninstall syncropel-cli && rm -rf ~/.syncro/`) don't address this.

**Fix needed**: Update uninstall instructions to include `spl setup --remove` as the first step, or mention manual cleanup of `~/.claude/settings.json`.

---

## Summary Table

| # | Issue | Severity | Type |
|---|-------|----------|------|
| 1 | Install script fails (dependency resolution) | **BLOCKER** | Packaging |
| 2 | `spl init` is not a setup wizard (no `--yes`, `--key`) | High | Docs vs CLI mismatch |
| 3 | Paths are `~/.syncropel/` not `~/.syncro/`, files are `config.json` not `config.toml` | High | Docs vs CLI mismatch |
| 4 | `spl setup --claude` should be `--claude-code` | Medium | Docs vs CLI mismatch |
| 5 | `spl help-agent -j` rejects `-j` flag | Medium | Docs vs CLI mismatch |
| 6 | `spl config set-key` does not exist | Medium | Docs vs CLI mismatch |
| 7 | `spl serve --stop/--status/--logs` may not exist | Low-Medium | Docs vs CLI mismatch |
| 8 | Skill file path is `managing-syncropel/` not `syncropel/` | Low | Docs vs CLI mismatch |
| 9 | No documented way to actually configure API keys | High | Missing docs |
| 10 | Uninstall doesn't clean up Claude Code hooks | Low | Missing docs |

---

## Recommendation

The docs and CLI are out of sync. This appears to be a case where the documentation describes the **intended/planned** CLI behavior while the **shipped** CLI (v0.3.0) implements an earlier or different design.

**Immediate priorities**:
1. Fix the install script (Issue 1) — nothing else matters until new users can install
2. Decide which is the source of truth — docs or CLI — and align them
3. If the CLI is being updated to match docs: ship that update and re-test
4. If the docs need to match the CLI: audit every command, flag, and path against `--help` output

**Testing process**: Before publishing docs, run every documented command on a clean system and verify:
- The command exists
- The flags exist
- The expected output matches
- The file paths are correct
