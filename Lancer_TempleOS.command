#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "✝ DÉMARRAGE DE TEMPLEOS DIVINE ARCADE (.APP NATIVE MAC)..."
open -a "$DIR/TempleOS Arcade.app" || "$DIR/TempleOS Arcade.app/Contents/MacOS/TempleOSArcade"
exit 0
