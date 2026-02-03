document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const storeId = new URLSearchParams(window.location.search).get('id');
    const storeNameElement = document.getElementById('storeName');
    const storeRegionElement = document.getElementById('storeRegion');
    const storeLocationElement = document.getElementById('storeLocation');
    const storeAddressElement = document.getElementById('storeAddress');
    const storePhoneElement = document.getElementById('storePhone');
    const storeEmailElement = document.getElementById('storeEmail');
    const storeContactPersonElement = document.getElementById('storeContactPerson');
    const storeNotesElement = document.getElementById('storeNotes');
    const storeAssociatedUserElement = document.getElementById('storeAssociatedUser');
    const storeLatitudeElement = document.getElementById('storeLatitude');
    const storeLongitudeElement = document.getElementById('storeLongitude');
    const backToMyStoresBtn = document.getElementById('backToMyStoresBtn');

    backToMyStoresBtn.addEventListener('click', () => {
        window.location.href = 'my_stores.html';
    });

    if (!storeId) {
        storeNameElement.textContent = 'Error: Store ID not found.';
        return;
    }

    try {
        const store = await getStoreById(parseInt(storeId));
        if (store) {
            storeNameElement.textContent = store.name;
            storeRegionElement.textContent = store.region || 'N/A';
            storeLocationElement.textContent = store.location || 'N/A';
            storeAddressElement.textContent = store.address || 'N/A';
            storePhoneElement.textContent = store.phone || 'N/A';
            storeEmailElement.textContent = store.email || 'N/A';
            storeContactPersonElement.textContent = store.contactperson || 'N/A';
            storeNotesElement.textContent = store.notes || 'N/A';
            storeLatitudeElement.textContent = store.latitude || 'N/A';
            storeLongitudeElement.textContent = store.longitude || 'N/A';

            // Fetch user data
            if (store.userId) {
                const user = await getUserById(store.userId);
                storeAssociatedUserElement.textContent = user ? user.username : 'Unknown User';
            } else {
                storeAssociatedUserElement.textContent = 'N/A';
            }

        } else {
            storeNameElement.textContent = 'Store not found.';
        }
    } catch (error) {
        console.error('Error loading store details:', error);
        storeNameElement.textContent = `Error loading store details: ${error.message}`;
    }
});
