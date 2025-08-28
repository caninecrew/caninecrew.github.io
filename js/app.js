/**
 * Initializes all collapsible components on the page.
 * This function is idempotent and can be called multiple times; it will only initialize
 * buttons that have not yet been processed.
 */
function initializeCollapsibles() {
  // Find all collapsible buttons that have not been initialized
  const collapsibles = document.querySelectorAll('.collapsible:not([data-collapsible-init])');

  collapsibles.forEach(button => {
    // Mark the button as initialized to prevent re-adding listeners
    button.setAttribute('data-collapsible-init', 'true');
    
    // Set initial accessibility state
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', function() {
      // Toggle the 'active' class for styling
      this.classList.toggle('active');
      const isActive = this.classList.contains('active');
      
      // Update accessibility state
      this.setAttribute('aria-expanded', isActive);

      // Find the content panel to show or hide
      let content;
      // The merit badge buttons are inside an H3, others are not
      if (this.parentElement.tagName === 'H3') {
        content = this.parentElement.nextElementSibling;
      } else {
        content = this.nextElementSibling;
      }

      // Toggle the display if the content panel exists
      if (content) {
        if (isActive) {
          // Merit badge lists use a grid layout
          if (content.classList.contains('merit-badge-list')) {
            content.style.display = 'grid';
          } else {
            content.style.display = 'block';
          }
        } else {
          content.style.display = 'none';
        }
      }
    });
  });
}

// Main App Class
class App {
    constructor() {
        // Initialize core utilities with fallbacks
        this.config = window.Config || {};
        this.utils = window.Utils || {};
        this.domUtils = window.DOMUtils || {};
        this.a11y = window.A11yUtils || {};
        this.performance = window.Performance || { start: () => {}, end: () => {} };
        
        // State
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            if (this.performance.start) {
                this.performance.start('app-init');
            }
            
            // Load shared HTML components like header and footer
            await this.loadSharedComponents();
            
            // Initialize configuration
            await this.initConfig();
            
            // Initialize components
            this.initComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize features based on current page
            await this.initPageSpecific();

            this.initialized = true;

            if (this.performance.end) {
                this.performance.end('app-init');
            }
        } catch (error) {
            console.error('Failed to initialize application:', error);
            if (window.ErrorHandler && ErrorHandler.handle) {
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'Failed to initialize application',
                        ErrorHandler.types.RUNTIME,
                        { error }
                    )
                );
            }
        }
    }

    async loadSharedComponents() {
        const isIndex = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        const headerPath = isIndex ? 'pages/header.html' : '../pages/header.html';
        const footerPath = isIndex ? 'pages/footer.html' : '../pages/footer.html';

        // Wait for both header and footer to be loaded
        await Promise.all([
            this.domUtils.loadHTML(headerPath, 'header'),
            this.domUtils.loadHTML(footerPath, 'footer')
        ]);
    }
    
    async initConfig() {
        // Load and apply configuration
        if (this.config.init) {
            await this.config.init();
        }
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.config.get ? this.config.get('ui.theme') : 'light');
    }
    
    initComponents() {
        // Initialize all components in the page
        initializeCollapsibles();

        // Set up lazy loading
        if (this.utils.lazyLoadImages) {
            this.utils.lazyLoadImages();
        }

        // Reveal any elements using the fade-in utility
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }
    
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            const throttledScroll = this.utils.throttle ? this.utils.throttle(() => {
                backToTop.classList.toggle('visible', window.scrollY > 300);
            }, 200) : () => {
                backToTop.classList.toggle('visible', window.scrollY > 300);
            };
            window.addEventListener('scroll', throttledScroll);
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
    
    async initPageSpecific() {
        const path = window.location.pathname;
        
        // Initialize map on travel page
        if (path.includes('travel.html')) {
            await this.initTravelPage();
        }
        
        // Initialize form validation on contact page
        if (path.includes('contact.html')) {
            this.initContactPage();
        }
        
        // Initialize photo gallery on achievements page
        if (path.includes('achievements.html')) {
            this.initAchievementsPage();
        }
    }
    
    async initTravelPage() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        try {
            if (this.performance.start) this.performance.start('map-init');
            
            // Set up map with loading state
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'flex';
            
            // Initialize map (assuming Leaflet is loaded)
            if (typeof L !== 'undefined') {
                const map = L.map('map').setView(
                    [this.config.get('map.defaultCenter.lat'), 
                     this.config.get('map.defaultCenter.lng')],
                    this.config.get('map.defaultZoom')
                );
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            }
            
            // Hide loading state
            if (mapLoading) mapLoading.style.display = 'none';
            
            if (this.performance.end) this.performance.end('map-init');
        } catch (error) {
            // Show error state
            const mapError = document.getElementById('map-error');
            if (mapError) mapError.style.display = 'flex';
            
            if (window.ErrorHandler && ErrorHandler.handle) {
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'Failed to initialize map',
                        ErrorHandler.types.RESOURCE,
                        { error }
                    )
                );
            }
        }
    }
    
    initContactPage() {
        const form = document.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                if (this.domUtils.addLoading) this.domUtils.addLoading(form, 'Sending...');
                
                // Add form submission logic here
                
                if (this.domUtils.removeLoading) this.domUtils.removeLoading(form);
                if (this.domUtils.showToast) this.domUtils.showToast('Message sent successfully!', 'success');
            } catch (error) {
                if (this.domUtils.removeLoading) this.domUtils.removeLoading(form);
                if (window.ErrorHandler && ErrorHandler.handle) {
                    ErrorHandler.handle(
                        ErrorHandler.create(
                            'Failed to send message',
                            ErrorHandler.types.NETWORK,
                            { error }
                        )
                    );
                }
            }
        });
    }
    
    initAchievementsPage() {
        const gallery = document.querySelector('.photo-gallery');
        if (!gallery || !this.domUtils.setupInfiniteScroll) return;
        
        // Set up infinite scroll for gallery
        this.domUtils.setupInfiniteScroll(
            gallery,
            async () => {
                // Add gallery loading logic here
            },
            {
                rootMargin: '100px'
            }
        );
    }
    
    toggleTheme() {
        if (!this.config.get || !this.config.set) return;
        const currentTheme = this.config.get('ui.theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.config.set('ui.theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        if (this.domUtils.showToast) {
            this.domUtils.showToast(
                `Switched to ${newTheme} theme`,
                'info',
                2000
            );
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});