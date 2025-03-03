const travelLocations = [
    {
        name: "Mt. Juliet, Tennessee",
        position: { lat: 36.1627, lng: -86.7816 },
        description: "Hometown",
        date: "Born and raised",
        image: "../images/travel/mtjuliet.jpg"
    }
    // Add more locations as needed
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
            position: location.coords,
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