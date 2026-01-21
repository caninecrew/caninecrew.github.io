/**
 * Initializes all collapsible components on the page.
 * This function is idempotent and can be called multiple times; it will only initialize
 * buttons that have not yet been processed.
 */
function initializeCollapsibles() {
  // Find all collapsible buttons that have not been initialized
  const collapsibles = document.querySelectorAll('.collapsible:not([data-collapsible-init])');

  let collapsibleCounter = document.querySelectorAll('[id^="collapsible-content-"]').length;

  collapsibles.forEach(button => {
    // Mark the button as initialized to prevent re-adding listeners
    button.setAttribute('data-collapsible-init', 'true');
    
    // Set initial accessibility state
    button.setAttribute('aria-expanded', 'false');

    // Ensure each collapsible has a content panel and wire up ARIA
    let content;
    if (button.parentElement && button.parentElement.tagName === 'H3') {
      content = button.parentElement.nextElementSibling;
    } else {
      content = button.nextElementSibling;
    }

    if (content) {
      if (!content.id) {
        collapsibleCounter += 1;
        content.id = `collapsible-content-${collapsibleCounter}`;
      }
      button.setAttribute('aria-controls', content.id);
      content.setAttribute('aria-hidden', 'true');
      button.classList.remove('active');
      content.style.display = 'none';
    }

    button.addEventListener('click', function() {
      // Toggle the 'active' class for styling
      this.classList.toggle('active');
      const isActive = this.classList.contains('active');
      
      // Update accessibility state
      this.setAttribute('aria-expanded', isActive);

      // Find the content panel to show or hide
      let content;
      // The merit badge buttons are inside an H3, others are not
      if (this.parentElement && this.parentElement.tagName === 'H3') {
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
          content.setAttribute('aria-hidden', 'false');
        } else {
          content.style.display = 'none';
          content.setAttribute('aria-hidden', 'true');
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
            
            // Initialize mobile menu after header is loaded
            this.initializeMobileMenu();
            
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
        // Detect if we're on the index page or a subpage
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' || 
                           currentPath.endsWith('/') || 
                           currentPath.endsWith('/index.html') || 
                           currentPath.split('/').pop() === '' ||
                           !currentPath.includes('/pages/');
        
        // Set paths based on page location
        const headerPath = isIndexPage ? 'pages/header.html' : '../pages/header.html';
        const footerPath = isIndexPage ? 'pages/footer.html' : '../pages/footer.html';

        const headerContainer = document.getElementById('header');
        const footerContainer = document.getElementById('footer');

        // Check if containers exist
        if (!headerContainer && !footerContainer) {
            console.warn('Neither header nor footer container found on this page.');
            return;
        }

        try {
            const promises = [];
            
            // Load header if container exists
            if (headerContainer) {
                promises.push(
                    fetch(headerPath)
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to fetch header: ${response.statusText}`);
                            return response.text();
                        })
                        .then(html => {
                            headerContainer.innerHTML = html;
                        })
                        .catch(error => {
                            console.error('Error loading header:', error);
                            headerContainer.innerHTML = '<div style="color:red; text-align:center; padding: 1rem;">Error: Could not load header.</div>';
                        })
                );
            }

            // Load footer if container exists
            if (footerContainer) {
                promises.push(
                    fetch(footerPath)
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to fetch footer: ${response.statusText}`);
                            return response.text();
                        })
                        .then(html => {
                            footerContainer.innerHTML = html;
                        })
                        .catch(error => {
                            console.error('Error loading footer:', error);
                            footerContainer.innerHTML = '<div style="color:red; text-align:center; padding: 1rem;">Error: Could not load footer.</div>';
                        })
                );
            }

            // Wait for all components to load
            await Promise.all(promises);

        } catch (error) {
            console.error('Error in loadSharedComponents:', error);
        }
    }

    initializeMobileMenu() {
        // Initialize mobile menu functionality after header is loaded
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mainNav = document.querySelector('.main-nav');
        const closeMenuBtn = document.querySelector('.close-menu-btn');
        const navLinks = document.querySelectorAll('.nav-links a');

        if (mobileMenuBtn && mainNav) {
            // Open mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                mainNav.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });

            // Close mobile menu
            const closeMobileMenu = () => {
                mainNav.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            };

            if (closeMenuBtn) {
                closeMenuBtn.addEventListener('click', closeMobileMenu);
            }

            // Close menu when clicking nav links
            navLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') && 
                    !mainNav.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
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

        // Footer back to top button
        const backToTopFooter = document.querySelector('.back-to-top-footer');
        if (backToTopFooter) {
            backToTopFooter.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Update copyright year in footer
        const copyrightYear = document.querySelector('.copyright-year');
        if (copyrightYear) {
            copyrightYear.textContent = new Date().getFullYear();
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
