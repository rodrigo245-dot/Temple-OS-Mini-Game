#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "========================================================="
echo "   ✝ CRÉATION DU DMG D'INSTALLATION TEMPLEOS ARCADE ✝    "
echo "========================================================="

DMG_NAME="TempleOS_Arcade.dmg"
VOL_NAME="TempleOS Arcade"
TMP_DIR="dmg_pack"

rm -rf "$TMP_DIR" "$DMG_NAME"
mkdir -p "$TMP_DIR"

echo "[1/3] Copie de l'application..."
cp -R "TempleOS Arcade.app" "$TMP_DIR/"

echo "[2/3] Création du lien symbolique vers /Applications..."
ln -s /Applications "$TMP_DIR/Applications"

echo "[3/3] Génération du DMG compressé via hdiutil..."
hdiutil create -volname "$VOL_NAME" -srcfolder "$TMP_DIR" -ov -format UDZO "$DMG_NAME"

rm -rf "$TMP_DIR"

echo "========================================================="
echo "   ✅ DMG GÉNÉRÉ AVEC SUCCÈS : $DMG_NAME"
echo "========================================================="
ls -lh "$DMG_NAME"
