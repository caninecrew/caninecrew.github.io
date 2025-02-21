document.addEventListener("DOMContentLoaded", function() {
    const collapsibles = document.querySelectorAll(".collapsible");
    
    collapsibles.forEach(button => {
        // Set initial state
        const content = button.closest('h3').nextElementSibling;
        content.style.maxHeight = "0px";
        content.style.overflow = "hidden";
        
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.closest('h3').nextElementSibling;
            
            if (content.style.maxHeight === "0px") {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "1rem";
            } else {
                content.style.maxHeight = "0px";
                content.style.padding = "0";
            }
        });
    });
});