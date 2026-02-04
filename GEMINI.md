# Field Reporter - Gemini Context

This document provides a comprehensive overview and key contextual information for the Field Reporter Apache Cordova application, serving as a guide for AI agents interacting with the codebase.

## Project Overview

Field Reporter is a robust Apache Cordova mobile application designed for field reporting. It features secure user authentication, extensive data persistence using IndexedDB, and a modern, standardized user interface. The application supports role-based access to features, detailed activity tracking across various modules, and comprehensive store management capabilities.

**Key Features:**
-   **Secure Authentication**: User login with password hashing, session management, and role-based access.
-   **Local Data Storage**: IndexedDB for offline-capable data persistence across multiple activity modules (stores, check-ins, various activity records, daily plans, brands, etc.).
-   **Role-Based Access**: User roles (`field` or `team-leader`) differentiate access to features and menu items.
-   **Outlet Management**: Comprehensive CRUD operations for stores, including location tracking and user assignment.
-   **Dynamic Store Menu**: Role-specific quick-input menus with real-time record counters for each activity.
-   **Activity Tracking Modules**: Standardized modules for Availability, Placement, Activation, Visibility, Objectives (Field/TL), Listings, Brand Stocks, Performance, Daily Planner, and Checklist.
-   **Consistent UI/UX**: Standardized `sticky-header`, `scrollable-content`, and modal-based forms across all pages.
-   **Enhanced Date Pickers**: Flatpickr integration for user-friendly date selection.
-   **CSP Compliance**: Content Security Policy is actively managed for security.

## Architecture

The application follows a client-side architecture typical for Cordova applications:
-   **Frontend**: HTML, CSS, and JavaScript, rendered within a WebView.
-   **Data Layer**: IndexedDB provides local, client-side data storage for offline capabilities. All data interactions are centralized through `www/js/db.js`.
-   **Core Logic**: JavaScript files (`www/js/*.js`) manage UI interactions, data fetching, and business logic.
-   **Cordova**: Provides native device access and packaging for cross-platform deployment.

## Building and Running

The project is a standard Apache Cordova application.

**Prerequisites:**
-   Node.js (v12 or higher)
-   Apache Cordova CLI
-   Platform SDKs (Android Studio for Android, Xcode for iOS)

**Commands:**

-   **Install Cordova CLI (if not already installed):**
    ```bash
    npm install -g cordova
    ```
-   **Add target platforms (e.g., Android):**
    ```bash
    cordova platform add android
    ```
-   **Build the application:**
    ```bash
    cordova build [platform]
    ```
-   **Run on a device/emulator or in browser:**
    ```bash
    cordova run [platform]
    cordova run browser
    ```
-   **Install project dependencies:**
    ```bash
    npm install
    ```

## Development Conventions

-   **Imports**: ES6 `import` syntax is preferred where module bundlers are used, otherwise direct script includes.
-   **Formatting**: 2-space indentation, semi-colons required, trailing commas in multiline arrays/objects, single quotes for strings (inferred from existing code).
-   **Types**: JSDoc comments for public functions (inferred where present).
-   **Naming**:
    -   Files & folders: kebab-case (`daily-planner.js`).
    -   Variables & functions: camelCase.
    -   Classes/Constructors: PascalCase.
    -   Constants: UPPER_SNAKE_CASE (inferred for global constants like `DB_NAME`).
-   **Error Handling**: Async/await calls are wrapped in `try/catch` blocks. Errors are logged to the console and often presented to the user via alerts or notification elements.
-   **Async**: Prefer `async/await` over callbacks.
-   **IndexedDB**: All database interactions are encapsulated in `www/js/db.js`, providing helper functions for common operations. Object stores are versioned through `DB_VERSION`.
-   **UI Rules**: UI updates are primarily handled via direct DOM manipulation within JavaScript files corresponding to HTML pages. Modals are extensively used for form inputs.
-   **No jQuery/Bootstrap JS**: The project has been standardized to remove external JS dependencies like jQuery and Bootstrap's JavaScript components, relying instead on vanilla JavaScript for DOM manipulation and custom CSS for styling (though some Bootstrap CSS classes are still present for layout).
-   **CSP Compliance**: Content Security Policy is a critical constraint; inline scripts and styles are avoided where possible, and allowed external sources are explicitly listed.

## Core Modules and Data Schema

### `www/js/db.js`
The central hub for IndexedDB operations. It defines the database schema and provides helper functions for all application-wide data interactions.

