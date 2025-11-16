#!/bin/bash
# Simple script to create placeholder PWA icons
# Requires ImageMagick: sudo apt-get install imagemagick (or brew install imagemagick on macOS)

SIZES=(72 96 128 144 152 192 384 512)
COLOR="#FFFFFF"
BG_COLOR="#000000"

echo "Creating placeholder PWA icons..."

for size in "${SIZES[@]}"; do
    # Create a simple icon with a white circle on black background
    convert -size ${size}x${size} xc:"${BG_COLOR}" \
        -fill "${COLOR}" \
        -draw "circle $((size/2)),$((size/2)) $((size/2)),$((size/4))" \
        -font Arial-Bold \
        -pointsize $((size/8)) \
        -fill "${COLOR}" \
        -gravity center \
        -annotate +0+0 "AH" \
        "icon-${size}x${size}.png"
    
    echo "Created icon-${size}x${size}.png"
done

echo "Done! All placeholder icons created."

