# CompanyBull Mobile: Production-Ready Employee Portal

Experience the future of HR Management with **CompanyBull**, a high-performance, **Neo-brutalism** inspired mobile application for Android. Built with React Native and Expo, this app is fully synchronized with a live Node.js/MongoDB backend.

## 🚀 Key Features

- **🔐 Real JWT Authentication**: Secure sessions powered by JSON Web Tokens and Bcrypt password hashing.
- **✨ Magic-Fill Demo Logins**: Dedicated buttons for Admin, HR, Manager, and Employee that auto-fill credentials and sign in instantly for rapid testing.
- **💾 Persistent Sessions**: Uses `expo-secure-store` to keep you logged in securely across app restarts.
- **📱 Safe-Area Optimized**: Dynamic top and bottom padding to handle Android status bars and system navigation buttons perfectly.
- **🏖️ Leave Management**: Submit, track, and view real-time history of leave requests.
- **🕒 Attendance Sync**: Real-time clock-in/out with instant synchronization to the web HR dashboard.
- **🌗 Neo-Brutalism UI**: Stunning, high-contrast aesthetics with bold borders (#0d0d0d), vibrant purple (#863ceb), and bright yellow (#f6d140).

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Navigation**: Expo Router (File-based)
- **Network**: Axios with JWT Interceptors
- **Storage**: Expo SecureStore
- **Styling**: Native StyleSheet with Neo-brutalism design tokens

## 📦 Installation & Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Configure API**:
   Update the `API_URL` in `src/api/client.js` to match your local network IP (e.g., `http://192.168.x.x:5000/api`).

3. **Launch**:
   ```bash
   npx expo start
   ```

## 🛡️ Security

- **Encryption**: All passwords are hashed using Bcrypt (10 rounds).
- **Tokens**: 30-day JWT sessions with automatic Bearer token injection.
- **Privacy**: No sensitive navigation data is stored in plain text.

---
Built with ⚡ by [developer-yasir](https://github.com/developer-yasir)
