#!/bin/bash

# Ello iOS App - Open Project Script

PROJECT_PATH="/Users/s/Desktop/Ello/Ello_iOS/Ello.xcodeproj"

echo "🚀 Opening Ello iOS Project in Xcode..."
echo ""

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode not found!"
    echo "Please install Xcode from the Mac App Store:"
    echo "https://apps.apple.com/app/xcode/id497799835"
    exit 1
fi

# Try to open the project
if [ -d "$PROJECT_PATH" ]; then
    open "$PROJECT_PATH"
    echo "✅ Project opened successfully!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Select a simulator (iPhone 14+ recommended)"
    echo "2. Press ⌘R to build and run"
    echo "3. Grant permissions when prompted"
else
    echo "❌ Project file not found at: $PROJECT_PATH"
    exit 1
fi