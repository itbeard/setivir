#!/usr/bin/env bash
# Regenerates thumbnails/small/ — the ~800px JPEG covers shown in the page flow
# and the mini-player (the full-size originals in thumbnails/ stay for the
# lightbox). Keeping the flow images light is what lets a click on ▶ start
# fetching the mp3 immediately instead of queueing behind megabytes of artwork.
#
# Run after adding or replacing a cover:  npm run thumbs
# Commit the generated files — CI never runs this (uses sips, macOS-only).
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p thumbnails/small
shopt -s nullglob
for f in thumbnails/*.jpg thumbnails/*.jpeg thumbnails/*.png; do
  n=$(basename "$f")
  n="${n%.*}"
  sips -Z 800 -s format jpeg -s formatOptions 78 "$f" --out "thumbnails/small/$n.jpg" >/dev/null
  echo "thumbnails/small/$n.jpg"
done
