# Code Standards

This document outlines the coding standards and conventions to be followed when contributing to the Field Reporter application. Adhering to these standards ensures code consistency, readability, maintainability, and quality.

## 1. General Principles

-   **Readability**: Code should be easy to understand by other developers.
-   **Maintainability**: Code should be structured for easy modification and extension.
-   **Consistency**: Follow existing patterns and styles within the codebase.
-   **Performance**: Optimize for performance on mobile devices.

## 2. Naming Conventions

-   **Files & Folders**: `kebab-case` (e.g., `my-stores.html`, `daily-planner.js`, `css/stores-map.css`).
-   **Variables & Functions**: `camelCase` (e.g., `currentStore`, `addDailyPlan`, `fetchChecklistRecords`).
-   **Classes/Constructors**: `PascalCase` (e.g., if there were custom classes, not prevalent in current vanilla JS structure).
-   **Constants**: `UPPER_SNAKE_CASE` for global, immutable values (e.g., `DB_NAME`, `USERS_STORE`, `DB_VERSION`).
-   **HTML IDs/Classes**: `kebab-case` or `camelCase` (consistency with existing project, `camelCase` mostly seen).

## 3. JavaScript Standards

-   **Modern JavaScript**: Utilize ES6+ features (`const`, `let`, `arrow functions`, `async/await`, `template literals`).
-   **Asynchronous Operations**:
    -   Prefer `async/await` for handling asynchronous code (IndexedDB, Geolocation).
    -   Wrap Promise-based functions in `try/catch` blocks for robust error handling.
-   **DOM Manipulation**: Use native DOM methods (`document.getElementById`, `document.querySelector`, `addEventListener`, `createElement`, `innerHTML`) instead of external libraries like jQuery.
-   **Modularity**: Logic for each page/feature should reside in its dedicated JavaScript file (e.g., `stores.js` for `stores.html`).
-   **Database Interactions**: All direct IndexedDB operations must go through the helper functions defined in `www/js/db.js`.
-   **Global Variables**: Minimize global variables. Declare variables within the narrowest possible scope. `editingStoreId` is an example of a limited global variable used for modal state management.
-   **Comments**: Add comments to explain complex logic, design decisions, or non-obvious code. Avoid redundant comments that merely rephrase the code. JSDoc comments are encouraged for public functions.

## 4. HTML Standards

-   **Structure**:
    -   Use `sticky-header` for top navigation and actions.
    -   Use `scrollable-content` for the main content area to ensure proper scrolling on mobile devices.
    -   Consistent use of `main-content` and `store-nav-container` for layout.
-   **Accessibility**: Ensure semantic HTML is used.
-   **CSP**: Maintain and update `Content-Security-Policy` meta tags in each HTML file as external resources or new inline scripts/styles are introduced. Avoid inline scripts and styles unless explicitly allowed by CSP (`unsafe-inline`) and absolutely necessary.
-   **Data Attributes**: Use `data-*` attributes for passing information to JavaScript (e.g., `data-id`).

## 5. CSS Standards

-   **Specificity**: Keep CSS rules as unspecific as possible to avoid conflicts.
-   **Reusability**: Prefer class-based selectors over ID selectors for styling reusable components.
-   **Standardized Classes**: Use existing classes like `list-group`, `list-group-item`, `form-group`, `form-control`, `btn` for consistent UI elements.
-   **No Inline Styles**: Avoid inline styles; use classes or IDs and define styles in CSS files. Exceptions are made sparingly for immediate, minor layout adjustments where a new class would be overkill.

## 6. Project-Specific Patterns

-   **Feature Modules**: Each major feature (e.g., Availability, Placement, Brands) has its own `html` and `js` file, following a consistent pattern:
    -   Load data (e.g., `fetchItems`, `loadStores`).
    -   Handle form submission (`saveItem`, `saveStore`).
    -   Manage modals (`showModal`, `hideModal`, `resetForm`).
    -   Utilize `db.js` helper functions for data persistence.
-   **URL Parameters**: Feature pages (`store.html`, `availability.html`) use URL query parameters (e.g., `?id=123&store_name=ABC`) to pass context.
-   **Role-Based UI**: UI elements and menu visibility dynamically adapt based on the `currentUser.assigned` role.
-   **Notifications**: Use the `FormNotification` alert for feedback to the user after form submissions.

## 7. Dependencies

-   **Apache Cordova**: Core framework.
-   **Leaflet**: For interactive maps (`stores_map.html`).
-   **Flatpickr**: For user-friendly date selection (`tl_focus.html`, `daily_planner.html`).
-   **Moment.js**: For date parsing and manipulation (`daily_planner.js`).

## 8. Git Workflow

-   **Branching**: Feature branches should be used for new development.
-   **Commit Messages**: Clear and concise commit messages.
-   **Pull Requests**: Use pull requests for code reviews.

## 9. Testing

-   Basic authentication and data persistence are implied.
-   New features should ideally be accompanied by relevant test cases (current project uses placeholder `npm test`).
