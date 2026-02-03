document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB

    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get('store_id');
    const storeName = urlParams.get('store_name');

    const pageTitle = document.getElementById('pageTitle');
    const stockList = document.querySelector('.dataList');
    const formModal = document.getElementById('form-modal');
    const formStock = document.getElementById('form_stock');
    const formNotification = document.getElementById('formNotification');
    const addStockBtn = document.getElementById('addStockBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToStoreBtn = document.getElementById('backToStoreBtn');
    const brandsSelect = document.getElementById('brands');

    if (storeName) {
        pageTitle.textContent = `Brands: ${decodeURIComponent(storeName)}`;
    }

    // Default date to today
    document.getElementById('brand_stockdate').valueAsDate = new Date();

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
        formStock.reset();
        document.getElementById('brand_stockdate').valueAsDate = new Date();
        formNotification.classList.add('hidden');
    }

    // Event Listeners
    addStockBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    backToStoreBtn.addEventListener('click', () => {
        window.location.href = `store.html?id=${storeId}`;
    });

    formStock.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveStock();
    });

    async function populateBrandsDropdown() {
        try {
            const brands = await getAllBrands();
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.name; // Using name as code for now
                option.textContent = brand.name;
                brandsSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error populating brands:', error);
        }
    }

    async function saveStock() {
        try {
            const currentUser = getCurrentUser();
            const location = await getUserLocation();
            
            const data = {
                store_id: parseInt(storeId),
                brand: brandsSelect.value,
                stock_date: document.getElementById('brand_stockdate').value,
                current_stock: document.getElementById('brand_stock').value,
                sale: document.getElementById('brand_sale').value,
                order_placed: document.getElementById('brand_order').value,
                delivery: document.getElementById('brand_delivery').value,
                stock_out: document.getElementById('brand_stockout').value,
                remarks: document.getElementById('brand_remarks').value,
                submitter: currentUser ? currentUser.username : 'Unknown',
                coords: `${location.latitude},${location.longitude}`
            };

            await addBrandStock(data);
            
            formNotification.classList.remove('hidden');
            formStock.reset();
            
            // Refresh list
            await fetchStocks();
            
            // Hide modal after a short delay
            setTimeout(hideModal, 1500);
            
        } catch (error) {
            alert('Error saving stock: ' + error.message);
        }
    }

    async function fetchStocks() {
        if (!storeId) return;
        
        stockList.innerHTML = '<div class="list-group-item">Loading...</div>';
        
        try {
            const items = await getBrandStocksByStore(storeId);
            stockList.innerHTML = '';
            
            if (items.length === 0) {
                stockList.innerHTML = '<div class="list-group-item">No records found.</div>';
                return;
            }

            items.forEach(item => {
                const date = new Date(item.created_on).toLocaleString();
                const div = document.createElement('div');
                div.className = 'list-group-item';
                div.innerHTML = `
                    <h4 class="list-group-item-heading" style="margin-bottom: 10px; color: #337ab7;">${item.brand}</h4>
                    <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Date: ${item.stock_date} (Entered: ${date})</p>
                    <p><strong>Stock:</strong> ${item.current_stock} | <strong>Sale:</strong> ${item.sale}</p>
                    <p><strong>Order:</strong> ${item.order_placed} | <strong>Delivery:</strong> ${item.delivery}</p>
                    <p><strong>Stock Out:</strong> ${item.stock_out}</p>
                    ${item.remarks ? `<p><strong>Remarks:</strong> ${item.remarks}</p>` : ''}
                    <p style="font-size: 10px; color: #999; margin-top: 10px;">By: ${item.submitter} | Loc: ${item.coords}</p>
                `;
                stockList.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching stocks:', error);
            stockList.innerHTML = `<div class="list-group-item error">Error: ${error.message}</div>`;
        }
    }

    // Initial Load
    await populateBrandsDropdown();
    await fetchStocks();
});