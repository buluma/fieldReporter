// Database configuration
const DB_NAME = 'FieldReporterDB';
const DB_VERSION = 17; // Incremented to force upgrade for missing brand stores
const USERS_STORE = 'users';
const LOGIN_LOG_STORE = 'loginLog';
const STORES_STORE = 'stores'; // New store for outlets
const CHECKIN_STORE = 'shop_checkin'; // New store for check-ins
const AVAILABILITY_STORE = 'availability'; // New store for availability status
const PLACEMENT_STORE = 'placement'; // New store for placement status
const ACTIVATION_STORE = 'activation'; // New store for activation status
const VISIBILITY_STORE = 'visibility'; // New store for visibility status
const TL_FOCUS_STORE = 'tl_focus'; // New store for TL Focus Areas
const TL_OBJECTIVES_STORE = 'tl_objectives'; // New store for TL Objectives
const OBJECTIVES_STORE = 'objectives'; // New store for Field Objectives
const OTHER_OBJECTIVES_STORE = 'other_objectives'; // New store for Other Objectives
const LISTINGS_STORE = 'listings'; // New store for Product Listings
const BRANDS_STORE = 'brands'; // Master list of brands
const BRAND_STOCKS_STORE = 'brand_stocks'; // Brand stock tracking

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
                            email: 'admin@fieldreporter.local',
                            assigned: 'team-leader' // Default admin is a team leader
                        };

                        await addUser(defaultUser);
                        console.log('Default user created successfully');
                    } catch (error) {
                        console.error('Error creating default user:', error);
                    }
                }
            };

            // Seed brands if empty and store exists
            if (db.objectStoreNames.contains(BRANDS_STORE)) {
                const brandsTx = db.transaction([BRANDS_STORE], 'readwrite');
                const brandsStore = brandsTx.objectStore(BRANDS_STORE);
                const brandsCountReq = brandsStore.count();
                brandsCountReq.onsuccess = async () => {
                    if (brandsCountReq.result === 0) {
                        console.log('Seeding brands...');
                        const brands = [
                            'KC Coconut', 'Chrome Lemon', 'Orijin AHS', 'McDowells', 
                            'Tusker Gold', 'Smirnoff Ginsen', 'Chrome RTD', 
                            'William Lawson 1L', 'William Lawson 75cl', 'William Lawson 35cl'
                        ];
                        for (const brand of brands) {
                            brandsStore.add({ name: brand });
                        }
                    }
                };
            }

            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            const transaction = event.target.transaction;

            // ... other stores ...
            
            // Create brands object store if it doesn't exist
            if (!db.objectStoreNames.contains(BRANDS_STORE)) {
                const brandsStore = db.createObjectStore(BRANDS_STORE, { keyPath: 'id', autoIncrement: true });
                brandsStore.createIndex('name', 'name', { unique: true });
                console.log('Brands store created');
                
                // Seed brands using the current transaction
                const brands = [
                    'KC Coconut', 'Chrome Lemon', 'Orijin AHS', 'McDowells', 
                    'Tusker Gold', 'Smirnoff Ginsen', 'Chrome RTD', 
                    'William Lawson 1L', 'William Lawson 75cl', 'William Lawson 35cl'
                ];
                brands.forEach(brand => {
                    brandsStore.add({ name: brand });
                });
            }
            // Create brand_stocks object store if it doesn't exist
            if (!db.objectStoreNames.contains(BRAND_STOCKS_STORE)) {
                const brandStocksStore = db.createObjectStore(BRAND_STOCKS_STORE, { keyPath: 'id', autoIncrement: true });
                brandStocksStore.createIndex('store_id', 'store_id', { unique: false });
                brandStocksStore.createIndex('created_on', 'created_on', { unique: false });
                console.log('Brand Stocks store created');
            }
        };
    });
}

/**
 * Get all users from the database
 */
