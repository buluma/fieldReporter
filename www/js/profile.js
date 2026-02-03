
document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const profileContent = document.getElementById('profileContent');
    
    try {
        // Initialize the database
        await initDB();
        
        // Get current user from session storage
        const currentUser = sessionStorage.getItem('currentUser');
        
        if (!currentUser) {
            throw new Error('No user is currently logged in');
        }
        
        const user = JSON.parse(currentUser);
        
        // Populate user information
        document.getElementById('userId').textContent = user.id || '-';
        document.getElementById('username').textContent = user.username || '-';
        document.getElementById('email').textContent = user.email || '-';
        
        // For account creation date, we'll need to get the full user record from the database
        const fullUser = await getUserById(user.id);
        if (fullUser) {
            // If the user object has a creation date, display it
            if (fullUser.createdAt) {
                const date = new Date(fullUser.createdAt);
                document.getElementById('accountCreated').textContent = date.toLocaleDateString();
            } else {
                document.getElementById('accountCreated').textContent = 'Unknown';
            }
        } else {
            document.getElementById('accountCreated').textContent = 'Unknown';
        }
        
        // Get recent login logs for this user
        const recentLogins = await getUserLoginLogs(user.username);
        
        // Display recent logins
        const recentLoginsContainer = document.getElementById('recentLogins');
        if (recentLogins && recentLogins.length > 0) {
            // Take only the 5 most recent logins
            const recentFive = recentLogins.slice(0, 5);
            
            let loginsHtml = '<ul style="text-align: left;">';
            recentFive.forEach(login => {
                const date = new Date(login.timestamp);
                loginsHtml += `<li>${date.toLocaleString()} - ${login.eventType}</li>`;
            });
            loginsHtml += '</ul>';
            
            recentLoginsContainer.innerHTML = loginsHtml;
        } else {
            recentLoginsContainer.innerHTML = '<p>No recent login activity found.</p>';
        }
        
        // Hide loading and show profile content
        loadingElement.style.display = 'none';
        profileContent.style.display = 'block';
    } catch (error) {
        console.error('Error loading profile:', error);
        loadingElement.style.display = 'none';
        errorElement.textContent = 'Error loading profile: ' + error.message;
        errorElement.style.display = 'block';
    }
});
