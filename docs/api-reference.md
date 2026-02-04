# API Reference

This document provides a reference for the key JavaScript functions, primarily focusing on the `db.js` module which encapsulates all IndexedDB interactions and acts as the application's data API.

## 1. Global Helper Functions (`www/js/db.js`)

The `db.js` module exposes several asynchronous functions for managing application data. All functions return Promises.

---

### `initDB()`

Initializes and opens the IndexedDB database. Handles schema creation and upgrades. Also responsible for seeding default data (admin user, brands) on first run or upgrade.

-   **Returns**: `Promise<IDBDatabase>` - A Promise that resolves with the IndexedDB database instance.
-   **Throws**: `Error` if the database fails to open or initialize.

```javascript
await initDB();
```

---

### User Management

#### `getAllUsers()`

Retrieves all user records from the `users` object store.

-   **Returns**: `Promise<Array<User>>` - A Promise that resolves with an array of user objects.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const users = await getAllUsers();
console.log(users);
```

#### `getUserById(id)`

Retrieves a single user record by its ID from the `users` object store.

-   **Parameters**:
    -   `id`: `number` - The ID of the user to retrieve.
-   **Returns**: `Promise<User | undefined>` - A Promise that resolves with the user object if found, otherwise `undefined`.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const user = await getUserById(1);
console.log(user);
```

#### `addUser(userData)`

Adds a new user record to the `users` object store. Passwords are hashed before storage.

-   **Parameters**:
    -   `userData`: `object` - An object containing user details (`username`, `password`, `email`, `assigned`).
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the newly added user.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addUser({
    username: 'newuser',
    password: 'securepassword',
    email: 'new@example.com',
    assigned: 'field'
});
```

#### `updateUser(id, userData)`

Updates an existing user record in the `users` object store. Preserves the existing password if `userData.password` is not provided. Hashes the new password if provided.

-   **Parameters**:
    -   `id`: `number` - The ID of the user to update.
    -   `userData`: `object` - An object containing the fields to update (`username`, `email`, `assigned`, `password` (optional)).
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the updated user.
-   **Throws**: `Error` if the database is not initialized, user not found, or update fails.

```javascript
await updateUser(1, { email: 'admin_new@example.com', assigned: 'team-leader' });
```

---

### Authentication & Session Management

#### `authenticateUser(username, password)`

Authenticates a user by checking their username and password against stored credentials. Logs a successful login event.

-   **Parameters**:
    -   `username`: `string` - The username to authenticate.
    -   `password`: `string` - The plain-text password.
-   **Returns**: `Promise<User | null>` - A Promise that resolves with the user object if authentication is successful, otherwise `null`.
-   **Throws**: `Error` if the database is not initialized or an authentication error occurs.

```javascript
const user = await authenticateUser('admin', 'admin123');
if (user) { /* logged in */ }
```

#### `isLoggedIn()`

Checks if a user is currently logged in based on `sessionStorage`.

-   **Returns**: `boolean` - `true` if a user is logged in, `false` otherwise.

```javascript
if (isLoggedIn()) { /* user is active */ }
```

#### `getCurrentUser()`

Retrieves the currently logged-in user's information from `sessionStorage`.

-   **Returns**: `User | null` - The user object if logged in, otherwise `null`.

```javascript
const currentUser = getCurrentUser();
if (currentUser) { console.log(currentUser.username); }
```

#### `logout()`

Logs out the current user by removing their session from `sessionStorage`.

```javascript
logout();
```

---

### Activity Logging

#### `addLoginLog(eventType, userId, username)`

Adds a new login/logout event record to the `loginLog` object store.

-   **Parameters**:
    -   `eventType`: `string` - Type of event (e.g., `'login'`, `'logout'`).
    -   `userId`: `number` - The ID of the user.
    -   `username`: `string` - The username.
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the new log entry.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addLoginLog('login', 1, 'admin');
```

#### `logSuccessfulLogin(userId, username)`

Convenience function to log a successful 'login' event.

-   **Parameters**:
    -   `userId`: `number` - The ID of the user.
    -   `username`: `string` - The username.
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the new log entry.

```javascript
await logSuccessfulLogin(1, 'admin');
```

#### `getUserLoginLogs(username)`

Retrieves login log records for a specific username.

-   **Parameters**:
    -   `username`: `string` - The username to query logs for.
