// Database configuration
const DB_NAME = 'FieldReporterDB';
const DB_VERSION = 3; // Incremented to allow for schema changes
const USERS_STORE = 'users';
const LOGIN_LOG_STORE = 'loginLog';
const STORES_STORE = 'stores'; // New store for outlets

let db;

/**
 * Initialize the IndexedDB database
 */
function initDB() {
    return new Promise(async (resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };

        request.onsuccess = async () => {
            db = request.result;
            console.log('Database opened successfully');

            // Check if this is the first time the database is opened (no users exist)
            const transaction = db.transaction([USERS_STORE], 'readonly');
            const objectStore = transaction.objectStore(USERS_STORE);
            const countRequest = objectStore.count();

            countRequest.onsuccess = async () => {
                if (countRequest.result === 0) {
                    // No users exist, create a default user
                    console.log('No users found, creating default user...');
                    try {
                        const defaultUser = {
                            username: 'admin',
                            password: 'admin123',
                            email: 'admin@fieldreporter.local'
                        };

                        await addUser(defaultUser);
                        console.log('Default user created successfully');
                    } catch (error) {
                        console.error('Error creating default user:', error);
                    }
                }
            };

            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create users object store if it doesn't exist
            if (!db.objectStoreNames.contains(USERS_STORE)) {
                const objectStore = db.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('username', 'username', { unique: true });
                objectStore.createIndex('email', 'email', { unique: false });
                console.log('Users store created');
            }

            // Create login log object store if it doesn't exist
            if (!db.objectStoreNames.contains(LOGIN_LOG_STORE)) {
                const loginLogStore = db.createObjectStore(LOGIN_LOG_STORE, { keyPath: 'id', autoIncrement: true });
                loginLogStore.createIndex('userId', 'userId', { unique: false });
                loginLogStore.createIndex('username', 'username', { unique: false });
                loginLogStore.createIndex('timestamp', 'timestamp', { unique: false });
                console.log('Login log store created');
            }

            // Create stores object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORES_STORE)) {
                const storesStore = db.createObjectStore(STORES_STORE, { keyPath: 'id', autoIncrement: true });
                storesStore.createIndex('name', 'name', { unique: true });
                storesStore.createIndex('region', 'region', { unique: false });
                console.log('Stores store created');
            }
        };
    });
}

/**
 * Add a new user to the database
 */
async function addUser(userData) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    // Hash the password before storing
    const hashedPassword = await hashPassword(userData.password);
    
    const transaction = db.transaction([USERS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(USERS_STORE);
    
    const user = {
        username: userData.username,
        email: userData.email || '',
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
        const request = objectStore.add(user);
        
        request.onsuccess = () => {
            console.log('User added successfully');
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Error adding user:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Authenticate a user by username and password
 */
async function authenticateUser(username, password) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([USERS_STORE], 'readonly');
    const objectStore = transaction.objectStore(USERS_STORE);
    const index = objectStore.index('username');

    return new Promise(async (resolve, reject) => {
        const request = index.get(username);

        request.onsuccess = async () => {
            if (request.result) {
                // Compare the provided password with the stored hash
                const isValid = await verifyPassword(password, request.result.password);

                if (isValid) {
                    console.log('Authentication successful');
                    // Store user info in session for the current session
                    sessionStorage.setItem('currentUser', JSON.stringify({
                        id: request.result.id,
                        username: request.result.username,
                        email: request.result.email
                    }));

                    // Log the successful login
                    try {
                        await logSuccessfulLogin(request.result.id, request.result.username);
                        console.log('Login logged successfully');
                    } catch (logError) {
                        console.error('Error logging login:', logError);
                        // Still resolve with user data even if logging fails
                    }

                    resolve(request.result);
                } else {
                    console.log('Invalid password');
                    resolve(null);
                }
            } else {
                console.log('User not found');
                resolve(null);
            }
        };

        request.onerror = () => {
            console.error('Error authenticating user:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Simple password hashing function (in a real app, use a stronger algorithm)
 */
async function hashPassword(password) {
    // Using a simple approach for demo purposes
    // In a real application, use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Verify a password against its hash
 */
async function verifyPassword(password, hash) {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

/**
 * Check if a user is currently logged in
 */
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

/**
 * Get the current logged in user
 */
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Logout the current user
 */
function logout() {
    sessionStorage.removeItem('currentUser');
}

/**
 * Log a login/logout event
 */
async function addLoginLog(eventType, userId, username) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([LOGIN_LOG_STORE], 'readwrite');
    const objectStore = transaction.objectStore(LOGIN_LOG_STORE);

    const logRecord = {
        userId: userId,
        username: username,
        timestamp: new Date().toISOString(),
        eventType: eventType
    };

    return new Promise((resolve, reject) => {
        const request = objectStore.add(logRecord);

        request.onsuccess = () => {
            console.log(`Event '${eventType}' logged successfully`);
            resolve(request.result);
        };

        request.onerror = () => {
            console.error(`Error logging event '${eventType}':`, request.error);
            reject(request.error);
        };
    });
}

/**
 * Log a successful login attempt
 */
async function logSuccessfulLogin(userId, username) {
    return addLoginLog('login', userId, username);
}

/**
 * Get login logs for a specific user
 */
async function getUserLoginLogs(username) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([LOGIN_LOG_STORE], 'readonly');
    const objectStore = transaction.objectStore(LOGIN_LOG_STORE);
    const index = objectStore.index('username');

    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(username));

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error retrieving login logs:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get all login logs (for admin purposes)
 */
async function getAllLoginLogs() {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([LOGIN_LOG_STORE], 'readonly');
    const objectStore = transaction.objectStore(LOGIN_LOG_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();

        request.onsuccess = () => {
            // Sort by timestamp, newest first
            const logs = request.result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            resolve(logs);
        };

        request.onerror = () => {
            console.error('Error retrieving all login logs:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Add a new store to the database
 */
async function addStore(storeData) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([STORES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(STORES_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.add(storeData);

        request.onsuccess = () => {
            console.log('Store added successfully');
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error adding store:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get all stores from the database
 */
async function getAllStores() {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([STORES_STORE], 'readonly');
    const objectStore = transaction.objectStore(STORES_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error retrieving stores:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Get a store by ID from the database
 */
async function getStoreById(id) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([STORES_STORE], 'readonly');
    const objectStore = transaction.objectStore(STORES_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error retrieving store by ID:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Update an existing store in the database
 */
async function updateStore(id, storeData) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([STORES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(STORES_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.put({ ...storeData, id: id }); // Ensure ID is part of the object for put

        request.onsuccess = () => {
            console.log('Store updated successfully');
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error updating store:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Delete a store from the database
 */
async function deleteStore(id) {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([STORES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(STORES_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            console.log('Store deleted successfully');
            resolve();
        };

        request.onerror = () => {
            console.error('Error deleting store:', request.error);
            reject(request.error);
        };
    });
}

// Initialize the database when the script loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});