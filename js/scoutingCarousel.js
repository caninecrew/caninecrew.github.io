document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        const prevButton = carousel.parentElement.querySelector('.carousel-button.prev');
        const nextButton = carousel.parentElement.querySelector('.carousel-button.next');
        let currentIndex = 0;
        const intervalTime = 3000; // 3 seconds
        let interval;

        function showImage(index) {
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
            interval = setInterval(nextImage, intervalTime);
        }

        function stopCarousel() {
            clearInterval(interval);
        }

        nextButton.addEventListener('click', () => {
            stopCarousel();
            nextImage();
            startCarousel();
        });

        prevButton.addEventListener('click', () => {
            stopCarousel();
            prevImage();
            startCarousel();
        });

        showImage(currentIndex);
        startCarousel();
    });
});