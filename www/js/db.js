// Database configuration
const DB_NAME = 'FieldReporterDB';
const DB_VERSION = 1;
const USERS_STORE = 'users';

let db;

/**
 * Initialize the IndexedDB database
 */
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database error:', request.error);
            reject(request.error);
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
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
    
    return new Promise((resolve, reject) => {
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

// Initialize the database when the script loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});