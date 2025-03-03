// Main application entry point
class App {
    constructor() {
        this.initialized = false;
        
        // Page detection
        this.currentPage = this.detectCurrentPage();
        
        // Debug info
        this.debug = true;
        this.log('App instance created');
    }
    
    init() {
        if (this.initialized) {
            this.log('Already initialized');
            return;
        }
        
        this.log('Initializing application');
        
        // Load common components
        this.loadHeader();
        this.loadFooter();
        
        // Load header and footer
        this.loadDynamicComponents();
        
        // Initialize page-specific functionality
        this.initCurrentPage();
        
        // Setup global event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        this.log('Initialization complete');
    }
    
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.endsWith('/') || path.endsWith('index.html')) {
            return 'home';
        }
        
        if (path.includes('/pages/')) {
            const pageName = path.split('/').pop().replace('.html', '');
            return pageName || 'unknown';
        }
        
        return 'unknown';
    }
    
    loadHeader() {
        const headerElement = document.getElementById('header');
        if (!headerElement) return;
        
        // This will be handled by header.js, but we log it for tracking
        this.log('Header mounting point found');
    }
    
    loadFooter() {
        const footerElement = document.getElementById('footer');
        if (!footerElement) return;
        
        // This will be handled by footer.js, but we log it for tracking
        this.log('Footer mounting point found');
    }
    
    loadDynamicComponents() {
        // Components will initialize themselves via their own DOMContentLoaded events
        this.log('Loading dynamic components');
    }
    
    initCurrentPage() {
        this.log(`Initializing page: ${this.currentPage}`);
        
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'scouting':
                this.initScoutingPage();
                break;
            case 'travel':
                this.initTravelPage();
                break;
            default:
                this.log(`No special initialization for page: ${this.currentPage}`);
        }
    }
    
    initHomePage() {
        this.log('Initializing home page');
        
        // Load random fun fact
        this.loadFunFact();
        
        // Initialize map if exists
        this.initHomeMap();
        
        // Load featured awards
        this.loadFeaturedAwards();
    }
    
    loadFunFact() {
        const funFactElement = document.getElementById('fun-fact');
        if (!funFactElement) return;
        
        Utils.fetchTextFile('data/funFacts.csv', { filterComments: true })
            .then(lines => {
                if (lines && lines.length > 0) {
                    const randomFact = lines[Math.floor(Math.random() * lines.length)].replace(/"/g, '');
                    funFactElement.textContent = randomFact;
                }
            })
            .catch(error => this.log(`Error loading fun facts: ${error}`, 'error'));
    }
    
    initHomeMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        // Initialize map
        const map = window.mapManager.initialize('map', {
            zoom: 7
        });
        
        if (map) {
            // Add Nashville marker
            window.mapManager.addMarkers('map', [
                {
                    position: { lat: 36.174465, lng: -86.767960 },
                    title: 'Nashville, TN',
                    content: '<div class="map-popup"><h3>Nashville, TN</h3><p>Home sweet home</p></div>'
                }
            ]);
        }
    }
    
    loadFeaturedAwards() {
        const awardsList = document.getElementById('featured-awards-list');
        if (!awardsList) return;
        
        // Sample achievements - in a real implementation, this would be imported from data/achievements.js
        const achievements = [
            { text: 'James E. West Fellowship', link: 'pages/achievements.html#james-e-west' },
            { text: 'Josh Sain Memorial Award', link: 'pages/achievements.html#josh-sain-memorial-award' },
            { text: 'MTC ACFE Scholarship', link: 'pages/achievements.html#mtc-acfe-scholarship' },
            { text: 'Founders Award', link: 'pages/achievements.html#founders-award' },
            { text: 'Scout of the Year', link: 'pages/achievements.html#scout-of-the-year' },
            { text: 'Eagle Scout', link: 'pages/achievements.html#eagle-scout' },
            { text: 'Vigil Honor', link: 'pages/achievements.html#vigil-honor' }
        ];
        
        const selectedAchievements = Utils.getRandomItems(achievements, 3);
        
        // Clear existing list items
        awardsList.innerHTML = '';
        
        // Add selected achievements
        selectedAchievements.forEach(achievement => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = achievement.link;
            link.textContent = achievement.text;
            listItem.appendChild(link);
            awardsList.appendChild(listItem);
        });
    }
    
    initScoutingPage() {
        this.log('Initializing scouting page');
        
        // Load dynamic sections
        this.loadScoutingComponents();
        
        // Initialize back to top button
        this.initBackToTop();
    }
    
    loadScoutingComponents() {
        const promises = [
            DOMUtils.loadHTMLFile('timeline-section-container', '../pages/timeline.html'),
            DOMUtils.loadHTMLFile('leadership-section-container', '../pages/leadership-positions.html'),
            DOMUtils.loadHTMLFile('merit-badges-section-container', '../pages/merit-badges.html')
        ];
        
        // After all components are loaded
        Promise.all(promises)
            .then(() => {
                this.log('All scouting components loaded');
                
                // Reinitialize components
                if (window.reinitializeCollapsibles) {
                    window.reinitializeCollapsibles();
                }
                
                // Initialize eagle project
                this.initEagleProject();
            })
            .catch(error => this.log(`Error loading scouting components: ${error}`, 'error'));
    }
    
    initEagleProject() {
        const container = document.getElementById('eagle-project-section-container');
        if (!container) return;
        
        // Load eagle project content
        fetch('../pages/eagle-project.html')
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;
                
                // Initialize carousel
                setTimeout(() => {
                    new Carousel('#eagle-project .carousel');
                }, 100);
            })
            .catch(error => this.log(`Error loading eagle project: ${error}`, 'error'));
    }
    
    initTravelPage() {
        this.log('Initializing travel page');
        
        // Initialize map if exists
        const mapElement = document.getElementById('map');
        if (mapElement) {
            // Initialize map
            const map = window.mapManager.initialize('map', {
                zoom: 4
            });
            
            if (map && window.travelLocations) {
                // Convert travel locations to map markers
                const markers = window.travelLocations.map(location => ({
                    position: location.position || { 
                        lat: location.coords?.lat || 36.174465, 
                        lng: location.coords?.lng || -86.767960 
                    },
                    title: location.name,
                    content: `<div class="map-popup">
                        <h3>${location.name}</h3>
                        <p>${location.description}</p>
                        <p>${location.date}</p>
                    </div>`
                }));
                
                window.mapManager.addMarkers('map', markers);
            }
        }
        
        // Populate locations grid
        this.populateLocationsGrid();
    }
    
    populateLocationsGrid() {
        const locationsGrid = document.getElementById('locations-grid');
        
        if (locationsGrid && window.travelLocations) {
            // Clear existing content
            locationsGrid.innerHTML = '';
            
            // Add each location
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
    }
    
    initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');
        if (!backToTopButton) return;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    setupEventListeners() {
        // Fade-in animation for elements with .fade-in class
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length > 0) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            fadeElements.forEach(element => observer.observe(element));
        }
    }
    
    log(message, type = 'info') {
        if (!this.debug && type !== 'error') return;
        
        const prefix = '[App]';
        console[type === 'error' ? 'error' : 'log'](`${prefix} ${message}`);
    }
}

// Create and initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});

