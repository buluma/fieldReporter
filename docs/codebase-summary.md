# Codebase Summary

This document provides a high-level summary of the Field Reporter application's codebase, outlining its main components, purpose, and key interactions.

## 1. Core Structure

The application is structured as a standard Apache Cordova project. The primary web assets reside in the `www/` directory.

-   **`www/`**: Contains all client-side code (HTML, CSS, JavaScript, images).
    -   **`www/index.html`**: The application's entry point and main dashboard.
    -   **`www/*.html`**: Individual pages for features like login, profile, store management, daily planning, and various activity tracking modules.
    -   **`www/css/`**: Contains global (`index.css`) and module-specific (`login.css`, `stores.css`, `stores_map.css`) stylesheets.
    -   **`www/img/`**: Stores application images and icons.
    -   **`www/js/`**: Houses all JavaScript logic.

## 2. Key JavaScript Modules

### `www/js/db.js` (Database Layer)
-   **Purpose**: Centralized management of the IndexedDB database (`FieldReporterDB`). Defines the database schema, handles upgrades, and provides all helper functions for data interaction across the application.
-   **Key Features**:
    -   Manages 20+ object stores (e.g., `users`, `stores`, `availability`, `daily_planner`, `brands`, `performance`).
    -   Provides CRUD operations for all entities.
    -   Handles user authentication (hashing, verification).
    -   Includes geolocation utilities (`getUserLocation`).
    -   Manages database versioning for schema changes.

### `www/js/app.js` (Application Core)
-   **Purpose**: Contains global application logic, such as logout functionality, default login redirection, and potentially any other shared utilities.

### `www/js/login.js` (Authentication)
-   **Purpose**: Manages user authentication flow, including form submission, user validation against `db.js`, and session management via `sessionStorage`.

### `www/js/profile.js` (User Profile Management)
-   **Purpose**: Displays the logged-in user's profile information, including user ID, username, email, assigned role, and recent login activity. Provides functionality to edit profile details.

### `www/js/stores.js` / `www/js/my_stores.js` (Store Listing)
-   **Purpose**: These scripts manage the listing and basic interactions for stores.
    -   `stores.js`: Displays all stores.
    -   `my_stores.js`: Displays stores assigned to the current user (role-filtered).
-   **Key Features**: Fetches stores from `db.js`, renders them as interactive cards, and handles navigation to `store.html`.

### `www/js/store.js` (Single Store View & Menu)
-   **Purpose**: Provides a detailed view of a single store and acts as a central hub for all store-related activities.
-   **Key Features**:
    -   Displays comprehensive store information.
    -   Manages check-in/check-out functionality.
    -   Renders a dynamic, role-based menu of activities (e.g., Availability, Placement, Objectives) with real-time record counters.
    -   Includes functionality to edit and delete the store record (restricted to Team Leaders).

### `www/js/stores_map.js` (Map Integration)
-   **Purpose**: Integrates Leaflet to display store locations and the user's current location on a map interface.

### `www/js/daily_planner.js` (Daily Planning)
-   **Purpose**: Allows users to plan and manage their daily store visits and related tasks.
-   **Key Features**: Provides a form for creating new plans (date, time, stores, actions, notes), displays planned activities, and integrates Flatpickr for date selection.

### Activity Modules (`www/js/availability.js`, `www/js/placement.js`, etc.)
-   **Purpose**: Each of these scripts (`availability.js`, `placement.js`, `activation.js`, `visibility.js`, `tl_focus.js`, `tl_objectives.js`, `objectives.js`, `other_objectives.js`, `listings.js`, `brands.js`, `performance.js`, `checklist.js`) is dedicated to managing a specific type of field activity.
-   **Key Features**:
    -   Follows a consistent pattern: fetches records for the current store, renders them in a list, and provides a modal form for adding new entries.
    -   Interacts with `db.js` for data persistence.

## 3. Styling (`www/css/`)

-   **`www/css/index.css`**: Defines global styles, including basic typography, layout for the sticky header and scrollable content, and common UI elements.
-   **`www/css/stores.css`**: Contains styles specific to store cards, modals, and the grid-based activity menus.
-   **`www/css/login.css`**: Styles for the login page.
-   **`www/css/stores_map.css`**: Stylesheets for map integration (e.g., Leaflet overrides).

## 4. Third-Party Libraries

-   **Apache Cordova**: Core framework for hybrid app development.
-   **Leaflet**: Open-source JavaScript library for mobile-friendly interactive maps.
-   **Flatpickr**: Lightweight and powerful date picker.
-   **Moment.js**: JavaScript date library for parsing, validating, manipulating, and formatting dates.

## 5. Build and Deployment

The project uses Cordova CLI for building and deployment to various mobile platforms (Android, iOS). `package.json` manages Node.js dependencies.

This codebase emphasizes modularity, consistency, and a clear separation of concerns, built upon a robust IndexedDB foundation.
