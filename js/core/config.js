// Configuration management
const Config = {
    // Debug settings
    debug: {
        enabled: true,
        logLevel: 'info' // 'error' | 'warn' | 'info' | 'debug'
    },

    // Map defaults
    map: {
        center: {
            lat: 36.174465,
            lng: -86.767960
        },
        zoom: 5,
        maxZoom: 19,
        minZoom: 2
    },

    // Cache settings
    cache: {
        enabled: true,
        duration: 300000 // 5 minutes in milliseconds
    },

    // Loading states
    loading: {
        minDuration: 300, // Minimum loading time to prevent flashing
        timeout: 10000    // Request timeout
    },

    // Animation settings
    animation: {
        enabled: true,
        duration: 300,
        easing: 'ease-out'
    },

    // Responsive breakpoints
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024
    },

    // Get a configuration value with dot notation
    get(path, defaultValue = null) {
        return path.split('.').reduce((obj, key) => 
            (obj && obj[key] !== undefined) ? obj[key] : defaultValue, 
            this
        );
    },

    // Set a configuration value with dot notation
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => 
            (obj[key] = obj[key] || {}), 
            this
        );
        target[lastKey] = value;
        return this;
    }
};

// Freeze the configuration to prevent modifications
Object.freeze(Config);

// Export Config
window.Config = Config;