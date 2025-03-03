// Load dynamic sections
document.addEventListener('DOMContentLoaded', () => {
    fetch('../pages/timeline.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('timeline-section-container').innerHTML = data;
            initializeCollapsibles(); // Initialize collapsibles after loading content
        })
        .catch(error => console.error('Error loading timeline:', error));

    fetch('../pages/leadership-positions.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('leadership-section-container').innerHTML = data;
            // Add a small delay to ensure DOM elements are fully rendered
            setTimeout(() => {
                initializeCollapsibles(); // Initialize collapsibles after loading content
            }, 100);
        })
        .catch(error => console.error('Error loading leadership positions:', error));

    fetch('../pages/merit-badges.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('merit-badges-section-container').innerHTML = data;
            initializeCollapsibles(); // Initialize collapsibles after loading content
        })
        .catch(error => console.error('Error loading merit badges:', error));
});