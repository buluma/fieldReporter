document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const checklistList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formChecklist = document.getElementById('form_checklist');
    const formNotification = document.getElementById('formNotification');
    const addChecklistBtn = document.getElementById('addChecklistBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Checklist: ${decodeURIComponent(storeName)}`;
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
        formChecklist.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addChecklistBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formChecklist.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveChecklist();
    });

    async function saveChecklist() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                beer_bottles: document.getElementById('beer_bottles').value,
                beer: document.getElementById('beer').value,
                rtds: document.getElementById('rtds').value,
                vodka: document.getElementById('vodka').value,
                liqeur: document.getElementById('liqeur').value,
                brandy: document.getElementById('brandy').value,
                whisky: document.getElementById('whisky').value,
                tequila: document.getElementById('tequila').value,
                rums: document.getElementById('rums').value,
                anads: document.getElementById('anads').value,
                gins: document.getElementById('gins').value,
                canes: document.getElementById('canes').value,
                cold_space: document.getElementById('cold_space').value,
                comments: document.getElementById('comments').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addChecklistRecord(data);
            
            formNotification.classList.remove('hidden');
            formChecklist.reset();
            
            // Refresh list
            await fetchChecklistRecords();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving checklist: ' + error.message);
        }
    }

    async function fetchChecklistRecords() {
        if (!storeId) return;
        
        checklistList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getChecklistRecordsByStore(storeId);
            checklistList.innerHTML = '';
            
            if (items.length === 0) {
                checklistList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">Checklist Record</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${date}</p>
                    <p><strong>Beer Bottles:</strong> ${item.beer_bottles}%</p>
                    <p><strong>Beer:</strong> ${item.beer}%</p>
                    <p><strong>RTDs:</strong> ${item.rtds}%</p>
                    <p><strong>Vodka:</strong> ${item.vodka}%</p>
                    <p><strong>Liqeur:</strong> ${item.liqeur}%</p>
                    <p><strong>Brandy:</strong> ${item.brandy}%</p>
                    <p><strong>Whisky:</strong> ${item.whisky}%</p>
                    <p><strong>Tequila:</strong> ${item.tequila}%</p>
                    <p><strong>Rums:</strong> ${item.rums}%</p>
                    <p><strong>Anads:</strong> ${item.anads}%</p>
                    <p><strong>Gins:</strong> ${item.gins}%</p>
                    <p><strong>Canes:</strong> ${item.canes}%</p>
                    <p><strong>Cold Space:</strong> ${item.cold_space}</p>
                    ${item.comments ? `<p><strong>Comments:</strong> ${item.comments}</p>` : ''}
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                checklistList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching checklist records:', error);
            checklistList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchChecklistRecords();
});