export function getMotionInitScript(): string {
  return `
(() => {
  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  function reveal(group) {
    group.querySelectorAll(":scope > *").forEach((child) => {
      child.style.opacity = "1";
      child.style.transform = "none";
    });
  }

  function hydrateMotion() {
    const groups = Array.from(document.querySelectorAll("[data-motion-stagger]"));

    if (reducedMotionQuery?.matches || !("IntersectionObserver" in window)) {
      groups.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const group = entry.target;
        const children = Array.from(group.querySelectorAll(":scope > *"));

        children.forEach((child, index) => {
          child.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              delay: index * 55,
              duration: 420,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "both",
            },
          );
        });

        group.setAttribute("data-motion-ready", "true");
        observer.unobserve(group);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    groups
      .filter((group) => group.getAttribute("data-motion-ready") !== "true")
      .forEach((group) => observer.observe(group));
  }

  if (!window.renoBlogHydrateMotion) {
    window.renoBlogHydrateMotion = hydrateMotion;
    document.addEventListener("DOMContentLoaded", hydrateMotion);
    document.addEventListener("astro:after-swap", hydrateMotion);
    reducedMotionQuery?.addEventListener?.("change", hydrateMotion);
  }

  window.renoBlogHydrateMotion();
})();
`.trim();
}
