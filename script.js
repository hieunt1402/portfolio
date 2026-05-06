const App = (() => {
  const state = {
    lang: localStorage.getItem("portfolio-lang") || "vi",
    data: null,
  };

  const els = {};

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const t = (value) => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    return value[state.lang] ?? value.vi ?? value.en ?? "";
  };

  const iconMap = {
    email: "fa-solid fa-envelope",
    github: "fa-brands fa-github",
    linkedin: "fa-brands fa-linkedin",
    location: "fa-solid fa-location-dot",
  };

  async function loadData() {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Cannot load data.json: ${response.status}`);
    }
    state.data = await response.json();
  }

  function cacheElements() {
    Object.assign(els, {
      brandName: $("#brand-name"),
      brandRole: $("#brand-role"),
      navList: $("#nav-list"),
      langToggle: $("#lang-toggle"),
      menuToggle: $("#menu-toggle"),
      siteNav: $("#site-nav"),
      heroGreeting: $("#hero-greeting"),
      heroName: $("#hero-name"),
      heroRole: $("#hero-role"),
      heroTagline: $("#hero-tagline"),
      heroActions: $("#hero-actions"),
      heroMeta: $("#hero-meta"),
      heroPanelLabel: $("#hero-panel-label"),
      heroStats: $("#hero-stats"),
      aboutKicker: $("#about-kicker"),
      aboutTitle: $("#about-title"),
      aboutDescription: $("#about-description"),
      aboutContent: $("#about-content"),
      focusTitle: $("#focus-title"),
      focusList: $("#focus-list"),
      skillsKicker: $("#skills-kicker"),
      skillsTitle: $("#skills-title"),
      skillsDescription: $("#skills-description"),
      skillsGrid: $("#skills-grid"),
      projectsKicker: $("#projects-kicker"),
      projectsTitle: $("#projects-title"),
      projectsDescription: $("#projects-description"),
      projectsGrid: $("#projects-grid"),
      projectsGhostLink: $("#projects-ghost-link"),
      contactKicker: $("#contact-kicker"),
      contactTitle: $("#contact-title"),
      contactDescription: $("#contact-description"),
      contactActions: $("#contact-actions"),
      contactDetails: $("#contact-details"),
      footerText: $("#footer-text"),
      backToTop: $("#back-to-top"),
      imageModal: $("#image-modal"),
      modalClose: $("#modal-close"),
      modalImage: $("#modal-image"),
      modalCaption: $("#modal-caption"),
    });
  }

  function renderMeta() {
    const { site, profile } = state.data;
    document.documentElement.lang = state.lang;
    document.title = t(site.title);
    els.brandName.textContent = profile.name;
    els.brandRole.textContent = t(profile.role);
    els.langToggle.textContent = state.lang === "vi" ? "EN" : "VI";
  }

  function renderNav() {
    const { ui } = state.data;
    els.navList.innerHTML = ui.navigation
      .map(
        (item) => `
          <li>
            <a href="#${item.href}" data-nav-link>${t(item.label)}</a>
          </li>
        `
      )
      .join("");
  }

  function renderHero() {
    const { ui, profile, stats } = state.data;

    els.heroGreeting.textContent = t(profile.greeting);
    els.heroName.textContent = profile.name;
    els.heroRole.textContent = t(profile.role);
    els.heroTagline.innerHTML = t(profile.tagline);
    els.heroPanelLabel.textContent = t(ui.heroPanelLabel);

    els.heroActions.innerHTML = `
      <a class="btn btn-primary" href="#projects">
        <i class="fa-solid fa-diagram-project"></i>
        <span>${t(ui.buttons.viewProjects)}</span>
      </a>
      <a class="btn btn-secondary" href="#contact">
        <i class="fa-solid fa-paper-plane"></i>
        <span>${t(ui.buttons.contactMe)}</span>
      </a>
      <a class="btn btn-tertiary" href="${profile.socials.github}" target="_blank" rel="noreferrer noopener">
        <i class="fa-brands fa-github"></i>
        <span>${t(ui.buttons.viewGithub)}</span>
      </a>
    `;

    els.heroMeta.innerHTML = profile.highlights
      .map((item) => `<li>${t(item)}</li>`)
      .join("");

    els.heroStats.innerHTML = stats
      .map(
        (item) => `
          <div class="stat-item">
            <strong>${item.value}</strong>
            <span>${t(item.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderAbout() {
    const { ui, about } = state.data;

    els.aboutKicker.textContent = t(ui.about.kicker);
    els.aboutTitle.textContent = t(ui.about.title);
    els.aboutDescription.textContent = t(ui.about.description);

    els.aboutContent.innerHTML = `
      <div class="about-body">
        ${about.paragraphs.map((paragraph) => `<p>${t(paragraph)}</p>`).join("")}
      </div>
    `;

    els.focusTitle.textContent = t(about.focusTitle);
    els.focusList.innerHTML = about.focusItems
      .map(
        (item) => `
          <li>
            <i class="fa-solid fa-circle-check"></i>
            <span>${t(item)}</span>
          </li>
        `
      )
      .join("");
  }

  function renderSkills() {
    const { ui, skills } = state.data;

    els.skillsKicker.textContent = t(ui.skills.kicker);
    els.skillsTitle.textContent = t(ui.skills.title);
    els.skillsDescription.textContent = t(ui.skills.description);

    els.skillsGrid.innerHTML = skills
      .map(
        (skill) => `
          <article class="card skill-card">
            <div class="skill-icon"><i class="${skill.icon}"></i></div>
            <h3>${t(skill.title)}</h3>
            <ul class="skill-list">
              ${skill.items.map((item) => `<li>${t(item)}</li>`).join("")}
            </ul>
          </article>
        `
      )
      .join("");
  }

  function createExternalLink(href, label, iconClass, buttonClass = "btn btn-secondary") {
    return `
      <a class="${buttonClass}" href="${href}" target="_blank" rel="noreferrer noopener">
        <i class="${iconClass}"></i>
        <span>${label}</span>
      </a>
    `;
  }

  function projectLinkButtons(project) {
    const buttons = [];
    const repoLabel = t(state.data.ui.buttons.viewRepo);
    const demoLabel = t(state.data.ui.buttons.viewDemo);

    if (project.links?.repo) {
      buttons.push(createExternalLink(project.links.repo, repoLabel, "fa-brands fa-github", "btn btn-secondary"));
    }

    if (project.links?.demo) {
      buttons.push(
        createExternalLink(
          project.links.demo,
          demoLabel,
          "fa-solid fa-arrow-up-right-from-square",
          "btn btn-tertiary"
        )
      );
    }

    return buttons.join("");
  }

  function renderProjects() {
    const { ui, projects } = state.data;

    els.projectsKicker.textContent = t(ui.projects.kicker);
    els.projectsTitle.textContent = t(ui.projects.title);
    els.projectsDescription.textContent = t(ui.projects.description);
    els.projectsGhostLink.textContent = t(ui.projects.ghostLink);

    els.projectsGrid.innerHTML = projects
      .map(
        (project) => `
          <article class="card project-card">
            <div class="project-media">
              <button
                type="button"
                class="project-image-trigger"
                data-image="${project.image}"
                data-caption="${t(project.title)}"
              >
                <img src="${project.image}" alt="${t(project.title)}" loading="lazy" />
              </button>
            </div>

            <div class="project-header">
              <div>
                <span class="project-badge">${t(project.badge)}</span>
                <h3>${t(project.title)}</h3>
              </div>
            </div>

            <p class="project-summary">${t(project.summary)}</p>

            <div class="project-details">
              <div class="project-detail">
                <strong>${t(ui.projectLabels.problem)}</strong>
                <p>${t(project.problem)}</p>
              </div>
              <div class="project-detail">
                <strong>${t(ui.projectLabels.solution)}</strong>
                <p>${t(project.solution)}</p>
              </div>
              <div class="project-detail">
                <strong>${t(ui.projectLabels.impact)}</strong>
                <p>${t(project.impact)}</p>
              </div>
            </div>

            <ul class="project-stack">
              ${project.stack.map((item) => `<li>${item}</li>`).join("")}
            </ul>

            <div class="project-actions">
              ${projectLinkButtons(project)}
            </div>
          </article>
        `
      )
      .join("");

    $$(".project-image-trigger").forEach((button) => {
      button.addEventListener("click", () =>
        openImageModal(button.dataset.image, button.dataset.caption)
      );
    });
  }

  function renderContact() {
    const { ui, profile, contact } = state.data;

    els.contactKicker.textContent = t(ui.contact.kicker);
    els.contactTitle.textContent = t(ui.contact.title);
    els.contactDescription.textContent = t(ui.contact.description);

    els.contactActions.innerHTML = `
      <a class="btn btn-primary" href="mailto:${profile.email}">
        <i class="fa-solid fa-envelope"></i>
        <span>${t(ui.buttons.sendEmail)}</span>
      </a>
      <a class="btn btn-secondary" href="${profile.socials.linkedin}" target="_blank" rel="noreferrer noopener">
        <i class="fa-brands fa-linkedin"></i>
        <span>${t(ui.buttons.connectLinkedin)}</span>
      </a>
    `;

    const details = [
      {
        type: "email",
        label: t(contact.details.email),
        value: profile.email,
        href: `mailto:${profile.email}`,
      },
      {
        type: "github",
        label: "GitHub",
        value: profile.socials.github,
        href: profile.socials.github,
      },
      {
        type: "linkedin",
        label: "LinkedIn",
        value: profile.socials.linkedin,
        href: profile.socials.linkedin,
      },
      {
        type: "location",
        label: t(contact.details.location),
        value: t(profile.location),
      },
    ];

    els.contactDetails.innerHTML = `
      <ul class="contact-list">
        ${details
          .map((item) => {
            const content = item.href
              ? item.href.startsWith("mailto:")
                ? `<a href="${item.href}">${item.value}</a>`
                : `<a href="${item.href}" target="_blank" rel="noreferrer noopener">${item.value}</a>`
              : `<span>${item.value}</span>`;

            return `
              <li class="contact-detail">
                <i class="${iconMap[item.type] || "fa-solid fa-link"}"></i>
                <div>
                  <strong>${item.label}</strong>
                  ${content}
                </div>
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const { ui, profile } = state.data;

    els.footerText.textContent = t(ui.footer)
      .replace("{year}", year)
      .replace("{name}", profile.name);

    els.backToTop.textContent = t(ui.backToTop);
  }

  function renderAll() {
    renderMeta();
    renderNav();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderContact();
    renderFooter();
    updateActiveNav();
  }

  function toggleLanguage() {
    state.lang = state.lang === "vi" ? "en" : "vi";
    localStorage.setItem("portfolio-lang", state.lang);
    renderAll();
  }

  function openImageModal(src, caption) {
    els.modalImage.src = src;
    els.modalCaption.textContent = caption;

    if (typeof els.imageModal.showModal === "function") {
      els.imageModal.showModal();
    }
  }

  function closeImageModal() {
    if (els.imageModal.open) {
      els.imageModal.close();
    }
  }

  function bindEvents() {
    els.langToggle.addEventListener("click", toggleLanguage);

    els.menuToggle.addEventListener("click", () => {
      const isOpen = els.siteNav.classList.toggle("is-open");
      els.menuToggle.classList.toggle("is-open", isOpen);
      els.menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      const clickedLink = event.target.closest("[data-nav-link]");
      const clickedInsideMenu =
        event.target.closest(".site-nav") || event.target.closest(".menu-toggle");

      if (clickedLink) {
        els.siteNav.classList.remove("is-open");
        els.menuToggle.classList.remove("is-open");
        els.menuToggle.setAttribute("aria-expanded", "false");
      }

      if (!clickedInsideMenu && window.innerWidth <= 820) {
        els.siteNav.classList.remove("is-open");
        els.menuToggle.classList.remove("is-open");
        els.menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    els.modalClose.addEventListener("click", closeImageModal);

    els.imageModal.addEventListener("click", (event) => {
      if (event.target === els.imageModal) {
        closeImageModal();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeImageModal();
    });

    window.addEventListener("scroll", updateActiveNav, { passive: true });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) {
        els.siteNav.classList.remove("is-open");
        els.menuToggle.classList.remove("is-open");
        els.menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function updateActiveNav() {
    const sections = ["home", "about", "skills", "projects", "contact"];
    const offset = 140;
    let currentSection = "home";

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (!section) continue;
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) currentSection = sectionId;
    }

    $$("[data-nav-link]").forEach((link) => {
      const target = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("is-active", target === currentSection);
    });
  }

  function renderError(error) {
    console.error(error);

    document.body.innerHTML = `
      <main style="min-height:100vh;display:grid;place-items:center;padding:1.5rem;background:#081120;color:#e2e8f0;font-family:Inter,sans-serif;">
        <div style="max-width:680px;padding:1.5rem;border-radius:24px;border:1px solid rgba(148,163,184,0.18);background:rgba(15,23,42,0.84)">
          <h1 style="margin-top:0">Không thể tải portfolio</h1>
          <p>Hãy kiểm tra lại file <strong>data.json</strong> hoặc đường dẫn tài nguyên.</p>
          <pre style="white-space:pre-wrap;color:#94a3b8">${String(error.message || error)}</pre>
        </div>
      </main>
    `;
  }

  async function init() {
    try {
      cacheElements();
      await loadData();
      renderAll();
      bindEvents();
    } catch (error) {
      renderError(error);
    }
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);