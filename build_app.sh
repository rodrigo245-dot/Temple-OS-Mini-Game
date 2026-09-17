#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "========================================================="
echo "   ✝ COMPILATION DU BUNDLE TEMPLEOS ARCADE.APP (MAC) ✝   "
echo "========================================================="

APP_NAME="TempleOS Arcade.app"
CONTENTS="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS/MacOS"
RESOURCES_DIR="$CONTENTS/Resources"
WEB_DIR="$RESOURCES_DIR/web"

# 1. Nettoyage des précédents builds
rm -rf "$APP_NAME" AppIcon.iconset AppIcon.icns gen_icon

# 2. Création de l'arborescence du bundle .app
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"
mkdir -p "$WEB_DIR"

# 3. Génération de l'icône macOS (.icns)
echo "[1/4] Génération de l'icône sacrée du Dock..."
clang -framework Cocoa src/generate_icon.m -o gen_icon
./gen_icon
rm -f gen_icon

iconutil -c icns AppIcon.iconset -o "$RESOURCES_DIR/AppIcon.icns"
rm -rf AppIcon.iconset

# 4. Compilation du binaire natif Mac (Cocoa + WebKit)
echo "[2/4] Compilation native Cocoa / WebKit..."
clang -O2 -framework Cocoa -framework WebKit src/main.m -o "$MACOS_DIR/TempleOSArcade"

# 5. Création du fichier Info.plist
echo "[3/4] Création du manifeste Info.plist..."
cat << 'EOF' > "$CONTENTS/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>TempleOSArcade</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>org.templeos.divine-arcade</string>
    <key>CFBundleName</key>
    <string>TempleOS Arcade</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>7.77</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# 6. Copie des ressources web intégrées
echo "[4/4] Intégration des jeux dans l'application..."
cp -r index.html css js "$WEB_DIR/"

chmod +x "$MACOS_DIR/TempleOSArcade"

echo "========================================================="
echo "   ✅ APPLICATION COMPILÉE AVEC SUCCÈS : $APP_NAME"
echo "========================================================="
