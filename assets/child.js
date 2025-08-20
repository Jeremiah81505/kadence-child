// Smoke test: if you see this in the browser console, JS is loading correctly.
console.log("Kadence Child JS loaded");

// ===============================
// HERO: reveal headline on first view
// ===============================
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
  }, { threshold: 0.4 });

  obs.observe(title);
})();

// ===============================
// 3D RING LOGO CAROUSEL
// ===============================
(function () {
  const ring = document.querySelector('.kc-ring');
  if (!ring) return;

  const tiles = Array.from(ring.querySelectorAll('.kc-tile'));
  const N = tiles.length;
  const radius = Number(ring.dataset.radius) || 360;  // px
  const speed  = Number(ring.dataset.speed)  || 22;   // seconds per revolution

  ring.style.setProperty('--kc-speed', `${speed}s`);

  // Position tiles in a 3D ring
  tiles.forEach((tile, i) => {
    const theta = (360 / N) * i;
    tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
  });

  // Autoplay
  let spinning = true;
  ring.classList.add('kc-spin');

  // Pause on hover / resume on leave
  const stage = ring.closest('.kc-ring-stage');
  stage.addEventListener('mouseenter', () => {
    ring.style.animationPlayState = 'paused';
    spinning = false;
  });
  stage.addEventListener('mouseleave', () => {
    ring.style.animationPlayState = 'running';
    spinning = true;
  });

  // Drag to rotate (mouse/touch)
  let dragging = false, startX = 0, startRot = 0, currentRot = 0;

  const setRot = (deg) => {
    ring.style.animation = 'none';
    ring.style.transform = `rotateY(${deg}deg)`;
  };

  const onDown = (x) => {
    dragging = true;
    startX = x;
    startRot = currentRot;
    ring.style.animationPlayState = 'paused';
  };

  const onMove = (x) => {
    if (!dragging) return;
    const delta = (x - startX) * 0.4; // sensitivity
    currentRot = startRot - delta;
    setRot(currentRot);
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    if (spinning) ring.classList.add('kc-spin');
    ring.style.animationPlayState = 'running';
  };

  // Mouse
  stage.addEventListener('mousedown', e => onDown(e.clientX));
  window.addEventListener('mousemove', e => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  // Touch
  stage.addEventListener('touchstart', e => onDown(e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
  stage.addEventListener('touchend', onUp);
})();
