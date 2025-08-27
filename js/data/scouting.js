// Load dynamic sections for the scouting page
document.addEventListener('DOMContentLoaded', () => {
    // Function to load HTML content into a container
    const loadSection = (url, containerId) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = data;
                    // Re-initialize any components that were loaded
                    if (window.reinitializeCollapsibles) {
                        window.reinitializeCollapsibles();
                    }
                }
            })
            .catch(error => console.error(`Error loading section from ${url}:`, error));
    };

    // Load all scouting page sections
    loadSection('../pages/timeline.html', 'timeline-section');
    loadSection('../pages/leadership-positions.html', 'leadership-section');
    loadSection('../pages/merit-badges.html', 'merit-badges-section');
});

// Modal functionality for the Eagle Project gallery
function openModal(src, alt) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    
    if (modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = src;
        captionText.innerHTML = alt;
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});