const body = document.body;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const navLinks = document.querySelectorAll('a[href^="#"]');
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fieldCarousel = document.querySelector("[data-field-carousel]");
const contactForm = document.querySelector("[data-contact-form]");

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

if (fieldCarousel) {
  const track = fieldCarousel.querySelector(".field-track");
  const prev = fieldCarousel.querySelector("[data-carousel-prev]");
  const next = fieldCarousel.querySelector("[data-carousel-next]");
  const slides = [...fieldCarousel.querySelectorAll(".field-slide")];

  const getStep = () => {
    const firstSlide = slides[0];
    if (!firstSlide || !track) return 0;
    const gap = parseFloat(window.getComputedStyle(track).columnGap || "0");
    return firstSlide.getBoundingClientRect().width + gap;
  };

  prev?.addEventListener("click", () => {
    track?.scrollBy({ left: -getStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });

  next?.addEventListener("click", () => {
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    if (track.scrollLeft >= maxScroll) {
      track.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    track.scrollBy({ left: getStep(), behavior: reduceMotion ? "auto" : "smooth" });
  });
}

const setContactNeed = (need) => {
  if (!contactForm || !need) return;
  const normalized = {
    formation: "Formation & RH",
    ia: "Formation humain-IA",
    diagnostic: "Diagnostic humain-IA",
    cooperation: "Design de coopération humain-IA",
    design: "Design de coopération humain-IA",
  }[need] || need;

  const radio = [...contactForm.querySelectorAll('input[name="need"]')]
    .find((input) => input.value === normalized);

  if (radio) radio.checked = true;
};

document.querySelectorAll("[data-need]").forEach((link) => {
  link.addEventListener("click", () => setContactNeed(link.dataset.need));
});

if (contactForm) {
  const status = contactForm.querySelector("[data-form-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const trap = contactForm.querySelector('input[name="website"]');
    if (trap?.value) {
      status.textContent = "Votre message n’a pas pu être préparé.";
      status.classList.remove("is-success");
      status.classList.add("is-error");
      return;
    }

    if (!contactForm.checkValidity()) {
      status.textContent = "Merci de compléter les champs obligatoires avant de préparer le message.";
      status.classList.remove("is-success");
      status.classList.add("is-error");
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`SJ Conseil - ${data.get("need")}`);
    const bodyLines = [
      `Besoin : ${data.get("need")}`,
      `Nom : ${data.get("name")}`,
      `E-mail : ${data.get("email")}`,
      `Organisation : ${data.get("organization") || "Non renseignée"}`,
      "",
      "Message :",
      data.get("message"),
    ];

    status.textContent = "Votre messagerie va s’ouvrir avec un message prérempli. L’envoi restera à valider par vous.";
    status.classList.remove("is-error");
    status.classList.add("is-success");
    window.location.href = `mailto:stephanie@sjconseil.fr?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  });
}

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
