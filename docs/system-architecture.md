# System Architecture

The Field Reporter application follows a client-side, single-page application (SPA) architecture within the Apache Cordova framework. This design emphasizes offline-first capabilities, a responsive user interface, and modular component development.

## 1. High-Level Diagram

```ascii
┌─────────────────────┐                                     ┌─────────────────────┐
│                     │       IndexedDB API & Helpers       │                     │
│  Cordova Webview    │────────────────────────────────────▶│    IndexedDB        │
│ (HTML, CSS, JS)     │                                     │    (FieldReporterDB)│
│                     │◀────────────────────────────────────│                     │
└─────────────────────┘    Data Retrieval & Storage         └─────────────────────┘
       ▲                                 ▲
       │                                 │
       │ WebView Rendering               │ Cordova API (Geolocation)
       │                                 │
┌─────────────────────┐                  │
│                     │                  │
│    Native Device    │◀─────────────────┘
│ (Android/iOS OS)    │
│                     │
└─────────────────────┘
```

## 2. Component Breakdown

### 2.1 Frontend (Cordova Webview)

-   **HTML (`www/*.html`)**:
    -   Serves as the structure for each page.
    -   Follows a standardized layout: `sticky-header` (containing `top-bar` and `top-nav`) and `scrollable-content` for the main view.
    -   Includes external CSS and JavaScript files.
    -   Content Security Policy (CSP) is explicitly defined in each HTML file's `<head>` to manage allowed resources (`script-src`, `style-src`, `img-src`, `default-src`).

-   **CSS (`www/css/*.css`)**:
    -   **`index.css`**: Global styles, typography, fundamental layout (flexbox-based), and shared UI component styling (e.g., `.btn`, `.modal`).
    -   **`stores.css`**: Specific styles for store-related views, cards, and activity menus.
    -   **`login.css`**: Styles unique to the login interface.
    -   **`stores_map.css`**: Styles for the Leaflet map integration.

-   **JavaScript (`www/js/*.js`)**:
    -   **`db.js`**: The most critical module. It encapsulates all interactions with IndexedDB (`FieldReporterDB`).
        -   **Schema Management**: Handles database versioning (`DB_VERSION`) and object store creation/upgrades (`onupgradeneeded`).
        -   **CRUD Operations**: Provides asynchronous helper functions (`async/await`) for adding, retrieving, updating, and deleting records across all 20+ object stores (e.g., `stores`, `users`, `availability`, `daily_planner`).
        -   **Authentication/Authorization**: Implements password hashing, user authentication, and helper functions for session management and user role checking.
        -   **Data Seeding**: Contains logic for seeding initial data like the 'admin' user and a master list of brands.
    -   **`app.js`**: Contains general application-wide logic, event handlers (e.g., logout button), and shared utility functions.
    -   **Page-Specific JS**: Each `www/*.html` page typically has a corresponding `www/js/*.js` file (e.g., `store.js` for `store.html`, `daily_planner.js` for `daily_planner.html`). These scripts handle:
        -   DOM manipulation and event listeners.
        -   Fetching and displaying data using `db.js` helpers.
        -   Form validation and submission.
        -   Module-specific business logic.

### 2.2 Data Persistence (IndexedDB)

-   **`FieldReporterDB`**: The IndexedDB database acts as the single source of truth for all application data on the client side.
-   **Object Stores**: Each major data entity (Users, Stores, Checkins, Availability, etc.) is managed within its own IndexedDB object store.
-   **Indexing**: Object stores are indexed on relevant fields (e.g., `store_id`, `username`, `created_on`) to enable efficient data retrieval.
-   **Transactions**: All database operations are performed within IndexedDB transactions to ensure data integrity.

### 2.3 Cordova Layer

-   **`cordova.js`**: Automatically injected by Cordova, providing the bridge between the WebView and native device APIs.
-   **Plugins**: The application leverages Cordova plugins for device capabilities:
    -   `cordova-plugin-geolocation`: Used for fetching the user's current latitude and longitude (`getUserLocation()` in `db.js`).

### 2.4 Third-Party Libraries

-   **Leaflet**: Used in `stores_map.html` and `stores_map.js` for rendering interactive maps. Loaded via `unpkg.com`.
-   **Flatpickr**: A lightweight date picker integrated into forms like `tl_focus.html` and `daily_planner.html`. Loaded via `unpkg.com`.
-   **Moment.js**: A JavaScript date library for parsing, validating, manipulating, and formatting dates. Loaded via `cdnjs.cloudflare.com`.

## 3. Data Flow

1.  **Initialization**: On `DOMContentLoaded`, `initDB()` in `db.js` is called to open/create the IndexedDB.
2.  **User Authentication**: `login.js` uses `authenticateUser()` from `db.js` to verify credentials.
3.  **Session Management**: `sessionStorage` stores `currentUser` details after successful login.
4.  **Data Display**: Page-specific JS modules (e.g., `store.js`, `availability.js`) fetch data using `db.js` helper functions (e.g., `getStoreById`, `getAvailabilityByStore`) and dynamically update the DOM.
5.  **Data Input**: User input from forms (often within modals) is captured by page-specific JS modules, which then use `db.js` helper functions (e.g., `addStore`, `addAvailability`, `updateUser`) to persist data in IndexedDB.
6.  **Role-Based UI**: `getCurrentUser().assigned` is frequently checked to conditionally render UI elements or filter data.
7.  **Geolocation**: `getUserLocation()` (from `db.js`) integrates with `cordova-plugin-geolocation` to capture location data for activities.

## 4. Scalability and Future Considerations

-   **Modular Design**: The activity modules are designed to be easily extendable with new features by adding corresponding HTML/JS files and `db.js` object stores/helpers.
-   **Offline-First**: The IndexedDB-centric approach ensures the application remains fully functional even without network connectivity.
-   **Synchronization Placeholder**: The "Data Sync" feature is a placeholder, indicating a future direction for synchronizing local IndexedDB data with a remote backend server. This would likely involve an API layer and conflict resolution strategies.
