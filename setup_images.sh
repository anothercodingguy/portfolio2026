#!/bin/bash
# Script to copy your custom profile photo, IEEE logo, and Stealth Startup logo into the portfolio folder.

echo "Copying custom portfolio assets..."

cp "/Users/suyash/.gemini/antigravity-ide/brain/89302ec5-68cb-49c6-b7d8-15d2cab8cf97/media__1782252396434.jpg" ./avatar.png
cp "/Users/suyash/.gemini/antigravity-ide/brain/89302ec5-68cb-49c6-b7d8-15d2cab8cf97/media__1782252408477.png" ./ieee.png
cp "/Users/suyash/.gemini/antigravity-ide/brain/89302ec5-68cb-49c6-b7d8-15d2cab8cf97/media__1782252396050.png" ./stealth.png

echo "Success! Custom assets updated."
