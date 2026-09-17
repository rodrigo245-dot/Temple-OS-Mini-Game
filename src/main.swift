import Cocoa
import WebKit

class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate {
    var window: NSWindow!
    var webView: WKWebView!

    func applicationDidFinishLaunching(_ notification: Notification) {
        // Configuration de la fenêtre native Mac
        let initialWidth: CGFloat = 1100
        let initialHeight: CGFloat = 780

        let screenRect = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1200, height: 800)
        let originX = screenRect.origin.x + (screenRect.width - initialWidth) / 2
        let originY = screenRect.origin.y + (screenRect.height - initialHeight) / 2
        let windowRect = NSRect(x: originX, y: originY, width: initialWidth, height: initialHeight)

        window = NSWindow(
            contentRect: windowRect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )

        window.title = "✝ TEMPLEOS 64-BIT - OFFICIAL DIVINE ARCADE (TERRY DAVIS EDITION) ✝"
        window.minSize = NSSize(width: 800, height: 600)
        window.backgroundColor = NSColor(red: 0.0, green: 0.0, blue: 0.66, alpha: 1.0) // Bleu TempleOS
        window.delegate = self

        // Configuration de WKWebView pour les jeux et le son
        let config = WKWebViewConfiguration()
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        config.defaultWebpagePreferences = prefs
        config.mediaTypesRequiringUserActionForPlayback = [] // Permet le son PC Speaker sans blocage
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        window.contentView?.addSubview(webView)

        // Localisation du dossier web dans le bundle Resources
        if let bundleWebDir = Bundle.main.url(forResource: "web", withExtension: nil) {
            let indexURL = bundleWebDir.appendingPathComponent("index.html")
            webView.loadFileURL(indexURL, allowingReadAccessTo: bundleWebDir)
        } else {
            // Fallback en mode développement
            let currentDir = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
            let indexURL = currentDir.appendingPathComponent("index.html")
            webView.loadFileURL(indexURL, allowingReadAccessTo: currentDir)
        }

        // Création du menu système Mac
        setupMenuBar()

        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func setupMenuBar() {
        let mainMenu = NSMenu()
        let appMenuItem = NSMenuItem()
        mainMenu.addItem(appMenuItem)

        let appMenu = NSMenu()
        let appName = "TempleOS Arcade"
        appMenu.addItem(withTitle: "À propos de \(appName)", action: #selector(showAbout), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Masquer \(appName)", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let hideOthersItem = NSMenuItem(title: "Masquer les autres", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        hideOthersItem.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(hideOthersItem)
        appMenu.addItem(withTitle: "Tout afficher", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Quitter \(appName)", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appMenuItem.submenu = appMenu

        // Menu Fenêtre
        let windowMenuItem = NSMenuItem()
        mainMenu.addItem(windowMenuItem)
        let windowMenu = NSMenu(title: "Fenêtre")
        windowMenu.addItem(withTitle: "Réduire", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Zoom", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")
        windowMenu.addItem(withTitle: "Plein écran", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        windowMenuItem.submenu = windowMenu

        NSApp.mainMenu = mainMenu
    }

    @objc func showAbout() {
        let alert = NSAlert()
        alert.messageText = "✝ TEMPLEOS DIVINE ARCADE ✝"
        alert.informativeText = "Créé d'après le système de Terry A. Davis.\nRésolution 640x480 VGA, 16 couleurs pures, Ring-0 sans feds."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "Gloire à Dieu")
        alert.runModal()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}

// Point d'entrée principal
let app = NSApplication.shared
app.setActivationPolicy(.regular)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
