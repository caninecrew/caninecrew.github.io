// Unified map functionality for all pages
const MapUtils = {
    // Load Google Maps API with proper callback
    loadAPI: function(callbackName = 'initMap') {
        if (typeof config === 'undefined' || !config.mapsApiKey) {
            console.error('Missing Maps API configuration');
            return;
        }
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.mapsApiKey}&callback=${callbackName}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    },
    
    // Initialize a map in the specified container
    initializeMap: function(elementId, options) {
        const mapContainer = document.getElementById(elementId);
        const mapLoading = document.getElementById(`${elementId}-loading`);
        const mapError = document.getElementById(`${elementId}-error`);
        
        if (!mapContainer) return null;
        
        try {
            const mapOptions = options || config.mapDefaults;
            const map = new google.maps.Map(mapContainer, mapOptions);
            
            // Hide loading indicator
            if (mapLoading) mapLoading.style.display = 'none';
            
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
        
        return locations.map(location => {
            const marker = new google.maps.Marker({
                position: location.position,
                map: map,
                title: location.title,
                icon: location.icon || null
            });
            
            if (location.content) {
                const infowindow = new google.maps.InfoWindow({
                    content: location.content
                });
                
                marker.addListener('click', () => {
                    infowindow.open(map, marker);
                });
            }
            
            return marker;
        });
    }
};

// Enhanced mapping component using Leaflet
class LeafletMap {
    constructor(options = {}) {
        this.options = Object.assign({
            defaultCenter: [36.174465, -86.767960], // Nashville
            defaultZoom: 5,
            debug: false
        }, options);
        
        this.maps = {};
    }
    
    initialize(elementId, options = {}) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) {
            this.log(`Map element #${elementId} not found`, 'error');
            return null;
        }
        
        // Hide loading indicator if exists
        const loadingElement = document.getElementById(`${elementId}-loading`);
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        try {
            const mapOptions = {
                center: options.center || this.options.defaultCenter,
                zoom: options.zoom || this.options.defaultZoom
            };
            
            const map = L.map(elementId, mapOptions);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Store map instance
            this.maps[elementId] = map;
            this.log(`Map ${elementId} initialized`);
            
            return map;
        } catch (error) {
            this.log(`Error initializing map ${elementId}: ${error.message}`, 'error');
            
            // Show error message if exists
            const errorElement = document.getElementById(`${elementId}-error`);
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            
            return null;
        }
    }
    
    addMarkers(mapId, locations = []) {
        const map = this.maps[mapId];
        if (!map) {
            this.log(`Map ${mapId} not found`, 'error');
            return [];
        }
        
        if (!locations.length) {
            this.log(`No locations provided for map ${mapId}`, 'warn');
            return [];
        }
        
        const markers = locations.map(location => {
            const { lat, lng } = location.position;
            
            if (!lat || !lng) {
                this.log(`Invalid position for marker ${location.title || 'untitled'}`, 'warn');
                return null;
            }
            
            // Create marker
            const marker = L.marker([lat, lng]).addTo(map);
            
            // Add popup if content provided
            if (location.content) {
                marker.bindPopup(location.content);
            }
            
            return marker;
        }).filter(marker => marker !== null);
        
        this.log(`Added ${markers.length} markers to map ${mapId}`);
        return markers;
    }
    
    log(message, type = 'info') {
        if (!this.options.debug && type !== 'error') return;
        
        const prefix = '[LeafletMap]';
        Utils.log(`${prefix} ${message}`, type);
    }
}

// Create global instance
window.mapManager = new LeafletMap({ debug: true });