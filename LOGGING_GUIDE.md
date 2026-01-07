# App Logging Guide

## What's Been Set Up

Your React Native app now has comprehensive logging that captures:
- ✅ All console.log, console.error, console.warn messages
- ✅ Firebase authentication operations (register, login, logout)
- ✅ Firestore database operations
- ✅ Auth context state changes
- ✅ Registration form validation and errors

## How to Use It

### 1. **On-Screen Debug Panel** 🐛
When you run your app in development mode:
- A **debug button** (🐛) appears in the bottom-right corner
- Tap it to open the logs panel
- All logs are color-coded by level (error, warn, info, log)
- Tap any log entry to expand and see full details

### 2. **Console Logs**
Logs are still sent to the native console as well:
```bash
# When running: npx react-native start --reset-cache
# Check the terminal output or use Metro Bundler debugger
```

### 3. **Programmatic Access**
If you want to access logs in your code:
```typescript
import { logger } from './src/utils/logger';

// Get all logs
const allLogs = logger.getLogs();

// Get recent logs (last 50)
const recentLogs = logger.getRecentLogs(50);

// Get logs by level
const errorLogs = logger.getLogsByLevel('error');
const warnLogs = logger.getLogsByLevel('warn');

// Export as string
const logsText = logger.exportLogs();

// Clear logs
logger.clearLogs();

// Print all logs to console
logger.printAll();
```

### 4. **Global Access in Debugger**
The logger is globally accessible as `appLogger`:
- In React Native debugger console, type: `appLogger.getLogs()` or `appLogger.printAll()`
- Useful for debugging from the JavaScript debugger

## What You'll See During Registration

When you attempt to register, you'll see:

```
📝 [Registration] Started
🔐 Creating Firebase auth user with email: user@example.com
✅ Firebase auth user created successfully. UID: xyz123
📝 Writing user document to Firestore: {...}
✅ User document successfully written to Firestore
✅ [Registration] Success
```

## Common Firebase Errors (Explained)

If you see errors, the app now maps them to user-friendly messages:

| Firebase Error | User Message |
|---|---|
| `auth/email-already-in-use` | Email is already registered |
| `auth/weak-password` | Password is too weak |
| `auth/invalid-email` | Invalid email address |
| `auth/permission-denied` | Check Firebase Firestore security rules |

## Troubleshooting Tips

### Issue: Registration fails but no error shown
**Solution**: Look in the logs panel. The error code and detailed message will be there.

### Issue: Can't see the debug button
**Solution**: It only appears in development mode (__DEV__). Make sure you're running:
```bash
npx react-native start --reset-cache
```

### Issue: Logs are too many and hard to find issues
**Solution**: 
- Use the Clear button to reset logs before testing
- Use Refresh to get latest logs
- Tap log entries to expand them

### Issue: Need to see exactly what's being sent to Firebase
**Solution**: Look for the "Writing user document to Firestore" log - it shows the exact data being saved.

## Log Levels Explained

- 🔐 **🔐** - Authentication operations (highlighted in messages)
- ✅ **✅** - Success operations
- ❌ **❌** - Errors
- ⚠️ **⚠️** - Warnings
- ℹ️ **ℹ️** - Info
- 🔍 **🔍** - Debug
- 📝 **📝** - General logs

## Firebase Security Rules Issue?

If you see `permission-denied` error during registration, it likely means your Firestore security rules are too restrictive. Check your Firebase Console > Firestore > Rules.

Example permissive rule for development:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## Next Steps

1. **Test registration** - Open the app, go to register, and try signing up
2. **Check logs** - Tap the 🐛 button to see what happened
3. **Review errors** - If it fails, check the error logs for the exact issue
4. **Fix Firebase config** - Common issues: wrong credentials, Firestore rules, network
5. **Remove logs in production** - The debug panel only shows in dev mode automatically

---

Happy debugging! 🚀
