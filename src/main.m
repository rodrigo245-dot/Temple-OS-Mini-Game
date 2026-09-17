#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface AppDelegate : NSObject <NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate>
@property (strong, nonatomic) NSWindow *window;
@property (strong, nonatomic) WKWebView *webView;
@end

@interface LoggingHandler : NSObject <WKScriptMessageHandler>
@end
@implementation LoggingHandler
- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    NSLog(@"[JS] %@", message.body);
}
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    CGFloat initialWidth = 1100.0;
    CGFloat initialHeight = 780.0;

    NSRect screenRect = [[NSScreen mainScreen] visibleFrame];
    CGFloat originX = screenRect.origin.x + (screenRect.size.width - initialWidth) / 2.0;
    CGFloat originY = screenRect.origin.y + (screenRect.size.height - initialHeight) / 2.0;
    NSRect windowRect = NSMakeRect(originX, originY, initialWidth, initialHeight);

    self.window = [[NSWindow alloc] initWithContentRect:windowRect
                                              styleMask:(NSWindowStyleMaskTitled |
                                                         NSWindowStyleMaskClosable |
                                                         NSWindowStyleMaskMiniaturizable |
                                                         NSWindowStyleMaskResizable)
                                                backing:NSBackingStoreBuffered
                                                  defer:NO];

    [self.window setTitle:@"✝ TEMPLEOS 64-BIT - OFFICIAL DIVINE ARCADE (TERRY DAVIS EDITION) ✝"];
    [self.window setMinSize:NSMakeSize(800, 600)];
    [self.window setBackgroundColor:[NSColor colorWithRed:0.0 green:0.0 blue:0.66 alpha:1.0]];
    [self.window setDelegate:self];

    // Configuration WKWebView
    WKUserContentController *userContent = [[WKUserContentController alloc] init];
    LoggingHandler *logger = [[LoggingHandler alloc] init];
    [userContent addScriptMessageHandler:logger name:@"logging"];

    NSString *debugScriptSource = @"window.onerror = function(m, u, l, c, e) { window.webkit.messageHandlers.logging.postMessage('WINDOW.ONERROR: ' + m + ' at line ' + l + ':' + c + (e && e.stack ? ' ' + e.stack : '')); };\n"
    "const origErr = console.error; console.error = function(...args) { window.webkit.messageHandlers.logging.postMessage('CONSOLE.ERROR: ' + args.join(' ')); origErr.apply(console, args); };\n"
    "const origWarn = console.warn; console.warn = function(...args) { window.webkit.messageHandlers.logging.postMessage('CONSOLE.WARN: ' + args.join(' ')); origWarn.apply(console, args); };\n"
    "const origLog = console.log; console.log = function(...args) { window.webkit.messageHandlers.logging.postMessage('CONSOLE.LOG: ' + args.join(' ')); origLog.apply(console, args); };\n";

    WKUserScript *debugScript = [[WKUserScript alloc] initWithSource:debugScriptSource injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:NO];
    [userContent addUserScript:debugScript];

    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    config.userContentController = userContent;
    WKWebpagePreferences *pagePrefs = [[WKWebpagePreferences alloc] init];
    pagePrefs.allowsContentJavaScript = YES;
    config.defaultWebpagePreferences = pagePrefs;
    config.mediaTypesRequiringUserActionForPlayback = WKAudiovisualMediaTypeNone;
    [config.preferences setValue:@YES forKey:@"allowFileAccessFromFileURLs"];
    [config.preferences setValue:@YES forKey:@"developerExtrasEnabled"];

    self.webView = [[WKWebView alloc] initWithFrame:[[self.window contentView] bounds] configuration:config];
    [self.webView setAutoresizingMask:(NSViewWidthSizable | NSViewHeightSizable)];
    self.webView.navigationDelegate = self;
    [[self.window contentView] addSubview:self.webView];

    // Chargement de l'application web
    NSBundle *bundle = [NSBundle mainBundle];
    NSURL *webURL = [bundle URLForResource:@"web" withExtension:nil];
    if (webURL) {
        NSURL *indexURL = [webURL URLByAppendingPathComponent:@"index.html"];
        NSLog(@"[DEBUG] Loading indexURL from bundle: %@", indexURL);
        [self.webView loadFileURL:indexURL allowingReadAccessToURL:webURL];
    } else {
        NSString *cwd = [[NSFileManager defaultManager] currentDirectoryPath];
        NSURL *currentDir = [NSURL fileURLWithPath:cwd];
        NSURL *indexURL = [currentDir URLByAppendingPathComponent:@"index.html"];
        NSLog(@"[DEBUG] Loading indexURL from cwd: %@", indexURL);
        [self.webView loadFileURL:indexURL allowingReadAccessToURL:currentDir];
    }

    [self setupMenuBar];

    [self.window makeKeyAndOrderFront:nil];
    [NSApp activateIgnoringOtherApps:YES];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
    NSLog(@"[DEBUG] WKWebView didFinishNavigation!");
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"[DEBUG] WKWebView didFailNavigation: %@", error);
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    NSLog(@"[DEBUG] WKWebView didFailProvisionalNavigation: %@", error);
}

