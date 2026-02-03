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

        button.addEventListener('click', function () {
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
        this.initialized = false;
        // Simple config store for theme
        this.theme = localStorage.getItem('ui.theme') || 'light';
    }

    async init() {
        if (this.initialized) return;

        try {
            // Load shared HTML components like header and footer
            await this.loadSharedComponents();

            // Initialize mobile menu after header is loaded
            this.initializeMobileMenu();

            // Initialize configuration
            this.initConfig();

            // Initialize components
            this.initComponents();

            // Set up event listeners
            this.setupEventListeners();

            // Initialize features based on current page
            await this.initPageSpecific();

            this.initialized = true;

        } catch (error) {
            console.error('Failed to initialize application:', error);
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
        const headerPath = isIndexPage ? 'pages/header.html' : 'header.html';
        const footerPath = isIndexPage ? 'pages/footer.html' : 'footer.html';

        const headerContainer = document.getElementById('header');
        const footerContainer = document.getElementById('footer');

        if (!headerContainer && !footerContainer) return;

        try {
            const promises = [];

            if (headerContainer) {
                promises.push(
                    fetch(headerPath)
                        .then(res => res.ok ? res.text() : Promise.reject(`Header: ${res.status}`))
                        .then(html => {
                            headerContainer.innerHTML = html;
                            this.fixLinks(headerContainer, isIndexPage);
                            this.initializeMobileMenu();
                        })
                );
            }

            if (footerContainer) {
                promises.push(
                    fetch(footerPath)
                        .then(res => res.ok ? res.text() : Promise.reject(`Footer: ${res.status}`))
                        .then(html => {
                            footerContainer.innerHTML = html;
                            this.fixLinks(footerContainer, isIndexPage);
                        })
                );
            }

            await Promise.all(promises);
        } catch (error) {
            console.error('Error loading shared components:', error);
        }
    }

    /**
     * Dynamically adjusts links within container based on page depth.
     */
    fixLinks(container, isIndexPage) {
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

            // Simplify: All links in header/footer relative to ROOT
            // If on index: Home is 'index.html', Education is 'pages/education.html'
            // If on pages: Home is '../index.html', Education is 'education.html'

            if (isIndexPage) {
                // Keep index.html as is, others prepend pages/
                if (href !== 'index.html' && !href.includes('pages/')) {
                    link.setAttribute('href', 'pages/' + href);
                }
            } else {
                // If on subpage
                if (href === 'index.html') {
                    link.setAttribute('href', '../index.html');
                } else {
                    // Remove pages/ if it exists, as we are already in pages/
                    href = href.replace('pages/', '');
                    link.setAttribute('href', href);
                }
            }
        });

        // Also fix image sources
        const images = container.querySelectorAll('img');
        images.forEach(img => {
            let src = img.getAttribute('src');
            if (!src || src.startsWith('http')) return;

            if (isIndexPage) {
                if (src.startsWith('../')) src = src.substring(3);
            } else {
                if (!src.startsWith('../')) src = '../' + src;
            }
            img.setAttribute('src', src);
        });
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

    initConfig() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    initComponents() {
        // Initialize all components in the page
        initializeCollapsibles();

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

        // Sticky Header & Scroll Effects
        const header = document.querySelector('.site-header');
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            let inThrottle;
            const scrollHandler = () => {
                if (!inThrottle) {
                    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, 200);
                }
            };
            window.addEventListener('scroll', scrollHandler);

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        const backToTopFooter = document.querySelector('.back-to-top-footer');
        if (backToTopFooter) {
            backToTopFooter.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

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
            const mapLoading = document.getElementById('map-loading');
            if (mapLoading) mapLoading.style.display = 'flex';

            const map = L.map('map').setView([39.8283, -98.5795], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Load markers from travel.js data if available
            if (window.travelLocations) {
                window.travelLocations.forEach(location => {
                    const popupContent = `
                        <div class="map-popup">
                            <h3>${location.title || ''}</h3>
                            <p>${location.description || ''}</p>
                        </div>
                    `;

                    const marker = L.marker([
                        location.position.lat,
                        location.position.lng
                    ]).addTo(map);

                    marker.bindPopup(popupContent);
                });
            }

            if (mapLoading) mapLoading.style.display = 'none';
        } catch (error) {
            const mapError = document.getElementById('map-error');
            if (mapError) mapError.style.display = 'flex';
            console.error('Failed to initialize map:', error);
        }
    }

    toggleTheme() {
        const currentTheme = this.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        this.theme = newTheme;
        localStorage.setItem('ui.theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

/**
 * Universal Modal Logic
 */
window.openModal = function (src, alt) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");

    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = src;
        modalImg.alt = alt;
        if (captionText) captionText.textContent = alt;
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function () {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = '';
    }
};

window.openTextModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    }
};

window.closeTextModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = '';
    }
};

// Close on escape or outside click
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        document.body.style.overflow = '';
    }
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

/**
 * Mobile Menu Toggle (Master Header)
 */
window.toggleMenu = function () {
    const nav = document.querySelector('.nav-master');
    const toggle = document.querySelector('.menu-toggle-master');
    if (nav && toggle) {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
    }
};
