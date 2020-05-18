#!/bin/sh

TMP_FOLDER=poki-package-tmp
ZIP=poki.zip

# Clean up
rm -rf $TMP_FOLDER
rm $ZIP

# Build the JS
make build

# Copy everything into the temporary folder
mkdir $TMP_FOLDER
cp build/index.html $TMP_FOLDER/index.html

# Create the zip
zip $ZIP -r $TMP_FOLDER

# Clean up
# rm -rf $TMP_FOLDER

exit 0
