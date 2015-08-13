
build: deps
	mkdir -p build/data
	cp -r tmpl/* build/.
	cp -r player/dist/css build/.
	cp -r player/dist/js/* build/js/.
	cp -r player/src/scripts/vendor/screenfull.js build/js/.
	cp asciinema.json build/data/.

deps: player/dist node_modules

node_modules:
	npm install

player/dist: player
	@echo "--> building player"
	cd player \
	&& git pull \
	&& npm install \
	&& npm install grunt-cli \
	&& node_modules/.bin/grunt \

player:
	@echo "--> installing player"
	git clone https://github.com/asciinema/asciinema-player player

clean:
	rm -rf player/dist
	rm -rf build

.PHONY: clean
