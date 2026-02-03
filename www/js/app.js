
document.addEventListener('DOMContentLoaded', initializeAppUI);

function initializeAppUI() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            const currentUser = getCurrentUser();
            if (currentUser && typeof addLoginLog === 'function') {
                try {
                    await addLoginLog('logout', currentUser.id, currentUser.username);
                } catch (error) {
                    console.error('Error logging logout:', error);
                }
            }

            // Assuming logout() is a global function from db.js that clears session
            if (typeof logout === 'function') {
                logout();
            } else {
                // Fallback if db.js is not loaded or logout is not global
                console.warn('logout() function not found, falling back to clearing sessionStorage.');
                sessionStorage.removeItem('currentUser');
            }
            console.log('User logged out, redirecting to login...');
            window.location.href = 'login.html';
        });
    }
}
