// Smoke test: if you see this in the browser console, JS is loading correctly.
console.log("Kadence Child JS loaded");

// Place your custom JS below this line.

// HERO: reveal headline on first view
(function () {
  const title = document.querySelector('.kc-hero-title');
  if (!title) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        title.classList.add('kc-revealed');
        obs.disconnect();
      }
    });
  }, { threshold: .4 });
  obs.observe(title);
})();
