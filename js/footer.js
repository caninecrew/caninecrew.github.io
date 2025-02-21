document.addEventListener("DOMContentLoaded", function() {
    // Add FontAwesome if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }

    fetch("/pages/footer.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector("#footer").innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback content if footer fails to load
            document.querySelector("#footer").innerHTML = `
                <footer class="site-footer">
                    <div class="footer-content">
                        <div class="footer-section">
                            <p class="copyright">&copy; 2025 Samuel Rumbley. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>`;
        });
});