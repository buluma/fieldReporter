document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const activationList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formActivation = document.getElementById('form_activation');
    const formNotification = document.getElementById('FormNotification');
    const addActivationBtn = document.getElementById('addActivationBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Activation: ${decodeURIComponent(storeName)}`;
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
        formActivation.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addActivationBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formActivation.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveActivation();
    });

    async function saveActivation() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                activation_status: document.getElementById('activation_status').value,
                storming_status: document.getElementById('storming_status').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addActivation(data);
            
            formNotification.classList.remove('hidden');
            formActivation.reset();
            
            // Refresh list
            await fetchActivation();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving activation: ' + error.message);
        }
    }

    async function fetchActivation() {
        if (!storeId) return;
        
        activationList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getActivationByStore(storeId);
            activationList.innerHTML = '';
            
            if (items.length === 0) {
                activationList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #5cb85c;">${date}</h4>
                    <p><strong>Open for activation?:</strong> ${item.activation_status}</p>
                    <p><strong>Open for bar storming?:</strong> ${item.storming_status}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                activationList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching activation:', error);
            activationList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchActivation();
});