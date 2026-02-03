document.addEventListener('DOMContentLoaded', async () => {
    await initDB(); // Initialize DB for getAllStores and getUserLocation
    
    const mapContainer = 'map'; // ID of the map div
    let map = null; // Leaflet map object
    let userMarker = null;
    const storeMarkers = L.featureGroup(); // To group store markers

    // Function to initialize the map
    function initializeMap(centerLat, centerLng, zoom = 13) {
        if (map) {
            map.remove(); // Remove existing map if any
        }
        map = L.map(mapContainer).setView([centerLat, centerLng], zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    // Function to add user location marker
    function addUserLocation(latitude, longitude) {
        if (userMarker) {
            userMarker.remove();
        }
        userMarker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup('Your Location').openPopup();
        return userMarker;
    }

    // Function to add store markers
    async function addStoreMarkers() {
        storeMarkers.clearLayers(); // Clear existing store markers
        const stores = await getAllStores();
        stores.forEach(store => {
            if (store.latitude && store.longitude) {
                const marker = L.marker([store.latitude, store.longitude]).addTo(map)
                    .bindPopup(`<b>${store.name}</b><br>${store.address || ''}<br>User: ${store.userId || 'N/A'}`); // Display store details
                storeMarkers.addLayer(marker);
            }
        });
        map.addLayer(storeMarkers);
    }

    // Main map loading logic
    async function loadMap() {
        let userLat = 0;
        let userLng = 0;
        let hasUserLocation = false;

        try {
            const userLocation = await getUserLocation();
            userLat = userLocation.latitude;
            userLng = userLocation.longitude;
            hasUserLocation = true;
        } catch (error) {
            console.warn('Could not get user location:', error.message);
            // Default center if no user location
            userLat = 0; // Fallback to a default location (e.g., global center)
            userLng = 0;
        }

        initializeMap(userLat, userLng); // Initialize map centered at user location or default

        if (hasUserLocation) {
            addUserLocation(userLat, userLng);
        }

        await addStoreMarkers(); // Add all store markers

        // Fit map to show all markers (user + stores)
        const allMarkers = L.featureGroup();
        if (userMarker) {
            allMarkers.addLayer(userMarker);
        }
        storeMarkers.eachLayer(layer => {
            allMarkers.addLayer(layer);
        });

        if (allMarkers.getLayers().length > 0) {
            map.fitBounds(allMarkers.getBounds(), { padding: [50, 50] });
        }
    }

    // Call loadMap when everything is ready
    loadMap();
});
