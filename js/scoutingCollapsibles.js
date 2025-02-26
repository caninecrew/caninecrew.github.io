document.addEventListener('DOMContentLoaded', () => {
    // Initial call removed, now only called after content is loaded
});

function initializeCollapsibles() {
    console.log("Initializing collapsibles...");
    
    // Merit Badge Year buttons
    const meritBadgeButtons = document.querySelectorAll('.merit-badge-year .collapsible');
    console.log(`Found ${meritBadgeButtons.length} merit badge buttons`);
    
    meritBadgeButtons.forEach(button => {
        // Clone and replace to remove any existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
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
    console.log(`Found ${orgButtons.length} organization buttons`);
    
    if (orgButtons.length > 0) {
        console.log("Organization buttons found!");
        
        orgButtons.forEach(button => {
            // Clone and replace to remove any existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                console.log('Organization button clicked:', this.textContent);
                
                // Find the content div (should be the next sibling)
                const content = this.nextElementSibling;
                console.log('Content element:', content);
                
                // Toggle active state
                this.classList.toggle('active');
                
                // Toggle display
                if (this.classList.contains('active')) {
                    content.style.display = "block";
                } else {
                    content.style.display = "none";
                }
                
                // Optional: Close other org sections
                const siblings = Array.from(this.closest('.leadership-grid')
                    .querySelectorAll('.organization-group .collapsible'));
                
                siblings.forEach(sibling => {
                    if (sibling !== this && sibling.classList.contains('active')) {
                        sibling.classList.remove('active');
                        sibling.nextElementSibling.style.display = "none";
                    }
                });
            });
        });
    } else {
        console.log("No organization buttons found. DOM structure may be incorrect.");
    }
}