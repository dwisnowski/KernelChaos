.PHONY: install run build deploy lint types clean help hunt-coverage hunt-compose undef-words-cleanup-prompt

NPM ?= npm
DEV_PORT ?= 5173

.DEFAULT_GOAL := help

help:
	@echo "KernelChaos"
	@echo ""
	@echo "  make install                       Install npm dependencies"
	@echo "  make run                           Start Vite + Worker dev server (port $(DEV_PORT))"
	@echo "  make build                         Production build"
	@echo "  make deploy                        Build and deploy to kernelchaos.wildideazone.com"
	@echo "  make lint                          Run oxlint"
	@echo "  make hunt-coverage                 Check Picture Hunt catalog floors (ADR 0020/0026)"
	@echo "  make hunt-compose                  Layout-pack boxes + compose hunt JPGs (ADR 0026)"
	@echo "  make undef-words-cleanup-prompt    Print Cursor prompt to clean undefined Boggle words (ADR 0025)"
	@echo "  make types                         Regenerate worker-configuration.d.ts"
	@echo "  make clean                         Remove node_modules, dist, and .wrangler"

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

hunt-coverage:
	$(NPM) run hunt:coverage

hunt-compose:
	$(NPM) run hunt:compose

undef-words-cleanup-prompt:
	@cat scripts/undef-words-cleanup-prompt.txt

types:
	$(NPM) run cf-typegen

clean:
	rm -rf node_modules dist .wrangler
