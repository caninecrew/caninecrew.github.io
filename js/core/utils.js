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
    },

    // Enhanced error handling and loading states
    async loadWithState(elementId, loadingFunction) {
        const element = document.getElementById(elementId);
        if (!element) return null;
        
        try {
            element.classList.add('loading');
            const result = await loadingFunction();
            return result;
        } catch (error) {
            element.innerHTML = `
                <div class="error-state">
                    <p>Sorry, there was an error loading this content.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                </div>`;
            this.log(error.message, 'error');
            return null;
        } finally {
            element.classList.remove('loading');
        }
    },

    // Enhanced fetch with timeout and retry
    async fetchWithRetry(url, options = {}, retries = 2, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            if (retries > 0 && error.name !== 'AbortError') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.fetchWithRetry(url, options, retries - 1, timeout);
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    },

    // Enhanced logging with timestamp and debug levels
    log(message, type = 'info', context = '') {
        if (!window.DEBUG && type !== 'error') return;
        
        const timestamp = new Date().toISOString();
        const prefix = context ? `[${timestamp}][${context}]` : `[${timestamp}]`;
        
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
    },

    // Cache management
    cache: new Map(),
    
    async getCached(key, fetchFunction, ttl = 300000) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.data;
        }
        
        const data = await fetchFunction();
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        
        return data;
    }
};

// Export Utils
window.Utils = Utils;