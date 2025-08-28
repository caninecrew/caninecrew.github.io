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
        const isIndex = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html');
        const headerPath = isIndex ? 'pages/header.html' : '../pages/header.html';
        const footerPath = isIndex ? 'pages/footer.html' : '../pages/footer.html';

        const headerContainer = document.getElementById('header');
        const footerContainer = document.getElementById('footer');

        if (!headerContainer || !footerContainer) {
            console.error('Header or footer container not found on this page.');
            return;
        }

        try {
            const [headerResponse, footerResponse] = await Promise.all([
                fetch(headerPath),
                fetch(footerPath)
            ]);

            if (!headerResponse.ok) throw new Error(`Failed to fetch header: ${headerResponse.statusText}`);
            if (!footerResponse.ok) throw new Error(`Failed to fetch footer: ${footerResponse.statusText}`);

            headerContainer.innerHTML = await headerResponse.text();
            footerContainer.innerHTML = await footerResponse.text();

        } catch (error) {
            console.error('Error loading shared components:', error);
            headerContainer.innerHTML = '<p style="color:red; text-align:center;">Error: Could not load header.</p>';
            footerContainer.innerHTML = '<p style="color:red; text-align:center;">Error: Could not load footer.</p>';
        }
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
                backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
            }, 200) : () => {
                backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
            };
            window.addEventListener('scroll', throttledScroll);
            
            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }
    
    async initPageSpecific() {
        const path = window.location.pathname;
        
        if (path.includes('travel.html')) {
            await this.initTravelPage();
        }
    }
    
    async initTravelPage() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer || typeof L === 'undefined') return;
        
        try {
            if (this.performance.start) this.performance.start('map-init');
            
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'flex';

            const map = L.map('map').setView([39.8283, -98.5795], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            if (mapLoading) mapLoading.style.display = 'none';
            if (this.performance.end) this.performance.end('map-init');
        } catch (error) {
            const mapError = document.getElementById('map-error');
            if (mapError) mapError.style.display = 'flex';
            console.error('Failed to initialize map:', error);
        }
    }
    
    toggleTheme() {
        if (!this.config.get || !this.config.set) return;
        const currentTheme = this.config.get('ui.theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.config.set('ui.theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        if (this.domUtils.showToast) {
            this.domUtils.showToast(`Switched to ${newTheme} theme`, 'info', 2000);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});