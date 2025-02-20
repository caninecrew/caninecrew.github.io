document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on the index page or in the pages directory
    const isIndexPage = window.location.pathname === '/' || 
                       window.location.pathname.endsWith('index.html');

    const headerContent = isIndexPage ? `
        <header class="site-header">
            <nav class="navbar">
                <div class="logo">Samuel Rumbley</div>
                <ul class="nav-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="pages/education.html">My Education</a></li>
                    <li><a href="pages/experience.html">Professional Experience</a></li>
                    <li><a href="pages/scouting.html">Scouting Achievements</a></li>
                    <li><a href="pages/church.html">Community Service</a></li>
                    <li><a href="pages/projects.html">My Projects</a></li>
                    <li><a href="pages/achievements.html">Awards & Honors</a></li>
                </ul>
            </nav>
        </header>
    ` : `
        <header class="site-header">
            <nav class="navbar">
                <div class="logo">Samuel Rumbley</div>
                <ul class="nav-links">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="education.html">My Education</a></li>
                    <li><a href="experience.html">Professional Experience</a></li>
                    <li><a href="scouting.html">Scouting Achievements</a></li>
                    <li><a href="church.html">Community Service</a></li>
                    <li><a href="projects.html">My Projects</a></li>
                    <li><a href="achievements.html">Awards & Honors</a></li>
                </ul>
            </nav>
        </header>
    `;

    document.querySelector("#header").innerHTML = headerContent;
});