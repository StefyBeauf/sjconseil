const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const navLinks = document.querySelectorAll('a[href^="#"]');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const expertiseData = [
  {
    number: "01",
    title: "Talents et recrutement",
    text: "Structurer les pratiques RH, professionnaliser le recrutement et accompagner les talents.",
    keywords: "Sourcing · Marque employeur · Relations écoles · Entretien · Onboarding",
  },
  {
    number: "02",
    title: "Compétences et transmission",
    text: "Concevoir et animer des formations actives, utiles et adaptées aux publics.",
    keywords: "Ingénierie pédagogique · GEPP · Cas pratiques · Évaluation · Supports",
  },
  {
    number: "03",
    title: "Insertion professionnelle",
    text: "Aider les étudiants et professionnels à clarifier leur projet et valoriser leur parcours.",
    keywords: "CV · LinkedIn · Entretien · Pitch · Posture professionnelle",
  },
  {
    number: "04",
    title: "IA appliquée aux usages métier",
    text: "Utiliser l’IA concrètement, du niveau débutant aux premiers workflows automatisés.",
    keywords: "ChatGPT · Prompts · Assistants · Synthèse · Automatisation simple",
  },
  {
    number: "05",
    title: "Transformation RH",
    text: "Accompagner l’évolution des outils, des postures et des pratiques.",
    keywords: "Digitalisation RH · Conduite du changement · QVCT · RSE RH",
  },
];

const expertiseTabs = document.querySelectorAll("[data-expertise-tabs] .expertise-tab");
const expertiseNumber = document.querySelector("[data-expertise-number]");
const expertiseTitle = document.querySelector("[data-expertise-title]");
const expertiseText = document.querySelector("[data-expertise-text]");
const expertiseKeywords = document.querySelector("[data-expertise-keywords]");

const setExpertise = (index) => {
  const item = expertiseData[index];
  if (!item || !expertiseNumber || !expertiseTitle || !expertiseText || !expertiseKeywords) return;

  expertiseTabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === index;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  expertiseNumber.textContent = item.number;
  expertiseTitle.textContent = item.title;
  expertiseText.textContent = item.text;
  expertiseKeywords.textContent = item.keywords;
};

expertiseTabs.forEach((tab) => {
  const index = Number(tab.dataset.index);
  tab.addEventListener("click", () => setExpertise(index));
  tab.addEventListener("mouseenter", () => setExpertise(index));
});

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
