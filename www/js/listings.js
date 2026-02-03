document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const listingsList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formListing = document.getElementById('form_listing');
    const formNotification = document.getElementById('formNotification');
    const addListingBtn = document.getElementById('addListingBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Listings: ${decodeURIComponent(storeName)}`;
    }

    // Modal Control
    function showModal() {
        formModal.style.display = 'block';
        formModal.classList.add('in');
        document.body.classList.add('modal-open');
    }

    function hideModal() {
        formModal.style.display = 'none';
        formModal.classList.remove('in');
        document.body.classList.remove('modal-open');
        resetForm();
    }

    function resetForm() {
        formListing.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addListingBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formListing.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveListing();
    });

    async function saveListing() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                listing: document.getElementById('listing').value,
                listed: document.getElementById('listed').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addListing(data);
            
            formNotification.classList.remove('hidden');
            formListing.reset();
            
            // Refresh list
            await fetchListings();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving listing: ' + error.message);
        }
    }

    async function fetchListings() {
        if (!storeId) return;
        
        listingsList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getListingsByStore(storeId);
            listingsList.innerHTML = '';
            
            if (items.length === 0) {
                listingsList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">${item.listing}</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${date}</p>
                    <p><strong>Listed:</strong> ${item.listed}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                listingsList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching listings:', error);
            listingsList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchListings();
});