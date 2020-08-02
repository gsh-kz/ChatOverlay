DOCKER_CMD := docker run --rm -it -w /app -v ${PWD}:/app
NODE_VER := 12.16.2-alpine
IMG_TAG := node:${NODE_VER}

build: clean
	@${DOCKER_CMD} ${IMG_TAG} npm run build:dev

release: clean
	@${DOCKER_CMD} ${IMG_TAG} npm run build

sh:
	@${DOCKER_CMD} ${IMG_TAG} sh

install:
	@${DOCKER_CMD} ${IMG_TAG} npm install

clean:
	@rm -rf plugin/css plugin/js
