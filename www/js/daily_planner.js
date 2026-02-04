document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const pageTitle = document.getElementById('pageTitle');
    const planList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formDailyPlan = document.getElementById('form_daily_plan');
    const formNotification = document.getElementById('formNotification');
    const addPlanBtn = document.getElementById('addPlanBtn');
    const syncPlanBtn = document.getElementById('syncPlanBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const storesSelect = document.getElementById('stores_select');
    const modalTitle = document.getElementById('modalTitle');
    const planIdInput = document.getElementById('plan_id');

    let currentPlanId = null; // To track if we are editing or adding

    // Initialize Flatpickr for date input
    flatpickr("#daily_date", {
        dateFormat: "Y-m-d",
        defaultDate: "today"
    });

    // Populate stores multi-select dropdown
    async function populateStoresSelect() {
        try {
            const stores = await getStoresForDailyPlanSelect();
            storesSelect.innerHTML = ''; // Clear existing options
            stores.forEach(store => {
                const option = document.createElement('option');
                option.value = store.id;
                option.textContent = store.name;
                storesSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating stores dropdown:', error);
        }
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
        formDailyPlan.reset();
        formNotification.classList.add('hidden');
        planIdInput.value = '0'; // Reset hidden ID
        currentPlanId = null;
        modalTitle.textContent = 'New Daily Plan';
        document.getElementById('daily_date').valueAsDate = new Date(); // Reset date
        // Clear multi-select and re-populate
        populateStoresSelect(); 
    }

    // Event Listeners
    addPlanBtn.addEventListener('click', () => {
        resetForm();
        showModal();
    });
    syncPlanBtn.addEventListener('click', () => {
        alert('Sync functionality is not yet implemented.');
        // TODO: Implement actual sync logic here
    });
    closeModalBtn.addEventListener('click', hideModal);
    backToHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    formDailyPlan.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveDailyPlan();
    });

    async function saveDailyPlan() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const selectedStoreIds = Array.from(storesSelect.selectedOptions).map(option => parseInt(option.value));
            const selectedStores = await Promise.all(selectedStoreIds.map(id => getStoreById(id)));

            const planData = {
                daily_date: document.getElementById('daily_date').value,
                start_time_input: document.getElementById('start_time_input').value,
                end_time_input: document.getElementById('end_time_input').value,
                daily_challenges: document.getElementById('daily_challenges').value,
                daily_notes: document.getElementById('daily_notes').value,
                stores_visited: selectedStores.map(store => ({id: store.id, name: store.name})),
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`,
                week: moment(document.getElementById('daily_date').value).week(), // Using moment.js for week number
                month: moment(document.getElementById('daily_date').value).month() + 1, // moment months are 0-indexed
                year: moment(document.getElementById('daily_date').value).year()
            };

            if (currentPlanId) {
                await updateDailyPlan(currentPlanId, planData);
            } else {
                await addDailyPlan(planData);
            }
            
            formNotification.classList.remove('hidden');
            
            // Refresh list
            await fetchDailyPlans();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving daily plan: ' + error.message);
            console.error(error);
        }
    }

    async function fetchDailyPlans() {
        planList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                planList.innerHTML = '<div class="list-group-item">Please log in to view plans.</div>';
                return;
            }
            // Fetch plans for current week, month, year and submitter
            const currentWeek = moment().week();
            const currentMonth = moment().month() + 1;
            const currentYear = moment().year();

            const items = await getDailyPlans(currentWeek, currentMonth, currentYear, currentUser.username);
            planList.innerHTML = '';
            
            if (items.length === 0) {
                planList.innerHTML = '<div class="list-group-item">No plans found for this week.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">${item.daily_date}</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">${item.start_time_input} - ${item.end_time_input}</p>
                    <p><strong>Stores:</strong> ${item.stores_visited.map(s => s.name).join(', ')}</p>
                    ${item.daily_challenges ? `<p><strong>Actions:</strong> ${item.daily_challenges}</p>` : ''}
                    ${item.daily_notes ? `<p><strong>Notes:</strong> ${item.daily_notes}</p>` : ''}
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                    <button class="btn btn-default btn-xs edit-plan-btn" data-id="${item.id}" style="margin-top: 10px;">Edit</button>
                `;
                planList.appendChild(div);
            });

            // Add edit event listeners
            document.querySelectorAll('.edit-plan-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const planId = parseInt(e.target.dataset.id);
                    await editDailyPlan(planId);
                });
            });

        } catch (error) {
            console.error('Error fetching daily plans:', error);
            planList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    async function editDailyPlan(planId) {
        currentPlanId = planId;
        modalTitle.textContent = 'Edit Daily Plan';
        const plan = await getDailyPlanByDate(currentPlanId); // This needs to be by ID, not date
        // Need to implement getDailyPlanById
        
        // For now, let's assume we fetch it by ID if currentPlanId is set.
        // As getDailyPlanByDate is by date, week, month, year, and submitter,
        // it's not suitable for editing a specific plan by ID.
        // For a full implementation, would need a getDailyPlanById(id) in db.js
        // For now, just prefill with dummy data or existing from planList array

        // Fallback or a proper fetch by ID
        const currentPlans = await getDailyPlans(moment().week(), moment().month() + 1, moment().year(), getCurrentUser().username);
        const planToEdit = currentPlans.find(p => p.id === planId);

        if (planToEdit) {
            document.getElementById('daily_date').value = planToEdit.daily_date;
            document.getElementById('start_time_input').value = planToEdit.start_time_input;
            document.getElementById('end_time_input').value = planToEdit.end_time_input;
            document.getElementById('daily_challenges').value = planToEdit.daily_challenges;
            document.getElementById('daily_notes').value = planToEdit.daily_notes;
            planIdInput.value = planToEdit.id;

            // Select stores
            Array.from(storesSelect.options).forEach(option => {
                option.selected = planToEdit.stores_visited.some(s => s.id === parseInt(option.value));
            });
            
            showModal();
        } else {
            alert('Plan not found for editing.');
        }
    }


    // Initial Load
    await populateStoresSelect();
    await fetchDailyPlans();
});