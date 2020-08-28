DOCKER_TAG ?= latest
DOCKER_IMAGE = docker.pkg.github.com/percona-platform/saas-ui/saas-ui:$(DOCKER_TAG)

default: help

help:                   ## Display this help message
	@echo "Please use \`make <target>\` where <target> is one of:"
	@grep '^[a-zA-Z]' $(MAKEFILE_LIST) | \
		awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

init:                   ## Install development tools
	cd tools && go build -o ../bin/reviewdog github.com/reviewdog/reviewdog/cmd/reviewdog
	cd tools && go build -o ../bin/extract-image-tag ./extract-image-tag
	cd tools && go build -o ../bin/get-stale-packages ./get-stale-packages

	npm install -g lerna

bootstrap:              ## Bootstrap projects
	lerna bootstrap --ci

test:                   ## Run tests
	lerna run test

build:                  ## Build projects artifacts
	lerna run build

docker-build:           ## Build Docker image
	docker build --squash --tag $(DOCKER_IMAGE) .

docker-push:            ## Push Docker image
	docker push $(DOCKER_IMAGE)