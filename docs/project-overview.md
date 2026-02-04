# Project Overview

## Purpose
The Field Reporter mobile application is a comprehensive tool designed to streamline field reporting activities for staff. It provides a robust platform for managing store information, tracking various in-store activities (e.g., product availability, placement, brand visibility, performance), planning daily routes, and facilitating communication between field staff and team leaders. The application aims to enhance data collection accuracy, improve operational efficiency, and provide real-time insights into field operations.

## Key Features
-   **Secure Authentication**: User login with password hashing, session management, and role-based access.
-   **Local Data Storage**: IndexedDB for offline-capable data persistence across multiple activity modules.
-   **Role-Based Access**: User roles (`field` or `team-leader`) differentiate access to features and menu items.
-   **Outlet Management**: Comprehensive CRUD operations for stores, including location tracking and user assignment.
-   **Dynamic Store Menu**: Role-specific quick-input menus with real-time record counters for each activity.
-   **Activity Tracking Modules**:
    -   Availability
    -   Placement
    -   Activation
    -   Visibility
    -   Objectives (Field Staff & Team Leader)
    -   Listings
    -   Brand Stocks
    -   Performance
    -   Daily Planner
    -   Checklist
-   **Consistent UI/UX**: Standardized `sticky-header`, `scrollable-content`, and modal-based forms across all pages.
-   **Enhanced Date Pickers**: Flatpickr integration for user-friendly date selection.
-   **CSP Compliance**: Content Security Policy is actively managed for security.

## High-Level Requirements
-   **User Management**: Ability to add, authenticate, and manage users with assigned roles.
-   **Store Management**: Functionality to add, view, edit, and delete store records with geolocation data.
-   **Activity Logging**: Record and track various field activities per store, categorized by modules.
-   **Offline Capability**: All data operations must be functional offline using IndexedDB.
-   **Role-Based Views**: Display relevant features and data based on the logged-in user's role.
-   **Intuitive Interface**: Easy-to-use and consistent user interface across all modules.
-   **Data Synchronization (Future)**: Placeholder for future implementation of data synchronization with a remote server.
-   **Cross-Platform Deployment**: Deployable on Android and iOS devices via Apache Cordova.
