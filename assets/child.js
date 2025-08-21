// Smoke test
console.log("Kadence Child JS loaded");

// HERO: reveal headline on first view
(function () {
  const title = document.querySelector('.kc-hero-title');
  if (!title) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { title.classList.add('kc-revealed'); obs.disconnect(); } });
  }, { threshold: 0.4 });
  obs.observe(title);
})();

// ===== 3D RING LOGO CAROUSEL: robust init + diagnostics =====
(function () {
  const initRing = (ring, idx) => {
    const stage = ring.closest('.kc-ring-stage');
    if (!stage) { console.warn("[kc-ring] No .kc-ring-stage wrapper for ring", idx); return; }

    const tiles = Array.from(ring.querySelectorAll('.kc-tile'));
    const N = tiles.length;
    const radius = Number(ring.dataset.radius) || 360;  // px
    const speed  = Number(ring.dataset.speed)  || 22;   // seconds per rev
    ring.style.setProperty('--kc-speed', `${speed}s`);

    // Center base (CSS adds translate(-50%,-50%)), then lay out and face camera
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.style.transform =
        `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px) rotateY(${-theta}deg)`;
      tile.style.transformStyle = 'preserve-3d';
    });

    // Autoplay and hover pause
    let spinning = true;
    ring.classList.add('kc-spin');
    stage.addEventListener('mouseenter', () => { ring.style.animationPlayState = 'paused'; spinning = false; });
    stage.addEventListener('mouseleave', () => { ring.style.animationPlayState = 'running'; spinning = true; });

    // Drag to rotate
    let dragging = false, startX = 0, startRot = 0, currentRot = 0;
    const setRot = (deg) => { ring.style.animation = 'none'; ring.style.transform = `rotateY(${deg}deg)`; };
    const onDown = (x) => { dragging = true; startX = x; startRot = currentRot; ring.style.animationPlayState = 'paused'; };
    const onMove = (x) => { if (!dragging) return; const delta = (x - startX) * 0.4; currentRot = startRot - delta; setRot(currentRot); };
    const onUp   = () => { if (!dragging) return; dragging = false; if (spinning) ring.classList.add('kc-spin'); ring.style.animationPlayState = 'running'; };
    stage.addEventListener('mousedown', e => onDown(e.clientX));
    window.addEventListener('mousemove', e => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
    stage.addEventListener('touchstart', e => onDown(e.touches[0].clientX), { passive: true });
    stage.addEventListener('touchmove',  e => onMove(e.touches[0].clientX),  { passive: true });
    stage.addEventListener('touchend', onUp);

    console.log(`[kc-ring] initialized`, { index: idx, tiles: N, radius, speed });
  };

  const initAll = () => {
    const rings = Array.from(document.querySelectorAll('.kc-ring'));
   console.log(`[kc-ring] rings found: ${rings.length}`);
    if (!rings.length) return;
    rings.forEach((ring, i) => {
      // Wait for images to load so sizes don’t explode
      const imgs = Array.from(ring.querySelectorAll('img'));
      let pending = imgs.length;
      if (!pending) return initRing(ring, i);
      imgs.forEach(img => {
        if (img.complete) { if (--pending === 0) initRing(ring, i); }
        else img.addEventListener('load', () => { if (--pending === 0) initRing(ring, i); }, { once: true });
      });
      // Fallback in case some images never fire 'load'
      setTimeout(() => { if (pending > 0) initRing(ring, i); }, 1500);
    });
  };

  // Run on DOM ready and after a tick (for any lazy contents)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initAll(); setTimeout(initAll, 200); });
  } else {
    initAll(); setTimeout(initAll, 200);
  }
})();