-   **Returns**: `Promise<Array<LoginLog>>` - A Promise that resolves with an array of login log objects.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const logs = await getUserLoginLogs('admin');
```

#### `getAllLoginLogs()`

Retrieves all login log records, sorted by timestamp in descending order.

-   **Returns**: `Promise<Array<LoginLog>>` - A Promise that resolves with an array of all login log objects.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const allLogs = await getAllLoginLogs();
```

---

### Store Management

#### `addStore(storeData)`

Adds a new store record to the `stores` object store.

-   **Parameters**:
    -   `storeData`: `object` - An object containing store details (e.g., `name`, `region`, `latitude`, `longitude`, `userId`).
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the newly added store.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addStore({
    name: 'New Outlet', region: 'East', userId: 1, latitude: 1.23, longitude: 4.56
});
```

#### `getAllStores()`

Retrieves all store records from the `stores` object store.

-   **Returns**: `Promise<Array<Store>>` - A Promise that resolves with an array of store objects.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const stores = await getAllStores();
```

#### `getStoreById(id)`

Retrieves a single store record by its ID from the `stores` object store.

-   **Parameters**:
    -   `id`: `number` - The ID of the store to retrieve.
-   **Returns**: `Promise<Store | undefined>` - A Promise that resolves with the store object if found, otherwise `undefined`.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const store = await getStoreById(1);
```

#### `updateStore(id, storeData)`

Updates an existing store record in the `stores` object store.

-   **Parameters**:
    -   `id`: `number` - The ID of the store to update.
    -   `storeData`: `object` - An object containing the fields to update.
-   **Returns**: `Promise<number>` - A Promise that resolves with the ID of the updated store.
-   **Throws**: `Error` if the database is not initialized or update fails.

```javascript
await updateStore(1, { name: 'Updated Outlet Name' });
```

#### `deleteStore(id)`

Deletes a store record by its ID from the `stores` object store.

-   **Parameters**:
    -   `id`: `number` - The ID of the store to delete.
-   **Returns**: `Promise<void>` - A Promise that resolves when the deletion is successful.
-   **Throws**: `Error` if the database is not initialized or deletion fails.

```javascript
await deleteStore(1);
```

---

### Store Check-in/Check-out

#### `checkInUser(checkinData)`

Records a user check-in event for a store in the `shop_checkin` object store.

-   **Parameters**:
    -   `checkinData`: `object` - Details of the check-in (e.g., `store_id`, `session_id`, `checkin_time`, `checkin_place`, `submitter`).
-   **Returns**: `Promise<number>` - ID of the new check-in record.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await checkInUser({ store_id: 1, session_id: 'abc', ... });
```

#### `checkOutUser(storeId, sessionId, checkoutData)`

Records a user check-out event for an active check-in session.

-   **Parameters**:
    -   `storeId`: `number` - The ID of the store.
    -   `sessionId`: `string` - The unique session ID of the active check-in.
    -   `checkoutData`: `object` - Details of the checkout (e.g., `checkout_place`).
-   **Returns**: `Promise<void>` - Resolves when checkout is successful.
-   **Throws**: `Error` if the database is not initialized, session not found, or update fails.

```javascript
await checkOutUser(1, 'abc', { checkout_place: 'lat,long' });
```

#### `getActiveCheckin(storeId)`

Retrieves the currently active (not checked out) check-in session for a given store.

-   **Parameters**:
    -   `storeId`: `number` - The ID of the store.
-   **Returns**: `Promise<CheckinRecord | null>` - The active check-in record, or `null` if none found.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const activeCheckin = await getActiveCheckin(1);
```

---

### Generic Record Counting

#### `getRecordCountByStore(tableName, storeId)`

Retrieves the number of records for a specific store within a given object store (table).

-   **Parameters**:
    -   `tableName`: `string` - The name of the object store (e.g., `AVAILABILITY_STORE`).
    -   `storeId`: `number` - The ID of the store.
-   **Returns**: `Promise<number>` - The count of records.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const count = await getRecordCountByStore(AVAILABILITY_STORE, 1);
```

---

### Activity-Specific Modules (Pattern: `add[ModuleName]`, `get[ModuleName]ByStore`)

Each activity module (Availability, Placement, Activation, Visibility, TL Focus, TL Objectives, Field Objectives, Other Objectives, Listings, Brands Stock, Performance, Checklist) follows a similar API pattern:

