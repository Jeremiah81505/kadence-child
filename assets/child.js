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

// ===== 3D RING — FINAL BUNDLE =====
(function () {
  const GAP = 28, TIGHT = 0.72, MIN_R = 260, MAX_R = 640, TILT = 10;

  const ensureCard = (tile) => {
    let card = tile.querySelector('.kc-card');
    if (!card) {
      card = document.createElement('div');
      card.className = 'kc-card';
      while (tile.firstChild) card.appendChild(tile.firstChild);
      tile.appendChild(card);
    }
    return card;
  };

  const calcRadius = (ring) => {
    const cards = [...ring.querySelectorAll('.kc-card')];
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const circ   = widths.reduce((a,b)=>a+b,0) + GAP*widths.length;
    const r      = (circ / (2*Math.PI)) * TIGHT;
    return Math.max(MIN_R, Math.min(Math.round(r), MAX_R));
  };

  const layoutRing = (ring) => {
    const stage = ring.closest('.kc-ring-stage');
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    if (!tiles.length) return;
    tiles.forEach(ensureCard);
    const N = tiles.length;
    const radius = calcRadius(ring);
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.style.transform =
        `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });
    if (stage) {
      stage.style.height = Math.max(380, Math.min(560, Math.round(radius*0.9))) + 'px';
    }
    ring.style.animationPlayState = 'running';
    stage?.addEventListener('mouseenter', ()=> ring.style.animationPlayState = 'paused');
    stage?.addEventListener('mouseleave', ()=> ring.style.animationPlayState = 'running');

    // Drag scrub: temporarily stop CSS animation and rotate ring inline
    let dragging=false, sx=0, base=0;
    const apply = (deg) => ring.style.transform =
      `translate(-50%,-50%) rotateX(${TILT}deg) rotateY(${deg}deg)`;
    const down = x => { dragging=true; sx=x; base=0; ring.style.animation='none'; };
    const move = x => { if(!dragging) return; const d = (x - sx) * -0.35; apply(base + d); };
    const up   = () => { if(!dragging) return; dragging=false; ring.style.animation=''; };
    stage?.addEventListener('mousedown', e=>down(e.clientX));
    window.addEventListener('mousemove', e=>move(e.clientX));
    window.addEventListener('mouseup', up);
    stage?.addEventListener('touchstart', e=>down(e.touches[0].clientX), {passive:true});
    stage?.addEventListener('touchmove',  e=>move(e.touches[0].clientX),  {passive:true});
    stage?.addEventListener('touchend', up);

    console.log('[kc-ring] laid out', {tiles: N, radius});
  };

  const ready = (root, cb) => {
    const imgs = [...root.querySelectorAll('img')];
    if (!imgs.length) return cb();
    let left = imgs.length; const done = ()=>{ if(--left===0) cb(); };
    imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1200);
  };

  const init = () => {
    const rings = [...document.querySelectorAll('.kc-ring')];
    if (!rings.length) return;
    rings.forEach(ring => ready(ring, ()=> layoutRing(ring)));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // short verify helper
  window.kcRingVerify = () => {
    const rings = [...document.querySelectorAll('.kc-ring')];
    return rings.map(r => ({ tiles: r.querySelectorAll('.kc-tile').length }));
  };
})();

// ===== 3D RING — FINAL BUNDLE (JS, face-camera) =====
(function () {
  const GAP   = 24;     // spacing between cards
  const TIGHT = 0.72;   // tighter ring → more circle visible (0.68 tighter, 0.80 looser)
  const MIN_R = 260, MAX_R = 620;
  const TILT  = 8;      // must match CSS rotateX
  const SPEED = 28;     // seconds per revolution (fallback)

  const ensureCard = (tile) => {
    let card = tile.querySelector('.kc-card');
    if (!card) {
      card = document.createElement('div'); card.className = 'kc-card';
      while (tile.firstChild) card.appendChild(tile.firstChild);
      tile.appendChild(card);
    }
    return card;
  };

  const calcRadius = (ring) => {
    const cards = [...ring.querySelectorAll('.kc-card')];
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const circ   = widths.reduce((a,b)=>a+b,0) + GAP*widths.length;
    const r      = (circ / (2*Math.PI)) * TIGHT;
    return Math.max(MIN_R, Math.min(Math.round(r), MAX_R));
  };

  const layoutRing = (ring) => {
    const stage = ring.closest('.kc-ring-stage');
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    if (!tiles.length) return;
    tiles.forEach(ensureCard);
    const N = tiles.length;
    const radius = calcRadius(ring);

    // Distribute evenly + store theta on each tile
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.dataset.theta = theta;
      tile.style.transform =
        `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });

    // Stage height based on radius
    if (stage) stage.style.height = Math.max(420, Math.min(600, Math.round(radius*0.95))) + 'px';

    // --- JS ANIMATION (face camera) ---
    // Kill CSS animation so we control the angle
    ring.style.animation = 'none';

    let running = true;
    let angle   = 0; // current Y angle
    let last    = performance.now();
    const speed = Number(ring.dataset.speed) || SPEED; // seconds per revolution

    const cards = tiles.map(t => t.querySelector('.kc-card'));

    const render = (t) => {
      if (running) {
        const dt = (t - last) / 1000;
        angle = (angle + (360/speed) * dt) % 360;
      }
      last = t;

      ring.style.transform =
        `translate(-50%,-50%) rotateX(${TILT}deg) rotateY(${angle}deg)`;

      // Counter-rotate each card so logos always face the viewer
      tiles.forEach((tile, i) => {
        const theta = Number(tile.dataset.theta) || 0;
        const card  = cards[i];
        if (card) card.style.transform = `rotateY(${-(angle + theta)}deg)`;
      });

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Hover pause/resume
   stage?.addEventListener('mouseenter', ()=> running = false);
    stage?.addEventListener('mouseleave', ()=> { running = true; last = performance.now(); });

    // Drag scrub (pause while dragging, set angle directly)
    let dragging=false, sx=0, start=0;
    const down = (x)=>{ dragging=true; sx=x; start=angle; running=false; };
    const move = (x)=>{ if(!dragging) return; angle = start - (x - sx)*0.35; };
    const up   = ()=>{ if(!dragging) return; dragging=false; running=true; last = performance.now(); };
    stage?.addEventListener('mousedown', e=>down(e.clientX));
    window.addEventListener('mousemove', e=>move(e.clientX));
    window.addEventListener('mouseup', up);
    stage?.addEventListener('touchstart', e=>down(e.touches[0].clientX), {passive:true});
    stage?.addEventListener('touchmove',  e=>move(e.touches[0].clientX),  {passive:true});
    stage?.addEventListener('touchend', up);

    console.log('[kc-ring] js-spin face-camera on', { tiles: N, radius, speed });
  };

  const imagesReady = (root, cb) => {
    const imgs = [...root.querySelectorAll('img')];
    if (!imgs.length) return cb();
    let left = imgs.length; const done = ()=>{ if(--left===0) cb(); };
    imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1200);
  };

  const init = () => {
    const rings = [...document.querySelectorAll('.kc-ring')];
    rings.forEach(ring => imagesReady(ring, ()=> layoutRing(ring)));
  };
  const debounce = (fn,ms)=>{let t;return()=>{clearTimeout(t);t=setTimeout(fn,ms)}};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('resize', debounce(init, 250));
})();


