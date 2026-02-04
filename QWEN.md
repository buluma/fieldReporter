# Field Reporter - Apache Cordova Application

## Project Overview

Field Reporter is a comprehensive Apache Cordova mobile application designed for field reporting with secure authentication, extensive data persistence via IndexedDB, and a modern, standardized user interface. The application features user authentication with role-based access, detailed activity tracking across various modules, and a responsive card-based interface.

-   **Name**: fieldReporter
-   **Version**: 1.0.0 (Enhanced)
-   **Platform**: Apache Cordova
-   **Description**: A robust field reporting application with authentication, role-based data tracking, and comprehensive store management capabilities.
-   **Main Entry Point**: index.html (previously index.js for main application logic)

## Project Structure (Expanded)

```
fieldReporter/
├── config.xml
├── package.json
├── QWEN.md
├── README.md
├── www/
│   ├── index.html                  # Main application dashboard
│   ├── login.html                  # User login page
│   ├── profile.html                # User profile with edit capabilities
│   ├── login-logs.html             # Login activity logs
│   ├── stores.html                 # All managed outlets list
│   ├── my_stores.html              # Outlets assigned to the logged-in user
│   ├── store.html                  # Detailed store view with activity menu & management
│   ├── stores_map.html             # Map displaying store locations
│   ├── daily_planner.html          # Weekly planner for store visits
│   ├── availability.html           # Product availability tracking
│   ├── placement.html              # Product placement tracking
│   ├── activation.html             # Store activation status
│   ├── visibility.html             # Brand visibility tracking
│   ├── tl_focus.html               # Team Leader focus areas
│   ├── tl_objectives.html          # Team Leader objectives
│   ├── objectives.html             # Field Staff objectives
│   ├── other_objectives.html       # Other Field Staff objectives
│   ├── listings.html               # Product listings tracking
│   ├── brands.html                 # Brand stocks management
│   ├── performance.html            # Performance tracking
│   ├── checklist.html              # Detailed product category checklist
│   ├── test-setup.html             # Utility for creating test users
│   ├── css/
│   │   ├── index.css               # Main application styles
│   │   ├── login.css               # Login page specific styles
│   │   ├── stores.css              # Store-related and modal styles
│   │   └── stores_map.css          # Map specific styles
│   ├── img/                        # Application images
│   └── js/
│       ├── db.js                   # Centralized IndexedDB operations and schema
│       ├── app.js                  # Shared application logic
│       ├── index.js                # Dashboard logic
│       ├── login.js                # Login page logic
│       ├── profile.js              # User profile logic
│       ├── login-logs.js           # Login logs logic
│       ├── stores.js               # All stores list logic
│       ├── my_stores.js            # My stores list logic
│       ├── store.js                # Individual store view and menu logic
│       ├── stores_map.js           # Map logic
│       ├── daily_planner.js        # Daily planner logic
│       ├── availability.js         # Availability tracking logic
│       ├── placement.js            # Placement tracking logic
│       ├── activation.js           # Activation tracking logic
│       ├── visibility.js           # Visibility tracking logic
│       ├── tl_focus.js             # TL Focus areas logic
│       ├── tl_objectives.js        # TL Objectives logic
│       ├── objectives.js           # Field Objectives logic
│       ├── other_objectives.js     # Other Objectives logic
│       ├── listings.js             # Product listings logic
│       ├── brands.js               # Brand stocks logic
│       └── performance.js          # Performance tracking logic
└── .gitignore
```

## Key Components (Enhanced)

### db.js (IndexedDB Management)
A highly evolved IndexedDB solution, now at `DB_VERSION = 21`, providing:
-   **Dynamic Schema Management**: Supports automatic upgrades (`onupgradeneeded`) for all new object stores.
-   **Comprehensive Data Stores**: Manages `users`, `loginLog`, `stores`, `shop_checkin`, `availability`, `placement`, `activation`, `visibility`, `tl_focus`, `tl_objectives`, `objectives`, `other_objectives`, `listings`, `brands`, `brand_stocks`, `performance`, `daily_planner`, and `checklist`.
-   **Helper Functions**: A rich set of `async` helper functions for CRUD operations, authentication, user management (`getUserById`, `updateUser`), and specialized data retrieval (e.g., `getRecordCountByStore`, `getStoresForDailyPlanSelect`).
-   **Default Data Seeding**: Initializes with a default 'admin' user (team-leader) and a master list of product brands.

