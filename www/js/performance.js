document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const performanceList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formPerformance = document.getElementById('form_performance');
    const formNotification = document.getElementById('formNotification');
    const addPerformanceBtn = document.getElementById('addPerformanceBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Performance: ${decodeURIComponent(storeName)}`;
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
        formPerformance.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addPerformanceBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formPerformance.addEventListener('submit', async (e) => {
        e.preventDefault();
        await savePerformance();
    });

    async function savePerformance() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                rtd_actual: document.getElementById('rtd_actual').value,
                udv_actual: document.getElementById('udv_actual').value,
                kbl_actual: document.getElementById('kbl_actual').value,
                comments: document.getElementById('comments').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addPerformance(data);
            
            formNotification.classList.remove('hidden');
            formPerformance.reset();
            
            // Refresh list
            await fetchPerformance();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving performance: ' + error.message);
        }
    }

    async function fetchPerformance() {
        if (!storeId) return;
        
        performanceList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getPerformanceByStore(storeId);
            performanceList.innerHTML = '';
            
            if (items.length === 0) {
                performanceList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">Weekly Performance</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${date}</p>
                    <p><strong>RTD:</strong> ${item.rtd_actual} | <strong>UDV:</strong> ${item.udv_actual} | <strong>KBL:</strong> ${item.kbl_actual}</p>
                    ${item.comments ? `<p><strong>Comments:</strong> ${item.comments}</p>` : ''}
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                performanceList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching performance:', error);
            performanceList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchPerformance();
});