// Header component with enhanced navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Header component initializing");
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.error("Header element not found in the DOM");
        return;
    }
    
    // Determine path
    const isRoot = window.location.pathname === '/' || 
                  window.location.pathname.endsWith('index.html') ||
                  !window.location.pathname.includes('/pages/');
    
    const headerPath = isRoot ? 'pages/header.html' : '../pages/header.html';
    
    // Load header content using enhanced Utils
    Utils.loadWithState('header', async () => {
        const html = await Utils.fetchWithRetry(headerPath);
        headerElement.innerHTML = html;
        
        // Initialize header functionality after content is loaded
        initializeHeader();
    }).catch(error => {
        Utils.log(`Error loading header: ${error}`, 'error', 'Header');
    });
});

function initializeHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Add active class to current page link
    links.forEach(link => {
        if ((currentPage === 'index.html' && (link.getAttribute('href') === '/' || 
            link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '')) || 
            (link.getAttribute('href') && link.getAttribute('href').includes(currentPage))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    
    if (mobileMenuBtn && navLinks) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('menu-overlay');
        document.body.appendChild(overlay);
        
        // Enhanced menu functionality with accessibility
        const openMenu = () => {
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            A11yUtils.trapFocus(navLinks);
        };
        
        const closeMenu = () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.focus();
        };
        
        // Setup mobile menu
        mobileMenuBtn.setAttribute('aria-controls', 'nav-links');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        
        // Event listeners
        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    closeMenu();
                }
            });
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // Add loading indicator for navigation
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle internal links
            if (link.origin === window.location.origin && !link.hasAttribute('target')) {
                e.preventDefault();
                document.body.classList.add('page-transition');
                
                // Navigate after transition
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    });
}