async function getAllUsers() {
    if (!db) {
        throw new Error('Database not initialized');
    }

    const transaction = db.transaction([USERS_STORE], 'readonly');
    const objectStore = transaction.objectStore(USERS_STORE);

    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            console.error('Error retrieving all users:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Helper function to get user by ID
 */
async function getUserById(id) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    const transaction = db.transaction([USERS_STORE], 'readonly');
    const objectStore = transaction.objectStore(USERS_STORE);
    
    return new Promise((resolve, reject) => {
        const request = objectStore.get(id);
        
        request.onsuccess = () => {
            resolve(request.result);
        };
        
        request.onerror = () => {
            console.error('Error retrieving user:', request.error);
            reject(request.error);
        };
    });
}

/**
 * Update an existing user in the database
 */
async function updateUser(id, userData) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    
    const transaction = db.transaction([USERS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(USERS_STORE);
    
    return new Promise((resolve, reject) => {
        // First get the existing user to preserve password if not changing
        const getRequest = objectStore.get(id);
        
        getRequest.onsuccess = async () => {
            const existingUser = getRequest.result;
            if (!existingUser) {
                reject(new Error('User not found'));
                return;
            }
            
            const updatedUser = { 
                ...existingUser, 
                ...userData,
                id: id // Ensure ID is preserved
            };
            
            // If password is being updated, hash it
            if (userData.password) {
                updatedUser.password = await hashPassword(userData.password);
            }
            
            const putRequest = objectStore.put(updatedUser);
            putRequest.onsuccess = () => {
                console.log('User updated successfully');
                resolve(putRequest.result);
            };
            putRequest.onerror = () => {
                console.error('Error updating user:', putRequest.error);
                reject(putRequest.error);
            };
        };
        
        getRequest.onerror = () => reject(getRequest.error);
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
        assigned: userData.assigned || 'field', // Default to 'field' if not provided
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

/**
 * Check in a user to a store
 */
async function checkInUser(checkinData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([CHECKIN_STORE], 'readwrite');
    const objectStore = transaction.objectStore(CHECKIN_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...checkinData,
            checkout_time: 'none',
            created: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Check out a user from a store
 */
async function checkOutUser(storeId, sessionId, checkoutData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([CHECKIN_STORE], 'readwrite');
    const objectStore = transaction.objectStore(CHECKIN_STORE);
    const index = objectStore.index('session_id');
    
    return new Promise((resolve, reject) => {
        const request = index.get(sessionId);
        request.onsuccess = () => {
            const data = request.result;
            if (data) {
                data.checkout_time = new Date().toISOString();
                data.checkout_place = checkoutData.checkout_place;
                const updateRequest = objectStore.put(data);
                updateRequest.onsuccess = () => resolve();
                updateRequest.onerror = () => reject(updateRequest.error);
            } else {
                reject(new Error('Checkin session not found'));
            }
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get active checkin for a store
 */
async function getActiveCheckin(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([CHECKIN_STORE], 'readonly');
    const objectStore = transaction.objectStore(CHECKIN_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.openCursor(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                if (cursor.value.checkout_time === 'none') {
                    resolve(cursor.value);
                } else {
                    cursor.continue();
                }
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get record count for a store in a specific table
 */
async function getRecordCountByStore(tableName, storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([tableName], 'readonly');
    const objectStore = transaction.objectStore(tableName);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.count(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add availability record
 */
async function addAvailability(availabilityData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([AVAILABILITY_STORE], 'readwrite');
    const objectStore = transaction.objectStore(AVAILABILITY_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...availabilityData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get availability records for a store
 */
async function getAvailabilityByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([AVAILABILITY_STORE], 'readonly');
    const objectStore = transaction.objectStore(AVAILABILITY_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            // Sort by created_on DESC manually as IndexedDB getAll doesn't support sorting
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add placement record
 */
async function addPlacement(placementData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([PLACEMENT_STORE], 'readwrite');
    const objectStore = transaction.objectStore(PLACEMENT_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...placementData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get placement records for a store
 */
async function getPlacementByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([PLACEMENT_STORE], 'readonly');
    const objectStore = transaction.objectStore(PLACEMENT_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add activation record
 */
async function addActivation(activationData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([ACTIVATION_STORE], 'readwrite');
    const objectStore = transaction.objectStore(ACTIVATION_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...activationData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get activation records for a store
 */
async function getActivationByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([ACTIVATION_STORE], 'readonly');
    const objectStore = transaction.objectStore(ACTIVATION_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add visibility record
 */
async function addVisibility(visibilityData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([VISIBILITY_STORE], 'readwrite');
    const objectStore = transaction.objectStore(VISIBILITY_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...visibilityData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get visibility records for a store
 */
async function getVisibilityByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([VISIBILITY_STORE], 'readonly');
    const objectStore = transaction.objectStore(VISIBILITY_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add TL Focus Area record
 */
async function addTLFocus(focusData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([TL_FOCUS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(TL_FOCUS_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...focusData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get TL Focus Area records for a store
 */
async function getTLFocusByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([TL_FOCUS_STORE], 'readonly');
    const objectStore = transaction.objectStore(TL_FOCUS_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add TL Objective record
 */
async function addTLObjective(objectiveData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([TL_OBJECTIVES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(TL_OBJECTIVES_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...objectiveData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get TL Objective records for a store
 */
async function getTLObjectiveByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([TL_OBJECTIVES_STORE], 'readonly');
    const objectStore = transaction.objectStore(TL_OBJECTIVES_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add Objective record
 */
async function addObjective(objectiveData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([OBJECTIVES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(OBJECTIVES_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...objectiveData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get Objective records for a store
 */
async function getObjectivesByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([OBJECTIVES_STORE], 'readonly');
    const objectStore = transaction.objectStore(OBJECTIVES_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add Other Objective record
 */
async function addOtherObjective(objectiveData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([OTHER_OBJECTIVES_STORE], 'readwrite');
    const objectStore = transaction.objectStore(OTHER_OBJECTIVES_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...objectiveData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get Other Objective records for a store
 */
async function getOtherObjectivesByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([OTHER_OBJECTIVES_STORE], 'readonly');
    const objectStore = transaction.objectStore(OTHER_OBJECTIVES_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add Product Listing record
 */
async function addListing(listingData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([LISTINGS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(LISTINGS_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...listingData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get Product Listing records for a store
 */
async function getListingsByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([LISTINGS_STORE], 'readonly');
    const objectStore = transaction.objectStore(LISTINGS_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all brands
 */
async function getAllBrands() {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([BRANDS_STORE], 'readonly');
    const objectStore = transaction.objectStore(BRANDS_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add Brand record
 */
async function addBrand(brandData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([BRANDS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(BRANDS_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add(brandData);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Add Brand Stock record
 */
async function addBrandStock(stockData) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([BRAND_STOCKS_STORE], 'readwrite');
    const objectStore = transaction.objectStore(BRAND_STOCKS_STORE);
    return new Promise((resolve, reject) => {
        const request = objectStore.add({
            ...stockData,
            created_on: new Date().toISOString()
        });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get Brand Stock records for a store
 */
async function getBrandStocksByStore(storeId) {
    if (!db) throw new Error('Database not initialized');
    const transaction = db.transaction([BRAND_STOCKS_STORE], 'readonly');
    const objectStore = transaction.objectStore(BRAND_STOCKS_STORE);
    const index = objectStore.index('store_id');
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.only(parseInt(storeId)));
        request.onsuccess = () => {
            const results = request.result.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Geolocation function to get user's current latitude and longitude.
 */
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(new Error(`Unable to retrieve your location: ${error.message}`));
                }
            );
        }
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