### Authentication & Security
-   Secure login with username/password validation and SHA-256 hashing.
-   **Role-Based Access Control**: `assigned` field (`field`/`team-leader`) on user profiles dictates menu visibility and feature access.
-   Session management for login state persistence.
-   Updated Content Security Policy (CSP) to support external resources (e.g., `unpkg.com`, `cdnjs.cloudflare.com`) while maintaining security.

### User Interface (Standardized)
-   Modern card-based dashboard design.
-   **Consistent Layout**: All activity pages follow a standardized `sticky-header`, `scrollable-content`, and modal-based form pattern.
-   Responsive layout for mobile devices.
-   Dynamic store menu with real-time record counters for each activity, tailored by user role.
-   Integrated Flatpickr for enhanced date selection.
-   Improved profile page with edit functionality and a clearer layout.

## Pages (Expanded Functionality)

### index.html (Dashboard)
-   Main entry point with updated navigation tabs and feature cards, including "Weekly Planner" link.

### login.html
-   Authentication page.

### profile.html
-   User profile page displaying `userId`, `username`, `email`, `assigned` role, and `accountCreated` date.
-   Includes an "Edit Profile" modal allowing updates to user details and role.

### login-logs.html
-   Displays recent login activity.

### stores.html (All Outlets)
-   Lists all stores, with card clicks navigating to `store.html` for details/management.

### my_stores.html (My Outlets)
-   Lists stores assigned to the logged-in user. Optimized for adding new stores, with card clicks navigating to `store.html`.

### store.html (Store Details)
-   Detailed view of a selected store.
-   Features dynamic "Check In/Out" functionality with geolocation.
-   Presents a role-based quick-input menu for various activities, displaying record counts.
-   Includes "Edit Outlet" and "Delete Outlet" actions (visible only to `team-leader`).

### stores_map.html
-   Displays store locations and user's location on an OpenStreetMap, with popups for store/user info.

### daily_planner.html
-   Allows users to create, view, and edit daily plans for store visits, including selected stores, times, action items, and notes. Uses Flatpickr for date selection.

### Activity Pages (e.g., availability.html, placement.html, etc.)
-   Each page provides a standardized interface for adding new records via a modal and viewing a list of historical records for the specific store.
-   All records automatically capture submitter, location coordinates, and creation timestamp.

## Key Features (Detailed)

### Data Management
-   **IndexedDB-based Storage**: Persistent local storage for all application data, making the app offline-capable.
-   **User Management**: Full CRUD for users, including an `assigned` role and password hashing.
-   **Store Data**: Tracks name, region, location, address, contact info, associated user, latitude, and longitude.
-   **Transactional Data**: Manages check-ins, availability, placement, activation, visibility, objectives, listings, brands, performance, and daily plans.

### UI/UX
-   **Modular Design**: Consistent modal forms for data input across all activity types.
-   **Informative Displays**: Clear list views for historical records with relevant details and timestamps.
-   **Navigation**: Intuitive top navigation tabs and "Back" buttons for easy flow between pages.
-   **Dynamic Content**: Menus and forms adapt based on user roles and data availability.

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
The application follows Cordova's convention of waiting for the `deviceready` event before using any of Cordova's device APIs.

### Security
-   IndexedDB-based user storage with SHA-256 password hashing.
-   Content Security Policy (CSP) is actively managed and updated to secure external resources while allowing necessary functionality.

### Responsive Design
The CSS includes responsive design considerations for both portrait and landscape orientations.

## Testing

The current package.json includes a placeholder test script. Implement comprehensive tests using frameworks like Jasmine or Mocha for JavaScript code, and end-to-end tests using tools like Appium for mobile-specific functionality.

## Dependencies (Updated)

This project relies on Apache Cordova as the core framework.
-   **Leaflet**: For interactive maps.
-   **Flatpickr**: For user-friendly date selection.
-   **Moment.js**: For date parsing and manipulation.

Additional plugins can be added as needed for specific device functionality.

## License

The code is licensed under the Apache License, Version 2.0, as indicated by the copyright notices in the source files.

## 🆘 Support

If you encounter any issues or have questions, please file an issue in the repository.

---

Built with ❤️ using Apache Cordova