# Quick Start Guide - Ello iOS App

## 🚀 Get Started in 5 Minutes

### Step 1: Open Xcode
```bash
open -a Xcode
```

### Step 2: Create New Project
1. File → New → Project
2. Choose **iOS → App**
3. Product Name: `Ello`
4. Interface: **SwiftUI**
5. Language: **Swift**
6. Save to: `/Users/s/Desktop/Ello/`

### Step 3: Replace Default Files

**Delete:**
- `ContentView.swift` (in your new project)

**Copy these files into your project:**
From `/Users/s/Desktop/Ello/Ello/` → Your Xcode project:
- `ElloApp.swift`
- `Models.swift`
- `Managers.swift`
- `Views.swift`
- `FrictionUI.swift`
- `FocusScreen.swift`
- `StatsScreen.swift`
- `BottomNavigation.swift`

### Step 4: Add Capabilities
1. Select your project target (top of left sidebar)
2. Click **Signing & Capabilities** tab
3. Click **+ Capability**
4. Add **Family Controls**
5. (Optional) Add **Screen Time API**

### Step 5: Configure Info.plist
Add this to your `Info.plist`:

```xml
<key>NSFamilyControlsUsageDescription</key>
<string>Ello needs access to block distracting apps during focus sessions</string>
```

### Step 6: Run the App
1. Select **iPhone 14 Simulator** (or any iPhone 14+)
2. Press **⌘R** or click **Run** button
3. App will launch in simulator

## 🎯 Test the Features

### 1. Home Screen
- Check the **Focus Ring** shows Level 1
- Tap **Phone**, **Messages** buttons (text-only UI)
- Notice the clean, minimal design

### 2. Focus Mode
- Tap **Focus** tab at bottom
- Click **BEGIN FOCUS**
- Watch the timer count up
- Try toggling some apps to block them
- Click **END SESSION** to earn XP

### 3. Statistics
- Tap **Stats** tab
- See your level progress
- Check streak and session data
- Switch between Day/Week/Month views

## 🛠️ Common Issues & Fixes

### Issue: Build Errors
**Solution:** Make sure all Swift files are added to your target
1. Select each .swift file
2. In File Inspector (right panel)
3. Check "Target Membership" includes your app

### Issue: Family Controls Not Working
**Solution:** This is normal - actual blocking requires iOS device and special permissions
- The UI is ready for when you have proper entitlements
- Works in simulator with simulated blocking

### Issue: Simulator Not Available
**Solution:**
- Xcode → Preferences → Components
- Download iOS 17+ Simulator
- Restart Xcode

### Issue: App Won't Launch
**Solution:**
1. Clean Build Folder (⌘⇧K)
2. Delete Derived Data (Xcode → Settings → Locations)
3. Build again (⌘B)

## 📱 Test on Real Device

### Prerequisites
- iPhone with iOS 16+
- Apple Developer account (free or paid)
- Physical device (simulator has limited capabilities)

### Steps
1. Connect iPhone via USB
2. In Xcode, select your iPhone from device dropdown
3. Sign your app with your Apple ID
4. Build and run
5. Trust developer on iPhone: Settings → General → VPN & Device Management

## 🎓 Learn the Code

### Key Files to Understand

**ElloApp.swift** - App entry point
- Creates managers as environment objects
- Sets up main view hierarchy

**Managers.swift** - Business logic
- FocusManager: Handles focus sessions
- XpManager: Manages XP and levels
- VortexManager: Intensity control

**FrictionUI.swift** - Home screen
- Text-only app buttons
- Focus Ring with progress
- Clean, minimal design

**FocusScreen.swift** - Focus mode
- Start/stop sessions
- App blocking interface
- Shield screen with tips

**StatsScreen.swift** - Progress tracking
- Level and XP display
- Streak and session history
- Statistics grid

## 🔧 Customize the App

### Change Essential Apps
Edit `FrictionUI.swift` line 7-12:

```swift
private let essentialApps = [
    AppInfo(id: "phone", name: "Phone", category: "Essential"),
    AppInfo(id: "messages", name: "Messages", category: "Essential"),
    // Add your own apps here
]
```

### Adjust XP Values
Edit `Managers.swift` line 14-15:

```swift
private let xpPerHour = 10      // XP earned per hour
private let xpPenalty = 20      // XP lost for "cheating"
```

### Add New Quick Tips
Edit `FocusScreen.swift` line 15-21:

```swift
private let quickTips = [
    "Take 3 deep breaths",
    "Drink a glass of water",
    // Add your own tips here
]
```

## 📊 Track Your Progress

The app currently simulates progress. To make it persistent:

### Option 1: UserDefaults (Simple)
```swift
// In XpManager
private func saveProgress() {
    UserDefaults.standard.set(currentXp, forKey: "currentXP")
    UserDefaults.standard.set(level, forKey: "level")
    UserDefaults.standard.set(currentStreak, forKey: "streak")
}
```

### Option 2: Core Data (Robust)
1. Add Core Data model to project
2. Create entities for XP, Level, Streak
3. Implement CRUD operations

## 🚀 Next Steps

1. ✅ **Basic UI:** Done!
2. ⏳ **Real App Blocking:** Requires iOS device and entitlements
3. ⏳ **Data Persistence:** Add UserDefaults or Core Data
4. ⏳ **Notifications:** Add local notifications for reminders
5. ⏳ **App Store:** Prepare for submission

## 💡 Pro Tips

- **Test frequently:** Run in simulator after each change
- **Use breakpoints:** Debug issues with Xcode debugger
- **Preview views:** Use SwiftUI canvas for quick iteration
- **Document changes:** Keep track of what you modify

## 📞 Need Help?

- Check `IMPLEMENTATION_SUMMARY.md` for detailed overview
- See `SETUP.md` for advanced configuration
- Review Apple's SwiftUI documentation
- Join iOS developer communities

---

**Happy coding! 🎉**

Your attention-reclaiming iOS app is ready to build and test!