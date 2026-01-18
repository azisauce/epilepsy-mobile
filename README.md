# Epilepsy Mobile App

A React Native application for monitoring and helping with epilepsy management, featuring parent-child relationship management through invitation links.

## Prerequisites

Before you begin, make sure you have the following installed:

### Required Software

- **Node.js 22.x** (LTS recommended)
  ```bash
  node --version  # Should show v22.x.x
  ```

- **Java Development Kit (JDK) 17**
  ```bash
  java -version  # Should show version 17
  ```
  - Set `JAVA_HOME` environment variable
  - Add JDK bin directory to your `PATH`

- **Android Studio** (for Android development)
  - Android SDK Platform 33 or higher
  - Android SDK Build-Tools
  - Android Emulator (optional, for testing)

- **Xcode** (for iOS development, macOS only)
  - Xcode 14 or higher
  - CocoaPods: `sudo gem install cocoapods`

### Environment Variables

Add these to your `.bashrc`, `.zshrc`, or equivalent:

```bash
# Java
export JAVA_HOME=/path/to/jdk-17
export PATH=$JAVA_HOME/bin:$PATH

# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

This project uses Firebase for authentication and Firestore. Make sure you have:

- Created a Firebase project
- Added your `google-services.json` to `android/app/`
- Added your `GoogleService-Info.plist` to `ios/`
- Updated Firestore security rules (see `firebase_setup_guide.md`)

### 3. Start Metro Bundler

```bash
npm start
# OR with cache reset
npx react-native start --reset-cache
```

### 4. Run the Application

**Android:**
```bash
npm run android
```

**iOS (macOS only):**
```bash
# First time only: Install CocoaPods dependencies
cd ios && pod install && cd ..

# Run the app
npm run ios
```

## Development

- Press <kbd>R</kbd> twice (Android) or <kbd>R</kbd> once (iOS) to reload
- Press <kbd>Ctrl</kbd>+<kbd>M</kbd> (Android) or <kbd>Cmd</kbd>+<kbd>D</kbd> (iOS) to open developer menu
- Use Chrome DevTools for debugging: `chrome://inspect`

## Troubleshooting

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**Android build issues:**
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

**iOS build issues:**
```bash
cd ios && pod install && cd ..
npm run ios
```

---

## Testing Deep Links (Invitation System)

This app supports deep linking for the invitation feature. Users can share invitation links that open the app directly to the registration screen with the invitation pre-loaded.

### Deep Link Format

```
epilepsy-app://invite/{invitationId}
```

**Example:**
```
epilepsy-app://invite/5Iuc7iRya8x48XSJFMcU
```

### Testing on Android with ADB

While the app is running on a device or emulator, use the following command to test deep links:

```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "epilepsy-app://invite/{invitationId}" \
  com.epilepsy_mobile_app
```

**Real Example:**
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "epilepsy-app://invite/5Iuc7iRya8x48XSJFMcU" \
  com.epilepsy_mobile_app
```


## Quick Commands

```bash
npx react-native start --reset-cache
adb devices
npm run android
```
