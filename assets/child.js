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

  const initOne = (ring) => {
    const stage = ring.closest('.es-stage');
    const tiles = $$('.es-tile', ring);
    if (!tiles.length) return;

    // dataset overrides
    const speed = Number(ring.dataset.speed) || SPEED;
    const tilt = ring.dataset.tilt ? Number(ring.dataset.tilt) : TILT;
    const radius = ring.dataset.radius ? Number(ring.dataset.radius) : radiusFrom(ring);

    // set up cards and distribute around ring
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

    // JS rotation + face-camera cards
    const reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    let running = !reduced, interacted = !reduced, angle = 0, last = performance.now();
    let autoPaused = false, manualPause = false;
    const cards = tiles.map(t => t.querySelector('.es-card'));
    const step = (t) => {
      const dt = (t - last) / 1000; last = t;
      if (running) angle = (angle + (360/speed)*dt) % 360;

      ring.style.transform = `translate(-50%,-50%) rotateX(${tilt}deg) rotateY(${angle}deg)`;

      // face the camera: rotate card opposite of ring+its tile angle
      tiles.forEach((tile, idx) => {
        const theta = Number(tile.dataset.theta) || 0;
        const card = cards[idx];
        if (card) card.style.transform = `rotateY(${-(angle + theta)}deg)`;
      });

      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    // auto pause when stage out of view
    if (stage) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            autoPaused = false;
            if (!manualPause) { running = true; last = performance.now(); }
          } else {
            autoPaused = true;
            running = false;
          }
        });
      }, { threshold: 0.15 });
      io.observe(stage);
      window.addEventListener('pagehide', () => io.disconnect(), { once: true });
    }

    // interactions
    document.addEventListener('visibilitychange', () => {
      autoPaused = document.hidden;
      if (autoPaused) {
        running = false;
      } else if (!manualPause && interacted) {
        running = true; last = performance.now();
      }
    });

    stage?.addEventListener('mouseenter', ()=> { manualPause=true; running=false; });
    stage?.addEventListener('mouseleave', ()=> { manualPause=false; if (!autoPaused && interacted) { running=true; last=performance.now(); } });
    stage?.addEventListener('focusin', ()=> { interacted=true; manualPause=true; running=false; });
    stage?.addEventListener('focusout', ()=> { manualPause=false; if (!autoPaused && interacted) { running=true; last=performance.now(); } });

    let dragging=false, sx=0, start=0;
    const down = x => { dragging=true; sx=x; start=angle; manualPause=true; running=false; };
    const move = x => { if (!dragging) return; angle = start - (x - sx)*0.35; };
    const up   = () => { if (!dragging) return; dragging=false; manualPause=false; if (!autoPaused && interacted) { running=true; last=performance.now(); } };

    stage?.addEventListener('mousedown', e=>{ interacted=true; down(e.clientX); });
    window.addEventListener('mousemove', e=>move(e.clientX));
    window.addEventListener('mouseup', up);

    stage?.addEventListener('touchstart', e=>{ interacted=true; down(e.touches[0].clientX); }, {passive:true});
    stage?.addEventListener('touchmove',  e=>move(e.touches[0].clientX),  {passive:true});
    stage?.addEventListener('touchend', up);

    console.log('[es-carousel] ready', {tiles:N, radius});
  };

  const initAll = () => {
    $$('.es-ring').forEach(ring => imagesReady(ring, ()=>initOne(ring)));
  };
  const debounce=(fn,ms)=>{let t;return()=>{clearTimeout(t);t=setTimeout(fn,ms)}};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else { initAll(); }

  window.addEventListener('resize', debounce(initAll, 250));
})();
