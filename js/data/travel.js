const travelLocations = [
    {
        name: "Mt. Juliet, Tennessee",
        position: { lat: 36.1627, lng: -86.7816 },
        description: "Hometown",
        date: "Born and raised",
        image: "../images/travel/mtjuliet.jpg"
    },
    {
        name: "Washington, D.C.",
        position: { lat: 38.8951, lng: -77.0364 },
        description: "Visited the Pentagon, National Zoo, and National Mall.",
        date: "Various Trips",
        image: "https://images.unsplash.com/photo-1617581125133-d236b2b6c5c1?q=80&w=2940&auto=format&fit=crop"
    },
    {
        name: "New York City, New York",
        position: { lat: 40.7128, lng: -74.0060 },
        description: "Visited the 9/11 Memorial and the Empire State Building.",
        date: "Various Trips",
        image: "https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=2940&auto=format&fit=crop"
    },
    {
        name: "Key West, Florida",
        position: { lat: 24.5551, lng: -81.7800 },
        description: "Travelled to the furtherst point south in the continental United States.",
        date: "Family Vacation",
        image: "https://images.unsplash.com/photo-1581423293816-7517c37e4034?q=80&w=2894&auto=format&fit=crop"
    }
];

window.travelLocations = travelLocations;

function renderTravelLocations() {
    const locationsGrid = document.getElementById('locations-grid');
    if (!locationsGrid) return;

    locationsGrid.innerHTML = '';

    if (!Array.isArray(window.travelLocations) || window.travelLocations.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'Travel locations will appear here once they are added.';
        locationsGrid.appendChild(emptyState);
        return;
    }

    window.travelLocations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <img src="${location.image}" alt="${location.name}">
            <div class="location-info">
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p class="location-date">${location.date}</p>
            </div>
        `;
        locationsGrid.appendChild(card);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTravelLocations, { once: true });
} else {
    renderTravelLocations();
}
