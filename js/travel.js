const travelLocations = [
    {
        name: "Nashville, Tennessee",
        position: { lat: 36.1627, lng: -86.7816 },
        description: "Home sweet home",
        date: "Current",
        image: "../images/travel/nashville.jpg"
    }
    // Add more locations as needed
];

window.initMap = function() {
    const mapElement = document.getElementById('map');
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');

    try {
        if (!mapElement) throw new Error('Map element not found');

        mapLoading.style.display = 'none';

        const map = new google.maps.Map(mapElement, {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Add markers for each location
        travelLocations.forEach(location => {
            const marker = new google.maps.Marker({
                position: location.position,
                map: map,
                title: location.name
            });

            // Add info window
            const infowindow = new google.maps.InfoWindow({
                content: `<h3>${location.name}</h3><p>${location.description}</p><p>${location.date}</p>`
            });

            marker.addListener('click', () => {
                infowindow.open(map, marker);
            });
        });

    } catch (error) {
        console.error('Map initialization failed:', error);
        mapLoading.style.display = 'none';
        mapError.style.display = 'block';
    }
};

// Populate locations grid
document.addEventListener('DOMContentLoaded', function() {
    const locationsGrid = document.getElementById('locations-grid');
    
    travelLocations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <img src="${location.image}" alt="${location.name}">
            <div class="location-info">
                <h3>${location.name}</h3>
                <p>${location.description}</p>
                <p><small>${location.date}</small></p>
            </div>
        `;
        locationsGrid.appendChild(card);
    });
});