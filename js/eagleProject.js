document.addEventListener("DOMContentLoaded", function() {
    const eagleProjectSection = `
        <section class="eagle-project" id="eagle-project">
            <h2>Eagle Scout Service Project</h2>
            <div class="project-showcase">
                <div class="project-card">
                    <div class="project-meta">
                        <span class="project-date">August 2020</span>
                        <span class="project-location">Wilson Central High School</span>
                    </div>
                    <div class="project-images">
                        <div class="carousel">
                            <img src="../images/eagle-project/project1.jpg" alt="Project Image 1" class="project-image">
                            <img src="../images/eagle-project/project2.jpg" alt="Project Image 2" class="project-image">
                            <img src="../images/eagle-project/project3.jpg" alt="Project Image 3" class="project-image">
                            <img src="../images/eagle-project/project4.jpg" alt="Project Image 4" class="project-image">
                            <img src="../images/eagle-project/project5.jpg" alt="Project Image 5" class="project-image">
                            <img src="../images/eagle-project/project6.jpg" alt="Project Image 6" class="project-image">
                        </div>
                        <button class="carousel-button prev" aria-label="Previous image">‹</button>
                        <button class="carousel-button next" aria-label="Next image">›</button>
                    </div>
                    <div class="project-content">
                        <h4>Mask Creation Initiative</h4>
                        <p>Led a service project creating over 270 cloth masks for teachers and administration at Wilson Central High School in response to the COVID-19 pandemic and the Wilson County BOE mandate requiring facial coverings for anyone over age 12.</p>
                        <h4>Project Highlights</h4>
                        <ul>
                            <li>Organized and led youth volunteers in mask production</li>
                            <li>Supported school safety measures during the pandemic</li>
                            <li>Demonstrated leadership and community service</li>
                            <li>Completed project before the start of school year</li>
                        </ul>
                        <h4>Impact</h4>
                        <p>The project helped ensure a safer return to school for teachers and staff during the challenging early period of the COVID-19 pandemic.</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('eagle-project-section-container').innerHTML = eagleProjectSection;
});