const data = window.siteData;

const skillGroups = [
  {
    title: "Technology and Data",
    items: ["IT Support", "Technical Troubleshooting", "Microsoft Excel", "Power Query", "SQL", "Python", "R", "Tableau", "Google Colab", "Git", "Linux", "Data Analysis"]
  },
  {
    title: "Workplace Tools",
    items: ["Google Workspace", "Microsoft Office", "Slack Workspace Administration", "Atlassian Jira", "Asana", "Excel Dashboards"]
  },
  {
    title: "Education and Leadership",
    items: ["Teaching", "Classroom Support", "Youth Development", "Program Development", "Event Planning", "Volunteer Coordination", "Problem Solving", "Critical Thinking", "Communication", "Teamwork", "Organizational Leadership"]
  }
];

const credentialGroups = [
  {
    title: "Certifications",
    items: ["Notary Public", "Adult & Pediatric First Aid / CPR / AED", "Youth Mental Health First Aid", "National Camping School - Program Director", "National Camping School - Short-Term Camp Administrator / Assessor", "Excel: Power Query for Beginners", "Excel: Dashboards for Beginners"]
  },
  {
    title: "Scholarships and Honors",
    items: ["Laura and William Miller Scholarship for Summer Camp Staff", "Josh Sain Memorial Scholarship", "MTC ACFE Scholarship", "Presidential Scholars Scholarship", "TN HOPE Scholarship", "Dean's List"]
  },
  {
    title: "Scouting Recognition",
    items: ["Founder's Award", "Tom Parker Memorial Award", "Middle Tennessee Council Scout of the Year", "Josh Sain Memorial Award", "Eagle Scout", "OA Vigil Honor"]
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderLinks(target, variant) {
  const links = data.links
    .map((link) => `<a ${variant === "primary" ? 'class="button"' : ""} href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`)
    .join("");
  target.innerHTML = links;
}

function firstSentence(text) {
  const match = String(text).match(/^.*?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text;
}

function summaryFor(item) {
  if (item.summary) return item.summary;
  if (item.description) return item.description;
  if (item.details?.length) return firstSentence(item.details[0]);
  if (item.degree) return item.degree;
  return "";
}

function contextFor(item) {
  return [item.organization || item.location || item.type, item.dates].filter(Boolean).join(" | ");
}

function detailsMarkup(item, detailId) {
  const details = item.details || [];
  if (!details.length) return `<p class="meta">Ready for future details</p>`;
  const summary = summaryFor(item);
  const visibleDetails = details.filter((detail) => detail !== summary);
  if (!visibleDetails.length) return "";
  return `
    <button class="detail-toggle" type="button" aria-expanded="false" aria-controls="${detailId}">Details</button>
    <ul class="detail-list" id="${detailId}" hidden>
      ${visibleDetails.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
    </ul>
  `;
}

function renderFeatureCards(target, items) {
  target.innerHTML = items.map((item) => `
    <article class="feature">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderTimeline(target, items, prefix) {
  target.innerHTML = items.map((item, index) => {
    const detailId = `${prefix}-${index}`;
    return `
      <article class="timeline-item">
        <div class="timeline-marker" aria-hidden="true"></div>
        <div class="timeline-card">
          <p class="meta">${escapeHtml(contextFor(item))}</p>
          <h3>${escapeHtml(item.role || item.school || item.title)}</h3>
          <p>${escapeHtml(summaryFor(item))}</p>
          ${detailsMarkup(item, detailId)}
        </div>
      </article>
    `;
  }).join("");
}

function renderCards(target, items, prefix) {
  target.innerHTML = items.map((item, index) => {
    const detailId = `${prefix}-${index}`;
    return `
      <article class="profile-card-item">
        <p class="card-kicker">${escapeHtml(item.type || item.organization || item.location || "")}</p>
        <h3>${escapeHtml(item.title || item.role || item.school)}</h3>
        ${item.dates ? `<p class="meta">${escapeHtml(item.dates)}</p>` : ""}
        <p>${escapeHtml(summaryFor(item))}</p>
        ${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Open project</a>` : ""}
        ${detailsMarkup(item, detailId)}
      </article>
    `;
  }).join("");
}

function renderEducation(target) {
  renderCards(target, data.education.map((item) => ({
    ...item,
    title: item.school,
    type: item.location,
    summary: item.degree
  })), "education");
}

function renderGroupedTags(target, groups, sourceItems) {
  target.innerHTML = groups.map((group) => {
    const items = group.items.filter((item) => sourceItems.includes(item));
    if (!items.length) return "";
    return `
      <article class="tag-group">
        <h3>${escapeHtml(group.title)}</h3>
        <div class="tag-list">
          ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
        </div>
      </article>
    `;
  }).join("");
}

document.querySelectorAll("[data-year]").forEach((target) => {
  target.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-links]").forEach((target) => {
  renderLinks(target, target.dataset.links);
});

document.querySelectorAll("[data-highlights]").forEach((target) => {
  renderFeatureCards(target, data.highlights);
});

document.querySelectorAll("[data-leadership-themes]").forEach((target) => {
  renderFeatureCards(target, data.leadershipThemes);
});

document.querySelectorAll("[data-work]").forEach((target) => {
  renderTimeline(target, data.work, "work");
});

document.querySelectorAll("[data-education]").forEach((target) => {
  renderEducation(target);
});

document.querySelectorAll("[data-service]").forEach((target) => {
  renderCards(target, data.service, "service");
});

document.querySelectorAll("[data-projects]").forEach((target) => {
  renderCards(target, data.projects, "project");
});

document.querySelectorAll("[data-skills]").forEach((target) => {
  renderGroupedTags(target, skillGroups, data.skills);
});

document.querySelectorAll("[data-awards]").forEach((target) => {
  renderGroupedTags(target, credentialGroups, data.awards);
});

document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".detail-toggle");
  if (!toggle) return;
  const details = document.getElementById(toggle.getAttribute("aria-controls"));
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  toggle.textContent = expanded ? "Details" : "Hide details";
  details.hidden = expanded;
});

document.querySelectorAll(".nav-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    document.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
  });
});
