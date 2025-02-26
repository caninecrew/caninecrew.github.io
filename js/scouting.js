// Load dynamic sections
document.addEventListener('DOMContentLoaded', () => {
    fetch('../pages/timeline.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('timeline-section-container').innerHTML = data;
            initializeCollapsibles(); // Initialize collapsibles after loading content
        });

    fetch('../pages/leadership-positions.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('leadership-section-container').innerHTML = data;
            initializeCollapsibles(); // Initialize collapsibles after loading content
        });

    fetch('../pages/merit-badges.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('merit-badges-section-container').innerHTML = data;
            initializeCollapsibles(); // Initialize collapsibles after loading content
        });
});