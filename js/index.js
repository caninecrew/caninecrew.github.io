// filepath: /c:/Users/Samue/Documents/GitHub/caninecrew.github.io/index.js
document.addEventListener('DOMContentLoaded', function() {
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

    // Make initMap function globally available
    window.initMap = function() {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        console.log('Initializing map...'); // Debug log

        const map = new google.maps.Map(mapElement, {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "administrative",
                    elementType: "geometry",
                    stylers: [{ visibility: "simplified" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#a0d6d1" }]
                },
                {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }]
                }
            ],
            gestureHandling: "cooperative",
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        // Update the marker creation in initMap:
        locations.forEach(location => {
            const marker = new google.maps.Marker({
                position: location.position,
                map: map,
                title: location.title,
                icon: location.icon,
                animation: google.maps.Animation.DROP
            });

            // Add click listener for info windows
            const infowindow = new google.maps.InfoWindow({
                content: `<h3>${location.title}</h3>`
            });

            marker.addListener('click', () => {
                infowindow.open(map, marker);
            });
        });

        // Debug log
        console.log('Map initialized:', map);
    };

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

