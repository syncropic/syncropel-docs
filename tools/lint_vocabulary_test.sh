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
#  13-19. Scoped rule sets: person-facing rules fire in prose on in-scope
#         pages only; strict words fire only on opted-in pages

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

# ----- Scoped rule sets (person-facing + strict words) ---------------------
mkdir -p scoped/content/docs/get-started scoped/content/docs/operate
EM="$(printf '\342\200\224')"
TICK='`'
FENCE='```'
cat > scoped/content/docs/get-started/page.mdx <<FIXTURE
---
title: Page
description: A description ${EM} with a dash.
icon: Book${EM}Mark
---
# Page

Prose with an em dash ${EM} here.
Your id is did:sync:user:you on th_abc_123 via /v1/records now.
It writes core.user.message.v1 through the control plane with write-back.
The fold is minted and federation follows.

Inline code is fine: ${TICK}did:sync:user:you${TICK} and ${TICK}/v1/records${TICK} and ${TICK}th_abc${TICK}.

${FENCE}bash
spl know --thread th_code /v1/in/code did:sync:x core.a.v1 ${EM} fold mint
${FENCE}
FIXTURE
cat > scoped/content/docs/operate/elsewhere.mdx <<FIXTURE
# Elsewhere

An em dash ${EM} and a fold outside the person-facing scope.
FIXTURE
cat > scoped/content/docs/get-started/pricing.mdx <<'FIXTURE'
# Pricing

Each instance has an actor.
FIXTURE
cat > scoped/content/docs/get-started/install.mdx <<'FIXTURE'
# Install

Start a local instance with an actor.
FIXTURE
set +e
(cd scoped && python3 ../tools/lint-vocabulary.py --mode error content/docs \
  > /dev/null 2> ../scoped.out)
SCOPED_RC=$?
set -e
if [ "${SCOPED_RC}" = "2" ]; then
  report PASS "fixture 13: scoped findings exit 2"
else
  report FAIL "fixture 13: scoped run exit was ${SCOPED_RC}, expected 2"
fi
for rule in em-dash did-literal thread-id api-path record-kind control-plane \
            write-back fold mint federation; do
  if grep -q "page.mdx:\([89]\|1[01]\): person-facing/${rule}:" scoped.out; then
    report PASS "fixture 14: person-facing/${rule} flagged in prose"
  else
    report FAIL "fixture 14: person-facing/${rule} NOT flagged in prose"
  fi
done
if grep -q "page.mdx:3: person-facing/em-dash:" scoped.out; then
  report PASS "fixture 15: em dash in frontmatter description flagged"
else
  report FAIL "fixture 15: em dash in frontmatter description NOT flagged"
fi
if grep -q "page.mdx:\(4\|13\|1[5-7]\):" scoped.out; then
  report FAIL "fixture 16: frontmatter key, inline code or code fence FALSELY flagged"
else
  report PASS "fixture 16: frontmatter key, inline code and code fence skipped"
fi
if grep -q "elsewhere.mdx:.*person-facing" scoped.out; then
  report FAIL "fixture 17: person-facing rules FALSELY applied outside scope"
else
  report PASS "fixture 17: person-facing rules stay in scope"
fi
if grep -q "get-started/pricing.mdx:3: strict-word/instance:" scoped.out && \
   grep -q "get-started/pricing.mdx:3: strict-word/actor:" scoped.out; then
  report PASS "fixture 18: strict words flagged on an opted-in page"
else
  report FAIL "fixture 18: strict words NOT flagged on an opted-in page"
fi
if grep -q "install.mdx:.*strict-word" scoped.out; then
  report FAIL "fixture 19: strict words FALSELY applied to a page not opted in"
else
  report PASS "fixture 19: strict words not applied to a page not opted in"
fi

echo
echo "Results: ${PASS} pass, ${FAIL} fail"
[ "${FAIL}" = "0" ]
