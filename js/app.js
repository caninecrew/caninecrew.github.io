// Main App Class
class App {
    constructor() {
        // Initialize core utilities
        this.config = window.Config;
        this.utils = window.Utils;
        this.domUtils = window.DOMUtils;
        this.a11y = window.A11yUtils;
        this.performance = window.Performance;
        
        // State
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            this.performance.start('app-init');
            
            // Initialize configuration
            await this.initConfig();
            
            // Load header and footer
            await this.loadCommonElements();
            
            // Initialize components
            this.initComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize features based on current page
            await this.initPageSpecific();
            
            this.initialized = true;
            this.performance.end('app-init');
        } catch (error) {
            ErrorHandler.handle(
                ErrorHandler.create(
                    'Failed to initialize application',
                    ErrorHandler.types.RUNTIME,
                    { error }
                )
            );
        }
    }
    
    async initConfig() {
        // Load and apply configuration
        await this.config.init();
        
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.config.get('ui.theme'));
    }
    
    async loadCommonElements() {
        // Load header
        await this.utils.loadHTMLFile('header', '/pages/header.html');
        
        // Load footer
        await this.utils.loadHTMLFile('footer', '/pages/footer.html');
    }
    
    initComponents() {
        // Initialize all components in the page
        this.utils.initializeComponents(document);
        
        // Set up lazy loading
        this.utils.lazyLoadImages();
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
            window.addEventListener('scroll', this.utils.throttle(() => {
                backToTop.classList.toggle('visible', window.scrollY > 300);
            }, 200));
            
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
            this.performance.start('map-init');
            
            // Set up map with loading state
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'flex';
            
            // Initialize map (assuming Leaflet is loaded)
            const map = L.map('map').setView(
                [this.config.get('map.defaultCenter.lat'), 
                 this.config.get('map.defaultCenter.lng')],
                this.config.get('map.defaultZoom')
            );
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Hide loading state
            if (mapLoading) mapLoading.style.display = 'none';
            
            this.performance.end('map-init');
        } catch (error) {
            // Show error state
            const mapError = document.getElementById('map-error');
            if (mapError) mapError.style.display = 'flex';
            
            ErrorHandler.handle(
                ErrorHandler.create(
                    'Failed to initialize map',
                    ErrorHandler.types.RESOURCE,
                    { error }
                )
            );
        }
    }
    
    initContactPage() {
        const form = document.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                this.domUtils.addLoading(form, 'Sending...');
                
                // Add form submission logic here
                
                this.domUtils.removeLoading(form);
                this.domUtils.showToast('Message sent successfully!', 'success');
            } catch (error) {
                this.domUtils.removeLoading(form);
                ErrorHandler.handle(
                    ErrorHandler.create(
                        'Failed to send message',
                        ErrorHandler.types.NETWORK,
                        { error }
                    )
                );
            }
        });
    }
    
    initAchievementsPage() {
        const gallery = document.querySelector('.photo-gallery');
        if (!gallery) return;
        
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
        const currentTheme = this.config.get('ui.theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.config.set('ui.theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        
        this.domUtils.showToast(
            `Switched to ${newTheme} theme`,
            'info',
            2000
        );
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

