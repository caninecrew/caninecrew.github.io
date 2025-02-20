document.addEventListener("DOMContentLoaded", function() {
    fetch("/pages/header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector("#header").innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback content if header fails to load
            document.querySelector("#header").innerHTML = `
                <nav class="navbar">
                    <div class="logo">Samuel Rumbley</div>
                    <ul class="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/pages/education.html">Education</a></li>
                        <li><a href="/pages/experience.html">Experience</a></li>
                    </ul>
                </nav>`;
        });
});