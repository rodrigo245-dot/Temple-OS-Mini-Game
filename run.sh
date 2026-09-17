#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "========================================================"
echo "   ✝ LANCEMENT DE TEMPLEOS DIVINE ARCADE (.APP MAC) ✝   "
echo "========================================================"

if [ -d "$DIR/TempleOS Arcade.app" ]; then
    echo "[+] Lancement de l'application native macOS..."
    open "$DIR/TempleOS Arcade.app" || "$DIR/TempleOS Arcade.app/Contents/MacOS/TempleOSArcade"
else
    echo "[!] Application non trouvée, re-compilation..."
    ./build_app.sh
    open "$DIR/TempleOS Arcade.app"
fi
