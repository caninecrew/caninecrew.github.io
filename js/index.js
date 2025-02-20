// Replace the existing debugging code at the start of the file
console.log('Debug: Starting script execution');

// Check config
if (typeof config === 'undefined') {
    console.error('Error: config object is undefined');
} else {
    console.log('Success: config object found');
    console.log('API Key length:', config.GOOGLE_MAPS_API_KEY ? config.GOOGLE_MAPS_API_KEY.length : 0);
    console.log('API Key first 4 chars:', config.GOOGLE_MAPS_API_KEY ? config.GOOGLE_MAPS_API_KEY.substring(0, 4) : 'none');
}

// Add event listener for script load errors
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT') {
        console.error('Script load failed:', e.target.src);
    }
}, true);

console.log('Script loaded');
window.addEventListener('load', () => {
    console.log('Window loaded');
    console.log('Google Maps object:', typeof google !== 'undefined' ? 'Available' : 'Not available');
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Fetch funFacts.csv and pick a random entry
    fetch('/data/funFacts.csv')
        .then(response => response.text())
        .then(data => {
            // Split and filter out comments or empty lines
            const lines = data.split('\n').map(line => line.trim())
                .filter(line => line && !line.startsWith('#') && !line.startsWith('//'));
            // Pick a random fact
            const randomFact = lines[Math.floor(Math.random() * lines.length)].replace(/"/g, '');
            // Update the fun fact paragraph
            document.getElementById('fun-fact').textContent = randomFact;
        })
        .catch(error => console.error('Error reading funFacts.csv:', error));

    // Existing code for featured awards...
    const achievements = [
        { text: 'James E. West Fellowship', link: 'achievements.html#james-e-west' },
        { text: 'Josh Sain Memorial Award', link: 'achievements.html#josh-sain-memorial-award' },
        { text: 'MTC ACFE Scholarship', link: 'achievements.html#mtc-acfe-scholarship' },
        { text: 'Founders Award', link: 'achievements.html#founders-award' },
        { text: 'Scout of the Year', link: 'achievements.html#scout-of-the-year' },
        { text: 'Eagle Scout', link: 'achievements.html#eagle-scout' },
        { text: 'Vigil Honor', link: 'achievements.html#vigil-honor' }
    ];

    function getRandomAchievements(arr, num) {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    const selectedAchievements = getRandomAchievements(achievements, 3);
    const awardsList = document.getElementById('featured-awards-list');

    selectedAchievements.forEach(achievement => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = achievement.link;
        link.textContent = achievement.text;
        listItem.appendChild(link);
        awardsList.appendChild(listItem);
    });

    // Add this before the initMap function
    const locations = [
        {
            position: { lat: 39.8283, lng: -98.5795 },
            title: 'Center of USA',
            icon: {
                url: '/images/map-marker.png', // Add your custom marker image
                scaledSize: new google.maps.Size(32, 32)
            }
        }
        // Add more locations as needed
    ];

    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');

    // Load Google Maps API with error handling
    try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => console.error('Failed to load Google Maps API');
        document.head.appendChild(script);
    } catch (error) {
        console.error('Error loading Google Maps:', error);
    }
});

// Move initMap outside of DOMContentLoaded
window.initMap = function() {
    console.log('Initializing map...');
    const mapElement = document.getElementById('map');
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');

    try {
        if (!mapElement) {
            throw new Error('Map element not found');
        }

        // Hide loading indicator
        if (mapLoading) {
            mapLoading.style.display = 'none';
        }

        const map = new google.maps.Map(mapElement, {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 },
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        // Add your markers here
        const locations = [
            {
                position: { lat: 39.8283, lng: -98.5795 },
                title: 'Center of USA'
            }
        ];

        locations.forEach(location => {
            new google.maps.Marker({
                position: location.position,
                map: map,
                title: location.title
            });
        });

    } catch (error) {
        console.error('Map initialization failed:', error);
        if (mapLoading) mapLoading.style.display = 'none';
        if (mapError) mapError.style.display = 'block';
    }
};

