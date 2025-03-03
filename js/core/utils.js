// Core utility functions
const Utils = {
    // Random selection from arrays
    getRandomItems: function(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },
    
    // Path detection 
    isIndexPage: function() {
        const path = window.location.pathname;
        return path === '/' || path.endsWith('index.html') || path.endsWith('/');
    },
    
    getRelativePath: function(path) {
        return this.isIndexPage() ? path : '../' + path;
    },
    
    // Data loading
    fetchTextFile: async function(url, options = {}) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            
            const text = await response.text();
            
            if (options.filterComments) {
                return text.split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#') && !line.startsWith('//'));
            }
            return text;
        } catch (error) {
            console.error('Error fetching text file:', error);
            return [];
        }
    },
    
    // Logging with timestamp
    log: function(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}]`;
        
        switch(type) {
            case 'error':
                console.error(`${prefix} ERROR:`, message);
                break;
            case 'warn':
                console.warn(`${prefix} WARNING:`, message);
                break;
            case 'debug':
                console.debug(`${prefix} DEBUG:`, message);
                break;
            default:
                console.log(`${prefix} INFO:`, message);
        }
    }
};

// Export Utils
window.Utils = Utils;