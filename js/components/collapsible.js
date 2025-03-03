// Enhanced collapsible component
class Collapsible {
    constructor(options = {}) {
        this.options = Object.assign({
            debug: false
        }, options);
        
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) {
            this.log('Already initialized, reinitializing...');
        }
        
        this.initType('.collapsible:not(.merit-badge-year .collapsible):not(.organization-group .collapsible)', {
            getContent: button => button.nextElementSibling,
            displayStyle: 'block'
        });
        
        this.initType('.merit-badge-year .collapsible', {
            getContent: button => button.closest('.merit-badge-year').querySelector('.merit-badge-list'),
            displayStyle: 'grid'
        });
        
        this.initType('.organization-group .collapsible', {
            getContent: button => button.closest('.organization-group').querySelector('.org-content'),
            displayStyle: 'block'
        });
        
        this.initialized = true;
        this.log('Initialization complete');
    }
    
    initType(selector, typeOptions) {
        const buttons = document.querySelectorAll(selector);
        this.log(`Found ${buttons.length} elements for selector: ${selector}`);
        
        buttons.forEach((button, index) => {
            // Remove existing handlers
            button.onclick = null;
            
            // Add new handler
            button.addEventListener('click', () => {
                button.classList.toggle('active');
                const content = typeOptions.getContent(button);
                
                if (content) {
                    content.style.display = button.classList.contains('active') 
                        ? typeOptions.displayStyle 
                        : 'none';
                } else {
                    this.log(`Content not found for collapsible #${index}`, 'error');
                }
            });
        });
    }
    
    log(message, type = 'info') {
        if (!this.options.debug && type !== 'error') return;
        
        const prefix = '[Collapsible]';
        Utils.log(`${prefix} ${message}`, type);
    }
}

// Create global instance
window.collapsible = new Collapsible({ debug: true });

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.collapsible.init();
});

// Add global reinitialize function
window.reinitializeCollapsibles = () => {
    window.collapsible.init();
};