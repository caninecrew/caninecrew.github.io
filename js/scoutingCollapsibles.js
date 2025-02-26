document.addEventListener('DOMContentLoaded', () => {
    initializeCollapsibles();
});

function initializeCollapsibles() {
    // Merit Badge Year buttons
    const meritBadgeButtons = document.querySelectorAll('.merit-badge-year .collapsible');
    
    meritBadgeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Find the corresponding merit badge list
            const badgeList = this.closest('.merit-badge-year').querySelector('.merit-badge-list');
            
            // Toggle display
            if (this.classList.contains('active')) {
                badgeList.style.display = 'grid';
            } else {
                badgeList.style.display = 'none';
            }
        });
    });

    // Organization buttons
    const orgButtons = document.querySelectorAll('.organization-group .collapsible');
    
    orgButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }
            
            // Close other org sections
            const siblings = this.closest('.leadership-grid')
                .querySelectorAll('.organization-group .collapsible');
            siblings.forEach(sibling => {
                if (sibling !== this && sibling.classList.contains('active')) {
                    sibling.classList.remove('active');
                    sibling.nextElementSibling.style.display = "none";
                }
            });
        });
    });
}