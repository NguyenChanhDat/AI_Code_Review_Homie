#!/bin/bash
set -e

h1() {
  local BOLD="\033[1m"
  local FG_WHITE="\033[97m"
  local BG_BLUE="\033[48;5;33m"
  local RS="\033[0m"
  local MSG=$1
  echo -e "${BG_BLUE}${FG_WHITE}${BOLD} [$(date +"%H:%M:%S")] ${MSG} ${RS}"
}

npm install

CONTAINER_NAME="ollama"
IMAGE_NAME="ollama/ollama"

h1 "Kill Old Container"
docker kill "$CONTAINER_NAME" || true

h1 "Remove Old Container"
docker rm "$CONTAINER_NAME" || true

h1 "Remove Old Image"
docker rmi "$IMAGE_NAME" || true

h1 "Pull Latest Image"
docker pull "$IMAGE_NAME"

h1 "Build New Image"
docker build -t "$IMAGE_NAME" -f Dockerfile.ollama .

h1 "Run New Container"
docker run -d \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  --name "$CONTAINER_NAME" \
  "$IMAGE_NAME"

h1 "Exec Into Container"
docker exec -it "$CONTAINER_NAME" ollama run "$AI_MODEL"

npm run dev