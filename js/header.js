document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on the index page or in the pages directory
    const isIndexPage = window.location.pathname === '/' || 
                       window.location.pathname.endsWith('index.html');

    const navItems = [
        { text: 'Home', link: '/' },
        { text: 'Education', link: '/pages/education.html' },
        { text: 'Experience', link: '/pages/experience.html' },
        { text: 'Training', link: '/pages/training.html' },
        { text: 'Scouting', link: '/pages/scouting.html' },
        { text: 'Projects', link: '/pages/projects.html' },
        { text: 'Achievements', link: '/pages/achievements.html' },
        { text: 'Travel', link: '/pages/travel.html' }
    ];

    const headerContent = isIndexPage ? `
        <header class="site-header">
            <nav class="navbar">
                <div class="logo">Samuel Rumbley</div>
                <ul class="nav-links">
                    ${navItems.map(item => `<li><a href="${item.link}">${item.text}</a></li>`).join('')}
                </ul>
            </nav>
        </header>
    ` : `
        <header class="site-header">
            <nav class="navbar">
                <div class="logo">Samuel Rumbley</div>
                <ul class="nav-links">
                    ${navItems.map(item => `<li><a href="..${item.link}">${item.text}</a></li>`).join('')}
                </ul>
            </nav>
        </header>
    `;

    document.querySelector("#header").innerHTML = headerContent;
});