**Key Object Stores (and their indices):**
-   `users`: `id` (keyPath), `username` (unique), `email`, `assigned`
-   `loginLog`: `id` (keyPath), `userId`, `username`, `timestamp`, `eventType`
-   `stores`: `id` (keyPath), `name` (unique), `region`, `userId`, `latitude`, `longitude`
-   `shop_checkin`: `id` (keyPath), `store_id`, `session_id` (unique), `checkout_time`
-   `availability`: `id` (keyPath), `store_id`, `created_on`
-   `placement`: `id` (keyPath), `store_id`, `created_on`
-   `activation`: `id` (keyPath), `store_id`, `created_on`
-   `visibility`: `id` (keyPath), `store_id`, `created_on`
-   `tl_focus`: `id` (keyPath), `store_id`, `created_on`
-   `tl_objectives`: `id` (keyPath), `store_id`, `created_on`
-   `objectives`: `id` (keyPath), `store_id`, `created_on`
-   `other_objectives`: `id` (keyPath), `store_id`, `created_on`
-   `listings`: `id` (keyPath), `store_id`, `created_on`
-   `brands`: `id` (keyPath), `name` (unique) (master list of brands)
-   `brand_stocks`: `id` (keyPath), `store_id`, `created_on`
-   `performance`: `id` (keyPath), `store_id`, `created_on`
-   `daily_planner`: `id` (keyPath), `daily_date`, `week`, `month`, `year`, `submitter`
-   `checklist`: `id` (keyPath), `store_id`, `created_on`

**Global Functions:**
-   `initDB()`: Initializes the database, creates/upgrades stores, and seeds initial data (admin user, brands).
-   `getAllUsers()`, `getUserById(id)`, `addUser(userData)`, `updateUser(id, userData)`: User management.
-   `authenticateUser(username, password)`, `isLoggedIn()`, `getCurrentUser()`, `logout()`: Authentication and session.
-   `addLoginLog()`, `getUserLoginLogs()`, `getAllLoginLogs()`: Login activity.
-   `addStore()`, `getAllStores()`, `getStoreById()`, `updateStore()`, `deleteStore()`: Store management.
-   `checkInUser()`, `checkOutUser()`, `getActiveCheckin()`: Store check-in/out.
-   `getRecordCountByStore(tableName, storeId)`: Generic record counter for store activities.
-   `addAvailability()`, `getAvailabilityByStore()`: Availability module.
-   `addPlacement()`, `getPlacementByStore()`: Placement module.
-   `addActivation()`, `getActivationByStore()`: Activation module.
-   `addVisibility()`, `getVisibilityByStore()`: Visibility module.
-   `addTLFocus()`, `getTLFocusByStore()`: Team Leader Focus module.
-   `addTLObjective()`, `getTLObjectiveByStore()`: Team Leader Objective module.
-   `addObjective()`, `getObjectivesByStore()`: Field Staff Objective module.
-   `addOtherObjective()`, `getOtherObjectivesByStore()`: Other Objectives module.
-   `addListing()`, `getListingsByStore()`: Listings module.
-   `addBrand()`, `getAllBrands()`: Brand management.
-   `addBrandStock()`, `getBrandStocksByStore()`: Brand Stock module.
-   `addPerformance()`, `getPerformanceByStore()`: Performance module.
-   `addDailyPlan()`, `updateDailyPlan()`, `getDailyPlanByDate()`, `getDailyPlans()`, `getStoresForDailyPlanSelect()`: Daily Planner module.
-   `addChecklistRecord()`, `getChecklistRecordsByStore()`: Checklist module.
-   `getUserLocation()`: Geolocation utility.

## Changes Since Last Interaction

This section summarizes recent major enhancements and bug fixes:
-   **User Role Integration**: Added an `assigned` field to users, enabling role-based feature visibility.
-   **Comprehensive Store Management**: Fully integrated `store.html` with detailed view, edit, and delete functionalities for outlets (role-restricted). `stores.html` and `my_stores.html` were standardized to navigate to `store.html`.
-   **New Activity Modules**: Implemented the full suite of activity tracking modules as detailed in "Key Object Stores" above, each with dedicated HTML and JS files (`availability.html/js`, `placement.html/js`, `activation.html/js`, `visibility.html/js`, `tl_focus.html/js`, `tl_objectives.html/js`, `objectives.html/js`, `other_objectives.html/js`, `listings.html/js`, `brands.html/js`, `performance.html/js`, `daily_planner.html/js`, `checklist.html/js`).
-   **Dynamic Store Menu**: The store menu (`store.html`) now dynamically renders common items and role-specific items (e.g., TL Focus/Objectives for Team Leaders, Field Objectives/Other Objectives for Field Staff) with real-time record counters.
-   **Date Picker Integration**: Flatpickr date picker was integrated into relevant forms (`tl_focus.html`, `daily_planner.html`) for improved UX.
-   **Robustness & Bug Fixes**:
    -   Resolved multiple `NotFoundError` issues by ensuring proper `DB_VERSION` increments and correct store creation/seeding logic.
    -   Fixed `ReferenceError: moment is not defined` by correctly loading `moment.js` and updating CSP.
    -   Addressed `InvalidStateError` in date inputs by correctly handling Flatpickr values.
    -   Removed duplicate variable declarations in `db.js`.
    -   Enhanced CSP across various HTML files to allow necessary CDN resources.

---
