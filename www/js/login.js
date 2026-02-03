document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('registerLink');
    const errorMessage = document.getElementById('errorMessage');

    // For development/testing purposes only: pre-fill default credentials
    // In a production environment, you would remove this
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = 'admin123';

    // Handle login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        try {
            // Attempt to authenticate the user
            const user = await authenticateUser(username, password);

            if (user) {
                // Successful login - redirect to main app
                window.location.href = 'index.html';
            } else {
                showError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred during login. Please try again.');
        }
    });

    // Handle register link click
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        // For now, just show an alert - in a real app, this would show a registration form
        alert('Registration functionality would be implemented here');
    });

    // Function to show error messages
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});

// Also handle registration if needed
async function registerUser(username, password, email) {
    try {
        const userData = {
            username: username,
            password: password,
            email: email
        };
        
        await addUser(userData);
        return true;
    } catch (error) {
        console.error('Registration error:', error);
        return false;
    }
}