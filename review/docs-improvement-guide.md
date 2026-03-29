# Syncropel Documentation Improvement Guide

**Prepared**: 2026-03-29
**Scope**: Full documentation audit of syncropel.com, docs.syncropel.com, CLI skill file, and install pipeline
**Goal**: Make the entire discovery-to-productive-use flow seamless, predictable, and failure-resilient for both AI agents and human developers

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Assessment](#2-current-state-assessment)
3. [Critical Fixes (P0)](#3-critical-fixes-p0)
4. [High-Priority Improvements (P1)](#4-high-priority-improvements-p1)
5. [Medium-Priority Improvements (P2)](#5-medium-priority-improvements-p2)
6. [Failure Mode Catalog & Recovery Guidance](#6-failure-mode-catalog--recovery-guidance)
7. [AI Agent Ergonomics](#7-ai-agent-ergonomics)
8. [Human Developer Ergonomics](#8-human-developer-ergonomics)
9. [Structural & Information Architecture](#9-structural--information-architecture)
10. [Skill File & Integration Alignment](#10-skill-file--integration-alignment)
11. [Website & SEO / Discoverability](#11-website--seo--discoverability)
12. [Testing the Documentation](#12-testing-the-documentation)
13. [Templates & Patterns to Adopt](#13-templates--patterns-to-adopt)
14. [Appendix: Page-by-Page Audit Notes](#14-appendix-page-by-page-audit-notes)

---

## 1. Executive Summary

Syncropel's documentation has strong conceptual foundations — progressive discovery, JSON-first output, sidecar architecture, self-installing integrations. These are genuinely ahead of the curve for AI-agent tooling.

However, the documentation has critical gaps that **will cause real failures** during installation and onboarding:

- **Silent prerequisites**: Python 3.12+ is required but not mentioned until the CLI reference page (not in quickstart)
- **Path inconsistencies**: `~/.syncro/` and `~/.syncropel/` are used interchangeably across docs, skill file, and env vars
- **No verification steps**: Users have no way to confirm success after install, init, or serve
- **No error guidance**: Zero troubleshooting content for any failure scenario
- **Opaque installer**: The curl-pipe-sh script is a black box with no documentation of what it does
- **Broken main site**: syncropel.com renders as an empty Next.js shell — invisible to AI agents and web crawlers
- **Skill file drift**: The Claude Code skill references concepts (F1-F8 axioms, 5-level hierarchy) not explained anywhere in the docs

The majority of fixes are documentation-only changes. The tool itself is well-designed; the docs need to match.

### Success Criteria

After implementing this guide, a user (human or AI agent) should be able to:

1. Discover Syncropel exists and what it does within 30 seconds
2. Install it on a supported system in under 2 minutes with zero ambiguity
3. Verify every step succeeded with concrete expected outputs
4. Diagnose and recover from every common failure without external help
5. Reach a working proxy + dashboard state and make their first traced LLM call
6. Understand where to go next based on their use case

---

## 2. Current State Assessment

### What Works Well (Preserve These)

| Strength | Why It Matters |
|----------|---------------|
| `spl help-agent` progressive discovery (200/400/500 tokens) | Agents learn the CLI without reading full docs; token-budget-aware |
| `-j` JSON flag on every command | Agents parse structured output; no fragile text scraping |
| Consistent exit codes (0/1/3/4/5/6) | Agents can branch on failure type programmatically |
| `spl setup --all` self-installing integrations | One command installs skill + hooks + config |
| Sidecar observation model | Zero behavioral changes to the agent; non-invasive |
| `.syncro/ABOUT.md` project discovery files | Agents auto-discover spl availability when opening a project |
| 60-second quickstart framing | Sets correct expectation for time investment |
| Cost tracking with per-model pricing table | Immediately useful; justifies the proxy overhead |

### What Needs Work

| Issue | Severity | Type |
|-------|----------|------|
| Python 3.12+ not in quickstart | Critical | Missing content |
| `~/.syncro` vs `~/.syncropel` inconsistency | Critical | Contradiction |
| No verification steps anywhere | Critical | Missing content |
| No troubleshooting / error recovery | High | Missing content |
| syncropel.com not crawlable | High | Technical |
| Install script undocumented | High | Missing content |
| Skill file references undefined concepts | High | Drift |
| Test mode (`--key test`) unexplained | Medium | Missing content |
| No uninstall docs | Medium | Missing content |
| Docs URL structure not discoverable | Medium | Technical |
| No supported platforms list | Medium | Missing content |
| No changelog or version history | Low | Missing content |

---

## 3. Critical Fixes (P0)

These issues will cause installation failures. Fix before anything else.

### 3.1 Add Prerequisites Section to Quickstart

**Problem**: Python 3.12+ is required but only mentioned on the CLI reference page. A user on Ubuntu 22.04 (Python 3.10), macOS 12 (Python 3.8), or many CI environments will fail silently or with a cryptic error.

**Fix**: Add a prerequisites block as the very first thing on the quickstart page, before the install command.

```markdown
## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Python | 3.12+ | `python3 --version` |
| curl | any | `curl --version` |
| OS | Linux (x86_64, arm64), macOS (arm64, x86_64) | `uname -sm` |
| Network | Outbound HTTPS to get.syncropic.com | — |
| Disk | ~50 MB for binary + database | `df -h ~/.syncro` |

**Quick check** — run this before installing:

```bash
python3 -c "import sys; assert sys.version_info >= (3, 12), f'Need Python 3.12+, have {sys.version}'"
```

If your Python is too old:
- **macOS**: `brew install python@3.12`
- **Ubuntu/Debian**: `sudo add-apt-repository ppa:deadsnakes/ppa && sudo apt install python3.12`
- **Fedora**: `sudo dnf install python3.12`
```

**Why this matters for AI agents**: An agent executing `curl | sh` on a system with Python 3.10 will get an error it cannot diagnose. With a prerequisite check, the agent can verify compatibility before attempting install and take corrective action if needed.

### 3.2 Resolve the ~/.syncro vs ~/.syncropel Path Inconsistency

**Problem**: The documentation, skill file, environment variables, and CLI reference disagree on the home directory path.

| Source | Path Used |
|--------|-----------|
| Quickstart | `~/.syncro/` |
| CLI Reference (env vars) | `SPL_HOME` defaults to `~/.syncropel` |
| CLI Reference (config defaults) | `~/.syncro/traces`, `~/.syncro/hub.db` |
| Agent Integration guide | `~/.syncro/hooks/`, `~/.syncro/traces/` |
| Local Registry guide | `~/.syncro/hub.db`, `~/.syncro/secrets/` |

**Fix**:
1. Pick ONE canonical path. Recommend `~/.syncro/` (shorter, already dominant in docs)
2. Update `SPL_HOME` default documentation to match
3. Grep every doc page, skill file, and config template for both variants
4. Add a note: "Prior versions used `~/.syncropel/`. If you have data there, either move it or set `SPL_HOME=~/.syncropel`."
5. Ensure the actual binary matches whichever path the docs state

**Create a canonical file layout reference**:

```markdown
## File Layout

~/.syncro/                    # SPL_HOME — all Syncropel data
  config.yaml                 # Main configuration
  hub.db                      # DuckDB database (records, namespaces, etc.)
  secrets/
    daemon_token              # Auto-generated auth token for registry
  hooks/
    syncropel_trace.py        # Claude Code tracer (installed by spl setup)
  traces/                     # Session trace files (JSON)
    <session-id>.jsonl

~/.claude/                    # Claude Code config (not owned by Syncropel)
  skills/
    managing-syncropel/
      SKILL.md                # Installed by spl setup --claude-code
  settings.json               # Hook registrations added by spl setup --hooks

.syncro/                      # Per-project (committed to repo)
  ABOUT.md                    # Project discovery file
  CONVENTIONS.md              # Governance reference
```

### 3.3 Add Verification Steps After Every Action

**Problem**: After install, init, and serve, the user has no way to confirm success. An AI agent will proceed blindly and fail later with an unrelated-looking error.

**Fix**: Add a verification command and expected output after every step.

```markdown
## Step 1: Install

curl -sSf https://get.syncropic.com/spl | sh

**Verify installation:**

```bash
spl version
```

Expected output:
```
spl 0.8.x (build abc1234)
Python 3.12.x
Platform: linux-x86_64
```

If you see "command not found", the binary was not added to your PATH.
See [Troubleshooting: Binary not found](#binary-not-found).

---

## Step 2: Initialize

spl init

**Verify initialization:**

```bash
spl config show -j
```

Expected output:
```json
{
  "status": "ok",
  "data": {
    "registry_url": "https://api.syncropel.com",
    "current_namespace": "default",
    "trace_dir": "~/.syncro/traces",
    "api_key_configured": true
  }
}
```

If `api_key_configured` is `false` and you need test mode, re-run:
`spl init --key test`

---

## Step 3: Start Registry

spl serve

**Verify registry is running:**

```bash
curl -s http://localhost:9100/health | python3 -m json.tool
```

Expected output:
```json
{
  "status": "healthy",
  "calls": 0,
  "total_cost_usd": 0.0,
  "uptime_seconds": 5
}
```

If the health check fails, see [Troubleshooting: Registry won't start](#registry-wont-start).
```

---

## 4. High-Priority Improvements (P1)

### 4.1 Create a Troubleshooting Page

This is the single highest-impact addition after P0 fixes. Create a dedicated troubleshooting page linked from every other page's footer.

#### Structure

```markdown
# Troubleshooting

## Installation Issues

### Binary not found after install
**Symptom**: `spl: command not found` after running the install script
**Cause**: The binary was installed to a directory not in your PATH
**Fix**:
1. Find the binary: `find ~ -name spl -type f 2>/dev/null`
2. Add its directory to PATH: `export PATH="$HOME/.local/bin:$PATH"`
3. Make permanent: Add the export line to `~/.bashrc` or `~/.zshrc`
4. Verify: `spl version`

### Python version too old
**Symptom**: Error mentioning Python version, or `ModuleNotFoundError` for standard library modules
**Cause**: Syncropel requires Python 3.12+
**Fix**:
```bash
python3 --version  # Check current version
# Install Python 3.12+ for your OS (see Prerequisites)
```

### Install script fails on corporate network
**Symptom**: `curl: (7) Failed to connect` or SSL errors
**Cause**: Corporate proxy or firewall blocking get.syncropic.com
**Fix**:
1. Try with proxy: `https_proxy=http://your-proxy:8080 curl -sSf https://get.syncropic.com/spl | sh`
2. Manual download: See [Manual Installation](#manual-installation)

### Permission denied during install
**Symptom**: `Permission denied` writing to install directory
**Cause**: Install target requires elevated permissions
**Fix**: Do NOT use sudo with the curl pipe. Instead:
```bash
# Set a user-writable install prefix
SPL_INSTALL_DIR="$HOME/.local/bin" curl -sSf https://get.syncropic.com/spl | sh
```

---

## Init Issues

### API key not accepted
**Symptom**: `spl init` completes but API calls fail with 401
**Cause**: Invalid or expired Anthropic API key
**Fix**:
1. Check key format: Should start with `sk-ant-`
2. Verify key works directly: `curl -H "x-api-key: YOUR_KEY" https://api.anthropic.com/v1/messages -d '...'`
3. Re-run init: `spl init` (will prompt for key again)

### Init wizard hangs
**Symptom**: `spl init` appears frozen
**Cause**: Waiting for interactive input in a non-interactive environment (CI, piped shell, AI agent)
**Fix**: Use non-interactive mode: `spl init --yes --key YOUR_KEY`

---

## Registry Issues

### Port 9100 already in use
**Symptom**: `Address already in use` or `EADDRINUSE` error when starting `spl serve`
**Cause**: Another process (or previous spl instance) is using port 9100
**Fix**:
```bash
# Find what's using the port
lsof -i :9100
# Option A: Kill the existing process
kill <PID>
# Option B: Use a different port
spl serve --port 9200
# Remember to update SDK base_url to match the new port
```

### Registry starts but proxy returns 502
**Symptom**: Health check passes but LLM calls return 502 Bad Gateway
**Cause**: Registry cannot reach upstream API (api.anthropic.com)
**Fix**:
1. Check network: `curl -s https://api.anthropic.com/v1/messages -H "x-api-key: test" | head`
2. Check DNS: `nslookup api.anthropic.com`
3. If behind proxy: Set `HTTPS_PROXY` environment variable before starting `spl serve`

### Registry database locked
**Symptom**: `database is locked` errors in console output
**Cause**: Multiple `spl serve` instances writing to the same hub.db
**Fix**:
```bash
# Check for multiple instances
ps aux | grep "spl serve"
# Kill duplicates, keep one
spl serve --stop
spl serve
```

### Registry won't start — database corrupted
**Symptom**: DuckDB error on startup mentioning corruption or invalid page
**Cause**: Unclean shutdown or disk issue
**Fix**:
```bash
# Back up current database (may be partially recoverable)
cp ~/.syncro/hub.db ~/.syncro/hub.db.corrupted
# Remove and let spl recreate
rm ~/.syncro/hub.db
spl serve
# You will lose historical records but regain functionality
```

---

## Proxy Issues

### LLM calls not appearing in console
**Symptom**: You're making API calls but the dashboard at :9100/console shows nothing
**Cause**: SDK is not pointing to the proxy
**Fix**:
1. Verify your code sets `base_url="http://localhost:9100"` (not `http://localhost:9100/v1` for Anthropic SDK)
2. For OpenAI SDK, use `base_url="http://localhost:9100/v1"` (note the `/v1`)
3. Check the registry is running: `curl http://localhost:9100/health`
4. Check for HTTPS vs HTTP mismatch (proxy is HTTP only)

### Streaming responses are slow through proxy
**Symptom**: Noticeable latency compared to direct API calls
**Cause**: This should not happen — proxy forwards streaming chunks immediately
**Fix**:
1. Verify proxy is on localhost (not remote)
2. Check `spl serve` process CPU/memory: `top -p $(pgrep -f "spl serve")`
3. If database writes are slow: Check disk I/O with `iostat`

### Rate limited by proxy
**Symptom**: 429 responses from localhost:9100
**Cause**: Built-in rate limit of 120 requests/minute per IP
**Fix**: This limit protects the local database. If you need higher throughput for batch processing, this is a current limitation. Work around by adding small delays between requests.

---

## Hook / Integration Issues

### Claude Code hooks not firing
**Symptom**: `spl setup --all` completed but no traces appear in `~/.syncro/traces/`
**Cause**: Hooks may not be registered in settings.json, or tracer script has an error
**Fix**:
1. Check hook registration: `cat ~/.claude/settings.json | python3 -m json.tool`
2. Look for a `hooks` section with 4 entries (SessionStart, PostToolUse, Stop, SessionEnd)
3. Test tracer manually: `python3 ~/.syncro/hooks/syncropel_trace.py --help`
4. Check Claude Code hook logs (if available)
5. Reinstall: `spl setup --remove && spl setup --all`

### Skill file not loading in Claude Code
**Symptom**: Claude Code doesn't recognize `spl` commands or the managing-syncropel skill
**Cause**: Skill file not in the expected directory
**Fix**:
1. Check file exists: `ls ~/.claude/skills/managing-syncropel/SKILL.md`
2. If missing: `spl setup --claude-code`
3. Restart Claude Code session (skills are loaded at session start)
```

### 4.2 Document the Install Script

**Problem**: `curl -sSf https://get.syncropic.com/spl | sh` is a black box. Security-conscious users and enterprise environments will refuse to run it. AI agents cannot pre-verify system compatibility.

**Fix**: Add an "What the installer does" section, plus a manual install alternative.

```markdown
## What the Installer Does

The install script (`get.syncropic.com/spl`) performs these steps:

1. **Detects your platform**: `uname -s` (Linux/Darwin) and `uname -m` (x86_64/arm64/aarch64)
2. **Checks Python version**: Requires Python 3.12+; exits with error if not found
3. **Downloads the binary**: Fetches the appropriate platform-specific release from GitHub releases
4. **Installs to `~/.local/bin/spl`**: Creates the directory if needed
5. **Updates PATH**: Appends to `~/.bashrc` or `~/.zshrc` if `~/.local/bin` is not already in PATH
6. **Runs `spl version`**: Verifies the installation succeeded

### Supported Platforms

| OS | Architecture | Status |
|----|-------------|--------|
| Linux | x86_64 | Supported |
| Linux | arm64/aarch64 | Supported |
| macOS | arm64 (Apple Silicon) | Supported |
| macOS | x86_64 (Intel) | Supported |
| Windows | — | Not supported (use WSL2) |

### Manual Installation

If you cannot use the curl installer (corporate policy, air-gapped environment, etc.):

```bash
# 1. Download the release for your platform
#    Visit: https://github.com/syncropic/syncropel/releases/latest
#    Download: spl-<version>-<os>-<arch>.tar.gz

# 2. Extract and install
tar xzf spl-*.tar.gz
mkdir -p ~/.local/bin
mv spl ~/.local/bin/spl
chmod +x ~/.local/bin/spl

# 3. Ensure PATH includes ~/.local/bin
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 4. Verify
spl version
```

### Checksum Verification

```bash
# Download checksum file alongside the binary
curl -LO https://github.com/syncropic/syncropel/releases/latest/download/checksums.txt
sha256sum -c checksums.txt --ignore-missing
```
```

### 4.3 Make syncropel.com Crawlable and Agent-Discoverable

**Problem**: The main website renders as a Next.js JavaScript bundle. AI agents, web crawlers, search engines, and `curl` users see an empty page. This means:
- Google cannot index it properly
- AI agents sent to syncropel.com learn nothing
- Link previews in Slack/Discord/social media are empty
- The site fails the basic "curl test": `curl syncropel.com` returns framework boilerplate

**Fix** (in order of preference):

1. **Enable SSR/SSG for Next.js**: Ensure all pages use `getStaticProps` or `getServerSideProps` so content renders in the initial HTML payload. This is the correct architectural fix.

2. **Add meta tags with substantive content**: Even if the body is client-rendered, ensure `<meta name="description">`, `<title>`, and Open Graph tags contain real information. Currently only the title and description meta tags exist — add more.

3. **Add a `<noscript>` fallback**: For agents and crawlers that don't execute JavaScript:
```html
<noscript>
  <h1>Syncropel — Infrastructure that learns</h1>
  <p>The coordination layer for teams and AI agents.</p>
  <p>Get started: <a href="https://docs.syncropel.com">Documentation</a></p>
  <p>Install: curl -sSf https://get.syncropic.com/spl | sh</p>
</noscript>
```

4. **Add a prominent link to docs.syncropel.com**: Currently, the main site has no visible link to the documentation site. This is the single most important cross-link for discoverability.

5. **Add `sitemap.xml` to both sites**: Enables systematic crawling.

```xml
<!-- syncropel.com/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://syncropel.com/</loc></url>
  <url><loc>https://docs.syncropel.com/</loc></url>
  <url><loc>https://docs.syncropel.com/docs/tutorials/quickstart</loc></url>
  <url><loc>https://docs.syncropel.com/docs/reference/cli</loc></url>
  <url><loc>https://docs.syncropel.com/docs/guides/agent-integration</loc></url>
  <url><loc>https://docs.syncropel.com/docs/guides/proxy</loc></url>
  <url><loc>https://docs.syncropel.com/docs/guides/console</loc></url>
  <url><loc>https://docs.syncropel.com/docs/guides/local-registry</loc></url>
  <url><loc>https://docs.syncropel.com/docs/reference/integrations</loc></url>
</urlset>
```

### 4.4 Align Skill File with Documentation

**Problem**: The Claude Code skill file (`SKILL.md`) references concepts that appear nowhere in the documentation, creating confusion for agents that read both.

| Skill File Says | Docs Say | Issue |
|----------------|----------|-------|
| "Start the registry first: `spl serve`" | Quickstart says `spl init` first | Wrong order |
| "5-level hierarchy: DEFAULT > ORG > PROJECT > ENV > JOB" | Not explained anywhere | Undefined concept |
| "L0 hashes NEVER leave the local namespace (F8)" | "F8" not defined | Undefined reference |
| "4 primitives only: GET, PUT, CALL, MAP (F1)" | "F1" not defined | Undefined reference |
| "Set SPL_ACTOR=claude-agent" | Agent Integration mentions this | OK, but should explain why |

**Fix**:

Option A (Recommended): **Make the skill file self-contained**. If the skill file references a concept, it should explain it in 1-2 sentences. Agents reading the skill file should not need to cross-reference docs for basic understanding.

Option B: **Add a Governance Model / Concepts page to docs** that defines:
- The F1-F10 axioms (or whatever "F-numbers" refer to)
- The 5-level namespace hierarchy with examples
- Hash levels (L0, L1, etc.) and their privacy semantics
- The 4 primitives and what they map to

Example improved skill file excerpt:
```markdown
## Quick Reference

### Startup Sequence
1. `spl init` — first-time setup (creates ~/.syncro/, configures API key)
2. `spl serve` — starts local registry on port 9100
3. Verify: `curl -s http://localhost:9100/health`

### Core Concepts
- **4 Primitives**: GET (read), PUT (write), CALL (execute), MAP (transform) — every agent action maps to one of these
- **Namespace Hierarchy**: DEFAULT > ORG > PROJECT > ENV > JOB — policies inherit downward, more specific levels override
- **Hash Levels**: L0 (raw content hash, stays local), L1 (anonymized, can be shared), L2 (aggregate, publishable)
- **Trust**: Computed from observed behavior — more successful actions = higher trust = more autonomy

### Required Environment
- `SPL_ACTOR=claude-agent` — identifies this agent in audit logs
- `-j` flag on every command — ensures JSON output for parsing
```

---

## 5. Medium-Priority Improvements (P2)

### 5.1 Document Test Mode

**Problem**: `spl init --key test` is mentioned as an alternative but never explained. Users don't know what it enables or limits.

**Fix**: Add to quickstart and CLI reference:

```markdown
### Test Mode

If you don't have an API key yet, use test mode:

```bash
spl init --key test
```

**What test mode does:**
- Starts the registry and console normally
- Proxy accepts requests but returns mock responses (not real LLM calls)
- All recording, tracing, and dashboard features work with mock data
- Cost tracking shows estimated costs for what real calls would cost

**What test mode does NOT do:**
- Does not make real API calls to Anthropic or OpenAI
- Does not validate that a real API key would work
- Mock responses are short placeholder texts, not useful for real development

**Upgrading from test mode:**
```bash
spl init  # Re-run init wizard, provide real API key when prompted
spl serve --stop && spl serve  # Restart to pick up new key
```
```

### 5.2 Add Uninstall Documentation

```markdown
## Uninstalling Syncropel

### Remove CLI Binary
```bash
rm ~/.local/bin/spl
```

### Remove Configuration and Data
```bash
# WARNING: This deletes all traces, records, and configuration
rm -rf ~/.syncro/
```

### Remove Claude Code Integrations
```bash
# If spl is still installed:
spl setup --remove

# If spl is already removed, manually:
rm -rf ~/.claude/skills/managing-syncropel/
# Then edit ~/.claude/settings.json and remove the "hooks" entries for syncropel
```

### Remove Project Files
```bash
rm -rf .syncro/  # In each project directory that has it
```

### Clean Up PATH
Remove the `export PATH="$HOME/.local/bin:$PATH"` line from `~/.bashrc` or `~/.zshrc` if no other tools use that directory.
```

### 5.3 Add a "First Traced Call" End-to-End Example

The quickstart shows the SDK configuration but doesn't walk through making a call and seeing it in the dashboard. Add a complete end-to-end verification:

```markdown
## Your First Traced Call

After completing the quickstart, verify everything works end-to-end:

### 1. Make a traced API call

```bash
# Using curl directly (no SDK needed):
curl -s http://localhost:9100/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-haiku-4-5",
    "max_tokens": 50,
    "messages": [{"role": "user", "content": "Say hello in exactly 5 words."}]
  }'
```

### 2. Verify it was recorded

```bash
curl -s http://localhost:9100/health
```

Expected: `"calls": 1` (was 0 before)

### 3. View in dashboard

Open http://localhost:9100/console in your browser.
You should see one record showing:
- Model: claude-haiku-4-5
- Token count: ~15 input, ~15 output
- Cost: ~$0.0001
- Latency: varies

### 4. View via CLI

```bash
spl trace ls -j
```

If all four steps show expected output, your Syncropel installation is fully working.
```

### 5.4 SDK-Specific Base URL Documentation

**Problem**: Different SDKs need slightly different `base_url` values (with or without `/v1`). This is a very common source of errors.

```markdown
## SDK Configuration Reference

| SDK | base_url Value | Example |
|-----|---------------|---------|
| Anthropic Python | `http://localhost:9100` | `anthropic.Client(base_url="http://localhost:9100")` |
| Anthropic TypeScript | `http://localhost:9100` | `new Anthropic({ baseURL: "http://localhost:9100" })` |
| OpenAI Python | `http://localhost:9100/v1` | `OpenAI(base_url="http://localhost:9100/v1")` |
| OpenAI TypeScript | `http://localhost:9100/v1` | `new OpenAI({ baseURL: "http://localhost:9100/v1" })` |
| LangChain (Anthropic) | Set env var | `ANTHROPIC_BASE_URL=http://localhost:9100` |
| LangChain (OpenAI) | Set env var | `OPENAI_BASE_URL=http://localhost:9100/v1` |
| Raw HTTP | Depends on API | `POST http://localhost:9100/v1/messages` (Anthropic) |
| Raw HTTP | Depends on API | `POST http://localhost:9100/v1/chat/completions` (OpenAI) |

**Common mistake**: Using `http://localhost:9100/v1` with the Anthropic SDK (it already appends `/v1`). This results in `http://localhost:9100/v1/v1/messages` — a 404 error.

**Common mistake**: Using `http://localhost:9100` (without `/v1`) with the OpenAI SDK. This results in `http://localhost:9100/chat/completions` — a 404 error.

**Custom port**: If you started with `spl serve --port 8080`, replace `9100` with `8080` in all examples above.
```

### 5.5 Add Version Compatibility Matrix

```markdown
## Version Compatibility

| spl Version | Python | Platforms | Claude Code | Status |
|-------------|--------|-----------|-------------|--------|
| 0.8.x | 3.12+ | Linux x86_64, arm64; macOS arm64, x86_64 | 1.x+ | Current |
| 0.7.x | 3.11+ | Linux x86_64; macOS arm64 | 1.x+ | Deprecated |

Check your version: `spl version --json`
```

---

## 6. Failure Mode Catalog & Recovery Guidance

This section catalogs every failure mode we can predict, its symptoms, root causes, and recovery steps. This should become the backbone of the troubleshooting page.

### 6.1 Installation Phase Failures

| # | Failure Mode | Symptom | Root Cause | Recovery |
|---|-------------|---------|------------|----------|
| I1 | curl fails to fetch installer | `curl: (6) Could not resolve host` | DNS failure, no internet, proxy blocking | Check network; try `curl -v https://get.syncropic.com/spl` for details |
| I2 | Installer script errors | Shell error during `sh` execution | Unsupported OS, missing tools | Check `uname -sm`; try manual install |
| I3 | Python version too old | Error mentioning version or import failures | System Python < 3.12 | Install Python 3.12+ (see Prerequisites) |
| I4 | Permission denied writing binary | `Permission denied: ~/.local/bin/spl` | Directory permissions or disk full | `mkdir -p ~/.local/bin && chmod 755 ~/.local/bin`; check `df -h` |
| I5 | Binary not in PATH | `spl: command not found` | PATH not updated | `export PATH="$HOME/.local/bin:$PATH"` and add to shell profile |
| I6 | Wrong architecture binary | Exec format error or segfault | Installer detected wrong arch | Manual install with correct platform binary |
| I7 | Antivirus blocks binary | Binary deleted or quarantined after install | Enterprise antivirus flagging unknown binary | Whitelist `~/.local/bin/spl`; contact IT |
| I8 | WSL2-specific: filesystem mismatch | Slow startup or path errors | Binary on Windows FS accessed from WSL | Ensure `~/.local/bin` is on the Linux filesystem, not `/mnt/c/` |

### 6.2 Init Phase Failures

| # | Failure Mode | Symptom | Root Cause | Recovery |
|---|-------------|---------|------------|----------|
| N1 | Init hangs waiting for input | Process appears frozen | Running in non-interactive context (CI, agent, pipe) | Use `spl init --yes --key <key>` |
| N2 | API key rejected | Init completes but later calls fail 401 | Typo in key, wrong key type, expired key | `spl init` again with correct key |
| N3 | Config directory not writable | Permission error creating `~/.syncro/` | Home directory permissions or disk full | `mkdir -p ~/.syncro && chmod 700 ~/.syncro` |
| N4 | Editor detection fails | Init wizard crashes during editor detection | Non-standard system without common editors | Skip with `spl init --yes` |
| N5 | Existing config conflict | Unexpected behavior after init | Previous install left config files | `rm ~/.syncro/config.yaml && spl init` |

### 6.3 Serve Phase Failures

| # | Failure Mode | Symptom | Root Cause | Recovery |
|---|-------------|---------|------------|----------|
| S1 | Port conflict | `Address already in use` | Another process on 9100 | `lsof -i :9100`; kill or use `--port` |
| S2 | Database locked | `database is locked` | Multiple spl serve instances | `spl serve --stop` then restart |
| S3 | Database corrupted | DuckDB error on startup | Unclean shutdown | Backup and remove `hub.db`; restart |
| S4 | Upstream unreachable | 502 on proxy calls | No internet / DNS / firewall | Check `curl https://api.anthropic.com`; check proxy settings |
| S5 | Auth token missing | 403 on console / API endpoints | secrets/daemon_token missing | `spl serve --stop && rm ~/.syncro/secrets/daemon_token && spl serve` (regenerates) |
| S6 | Serve exits immediately | Process returns to shell instantly | Check logs for error message | Run `spl serve` in foreground (not `&`) and read output |
| S7 | High memory usage | System slowdown during long runs | Large database with many records | Restart `spl serve`; consider archiving old records |

### 6.4 Proxy Phase Failures

| # | Failure Mode | Symptom | Root Cause | Recovery |
|---|-------------|---------|------------|----------|
| P1 | Double /v1 in URL | 404 from proxy | Anthropic SDK + base_url ending in /v1 | Remove `/v1` from base_url for Anthropic SDK |
| P2 | Missing /v1 in URL | 404 from proxy | OpenAI SDK + base_url without /v1 | Add `/v1` to base_url for OpenAI SDK |
| P3 | HTTPS vs HTTP | Connection refused or SSL error | SDK defaults to HTTPS but proxy is HTTP | Ensure `http://` (not `https://`) in base_url |
| P4 | Rate limited | 429 responses | >120 req/min | Add delays; or accept the limit for local use |
| P5 | Calls not appearing in console | Dashboard empty despite making calls | SDK not configured to use proxy | Verify base_url in code; check proxy health |
| P6 | Wrong model name | 400 or model not found | Model name doesn't match upstream API | Check exact model names: `claude-sonnet-4-6`, not `claude-3-sonnet` etc. |

### 6.5 Integration Phase Failures

| # | Failure Mode | Symptom | Root Cause | Recovery |
|---|-------------|---------|------------|----------|
| H1 | Hooks not firing | No traces generated | settings.json not updated | `spl setup --remove && spl setup --all` |
| H2 | Tracer script error | Hook timeout or error in Claude Code | Python error in syncropel_trace.py | Check `python3 ~/.syncro/hooks/syncropel_trace.py --help`; check Python version |
| H3 | Skill file not recognized | Claude Code doesn't see spl skill | File in wrong directory or session not restarted | Verify path; restart Claude Code |
| H4 | Settings.json overwritten | Hooks disappear after Claude Code update | Claude Code regenerated settings.json | Re-run `spl setup --hooks` |
| H5 | Hooks slow down Claude Code | Noticeable delay on every tool call | Tracer doing too much work per call | Check disk I/O; ensure traces/ is on fast storage |

---

## 7. AI Agent Ergonomics

These recommendations specifically address how AI agents (Claude Code, LangChain agents, custom agents) interact with Syncropel.

### 7.1 Non-Interactive Mode for Every Command

**Principle**: AI agents cannot respond to interactive prompts (stdin). Every command must have a fully non-interactive path.

**Audit checklist**:
- [x] `spl init --yes --key <key>` — non-interactive init exists
- [ ] `spl serve` — does it ever prompt? What if config is missing?
- [ ] `spl namespace create` — does it confirm before creating?
- [ ] `spl setup --all` — does it prompt before overwriting existing files?
- [ ] Any command that modifies state — does it require `--yes` or `-y` for confirmation?

**Recommendation**: Add `--yes` / `-y` flag to any command that currently prompts for confirmation. Document which commands may prompt and how to suppress prompts.

### 7.2 Machine-Readable Error Messages

**Principle**: AI agents cannot interpret human-friendly error prose reliably. Errors should be structured.

**Current state**: JSON errors include `status`, `error`, and `exit_code` — this is good.

**Recommendation**: Ensure every error also includes:
```json
{
  "status": "error",
  "error": "Port 9100 is already in use",
  "exit_code": 1,
  "error_code": "PORT_IN_USE",
  "hint": "Try: spl serve --port 9200",
  "docs_url": "https://docs.syncropel.com/docs/troubleshooting#port-conflict"
}
```

The `error_code` field is critical for agents — they can match on a finite set of codes and take appropriate action. The `hint` field gives agents a concrete next step. The `docs_url` lets agents fetch detailed recovery instructions.

### 7.3 Idempotent Operations

**Principle**: Agents may retry commands. Every command should be safe to run multiple times.

**Audit checklist**:
- `spl init` — what happens if run twice? Does it overwrite? Skip? Error?
- `spl serve` — what happens if already running?
- `spl setup --all` — what happens if already installed?
- `spl namespace create X` — what happens if X exists?

**Recommendation**: Document idempotency behavior for every state-changing command. Use this pattern:
```markdown
### spl init
- **First run**: Creates config directory and files
- **Subsequent runs**: Prompts to overwrite (use `--force` to skip prompt)
- **Idempotent**: No, will error or prompt. Use `spl init --yes --force` for safe re-runs.
```

### 7.4 Health Check Endpoint as Single Source of Truth

**Principle**: Agents need one canonical way to check "is everything working."

**Recommendation**: Enhance the `/health` endpoint to include:
```json
{
  "status": "healthy",
  "version": "0.8.1",
  "python_version": "3.12.3",
  "port": 9100,
  "database": "ok",
  "uptime_seconds": 3600,
  "calls": 142,
  "total_cost_usd": 0.47,
  "proxy": {
    "anthropic": "reachable",
    "openai": "reachable"
  },
  "config": {
    "api_key_configured": true,
    "namespace": "default",
    "trace_dir": "~/.syncro/traces"
  }
}
```

This lets an agent verify the entire system state with one call. Document this as "the canonical health check."

### 7.5 Progressive Discovery Documentation

The `spl help-agent` system is already excellent. Enhance it by:

1. **Documenting the exact JSON schema** returned by each tier. Agents need to know what fields to expect.

2. **Adding a Tier -1**: A single-line check for "is spl installed and what version":
   ```bash
   spl version --json
   # {"version": "0.8.1", "python": "3.12.3", "platform": "linux-x86_64"}
   ```

3. **Adding a Tier 3**: Full OpenAPI spec for the registry HTTP endpoints, fetchable via:
   ```bash
   spl help-agent --openapi -j
   # Returns OpenAPI 3.0 JSON for all registry endpoints
   ```

### 7.6 Agent Onboarding Runbook

Create a dedicated page: **"Onboarding an AI Agent"** — a step-by-step script an agent can execute verbatim:

```markdown
# AI Agent Onboarding Runbook

This is a deterministic sequence an AI agent can follow to set up Syncropel.
Every step includes a verification check and failure recovery.

## Pre-flight

```bash
# Step 0: Check prerequisites
python3 -c "import sys; v=sys.version_info; exit(0 if v >= (3,12) else 1)" && echo "OK: Python" || echo "FAIL: Need Python 3.12+"
command -v curl >/dev/null && echo "OK: curl" || echo "FAIL: Need curl"
```

## Install

```bash
# Step 1: Install spl
curl -sSf https://get.syncropic.com/spl | sh

# Step 1v: Verify
spl version --json
# Expected: {"version": "0.8.x", ...}
# If "command not found": export PATH="$HOME/.local/bin:$PATH"
```

## Configure

```bash
# Step 2: Initialize (non-interactive)
spl init --yes --key "${ANTHROPIC_API_KEY:-test}"

# Step 2v: Verify
spl config validate -j
# Expected: {"status": "ok", ...}
```

## Start

```bash
# Step 3: Start registry
spl serve &
sleep 2

# Step 3v: Verify
curl -sf http://localhost:9100/health | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('status')=='healthy' else 1)" && echo "OK: Registry" || echo "FAIL: Registry not healthy"
```

## Integrate

```bash
# Step 4: Install Claude Code integration
spl setup --all

# Step 4v: Verify
spl setup --list
# Expected: skill, hooks, config all showing "installed"
```

## Done

```bash
# Step 5: Set agent identity
export SPL_ACTOR=claude-agent

# Final verification
spl stats -j
# Expected: {"status": "ok", ...}
```
```

---

## 8. Human Developer Ergonomics

### 8.1 Add a "Why Syncropel" Section

The current homepage says "Infrastructure that learns, governs & coordinates" — this is abstract. Developers need to know why they should spend 60 seconds installing this.

```markdown
## Why Syncropel?

**Without Syncropel:**
- You have no idea how much you're spending on LLM API calls
- You can't see what prompts are being sent to what models
- When an AI agent does something wrong, you have no audit trail
- Different team members use different models with no coordination

**With Syncropel (2 minutes of setup):**
- Real-time dashboard showing every LLM call, its cost, and latency
- Complete audit trail of what every agent and human did
- Works with any SDK (Anthropic, OpenAI, LangChain) — change one line of code
- Everything stays local — your data never leaves your machine
```

### 8.2 Add Visual Architecture Diagram

Text description of architecture is good; a diagram would make it instantly graspable:

```
                        ┌──────────────────────────────┐
                        │   docs.syncropel.com         │
                        │   Architecture Diagram        │
                        └──────────────────────────────┘

  Your Code / Agent                 Syncropel                    LLM APIs
  ┌─────────────┐    ┌─────────────────────────────┐    ┌──────────────┐
  │             │    │  localhost:9100               │    │              │
  │  Anthropic  │───>│  ┌─────────┐  ┌──────────┐  │───>│  Anthropic   │
  │  SDK        │    │  │  Proxy   │  │  Console  │  │    │  API         │
  │             │<───│  │ (record) │  │  :9100/   │  │<───│              │
  │  OpenAI     │    │  │         │  │  console   │  │    │  OpenAI      │
  │  SDK        │    │  └────┬────┘  └──────────┘  │    │  API         │
  │             │    │       │                      │    │              │
  │  LangChain  │    │  ┌────▼────┐  ┌──────────┐  │    └──────────────┘
  │             │    │  │ DuckDB  │  │  Traces   │  │
  └─────────────┘    │  │ hub.db  │  │  .jsonl   │  │
                     │  └─────────┘  └──────────┘  │
                     └─────────────────────────────┘
                              All local. Nothing leaves your machine.
```

### 8.3 Add Guided Next Steps Based on Use Case

After quickstart, users don't know which page to read next. Add a "What do you want to do?" section:

```markdown
## What Next?

| I want to... | Read this |
|--------------|-----------|
| See what my LLM calls are costing me | [Console Guide](/docs/guides/console) |
| Proxy calls from my Python/TypeScript app | [API Proxy Guide](/docs/guides/proxy) |
| Set up governance and namespaces for my team | [CLI Reference: Namespaces](/docs/reference/cli#namespace) |
| Integrate with Claude Code / VS Code / Cursor | [Agent Integration](/docs/guides/agent-integration) |
| Understand the full CLI command set | [CLI Reference](/docs/reference/cli) |
| Understand what data is stored and where | [Local Registry](/docs/guides/local-registry) |
```

---

## 9. Structural & Information Architecture

### 9.1 Recommended Page Hierarchy

```
docs.syncropel.com/
├── /                              # Landing/overview (current: good)
├── /docs/tutorials/
│   ├── quickstart                 # Current: exists, needs P0 fixes
│   ├── first-traced-call          # NEW: end-to-end verification walkthrough
│   └── agent-onboarding-runbook   # NEW: deterministic agent setup script
├── /docs/guides/
│   ├── proxy                      # Current: exists, good
│   ├── console                    # Current: exists, good
│   ├── local-registry             # Current: exists, good
│   ├── agent-integration          # Current: exists, good
│   └── governance-model           # NEW: F1-F8 axioms, primitives, trust, namespaces
├── /docs/reference/
│   ├── cli                        # Current: exists, comprehensive
│   ├── integrations               # Current: exists, good
│   ├── file-layout                # NEW: canonical path reference
│   ├── error-codes                # NEW: every exit code and error_code
│   └── environment-variables      # NEW: dedicated env var reference
├── /docs/troubleshooting          # NEW: the failure mode catalog
└── /docs/changelog                # NEW: version history
```

### 9.2 Cross-Linking Strategy

Every page should have:
1. **Prerequisites link** at the top (if applicable)
2. **Next steps** at the bottom (2-3 contextual links)
3. **Troubleshooting link** in a callout whenever a command is shown
4. **Breadcrumbs** showing where the page sits in the hierarchy

### 9.3 Consistent Page Template

Every guide/tutorial page should follow this template:

```markdown
# Page Title

> One-sentence summary of what this page covers.

## Prerequisites
- [Quickstart completed](/docs/tutorials/quickstart)
- Registry running (`curl -sf http://localhost:9100/health`)

## Content sections...

## Verify It Works
(Concrete verification step with expected output)

## Troubleshooting
- [Common issues with <topic>](/docs/troubleshooting#section)

## Next Steps
- [Related Guide A](/docs/guides/a) — one-sentence description
- [Related Guide B](/docs/guides/b) — one-sentence description
```

---

## 10. Skill File & Integration Alignment

### 10.1 Skill File Content Recommendations

The skill file at `~/.claude/skills/managing-syncropel/SKILL.md` is what Claude Code reads to learn about `spl`. It should be:

1. **Self-contained**: Every concept it references should be explained in the file itself
2. **Accurate**: Commands and sequences must match the actual CLI behavior
3. **Minimal but complete**: Token budget matters — every line should earn its place
4. **Version-pinned**: Include the spl version this skill file was written for

Recommended structure:

```markdown
# Managing Syncropel (spl)

**Version**: 0.8.x | **Docs**: https://docs.syncropel.com

## Setup Sequence
1. `spl init --yes` — creates ~/.syncro/, configures API key
2. `spl serve` — starts local registry on localhost:9100
3. Verify: `curl -sf http://localhost:9100/health`

## Rules
- Always use `-j` flag for structured JSON output
- Set `SPL_ACTOR=claude-agent` to identify in audit logs
- Check `spl help-agent -j` for command discovery (~200 tokens)
- Check `spl help-agent <group> -j` for group details (~400 tokens)

## Core Concepts
- **4 Primitives**: GET (read), PUT (write), CALL (execute), MAP (transform)
- **Namespace Hierarchy**: DEFAULT > ORG > PROJECT > ENV > JOB (policies inherit downward)
- **Trust**: Computed from observations; higher trust = more autonomy
- **Traces**: Tool calls mapped to effects: Read→GET, Edit→PUT, Bash→CALL

## Key Commands
- `spl namespace ls -j` — list namespaces
- `spl trace ls -j` — list session traces
- `spl stats -j` — registry statistics
- `spl audit query -j` — query audit trail

## Error Handling
- Exit 0: success | 3: not found | 4: validation | 5: connection | 6: auth
- If registry unreachable: `spl serve --status` then `spl serve` if needed
```

### 10.2 Hook Configuration Resilience

Document what happens when hooks encounter errors:

```markdown
## Hook Error Behavior

| Scenario | Behavior | Impact |
|----------|----------|--------|
| Tracer script crashes | Hook returns non-zero; Claude Code may show warning | Agent continues normally; trace is lost for that call |
| Tracer script hangs | Hook times out after 10s | Agent experiences 10s delay; trace is lost |
| Trace directory not writable | Tracer logs error to stderr | Agent continues; no traces saved |
| Registry is down | Tracer writes local traces only | Traces saved locally; can be uploaded later |

**Design principle**: Hook failures never block the agent. Observability is best-effort.
```

---

## 11. Website & SEO / Discoverability

### 11.1 syncropel.com Fixes

| Issue | Fix | Priority |
|-------|-----|----------|
| Page is empty for non-JS clients | Enable Next.js SSR/SSG | High |
| No link to docs.syncropel.com | Add prominent "Documentation" link in nav and hero | High |
| No sitemap.xml | Generate and serve sitemap.xml | Medium |
| No robots.txt | Add robots.txt allowing crawling | Medium |
| No structured data | Add JSON-LD schema markup (SoftwareApplication type) | Low |
| Empty OpenGraph / social previews | Add og:title, og:description, og:image meta tags | Medium |

### 11.2 docs.syncropel.com Fixes

| Issue | Fix | Priority |
|-------|-----|----------|
| Sub-page URLs are deep and not guessable | Add URL redirects from simple paths (e.g., /quickstart → /docs/tutorials/quickstart) | Medium |
| No sitemap.xml | Generate from page list | Medium |
| No search functionality | Add docs search (Algolia DocSearch, Pagefind, or similar) | Medium |
| No version selector | If multiple spl versions will coexist, add version toggle | Low |
| No "Edit this page" links | Link to GitHub source for each page; enables community contributions | Low |

### 11.3 `get.syncropic.com/spl` Improvements

The install script endpoint should:

1. Return the script with a `Content-Type: text/plain` header (not HTML)
2. Support `?info` query parameter that returns system requirements without installing:
   ```bash
   curl -sSf "https://get.syncropic.com/spl?info"
   # Supported platforms: linux-x86_64, linux-arm64, darwin-arm64, darwin-x86_64
   # Requires: Python 3.12+, curl
   # Installs to: ~/.local/bin/spl
   # Version: 0.8.1
   ```
3. Support `?dry-run` to show what would happen without making changes
4. Include clear error messages when platform is unsupported

---

## 12. Testing the Documentation

### 12.1 Automated Documentation Testing

Create a CI pipeline that validates the docs are correct:

```bash
#!/bin/bash
# docs-test.sh — Run on every docs PR

# Test 1: All code blocks are syntactically valid
find docs/ -name "*.md" -exec grep -l '```bash' {} \; | while read f; do
    # Extract bash code blocks and check syntax
    # ...
done

# Test 2: All internal links resolve
find docs/ -name "*.md" -exec grep -oP '\]\((/[^)]+)\)' {} \; | while read link; do
    # Verify file exists at link target
    # ...
done

# Test 3: All CLI commands mentioned in docs actually exist
grep -rohP 'spl [a-z-]+' docs/ | sort -u | while read cmd; do
    spl help "$cmd" >/dev/null 2>&1 || echo "BROKEN: $cmd not a valid spl command"
done

# Test 4: Expected outputs in docs match actual outputs
# (Run in a clean Docker container)
```

### 12.2 Manual Testing Protocol

Before any docs release, run through these scenarios on a clean system:

```markdown
### Clean Install Test (Linux x86_64)
- [ ] Fresh Ubuntu 24.04 container with Python 3.12
- [ ] Follow quickstart verbatim — copy-paste every command
- [ ] Every verification step produces expected output
- [ ] Make a traced API call; verify it appears in console
- [ ] Time the entire process (target: under 2 minutes)

### Clean Install Test (macOS arm64)
- [ ] Fresh macOS with Python 3.12 via Homebrew
- [ ] Same as above

### Failure Recovery Test
- [ ] Start with Python 3.10 — verify error message is clear
- [ ] Start with port 9100 occupied — verify error message is clear
- [ ] Run spl init without network — verify error message is clear
- [ ] Corrupt hub.db — verify recovery steps work

### AI Agent Test
- [ ] Give Claude Code the quickstart URL and ask it to install spl
- [ ] Observe where it gets stuck or confused
- [ ] Document every point of friction
```

### 12.3 The "Drunk Test"

A good documentation test: can someone following the instructions at 2 AM with no prior context, copying and pasting every command exactly as written, successfully complete the flow? If any step requires inference, interpretation, or prior knowledge not provided on the page, the docs have a gap.

For AI agents, the equivalent is: can an agent with zero prior knowledge of Syncropel, given only the documentation content, execute every step programmatically and verify success? If any step requires guessing, interactive input, or human interpretation, the docs have a gap.

---

## 13. Templates & Patterns to Adopt

### 13.1 Command Documentation Template

Every CLI command in the reference should follow this structure:

```markdown
### command-name — Short description

Brief explanation of what this command does and when to use it.

**Usage:**
```bash
spl command-name [flags] [arguments]
```

**Flags:**
| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `-j` / `--json` | bool | false | Output as JSON |
| `--flag-name` | string | `"default"` | What this flag does |

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `name` | Yes | The namespace name |

**Examples:**
```bash
# Basic usage
spl command-name my-arg -j

# With optional flag
spl command-name my-arg --flag-name value -j
```

**Expected output:**
```json
{"status": "ok", "data": { ... }}
```

**Error cases:**
| Scenario | Exit Code | Error Code | Message |
|----------|-----------|------------|---------|
| Arg missing | 4 | VALIDATION_ERROR | "name is required" |
| Not found | 3 | NOT_FOUND | "namespace 'X' not found" |

**Idempotency:** Yes / No — what happens if run twice

**See also:** [Related Command](#related), [Guide](#guide)
```

### 13.2 Admonition Patterns

Use consistent callout boxes throughout docs:

```markdown
> **Note**: Additional context that's helpful but not critical.

> **Important**: Information that affects whether the command succeeds.

> **Warning**: Destructive action or common mistake ahead.

> **For AI Agents**: Specific guidance for programmatic use (non-interactive flags, JSON output, etc.)
```

### 13.3 "Expected Output" Pattern

Every command shown in docs should include expected output:

```markdown
```bash
spl namespace ls -j
```

**Expected output:**
```json
{
  "status": "ok",
  "data": [
    {"id": "default", "level": "DEFAULT", "parent": null}
  ]
}
```

If you see `{"status": "error", "exit_code": 5}`, the registry is not running.
Run `spl serve` first.
```

This is especially critical for AI agents, which compare actual vs expected output to determine success.

---

## 14. Appendix: Page-by-Page Audit Notes

### 14.1 Homepage (docs.syncropel.com)

**Current state**: Good overview, clean layout, 6-card grid linking to sections.

**Issues**:
- "Coming Next" section is vague — "Trust computed from evidence" without timeline or status
- No "Why Syncropel" value proposition
- Quick Start code block doesn't show expected output after each command
- Footer says "Delaware Public Benefit Corporation" — interesting but not relevant to docs landing page

**Fixes**:
- Add 3-bullet value prop above the quickstart
- Add expected output snippets to quickstart commands
- Move "Coming Next" to a roadmap page; replace with "What can you do with Syncropel?" section
- Add link to troubleshooting page

### 14.2 Quick Start (/docs/tutorials/quickstart)

**Current state**: Clean 5-step flow. 60-second framing is good.

**Issues**:
- No prerequisites section (CRITICAL — P0)
- No verification steps (CRITICAL — P0)
- SDK config example only shows Anthropic Python — should show all supported SDKs
- `spl init --key test` mentioned without explaining what test mode does
- "How It Functions" section is good but should mention the sidecar model explicitly
- No link to troubleshooting

**Fixes**: See P0 section above for prerequisites and verification. Add SDK table (see Section 5.4). Add test mode explanation (see Section 5.1). Add troubleshooting link.

### 14.3 API Proxy (/docs/guides/proxy)

**Current state**: Good coverage of endpoints, cost tracking, security features.

**Issues**:
- Missing a clear "how to configure your SDK" section (separate from quickstart)
- The `/v1` path confusion (Anthropic vs OpenAI) is not addressed
- Rate limit (120 req/min) is mentioned but not how to handle it programmatically
- No mention of what happens when upstream API returns errors (does proxy pass them through?)
- Streaming section says proxy "never buffers" but doesn't explain how recording works with streaming

**Fixes**: Add SDK configuration table. Add error passthrough documentation. Add a note about how streaming responses are recorded (partial assembly? post-hoc?).

### 14.4 Console (/docs/guides/console)

**Current state**: Good feature overview with record types and filtering.

**Issues**:
- No screenshots or visual examples (this is a visual tool — needs visuals)
- Record type indicators (○ ◑ ◕ ●) are explained but their mapping to INTEND/DO/KNOW/LEARN is abstract
- Saved Views feature mentioned but not how to create one
- No mention of browser compatibility requirements
- No mention of whether console works on mobile/tablet

**Fixes**: Add screenshots. Add step-by-step for creating a saved view. Add browser requirements.

### 14.5 Local Registry (/docs/guides/local-registry)

**Current state**: Good technical depth. 160+ endpoints mentioned. DuckDB details helpful.

**Issues**:
- "160+ HTTP endpoints" is mentioned but none are listed beyond the main 5
- No mention of endpoint documentation (OpenAPI spec? Swagger?)
- Auth token is auto-generated but not explained how to find/use it
- Backup instructions mention `cp` but not how to restore
- No log file locations documented
- No resource usage guidance (how much RAM/disk does it use over time?)

**Fixes**: Add endpoint listing or link to generated API docs. Document auth token usage. Add restore-from-backup steps. Add log file locations. Add resource usage guidance.

### 14.6 Agent Integration (/docs/guides/agent-integration)

**Current state**: This is the strongest page. Progressive discovery, hook architecture, project discovery files — all well-documented.

**Issues**:
- VS Code, Zed, and Cursor are mentioned in the integration status page as "Preview" but this guide only covers Claude Code
- The 4 hook events table is good but doesn't explain what happens if a hook fails
- Tracer script is "1,107 lines" — that's a red flag for maintainability; should have a stability/versioning story
- `spl setup --all` doesn't explain what it overwrites if files already exist
- No guidance on updating integrations when spl is updated

**Fixes**: Add hook error behavior table (see Section 10.2). Document idempotency of `spl setup`. Add update/upgrade guidance. Add placeholders for VS Code/Zed/Cursor with "coming soon" and expected timelines.

### 14.7 CLI Reference (/docs/reference/cli)

**Current state**: Comprehensive. Every command group is listed with subcommands and flags.

**Issues**:
- `SPL_HOME` default says `~/.syncropel` but everywhere else says `~/.syncro` (P0 inconsistency)
- No expected output examples for any command
- `spl run "goal"` is listed but never explained — what does it do? Is it stable?
- `spl dashboard` is listed but relationship to `:9100/console` is unclear — are they the same thing?
- Record shortcuts (`spl intend`, `spl do`, `spl know`, `spl learn`) are listed without explaining the record types
- `spl help-agent` tiers are documented but the actual JSON schema of responses is not shown
- No deprecation notices for any commands (are any deprecated?)
- `--conventions` flag for `help-agent` Tier 2 is described but the governance model it returns is not documented anywhere else

**Fixes**: Add expected output for top 10 most-used commands. Explain `spl run`. Clarify `spl dashboard` vs console. Add record type glossary. Document `help-agent` response schemas. Add `spl help-agent --conventions` output to a governance model page.

### 14.8 Integration Status (/docs/reference/integrations)

**Current state**: Clean status matrix with Production / Preview / Planned tiers.

**Issues**:
- Editor setup commands are inconsistent: `spl setup --claude` here vs `spl setup --claude-code` in agent integration guide
- "Planned" items have no timeline or progress indicators
- No mention of version requirements for editor integrations (minimum Claude Code version, VS Code version, etc.)

**Fixes**: Align command names across all pages. Add "expected release" dates or quarters for planned items. Add version requirements.

---

## Summary of All Recommendations

### By Effort

| Effort | Count | Items |
|--------|-------|-------|
| < 30 min | 8 | Add prerequisites, add verification steps, fix path inconsistency in docs, explain test mode, add uninstall docs, fix command name inconsistencies, add troubleshooting links, add SDK config table |
| 1-2 hours | 6 | Write troubleshooting page, align skill file, add end-to-end example, document install script, add architecture diagram, create agent onboarding runbook |
| Half day | 4 | Make syncropel.com SSR, add governance model page, add sitemaps, document all error codes |
| Multiple days | 3 | Add screenshots to console docs, create docs testing CI, create docs search |

### By Impact

| Impact | Items |
|--------|-------|
| Blocks installation | Prerequisites, path inconsistency, install script docs |
| Blocks verification | Verification steps, expected outputs, health endpoint docs |
| Blocks troubleshooting | Troubleshooting page, error codes, failure mode catalog |
| Blocks AI agents | Non-interactive mode audit, machine-readable errors, agent runbook, skill file alignment |
| Blocks discoverability | SSR for syncropel.com, sitemaps, cross-linking, URL redirects |
| Improves experience | Architecture diagram, screenshots, use-case routing, value proposition |

---

*This document should be treated as a living guide. After implementing fixes, re-run the testing protocol (Section 12) to verify improvements. The goal is not perfect documentation but predictably successful onboarding — every user, human or AI, reaches a working state without external help.*
