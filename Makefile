## Vocabulary lint helpers.

.PHONY: lint-vocabulary lint-vocabulary-fix lint-vocabulary-test

# Run the linter (fails on hits); same invocation as CI.
lint-vocabulary:
	@python3 tools/lint-vocabulary.py --mode error content/docs

# Auto-apply the suggested replacements via git apply.
# Inspect the diff first if anything looks load-bearing:
#   python3 tools/lint-vocabulary.py --fix .
lint-vocabulary-fix:
	@python3 tools/lint-vocabulary.py --fix . | git apply -p1 - && \
	  echo "vocab-lint: replacements applied; review with \`git diff\`."

# Run the linter's own self-test (failure-modes matrix).
lint-vocabulary-test:
	@bash tools/lint_vocabulary_test.sh