#### `add[ModuleName](data)`

Adds a new record for the specific activity module. Records automatically include `created_on` timestamp.

-   **Parameters**:
    -   `data`: `object` - The data payload for the activity record.
-   **Returns**: `Promise<number>` - ID of the new record.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addAvailability({ store_id: 1, available_wl_1l: 'Yes', ... });
```

#### `get[ModuleName]ByStore(storeId)`

Retrieves all records for a specific activity module and store, sorted by `created_on` in descending order.

-   **Parameters**:
    -   `storeId`: `number` - The ID of the store.
-   **Returns**: `Promise<Array<Record>>` - An array of activity records.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const records = await getPlacementByStore(1);
```

---

### Brands Management

#### `getAllBrands()`

Retrieves all brand records from the `brands` object store.

-   **Returns**: `Promise<Array<Brand>>` - An array of brand objects.
-   **Throws**: `Error` if the database is not initialized or retrieval fails.

```javascript
const brands = await getAllBrands();
```

#### `addBrand(brandData)`

Adds a new brand record to the `brands` object store.

-   **Parameters**:
    -   `brandData`: `object` - An object containing brand details (e.g., `name`).
-   **Returns**: `Promise<number>` - ID of the new brand record.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addBrand({ name: 'New Brand' });
```

---

### Daily Planner

#### `addDailyPlan(planData)`

Adds a new daily plan record to the `daily_planner` object store.

-   **Parameters**:
    -   `planData`: `object` - Details of the daily plan (e.g., `daily_date`, `start_time_input`, `stores_visited`, `submitter`).
-   **Returns**: `Promise<number>` - ID of the new plan record.
-   **Throws**: `Error` if the database is not initialized or addition fails.

```javascript
await addDailyPlan({ daily_date: '2024-01-01', stores_visited: [{id:1,name:'Store A'}], ... });
```

#### `updateDailyPlan(id, planData)`

Updates an existing daily plan record.

-   **Parameters**:
    -   `id`: `number` - The ID of the plan to update.
    -   `planData`: `object` - Fields to update in the plan.
-   **Returns**: `Promise<number>` - ID of the updated plan record.
-   **Throws**: `Error` if the database is not initialized or update fails.

```javascript
await updateDailyPlan(1, { daily_challenges: 'New challenges' });
```

#### `getDailyPlanByDate(date, week, month, year, submitter)`

Retrieves a single daily plan by its date, week, month, year, and submitter.

-   **Parameters**:
    -   `date`: `string` - The date of the plan (e.g., 'YYYY-MM-DD').
    -   `week`: `number` - Week number.
    -   `month`: `number` - Month number (1-12).
    -   `year`: `number` - Year.
    -   `submitter`: `string` - Username of the submitter.
-   **Returns**: `Promise<DailyPlan | null>` - The plan record, or `null` if not found.
-   **Throws**: `Error` if database not initialized.

```javascript
const plan = await getDailyPlanByDate('2024-01-01', 1, 1, 2024, 'admin');
```

#### `getDailyPlans(week, month, year, submitter)`

Retrieves all daily plans for a specific week, month, year, and submitter.

-   **Parameters**:
    -   `week`: `number` - Week number.
    -   `month`: `number` - Month number (1-12).
    -   `year`: `number` - Year.
    -   `submitter`: `string` - Username of the submitter.
-   **Returns**: `Promise<Array<DailyPlan>>` - An array of daily plan records.
-   **Throws**: `Error` if database not initialized.

```javascript
const plans = await getDailyPlans(1, 1, 2024, 'admin');
```

#### `getStoresForDailyPlanSelect()`

Retrieves stores filtered by the current user's role, formatted for a multi-select dropdown.

-   **Returns**: `Promise<Array<{id: number, name: string}>>` - An array of store objects.
-   **Throws**: `Error` if database not initialized.

```javascript
const stores = await getStoresForDailyPlanSelect();
```

---

### Geolocation

#### `getUserLocation()`

Retrieves the user's current geographical location (latitude and longitude). Requires `cordova-plugin-geolocation`.

-   **Returns**: `Promise<{latitude: number, longitude: number}>` - A Promise that resolves with the coordinates.
-   **Throws**: `Error` if geolocation is not supported or permission is denied.

```javascript
const location = await getUserLocation();
```
