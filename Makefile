.PHONY: build

build:
	node build.js

update:
	cd js13k-compiler && git checkout master && git pull
