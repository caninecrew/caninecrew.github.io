// Accessibility utilities
const A11yUtils = {
    // Focus management
    focusable: 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    
    // Trap focus within an element (for modals, dropdowns, etc.)
    trapFocus: function(element) {
        const focusableElements = element.querySelectorAll(this.focusable);
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
        
        firstFocusable.focus();
    },
    
    // Announce message to screen readers
    announce: function(message, priority = 'polite') {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.classList.add('sr-only');
        
        document.body.appendChild(announcer);
        
        // Wait a moment before adding text to ensure screen reader catches the change
        setTimeout(() => {
            announcer.textContent = message;
            
            // Remove after announcement
            setTimeout(() => {
                announcer.remove();
            }, 3000);
        }, 50);
    },
    
    // Toggle element visibility while maintaining accessibility
    toggleVisibility: function(element, isVisible) {
        if (isVisible) {
            element.removeAttribute('hidden');
            element.removeAttribute('aria-hidden');
        } else {
            element.setAttribute('hidden', '');
            element.setAttribute('aria-hidden', 'true');
        }
    },
    
    // Handle escape key for interactive elements
    setupEscapeHandler: function(element, closeCallback) {
        element.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeCallback();
            }
        });
    },
    
    // Set up keyboard navigation for custom components
    setupKeyboardNav: function(container, itemSelector, callback) {
        const items = container.querySelectorAll(itemSelector);
        
        container.addEventListener('keydown', e => {
            const currentIndex = Array.from(items).indexOf(document.activeElement);
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < items.length - 1) {
                        items[currentIndex + 1].focus();
                    } else {
                        items[0].focus();
                    }
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        items[currentIndex - 1].focus();
                    } else {
                        items[items.length - 1].focus();
                    }
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    items[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    items[items.length - 1].focus();
                    break;
            }
            
            if (callback) {
                callback(e);
            }
        });
    },

    // Add keyboard navigation to carousel
    setupCarouselKeyboardNav(carouselElement) {
        carouselElement.setAttribute('role', 'region');
        carouselElement.setAttribute('aria-label', 'Image carousel');
        
        const slides = carouselElement.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });
        
        carouselElement.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    carouselElement.querySelector('.prev-button')?.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    carouselElement.querySelector('.next-button')?.click();
                    break;
            }
        });
    },

    // Make collapsible sections accessible
    setupCollapsibleA11y(element) {
        const header = element.querySelector('.collapsible-header');
        const content = element.querySelector('.collapsible-content');
        
        if (!header || !content) return;
        
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('tabindex', '0');
        content.setAttribute('aria-hidden', 'true');
        
        header.addEventListener('click', () => this.toggleCollapsible(header, content));
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleCollapsible(header, content);
            }
        });
    },

    toggleCollapsible(header, content) {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        content.setAttribute('aria-hidden', isExpanded);
    },

    // Enhance map accessibility
    setupMapA11y(mapElement) {
        mapElement.setAttribute('role', 'application');
        mapElement.setAttribute('aria-label', 'Interactive map');
        mapElement.setAttribute('tabindex', '0');
        
        // Add keyboard instructions
        const instructions = document.createElement('div');
        instructions.className = 'sr-only';
        instructions.textContent = 'Use arrow keys to pan, plus and minus to zoom';
        mapElement.appendChild(instructions);
    },

    // Make error messages accessible
    announceError(message) {
        const liveRegion = document.getElementById('a11y-announcer') || 
            this.createLiveRegion();
        
        liveRegion.textContent = message;
    },

    createLiveRegion() {
        const region = document.createElement('div');
        region.id = 'a11y-announcer';
        region.className = 'sr-only';
        region.setAttribute('role', 'alert');
        region.setAttribute('aria-live', 'polite');
        document.body.appendChild(region);
        return region;
    }
};

// Export A11yUtils
window.A11yUtils = A11yUtils;