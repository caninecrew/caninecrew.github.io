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

function renderFeatureCards(target, items) {
  target.innerHTML = items.map((item) => `
    <article class="feature">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderExpandableList(target, items, options = {}) {
  target.innerHTML = items.map((item, index) => {
    const title = item.role || item.school || item.title;
    const context = [item.organization || item.location || item.type, item.dates].filter(Boolean).join(" | ");
    const details = item.details || [];
    const detailId = `${options.prefix || "details"}-${index}`;
    return `
      <article class="profile-item">
        <div class="item-main">
          <div>
            <h3>${escapeHtml(title)}</h3>
            ${context ? `<p class="meta">${escapeHtml(context)}</p>` : ""}
          </div>
          <p>${escapeHtml(summaryFor(item))}</p>
          ${item.url ? `<a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Open project</a>` : ""}
        </div>
        ${details.length ? `
          <button class="detail-toggle" type="button" aria-expanded="false" aria-controls="${detailId}">View details</button>
          <ul class="detail-list" id="${detailId}" hidden>
            ${details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
          </ul>
        ` : `<p class="meta">Ready for future details</p>`}
      </article>
    `;
  }).join("");
}

function renderEducation(target) {
  renderExpandableList(target, data.education.map((item) => ({
    ...item,
    summary: item.degree
  })), { prefix: "education" });
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
  renderFeatureCards(target, data.highlights);
});

document.querySelectorAll("[data-leadership-themes]").forEach((target) => {
  renderFeatureCards(target, data.leadershipThemes);
});

document.querySelectorAll("[data-work]").forEach((target) => {
  renderExpandableList(target, data.work, { prefix: "work" });
});

document.querySelectorAll("[data-education]").forEach((target) => {
  renderEducation(target);
});

document.querySelectorAll("[data-service]").forEach((target) => {
  renderExpandableList(target, data.service, { prefix: "service" });
});

document.querySelectorAll("[data-projects]").forEach((target) => {
  renderExpandableList(target, data.projects, { prefix: "project" });
});

document.querySelectorAll("[data-skills]").forEach((target) => {
  renderTags(target, data.skills);
});

document.querySelectorAll("[data-awards]").forEach((target) => {
  renderTags(target, data.awards);
});

document.querySelectorAll("[data-resume-download]").forEach((target) => {
  if (!data.resumeDownload) {
    target.hidden = true;
    return;
  }
  target.innerHTML = `<a class="button" href="${escapeHtml(data.resumeDownload)}">Download resume PDF</a>`;
});

document.addEventListener("click", (event) => {
  const toggle = event.target.closest(".detail-toggle");
  if (!toggle) return;
  const details = document.getElementById(toggle.getAttribute("aria-controls"));
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  toggle.textContent = expanded ? "View details" : "Hide details";
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
