
let editingStoreId = null; // Global variable to store the ID of the store being edited

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    await initDB();
    populateUsersDropdown(); // Populate dropdown with users
    
    // Elements
    const addStoreBtn = document.getElementById('addStore');
    const formModal = document.getElementById('form-modal');
    const formstore = document.getElementById('formstore');
    const storeSubmitBtn = document.getElementById('storeSubmit');
    const formNotification = document.getElementById('FormNotification');
    const dataList = document.querySelector('.dataList');
    const modalTitle = document.getElementById('myModalLabel');
    const deleteStoreBtn = document.getElementById('deleteStoreBtn'); // Get the new delete button
    const closeModalBtn = document.getElementById('closeModalBtn'); // Get the new close button

    // Modal control functions
    function showModal() {
        formModal.style.display = 'block';
        formModal.classList.add('in');
        document.body.classList.add('modal-open');
    }

    function hideModal() {
        formModal.style.display = 'none';
        formModal.classList.remove('in');
        document.body.classList.remove('modal-open');
        resetForm(); // Reset form when modal is hidden
    }

    // Reset form fields and edit state
    function resetForm() {
        formstore.reset();
        formNotification.classList.add('hidden');
        editingStoreId = null; // Reset editing state
        modalTitle.textContent = 'New Outlet'; // Reset modal title
        storeSubmitBtn.textContent = 'Save'; // Reset submit button text
        formNotification.classList.remove('alert-danger'); // Remove error styling
        deleteStoreBtn.classList.add('hidden'); // Hide delete button by default
        document.getElementById('storeUserId').value = ''; // Reset user dropdown
        document.getElementById('storeLatitude').value = ''; // Clear latitude
        document.getElementById('storeLongitude').value = ''; // Clear longitude
    }

    // Load and display stores
    async function loadStores() {
        dataList.innerHTML = '<div class="list-group-item">Loading stores...</div>'; // Keep existing loading message for now
        try {
            const stores = await getAllStores();
            dataList.innerHTML = ''; // Clear existing list
            if (stores.length === 0) {
                dataList.innerHTML = '<div class="list-group-item">No stores added yet.</div>'; // Keep existing empty message
            } else {
                stores.forEach(store => {
                    const storeCard = document.createElement('div');
                    storeCard.classList.add('store-card');
                    storeCard.dataset.id = store.id; // Store ID for edit/delete
                    storeCard.innerHTML = `
                        <div class="store-card-icon"></div>
                        <h4>${store.name}</h4>
                    `;
                    // Attach click listener to the card itself for editing
                    storeCard.addEventListener('click', async (event) => {
                        // Prevent card click from triggering if delete button was clicked
                        if (!event.target.classList.contains('delete-store') && !event.target.closest('.delete-store')) {
                            const storeId = parseInt(storeCard.dataset.id);
                            await editStore(storeId);
                        }
                    });
                    dataList.appendChild(storeCard);
                });


            }
        } catch (error) {
            console.error('Error loading stores:', error);
            dataList.innerHTML = `<div class="list-group-item error">Error loading stores: ${error.message}</div>`;
        }
    }

    // Fetch and populate form for editing
    async function editStore(storeId) {
        try {
            const store = await getStoreById(storeId);
            if (store) {
                // Populate form fields
                document.getElementById('storename').value = store.name;
                document.getElementById('region').value = store.region;
                document.getElementById('location').value = store.location;
                document.getElementById('address').value = store.address;
                document.getElementById('phone').value = store.phone;
                document.getElementById('email').value = store.email;
                document.getElementById('contactperson').value = store.contactperson;
                document.getElementById('storeremarks').value = store.notes;
                document.getElementById('storeUserId').value = store.userId; // Set selected user
                document.getElementById('storeLatitude').value = store.latitude || ''; // Populate latitude
                document.getElementById('storeLongitude').value = store.longitude || ''; // Populate longitude

                // Set editing state
                editingStoreId = storeId;
                modalTitle.textContent = 'Edit Outlet'; // Change modal title
                storeSubmitBtn.textContent = 'Update'; // Change submit button text
                formNotification.classList.add('hidden'); // Hide any previous notification
                deleteStoreBtn.classList.remove('hidden'); // Show delete button

                showModal();
            }
        } catch (error) {
            console.error('Error fetching store for edit:', error);
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-danger');
            formNotification.querySelector('p').textContent = `Error fetching store for edit: ${error.message}`;
        }
    }

    // Save store (add or update)
    async function saveStore(event) {
        event.preventDefault();
        
        const storeUserId = parseInt(document.getElementById('storeUserId').value);
        if (isNaN(storeUserId)) {
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-danger');
            formNotification.querySelector('p').textContent = 'Please select an associated user.';
            return;
        }

        let latitude = null;
        let longitude = null;
        try {
            const userLocation = await getUserLocation();
            latitude = userLocation.latitude;
            longitude = userLocation.longitude;
            document.getElementById('storeLatitude').value = latitude; // Populate hidden field
            document.getElementById('storeLongitude').value = longitude; // Populate hidden field
        } catch (geolocationError) {
            console.warn('Geolocation error:', geolocationError.message);
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-warning'); // Use warning for non-critical error
            formNotification.querySelector('p').textContent = `Warning: Could not get location. ${geolocationError.message}`;
            // Optionally, ask user if they want to proceed without location or make location mandatory
        }

        const storeData = {
            name: document.getElementById('storename').value,
            region: document.getElementById('region').value,
            location: document.getElementById('location').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            contactperson: document.getElementById('contactperson').value,
            notes: document.getElementById('storeremarks').value,
            userId: storeUserId, // Add userId to storeData
            latitude: latitude, // Add latitude to storeData
            longitude: longitude // Add longitude to storeData
        };

        try {
            if (editingStoreId) {
                // Update existing store
                await updateStore(editingStoreId, storeData);
                formNotification.querySelector('p').textContent = 'Item Successfully Updated';
            } else {
                // Add new store
                await addStore(storeData);
                formNotification.querySelector('p').textContent = 'Item Successfully Saved';
            }
            
            formNotification.classList.remove('hidden');
            formNotification.classList.remove('alert-danger'); // Remove error styling if present
            
            resetForm(); // Reset form but keep modal open to show success
            loadStores();
            // hideModal(); // User closes manually after seeing success
        } catch (error) {
            console.error('Error saving store:', error);
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-danger'); // Add error styling
            formNotification.querySelector('p').textContent = `Error saving item: ${error.message}`;
        }
    }

    // Event Listeners
    addStoreBtn.addEventListener('click', () => {
        resetForm(); // Reset form and edit state for new entry
        showModal();
    });

    // Event listener for opening the map page
    document.getElementById('openMapBtn').addEventListener('click', () => {
        window.location.href = 'stores_map.html';
    });


    formstore.addEventListener('submit', saveStore);

    // Event listener for delete button in the modal
    deleteStoreBtn.addEventListener('click', async () => {
        if (editingStoreId && confirm('Are you sure you want to delete this store?')) {
            try {
                await deleteStore(editingStoreId);
                formNotification.classList.remove('hidden');
                formNotification.classList.remove('alert-danger');
                formNotification.querySelector('p').textContent = 'Item Successfully Deleted';
                hideModal(); // Hide modal after successful delete
                loadStores(); // Refresh list
            } catch (error) {
                console.error('Error deleting store:', error);
                formNotification.classList.remove('hidden');
                formNotification.classList.add('alert-danger');
                formNotification.querySelector('p').textContent = `Error deleting item: ${error.message}`;
            }
        }
    });

    formModal.addEventListener('click', (event) => {
        if (event.target === formModal) { // Click outside the modal content
            hideModal();
        }
    });

    closeModalBtn.addEventListener('click', hideModal); // New event listener for the Close button

    // Geolocation function
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

    // Populate users dropdown
    async function populateUsersDropdown() {
        const storeUserIdSelect = document.getElementById('storeUserId');
        storeUserIdSelect.innerHTML = '<option value="">-- Select User --</option>'; // Clear existing options
        try {
            const users = await getAllUsers();
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.username;
                storeUserIdSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating users dropdown:', error);
            // Optionally add an error option to the select
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Error loading users';
            option.disabled = true;
            storeUserIdSelect.appendChild(option);
        }
    }

    // Initial load
    loadStores();
});
