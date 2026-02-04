document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const dashboardContent = document.getElementById('dashboard-content');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginMessage = document.getElementById('login-message');
    const welcomeMessage = document.getElementById('welcome-message');
    const usersTableBody = document.getElementById('users-table-body');
    const storesTableBody = document.getElementById('stores-table-body');
    const loginLogsTableBody = document.getElementById('login-logs-table-body');
    const checkinsTableBody = document.getElementById('checkins-table-body');
    const brandsTableBody = document.getElementById('brands-table-body');
    const brandStocksTableBody = document.getElementById('brand-stocks-table-body');
    const availabilitiesTableBody = document.getElementById('availabilities-table-body');
    const placementsTableBody = document.getElementById('placements-table-body');
    const activationsTableBody = document.getElementById('activations-table-body');
    const visibilitiesTableBody = document.getElementById('visibilities-table-body'); // Corrected typo here
    const tlFocusesTableBody = document.getElementById('tl-focuses-table-body');
    const tlObjectivesTableBody = document.getElementById('tl-objectives-table-body');
    const objectivesTableBody = document.getElementById('objectives-table-body');
    const otherObjectivesTableBody = document.getElementById('other-objectives-table-body');
    const listingsTableBody = document.getElementById('listings-table-body');
    const performancesTableBody = document.getElementById('performances-table-body');
    const checklistsTableBody = document.getElementById('checklists-table-body');
    const dailyPlannersTableBody = document.getElementById('daily-planners-table-body');

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
            loginLogsTableBody.innerHTML = '';
            checkinsTableBody.innerHTML = '';
            brandsTableBody.innerHTML = '';
            brandStocksTableBody.innerHTML = '';
            availabilitiesTableBody.innerHTML = '';
            placementsTableBody.innerHTML = '';
            activationsTableBody.innerHTML = '';
            visibilitiesTableBody.innerHTML = '';
            tlFocusesTableBody.innerHTML = '';
            tlObjectivesTableBody.innerHTML = '';
            objectivesTableBody.innerHTML = '';
            otherObjectivesTableBody.innerHTML = '';
            listingsTableBody.innerHTML = '';
            performancesTableBody.innerHTML = '';
            checklistsTableBody.innerHTML = '';
            dailyPlannersTableBody.innerHTML = '';
        }
    };

    const fetchData = async () => {
        if (!authToken) return;

        const headers = { 'Authorization': `Bearer ${authToken}` };

        // Fetch users
        try {
            const usersResponse = await fetch(`${API_BASE_URL}/api/users`, { headers });
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
            const storesResponse = await fetch(`${API_BASE_URL}/api/stores`, { headers });
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

        // Fetch Login Logs
        try {
            const response = await fetch(`${API_BASE_URL}/api/login-logs`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderLoginLogs(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching login logs:', error);
        }

        // Fetch Checkins
        try {
            const response = await fetch(`${API_BASE_URL}/api/checkins`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderCheckins(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching checkins:', error);
        }

        // Fetch Brands
        try {
            const response = await fetch(`${API_BASE_URL}/api/brands`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderBrands(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }

        // Fetch Brand Stocks
        try {
            const response = await fetch(`${API_BASE_URL}/api/brand-stocks`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderBrandStocks(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching brand stocks:', error);
        }

        // Fetch Availabilities
        try {
            const response = await fetch(`${API_BASE_URL}/api/availabilities`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderAvailabilities(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        }

        // Fetch Placements
        try {
            const response = await fetch(`${API_BASE_URL}/api/placements`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderPlacements(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching placements:', error);
        }

        // Fetch Activations
        try {
            const response = await fetch(`${API_BASE_URL}/api/activations`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderActivations(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching activations:', error);
        }

        // Fetch Visibilities
        try {
            const response = await fetch(`${API_BASE_URL}/api/visibilities`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderVisibilities(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching visibilities:', error);
        }

        // Fetch TL Focuses
        try {
            const response = await fetch(`${API_BASE_URL}/api/tl-focuses`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderTLFocuses(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching TL focuses:', error);
        }

        // Fetch TL Objectives
        try {
            const response = await fetch(`${API_BASE_URL}/api/tl-objectives`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderTLObjectives(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching TL objectives:', error);
        }

        // Fetch Objectives
        try {
            const response = await fetch(`${API_BASE_URL}/api/objectives`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderObjectives(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching objectives:', error);
        }

        // Fetch Other Objectives
        try {
            const response = await fetch(`${API_BASE_URL}/api/other-objectives`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderOtherObjectives(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching other objectives:', error);
        }

        // Fetch Listings
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderListings(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching listings:', error);
        }

        // Fetch Performances
        try {
            const response = await fetch(`${API_BASE_URL}/api/performances`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderPerformances(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching performances:', error);
        }

        // Fetch Checklists
        try {
            const response = await fetch(`${API_BASE_URL}/api/checklists`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderChecklists(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching checklists:', error);
        }

        // Fetch Daily Planners
        try {
            const response = await fetch(`${API_BASE_URL}/api/daily-planners`, { headers });
            if (response.ok) {
                const data = await response.json();
                renderDailyPlanners(data);
            } else {
                handleAuthError(response);
            }
        } catch (error) {
            console.error('Error fetching daily planners:', error);
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

    const renderLoginLogs = (logs) => {
        loginLogsTableBody.innerHTML = '';
        logs.forEach(log => {
            const row = loginLogsTableBody.insertRow();
            row.insertCell().textContent = log.id;
            row.insertCell().textContent = log.userId;
            row.insertCell().textContent = log.username;
            row.insertCell().textContent = new Date(log.timestamp).toLocaleString();
            row.insertCell().textContent = log.eventType;
        });
    };

    const renderCheckins = (checkins) => {
        checkinsTableBody.innerHTML = '';
        checkins.forEach(checkin => {
            const row = checkinsTableBody.insertRow();
            row.insertCell().textContent = checkin.id;
            row.insertCell().textContent = checkin.storeId;
            row.insertCell().textContent = checkin.sessionId;
            row.insertCell().textContent = checkin.checkoutTime;
            row.insertCell().textContent = new Date(checkin.createdAt).toLocaleString();
        });
    };

    const renderBrands = (brands) => {
        brandsTableBody.innerHTML = '';
        brands.forEach(brand => {
            const row = brandsTableBody.insertRow();
            row.insertCell().textContent = brand.id;
            row.insertCell().textContent = brand.name;
        });
    };

    const renderBrandStocks = (stocks) => {
        brandStocksTableBody.innerHTML = '';
        stocks.forEach(stock => {
            const row = brandStocksTableBody.insertRow();
            row.insertCell().textContent = stock.id;
            row.insertCell().textContent = stock.storeId;
            row.insertCell().textContent = stock.brandId;
            row.insertCell().textContent = new Date(stock.createdOn).toLocaleString();
            row.insertCell().textContent = stock.data ? JSON.stringify(stock.data) : 'N/A';
        });
    };

    const renderAvailabilities = (items) => {
        availabilitiesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = availabilitiesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderPlacements = (items) => {
        placementsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = placementsTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderActivations = (items) => {
        activationsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = activationsTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderVisibilities = (items) => {
        visibilitiesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = visibilitiesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderTLFocuses = (items) => {
        tlFocusesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = tlFocusesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderTLObjectives = (items) => {
        tlObjectivesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = tlObjectivesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderObjectives = (items) => {
        objectivesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = objectivesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderOtherObjectives = (items) => {
        otherObjectivesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = otherObjectivesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderListings = (items) => {
        listingsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = listingsTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderPerformances = (items) => {
        performancesTableBody.innerHTML = '';
        items.forEach(item => {
            const row = performancesTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderChecklists = (items) => {
        checklistsTableBody.innerHTML = '';
        items.forEach(item => {
            const row = checklistsTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = item.storeId;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
        });
    };

    const renderDailyPlanners = (items) => {
        dailyPlannersTableBody.innerHTML = '';
        items.forEach(item => {
            const row = dailyPlannersTableBody.insertRow();
            row.insertCell().textContent = item.id;
            row.insertCell().textContent = new Date(item.dailyDate).toLocaleDateString();
            row.insertCell().textContent = item.week;
            row.insertCell().textContent = item.month;
            row.insertCell().textContent = item.year;
            row.insertCell().textContent = item.submitter;
            row.insertCell().textContent = new Date(item.createdOn).toLocaleString();
            row.insertCell().textContent = item.data ? JSON.stringify(item.data) : 'N/A';
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
