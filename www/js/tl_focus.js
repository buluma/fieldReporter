document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const focusList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formFocus = document.getElementById('form_focus');
    const formNotification = document.getElementById('formNotification');
    const addFocusBtn = document.getElementById('addFocusBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `TL Focus: ${decodeURIComponent(storeName)}`;
    }

    // Initialize Flatpickr
    flatpickr("#act_start_date", {
        dateFormat: "Y-m-d",
        defaultDate: "today"
    });
    flatpickr("#act_end_date", {
        dateFormat: "Y-m-d"
    });

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
        formFocus.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addFocusBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formFocus.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveFocus();
    });

    async function saveFocus() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                title: document.getElementById('focus_title').value,
                focus_areas: document.getElementById('focus_input').value,
                next_action: document.getElementById('action_input').value,
                start_date: document.getElementById('act_start_date').value,
                end_date: document.getElementById('act_end_date').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addTLFocus(data);
            
            formNotification.classList.remove('hidden');
            formFocus.reset();
            
            // Refresh list
            await fetchFocusItems();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving focus area: ' + error.message);
        }
    }

    async function fetchFocusItems() {
        if (!storeId) return;
        
        focusList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getTLFocusByStore(storeId);
            focusList.innerHTML = '';
            
            if (items.length === 0) {
                focusList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">${item.title}</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${date}</p>
                    <p><strong>Focus Areas:</strong> ${item.focus_areas}</p>
                    <p><strong>Next Action:</strong> ${item.next_action}</p>
                    <p><strong>Period:</strong> ${item.start_date} to ${item.end_date}</p>
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                focusList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching focus items:', error);
            focusList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchFocusItems();
});