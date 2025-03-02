document.addEventListener('DOMContentLoaded', () => {
    // Initial call removed, now only called after content is loaded
});

function initializeCollapsibles() {
    console.log("Initializing collapsibles...");
    
    // Try a more direct and reliable approach
    
    // Merit badge collapsibles
    const meritBadgeButtons = document.querySelectorAll('.merit-badge-year .collapsible');
    console.log(`Found ${meritBadgeButtons.length} merit badge buttons`);
    
    meritBadgeButtons.forEach(button => {
        // Make sure we're not adding duplicate listeners
        button.onclick = function() {
            this.classList.toggle('active');
            const content = this.closest('.merit-badge-year').querySelector('.merit-badge-list');
            
            if (this.classList.contains('active')) {
                content.style.display = 'grid';
            } else {
                content.style.display = 'none';
            }
            
            console.log(`Merit badge toggled: ${this.textContent.trim()}, active: ${this.classList.contains('active')}`);
        };
    });
    
    // Organization collapsibles
    const orgButtons = document.querySelectorAll('.organization-group .collapsible');
    console.log(`Found ${orgButtons.length} organization buttons`);
    
    orgButtons.forEach(button => {
        // Make sure we're not adding duplicate listeners
        button.onclick = function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
            
            console.log(`Organization toggled: ${this.textContent.trim()}, active: ${this.classList.contains('active')}`);
        };
    });

    // Log all collapsible buttons for debugging
    console.log('All collapsible buttons:');
    document.querySelectorAll('.collapsible').forEach((btn, i) => {
        console.log(`  ${i+1}: ${btn.textContent.trim()} - in ${btn.closest('.merit-badge-year') ? 'merit-badge-year' : (btn.closest('.organization-group') ? 'organization-group' : 'unknown')}`);
    });
}