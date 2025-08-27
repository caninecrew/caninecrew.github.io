/**
 * Initializes all collapsible components on the page.
 * This function is idempotent and can be called multiple times; it will only initialize
 * buttons that have not yet been processed.
 */
function initializeCollapsibles() {
  // Find all collapsible buttons that have not been initialized
  const collapsibles = document.querySelectorAll('.collapsible:not([data-collapsible-init])');

  collapsibles.forEach(button => {
    // Mark the button as initialized to prevent re-adding listeners
    button.setAttribute('data-collapsible-init', 'true');
    
    // Set initial accessibility state
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', function() {
      // Toggle the 'active' class for styling
      this.classList.toggle('active');
      const isActive = this.classList.contains('active');
      
      // Update accessibility state
      this.setAttribute('aria-expanded', isActive);

      // Find the content panel to show or hide
      let content;
      // The merit badge buttons are inside an H3, others are not
      if (this.parentElement.tagName === 'H3') {
        content = this.parentElement.nextElementSibling;
      } else {
        content = this.nextElementSibling;
      }

      // Toggle the display if the content panel exists
      if (content) {
        if (isActive) {
          // Merit badge lists use a grid layout
          if (content.classList.contains('merit-badge-list')) {
            content.style.display = 'grid';
          } else {
            content.style.display = 'block';
          }
        } else {
          content.style.display = 'none';
        }
      }
    });
  });
}

// Run the function once the initial page loads
document.addEventListener('DOMContentLoaded', initializeCollapsibles);

// Make the function globally available to be called after dynamic content is loaded
window.initializeCollapsibles = initializeCollapsibles;