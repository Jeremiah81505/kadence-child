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

// ===== Stable 3D ring (CSS spin; JS just lays out + controls) =====
(function () {
  const GAP=24, MIN_R=280, MAX_R=620, TILT=10; // tweakables

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

  const radiusFromWidths = (ring) => {
    const cards = [...ring.querySelectorAll('.kc-card')];
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const circ   = widths.reduce((a,b)=>a+b,0) + GAP*widths.length;
    // tighten slightly so the ring is a full circle, not a shallow arc
    const r = (circ / (2*Math.PI)) * 0.85;
    return Math.max(MIN_R, Math.min(Math.round(r), MAX_R));
  };

  const layout = (ring) => {
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    tiles.forEach(ensureCard);
    const N = tiles.length || 1;
    const radius = radiusFromWidths(ring);
    // distribute evenly around Y
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });
    // set stage height to match radius / tilt
    const stage = ring.closest('.kc-ring-stage');
    if (stage) stage.style.height = Math.max(380, Math.min(560, Math.round(radius*0.9))) + 'px';
    return { radius, N };
  };

  const addControls = (ring) => {
    const stage = ring.closest('.kc-ring-stage');
    if (!stage) return;
    // pause on hover (CSS animation play state)
    stage.addEventListener('mouseenter', ()=>{ ring.style.animationPlayState='paused'; });
    stage.addEventListener('mouseleave', ()=>{ ring.style.animationPlayState='running'; });
    // drag scrub by adjusting --kc-speed sign via inline rotation offset
    let dragging=false, sx=0, start=0;
    const getRot = () => {
      const m = /rotateY\((-?\d+(?:\.\d+)?)deg\)/.exec(getComputedStyle(ring).transform);
      return 0; // we don’t read; we just apply offset directly
    };
    let offset=0;
    const apply = ()=> ring.style.transform = `translate(-50%,-50%) rotateX(${TILT}deg) rotateY(${offset}deg)`;
    const down = x => { dragging=true; sx=x; ring.style.animationPlayState='paused'; };
    const move = x => { if(!dragging) return; offset += (x - sx) * -0.3; sx=x; apply(); };
    const up   = () => { if(!dragging) return; dragging=false; ring.style.animationPlayState='running'; };
    stage.addEventListener('mousedown', e=>down(e.clientX));
    window.addEventListener('mousemove', e=>move(e.clientX));
    window.addEventListener('mouseup', up);
    stage.addEventListener('touchstart', e=>down(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchmove',  e=>move(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchend', up);
  };

  const ready = (root, cb) => {
    const imgs = [...root.querySelectorAll('img')];
    if (!imgs.length) return cb();
    let left=imgs.length; const done=()=>{ if(--left===0) cb(); };
    imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1500);
  };

  const initAll = () => {
    const rings = [...document.querySelectorAll('.kc-ring')];
    console.log(`[kc-ring] rings found: ${rings.length}`);
    rings.forEach(ring => ready(ring, () => {
      const info = layout(ring);
      addControls(ring);
      console.log('[kc-ring] laid out', info);
    }));
  };

  if (document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', ()=>{ initAll(); setTimeout(initAll,200); });
  } else { initAll(); setTimeout(initAll,200); }
})();

// === KC RING LAYOUT (CSS-driven spin) ===
(function () {
  const GAP = 28, TIGHT = 0.85; // from your D4: r_raw≈334 → r≈284 when ×0.85
  const MIN_R = 260, MAX_R = 640;

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
    const r      = (circ / (2*Math.PI)) * TIGHT; // tighten → full circle
   return Math.max(MIN_R, Math.min(Math.round(r), MAX_R));
  };

  const layoutRing = (ring) => {
    const stage = ring.closest('.kc-ring-stage');
    const tiles = [...ring.querySelectorAll('.kc-tile')];
    if (!tiles.length) return;
    tiles.forEach(ensureCard);
    const N = tiles.length;
    const radius = calcRadius(ring);
    // Distribute evenly
    tiles.forEach((tile, i) => {
      const theta = (360 / N) * i;
      tile.style.transform =
        `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });
    if (stage) {
      stage.style.height = Math.max(380, Math.min(560, Math.round(radius*0.9))) + 'px';
    }
    // Controls: pause on hover / resume on leave (CSS animation)
    ring.style.animationPlayState = 'running';
    stage?.addEventListener('mouseenter', ()=> ring.style.animationPlayState = 'paused');
    stage?.addEventListener('mouseleave', ()=> ring.style.animationPlayState = 'running');
    // Drag scrub: temporarily stop CSS animation and rotate ring inline
    let dragging=false, sx=0, base=0;
    const getBase = () => (base || 0);
    const apply = (deg) => ring.style.transform =
      `translate(-50%,-50%) rotateX(10deg) rotateY(${deg}deg)`;
    const down = x => { dragging=true; sx=x; base=getBase(); ring.style.animation='none'; };
    const move = x => { if(!dragging) return; const d = (x - sx) * -0.35; apply(base + d); };
    const up   = () => { if(!dragging) return; dragging=false; base = 0; ring.style.animation=''; };
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
})();

