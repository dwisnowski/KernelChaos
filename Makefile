.PHONY: install run build deploy lint types clean help

NPM ?= npm
DEV_PORT ?= 5173

.DEFAULT_GOAL := help

help:
	@echo "KernelChaos"
	@echo ""
	@echo "  make install    Install npm dependencies"
	@echo "  make run        Start Vite + Worker dev server (port $(DEV_PORT))"
	@echo "  make build      Production build"
	@echo "  make deploy     Build and deploy to kernelchaos.wildideazone.com"
	@echo "  make lint       Run oxlint"
	@echo "  make types      Regenerate worker-configuration.d.ts"
	@echo "  make clean      Remove node_modules, dist, and .wrangler"

install:
	$(NPM) install

run:
	$(NPM) run dev -- --port $(DEV_PORT)

build:
	$(NPM) run build

deploy:
	$(NPM) run deploy

lint:
	$(NPM) run lint

types:
	$(NPM) run cf-typegen

clean:
	rm -rf node_modules dist .wrangler
