// DOM Utilities
const DOMUtils = {
    // Create element with attributes and properties
    createElement: function(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Add children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Show toast notification
    showToast: function(message, type = 'info', duration = 3000) {
        const toast = this.createElement('div', {
            className: `toast toast-${type}`,
            role: 'alert'
        }, [message]);
        
        document.body.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-visible');
        });
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    // NEW: Function to load HTML partials
    async loadHTML(filePath, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found.`);
            return;
        }
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Network response was not ok');
            container.innerHTML = await response.text();
        } catch (error) {
            console.error(`Failed to load HTML from ${filePath}:`, error);
            container.innerHTML = `<p class="error-message">Failed to load content.</p>`;
        }
    },

    // Create loading spinner
    createSpinner: function(size = 'md') {
        return this.createElement('div', {
            className: `spinner spinner-${size}`,
            role: 'status'
        }, [
            this.createElement('span', {
                className: 'sr-only'
            }, ['Loading...'])
        ]);
    },
    
    // Show/hide loading state
    showLoading: function(element, size = 'md') {
        if (!element) return;
        
        const spinner = this.createSpinner(size);
        element.classList.add('loading');
        element.appendChild(spinner);
        
        return () => {
            element.classList.remove('loading');
            spinner.remove();
        };
    },
    
    // Toggle element visibility
    toggle: function(element, show) {
        if (!element) return;
        
        if (typeof show === 'boolean') {
            element.classList.toggle('hidden', !show);
        } else {
            element.classList.toggle('hidden');
        }
    },
    
    // Load image with loading state
    loadImage: function(url, altText = '') {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            Performance.start(`image-${url}`);
            
            img.onload = () => {
                Performance.end(`image-${url}`);
                resolve(img);
            };
            
            img.onerror = (error) => {
                ErrorHandler.handleResourceError(error, url);
                reject(error);
            };
            
            img.src = url;
            img.alt = altText;
        });
    },
    
    // Update progress bar
    updateProgress: function(element, value, max = 100) {
        if (!element) return;
        
        const percentage = (value / max) * 100;
        element.style.width = `${percentage}%`;
        element.setAttribute('aria-valuenow', value);
        element.setAttribute('aria-valuemax', max);
    },
    
    // Create modal dialog
    createModal: function(content, options = {}) {
        const modal = this.createElement('div', {
            className: 'modal',
            role: 'dialog',
            'aria-modal': 'true'
        }, [
            this.createElement('div', {
                className: 'modal-content'
            }, [
                this.createElement('button', {
                    className: 'modal-close',
                    'aria-label': 'Close modal',
                    onclick: () => modal.remove()
                }, ['×']),
                content
            ])
        ]);
        
        document.body.appendChild(modal);
        
        // Trap focus in modal
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length) {
            focusableElements[0].focus();
        }
        
        return modal;
    },
    
    // Lazy load images
    setupLazyLoading: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// Export DOMUtils
window.DOMUtils = DOMUtils;