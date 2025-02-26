document.addEventListener("DOMContentLoaded", function() {
    const eagleProjectSection = `
        <section class="eagle-project" id="eagle-project">
            <h2>Eagle Scout Service Project</h2>
            <div class="project-showcase">
                <div class="project-card">
                    <div class="project-meta">
                        <span class="project-date">August 2020</span>
                        <span class="project-location">Wilson Central High School</span>
                    </div>
                    <div class="project-images">
                        <div class="carousel">
                            <img src="../images/eagle-project/project1.jpg" alt="Project Image 1" class="project-image active">
                            <img src="../images/eagle-project/project2.jpg" alt="Project Image 2" class="project-image">
                            <img src="../images/eagle-project/project3.jpg" alt="Project Image 3" class="project-image">
                            <img src="../images/eagle-project/project4.jpg" alt="Project Image 4" class="project-image">
                            <img src="../images/eagle-project/project5.jpg" alt="Project Image 5" class="project-image">
                            <img src="../images/eagle-project/project6.jpg" alt="Project Image 6" class="project-image">
                        </div>
                        <button class="carousel-button prev" aria-label="Previous image">‹</button>
                        <button class="carousel-button next" aria-label="Next image">›</button>
                    </div>
                    <div class="project-content">
                        <h4>Mask Creation Initiative</h4>
                        <p>Led a service project creating over 270 cloth masks for teachers and administration at Wilson Central High School in response to the COVID-19 pandemic and the Wilson County BOE mandate requiring facial coverings for anyone over age 12.</p>
                        <h4>Project Highlights</h4>
                        <ul>
                            <li>Organized and led youth volunteers in mask production</li>
                            <li>Supported school safety measures during the pandemic</li>
                            <li>Demonstrated leadership and community service</li>
                            <li>Completed project before the start of school year</li>
                        </ul>
                        <h4>Impact</h4>
                        <p>The project helped ensure a safer return to school for teachers and staff during the challenging early period of the COVID-19 pandemic.</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('eagle-project-section-container').innerHTML = eagleProjectSection;
    
    // Initialize carousel for this content right after adding it to the DOM
    setTimeout(initializeEagleCarousel, 100);
});

// Function to initialize carousel specifically for eagle project
function initializeEagleCarousel() {
    const carousel = document.querySelector('#eagle-project .carousel');
    if (!carousel) {
        console.error('Eagle project carousel not found');
        return;
    }
    
    const images = carousel.querySelectorAll('img');
    const prevButton = carousel.parentElement.querySelector('.carousel-button.prev');
    const nextButton = carousel.parentElement.querySelector('.carousel-button.next');
    
    if (!images.length || !prevButton || !nextButton) {
        console.error('Carousel elements missing:', {
            imagesCount: images.length,
            prevButton: !!prevButton,
            nextButton: !!nextButton
        });
        return;
    }
    
    console.log('Initializing eagle carousel with', images.length, 'images');
    
    let currentIndex = 0;
    const intervalTime = 5000; // 5 seconds between transitions
    let interval;

    function showImage(index) {
        console.log(`Showing image ${index + 1} of ${images.length}`);
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    function startCarousel() {
        // Clear any existing intervals first
        if (interval) clearInterval(interval);
        interval = setInterval(nextImage, intervalTime);
    }

    function stopCarousel() {
        clearInterval(interval);
    }

    nextButton.addEventListener('click', () => {
        console.log('Next button clicked');
        stopCarousel();
        nextImage();
        startCarousel();
    });

    prevButton.addEventListener('click', () => {
        console.log('Previous button clicked');
        stopCarousel();
        prevImage();
        startCarousel();
    });

    // Show first image and start automatic rotation
    showImage(currentIndex);
    startCarousel();
}