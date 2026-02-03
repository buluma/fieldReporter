# Field Reporter - Mobile Field Reporting Application

A comprehensive Apache Cordova mobile application designed for field reporting with secure authentication, data persistence, and a modern user interface.

## 🚀 Features

- **Secure Authentication**: User login with password hashing and session management
- **Local Data Storage**: IndexedDB for offline-capable data persistence
- **Login Activity Tracking**: Detailed logs of all successful login attempts
- **Modern UI**: Card-based interface with responsive design
- **Cross-Platform**: Built with Apache Cordova for Android/iOS deployment
- **Session Management**: Persistent login state during browser sessions

## 📋 Prerequisites

- Node.js (v12 or higher)
- Apache Cordova CLI
- Platform SDKs (Android Studio for Android, Xcode for iOS)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fieldReporter.git
cd fieldReporter
```

2. Install Cordova globally:
```bash
npm install -g cordova
```

3. Install project dependencies:
```bash
npm install
```

4. Add target platforms:
```bash
cordova platform add android
cordova platform add ios
```

## 🏃‍♂️ Running the Application

### For Android:
```bash
cordova run android
```

### For iOS:
```bash
cordova run ios
```

### For Browser Testing:
```bash
cordova run browser
```

## 🔐 Authentication

The application comes with a default user account for development/testing:

- **Username**: `admin`
- **Password**: `admin123`

On first run, the application automatically creates this default user account. In a production environment, you would implement proper user registration.

## 📱 Application Structure

### Main Pages

- **Dashboard (`index.html`)**: Main application dashboard with feature cards
- **Login (`login.html`)**: Secure authentication page
- **Profile (`profile.html`)**: User information and settings
- **Login Logs (`login-logs.html`)**: Activity tracking for all logins
- **Test Setup (`test-setup.html`)**: Utility for creating test users

### Key Components

- **Database (`js/db.js`)**: IndexedDB implementation with user management
- **Authentication (`js/login.js`)**: Login form handling and validation
- **Application Logic (`js/index.js`)**: Main application flow and routing

## 🔧 Development

### Adding Plugins

Add Cordova plugins as needed for device-specific functionality:

```bash
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-geolocation
```

### Building for Production

```bash
cordova build android --release
cordova build ios --release
```

## 🧪 Testing

The application includes basic authentication and data persistence tests. To run tests:

```bash
npm test
```

Note: The default test script is a placeholder. Implement comprehensive tests using frameworks like Jasmine or Mocha.

## 🚢 Deployment

1. Build for release:
```bash
cordova build android --release
```

2. Sign the APK/IPA for distribution

3. Deploy to respective app stores or distribute directly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions, please file an issue in the repository.

---

Built with ❤️ using Apache Cordova