document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const placementList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formPlacement = document.getElementById('form_placement');
    const formNotification = document.getElementById('FormNotification');
    const addPlacementBtn = document.getElementById('addPlacementBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Placement: ${decodeURIComponent(storeName)}`;
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
        formPlacement.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addPlacementBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formPlacement.addEventListener('submit', async (e) => {
        e.preventDefault();
        await savePlacement();
    });

    async function savePlacement() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                sell_wl_1l: document.getElementById('sell_wl_1l').value,
                sell_wl_35cl: document.getElementById('sell_wl_35cl').value,
                sell_wl_75cl: document.getElementById('sell_wl_75cl').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addPlacement(data);
            
            formNotification.classList.remove('hidden');
            formPlacement.reset();
            
            // Refresh list
            await fetchPlacement();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving placement: ' + error.message);
        }
    }

    async function fetchPlacement() {
        if (!storeId) return;
        
        placementList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getPlacementByStore(storeId);
            placementList.innerHTML = '';
            
            if (items.length === 0) {
                placementList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">${date}</h4>
                    <p><strong>Sell William Lawson 1L:</strong> ${item.sell_wl_1l}</p>
                    <p><strong>Sell William Lawson 35cl:</strong> ${item.sell_wl_35cl}</p>
                    <p><strong>Sell William Lawson 75cl:</strong> ${item.sell_wl_75cl}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                placementList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching placement:', error);
            placementList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchPlacement();
});