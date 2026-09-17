import Cocoa

func renderIcon(size: CGFloat) -> NSImage {
    let image = NSImage(size: NSSize(width: size, height: size))
    image.lockFocus()

    guard let ctx = NSGraphicsContext.current?.cgContext else {
        image.unlockFocus()
        return image
    }

    let rect = CGRect(x: 0, y: 0, width: size, height: size)

    // Fond bleu profond TempleOS #0000AA
    ctx.setFillColor(CGColor(red: 0.0, green: 0.0, blue: 0.66, alpha: 1.0))
    ctx.fill(rect)

    // Bordure jaune vif TempleOS #FFFF55
    ctx.setStrokeColor(CGColor(red: 1.0, green: 1.0, blue: 0.33, alpha: 1.0))
    ctx.setLineWidth(max(2.0, size * 0.05))
    ctx.stroke(rect.insetBy(dx: size * 0.04, dy: size * 0.04))

    // Croix Sacrée dorée au centre
    ctx.setFillColor(CGColor(red: 1.0, green: 1.0, blue: 0.33, alpha: 1.0))
    
    // Poutre verticale de la croix
    let vertW = size * 0.16
    let vertH = size * 0.62
    let vertX = (size - vertW) / 2.0
    let vertY = size * 0.15
    ctx.fill(CGRect(x: vertX, y: vertY, width: vertW, height: vertH))

    // Poutre horizontale de la croix
    let horizW = size * 0.46
    let horizH = size * 0.16
    let horizX = (size - horizW) / 2.0
    let horizY = vertY + vertH * 0.52
    ctx.fill(CGRect(x: horizX, y: horizY, width: horizW, height: horizH))

    image.unlockFocus()
    return image
}

func savePNG(image: NSImage, path: String) {
    guard let tiffData = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiffData),
          let pngData = rep.representation(using: .png, properties: [:]) else {
        return
    }
    try? pngData.write(to: URL(fileURLWithPath: path))
}

let fm = FileManager.default
let iconsetDir = "AppIcon.iconset"
try? fm.removeItem(atPath: iconsetDir)
try? fm.createDirectory(atPath: iconsetDir, withIntermediateDirectories: true, attributes: nil)

let sizes: [(String, CGFloat)] = [
    ("icon_16x16.png", 16),
    ("icon_16x16@2x.png", 32),
    ("icon_32x32.png", 32),
    ("icon_32x32@2x.png", 64),
    ("icon_128x128.png", 128),
    ("icon_128x128@2x.png", 256),
    ("icon_256x256.png", 256),
    ("icon_256x256@2x.png", 512),
    ("icon_512x512.png", 512),
    ("icon_512x512@2x.png", 1024)
]

for (name, s) in sizes {
    let img = renderIcon(size: s)
    savePNG(image: img, path: "\(iconsetDir)/\(name)")
}

print("Iconset generated successfully!")
