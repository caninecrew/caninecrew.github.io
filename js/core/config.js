// Configuration management
const Config = {
    // Core settings
    core: {
        debug: false,
        version: '1.0.0',
        apiEndpoints: {
            base: 'https://api.example.com',
            cdn: 'https://cdn.example.com'
        }
    },

    // Feature flags
    features: {
        offlineSupport: true,
        analytics: false,
        performanceTracking: true,
        mapInteractions: true
    },

    // Performance settings
    performance: {
        cacheDuration: 3600, // 1 hour
        maxCacheSize: 50 * 1024 * 1024, // 50MB
        preloadImages: true,
        lazyLoadThreshold: '50px'
    },

    // UI/UX settings
    ui: {
        theme: 'light',
        animationDuration: 300,
        toastDuration: 3000,
        breakpoints: {
            mobile: 576,
            tablet: 768,
            desktop: 992,
            wide: 1200
        }
    },

    // Map settings
    map: {
        defaultZoom: 4,
        maxZoom: 18,
        minZoom: 2,
        defaultCenter: {
            lat: 39.8283,
            lng: -98.5795
        },
        style: 'mapbox://styles/mapbox/streets-v11'
    },

    // Get a configuration value
    get: function(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this);
    },

    // Set a configuration value
    set: function(path, value) {
        const parts = path.split('.');
        const last = parts.pop();
        const obj = parts.reduce((obj, key) => obj[key] = obj[key] || {}, this);
        obj[last] = value;
        
        // Save to localStorage if available
        this.saveToStorage();
    },

    // Load configuration from localStorage
    loadFromStorage: function() {
        try {
            const stored = localStorage.getItem('site-config');
            if (stored) {
                const config = JSON.parse(stored);
                Object.assign(this, config);
            }
        } catch (error) {
            console.warn('Failed to load config from storage:', error);
        }
    },

    // Save configuration to localStorage
    saveToStorage: function() {
        try {
            localStorage.setItem('site-config', JSON.stringify({
                core: this.core,
                features: this.features,
                performance: this.performance,
                ui: this.ui,
                map: this.map
            }));
        } catch (error) {
            console.warn('Failed to save config to storage:', error);
        }
    },

    // Initialize configuration
    init: function() {
        // Load stored configuration
        this.loadFromStorage();

        // Set up environment-specific settings
        if (window.location.hostname === 'localhost') {
            this.core.debug = true;
        }

        // Set up feature detection
        this.features.offlineSupport = 'serviceWorker' in navigator;
        this.features.performanceTracking = 'performance' in window;

        // Update UI settings based on user preferences
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.ui.theme = 'dark';
        }

        // Save initial configuration
        this.saveToStorage();
    }
};

// Export Config
window.Config = Config;

// Initialize configuration when DOM is ready
document.addEventListener('DOMContentLoaded', () => Config.init());