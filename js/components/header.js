// Header component with enhanced navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Header component initializing");
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.error("Header element not found in the DOM");
        return;
    }
    
    // Check if header is already loaded by simple-loader.js
    if (headerElement.innerHTML.trim() !== '') {
        console.log("Header already loaded by simple-loader, skipping reload");
        // Just initialize functionality without reloading content
        const path = window.location.pathname;
        const isInPagesDir = path.includes('/pages/') || path.split('/').slice(-2, -1)[0] === 'pages';
        
        // Ensure paths are correct (simple-loader might need adjustment)
        adjustNavigationPaths(isInPagesDir);
        initializeHeader();
        return;
    }
      // Determine path - check if we're in the pages directory or root
    const path = window.location.pathname;
    const isInPagesDir = path.includes('/pages/') || path.split('/').slice(-2, -1)[0] === 'pages';
    
    const headerPath = isInPagesDir ? 'header.html' : 'pages/header.html';
      // Load header content using enhanced Utils
    Utils.loadWithState('header', async () => {
        const html = await Utils.fetchWithRetry(headerPath);
        headerElement.innerHTML = html;
        
        // Adjust navigation links for current context
        adjustNavigationPaths(isInPagesDir);
        
        // Initialize header functionality after content is loaded
        initializeHeader();
    }).catch(error => {
        Utils.log(`Error loading header: ${error}`, 'error', 'Header');
    });
});

function adjustNavigationPaths(isInPagesDir) {
    console.log(`adjustNavigationPaths called with isInPagesDir: ${isInPagesDir}`);
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log(`Found ${navLinks.length} navigation links`);
    
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const originalHref = href;
        
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Adjust paths based on current location
            if (isInPagesDir) {
                console.log(`Pages dir mode - processing link ${index}: ${href}`);
                // We're in /pages/ directory - links should be relative to pages
                if (href === '../index.html') {
                    // Keep home link as is
                    console.log(`  Keeping home link as-is: ${href}`);
                    return;
                }
                // For other links, ensure they don't have ../ prefix
                if (href.startsWith('../')) {
                    link.setAttribute('href', href.substring(3));
                    console.log(`  Removed ../ prefix: ${originalHref} → ${link.getAttribute('href')}`);
                }
            } else {
                console.log(`Root dir mode - processing link ${index}: ${href}`);
                // We're in root directory - links should point to pages/
                if (href === '../index.html') {
                    link.setAttribute('href', 'index.html');
                    console.log(`  Fixed home link: ${originalHref} → ${link.getAttribute('href')}`);
                } else if (!href.startsWith('pages/') && href !== 'index.html') {
                    link.setAttribute('href', 'pages/' + href);
                    console.log(`  Added pages/ prefix: ${originalHref} → ${link.getAttribute('href')}`);
                } else {
                    console.log(`  No change needed for: ${href}`);
                }
            }
        } else {
            console.log(`Skipping external/special link ${index}: ${href}`);
        }
    });
}

function initializeHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const navLinks = document.querySelector('.nav-links');
      // Add active class to current page link
    links.forEach(link => {
        const href = link.getAttribute('href');
        const linkPage = href ? href.split('/').pop() : '';
        
        if ((currentPage === 'index.html' && (href === '../index.html' || href === 'index.html' || href === '/')) || 
            (linkPage && linkPage === currentPage)) {
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