document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const visibilityList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formVisibility = document.getElementById('form_visibility');
    const formNotification = document.getElementById('FormNotification');
    const addVisibilityBtn = document.getElementById('addVisibilityBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Visibility: ${decodeURIComponent(storeName)}`;
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
        formVisibility.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addVisibilityBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formVisibility.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveVisibility();
    });

    async function saveVisibility() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                wall_branding: document.getElementById('wall_branding').value,
                sign_board: document.getElementById('sign_board').value,
                eye_level: document.getElementById('eye_level').value,
                poster_available: document.getElementById('poster_available').value,
                poster_placement: document.getElementById('poster_placement').value,
                visibility_potential: document.getElementById('visibility_potential').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addVisibility(data);
            
            formNotification.classList.remove('hidden');
            formVisibility.reset();
            
            // Refresh list
            await fetchVisibility();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving visibility: ' + error.message);
        }
    }

    async function fetchVisibility() {
        if (!storeId) return;
        
        visibilityList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getVisibilityByStore(storeId);
            visibilityList.innerHTML = '';
            
            if (items.length === 0) {
                visibilityList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #E8A953;">${date}</h4>
                    <p><strong>Wall Branding:</strong> ${item.wall_branding}</p>
                    <p><strong>Sign Board:</strong> ${item.sign_board}</p>
                    <p><strong>3+ Facings Eye Level:</strong> ${item.eye_level}</p>
                    <p><strong>ABS Poster Available:</strong> ${item.poster_available}</p>
                    <p><strong>Poster Placed:</strong> ${item.poster_placement}</p>
                    <p><strong>Potential for Sign Board:</strong> ${item.visibility_potential}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                visibilityList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching visibility:', error);
            visibilityList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchVisibility();
});