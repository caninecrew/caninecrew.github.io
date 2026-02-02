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
        loadSection('../pages/leadership-positions.html', 'leadership-roles-content')
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
let lastFocusedElement;

function openModal(src, alt) {
    lastFocusedElement = document.activeElement;
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const closeBtn = modal.querySelector('.close');

    if (modal && modalImg && captionText) {
        modal.style.display = "block";
        modalImg.src = src;
        modalImg.alt = alt;
        captionText.textContent = alt;

        // Move focus to the close button for accessibility
        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
        // Return focus to the element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeModal();
    }

    // Trap focus inside modal when open
    const modal = document.getElementById("imageModal");
    if (modal && modal.style.display === "block") {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
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
