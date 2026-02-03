document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const objectiveList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formObjective = document.getElementById('form_objective');
    const formNotification = document.getElementById('formNotification');
    const addObjectiveBtn = document.getElementById('addObjectiveBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');

    if (storeName) {
        pageTitle.textContent = `Objectives: ${decodeURIComponent(storeName)}`;
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
        formObjective.reset();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addObjectiveBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formObjective.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveObjective();
    });

    async function saveObjective() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                target_score: document.getElementById('obj_tgt_score').value,
                num_facings: document.getElementById('obj_cat_total').value,
                target_facings: document.getElementById('obj_tgt_fac').value,
                current_facings: document.getElementById('obj_curr_facings').value,
                current_percentage: document.getElementById('obj_curr_perc').value,
                achieved: document.getElementById('obj_yes_no').value,
                if_no_why: document.getElementById('obj_ifnowhy').value,
                action_point: document.getElementById('obj_action').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addObjective(data);
            
            formNotification.classList.remove('hidden');
            formObjective.reset();
            
            // Refresh list
            await fetchObjectives();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving objective: ' + error.message);
        }
    }

    async function fetchObjectives() {
        if (!storeId) return;
        
        objectiveList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getObjectivesByStore(storeId);
            objectiveList.innerHTML = '';
            
            if (items.length === 0) {
                objectiveList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">Score: ${item.current_percentage}%</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${date}</p>
                    <p><strong>Achieved:</strong> ${item.achieved}</p>
                    <p><strong>Target:</strong> ${item.target_score}% | <strong>Facings:</strong> ${item.current_facings}/${item.num_facings}</p>
                    ${item.action_point ? `<p><strong>Action:</strong> ${item.action_point}</p>` : ''}
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                objectiveList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching objectives:', error);
            objectiveList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await fetchObjectives();
});