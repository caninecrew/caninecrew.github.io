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
            debug: false,
            retryAttempts: 3,
            retryDelay: 1000
        }, options);
        
        this.maps = {};
    }
    
    async initialize(elementId, options = {}) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) {
            this.log(`Map element #${elementId} not found`, 'error');
            return null;
        }
        
        // Setup loading and error states
        this.setupMapElements(elementId);
        
        try {
            // Show loading state
            this.showLoading(elementId);
            
            // Initialize map with retry logic
            const map = await this.initializeWithRetry(elementId, options);
            
            // Add keyboard controls
            this.setupKeyboardControls(map, elementId);
            
            // Add accessibility features
            A11yUtils.setupMapA11y(mapElement);
            
            this.hideLoading(elementId);
            return map;
        } catch (error) {
            this.log(`Error initializing map ${elementId}: ${error.message}`, 'error');
            this.showError(elementId);
            return null;
        }
    }
    
    async initializeWithRetry(elementId, options, attempt = 1) {
        try {
            const mapOptions = {
                center: options.center || this.options.defaultCenter,
                zoom: options.zoom || this.options.defaultZoom,
                keyboard: true,
                zoomControl: true
            };
            
            const map = L.map(elementId, mapOptions);
            
            // Add tile layer with retry
            await this.addTileLayerWithRetry(map);
            
            // Store map instance
            this.maps[elementId] = map;
            this.log(`Map ${elementId} initialized`);
            
            return map;
        } catch (error) {
            if (attempt < this.options.retryAttempts) {
                this.log(`Retry attempt ${attempt} for map ${elementId}`, 'warn');
                await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
                return this.initializeWithRetry(elementId, options, attempt + 1);
            }
            throw error;
        }
    }
    
    async addTileLayerWithRetry(map, attempt = 1) {
        try {
            await new Promise((resolve, reject) => {
                const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                }).addTo(map);
                
                layer.on('load', resolve);
                layer.on('error', reject);
            });
        } catch (error) {
            if (attempt < this.options.retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, this.options.retryDelay));
                return this.addTileLayerWithRetry(map, attempt + 1);
            }
            throw new Error('Failed to load map tiles');
        }
    }
    
    setupMapElements(elementId) {
        const mapContainer = document.getElementById(elementId);
        
        // Create loading indicator if it doesn't exist
        if (!document.getElementById(`${elementId}-loading`)) {
            const loading = document.createElement('div');
            loading.id = `${elementId}-loading`;
            loading.className = 'map-loading';
            loading.innerHTML = '<div class="loading-spinner"></div><span>Loading map...</span>';
            mapContainer.appendChild(loading);
        }
        
        // Create error message if it doesn't exist
        if (!document.getElementById(`${elementId}-error`)) {
            const error = document.createElement('div');
            error.id = `${elementId}-error`;
            error.className = 'map-error';
            error.innerHTML = `
                <p>Sorry, there was an error loading the map.</p>
                <button onclick="window.location.reload()">Try Again</button>
            `;
            mapContainer.appendChild(error);
        }
    }
    
    showLoading(elementId) {
        const loading = document.getElementById(`${elementId}-loading`);
        const error = document.getElementById(`${elementId}-error`);
        if (loading) loading.style.display = 'flex';
        if (error) error.style.display = 'none';
    }
    
    hideLoading(elementId) {
        const loading = document.getElementById(`${elementId}-loading`);
        if (loading) loading.style.display = 'none';
    }
    
    showError(elementId) {
        const loading = document.getElementById(`${elementId}-loading`);
        const error = document.getElementById(`${elementId}-error`);
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'flex';
    }
    
    setupKeyboardControls(map, elementId) {
        const mapElement = document.getElementById(elementId);
        if (!mapElement) return;
        
        mapElement.addEventListener('keydown', (e) => {
            if (document.activeElement === mapElement) {
                const panAmount = 50;
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        map.panBy([0, -panAmount]);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        map.panBy([0, panAmount]);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        map.panBy([-panAmount, 0]);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        map.panBy([panAmount, 0]);
                        break;
                    case '+':
                        e.preventDefault();
                        map.zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        map.zoomOut();
                        break;
                }
            }
        });
    }
    
    addMarkers(mapId, locations = []) {
        const map = this.maps[mapId];
        if (!map || !locations.length) return [];
        
        return locations.map(location => {
            if (!location.position?.lat || !location.position?.lng) {
                this.log(`Invalid marker position for ${location.title}`, 'warn');
                return null;
            }
            
            try {
                const marker = L.marker([location.position.lat, location.position.lng]);
                
                if (location.content) {
                    marker.bindPopup(location.content);
                }
                
                marker.addTo(map);
                return marker;
            } catch (error) {
                this.log(`Error adding marker for ${location.title}: ${error.message}`, 'error');
                return null;
            }
        }).filter(Boolean);
    }
    
    log(message, type = 'info') {
        if (!this.options.debug && type !== 'error') return;
        
        const prefix = '[LeafletMap]';
        Utils.log(`${prefix} ${message}`, type);
    }
}

// Create global instance
window.mapManager = new LeafletMap({ debug: true });