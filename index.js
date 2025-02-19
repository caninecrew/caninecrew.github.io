// filepath: /c:/Users/Samue/Documents/GitHub/caninecrew.github.io/index.js
document.addEventListener('DOMContentLoaded', function() {
    const achievements = [
        { text: 'James E. West Fellowship', link: 'achievements.html#james-e-west' },
        { text: 'Josh Sain Memorial Award', link: 'achievements.html#josh-sain-memorial-award' },
        { text: 'MTC ACFE Scholarship', link: 'achievements.html#mtc-acfe-scholarship' },
        { text: 'Founders Award', link: 'achievements.html#founders-award' },
        { text: 'Scout of the Year', link: 'achievements.html#scout-of-the-year' },
        { text: 'Eagle Scout', link: 'achievements.html#eagle-scout' },
        { text: 'Vigil Honor', link: 'achievements.html#vigil-honor' }
    ];

    function getRandomAchievements(arr, num) {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    const selectedAchievements = getRandomAchievements(achievements, 3);
    const awardsList = document.getElementById('featured-awards-list');

    selectedAchievements.forEach(achievement => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = achievement.link;
        link.textContent = achievement.text;
        listItem.appendChild(link);
        awardsList.appendChild(listItem);
    });
});