#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VERSION="$(node -p "require('./package.json').version")"
ZIP_NAME="ODC-HarnessEngineering-SCORM12-v${VERSION}.zip"
OUT_DIR="export"

pnpm build

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
ZIP_PATH="${OUT_DIR}/${ZIP_NAME}"

if command -v zip >/dev/null 2>&1; then
  (cd dist && zip -qr "../${ZIP_PATH}" .)
  if [ -f imsmanifest.xml ]; then
    zip -qj "$ZIP_PATH" imsmanifest.xml
  fi
else
  python3 - "$ZIP_PATH" <<'PY'
import os
import sys
import zipfile

zip_path = sys.argv[1]
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk("dist"):
        dirs.sort()
        for name in sorted(files):
            path = os.path.join(root, name)
            zf.write(path, os.path.relpath(path, "dist"))
    if os.path.isfile("imsmanifest.xml"):
        zf.write("imsmanifest.xml", "imsmanifest.xml")
PY
fi

echo "Paquete SCORM generado: ${ZIP_PATH}"
