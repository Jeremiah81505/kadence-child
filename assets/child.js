console.log("Kadence Child JS loaded");

// HERO reveal
(function () {
  const title = document.querySelector('.kc-hero-title');
  if (!title) return;
  const obs = new IntersectionObserver((es)=>es.forEach(e=>{ if(e.isIntersecting){ title.classList.add('kc-revealed'); obs.disconnect(); }}), {threshold:.4});
  obs.observe(title);
})();

// 3D RING (auto-size + no animation reset)
(function () {
  const GAP=28, MIN_RADIUS=360, MAX_RADIUS=700;
  const face = (tile, theta, r) => {
    tile.style.transform = `translate(-50%,-50%) rotateY(${theta}deg) translateZ(${r}px) rotateY(${-theta}deg)`;
    tile.style.transformStyle = 'preserve-3d';
  };
  const calcR = (ring) => {
    const widths = [...ring.querySelectorAll('.kc-tile img')].map(i=>i.getBoundingClientRect().width||110);
    const total = widths.reduce((a,b)=>a+b,0) + GAP*widths.length;
    return Math.max(MIN_RADIUS, Math.min(Math.ceil(total/(2*Math.PI)*1.1), MAX_RADIUS));
  };
  const initRing = (ring, idx) => {
    const stage = ring.closest('.kc-ring-stage'); if(!stage) return;
    const tiles = [...ring.querySelectorAll('.kc-tile')]; const N = tiles.length||1;
    const speed = Number(ring.dataset.speed)||28; ring.style.setProperty('--kc-speed', `${speed}s`);
    const radius = calcR(ring);
    tiles.forEach((t,i)=>face(t, (360/N)*i, radius));
    stage.style.height = Math.max(360, Math.min(520, Math.round(radius*0.85))) + 'px';
    ring.classList.add('kc-spin'); // keep class; don't zero animation
    // Drag rotate without removing animation; just pause/play
    let dragging=false, sx=0, cur=0, start=0;
    const setRot = deg => { ring.style.transform = `rotateY(${deg}deg)`; cur=deg; };
    const down = x => { dragging=true; sx=x; start=cur; ring.style.animationPlayState='paused'; };
    const move = x => { if(!dragging) return; setRot(start - (x - sx)*0.4); };
    const up   = () => { if(!dragging) return; dragging=false; ring.style.animationPlayState='running'; };
    stage.addEventListener('mousedown', e=>down(e.clientX));
   window.addEventListener('mousemove', e=>move(e.clientX));
    window.addEventListener('mouseup', up);
    stage.addEventListener('touchstart', e=>down(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchmove', e=>move(e.touches[0].clientX), {passive:true});
    stage.addEventListener('touchend', up);
    console.log('[kc-ring] initialized', {index: idx, tiles: N, radius, speed});
  };
  const readyImgs = (root, cb) => {
    const imgs=[...root.querySelectorAll('img')]; if(!imgs.length) return cb();
    let left=imgs.length; const done=()=>{ if(--left===0) cb(); };
    imgs.forEach(img=> img.complete ? done() : img.addEventListener('load', done, {once:true}));
    setTimeout(()=>{ if(left>0) cb(); }, 1500);
  };
  const initAll = () => {
    const rings=[...document.querySelectorAll('.kc-ring')];
    console.log(`[kc-ring] rings found: ${rings.length}`);
    rings.forEach((r,i)=>readyImgs(r, ()=>initRing(r,i)));
  };
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', ()=>{initAll(); setTimeout(initAll,200);}); }
  else { initAll(); setTimeout(initAll,200); }
})();
