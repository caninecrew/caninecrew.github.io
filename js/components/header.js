// Header component
document.addEventListener('DOMContentLoaded', function() {
    console.log("Header component initializing");
    const headerElement = document.getElementById('header');
    if (!headerElement) {
        console.error("Header element not found in the DOM");
        return;
    }
    
    // Determine if we're on the root or in a subdirectory
    const isRoot = window.location.pathname === '/' || 
                  window.location.pathname.endsWith('index.html') ||
                  !window.location.pathname.includes('/pages/');
    
    const headerPath = isRoot ? 'pages/header.html' : '../pages/header.html';
    console.log(`Loading header from: ${headerPath}`);
    
    // Fetch the header content
    fetch(headerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load header (${response.status} ${response.statusText})`);
            }
            return response.text();
        })
        .then(html => {
            headerElement.innerHTML = html;
            
            // Add active class to current page link
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const links = headerElement.querySelectorAll('.nav-links a');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if ((currentPage === 'index.html' && href === '/' || href === 'index.html' || href === '') || 
                    (href && href.includes(currentPage))) {
                    link.classList.add('active');
                }
            });
            
            // Initialize mobile menu functionality
            const mobileMenuBtn = headerElement.querySelector('.mobile-menu-btn');
            const navLinks = headerElement.querySelector('.nav-links');
            
            if (mobileMenuBtn && navLinks) {
                mobileMenuBtn.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    document.body.classList.toggle('menu-open');
                });
            }
            
            console.log("Header successfully loaded and initialized");
        })
        .catch(error => {
            console.error('Error loading header:', error);
            headerElement.innerHTML = '<div class="error-message">Error loading header. Please try refreshing the page.</div>';
        });
});