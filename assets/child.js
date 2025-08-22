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
// ===== ES CAROUSEL (clean reset) =====
(function(){
  const GAP=24, TIGHT=0.72, MIN_R=260, MAX_R=620, TILT=8, SPEED=28; // sec/rev
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const states = new Map();
  let resizeAttached = false;
  let debouncedLayout;

  const ensureCard = (tile) => {
    let card = tile.querySelector('.es-card');
    if (!card) {
      card = document.createElement('div'); card.className = 'es-card';
      while (tile.firstChild) card.appendChild(tile.firstChild);
      tile.appendChild(card);
    }
    return card;
  };

  const radiusFrom = (ring) => {
    const cards = $$('.es-card', ring);
    const widths = cards.map(c => c.getBoundingClientRect().width || 140);
    const circ = widths.reduce((a,b)=>a+b,0) + GAP*widths.length;
    const r = (circ/(2*Math.PI))*TIGHT;
    return Math.max(MIN_R, Math.min(Math.round(r), MAX_R));
  };

  const imagesReady = (root, cb) => {
    const imgs = $$('img', root);
    if (!imgs.length) return cb();
    let left = imgs.length; const done=()=>{ if(--left===0) cb(); };
    imgs.forEach(img => img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1200);
  };

  const layoutOne = (ring) => {
    const stage = ring.closest('.es-stage');
    const tiles = $$('.es-tile', ring);
    if (!tiles.length) return;
    const speed = Number(ring.dataset.speed) || SPEED;
    const tilt = ring.dataset.tilt ? Number(ring.dataset.tilt) : TILT;
    const radius = ring.dataset.radius ? Number(ring.dataset.radius) : radiusFrom(ring);
    tiles.forEach(ensureCard);
    const N = tiles.length;
    tiles.forEach((tile,i)=>{
      const theta = (360/N)*i;
      tile.dataset.theta = theta;
      tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });
    const sw = ring.parentElement?.offsetWidth || 0;
    if (stage) {
      const h = Math.round(Math.max(320, Math.min(sw * 0.8, 560)));
      stage.style.height = h + 'px';
    }
    return { stage, tiles, speed, tilt, radius };
  };

  const destroyOne = (ring) => {
    const state = states.get(ring);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    state.io?.disconnect();
    document.removeEventListener('visibilitychange', state.onVisibility);
    state.stage?.removeEventListener('mouseenter', state.onEnter);
    state.stage?.removeEventListener('mouseleave', state.onLeave);
    state.stage?.removeEventListener('focusin', state.onFocusIn);
    state.stage?.removeEventListener('focusout', state.onFocusOut);
    state.stage?.removeEventListener('mousedown', state.onMouseDown);
    window.removeEventListener('mousemove', state.onMouseMove);
    window.removeEventListener('mouseup', state.onMouseUp);
    state.stage?.removeEventListener('touchstart', state.onTouchStart);
    state.stage?.removeEventListener('touchmove', state.onTouchMove);
    state.stage?.removeEventListener('touchend', state.onTouchEnd);
    state.observer?.disconnect();
    states.delete(ring);
    if (!states.size && resizeAttached) {
      window.removeEventListener('resize', debouncedLayout);
      resizeAttached = false;
    }
  };

  const initOne = (ring) => {
    if (states.has(ring)) return;
    const data = layoutOne(ring);
    if (!data) return;
    const { stage } = data;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = { ...data, running: !reduced, interacted: !reduced, angle: 0, last: performance.now(), autoPaused: false, manualPause: false };
    state.cards = state.tiles.map(t => t.querySelector('.es-card'));

    const step = (t) => {
      const dt = (t - state.last) / 1000; state.last = t;
      if (state.running) state.angle = (state.angle + (360/state.speed)*dt) % 360;
      ring.style.transform = `translate(-50%,-50%) rotateX(${state.tilt}deg) rotateY(${state.angle}deg)`;
      state.tiles.forEach((tile, idx) => {
        const theta = Number(tile.dataset.theta) || 0;
        const card = state.cards[idx];
        if (card) card.style.transform = `rotateY(${-(state.angle + theta)}deg)`;
      });
      state.frame = requestAnimationFrame(step);
    };
    state.frame = requestAnimationFrame(step);

    if (stage) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            state.autoPaused = false;
            if (!state.manualPause) { state.running = true; state.last = performance.now(); }
          } else {
            state.autoPaused = true;
            state.running = false;
          }
        });
      }, { threshold: 0.15 });
      io.observe(stage);
      state.io = io;
      window.addEventListener('pagehide', () => io.disconnect(), { once: true });
    }

    state.onVisibility = () => {
      state.autoPaused = document.hidden;
      if (state.autoPaused) {
        state.running = false;
      } else if (!state.manualPause && state.interacted) {
        state.running = true; state.last = performance.now();
      }
    };
    document.addEventListener('visibilitychange', state.onVisibility);

    state.onEnter = ()=> { state.manualPause=true; state.running=false; };
    state.onLeave = ()=> { state.manualPause=false; if (!state.autoPaused && state.interacted) { state.running=true; state.last=performance.now(); } };
    state.onFocusIn = ()=> { state.interacted=true; state.manualPause=true; state.running=false; };
    state.onFocusOut = ()=> { state.manualPause=false; if (!state.autoPaused && state.interacted) { state.running=true; state.last=performance.now(); } };
    let dragging=false, sx=0, start=0;
    const down = x => { dragging=true; sx=x; start=state.angle; state.manualPause=true; state.running=false; };
    const move = x => { if (!dragging) return; state.angle = start - (x - sx)*0.35; };
    const up   = () => { if (!dragging) return; dragging=false; state.manualPause=false; if (!state.autoPaused && state.interacted) { state.running=true; state.last=performance.now(); } };
    state.onMouseDown = e=>{ state.interacted=true; down(e.clientX); };
    state.onMouseMove = e=>move(e.clientX);
    state.onMouseUp = up;
    state.onTouchStart = e=>{ state.interacted=true; down(e.touches[0].clientX); };
    state.onTouchMove  = e=>move(e.touches[0].clientX);
    state.onTouchEnd   = up;

    stage?.addEventListener('mouseenter', state.onEnter);
    stage?.addEventListener('mouseleave', state.onLeave);
    stage?.addEventListener('focusin', state.onFocusIn);
    stage?.addEventListener('focusout', state.onFocusOut);
    stage?.addEventListener('mousedown', state.onMouseDown);
    window.addEventListener('mousemove', state.onMouseMove);
    window.addEventListener('mouseup', state.onMouseUp);
    stage?.addEventListener('touchstart', state.onTouchStart, {passive:true});
    stage?.addEventListener('touchmove', state.onTouchMove, {passive:true});
    stage?.addEventListener('touchend', state.onTouchEnd);

    const observer = new MutationObserver(()=> {
      if (!document.body.contains(ring)) {
        destroyOne(ring);
        observer.disconnect();
      }
    });
    observer.observe(document.body, {childList:true, subtree:true});
    state.observer = observer;

    states.set(ring, state);
    console.log('[es-carousel] ready', {tiles:state.tiles.length, radius:state.radius});
  };

  const layoutAll = () => {
    states.forEach((state, ring) => {
      if (!document.body.contains(ring)) { destroyOne(ring); return; }
      const data = layoutOne(ring);
      if (data) {
        Object.assign(state, data);
        state.cards = state.tiles.map(t => t.querySelector('.es-card'));
      }
    });
  };

  const initAll = () => {
    const rings = $$('.es-ring');
    rings.forEach(ring => { if (!states.has(ring)) imagesReady(ring, ()=>initOne(ring)); });
    if (rings.length && !resizeAttached) {
      debouncedLayout = debounce(layoutAll, 250);
      window.addEventListener('resize', debouncedLayout);
      resizeAttached = true;
    } else if (!rings.length && resizeAttached) {
      window.removeEventListener('resize', debouncedLayout);
      resizeAttached = false;
    }
  };

  const debounce=(fn,ms)=>{let t;return()=>{clearTimeout(t);t=setTimeout(fn,ms)}};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else { initAll(); }
})();

