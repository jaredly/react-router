
lint:
	@jshint *.js

test: lint test-only

test-only:
	@mocha -R spec

.PHONY: test lint test-only
