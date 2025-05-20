// Accessibility Utilities
const A11yUtils = {
    // Focus management
    lastFocus: null,
    
    // Save current focus
    saveFocus: function() {
        this.lastFocus = document.activeElement;
    },
    
    // Restore saved focus
    restoreFocus: function() {
        if (this.lastFocus && this.lastFocus.focus) {
            this.lastFocus.focus();
        }
    },
    
    // Trap focus within container
    trapFocus: function(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
        
        firstElement.focus();
    },
    
    // Enhance keyboard navigation
    enhanceKeyboardNav: function() {
        // Show focus rings only when using keyboard
        document.body.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });
        
        document.body.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
        
        // Skip to main content
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const main = document.querySelector('main');
                if (main) {
                    main.tabIndex = -1;
                    main.focus();
                }
            });
        }
    },
    
    // Announce messages to screen readers
    announce: function(message, priority = 'polite') {
        let announcer = document.getElementById('a11y-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'a11y-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', priority);
            document.body.appendChild(announcer);
        }
        
        // Clear previous message
        announcer.textContent = '';
        
        // Announce new message
        requestAnimationFrame(() => {
            announcer.textContent = message;
        });
    },
    
    // Handle dynamic content updates
    updateLiveRegion: function(element, content) {
        if (!element) return;
        
        element.setAttribute('aria-live', 'polite');
        element.innerHTML = content;
    },
    
    // Make interactive elements accessible
    makeAccessible: function(element, options = {}) {
        if (!element) return;
        
        const {
            role,
            label,
            description,
            expanded = null,
            controls = null,
            selected = null
        } = options;
        
        if (role) element.setAttribute('role', role);
        if (label) element.setAttribute('aria-label', label);
        if (description) element.setAttribute('aria-description', description);
        if (expanded !== null) element.setAttribute('aria-expanded', expanded);
        if (controls) element.setAttribute('aria-controls', controls);
        if (selected !== null) element.setAttribute('aria-selected', selected);
        
        // Ensure element is focusable
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    },
    
    // Add keyboard support to custom components
    addKeyboardSupport: function(element, options = {}) {
        if (!element) return;
        
        const {
            onEnter,
            onSpace,
            onArrowUp,
            onArrowDown,
            onArrowLeft,
            onArrowRight,
            onEscape
        } = options;
        
        element.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    if (onEnter) {
                        e.preventDefault();
                        onEnter(e);
                    }
                    break;
                case ' ':
                    if (onSpace) {
                        e.preventDefault();
                        onSpace(e);
                    }
                    break;
                case 'ArrowUp':
                    if (onArrowUp) {
                        e.preventDefault();
                        onArrowUp(e);
                    }
                    break;
                case 'ArrowDown':
                    if (onArrowDown) {
                        e.preventDefault();
                        onArrowDown(e);
                    }
                    break;
                case 'ArrowLeft':
                    if (onArrowLeft) {
                        e.preventDefault();
                        onArrowLeft(e);
                    }
                    break;
                case 'ArrowRight':
                    if (onArrowRight) {
                        e.preventDefault();
                        onArrowRight(e);
                    }
                    break;
                case 'Escape':
                    if (onEscape) {
                        e.preventDefault();
                        onEscape(e);
                    }
                    break;
            }
        });
    },
    
    // Make images accessible
    makeImageAccessible: function(img, description) {
        if (!img) return;
        
        if (!img.alt) {
            img.alt = description || '';
        }
        
        if (description && description !== img.alt) {
            img.setAttribute('aria-description', description);
        }
        
        // Add role="img" for SVG images
        if (img.tagName.toLowerCase() === 'svg') {
            img.setAttribute('role', 'img');
        }
    }
};

// Export A11yUtils
window.A11yUtils = A11yUtils;

// Initialize keyboard navigation enhancement
document.addEventListener('DOMContentLoaded', () => {
    A11yUtils.enhanceKeyboardNav();
});