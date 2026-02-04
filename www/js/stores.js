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
        modalTitle.textContent = 'New Outlet'; // Reset modal title
        storeSubmitBtn.textContent = 'Save'; // Reset submit button text
        formNotification.classList.remove('alert-danger'); // Remove error styling
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
                    storeCard.dataset.id = store.id; // Store ID for navigation
                    storeCard.innerHTML = `
                        <div class="store-card-icon"></div>
                        <h4>${store.name}</h4>
                    `;
                    // Attach click listener to the card itself to view store details
                    storeCard.addEventListener('click', () => {
                        const storeId = parseInt(storeCard.dataset.id);
                        window.location.href = `store.html?id=${storeId}&from=all`;
                    });
                    dataList.appendChild(storeCard);
                });
            }
        } catch (error) {
            console.error('Error loading stores:', error);
            dataList.innerHTML = `<div class="list-group-item error">Error loading stores: ${error.message}</div>`;
        }
    }

    // Save store (add)
    async function saveStore(event) {
        event.preventDefault();
        
        const storeUserId = parseInt(document.getElementById('storeUserId').value);
        if (isNaN(storeUserId)) {
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-danger');
            formNotification.querySelector('p').textContent = 'Please select an associated user.';
            return;
        }

        let finalLatitude = null;
        let finalLongitude = null;
        const manualLatitude = document.getElementById('storeLatitude').value;
        const manualLongitude = document.getElementById('storeLongitude').value;

        if (manualLatitude !== '' && manualLongitude !== '') {
            finalLatitude = parseFloat(manualLatitude);
            finalLongitude = parseFloat(manualLongitude);
            if (isNaN(finalLatitude) || isNaN(finalLongitude)) {
                formNotification.classList.remove('hidden');
                formNotification.classList.add('alert-danger');
                formNotification.querySelector('p').textContent = 'Invalid Latitude or Longitude entered.';
                return;
            }
        } else {
            // Only get user location if manual fields are empty
            try {
                const userLocation = await getUserLocation();
                finalLatitude = userLocation.latitude;
                finalLongitude = userLocation.longitude;
            } catch (geolocationError) {
                console.warn('Geolocation error:', geolocationError.message);
                formNotification.classList.remove('hidden');
                formNotification.classList.add('alert-warning');
                formNotification.querySelector('p').textContent = `Warning: Could not get location. ${geolocationError.message}`;
            }
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
            userId: storeUserId,
            latitude: finalLatitude,
            longitude: finalLongitude
        };

        try {
            // Always add new store in stores.html
            await addStore(storeData);
            formNotification.querySelector('p').textContent = 'Item Successfully Saved';
            
            formNotification.classList.remove('hidden');
            formNotification.classList.remove('alert-danger');
            
            resetForm();
            loadStores();
        } catch (error) {
            console.error('Error saving store:', error);
            formNotification.classList.remove('hidden');
            formNotification.classList.add('alert-danger');
            formNotification.querySelector('p').textContent = `Error saving item: ${error.message}`;
        }
    }

    // Event Listeners
    addStoreBtn.addEventListener('click', async () => {
        resetForm();
        showModal();
        await populateLocationFields();
    });

    // Event listener for opening the map page
    document.getElementById('openMapBtn').addEventListener('click', () => {
        window.location.href = 'stores_map.html';
    });

    formstore.addEventListener('submit', saveStore);

    formModal.addEventListener('click', (event) => {
        if (event.target === formModal) {
            hideModal();
        }
    });

    closeModalBtn.addEventListener('click', hideModal);

    // Populate latitude/longitude fields if empty
    async function populateLocationFields() {
        const latitudeInput = document.getElementById('storeLatitude');
        const longitudeInput = document.getElementById('storeLongitude');

        if (!latitudeInput.value && !longitudeInput.value) {
            try {
                const userLocation = await getUserLocation();
                latitudeInput.value = userLocation.latitude;
                longitudeInput.value = userLocation.longitude;
                formNotification.classList.add('hidden');
            } catch (geolocationError) {
                console.warn('Geolocation prefill error:', geolocationError.message);
                formNotification.classList.remove('hidden');
                formNotification.classList.add('alert-warning');
                formNotification.querySelector('p').textContent = `Warning: Could not prefill location. ${geolocationError.message}`;
            }
        }
    }
    
    // Populate users dropdown
    async function populateUsersDropdown() {
        const storeUserIdSelect = document.getElementById('storeUserId');
        storeUserIdSelect.innerHTML = '<option value="">-- Select User --</option>';
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
        }
    }

    // Initial load
    loadStores();
});