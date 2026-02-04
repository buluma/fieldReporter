# Design Guidelines

This document outlines the UI/UX design principles and guidelines for the Field Reporter mobile application. The goal is to ensure a consistent, intuitive, and user-friendly experience across all modules and platforms.

## 1. Core Design Principles

-   **Consistency**: Maintain a uniform look, feel, and behavior across all screens and components.
-   **Simplicity**: Keep interfaces clean, uncluttered, and easy to understand. Avoid unnecessary complexity.
-   **Usability**: Design for ease of use, minimizing cognitive load and providing clear feedback for user actions.
-   **Responsiveness**: Ensure the application adapts gracefully to different screen sizes and orientations (portrait/landscape).
-   **Accessibility**: Consider users with diverse needs (e.g., clear typography, sufficient color contrast).

## 2. Visual Elements

### 2.1. Color Palette

-   **Primary Brand Color**: Green (e.g., `#4CAF50` for top bar)
-   **Secondary/Accent Colors**: Used for specific elements like action buttons, active states, or highlight colors (e.g., Light Blue, Orange, Dark Blue for cards).
-   **Text Colors**:
    -   Dark text on light backgrounds: `#333` (main content, headings)
    -   Light text on dark backgrounds: `white`, `#ccc` (navigation, some cards)
    -   Subtle text: `#666`, `#999` (labels, small notes)
-   **Background Color**: Light gray (`#f0f0f0`) for the main application background.
-   **Error/Warning**: Red (`alert-danger`), Orange (`alert-warning`), Green (`alert-success`) for notifications.

### 2.2. Typography

-   **Font Family**: `system-ui, -apple-system, -apple-system-font, 'Segoe UI', 'Roboto', sans-serif;` (Native-like appearance).
-   **Font Sizes**: Consistent hierarchy for headings (`h1`, `h3`, `h4`), body text (`14px`), and smaller text (e.g., `10px` for metadata).
-   **Font Weights**: `bold` for important information, `normal` for general text.

### 2.3. Icons

-   **SVG Icons**: Used for navigation, action buttons, and feature cards (e.g., logout, user, map icons).
-   **Icon Consistency**: Maintain a consistent style (line icons) and size (`24px`, `32px` as appropriate).

## 3. Layout and Structure

### 3.1. Standard Page Layout

All major application pages (`index.html`, `profile.html`, `stores.html`, `activity.html` pages) adhere to a consistent structure:

-   **`sticky-header`**:
    -   **`top-bar`**: Contains the main application title (e.g., "GBC - Stock Monitoring 2.0") and global actions (e.g., logout button). Uses `display: flex; justify-content: space-between;`.
    -   **`top-nav`**: Contains the primary navigation tabs (Home, All Outlets, My Outlets, Data Sync). Uses `display: flex; justify-content: space-around;` for tabs, with `text-align: center;` for tab text.
-   **`scrollable-content`**:
    -   Main content area of the page.
    -   `flex: 1; overflow-y: auto;` to ensure only this section scrolls.
-   **`main-content`**: Padding of `20px` to keep content from edges.

### 3.2. Components

-   **Cards**:
    -   Used for dashboard features (`index.html`) and store activity listings.
    -   `background-color: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`.
    -   Dashboard cards use varying background colors for visual distinction (e.g., `dark-blue`, `light-blue`, `gray`, `green`, `purple`).
-   **List Groups (`.list-group`, `.list-group-item`)**:
    -   Used for displaying lists of information (e.g., store details, login logs, activity records).
    -   Provides a clean, structured way to present data.
-   **Modals (`.modal`, `.modal-dialog`, `.modal-content`)**:
    -   Used for all form inputs (adding/editing stores, adding activity records, editing profile).
    -   Consistent header, body, and footer structure.
-   **Buttons (`.btn`, `.btn-primary`, `.btn-default`, etc.)**:
    -   Standardized button styles for primary actions, secondary actions, and destructive actions.
-   **Forms (`.form-group`, `.form-control`)**:
    -   Standardized layout for form labels and input fields.

## 4. Interaction Design

-   **Navigation**: Clear and intuitive navigation tabs. "Back" buttons are consistently placed for returning to previous screens.
-   **Feedback**:
    -   Loading indicators (e.g., "Loading...").
    -   Success/Error notifications (`.alert`) after form submissions.
    -   `alert()` for critical errors or confirmations.
-   **Data Input**:
    -   Native input types (e.g., `type="number"`, `type="email"`, `type="tel"`) used where appropriate.
    -   Flatpickr for date selection provides a consistent calendar UI.
    -   Textareas for multi-line input.
    -   Dropdowns (`<select>`) for predefined options.

## 5. Specific Page Layouts

-   **Store Details (`store.html`)**:
    -   Displays store information using `.list-group`.
    -   Dynamic "Check In/Out" buttons.
    -   Dynamic, role-based activity menu (`.store-grid-menu`) with icons and record counters.
    -   Visual separator (`<hr>`, `.quick-input-header`) between common and role-specific activities.
-   **Profile Page (`profile.html`)**:
    -   Uses `.list-group` to display user details.
    -   Includes an "Edit Profile" button that triggers a modal.

## 6. Accessibility Considerations

-   Sufficient contrast between text and background colors.
-   Clear labels for all input fields.
-   Semantic HTML structure.

## 7. Responsive Design

-   The application adapts to various screen sizes.
-   Modal dialogs are designed to be mobile-friendly.
-   Grid layouts (`.store-card-container`, `.store-grid-menu`) use `grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))` for flexible scaling.
