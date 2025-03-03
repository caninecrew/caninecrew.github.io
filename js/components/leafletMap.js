const LeafletMapUtils = {
    // Initialize a map in the specified container
    initializeMap: function(elementId, centerLat = 36.174465, centerLng = -86.767960, zoom = 5) {
        const mapContainer = document.getElementById(elementId);
        const mapLoading = document.getElementById(`${elementId}-loading`);
        const mapError = document.getElementById(`${elementId}-error`);
        
        if (!mapContainer) return null;
        
        try {
            // Hide loading indicator
            if (mapLoading) mapLoading.style.display = 'none';
            
            // Create the map
            const map = L.map(elementId).setView([centerLat, centerLng], zoom);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            return map;
        } catch (error) {
            console.error('Map initialization failed:', error);
            if (mapLoading) mapLoading.style.display = 'none';
            if (mapError) mapError.style.display = 'block';
            return null;
        }
    },
    
    // Add markers to a map
    addMarkers: function(map, locations) {
        if (!map || !locations) return;
        
        const markers = [];
        
        locations.forEach(location => {
            // Create custom popup content
            const popupContent = location.content || `
                <div class="map-popup">
                    <h3>${location.title || ''}</h3>
                    <p>${location.description || ''}</p>
                </div>
            `;
            
            // Create marker
            const marker = L.marker([
                location.position.lat, 
                location.position.lng
            ]).addTo(map);
            
            // Add popup
            marker.bindPopup(popupContent);
            
            markers.push(marker);
        });
        
        return markers;
    }
};