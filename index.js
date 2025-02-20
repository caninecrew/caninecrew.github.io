// filepath: /c:/Users/Samue/Documents/GitHub/caninecrew.github.io/index.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch funFacts.csv and pick a random entry
    fetch('funFacts.csv')
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

    // Make initMap function globally available
    window.initMap = function() {
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
            mapTypeId: google.maps.MapTypeId.TERRAIN
        });

        // Use a publicly accessible URL for the KMZ file
        const kmlUrl = 'https://raw.githubusercontent.com/caninecrew/caninecrew.github.io/main/visited.kmz';
        console.log('Loading KML from:', kmlUrl);

        const kmlLayer = new google.maps.KmlLayer({
            url: kmlUrl,
            map: map,
            preserveViewport: false,
            suppressInfoWindows: false
        });

        kmlLayer.addListener('status_changed', () => {
            const status = kmlLayer.getStatus();
            console.log('KML Layer Status:', status);
            if (status !== 'OK') {
                console.error('KML Layer Error:', status);
            }
        });
    };

    // Load the Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
});

