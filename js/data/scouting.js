// Load dynamic sections for the scouting page
document.addEventListener('DOMContentLoaded', () => {
    
    // Function to load HTML content into a container, which returns a promise
    const loadSection = (url, containerId) => {
        return fetch(url)
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
                } else {
                    console.error(`Container with ID #${containerId} not found.`);
                }
            });
    };

    // Use Promise.all to wait for all dynamic content to load
    Promise.all([
        loadSection('../pages/leadership-positions.html', 'leadership-roles-content'),
        loadSection('../pages/merit-badges.html', 'merit-badges-content')
    ]).then(() => {
        // Once all content is on the page, initialize the collapsible buttons
        if (window.initializeCollapsibles) {
            window.initializeCollapsibles();
        }
    }).catch(error => {
        console.error('Error loading dynamic scouting sections:', error);
    });

});


// Modal functionality for the Eagle Project gallery
function openModal(src, alt) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    
    if (modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = src;
        modalImg.alt = alt;
        captionText.textContent = alt;
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

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});
