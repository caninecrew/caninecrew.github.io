// Core utilities
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
    },

    // Initialize utility with state
    loadWithState: async function(id, loadFunction) {
        if (Performance) Performance.start(`load-${id}`);
        
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        
        try {
            // Add loading state
            element.classList.add('loading');
            
            // Execute load function
            await loadFunction();
            
            // Remove loading state
            element.classList.remove('loading');
            
            if (Performance) Performance.end(`load-${id}`);
        } catch (error) {
            element.classList.remove('loading');
            element.classList.add('error');
            
            ErrorHandler.handle(
                ErrorHandler.create(
                    `Failed to load ${id}`,
                    ErrorHandler.types.RESOURCE,
                    { error }
                )
            );
            
            throw error;
        }
    },

    // Load HTML file with caching
    loadHTMLFile: async function(elementId, filePath) {
        if (!elementId || !filePath) {
            throw new Error('Element ID and file path are required');
        }

        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id "${elementId}" not found`);
        }

        try {
            const content = await this.fetchWithRetry(filePath);
            element.innerHTML = content;
            
            // Initialize any components in loaded content
            this.initializeComponents(element);
            
            return true;
        } catch (error) {
            ErrorHandler.handle(
                ErrorHandler.create(
                    `Failed to load HTML file ${filePath}`,
                    ErrorHandler.types.RESOURCE,
                    { error }
                )
            );
            return false;
        }
    },

    // Initialize components within loaded content
    initializeComponents: function(container) {
        // Initialize collapsibles
        container.querySelectorAll('.collapsible').forEach(collapsible => {
            A11yUtils.setupCollapsibleA11y(collapsible);
        });

        // Initialize carousels
        container.querySelectorAll('.carousel').forEach(carousel => {
            A11yUtils.setupCarouselKeyboardNav(carousel);
        });

        // Initialize maps
        container.querySelectorAll('.map').forEach(map => {
            A11yUtils.setupMapA11y(map);
        });
    },

    // Lazy load images
    lazyLoadImages: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: Config.get('performance.lazyLoadThreshold')
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    // Preload critical resources
    preloadResources: function() {
        if (!Config.get('performance.preloadImages')) return;

        const preloadLinks = [
            { rel: 'preload', href: '/images/profile.jpg', as: 'image' },
            { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' }
        ];

        preloadLinks.forEach(link => {
            const linkElement = document.createElement('link');
            Object.assign(linkElement, link);
            document.head.appendChild(linkElement);
        });
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: function(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Export Utils
window.Utils = Utils;

// Initialize functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Utils.preloadResources();
    Utils.lazyLoadImages();
});