.PHONY: build

build:
	../js13k-compiler/bin/build config.json

watch:
	../js13k-compiler/bin/build config.json --watch
