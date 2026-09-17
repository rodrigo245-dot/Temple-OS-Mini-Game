#import <Cocoa/Cocoa.h>

NSImage* renderIcon(CGFloat size) {
    NSImage *image = [[NSImage alloc] initWithSize:NSMakeSize(size, size)];
    [image lockFocus];

    CGContextRef ctx = [[NSGraphicsContext currentContext] CGContext];
    CGRect rect = CGRectMake(0, 0, size, size);

    // Fond bleu profond TempleOS #0000AA
    CGContextSetRGBFillColor(ctx, 0.0, 0.0, 0.66, 1.0);
    CGContextFillRect(ctx, rect);

    // Bordure jaune vif TempleOS #FFFF55
    CGContextSetRGBStrokeColor(ctx, 1.0, 1.0, 0.33, 1.0);
    CGContextSetLineWidth(ctx, MAX(2.0, size * 0.05));
    CGContextStrokeRect(ctx, CGRectInset(rect, size * 0.04, size * 0.04));

    // Croix Sacrée dorée au centre
    CGContextSetRGBFillColor(ctx, 1.0, 1.0, 0.33, 1.0);
    
    // Poutre verticale de la croix
    CGFloat vertW = size * 0.16;
    CGFloat vertH = size * 0.62;
    CGFloat vertX = (size - vertW) / 2.0;
    CGFloat vertY = size * 0.15;
    CGContextFillRect(ctx, CGRectMake(vertX, vertY, vertW, vertH));

    // Poutre horizontale de la croix
    CGFloat horizW = size * 0.46;
    CGFloat horizH = size * 0.16;
    CGFloat horizX = (size - horizW) / 2.0;
    CGFloat horizY = vertY + vertH * 0.52;
    CGContextFillRect(ctx, CGRectMake(horizX, horizY, horizW, horizH));

    [image unlockFocus];
    return image;
}

void savePNG(NSImage *image, NSString *path) {
    NSData *tiffData = [image TIFFRepresentation];
    NSBitmapImageRep *rep = [NSBitmapImageRep imageRepWithData:tiffData];
    NSData *pngData = [rep representationUsingType:NSBitmapImageFileTypePNG properties:@{}];
    [pngData writeToFile:path atomically:YES];
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFileManager *fm = [NSFileManager defaultManager];
        NSString *iconsetDir = @"AppIcon.iconset";
        [fm removeItemAtPath:iconsetDir error:nil];
        [fm createDirectoryAtPath:iconsetDir withIntermediateDirectories:YES attributes:nil error:nil];

        struct IconSpec {
            const char *name;
            CGFloat size;
        } specs[] = {
            {"icon_16x16.png", 16},
            {"icon_16x16@2x.png", 32},
            {"icon_32x32.png", 32},
            {"icon_32x32@2x.png", 64},
            {"icon_128x128.png", 128},
            {"icon_128x128@2x.png", 256},
            {"icon_256x256.png", 256},
            {"icon_256x256@2x.png", 512},
            {"icon_512x512.png", 512},
            {"icon_512x512@2x.png", 1024}
        };

        for (int i = 0; i < 10; i++) {
            NSString *filename = [NSString stringWithUTF8String:specs[i].name];
            NSString *fullPath = [iconsetDir stringByAppendingPathComponent:filename];
            NSImage *img = renderIcon(specs[i].size);
            savePNG(img, fullPath);
        }

        NSLog(@"Iconset généré avec succès dans %@", iconsetDir);
    }
    return 0;
}
