// Smoke test
console.log("Kadence Child JS loaded");

// HERO reveal (unchanged)
(function () {
  const title = document.querySelector('.kc-hero-title');
  if (!title) return;
  const obs = new IntersectionObserver((es)=>es.forEach(e=>{
    if(e.isIntersecting){ title.classList.add('kc-revealed'); obs.disconnect(); }
  }), {threshold:.4});
  obs.observe(title);
})();

// ===== 3D RING — true circle, per-tile face-camera, auto radius =====
(function () {
  const GAP   = 28;               // px spacing between cards
  const TILT  = 12;               // deg X-tilt for depth
  const MIN_R = 300, MAX_R = 640; // clamp radius

  // Ensure each .kc-tile contains a .kc-card wrapper (for shadows/sizing)
  const wrapAsCard = (tile) => {
    let card = tile.querySelector('.kc-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'kc-card';
      while (tile.firstChild) card.appendChild(tile.firstChild);
      tile.appendChild(card);
    }
    return card;
  };

  // Compute a radius from real rendered widths, then tighten it a bit
  const calcRadius = (ring) => {
    const cards = [...ring.querySelectorAll('.kc-card')];
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const total  = widths.reduce((a,b)=>a+b,0) + GAP * widths.length;
    const rawR   = total / (2 * Math.PI);  // circumference = 2πr
    const tightR = rawR * 0.8;             // tighten so we see a fuller circle
    return Math.max(MIN_R, Math.min(Math.ceil(tightR), MAX_R));
  };

  const initRing = (ring, idx) => {
    const stage = ring.closest('.kc-ring-stage');
    if (!stage) return;

    // Prepare tiles/cards
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    const cards = tiles.map(wrapAsCard);
    const N     = tiles.length || 1;

    // Timing
    const speed = Number(ring.dataset.speed) || 24; // seconds per revolution
    let running = true;
    let angle   = 0;   // global Y angle
    let offset  = 0;   // user drag offset
    let last    = performance.now();

    // Radius + stage height
    const radius = calcRadius(ring);
    stage.style.height = Math.max(380, Math.min(560, Math.round(radius * 0.9))) + 'px';

    // Place tiles evenly around the ring and store theta on each tile
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.dataset.theta = theta;
      tile.style.transformStyle = 'preserve-3d';
      // true circular layout (no extra tilts here): each tile sits on the ring
      tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });

    // Interaction: pause on hover
    stage.addEventListener('mouseenter', () => { running = false; });
    stage.addEventListener('mouseleave', () => { running = true; last = performance.now(); });

    // Interaction: drag to scrub (mouse + touch)
    let dragging=false, sx=0, start=0;
    const onDown = x => { dragging=true; sx=x; start=offset; running=false; };
    const onMove = x => { if(!dragging) return; offset = start - (x - sx) * 0.4; };
    const onUp   = () => { if(!dragging) return; dragging=false; running=true; last=performance.now(); };
    stage.addEventListener('mousedown', e=>onDown(e.clientX));
    window.addEventListener('mousemove', e=>onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
    stage.addEventListener('touchstart', e=>onDown(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchmove',  e=>onMove(e.touches[0].clientX),  {passive:true});
    stage.addEventListener('touchend', onUp);

    // Render: rotate the ring, counter-rotate each CARD by (angle + theta)
    const apply = () => {
      ring.style.transform = `translate(-50%,-50%) rotateX(${TILT}deg) rotateY(${angle + offset}deg)`;
      cards.forEach(card => {
        const theta = Number(card.parentNode.dataset.theta || 0);
        // Counter the ring rotation + tile's own theta so faces camera
        card.style.transform = `rotateY(${-(angle + offset + theta)}deg)`;
      });
    };

    const tick = (t) => {
      if (running) {
        const dt = (t - last) / 1000;           // seconds since last frame
        angle = (angle + (360 / speed) * dt) % 360;
      }
      last = t;
      apply();
      requestAnimationFrame(tick);
    };

    apply();
    requestAnimationFrame(tick);
    console.log('[kc-ring] initialized', { index: idx, tiles: N, radius, speed });
  };

  // Wait for images so sizes are real before layout
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
