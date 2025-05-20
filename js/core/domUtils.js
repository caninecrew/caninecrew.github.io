// DOM Manipulation Utilities
const DOMUtils = {
    // Create an element with attributes and properties
    createElement: function(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes and properties
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
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
            } else if (child instanceof Node) {
                element.appendChild(child);
            }
        });
        
        return element;
    },

    // Load HTML content into an element
    async loadContent: function(element, url) {
        try {
            Performance.start(`load-content-${url}`);
            const response = await Utils.fetchWithRetry(url);
            element.innerHTML = response;
            Performance.end(`load-content-${url}`);
            return true;
        } catch (error) {
            ErrorHandler.handle(
                ErrorHandler.create(
                    `Failed to load content from ${url}`,
                    ErrorHandler.types.RESOURCE,
                    { error }
                )
            );
            return false;
        }
    },

    // Add loading state to element
    addLoading: function(element, text = 'Loading...') {
        const loadingEl = this.createElement('div', {
            className: 'loading-overlay'
        }, [
            this.createElement('div', { className: 'loading-spinner' }),
            this.createElement('p', {}, [text])
        ]);
        
        element.appendChild(loadingEl);
        return loadingEl;
    },

    // Remove loading state
    removeLoading: function(element) {
        const loading = element.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    },

    // Show error message
    showError: function(element, message) {
        const errorEl = this.createElement('div', {
            className: 'error-message',
            role: 'alert'
        }, [message]);
        
        element.appendChild(errorEl);
        return errorEl;
    },

    // Create a toast notification
    showToast: function(message, type = 'info', duration = Config.get('ui.toastDuration')) {
        const toast = this.createElement('div', {
            className: `toast toast-${type}`,
            role: 'alert'
        }, [message]);
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
        
        return toast;
    },

    // Create collapsible section
    createCollapsible: function(header, content) {
        const container = this.createElement('div', {
            className: 'collapsible'
        }, [
            this.createElement('button', {
                className: 'collapsible-header',
                'aria-expanded': 'false'
            }, [header]),
            this.createElement('div', {
                className: 'collapsible-content',
                'aria-hidden': 'true'
            }, [content])
        ]);
        
        A11yUtils.setupCollapsibleA11y(container);
        return container;
    },

    // Create carousel
    createCarousel: function(slides) {
        const carousel = this.createElement('div', {
            className: 'carousel',
            role: 'region',
            'aria-label': 'Image carousel'
        });
        
        const slideContainer = this.createElement('div', {
            className: 'carousel-slides'
        });
        
        slides.forEach((slide, index) => {
            const slideEl = this.createElement('div', {
                className: 'carousel-slide',
                'aria-label': `Slide ${index + 1} of ${slides.length}`
            }, [slide]);
            
            slideContainer.appendChild(slideEl);
        });
        
        carousel.appendChild(slideContainer);
        A11yUtils.setupCarouselKeyboardNav(carousel);
        
        return carousel;
    },

    // Create modal
    createModal: function(content, options = {}) {
        const modal = this.createElement('div', {
            className: 'modal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': options.titleId || undefined
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
        A11yUtils.trapFocus(modal);
        
        return modal;
    },

    // Update element visibility with animation
    toggleVisibility: function(element, isVisible, animate = true) {
        if (animate) {
            element.classList.toggle('fade-in', isVisible);
            element.classList.toggle('fade-out', !isVisible);
        }
        
        setTimeout(() => {
            A11yUtils.toggleVisibility(element, isVisible);
        }, animate ? 300 : 0);
    },

    // Handle infinite scroll
    setupInfiniteScroll: function(container, loadMoreFn, options = {}) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !container.dataset.loading) {
                container.dataset.loading = 'true';
                
                loadMoreFn()
                    .then(() => {
                        container.dataset.loading = 'false';
                    })
                    .catch(error => {
                        container.dataset.loading = 'false';
                        ErrorHandler.handle(error);
                    });
            }
        }, options);
        
        observer.observe(container);
        return observer;
    }
};

// Export DOMUtils
window.DOMUtils = DOMUtils;