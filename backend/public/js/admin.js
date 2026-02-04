document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const dashboardContent = document.getElementById('dashboard-content');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginMessage = document.getElementById('login-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const usersTableBody = document.getElementById('users-table-body');
    const storesTableBody = document.getElementById('stores-table-body');

    const API_BASE_URL = window.location.origin; // Dynamically get base URL

    let authToken = localStorage.getItem('authToken');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const toggleVisibility = () => {
        if (authToken && currentUser) {
            loginForm.classList.add('hidden');
            dashboardContent.classList.remove('hidden');
            welcomeMessage.textContent = `Welcome, ${currentUser.username} (${currentUser.role})!`;
            fetchData();
        } else {
            loginForm.classList.remove('hidden');
            dashboardContent.classList.add('hidden');
            usersTableBody.innerHTML = '';
            storesTableBody.innerHTML = '';
        }
    };

    const fetchData = async () => {
        if (!authToken) return;

        // Fetch users
        try {
            const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (usersResponse.ok) {
                const users = await usersResponse.json();
                renderUsers(users);
            } else {
                handleAuthError(usersResponse);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            loginMessage.textContent = 'Error fetching user data.';
        }

        // Fetch stores
        try {
            const storesResponse = await fetch(`${API_BASE_URL}/api/stores`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (storesResponse.ok) {
                const stores = await storesResponse.json();
                renderStores(stores);
            } else {
                handleAuthError(storesResponse);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
            loginMessage.textContent = 'Error fetching store data.';
        }
    };

    const renderUsers = (users) => {
        usersTableBody.innerHTML = '';
        users.forEach(user => {
            const row = usersTableBody.insertRow();
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.username;
            row.insertCell().textContent = user.role;
            row.insertCell().textContent = new Date(user.createdAt).toLocaleString();
        });
    };

    const renderStores = (stores) => {
        storesTableBody.innerHTML = '';
        stores.forEach(store => {
            const row = storesTableBody.insertRow();
            row.insertCell().textContent = store.id;
            row.insertCell().textContent = store.name;
            row.insertCell().textContent = store.region;
            row.insertCell().textContent = store.userId;
            row.insertCell().textContent = store.latitude || 'N/A';
            row.insertCell().textContent = store.longitude || 'N/A';
        });
    };

    const handleAuthError = async (response) => {
        if (response.status === 401 || response.status === 403) {
            logout();
            loginMessage.textContent = 'Session expired or not authorized. Please log in again.';
        } else {
            const errorData = await response.json();
            loginMessage.textContent = errorData.error || 'An error occurred.';
        }
    };

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        loginMessage.textContent = '';

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                authToken = data.token;
                currentUser = { id: data.id, username: data.username, role: data.role };
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                toggleVisibility();
            } else {
                const errorData = await response.json();
                loginMessage.textContent = errorData.error || 'Login failed.';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginMessage.textContent = 'Network error or server unavailable.';
        }
    });

    const logout = () => {
        authToken = null;
        currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        toggleVisibility();
        loginMessage.textContent = 'Logged out successfully.';
    };

    logoutButton.addEventListener('click', logout);

    toggleVisibility(); // Initial check
});
