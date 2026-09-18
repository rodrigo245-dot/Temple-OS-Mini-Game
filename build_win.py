import json
import os
import shutil
import struct
import subprocess

DIR = os.path.dirname(os.path.abspath(__file__))
BUILD_DIR = os.path.join(DIR, "dist_win")
OUTPUT_DIR = os.path.join(DIR, "TempleOS_Arcade_Windows")

if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)

os.makedirs(BUILD_DIR)
os.makedirs(OUTPUT_DIR)

# 1. Prepare web resources
res_dir = os.path.join(BUILD_DIR, "resources")
os.makedirs(res_dir)

# Copy index.html, css, js
shutil.copy(os.path.join(DIR, "index.html"), os.path.join(res_dir, "index.html"))
shutil.copytree(os.path.join(DIR, "css"), os.path.join(res_dir, "css"))
shutil.copytree(os.path.join(DIR, "js"), os.path.join(res_dir, "js"))

# Copy icon
icon_dir = os.path.join(res_dir, "icons")
os.makedirs(icon_dir)
shutil.copy(os.path.join(DIR, "appIcon.png"), os.path.join(icon_dir, "appIcon.png"))

# 2. Prepare neutralino.config.json
config = {
    "applicationId": "org.templeos.arcade",
    "version": "5.0.0",
    "defaultMode": "window",
    "port": 0,
    "url": "/",
    "documentRoot": "/resources/",
    "enableServer": True,
    "tokenSecurity": "one-time",
    "storageLocation": "system",
    "dataLocation": "app",
    "enableNativeAPI": True,
    "exportAuthInfo": False,
    "singlePageServe": False,
    "logging": {
        "enabled": False,
        "writeToLogFile": False
    },
    "nativeBlockList": [],
    "modes": {
        "window": {
            "title": "TEMPLE OS - DIVINE GAMING ARCADE (ILLUMINATI & 38 JEUX)",
            "width": 1150,
            "height": 820,
            "minWidth": 800,
            "minHeight": 600,
            "center": True,
            "fullScreen": False,
            "alwaysOnTop": False,
            "icon": "/resources/icons/appIcon.png",
            "enableInspector": False,
            "borderless": False,
            "maximize": False,
            "resizable": True,
            "exitProcessOnClose": True
        }
    },
    "cli": {
        "binaryName": "TempleOS_Arcade",
        "resourcesPath": "/resources/",
        "clientLibrary": "/resources/js/neutralino.js"
    }
}

with open(os.path.join(BUILD_DIR, "neutralino.config.json"), "w", encoding="utf-8") as f:
    json.dump(config, f, indent=4)

# 3. Create resources.neu (ASAR format)
def pack_asar(src_dir, output_file):
    files_list = []
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, src_dir).replace('\\', '/')
            files_list.append((rel_path, full_path))

    files_list.sort(key=lambda x: x[0])
    
    header = {"files": {}}
    current_offset = 0
    file_data = []

    for rel, full in files_list:
        with open(full, 'rb') as fp:
            content = fp.read()
        size = len(content)
        parts = rel.split('/')
        curr = header["files"]
        for p in parts[:-1]:
            if p not in curr:
                curr[p] = {"files": {}}
            curr = curr[p]["files"]
        curr[parts[-1]] = {"size": size, "offset": str(current_offset)}
        current_offset += size
        file_data.append(content)

    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    header_json_len = len(header_json)

    header_size = header_json_len + 8
    header_size2 = header_json_len + 4
    
    with open(output_file, 'wb') as out:
        out.write(struct.pack('<IIII', 4, header_size, header_size2, header_json_len))
        out.write(header_json)
        for d in file_data:
            out.write(d)

asar_output = os.path.join(OUTPUT_DIR, "resources.neu")
pack_asar(BUILD_DIR, asar_output)
print("resources.neu generated successfully. Size:", os.path.getsize(asar_output))

# 4. Copy neutralino-win_x64.exe to TempleOS_Arcade.exe
win_exe_src = "/tmp/neu_dl/neutralino-win_x64.exe"
win_exe_dst = os.path.join(OUTPUT_DIR, "TempleOS_Arcade.exe")
if os.path.exists(win_exe_src):
    shutil.copy(win_exe_src, win_exe_dst)
elif not os.path.exists(win_exe_dst):
    # Try getting from git
    subprocess.run(["git", "checkout", "HEAD", "--", "TempleOS_Arcade_Windows/TempleOS_Arcade.exe"], cwd=DIR)

if os.path.exists(win_exe_dst):
    print("TempleOS_Arcade.exe ready. Size:", os.path.getsize(win_exe_dst))

# Clean temp build
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)

# 5. Zip Windows package
zip_path = os.path.join(DIR, "TempleOS_Arcade_Windows_x64.zip")
if os.path.exists(zip_path):
    os.remove(zip_path)
shutil.make_archive(os.path.splitext(zip_path)[0], 'zip', OUTPUT_DIR)
print("Windows release zip created:", zip_path, "Size:", os.path.getsize(zip_path))
