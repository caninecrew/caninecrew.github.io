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

document.addEventListener('DOMContentLoaded', function() {
    // Populate locations grid
    const locationsGrid = document.getElementById('locations-grid');
    
    if (locationsGrid && window.travelLocations) {
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
    
    // Load map
    if (document.getElementById('travel-map-container')) {
        MapUtils.loadAPI();
    }
});

// Map initialization callback
window.initMap = function() {
    const map = MapUtils.initializeMap('map');
    if (!map) return;
    
    if (window.travelLocations) {
        // Convert travel locations to map markers
        const markers = window.travelLocations.map(location => ({
            position: location.position, // Corrected from 'coords'
            title: location.name,
            content: `<div class="map-popup">
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p>${location.date}</p>
            </div>`
        }));
        
        MapUtils.addMarkers(map, markers);
    }
};