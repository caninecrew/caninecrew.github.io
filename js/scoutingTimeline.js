document.addEventListener('DOMContentLoaded', () => {
    initializeTimeline();
});

function initializeTimeline() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    const timelineWrapper = document.querySelector('.timeline-wrapper');
    
    // Handle scroll buttons
    timelineWrapper.addEventListener('click', (e) => {
        const timeline = timelineWrapper.querySelector('.timeline');
        const scrollAmount = 300; // Width of one timeline item
        
        if (e.target === timelineWrapper) {
            if (e.offsetX < 50) {
                // Clicked left arrow
                timeline.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else if (e.offsetX > timelineWrapper.offsetWidth - 50) {
                // Clicked right arrow
                timeline.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    });

    const timeline = document.querySelector('.timeline.horizontal');
    const leftBtn = document.querySelector('.timeline-scroll-btn.left');
    const rightBtn = document.querySelector('.timeline-scroll-btn.right');
    const scrollAmount = 300; // Width of one item

    leftBtn.addEventListener('click', () => {
        timeline.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        timeline.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Hide/show scroll buttons based on scroll position
    const updateScrollButtons = () => {
        leftBtn.style.opacity = timeline.scrollLeft > 0 ? '1' : '0.5';
        rightBtn.style.opacity = 
            timeline.scrollLeft < (timeline.scrollWidth - timeline.clientWidth) 
            ? '1' : '0.5';
    };

    timeline.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();
}