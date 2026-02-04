# Field Reporter - Mobile Field Reporting Application

A comprehensive Apache Cordova mobile application designed for field reporting with secure authentication, data persistence, and a modern user interface.

## 🚀 Features

- **Secure Authentication**: User login with password hashing and session management.
- **Role-Based Access**: User roles (`field` or `team-leader`) for differentiated access to features.
- **Local Data Storage**: IndexedDB for offline-capable data persistence across multiple activity modules.
- **Login Activity Tracking**: Detailed logs of all successful login attempts.
- **Outlet Management**: Comprehensive CRUD operations for stores, including location tracking and user assignment.
- **Dynamic Store Menu**: Role-specific quick-input menus with real-time record counters for each activity.
- **Daily Planner**: Plan and track daily store visits and activities.
- **Activity Tracking Modules**:
    - **Availability**: Track product availability status.
    - **Placement**: Track product placement success.
    - **Activation**: Monitor store activation status.
    - **Visibility**: Track brand visibility elements (e.g., branding, signboards).
    - **Objectives (Field Staff)**: Manage field staff objectives and scores.
    - **Other Objectives (Field Staff)**: Track additional objectives for field staff.
    - **TL Focus Areas (Team Leader)**: Define and track monthly focus areas for team leaders.
    - **TL Objectives (Team Leader)**: Manage team leader specific objectives.
    - **Product Listings**: Track specific product listings within stores.
    - **Brand Stocks**: Monitor stock levels, sales, and orders for various brands.
    - **Performance Tracker**: Record weekly performance metrics (RTD, UDV, KBL).
    - **Checklist**: Complete detailed product category checklists.
- **Modern UI**: Consistent card-based interface, modals, and responsive design.
- **Cross-Platform**: Built with Apache Cordova for Android/iOS deployment.
- **Session Management**: Persistent login state during browser sessions.
- **Enhanced Date Pickers**: Integrated Flatpickr for a user-friendly date selection experience.

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

2. (Optional) Set up the backend API:
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
node server.js
```

3. Install Cordova globally:
```bash
npm install -g cordova
```

4. Install project dependencies:
```bash
npm install
```

5. Add target platforms:
```bash
cordova platform add android
cordova platform add ios
```

> The backend uses Prisma with SQLite by default. Update `.env` for other databases or deployment needs.

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
- **Role**: `team-leader`

On first run, the backend automatically creates this default user account (configurable via `SEED_ADMIN_USERNAME` and `SEED_ADMIN_PASSWORD`). In a production environment, you would implement proper user registration.

### Backend API Authentication

The backend API provides simple authentication endpoints (no JWTs):

- `POST /auth/register` (create a user)
- `POST /auth/login` (returns the user profile)
- `GET /me` (requires `x-username` header)

Run the backend locally and point your mobile app to the API base URL.

## 📱 Application Structure & Core Modules

### Main Pages

- **Dashboard (`index.html`)**: Main application dashboard with feature cards
- **Login (`login.html`)**: Secure authentication page
- **Profile (`profile.html`)**: User information and settings with edit capabilities
- **Login Logs (`login-logs.html`)**: Activity tracking for all logins
- **Store List (`stores.html`)**: View all managed outlets.
- **My Store List (`my_stores.html`)**: View outlets assigned to the logged-in user.
- **Store Details (`store.html`)**: Detailed view of a single store with quick-input activity menus and management actions.
- **Maps (`stores_map.html`)**: Displays store locations on a map.
- **Daily Planner (`daily_planner.html`)**: Weekly planning of store visits.
- **Activity Pages**: Dedicated pages for each activity type (e.g., `availability.html`, `placement.html`, `activation.html`, `visibility.html`, `objectives.html`, `other_objectives.html`, `tl_focus.html`, `tl_objectives.html`, `listings.html`, `brands.html`, `performance.html`, `checklist.html`).

### Key Components

- **Database (`js/db.js`)**: Centralized IndexedDB management, schema definition, and helper functions for all data interactions.
- **Authentication (`js/login.js`)**: Login form handling and validation.
- **Application Logic (`js/app.js`, `js/index.js`)**: Main application flow, routing, and shared utilities.

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
