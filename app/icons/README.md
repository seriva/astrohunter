# PWA Icons

This directory should contain the following icon files for the Progressive Web App:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels (Apple touch icon)
- `icon-192x192.png` - 192x192 pixels (Android)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (Splash screen)

## Creating Icons

You can create these icons from a single source image (recommended 512x512 or larger) using:

1. **Online tools:**
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator)

2. **Command line tools:**
   ```bash
   # Using ImageMagick (if installed)
   convert source-icon.png -resize 72x72 icons/icon-72x72.png
   convert source-icon.png -resize 96x96 icons/icon-96x96.png
   convert source-icon.png -resize 128x128 icons/icon-128x128.png
   convert source-icon.png -resize 144x144 icons/icon-144x144.png
   convert source-icon.png -resize 152x152 icons/icon-152x152.png
   convert source-icon.png -resize 192x192 icons/icon-192x192.png
   convert source-icon.png -resize 384x384 icons/icon-384x384.png
   convert source-icon.png -resize 512x512 icons/icon-512x512.png
   ```

3. **Design suggestions:**
   - Use a simple, recognizable icon (e.g., a spaceship or asteroid)
   - Ensure the icon looks good on both light and dark backgrounds
   - Keep important details in the center (icons may be masked/cropped)
   - Use high contrast for visibility at small sizes

## Temporary Placeholder

Until you create proper icons, you can:

1. **Use the shell script** (requires ImageMagick):
   ```bash
   cd app/icons
   ./create-placeholder-icons.sh
   ```

2. **Use the HTML generator**: Open `generate-icons.html` in a browser and click "Draw Default Icon" then "Generate All Icons"

3. **Create manually**: Use any image editor to create a simple 512x512 icon and resize it to all required sizes

