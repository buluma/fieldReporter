document.addEventListener('DOMContentLoaded', async function() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const profileContent = document.getElementById('profileContent');
    
    // Elements for edit functionality
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editModal = document.getElementById('edit-profile-modal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const editNotification = document.getElementById('editNotification');

    let currentUserId = null;

    function showModal() {
        editModal.style.display = 'block';
        editModal.classList.add('in');
        document.body.classList.add('modal-open');
    }

    function hideModal() {
        editModal.style.display = 'none';
        editModal.classList.remove('in');
        document.body.classList.remove('modal-open');
        editNotification.classList.add('hidden');
    }

    editProfileBtn.addEventListener('click', () => {
        populateEditForm();
        showModal();
    });

    closeEditModalBtn.addEventListener('click', hideModal);

    async function populateEditForm() {
        const user = await getUserById(currentUserId);
        if (user) {
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editEmail').value = user.email || '';
            document.getElementById('editAssigned').value = user.assigned || 'field';
            document.getElementById('editPassword').value = ''; // Don't prefill password
        }
    }

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('editUsername').value,
            email: document.getElementById('editEmail').value,
            assigned: document.getElementById('editAssigned').value
        };

        const newPassword = document.getElementById('editPassword').value;
        if (newPassword) {
            userData.password = newPassword;
        }

        try {
            await updateUser(currentUserId, userData);
            
            // Update session storage
            const updatedUser = await getUserById(currentUserId);
            sessionStorage.setItem('currentUser', JSON.stringify({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                assigned: updatedUser.assigned
            }));

            editNotification.classList.remove('hidden');
            
            // Refresh view
            await loadProfile();
            
            setTimeout(hideModal, 1500);
        } catch (err) {
            alert('Error updating profile: ' + err.message);
        }
    });

    async function loadProfile() {
        try {
            // Get current user from session storage
            const currentUserStr = sessionStorage.getItem('currentUser');
            
            if (!currentUserStr) {
                throw new Error('No user is currently logged in');
            }
            
            const sessionUser = JSON.parse(currentUserStr);
            currentUserId = sessionUser.id;
            
            // Get full user data from DB
            const user = await getUserById(currentUserId);
            
            if (!user) {
                throw new Error('User not found in database');
            }

            // Populate user information
            document.getElementById('userId').textContent = user.id || '-';
            document.getElementById('username').textContent = user.username || '-';
            document.getElementById('email').textContent = user.email || '-';
            document.getElementById('assigned').textContent = user.assigned === 'team-leader' ? 'Team Leader' : 'Field Staff';
            
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                document.getElementById('accountCreated').textContent = date.toLocaleDateString();
            } else {
                document.getElementById('accountCreated').textContent = 'Unknown';
            }
            
            // Get recent login logs for this user
            const recentLogins = await getUserLoginLogs(user.username);
            
            // Display recent logins
            const recentLoginsContainer = document.getElementById('recentLogins');
            if (recentLogins && recentLogins.length > 0) {
                const recentFive = recentLogins.slice(0, 5);
                let html = '';
                recentFive.forEach(login => {
                    const date = new Date(login.timestamp);
                    html += `
                        <div class="list-group-item">
                            <p style="margin: 0; font-weight: bold; color: #333;">${date.toLocaleString()}</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Event: ${login.eventType}</p>
                        </div>
                    `;
                });
                recentLoginsContainer.innerHTML = html;
            } else {
                recentLoginsContainer.innerHTML = '<div class="list-group-item">No recent login activity found.</div>';
            }
            
            loadingElement.style.display = 'none';
            profileContent.style.display = 'block';
        } catch (error) {
            console.error('Error loading profile:', error);
            loadingElement.style.display = 'none';
            errorElement.textContent = 'Error loading profile: ' + error.message;
            errorElement.classList.remove('hidden');
        }
    }

    // Initialize
    await initDB();
    await loadProfile();
});