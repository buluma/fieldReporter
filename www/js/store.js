document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const storeId = new URLSearchParams(window.location.search).get('id');
    const storeNameElement = document.getElementById('storeName');
    const storeInfoElement = document.getElementById('storeInfo');
    const storeMenuElement = document.getElementById('storeMenu');
    const checkinActionElement = document.getElementById('checkinAction');
    const checkinWarningElement = document.getElementById('checkinWarning');
    const backToMyStoresBtn = document.getElementById('backToMyStoresBtn');

    let currentStore = null;
    let activeCheckin = null;

    backToMyStoresBtn.addEventListener('click', () => {
        window.location.href = 'my_stores.html';
    });

    if (!storeId) {
        storeNameElement.textContent = 'Error: Store ID not found.';
        return;
    }

    async function loadStoreData() {
        try {
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
            storeMenuElement.classList.remove('hidden');
            await populateMenu();
            
            document.getElementById('checkoutBtn').addEventListener('click', handleCheckOut);
        } else {
            // User is not checked in
            checkinActionElement.innerHTML = '<button id="checkinBtn" class="btn btn-success">Check In</button>';
            checkinWarningElement.classList.remove('hidden');
            storeMenuElement.classList.add('hidden');
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
                <p>Region</p>
                <p class="bold">${store.region || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p>Location</p>
                <p class="bold">${store.location || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p>Address</p>
                <p class="bold">${store.address || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p>Phone</p>
                <p class="bold">${store.phone || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p>Contact Person</p>
                <p class="bold">${store.contactperson || 'N/A'}</p>
            </div>
            <div class="list-group-item">
                <p>Remarks</p>
                <p>${store.notes || 'N/A'}</p>
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
            { name: 'Listings', icon: '📜', link: 'listings.html', table: LISTINGS_STORE }
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

    await loadStoreData();
});
