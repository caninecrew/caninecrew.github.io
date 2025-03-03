// Unified carousel component
class Carousel {
    constructor(carouselSelector, options = {}) {
        this.carousel = document.querySelector(carouselSelector);
        if (!this.carousel) {
            console.error(`Carousel not found: ${carouselSelector}`);
            return;
        }
        
        this.images = this.carousel.querySelectorAll('img');
        this.prevButton = this.carousel.querySelector('.carousel-button.prev') || 
                         this.carousel.parentElement.querySelector('.carousel-button.prev');
        this.nextButton = this.carousel.querySelector('.carousel-button.next') ||
                         this.carousel.parentElement.querySelector('.carousel-button.next');
        
        if (!this.images.length || !this.prevButton || !this.nextButton) {
            console.error('Carousel elements missing');
            return;
        }
        
        this.currentIndex = 0;
        this.intervalTime = options.interval || 5000;
        this.interval = null;
        
        this.init();
    }
    
    init() {
        this.showImage(this.currentIndex);
        
        this.nextButton.addEventListener('click', () => {
            this.stopCarousel();
            this.nextImage();
            this.startCarousel();
        });
        
        this.prevButton.addEventListener('click', () => {
            this.stopCarousel();
            this.prevImage();
            this.startCarousel();
        });
        
        this.startCarousel();
    }
    
    showImage(index) {
        this.images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(this.currentIndex);
    }
    
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(this.currentIndex);
    }
    
    startCarousel() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextImage(), this.intervalTime);
    }
    
    stopCarousel() {
        clearInterval(this.interval);
    }
}