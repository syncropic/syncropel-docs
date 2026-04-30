#!/usr/bin/env bash
# Tests for tools/lint-vocabulary.py — covers the failure-modes matrix:
#
#   1. Bare "Lens" in prose          → MUST flag
#   2. Bare "Console" in prose       → MUST flag
#   3. Inside a code fence           → MUST NOT flag
#   4. Inside an inline code span    → MUST NOT flag
#   5. Inside a Markdown link target → MUST NOT flag
#   6. After `disable-next-line`     → MUST NOT flag
#   7. With `disable-file` at top    → MUST NOT flag
#   8. In a YAML provenance field    → MUST NOT flag
#   9. In a whitelisted path         → MUST NOT flag
#  10. Auto-fix produces a clean diff that, applied, makes #1 disappear

set -euo pipefail

LINTER="$(cd "$(dirname "$0")/.." && pwd)/tools/lint-vocabulary.py"
if [ ! -x "${LINTER}" ] && [ ! -f "${LINTER}" ]; then
  echo "FAIL: linter not found at ${LINTER}" >&2
  exit 1
fi

WORK="$(mktemp -d)"
trap 'rm -rf "${WORK}"' EXIT

cd "${WORK}"
mkdir -p tools docs/ui content/active 16-experience-vision

# ----- Fixture 1 + 2: bare retired terms (must flag) -----------------------
cat > content/active/violations.md <<'EOF'
# Active doc

The Lens UI is the home of all projections.
The Console panel renders fold state.
EOF

# ----- Fixture 3: code fence (must not flag) ------------------------------
cat > content/active/code-fence.md <<'EOF'
# Code fence test

```typescript
// const Lens = require("./components/Lens");
const Console = window.console;
```
EOF

# ----- Fixture 4: inline code (must not flag) -----------------------------
cat > content/active/inline-code.md <<'EOF'
# Inline code

The legacy `Lens` component (renamed `Studio`) shipped in v0.5.
Browser `Console` errors should be checked first.
EOF

# ----- Fixture 5: link target (must not flag) -----------------------------
cat > content/active/link-target.md <<'EOF'
# Link target

