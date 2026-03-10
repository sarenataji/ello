# Ello - Digital Detox Launcher iOS App

## Purpose
In an era of "infinite scrolling" and notification overload, Ello reclaims your attention by removing visual triggers (colorful icons, badges, and complex layouts) that cause habitual phone usage.

## Core Features

### 1. Friction UI (Home Screen)
- Text-only list of essential tools (Phone, Messages, Maps, etc.)
- Brain processes text slower than colorful images, adding "positive friction"
- Forces conscious thinking before tapping, breaking "zombie-scrolling" reflex

### 2. Gamified Focus XP System
- Ring in center tracks "Focus XP" (Experience Points)
- Earn points for every hour away from distracting apps
- Lose points if you "cheat" and open a blocked app
- Turns willpower into a visible, rewarding game

### 3. Active Shield (App Blocking)
- When you tap "BEGIN FOCUS," activates system-level block on non-essential apps
- Uses Apple's ManagedSettings to physically prevent distracting apps from opening
- Intercepts with a "Shield Screen" featuring "Quick Tips" to snap back to reality

### 4. Pattern Interrupts (Quick Tips)
- When you hit a block, shows a "Universal Tip" (breathing exercise, drink water reminder)
- Replaces negative "No" with positive "Life Anchor"
- Helps reset mental state

## Project Structure

```
Ello/
├── Ello/
│   ├── ElloApp.swift          # Main app entry point
│   ├── Models.swift           # Data models and app catalog
│   ├── Managers.swift         # Focus, XP, and Vortex managers
│   ├── Views.swift            # Root layout and navigation
│   ├── FrictionUI.swift       # Text-only home screen
│   ├── FocusScreen.swift      # Focus session and app blocking
│   ├── StatsScreen.swift      # Progress tracking and statistics
│   └── BottomNavigation.swift # Tab navigation
├── Package.swift              # Swift package definition
└── README.md                  # This file
```

## Setting Up as an iOS App

### Option 1: Using Xcode (Recommended)

1. **Create new Xcode project:**
   - Open Xcode
   - File → New → Project
   - Choose "App" under iOS tab
   - Product Name: "Ello"
   - Interface: SwiftUI
   - Language: Swift
   - Save to `/Users/s/Desktop/Ello/Ello.xcodeproj`

2. **Replace default files:**
   - Delete the default `ContentView.swift`
   - Copy all `.swift` files from the `Ello/` directory to your Xcode project's main source folder
   - Replace the contents of `ElloApp.swift` with our version

3. **Add required capabilities:**
   - Select your project target
   - Go to "Signing & Capabilities"
   - Add "Family Controls" capability (for app blocking)
   - Add "Screen Time API" if available in your Xcode version

4. **Configure Info.plist:**
   - Add privacy descriptions if needed
   - Ensure minimum iOS version is set to 16.0 or higher

5. **Build and run:**
   - Select a simulator (iPhone 14 or later recommended)
   - Press ⌘R or click Run button
   - Grant necessary permissions when prompted

### Option 2: Using Swift Package Manager

```bash
# Navigate to project directory
cd /Users/s/Desktop/Ello

# Build the package
swift build

# Run tests (when available)
swift test
```

### Option 3: Using iOS App Template

Create a proper iOS app structure:

```bash
# Create iOS app directory structure
mkdir -p Ello_iOS/Ello
cd Ello_iOS

# Initialize git repository
git init

# Copy Swift files
cp -r ../Ello/*.swift Ello/

# Create Info.plist, entitlements, and other iOS-specific files
# (This requires manual setup in Xcode)
```

## Key Dependencies

### System Frameworks
- `SwiftUI` - Modern declarative UI framework
- `FamilyControls` - For app blocking and screen time management
- `Foundation` - Core functionality

### No Third-Party Dependencies Required
All UI components are built using native SwiftUI for maximum performance and iOS integration.

## Permissions Required

The app requires the following iOS permissions:

1. **Family Controls** - To block distracting apps
2. **Screen Time API** - To track app usage and focus time
3. **Notifications** - Optional, for focus session reminders

Add these to your `Info.plist`:

```xml
<key>NSFamilyControlsUsageDescription</key>
<string>Ello needs access to block distracting apps during focus sessions</string>
```

## Development Notes

### Current Implementation Status

✅ **Implemented:**
- Friction UI with text-only app buttons
- Focus XP system with level progression
- Focus session timer
- Basic app blocking interface
- Statistics screen with progress tracking
- Bottom navigation

⚠️ **Requires iOS Integration:**
- Actual system-level app blocking (ManagedSettings)
- Screen Time API integration
- Background focus tracking
- Persistent data storage

### To Run in Xcode Simulator:

1. Open Xcode
2. File → Open → Select the project file
3. Choose iOS Simulator (iPhone 14+)
4. Click Run or press ⌘R

### Known Limitations

- App blocking is simulated in current implementation
- XP data is not persisted between sessions
- Screen Time API requires iOS 16+ and proper entitlements
- Some Family Controls features require special Apple developer permissions

## Testing

To test the app functionality:

1. **Home Screen:**
   - Verify text-only app buttons work
   - Check Focus Ring displays correct level and XP

2. **Focus Mode:**
   - Tap "BEGIN FOCUS" to start session
   - Verify timer counts up
   - Try toggling app blocking
   - End session and check XP increases

3. **Statistics:**
   - Review level progress
   - Check streak and session data
   - Switch between Day/Week/Month views

## Future Enhancements

- [ ] Implement actual ManagedSettings for app blocking
- [ ] Add Core Data persistence for XP and streaks
- [ ] Integrate Screen Time API for real usage tracking
- [ ] Add haptic feedback for interactions
- [ ] Implement custom notifications
- [ ] Add more quick tips and breathing exercises
- [ ] Create focus streak sharing functionality
- [ ] Add dark/light mode support
- [ ] Implement Focus Filters for specific app categories

## License

This project is created as a demonstration of digital wellbeing concepts.

## Credits

Concept inspired by digital wellbeing and attention research. Built with SwiftUI for optimal iOS integration and performance.