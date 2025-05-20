// Accessibility utilities
const A11yUtils = {
    // Trap focus within a modal or dialog
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        firstFocusable.focus();
        
        element.addEventListener('keydown', function(e) {
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