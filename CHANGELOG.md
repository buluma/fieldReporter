# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive feature development for Field Reporter application, including:
  - User role management (`field`, `team-leader`)
  - Standardized UI/UX across all pages
  - Extensive IndexedDB integration for local data storage across 20+ object stores (stores, check-ins, activity modules, daily planner, brands, performance, checklist)
  - Role-based dynamic store menu with record counters
  - Full CRUD for stores with edit/delete restricted to team-leaders
  - Check-in/check-out functionality per store
  - Dedicated modules for Availability, Placement, Activation, Visibility, Objectives (Field/TL), Listings, Brand Stocks, Performance, Daily Planner, and Checklist
  - Flatpickr date picker integration
  - Comprehensive documentation suite (GEMINI.md, README.md, QWEN.md, docs/)

### Fixed
- Multiple `NotFoundError` issues related to IndexedDB store creation/access.
- `ReferenceError: moment is not defined` by correctly loading `moment.js` and updating CSP.
- `InvalidStateError` in date inputs by handling Flatpickr values correctly.
- Removed duplicate variable declarations in `db.js`.
- Addressed CSP violations by updating `script-src` directives.

### Changed
- Standardized `www/stores.html` to align with `my_stores.html` navigation pattern.
- Refactored `store.html` to be a central hub for store details and activities.
- Updated all HTML headers (`top-nav`) for consistency across pages.
- Moved `www/weekly-day.html` to `www/daily_planner.html` and `www/js/dailyplan.js` to `www/js/daily_planner.js`.

### Removed
- External jQuery and Bootstrap JS dependencies, relying on vanilla JavaScript.

## [0.1.0] - 2026-02-04

### Added
- Initial project setup with Apache Cordova.
- User authentication with `admin`/`admin123` default user.
- Basic IndexedDB for user and login log management.
- Dashboard (`index.html`), Login (`login.html`), Profile (`profile.html`), Login Logs (`login-logs.html`), Test Setup (`test-setup.html`) pages.
- Cordova build and run scripts.
