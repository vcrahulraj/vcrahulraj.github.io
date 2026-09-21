(() => {
  "use strict";

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const header = document.querySelector("[data-header]");

  const setNavigationState = (open) => {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector(".sr-only").textContent = open ? "Close navigation" : "Open navigation";
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  navToggle?.addEventListener("click", () => {
    setNavigationState(navToggle.getAttribute("aria-expanded") !== "true");
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNavigationState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavigationState(false);
  });

  const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const currentYear = document.querySelector("[data-year]");
  if (currentYear) currentYear.textContent = `© ${new Date().getFullYear()}`;

  const config = window.PORTFOLIO_CONFIG ?? {};
  const username = String(config.GITHUB_USERNAME ?? "").trim();
  const hasUsername = Boolean(username);

  const markPending = (link, label, text) => {
    link.classList.add("is-pending");
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", "This link is not configured yet");
    if (label) label.textContent = text;
    link.addEventListener("click", (event) => event.preventDefault());
  };

  document.querySelectorAll("[data-repo-link]").forEach((link) => {
    const label = link.querySelector("[data-repo-label]");
    const repositoryKey = link.dataset.repoLink;
    const repository = config.PROJECT_REPOSITORIES?.[repositoryKey];

    if (!hasUsername || !repository) {
      markPending(link, label, "Repository link pending");
      return;
    }

    link.href = `https://github.com/${encodeURIComponent(username)}/${encodeURIComponent(repository)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (label) label.textContent = "View repository";
  });

  const profileLink = document.querySelector("[data-github-profile]");
  if (profileLink) {
    const label = profileLink.querySelector("[data-profile-label]");
    if (hasUsername) {
      profileLink.href = `https://github.com/${encodeURIComponent(username)}`;
      profileLink.target = "_blank";
      profileLink.rel = "noopener noreferrer";
      if (label) label.textContent = `github.com/${username}`;
    } else {
      markPending(profileLink, label, "GitHub profile pending");
    }
  }
})();
