// Footer component
document.addEventListener('DOMContentLoaded', function() {
    console.log("Footer component initializing");
    const footerElement = document.getElementById('footer');
    if (!footerElement) {
        console.error("Footer element not found in the DOM");
        return;
    }
      // Determine path - check if we're in the pages directory or root
    const path = window.location.pathname;
    const isInPagesDir = path.includes('/pages/') || path.split('/').slice(-2, -1)[0] === 'pages';
    
    const footerPath = isInPagesDir ? 'footer.html' : 'pages/footer.html';
    console.log(`Loading footer from: ${footerPath}`);
    
    // Fetch the footer content
    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load footer (${response.status} ${response.statusText})`);
            }
            return response.text();
        })
        .then(html => {
            footerElement.innerHTML = html;
            
            // Update copyright year if present
            const yearElement = footerElement.querySelector('.copyright-year');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
            
            console.log("Footer successfully loaded and initialized");
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            footerElement.innerHTML = '<div class="error-message">Error loading footer. Please try refreshing the page.</div>';
        });
});