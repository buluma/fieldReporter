document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('id');
    const fromPage = urlParams.get('from') || 'my';

    const storeNameElement = document.getElementById('storeName');
    const storeInfoElement = document.getElementById('storeInfo');
    const storeMenuElement = document.getElementById('storeMenu');
    const checkinActionElement = document.getElementById('checkinAction');
    const checkinWarningElement = document.getElementById('checkinWarning');
    const backToStoresBtn = document.getElementById('backToStoresBtn');
    
    // Edit Modal Elements
    const editStoreBtn = document.getElementById('editStoreBtn');
    const editModal = document.getElementById('edit-store-modal');
    const formEditStore = document.getElementById('form_edit_store');
    const deleteStoreBtn = document.getElementById('deleteStoreBtn');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const editNotification = document.getElementById('editNotification');

    let currentStore = null;
    let activeCheckin = null;

    backToStoresBtn.addEventListener('click', () => {
        if (fromPage === 'all') {
            window.location.href = 'stores.html';
        } else {
            window.location.href = 'my_stores.html';
        }
    });

    if (!storeId) {
        storeNameElement.textContent = 'Error: Store ID not found.';
        return;
    }

    async function loadStoreData() {
        try {
            const currentUser = getCurrentUser();
            if (currentUser && currentUser.assigned !== 'team-leader') {
                editStoreBtn.classList.add('hidden');
            }

            currentStore = await getStoreById(parseInt(storeId));
            if (currentStore) {
                storeNameElement.textContent = currentStore.name;
                populateStoreInfo(currentStore);
                await checkCheckinStatus();
            } else {
                storeNameElement.textContent = 'Store not found.';
            }
        } catch (error) {
            console.error('Error loading store details:', error);
            storeNameElement.textContent = `Error loading store details: ${error.message}`;
        }
    }

    async function checkCheckinStatus() {
        activeCheckin = await getActiveCheckin(storeId);
        if (activeCheckin) {
            // User is checked in
            checkinActionElement.innerHTML = '<button id="checkoutBtn" class="btn btn-danger">Check Out</button>';
            checkinWarningElement.classList.add('hidden');
            await populateMenu();
            
            document.getElementById('checkoutBtn').addEventListener('click', handleCheckOut);
        } else {
            // User is not checked in
            checkinActionElement.innerHTML = '<button id="checkinBtn" class="btn btn-success">Check In</button>';
            checkinWarningElement.classList.remove('hidden');
            storeMenuElement.innerHTML = '';
            
            document.getElementById('checkinBtn').addEventListener('click', handleCheckIn);
        }
    }

    async function handleCheckIn() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            const checkinData = {
                store_id: parseInt(storeId),
                session_id: Date.now().toString(),
                checkin_time: new Date().toISOString(),
                checkin_place: `${location.latitude},${location.longitude}`,
                submitter: currentUser ? currentUser.username : 'Unknown',
                store: currentStore.name,
                day: new Date().toISOString().split('T')[0]
            };
            await checkInUser(checkinData);
            await checkCheckinStatus();
        } catch (error) {
            alert('Error checking in: ' + error.message);
        }
    }

    async function handleCheckOut() {
        try {
            const location = await getUserLocation();
            const checkoutData = {
                checkout_place: `${location.latitude},${location.longitude}`
            };
            await checkOutUser(storeId, activeCheckin.session_id, checkoutData);
            await checkCheckinStatus();
        } catch (error) {
            alert('Error checking out: ' + error.message);
        }
    }

    function populateStoreInfo(store) {
        let html = `
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Region</p>
                <p class="bold" style="margin: 5px 0 0 0;">${store.region || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Location</p>
                <p class="bold" style="margin: 5px 0 0 0;">${store.location || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Address</p>
                <p class="bold" style="margin: 5px 0 0 0;">${store.address || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Phone</p>
                <p class="bold" style="margin: 5px 0 0 0;">${store.phone || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Contact Person</p>
                <p class="bold" style="margin: 5px 0 0 0;">${store.contactperson || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p style="margin: 0; font-size: 12px; color: #666;">Remarks</p>
                <p style="margin: 5px 0 0 0;">${store.notes || 'N/A'}</p>
            </div>
        `;
        storeInfoElement.innerHTML = html;
    }

    async function populateMenu() {
        const currentUser = getCurrentUser();
        const commonItems = [
            { name: 'Availability', icon: '📋', link: 'availability.html', table: AVAILABILITY_STORE },
            { name: 'Placement', icon: '📂', link: 'placement.html', table: PLACEMENT_STORE },
            { name: 'Visibility', icon: '👁️', link: 'visibility.html', table: VISIBILITY_STORE },
            { name: 'Activation', icon: '📊', link: 'activation.html', table: ACTIVATION_STORE },
            { name: 'Listings', icon: '📜', link: 'listings.html', table: LISTINGS_STORE },
            { name: 'Brands', icon: '🏷️', link: 'brands.html', table: BRAND_STOCKS_STORE },
            { name: 'Performance', icon: '📈', link: 'performance.html', table: PERFORMANCE_STORE },
            { name: 'Checklist', icon: '✅', link: 'checklist.html', table: CHECKLIST_STORE }
        ];

        const roleSpecificItems = [];
        if (currentUser) {
            if (currentUser.assigned === 'team-leader') {
                roleSpecificItems.push({ name: 'My Objectives', icon: '🎯', link: 'tl_objectives.html', table: TL_OBJECTIVES_STORE });
                roleSpecificItems.push({ name: 'Focus Areas', icon: '🔍', link: 'tl_focus.html', table: TL_FOCUS_STORE });
            } else {
                roleSpecificItems.push({ name: 'Objectives', icon: '🎯', link: 'objectives.html', table: OBJECTIVES_STORE });
                roleSpecificItems.push({ name: 'Other Objectives', icon: '📝', link: 'other_objectives.html', table: OTHER_OBJECTIVES_STORE });
            }
        }

        let html = '<div class="store-grid-menu">';
        for (const item of commonItems) {
            let count = 0;
            try {
                count = await getRecordCountByStore(item.table, storeId);
            } catch (error) {
                console.warn(`Error getting count for ${item.name}:`, error);
            }

            html += `
                <a href="${item.link}?store_id=${storeId}&store_name=${encodeURIComponent(currentStore.name)}" class="store-menu-item">
                    <div class="btn btn-default btn-block">
                        <span class="big-icon">${item.icon}</span>
                        <h4>${item.name} (${count})</h4>
                    </div>
                </a>
            `;
        }
        html += '</div>';

        if (roleSpecificItems.length > 0) {
            html += `
                <div class="quick-input-header" style="margin-top: 20px;">
                    <h4>Role Specific Activities</h4>
                </div>
                <div class="store-grid-menu">
            `;
            for (const item of roleSpecificItems) {
                let count = 0;
                try {
                    count = await getRecordCountByStore(item.table, storeId);
                } catch (error) {
                    console.warn(`Error getting count for ${item.name}:`, error);
                }

                html += `
                    <a href="${item.link}?store_id=${storeId}&store_name=${encodeURIComponent(currentStore.name)}" class="store-menu-item">
                        <div class="btn btn-default btn-block">
                            <span class="big-icon">${item.icon}</span>
                            <h4>${item.name} (${count})</h4>
                        </div>
                    </a>
                `;
            }
            html += '</div>';
        }
        
        storeMenuElement.innerHTML = html;
    }

    // Modal Control
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

    editStoreBtn.addEventListener('click', async () => {
        await populateUsersDropdown();
        populateEditForm();
        showModal();
    });

    closeEditModalBtn.addEventListener('click', hideModal);

    function populateEditForm() {
        if (currentStore) {
            document.getElementById('edit_storename').value = currentStore.name;
            document.getElementById('edit_region').value = currentStore.region;
            document.getElementById('edit_location').value = currentStore.location;
            document.getElementById('edit_address').value = currentStore.address;
            document.getElementById('edit_phone').value = currentStore.phone;
            document.getElementById('edit_email').value = currentStore.email;
            document.getElementById('edit_contactperson').value = currentStore.contactperson;
            document.getElementById('edit_storeUserId').value = currentStore.userId;
            document.getElementById('edit_storeLatitude').value = currentStore.latitude || '';
            document.getElementById('edit_storeLongitude').value = currentStore.longitude || '';
            document.getElementById('edit_storeremarks').value = currentStore.notes;
        }
    }

    formEditStore.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const storeData = {
            name: document.getElementById('edit_storename').value,
            region: document.getElementById('edit_region').value,
            location: document.getElementById('edit_location').value,
            address: document.getElementById('edit_address').value,
            phone: document.getElementById('edit_phone').value,
            email: document.getElementById('edit_email').value,
            contactperson: document.getElementById('edit_contactperson').value,
            userId: parseInt(document.getElementById('edit_storeUserId').value),
            latitude: parseFloat(document.getElementById('edit_storeLatitude').value) || null,
            longitude: parseFloat(document.getElementById('edit_storeLongitude').value) || null,
            notes: document.getElementById('edit_storeremarks').value
        };

        try {
            await updateStore(parseInt(storeId), storeData);
            editNotification.classList.remove('hidden');
            await loadStoreData(); // Refresh info
            setTimeout(hideModal, 1500);
        } catch (error) {
            alert('Error updating outlet: ' + error.message);
        }
    });

    deleteStoreBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this outlet? All related activity data will remain in the database but won\'t be associated with an active outlet.')) {
            try {
                await deleteStore(parseInt(storeId));
                alert('Outlet deleted successfully.');
                backToStoresBtn.click();
            } catch (error) {
                alert('Error deleting outlet: ' + error.message);
            }
        }
    });

    async function populateUsersDropdown() {
        const storeUserIdSelect = document.getElementById('edit_storeUserId');
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

    await loadStoreData();
});