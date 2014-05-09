BROWSERIFY=../node_modules/.bin/browserify

MAKEDEPEND= \
	$(BROWSERIFY) --list demo_src.js | \
		sort | \
		sed "s|^$$PWD/||" | \
		grep -v '/node_modules/' | \
		sed 's/\(.*\)/demo.js: \1%\1:%/' | \
		tr '%' '\n' > deps.mk

demo.js: demo_src.js
	@$(MAKEDEPEND)
	$(BROWSERIFY) -x React demo_src.js -o $@ || rm -f $@

deps.mk:
	@$(MAKEDEPEND)

-include deps.mk