- (void)setupMenuBar {
    NSMenu *mainMenu = [[NSMenu alloc] init];

    // Menu App
    NSMenuItem *appMenuItem = [[NSMenuItem alloc] init];
    [mainMenu addItem:appMenuItem];

    NSMenu *appMenu = [[NSMenu alloc] init];
    NSString *appName = @"TempleOS Arcade";

    [appMenu addItemWithTitle:[NSString stringWithFormat:@"À propos de %@", appName]
                       action:@selector(showAbout)
                keyEquivalent:@""];
    [appMenu addItem:[NSMenuItem separatorItem]];

    [appMenu addItemWithTitle:[NSString stringWithFormat:@"Masquer %@", appName]
                       action:@selector(hide:)
                keyEquivalent:@"h"];

    NSMenuItem *hideOthers = [[NSMenuItem alloc] initWithTitle:@"Masquer les autres"
                                                        action:@selector(hideOtherApplications:)
                                                 keyEquivalent:@"h"];
    [hideOthers setKeyEquivalentModifierMask:(NSEventModifierFlagCommand | NSEventModifierFlagOption)];
    [appMenu addItem:hideOthers];

    [appMenu addItemWithTitle:@"Tout afficher"
                       action:@selector(unhideAllApplications:)
                keyEquivalent:@""];
    [appMenu addItem:[NSMenuItem separatorItem]];

    [appMenu addItemWithTitle:[NSString stringWithFormat:@"Quitter %@", appName]
                       action:@selector(terminate:)
                keyEquivalent:@"q"];
    [appMenuItem setSubmenu:appMenu];

    // Menu Fenêtre
    NSMenuItem *windowMenuItem = [[NSMenuItem alloc] init];
    [mainMenu addItem:windowMenuItem];

    NSMenu *windowMenu = [[NSMenu alloc] initWithTitle:@"Fenêtre"];
    [windowMenu addItemWithTitle:@"Réduire" action:@selector(performMiniaturize:) keyEquivalent:@"m"];
    [windowMenu addItemWithTitle:@"Zoom" action:@selector(performZoom:) keyEquivalent:@""];
    [windowMenu addItemWithTitle:@"Plein écran" action:@selector(toggleFullScreen:) keyEquivalent:@"f"];
    [windowMenuItem setSubmenu:windowMenu];

    [NSApp setMainMenu:mainMenu];
}

- (void)showAbout {
    NSAlert *alert = [[NSAlert alloc] init];
    [alert setMessageText:@"✝ TEMPLEOS DIVINE ARCADE ✝"];
    [alert setInformativeText:@"Le système d'arcade officiel de Dieu.\nRésolution 640x480 VGA, 16 couleurs pures, Ring-0 sans agents CIA.\n\nInspiré de l'œuvre de Terry A. Davis."];
    [alert setAlertStyle:NSAlertStyleInformational];
    [alert addButtonWithTitle:@"Gloire au Seigneur"];
    [alert runModal];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSApplication *app = [NSApplication sharedApplication];
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        AppDelegate *delegate = [[AppDelegate alloc] init];
        [app setDelegate:delegate];
        [app run];
    }
    return 0;
}
