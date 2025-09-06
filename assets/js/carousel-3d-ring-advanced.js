// Advanced 3D Logo Carousel (Every Tile Pops Variant)
// Translated for WordPress environment. Looks for .kc-adv-carousel panels.
(function(){
  const PANELS = document.querySelectorAll('.kc-adv-carousel');
  if(!PANELS.length) return;
  PANELS.forEach(initPanel);

  function initPanel(panel){
    const ring  = panel.querySelector('.kc-adv-ring');
    const tiles = [...panel.querySelectorAll('.kc-adv-tile')];
    if(!ring || !tiles.length) return;

    const count = tiles.length;
    panel.style.setProperty('--count', count);

    const rootCS = getComputedStyle(document.documentElement);
    const spinSeconds = parseFloat(rootCS.getPropertyValue('--spin-seconds')) || 22;
    const speedDegPerSec = -360 / spinSeconds;
    const centerScale = parseFloat(rootCS.getPropertyValue('--center-scale')) || 1.16;
    const centerLift  = parseFloat(rootCS.getPropertyValue('--center-lift')) || 8;
    const sigmaDeg = 18;
    const twoSigmaSq = 2 * sigmaDeg * sigmaDeg;

    let playing = true;
    let offsetDeg = 0; // manual
    let angle = 0;     // autoplay
    let last = performance.now();

    function normalize180(a){ a = ((a % 360)+360)%360; return a>180? a-360 : a; }

    function tick(ts){
      const dt = (ts - last)/1000; last = ts;
      if(playing) angle = (angle + speedDegPerSec * dt) % 360;
      const total = (angle + offsetDeg) % 360;
      ring.style.transform = `rotateY(${total}deg)`;
      for(let n=0;n<count;n++){
        const local = normalize180(n * (360/count) + total);
        const w = Math.exp(-(local*local)/twoSigmaSq);
        const s = 1 + (centerScale - 1) * w;
        const z = centerLift * w;
        const el = tiles[n];
        el.style.setProperty('--s', s.toFixed(4));
        el.style.setProperty('--z', z.toFixed(2)+'px');
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Controls
    const controls = panel.querySelector('.kc-adv-controls');
    function setOffset(delta){ offsetDeg = (offsetDeg + delta) % 360; }
    function togglePlay(){
      playing = !playing; panel.setAttribute('data-playing', playing? 'true':'false');
      const btn = controls && controls.querySelector('[data-action="playpause"]');
      if(btn){
        btn.textContent = playing? 'Pause':'Play';
        btn.setAttribute('aria-pressed', String(playing));
      }
    }
    controls && controls.addEventListener('click', e=>{
      const b=e.target.closest('button[data-action]'); if(!b) return;
      const a=b.dataset.action;
      if(a==='prev') setOffset(360/count);
      if(a==='next') setOffset(-360/count);
      if(a==='playpause') togglePlay();
    });

    panel.tabIndex=0;
    panel.addEventListener('keydown', e=>{
      if(e.key==='ArrowLeft'){ setOffset(360/count); }
      else if(e.key==='ArrowRight'){ setOffset(-360/count); }
      else if(e.key===' '||e.key==='Spacebar'){ togglePlay(); e.preventDefault(); }
    });
  }
})();
