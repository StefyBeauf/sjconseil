const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const navLinks = document.querySelectorAll('a[href^="#"]');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const expertiseExplorer = document.querySelector("[data-expertise-explorer]");

if (expertiseExplorer) {
  const expertiseButtons = [...expertiseExplorer.querySelectorAll("[data-expertise-target]")];
  const canHover = window.matchMedia("(hover: hover)").matches;

  const setActiveExpertise = (targetId) => {
    expertiseButtons.forEach((button) => {
      const isActive = button.dataset.expertiseTarget === targetId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const clearActiveExpertise = () => {
    expertiseButtons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
  };

  expertiseButtons.forEach((button) => {
    const targetId = button.dataset.expertiseTarget;

    button.addEventListener("mouseenter", () => setActiveExpertise(targetId));
    button.addEventListener("mouseleave", clearActiveExpertise);
    button.addEventListener("focus", () => setActiveExpertise(targetId));
    button.addEventListener("blur", clearActiveExpertise);
    button.addEventListener("click", () => {
      if (canHover) return;
      const isAlreadyActive = button.classList.contains("is-active");
      if (isAlreadyActive) {
        clearActiveExpertise();
      } else {
        setActiveExpertise(targetId);
      }
    });
  });
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", targetId);
  });
});

const revealItems = document.querySelectorAll("[data-reveal]");

if (reduceMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const desktopLinks = [...document.querySelectorAll(".desktop-nav a")];

if ("IntersectionObserver" in window && sections.length && desktopLinks.length) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeId = `#${entry.target.id}`;

        desktopLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === activeId);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => activeObserver.observe(section));
}
