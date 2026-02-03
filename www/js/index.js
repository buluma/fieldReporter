/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    // Initialize database and check authentication
    initDB()
        .then(() => {
            console.log('Database initialized');
            checkAuthStatus();
        })
        .catch(error => {
            console.error('Failed to initialize database:', error);
        });
}

// Check if user is authenticated, redirect to login if not
function checkAuthStatus() {
    // If not logged in, redirect to login page
    if (!isLoggedIn()) {
        console.log('User not authenticated, redirecting to login...');
        window.location.href = 'login.html';
    } else {
        // Show user info
        showUserInfo();
        setupLogoutHandler();
    }
}

// Display user information
function showUserInfo() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('usernameDisplay').textContent = currentUser.username;

        // Set current date
        const today = new Date();
        const dateString = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        document.getElementById('currentDate').textContent = dateString;

        document.getElementById('userInfo').style.display = 'block';
    }
}

// Set up logout button handler
function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
            console.log('User logged out, redirecting to login...');
            window.location.href = 'login.html';
        });
    }

    // Set up view logs button handler
    const viewLogsBtn = document.getElementById('viewLogsBtn');
    if (viewLogsBtn) {
        viewLogsBtn.addEventListener('click', function() {
            // Navigate to the login logs page
            window.location.href = 'login-logs.html';
        });
    }

    // Set up login activity card handler
    const loginActivityCard = document.getElementById('loginActivityCard');
    if (loginActivityCard) {
        loginActivityCard.addEventListener('click', function() {
            // Navigate to the login logs page
            window.location.href = 'login-logs.html';
        });
    }
}
