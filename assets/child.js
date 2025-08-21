console.log("Kadence Child JS loaded");

// HERO reveal (unchanged)
(function () {
  const title = document.querySelector('.kc-hero-title');
  if (!title) return;
  const obs = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ title.classList.add('kc-revealed'); obs.disconnect(); }}), {threshold:.4});
  obs.observe(title);
})();

// ===== 3D RING — JS-driven rotation with “face camera” cards =====
(function () {
  const GAP = 28;               // spacing between tiles (px)
  const MIN_R = 360, MAX_R = 720;
  const TILT = 10;              // degrees around X axis

  const wrapAsCard = (tile) => {
    // ensure we have .kc-card wrapper (so we can counter-rotate logos)
    if (tile.querySelector('.kc-card')) return tile.querySelector('.kc-card');
    const card = document.createElement('div');
    card.className = 'kc-card';
    while (tile.firstChild) card.appendChild(tile.firstChild);
    tile.appendChild(card);
    return card;
  };

  const calcRadius = (ring) => {
    // Use the card widths so spacing matches what the user sees
    const cards = [...ring.querySelectorAll('.kc-card')];
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const total = widths.reduce((a,b)=>a+b,0) + GAP * widths.length;
    return Math.max(MIN_R, Math.min(Math.ceil(total / (2*Math.PI) * 1.05), MAX_R));
  };

  const initRing = (ring, idx) => {
    const stage = ring.closest('.kc-ring-stage');
    if (!stage) return;

    // Prepare tiles + cards
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    const cards = tiles.map(wrapAsCard);
    const N = tiles.length || 1;

    // Timing
    const speed = Number(ring.dataset.speed) || 24; // seconds per revolution
    let running = true;
    let angle = 0;              // current Y rotation in deg
    let offset = 0;             // user drag offset (deg)
    let last = performance.now();

    // Compute a safe radius from real sizes
    const radius = calcRadius(ring);
    // Stage height scaled to radius
    stage.style.height = Math.max(380, Math.min(560, Math.round(radius * 0.9))) + 'px';

    // Place tiles around ring (Y), translateZ(radius)
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.dataset.theta = theta;  // keep for later
      tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
      tile.style.transformStyle = 'preserve-3d';
    });

    // Controls: pause on hover
    stage.addEventListener('mouseenter', () => { running = false; });
    stage.addEventListener('mouseleave', () => { running = true; last = performance.now(); });

    // Controls: drag to scrub
    let dragging=false, sx=0, start=0;
    const onDown = x => { dragging=true; sx=x; start=offset; running=false; };
    const onMove = x => { if(!dragging) return; offset = start - (x - sx) * 0.4; };
    const onUp   = () => { if(!dragging) return; dragging=false; running=true; last = performance.now(); };
    stage.addEventListener('mousedown', e=>onDown(e.clientX));
    window.addEventListener('mousemove', e=>onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
    stage.addEventListener('touchstart', e=>onDown(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchmove',  e=>onMove(e.touches[0].clientX),  {passive:true});
    stage.addEventListener('touchend', onUp);

    // RAF loop — rotate ring and counter-rotate cards so logos always face camera
    const apply = () => {
      ring.style.transform = `translate(-50%,-50%) rotateX(${TILT}deg) rotateY(${angle + offset}deg)`;
      // counter-rotate each card by the ring angle so it faces camera
      cards.forEach(card => { card.style.transform = `rotateY(${-(angle + offset)}deg)`; });
    };

    const tick = (t) => {
      if (running) {
        const dt = (t - last) / 1000;  // seconds
        angle = (angle + (360 / speed) * dt) % 360;
      }
      last = t;
      apply();
      requestAnimationFrame(tick);
    };

    // Start
    apply();
    requestAnimationFrame(tick);
    console.log('[kc-ring] initialized', { index: idx, tiles: N, radius, speed });
  };

  const ready = (root, cb) => {
    const imgs = [...root.querySelectorAll('img')];
    if (!imgs.length) return cb();
    let left = imgs.length; const done = () => { if(--left===0) cb(); };
    imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1500);
  };

  const initAll = () => {
    const rings = [...document.querySelectorAll('.kc-ring')];
    console.log(`[kc-ring] rings found: ${rings.length}`);
    rings.forEach((ring, i) => ready(ring, () => initRing(ring, i)));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initAll(); setTimeout(initAll, 200); });
  } else { initAll(); setTimeout(initAll, 200); }
})();

