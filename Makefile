build: | clean
	npm install
	npm run test
	npm run test

clean:
	rm -rf orbitdb/
	rm -rf keystore/
	rm -rf node_modules/
	rm -f package-lock.json

.PHONY: build
