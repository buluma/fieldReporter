document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const availabilityList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formAvailability = document.getElementById('form_availability');
    const formNotification = document.getElementById('FormNotification');
    const addAvailabilityBtn = document.getElementById('addAvailabilityBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Availability: ${decodeURIComponent(storeName)}`;
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
        formAvailability.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addAvailabilityBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formAvailability.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveAvailability();
    });

    async function saveAvailability() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                available_wl_1l: document.getElementById('available_wl_1l').value,
                available_wl_35cl: document.getElementById('available_wl_35cl').value,
                available_wl_75cl: document.getElementById('available_wl_75cl').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addAvailability(data);
            
            formNotification.classList.remove('hidden');
            formAvailability.reset();
            
            // Refresh list
            await fetchAvailability();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving availability: ' + error.message);
        }
    }

    async function fetchAvailability() {
        if (!storeId) return;
        
        availabilityList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getAvailabilityByStore(storeId);
            availabilityList.innerHTML = '';
            
            if (items.length === 0) {
                availabilityList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #4CAF50;">${date}</h4>
                    <p><strong>William Lawson 1L:</strong> ${item.available_wl_1l}</p>
                    <p><strong>William Lawson 35cl:</strong> ${item.available_wl_35cl}</p>
                    <p><strong>William Lawson 75cl:</strong> ${item.available_wl_75cl}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                availabilityList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching availability:', error);
            availabilityList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchAvailability();
});