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

    const headerContent = `
        <header class="site-header">
            <nav class="navbar">
                <div class="logo">Samuel Rumbley</div>
                <button class="mobile-menu-btn" aria-label="Toggle menu">
                    <span class="hamburger"></span>
                </button>
                <ul class="nav-links">
                    ${navItems.map(item => `<li><a href="${isIndexPage ? item.link : '..' + item.link}">${item.text}</a></li>`).join('')}
                </ul>
            </nav>
        </header>
    `;

    document.querySelector("#header").innerHTML = headerContent;

    // Add mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});