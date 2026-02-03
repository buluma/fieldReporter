# Field Reporter - Apache Cordova Application

## Project Overview

Field Reporter is a comprehensive Apache Cordova application that demonstrates a complete mobile application with authentication, data persistence, and a modern UI. The application features user authentication with IndexedDB for local storage, login activity tracking, and a responsive card-based interface.

- **Name**: fieldReporter
- **Version**: 1.0.0
- **Platform**: Apache Cordova
- **Description**: A field reporting application with authentication and data tracking capabilities
- **Main Entry Point**: index.js

## Project Structure

```
fieldReporter/
├── config.xml              # Cordova configuration file
├── package.json            # Node.js package manifest
├── QWEN.md                 # Project documentation
├── www/                    # Web assets directory
│   ├── index.html          # Main application dashboard
│   ├── login.html          # Login page
│   ├── profile.html        # User profile page
│   ├── login-logs.html     # Login activity logs page
│   ├── test-setup.html     # Test user setup utility
│   ├── css/
│   │   ├── index.css       # Main application styles
│   │   └── login.css       # Login page specific styles
│   ├── img/
│   │   └── logo.png        # Application logo
│   └── js/
│       ├── db.js           # IndexedDB database operations
│       ├── index.js        # Main application logic
│       └── login.js        # Login page specific logic
└── .gitignore              # Git ignore rules
```

## Key Components

### config.xml
This is the Cordova configuration file that defines the application's metadata, including its ID, name, description, and content security policies. The widget ID is `org.apache.cordova.fieldReporter`.

### package.json
Contains the Node.js package information for the Cordova application, including:
- Name: `org.apache.cordova.fieldreporter`
- Display Name: `fieldReporter`
- Version: `1.0.0`
- Scripts: Basic test script
- Keywords: `ecosystem:cordova`

### Database Layer (db.js)
Implements a comprehensive IndexedDB solution with:
- User authentication and management
- Password hashing using SHA-256
- Login activity logging
- Automatic creation of default 'admin' user on first run
- Session management using sessionStorage

### Authentication System
- Secure login with username/password validation
- Automatic redirection to login for unauthenticated users
- Session persistence during browser sessions
- Default credentials: admin/admin123 (for development/testing)

### User Interface
- Modern card-based dashboard design
- Responsive layout for mobile devices
- Consistent navigation across pages
- Dark mode support
- Intuitive user experience

## Pages

### index.html (Dashboard)
The main application dashboard featuring:
- Top navigation bar with tabs
- User information display with date
- Four main function cards:
  * My Field Reports (dark blue)
  * Report Scheduler (light blue)
  * Location Manager (gray)
  * Data Synchronization (green)
- Login Activity card linking to logs
- Bottom navigation bar

### login.html
The authentication page with:
- Username and password fields
- Form validation
- Error messaging
- Default credentials pre-filled for development
- Registration link placeholder

### profile.html
The user profile page showing:
- User ID, username, email, and account creation date
- Recent login activity
- Back to home navigation

### login-logs.html
The login activity logs page displaying:
- Table of all successful login attempts
- Timestamps and user information
- Export functionality

## Key Features

### Authentication & Security
- IndexedDB-based user storage
- SHA-256 password hashing
- Session management
- Automatic default user creation
- Secure login flow

### Data Management
- Client-side data persistence using IndexedDB
- User management system
- Login activity tracking
- Session state management

### UI/UX
- Modern card-based interface
- Responsive design for mobile devices
- Consistent navigation patterns
- Visual feedback and error handling
- Dark mode support

## Building and Running

To build and run this Cordova application, you'll need to have Cordova installed globally:

```bash
# Install Cordova CLI globally
npm install -g cordova

# Add platforms (Android, iOS, etc.)
cordova platform add android
cordova platform add ios

# Build the application
cordova build

# Run on a device or emulator
cordova run android
cordova run ios
```

## Development Conventions

### Event Handling
The application follows Cordova's convention of waiting for the `deviceready` event before using any of Cordova's device APIs. This ensures that all Cordova plugins and APIs are properly loaded before they're used.

### Security
The application implements Content Security Policy (CSP) to mitigate risks of XSS vulnerabilities. Passwords are hashed before storage using SHA-256 algorithm.

### Responsive Design
The CSS includes responsive design considerations for both portrait and landscape orientations, with special handling for devices with notches or other "unsafe" areas.

## Testing

The current package.json includes a placeholder test script. To add actual tests:

```bash
# The current test script is just a placeholder
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

Consider implementing unit tests using frameworks like Jasmine or Mocha for JavaScript code, and end-to-end tests using tools like Appium for mobile-specific functionality.

## Dependencies

This project relies on Apache Cordova as the core framework. Additional plugins can be added as needed for specific device functionality (camera, geolocation, contacts, etc.).

## License

The code is licensed under the Apache License, Version 2.0, as indicated by the copyright notices in the source files.