document.addEventListener('DOMContentLoaded', async () => {
    // Fix Leaflet's default icon paths for environments where they aren't automatically resolved
    L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

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
        const currentUser = getCurrentUser(); // Get current user from db.js
        const userName = currentUser ? currentUser.username : 'Unknown User';
        userMarker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Your Location: <b>${userName}</b>`).openPopup();
        return userMarker;
    }

    // Function to add store markers
    async function addStoreMarkers() {
        storeMarkers.clearLayers(); // Clear existing store markers
        const stores = await getAllStores();
        console.log('Stores retrieved from DB:', stores); // DEBUG LOG
        const users = await getAllUsers();
        const userIdToUsernameMap = new Map(users.map(user => [user.id, user.username]));

        stores.forEach(store => {
            if (store.latitude && store.longitude) { // CRITICAL CONDITION
                console.log('Adding marker for store:', store.name, store.latitude, store.longitude); // DEBUG LOG
                const userName = userIdToUsernameMap.get(store.userId) || 'N/A';
                const marker = L.marker([store.latitude, store.longitude]).addTo(map)
                    .bindPopup(`<b>${store.name}</b><br>${store.address || ''}<br>User: ${userName}`); // Display store details
                storeMarkers.addLayer(marker);
            } else {
                console.warn('Skipping store marker for:', store.name, 'due to missing/invalid location data:', store.latitude, store.longitude); // DEBUG LOG
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
        map.invalidateSize(); // Invalidate map size to ensure it renders correctly
    }

    // Call loadMap when everything is ready
    loadMap();
});
