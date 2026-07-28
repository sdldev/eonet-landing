#!/bin/bash
# Build Docker images locally dan export ke .tar files
#
# Usage:
#   ./scripts/build-images.sh          # build + save
#   ./scripts/build-images.sh --push   # build + push ke registry
#
# Output: dist/eonet-landing.tar.gz

set -euo pipefail

TAG="${DOCKER_TAG:-latest}"
REGISTRY="${DOCKER_REGISTRY:-}"
PUSH=false
API_URL="${PUBLIC_API_BASE:-http://192.168.19.6:3000}"

[[ "${1:-}" == "--push" ]] && PUSH=true

mkdir -p dist

echo "🔨 Building eonet-landing..."
docker build \
  --network host \
  --target runtime \
  --build-arg PUBLIC_API_BASE="${API_URL}" \
  --build-arg PUBLIC_MIDTRANS_IS_PRODUCTION=false \
  -t "eonet-landing:${TAG}" \
  .

if $PUSH; then
  if [[ -z "$REGISTRY" ]]; then
    echo "❌ DOCKER_REGISTRY belum diset. Contoh: DOCKER_REGISTRY=ghcr.io/sdldev"
    exit 1
  fi
  echo "📤 Pushing ke ${REGISTRY}..."
  docker tag "eonet-landing:${TAG}" "${REGISTRY}/eonet-landing:${TAG}"
  docker push "${REGISTRY}/eonet-landing:${TAG}"
  echo "✅ Push selesai"
else
  echo "💾 Saving image ke tar..."
  docker save "eonet-landing:${TAG}" | gzip > "dist/eonet-landing.tar.gz"
  echo "✅ Build selesai:"
  echo "   dist/eonet-landing.tar.gz"
  echo ""
  echo "Upload ke 1Panel: Containers > Images > Load Image"
fi
