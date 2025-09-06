// 3D Logo Carousel – Ring (Premium Build)
// Goals: impeccable centering, adaptive radius, depth emphasis (scale/opacity),
// accessibility, multi-instance, resize-safe, graceful fallback.
// Public data attributes: data-speed (sec/rev), data-radius (px), data-tilt (deg), data-size (tile px)

(function(){
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function ready(fn){ if(/complete|interactive/.test(document.readyState)) fn(); else document.addEventListener('DOMContentLoaded', fn, {once:true}); }

  function supports3D(){
    const el=document.createElement('p');
    document.body.appendChild(el);
    const props=['transform','WebkitTransform','msTransform','MozTransform','OTransform'];
    let ok=false; for(const p of props){ if(el.style[p]!==undefined){ el.style[p]='translateZ(1px)'; const v=getComputedStyle(el).getPropertyValue(p); ok = v && v!=='none'; break; } }
    document.body.removeChild(el); return ok; }

  function initAll(){ document.querySelectorAll('.es-ring').forEach(r=>initRing(r)); }

  // Inject minimal required CSS in case theme stylesheet not yet loaded / cached incorrectly
  (function ensureBaseCSS(){
    if(document.getElementById('kc-es-ring-inline-css')) return;
    const css = `.es-stage{position:relative;width:100%;perspective:1600px;perspective-origin:50% 50%;overflow:visible}`+
                `.es-stage.is-ready{visibility:visible}`+
                `.es-ring{position:absolute;top:50%;left:50%;transform-style:preserve-3d}`+
                `.es-tile{position:absolute;top:50%;left:50%;display:flex;align-items:center;justify-content:center;}`+
                `.es-tile img{max-width:100%;max-height:100%;object-fit:contain}`;
    const el=document.createElement('style'); el.id='kc-es-ring-inline-css'; el.textContent=css; document.head.appendChild(el);
  })();

  function initRing(ring){
    if(ring.__init) return; ring.__init = true;
    const stage = ring.closest('.es-stage'); if(!stage) return;
    const fallback = stage.parentElement.querySelector('.es-fallback');
    const tiles = Array.from(ring.querySelectorAll('.es-tile')); if(!tiles.length) return;

  stage.setAttribute('role','region'); if(!stage.hasAttribute('aria-label')) stage.setAttribute('aria-label','Logo carousel');
  if(!stage.classList.contains('es-stage')) { console.warn('[Carousel3D] Stage missing base class expectations'); }
  const can3D = supports3D() && !reduceMQ.matches;
  if(!can3D){ console.info('[Carousel3D] Falling back (3D unsupported or reduced-motion)'); }
    if(!can3D){ if(fallback) fallback.classList.remove('is-hidden'); stage.classList.add('is-ready'); return; }
    if(fallback) fallback.classList.add('is-hidden');

    let speed = parseFloat(ring.dataset.speed)||30; // seconds per full rotation
    let tilt  = parseFloat(ring.dataset.tilt); if(isNaN(tilt)) tilt = 10;
    let fixedRadius = parseFloat(ring.dataset.radius); if(isNaN(fixedRadius)) fixedRadius = 0;
    let tileSize = parseInt(ring.dataset.size)||120;
    ring.style.setProperty('--tile-size', tileSize+'px');

    const tileAngles = tiles.map((_,i)=> i*(360/tiles.length));
    let radius=0; // resolved later

    function layout(){
      if(!document.body.contains(ring)){ return; }
      const count = tiles.length;
      // Derive radius: prefer fixed if provided, else proportional to tile count.
      const ideal = (tileSize*count)/(2*Math.PI); // radius for circumference ~ count*tileSize
      radius = fixedRadius || Math.max(tileSize*1.8, Math.min(ideal*1.05, tileSize*count*0.9));
      // Clamp extremely large radius to avoid pushing tiles far off-screen
      radius = Math.min(radius, 900);
      stage.style.height = Math.max(tileSize*2.2, radius*0.95 + tileSize*0.9) + 'px';
      ring.style.position='absolute'; ring.style.top='50%'; ring.style.left='50%'; ring.style.transformStyle='preserve-3d';
  tiles.forEach((tile,i)=>{
        tile.style.position='absolute';
        tile.style.width=tileSize+'px'; tile.style.height=tileSize+'px';
        tile.style.top='50%'; tile.style.left='50%';
        tile.style.margin=(-(tileSize/2))+'px 0 0 '+(-(tileSize/2))+'px';
        tile.style.willChange='transform,opacity';
        tile.style.transform='rotateY('+tileAngles[i]+'deg) translateZ('+radius+'px)';
        tile.style.opacity='0';
      });
  stage.classList.add('is-ready');
  ring.dataset._resolvedRadius = String(radius);
    }
    layout();

    let start = performance.now();
    let paused=false, offscreen=false;
    ring.tabIndex=0;
    ring.addEventListener('mouseenter',()=>paused=true);
    ring.addEventListener('mouseleave',()=>paused=false);
    ring.addEventListener('keydown', e=>{ if(e.key==='ArrowLeft'||e.key==='Left'){ start-=speed*180; e.preventDefault(); } else if(e.key==='ArrowRight'||e.key==='Right'){ start+=speed*180; e.preventDefault(); }});
    if('IntersectionObserver' in window){ new IntersectionObserver(es=>es.forEach(e=>offscreen=!e.isIntersecting),{threshold:.05}).observe(stage); }

    function frame(now){
      if(!paused && !offscreen){
        const deg = ((now-start)/1000/speed)*360 % 360;
        if(!ring.dataset._resolvedRadius){ // early frame before layout? run layout once more
          layout();
        }
  // Keep ring centered: translateZ(-radius) recenters pivot so tiles form a ring around center
  ring.style.transform = 'translate(-50%, -50%) rotateX('+tilt+'deg) translateZ(-'+radius+'px) rotateY('+deg+'deg)';
        // Depth emphasis per tile
        for(let i=0;i<tiles.length;i++){
          const t=tiles[i];
            let diff = ( (tileAngles[i]-deg+540)%360 )-180; // -180..180 (0 is front)
            const front = Math.abs(diff) <= 90; // only scale visibly on front half
            const closeness = 1 - Math.min(1, Math.abs(diff)/120);
            const scale = front ? 0.88 + 0.22 * Math.pow(closeness,1.5) : 0.82;
            const op = front ? 0.35 + 0.65 * Math.pow(closeness,1.6) : 0.12;
            t.style.transform = 'rotateY('+tileAngles[i]+'deg) translateZ('+radius+'px) scale('+scale.toFixed(3)+')';
            t.style.opacity = op.toFixed(3);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Debounced resize: re-measure (respect fixedRadius if provided)
    let to; window.addEventListener('resize',()=>{ clearTimeout(to); to=setTimeout(()=>{ fixedRadius = parseFloat(ring.dataset.radius)||0; layout(); },120); });

  stage.dispatchEvent(new CustomEvent('esRingReady',{detail:{ring}}));
  console.debug('[Carousel3D] Initialized ring with', {tiles: tiles.length, radius, speed, tilt, tileSize});
  }

  // Observe late-added rings
  const mo = new MutationObserver(ms=>{ ms.forEach(m=>m.addedNodes&&m.addedNodes.forEach(n=>{ if(n.nodeType===1){ if(n.matches&&n.matches('.es-ring')) initRing(n); n.querySelectorAll&&n.querySelectorAll('.es-ring').forEach(initRing);} })); });
  ready(()=>{ initAll(); mo.observe(document.body,{childList:true,subtree:true}); });
})();
