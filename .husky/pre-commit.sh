#!/usr/bin/env sh
echo "This script runs before every commit!"
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run prettier
npm run release
git add .