See the deprecation note: [the former Studio](https://example.com/Lens-deprecation).
EOF

# ----- Fixture 6: disable-next-line (must not flag) -----------------------
cat > content/active/disable-line.md <<'EOF'
# Disable-next-line

<!-- vocab-lint-disable-next-line -->
The Lens thesis (now retired) was the polymorphic projection idea.
EOF

# ----- Fixture 7: disable-file (must not flag) ----------------------------
cat > content/active/disable-file.md <<'EOF'
<!-- vocab-lint-disable-file -->
# Disable file

The Lens UI is fine here.
The Console panel is fine here.
EOF

# ----- Fixture 8: frontmatter provenance (must not flag) ------------------
# The body deliberately avoids any retired term — this fixture only verifies
# the YAML provenance keys are skipped.
cat > content/active/provenance.md <<'EOF'
---
title: Studio
previously_named: Lens
provenance: Lens (deprecated 2026-04-17)
---
# Provenance

Body text uses Studio.
EOF

# ----- Fixture 9: whitelisted path (must not flag) ------------------------
cat > 16-experience-vision/historical.md <<'EOF'
# Historical research

The Lens thesis is the polymorphic projection registry.
Console is the cousin primitive.
EOF

# ----- Linter on disk -----------------------------------------------------
mkdir -p tools
cp "${LINTER}" tools/lint-vocabulary.py
chmod +x tools/lint-vocabulary.py

# ----- Run linter ---------------------------------------------------------
HITS_OUT="${WORK}/hits.out"
SUMMARY_OUT="${WORK}/summary.out"
python3 tools/lint-vocabulary.py --mode warn . \
  > "${HITS_OUT}" 2> "${SUMMARY_OUT}" || true

PASS=0
FAIL=0
report() {
  if [ "$1" = "PASS" ]; then
    PASS=$((PASS + 1))
    echo "PASS: $2"
  else
    FAIL=$((FAIL + 1))
    echo "FAIL: $2" >&2
  fi
}

# Fixture 1+2: must flag exactly two terms in violations.md
if grep -q 'violations.md' "${HITS_OUT}" && \
   grep -q "term 'Lens'\|'Lens'" "${HITS_OUT}" && \
   grep -q "term 'Console'\|'Console'" "${HITS_OUT}"; then
  report PASS "fixture 1+2: bare Lens/Console in prose flagged"
else
  report FAIL "fixture 1+2: bare Lens/Console NOT flagged"
fi

# Fixture 3: code fence must not flag
if grep -q 'code-fence.md' "${HITS_OUT}"; then
  report FAIL "fixture 3: code fence FALSELY flagged"
else
  report PASS "fixture 3: code fence skipped"
fi

# Fixture 4: inline code must not flag
if grep -q 'inline-code.md' "${HITS_OUT}"; then
  report FAIL "fixture 4: inline code FALSELY flagged"
else
  report PASS "fixture 4: inline code skipped"
fi

# Fixture 5: link target must not flag
if grep -q 'link-target.md' "${HITS_OUT}"; then
  report FAIL "fixture 5: link target FALSELY flagged"
else
  report PASS "fixture 5: link target skipped"
fi

# Fixture 6: disable-next-line must not flag
if grep -q 'disable-line.md' "${HITS_OUT}"; then
  report FAIL "fixture 6: disable-next-line FALSELY flagged"
else
  report PASS "fixture 6: disable-next-line skipped"
fi

# Fixture 7: disable-file must not flag
if grep -q 'disable-file.md' "${HITS_OUT}"; then
  report FAIL "fixture 7: disable-file FALSELY flagged"
else
  report PASS "fixture 7: disable-file skipped"
fi

# Fixture 8: provenance frontmatter must not flag
if grep -q 'provenance.md' "${HITS_OUT}"; then
  report FAIL "fixture 8: provenance frontmatter FALSELY flagged"
else
  report PASS "fixture 8: provenance frontmatter skipped"
fi

# Fixture 9: whitelisted path must not flag
if grep -q '16-experience-vision' "${HITS_OUT}"; then
  report FAIL "fixture 9: whitelisted path FALSELY flagged"
else
  report PASS "fixture 9: whitelisted path skipped"
fi

# Fixture 10: --fix produces a diff that fixes violations.md
DIFF_OUT="${WORK}/fix.diff"
python3 tools/lint-vocabulary.py --fix . > "${DIFF_OUT}" || true
if grep -q '^-.*Lens' "${DIFF_OUT}" && grep -q '^+.*Studio' "${DIFF_OUT}"; then
  report PASS "fixture 10: --fix emits Lens→Studio diff"
else
  report FAIL "fixture 10: --fix did NOT emit Lens→Studio diff"
fi

# Apply the diff and re-run; should be clean.
git init -q .
git add -A
git -c user.email=test@example.com -c user.name=test commit -q -m init
python3 tools/lint-vocabulary.py --fix . | git apply -p1 - || true
RERUN_HITS="${WORK}/rerun.out"
python3 tools/lint-vocabulary.py --mode warn . \
  > "${RERUN_HITS}" 2>&1 || true
if grep -q 'violations.md' "${RERUN_HITS}"; then
  report FAIL "fixture 11: post-fix re-run still flags violations.md"
else
  report PASS "fixture 11: post-fix re-run is clean for violations.md"
fi

# Error-mode exit code on hits. (Use a freshly-written file — the fixture-1
# violation was just patched above.)
mkdir -p err-mode
cat > err-mode/v.md <<'EOF'
# Error-mode fixture

The Lens UI was renamed.
EOF
set +e
python3 tools/lint-vocabulary.py --mode error err-mode/ > /dev/null 2>&1
RC=$?
set -e
if [ "${RC}" = "2" ]; then
  report PASS "fixture 12: error-mode exits 2 on hits"
else
  report FAIL "fixture 12: error-mode exit was ${RC}, expected 2"
fi

echo
echo "Results: ${PASS} pass, ${FAIL} fail"
[ "${FAIL}" = "0" ]
