// Simple, bulletproof loader for header and footer
// This runs independently of the main app and provides fallbacks

(function() {
    'use strict';
    
    // Simple path detection
    function getBasePath() {
        const path = window.location.pathname;
        const isInPagesDir = path.includes('/pages/') || path.split('/').slice(-2, -1)[0] === 'pages';
        return isInPagesDir ? '' : 'pages/';
    }
    
    // Simple fetch with timeout
    function simpleFetch(url, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout')), timeout);
            
            fetch(url)
                .then(response => {
                    clearTimeout(timer);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.text();
                })
                .then(resolve)
                .catch(reject);
        });
    }
    
    // Load header
    function loadHeader() {
        const headerElement = document.getElementById('header');
        if (!headerElement) return;
        
        const basePath = getBasePath();
        const headerPath = basePath + 'header.html';
        
        simpleFetch(headerPath)
            .then(html => {
                headerElement.innerHTML = html;
                initializeHeaderBasic();
            })
            .catch(error => {
                console.error('Failed to load header:', error);
                // Fallback header
                headerElement.innerHTML = `
                    <header class="site-header">
                        <div class="header-container">
                            <div class="logo">
                                <a href="${basePath ? '../index.html' : 'index.html'}">Samuel Rumbley</a>
                            </div>
                            <nav class="main-nav">
                                <ul class="nav-links">
                                    <li><a href="${basePath ? '../index.html' : 'index.html'}">Home</a></li>
                                    <li><a href="${basePath}education.html">Education</a></li>
                                    <li><a href="${basePath}experience.html">Experience</a></li>
                                    <li><a href="${basePath}projects.html">Projects</a></li>
                                    <li><a href="${basePath}achievements.html">Achievements</a></li>
                                    <li><a href="${basePath}training.html">Training</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                `;
                initializeHeaderBasic();
            });
    }
    
    // Load footer
    function loadFooter() {
        const footerElement = document.getElementById('footer');
        if (!footerElement) return;
        
        const basePath = getBasePath();
        const footerPath = basePath + 'footer.html';
        
        simpleFetch(footerPath)
            .then(html => {
                footerElement.innerHTML = html;
                updateCopyrightYear();
            })
            .catch(error => {
                console.error('Failed to load footer:', error);
                // Fallback footer
                footerElement.innerHTML = `
                    <footer class="site-footer">
                        <div class="footer-content">
                            <div class="footer-section">
                                <p>&copy; <span class="copyright-year">${new Date().getFullYear()}</span> Samuel Rumbley. All rights reserved.</p>
                            </div>
                        </div>
                    </footer>
                `;
            });
    }
    
    // Basic header functionality
    function initializeHeaderBasic() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.nav-links a');
        
        // Add active class to current page link
        links.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href ? href.split('/').pop() : '';
            
            if ((currentPage === 'index.html' && (href.includes('index.html') || href === '../index.html')) || 
                linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        // Simple mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }
    }
    
    // Update copyright year
    function updateCopyrightYear() {
        const yearElement = document.querySelector('.copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadHeader();
            loadFooter();
        });
    } else {
        loadHeader();
        loadFooter();
    }
    
})();
