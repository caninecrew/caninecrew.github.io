const data = window.siteData;

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

function renderCards(target, items, mapper) {
  target.innerHTML = items.map(mapper).join("");
}

function renderTimeline(target, items) {
  target.innerHTML = items.map((item) => `
    <article class="timeline-item">
      <div>
        <h3>${escapeHtml(item.role)}</h3>
        <p class="meta">${escapeHtml(item.organization)} · ${escapeHtml(item.dates)}</p>
      </div>
      <ul>
        ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderTags(target, items) {
  target.innerHTML = items.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
}

document.querySelectorAll("[data-year]").forEach((target) => {
  target.textContent = new Date().getFullYear();
});

document.querySelectorAll("[data-links]").forEach((target) => {
  renderLinks(target, target.dataset.links);
});

document.querySelectorAll("[data-highlights]").forEach((target) => {
  renderCards(target, data.highlights, (item) => `
    <article class="feature">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `);
});

document.querySelectorAll("[data-leadership-themes]").forEach((target) => {
  renderCards(target, data.leadershipThemes, (item) => `
    <article class="feature">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `);
});

document.querySelectorAll("[data-experience-preview]").forEach((target) => {
  renderTimeline(target, data.work.slice(0, 3));
});

document.querySelectorAll("[data-education]").forEach((target) => {
  renderCards(target, data.education, (item) => `
    <article class="card">
      <h3>${escapeHtml(item.school)}</h3>
      <p class="meta">${escapeHtml(item.location)} · ${escapeHtml(item.dates)}</p>
      <p>${escapeHtml(item.degree)}</p>
      <ul>
        ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
      </ul>
    </article>
  `);
});

document.querySelectorAll("[data-work]").forEach((target) => {
  renderTimeline(target, data.work);
});

document.querySelectorAll("[data-service]").forEach((target) => {
  renderTimeline(target, data.service);
});

document.querySelectorAll("[data-skills]").forEach((target) => {
  renderTags(target, data.skills);
});

document.querySelectorAll("[data-awards]").forEach((target) => {
  renderTags(target, data.awards);
});

document.querySelectorAll("[data-projects]").forEach((target) => {
  renderCards(target, data.projects, (item) => `
    <article class="card">
      <p class="eyebrow">${escapeHtml(item.type)}</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Open project</a>` : `<p class="meta">Ready for future details</p>`}
    </article>
  `);
});

document.querySelectorAll("[data-resume-download]").forEach((target) => {
  if (!data.resumeDownload) {
    target.innerHTML = '<p class="note">Resume PDF download will be added after the resume is updated for graduation and the new role.</p>';
    return;
  }
  target.innerHTML = `<a class="button" href="${escapeHtml(data.resumeDownload)}">Download resume PDF</a>`;
});

document.querySelectorAll(".nav-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });
});
