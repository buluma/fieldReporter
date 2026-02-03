
let editingStoreId = null; // Global variable to store the ID of the store being edited

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    await initDB();
    
    // Elements
    const addStoreBtn = document.getElementById('addStore');
    const formModal = document.getElementById('form-modal');
    const formstore = document.getElementById('formstore');
    const storeSubmitBtn = document.getElementById('storeSubmit');
    const formNotification = document.getElementById('FormNotification');
    const dataList = document.querySelector('.dataList');
    const modalTitle = document.getElementById('myModalLabel');

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
    }

    // Reset form fields and edit state
    function resetForm() {
        formstore.reset();
        formNotification.classList.add('hidden');
        editingStoreId = null; // Reset editing state
        modalTitle.textContent = 'New Outlet'; // Reset modal title
        storeSubmitBtn.textContent = 'Save'; // Reset submit button text
        formNotification.classList.remove('alert-danger'); // Remove error styling
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
                        <div class="store-actions">
                            <button class="btn btn-default delete-store" data-id="${store.id}">Delete</button>
                        </div>
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

                // Add event listeners for delete buttons
                document.querySelectorAll('.delete-store').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        event.stopPropagation(); // Prevent card click from triggering
                        const storeId = parseInt(event.target.dataset.id);
                        if (confirm('Are you sure you want to delete this store?')) {
                            await deleteStore(storeId);
                            loadStores(); // Refresh list
                        }
                    });
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

                // Set editing state
                editingStoreId = storeId;
                modalTitle.textContent = 'Edit Outlet'; // Change modal title
                storeSubmitBtn.textContent = 'Update'; // Change submit button text
                formNotification.classList.add('hidden'); // Hide any previous notification

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
        
        const storeData = {
            name: document.getElementById('storename').value,
            region: document.getElementById('region').value,
            location: document.getElementById('location').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            contactperson: document.getElementById('contactperson').value,
            notes: document.getElementById('storeremarks').value,
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

    formstore.addEventListener('submit', saveStore);

    formModal.querySelector('.close').addEventListener('click', hideModal);
    formModal.querySelector('[data-dismiss="modal"]').addEventListener('click', hideModal);
    formModal.addEventListener('click', (event) => {
        if (event.target === formModal) { // Click outside the modal content
            hideModal();
        }
    });

    // Initial load
    loadStores();
});
