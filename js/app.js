/**
 * Initializes all collapsible components on the page.
 * This function is idempotent and can be called multiple times; it will only initialize
 * buttons that have not yet been processed.
 */
function initializeCollapsibles() {
    const collapsibles = document.querySelectorAll('.collapsible:not([data-collapsible-init])');

    let collapsibleCounter = document.querySelectorAll('[id^="collapsible-content-"]').length;

    collapsibles.forEach(button => {
        button.setAttribute('data-collapsible-init', 'true');
        button.setAttribute('aria-expanded', 'false');

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
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            this.setAttribute('aria-expanded', isActive);

            let content;
            if (this.parentElement && this.parentElement.tagName === 'H3') {
                content = this.parentElement.nextElementSibling;
            } else {
                content = this.nextElementSibling;
            }

            if (content) {
                if (isActive) {
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

const SHARED_HEADER_FALLBACK_HTML = `
<header class="site-header-master" id="top">
    <div class="header-container-master">
        <div class="logo-master">
            <a href="/">
                <span class="logo-tag">&lt;</span>
                <span class="logo-name">S.Rumbley</span>
                <span class="logo-tag">/&gt;</span>
            </a>
        </div>

        <button class="menu-toggle-master" aria-label="Toggle menu" aria-controls="primary-navigation" aria-expanded="false">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </button>
        <nav class="main-nav" id="primary-navigation" aria-label="Primary">
            <div class="nav-header">
                <div class="logo mobile-logo">Samuel Rumbley</div>
                <button class="close-menu-btn" aria-label="Close menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/pages/education.html">Education</a></li>
                <li><a href="/pages/experience.html">Experience</a></li>
                <li><a href="/pages/projects.html">Projects</a></li>
                <li><a href="/pages/scouting.html">Scouting</a></li>
                <li><a href="/pages/achievements.html">Achievements</a></li>
                <li><a href="/pages/training.html">Training</a></li>
            </ul>
        </nav>
    </div>
</header>`;

const SHARED_FOOTER_FALLBACK_HTML = `
<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>About Me</h3>
            <div class="footer-bio">
                <img src="images/profile.jpg" alt="Samuel Rumbley" class="footer-profile">
                <p>Business Information &amp; Technology student at Tennessee Tech University, focused on leadership and practical technology.</p>
            </div>
        </div>

        <div class="footer-section">
            <h3>Navigation</h3>
            <ul class="footer-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="experience.html">Experience</a></li>
                <li><a href="education.html">Education</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="achievements.html">Achievements</a></li>
                <li><a href="travel.html">Travel</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h3>Connect</h3>
            <div class="social-links">
                <a href="https://github.com/caninecrew" class="social-link" aria-label="GitHub Profile">
                    <i class="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/samuel-rumbley" class="social-link" aria-label="LinkedIn Profile">
                    <i class="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/samuel_rumbley" class="social-link" aria-label="Instagram Profile">
                    <i class="fab fa-instagram"></i>
                </a>
                <a href="https://app.joinhandshake.com/stu/users/25299545" class="social-link" aria-label="Handshake Profile">
                    <i class="fas fa-handshake"></i>
                </a>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="footer-bottom-content">
            <p class="copyright">&copy; <span class="copyright-year">2025</span> Samuel Rumbley. All Rights Reserved.</p>
            <a href="#top" class="back-to-top-footer" aria-label="Back to top">
                <i class="fas fa-arrow-up"></i>
            </a>
        </div>
    </div>
</footer>`;

class App {
    constructor() {
        this.initialized = false;
        this.theme = localStorage.getItem('ui.theme') || 'light';
        this.mobileMenuBound = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            await this.loadSharedComponents();
            this.initializeMobileMenu();
            this.initConfig();
            this.initComponents();
            this.setupEventListeners();
            await this.initPageSpecific();
            this.registerServiceWorker();
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    async loadSharedComponents() {
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' ||
            currentPath.endsWith('/') ||
            currentPath.endsWith('/index.html') ||
            currentPath.split('/').pop() === '' ||
            !currentPath.includes('/pages/');

        const headerPath = isIndexPage ? 'pages/header.html' : 'header.html';
        const footerPath = isIndexPage ? 'pages/footer.html' : 'footer.html';

        const headerContainer = document.getElementById('header');
        const footerContainer = document.getElementById('footer');

        if (!headerContainer && !footerContainer) return;

        const loadFragment = async (path, fallbackHtml, container, onLoad) => {
            if (!container) return;

            try {
                const res = await fetch(path);
                const html = res.ok ? await res.text() : fallbackHtml;
                container.innerHTML = html;
            } catch (error) {
                console.warn(`Falling back to embedded shared markup for ${path}:`, error);
                container.innerHTML = fallbackHtml;
            }

            this.fixLinks(container, isIndexPage);
            if (onLoad) onLoad();
        };

        try {
            await Promise.all([
                loadFragment(headerPath, SHARED_HEADER_FALLBACK_HTML, headerContainer, () => this.initializeMobileMenu()),
                loadFragment(footerPath, SHARED_FOOTER_FALLBACK_HTML, footerContainer)
            ]);
        } catch (error) {
            console.error('Error loading shared components:', error);
        }
    }

    fixLinks(container, isIndexPage) {
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

            const normalizedHref = href.replace(/^\.\//, '');

            if (normalizedHref === '/' || normalizedHref === '/index.html' || normalizedHref === 'index.html') {
                link.setAttribute('href', isIndexPage ? 'index.html' : '../index.html');
                return;
            }

            if (normalizedHref.startsWith('/pages/')) {
                link.setAttribute('href', isIndexPage ? normalizedHref.slice(1) : normalizedHref.replace('/pages/', ''));
                return;
            }

            if (normalizedHref.startsWith('pages/')) {
                link.setAttribute('href', isIndexPage ? normalizedHref : normalizedHref.replace('pages/', ''));
                return;
            }

            if (normalizedHref.endsWith('.html')) {
                link.setAttribute('href', isIndexPage ? `pages/${normalizedHref}` : normalizedHref);
                return;
            }

            link.setAttribute('href', normalizedHref);
        });

        const images = container.querySelectorAll('img');
        images.forEach(img => {
            let src = img.getAttribute('src');
            if (!src || src.startsWith('http') || src.startsWith('data:')) return;

            if (isIndexPage) {
                if (src.startsWith('../')) src = src.substring(3);
            } else {
                if (!src.startsWith('../')) src = '../' + src;
            }
            img.setAttribute('src', src);
        });
    }

    initializeMobileMenu() {
        if (this.mobileMenuBound) return;

        const mobileMenuBtn = document.querySelector('.menu-toggle-master');
        const mainNav = document.querySelector('.main-nav');
        const closeMenuBtn = document.querySelector('.close-menu-btn');
        const navLinks = document.querySelectorAll('.nav-links a');

        if (!mobileMenuBtn || !mainNav) return;

        if (!mainNav.id) {
            mainNav.id = 'primary-navigation';
        }

        const setMenuState = (isOpen) => {
            mainNav.classList.toggle('active', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        };

        mobileMenuBtn.setAttribute('aria-controls', mainNav.id);
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        mobileMenuBtn.addEventListener('click', () => {
            setMenuState(!mainNav.classList.contains('active'));
        });

        const closeMobileMenu = () => setMenuState(false);

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeMobileMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') &&
                !mainNav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        this.mobileMenuBound = true;
    }

    registerServiceWorker() {
        if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') {
            return;
        }

        const register = () => {
            navigator.serviceWorker.register('/sw.js').catch(error => {
                console.warn('Service worker registration failed:', error);
            });
        };

        if (document.readyState === 'complete') {
            register();
        } else {
            window.addEventListener('load', register, { once: true });
        }
    }

    initConfig() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    initComponents() {
        initializeCollapsibles();

        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        const header = document.querySelector('.site-header-master, .site-header');
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

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
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const travelLocations = Array.isArray(window.travelLocations) ? window.travelLocations : [];
            const bounds = [];

            if (travelLocations.length) {
                travelLocations.forEach(location => {
                    if (!location.position || typeof location.position.lat !== 'number' || typeof location.position.lng !== 'number') {
                        return;
                    }

                    const popupContent = `
                        <div class="map-popup">
                            <h3>${location.name || ''}</h3>
                            <p>${location.description || ''}</p>
                            ${location.date ? `<p>${location.date}</p>` : ''}
                        </div>
                    `;

                    const marker = L.marker([
                        location.position.lat,
                        location.position.lng
                    ]).addTo(map);

                    marker.bindPopup(popupContent);
                    bounds.push([location.position.lat, location.position.lng]);
                });

                if (bounds.length === 1) {
                    map.setView(bounds[0], 6);
                } else if (bounds.length > 1) {
                    map.fitBounds(bounds, { padding: [40, 40] });
                }
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

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

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

window.toggleMenu = function () {
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.menu-toggle-master');
    if (nav && toggle) {
        const willOpen = !nav.classList.contains('active');
        nav.classList.toggle('active', willOpen);
        document.body.classList.toggle('menu-open', willOpen);
        document.body.style.overflow = willOpen ? 'hidden' : '';
        toggle.classList.toggle('active', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
    }
};
