<?php
/**
 * Title: 3D Logo Carousel – Advanced Wide Slim
 * Slug: kadence-child/carousel-3d-ring-adv
 * Categories: kadence-child, featured
 * Description: Advanced experimental 3D carousel variant (wide & slim) with per-tile pop and controls.
 */
?>
<!-- wp:group {"align":"full","className":"kc-adv-stage-wrap","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"layout":{"type":"constrained","contentSize":"1900px"}} -->
<div class="wp-block-group alignfull kc-adv-stage-wrap">
  <!-- wp:html -->
  <section class="kc-adv-carousel" aria-label="Brand logo carousel (advanced)">
    <div class="kc-adv-panel" data-playing="true">
      <div class="kc-adv-world">
        <div class="kc-adv-ring">
          <!-- Static tiles (removed dynamic PHP to prevent parse errors) -->
          <div class="kc-adv-tile" style="--n:0"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
          <div class="kc-adv-tile" style="--n:1"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
          <div class="kc-adv-tile" style="--n:2"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
          <div class="kc-adv-tile" style="--n:3"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
          <div class="kc-adv-tile" style="--n:4"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces" /></div>
          <div class="kc-adv-tile" style="--n:5"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
          <div class="kc-adv-tile" style="--n:6"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
          <div class="kc-adv-tile" style="--n:7"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
          <div class="kc-adv-tile" style="--n:8"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
          <div class="kc-adv-tile" style="--n:9"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
          <div class="kc-adv-tile" style="--n:10"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
          <div class="kc-adv-tile" style="--n:11"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
          <div class="kc-adv-tile" style="--n:12"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
          <div class="kc-adv-tile" style="--n:13"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
          <div class="kc-adv-tile" style="--n:14"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
          <div class="kc-adv-tile" style="--n:15"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
          <div class="kc-adv-tile" style="--n:16"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
        </div>
        <div class="kc-adv-floor" aria-hidden="true"></div>
      </div>
      <div class="kc-adv-spotlight" aria-hidden="true"></div>
      <div class="kc-adv-controls" aria-label="Carousel controls" role="group">
        <button type="button" class="kc-adv-btn" data-action="prev" aria-label="Previous">⟨</button>
        <button type="button" class="kc-adv-btn" data-action="playpause" aria-pressed="true" aria-label="Pause autoplay">Pause</button>
        <button type="button" class="kc-adv-btn" data-action="next" aria-label="Next">⟩</button>
      </div>
    </div>
  </section>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:html -->
<style>
:root{--spin-seconds:22;--center-scale:1.16;--center-lift:8px;}
.kc-adv-stage-wrap{--panel-h-min:120px;--panel-h-max:210px;--tile-min:80px;--tile-max:120px;--radius-min:320px;--radius-max:600px;}
.kc-adv-carousel{position:relative;display:grid;place-items:center;min-height:clamp(240px,40vh,520px);}
.kc-adv-panel{--count:17;width:min(96vw,1280px);height:clamp(var(--panel-h-min),28vh,var(--panel-h-max));perspective:1200px;perspective-origin:50% 55%;position:relative;overflow:hidden;border-radius:28px;background:linear-gradient(145deg,#181d23,#0f1318);outline:1px solid rgba(255,255,255,.09);box-shadow:0 24px 68px -20px rgba(0,0,0,.65),0 8px 32px -8px rgba(0,0,0,.5);backdrop-filter:saturate(1.2);}
.kc-adv-panel:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(160% 120% at 50% 120%,rgba(0,0,0,.55),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.06),transparent 35%);mix-blend-mode:normal;}
.kc-adv-panel:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(50% 65% at 50% 60%,rgba(255,255,255,.05),transparent 70%);}
.kc-adv-world{position:absolute;inset:0;transform-style:preserve-3d;}
.kc-adv-ring{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}
.kc-adv-panel{--r:clamp(var(--radius-min),calc(52cqw - 0.40 * clamp(var(--tile-min),11vw,var(--tile-max))),var(--radius-max));}
.kc-adv-tile{--s:0.9;--z:0px;--c:0;position:absolute;top:50%;left:50%;width:clamp(var(--tile-min),11vw,var(--tile-max));aspect-ratio:1/1;border-radius:18px;background:#fff;border:1px solid rgba(0,0,0,.10);box-shadow:0 10px 26px -6px rgba(0,0,0,.25),0 4px 12px -2px rgba(0,0,0,.2);display:grid;place-items:center;transform-style:preserve-3d;overflow:hidden;--n:0;backface-visibility:hidden;transform:translate(-50%,-50%) rotateY(calc(var(--n)*(360deg/var(--count)))) translateZ(calc(var(--r) + var(--z))) scale(var(--s));transition:filter .55s cubic-bezier(.22,.67,.38,1),box-shadow .55s,opacity .55s,transform .55s;opacity:calc(.14 + .86*var(--c));filter:brightness(calc(.80 + .28*var(--c)));
}
.kc-adv-tile:before{content:"";position:absolute;inset:-2px;pointer-events:none;background:radial-gradient(90% 90% at 50% 30%,rgba(255,255,255,.6),rgba(255,255,255,0) 70%),linear-gradient(180deg,rgba(255,255,255,.15),rgba(255,255,255,0) 55%);mix-blend-mode:overlay;opacity:calc(.15 + .55*var(--c));transition:opacity .55s;}
.kc-adv-tile:after{content:"";position:absolute;left:0;right:0;bottom:-40%;height:160%;background:radial-gradient(60% 80% at 50% 0%,rgba(0,0,0,.18),transparent 70%);opacity:.45;filter:blur(14px);transform:translateZ(-2px);pointer-events:none;}
.kc-adv-tile img{max-width:78%;max-height:78%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.16));transition:filter .55s, transform .55s;image-rendering:-webkit-optimize-contrast;image-rendering:crisp-edges;}
.kc-adv-tile[data-active]{--s:1.06;box-shadow:0 26px 55px -18px rgba(0,0,0,.55),0 14px 28px -6px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.35) inset;filter:brightness(1.06) saturate(1.06);}
.kc-adv-tile[data-active] img{filter:drop-shadow(0 8px 18px rgba(0,0,0,.35));transform:translateY(-2px);}
.kc-adv-spotlight{position:absolute;inset:0;pointer-events:none;background:radial-gradient(35% 50% at 50% 60%,rgba(255,255,255,.16),transparent 70%),radial-gradient(65% 85% at 50% 110%,rgba(0,0,0,.65),transparent 60%);mix-blend-mode:screen;}
.kc-adv-floor{position:absolute;left:8%;right:8%;bottom:-36%;height:45%;background:radial-gradient(80% 80% at 50% 0%,rgba(255,255,255,.05),transparent 70%),radial-gradient(70% 140% at 50% 100%,rgba(0,0,0,.72),transparent 60%);transform:translateZ(-220px) rotateX(78deg);filter:blur(2px);pointer-events:none;}
.kc-adv-controls{position:absolute;inset-inline:0;bottom:14px;display:flex;gap:10px;justify-content:center;align-items:center;z-index:6;}
.kc-adv-btn{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.20);color:#fff;padding:8px 16px;border-radius:999px;font-size:13px;line-height:1;backdrop-filter:blur(10px) saturate(1.4);cursor:pointer;user-select:none;min-width:64px;letter-spacing:.5px;position:relative;}
.kc-adv-btn:focus-visible{outline:2px solid #39a0ff;outline-offset:2px;}
.kc-adv-btn:hover{background:rgba(255,255,255,.18)}
.kc-adv-btn:active{transform:translateY(1px);}
.kc-adv-carousel[data-paused="true"] .kc-adv-btn[data-action="playpause"]{background:#39a0ff;color:#fff;border-color:#39a0ff;}
@media (prefers-reduced-motion:reduce){.kc-adv-controls{display:none}.kc-adv-ring{animation:none!important}}
</style>
<script>
(function(){
  const panel=document.currentScript.previousElementSibling?.previousElementSibling?.querySelector?.('.kc-adv-panel')||document.querySelector('.kc-adv-panel');
  if(!panel) return; panel.setAttribute('role','region'); panel.setAttribute('aria-label','Interactive 3D brand carousel');
  const ring=panel.querySelector('.kc-adv-ring');
  const tiles=[...ring.querySelectorAll('.kc-adv-tile')];
  const total=tiles.length; if(!total) return; const step=360/total;
  const live=document.createElement('span'); live.className='screen-reader-text'; live.setAttribute('aria-live','polite'); live.style.position='absolute'; live.style.left='-9999px'; panel.appendChild(live);
  let angle=0, playing=true; let last=performance.now();
  let velocity=0; const baseSpeed=360/(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spin-seconds'))||22); // deg/sec
  velocity=baseSpeed;
  let radiusCache=0; function getRadius(){ const r=parseFloat(getComputedStyle(panel).getPropertyValue('--r'))||500; radiusCache=r; return r; }
  const spinSeconds=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spin-seconds'))||22;
  function normalize(a){ return (a%360+360)%360; }
  function setTargetForIndex(i){ targetAngle=normalize(i*step); }
  function update(force){
    ring.style.transform='translateZ(-10px)';
    const r=getRadius();
    const displayAngle = angle % 360;
    let activeIndex=-1; let best=0;
    tiles.forEach((tile,i)=>{
      const tileAngle = (i*step - displayAngle);
      const rel = ((tileAngle + 540)%360)-180;
      const closeness = 1-Math.abs(rel)/180;
      const scale = 0.82 + 0.28*Math.pow(closeness,2); // reduced scale delta for sharpness
      const zOffset = (scale-1)*120; // subtle depth
      const yRot = tileAngle;
      tile.style.transform = 'translate(-50%,-50%) rotateY('+yRot+'deg) translateZ('+(r + zOffset).toFixed(2)+'px) rotateY('+(-yRot)+'deg) scale('+scale.toFixed(3)+')';
      tile.style.setProperty('--c',closeness.toFixed(3));
      tile.style.zIndex = String( Math.round( 100*closeness ) );
      if(closeness>best){ best=closeness; activeIndex=i; }
      if(closeness>0.965){ tile.setAttribute('data-active','true'); } else { tile.removeAttribute('data-active'); }
    });
    if(activeIndex>-1 && (force || tiles[activeIndex].getAttribute('data-active'))){
      const alt=tiles[activeIndex].querySelector('img')?.getAttribute('alt')||''; live.textContent='Showing '+alt; }
  }
  function frame(now){
    const dt=(now-last)/1000; last=now;
    if(playing){ angle += dt*velocity; }
    update(false); requestAnimationFrame(frame);
  }
  update(true); requestAnimationFrame(frame);
  panel.addEventListener('click',e=>{
    const btn=e.target.closest('.kc-adv-btn');
    if(btn){ const action=btn.dataset.action; if(action==='playpause'){ playing=!playing; if(playing){ velocity=baseSpeed; } panel.closest('.kc-adv-carousel')?.setAttribute('data-paused', (!playing).toString()); btn.setAttribute('aria-pressed', playing?'true':'false'); btn.textContent=playing?'Pause':'Play'; }
      if(action==='next'){ angle -= step; update(true); }
      if(action==='prev'){ angle += step; update(true); }
      return; }
    const tile=e.target.closest('.kc-adv-tile'); if(tile){ const idx=tiles.indexOf(tile); angle = idx*step; playing=false; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Play'; pb.setAttribute('aria-pressed','false'); } update(true); }
  });
  // Hover pause
  panel.addEventListener('mouseenter',()=>{ playing=false; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Play'; pb.setAttribute('aria-pressed','false'); }});
  panel.addEventListener('mouseleave',()=>{ playing=true; velocity=baseSpeed; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Pause'; pb.setAttribute('aria-pressed','true'); }});
  // Drag / swipe
  let dragging=false,startX=0,startAngle=0,lastMoveTime=0,lastX=0; const sensitivity=0.45; // deg per px
  function pointerDown(e){ dragging=true; playing=false; startX=lastX=e.clientX||e.touches?.[0]?.clientX||0; startAngle=angle; panel.classList.add('is-dragging'); lastMoveTime=performance.now(); }
  function pointerMove(e){ if(!dragging) return; const x=e.clientX||e.touches?.[0]?.clientX||0; const dx=x-startX; angle = startAngle - dx*sensitivity; const now=performance.now(); if(Math.abs(x-lastX)>2){ velocity = ( (x-lastX)*sensitivity / ((now-lastMoveTime)/1000) ); lastMoveTime=now; lastX=x; } }
  function pointerUp(){ if(!dragging) return; dragging=false; panel.classList.remove('is-dragging'); // inertia
    velocity = Math.max(-baseSpeed*2, Math.min(baseSpeed*2, velocity)); // clamp
    if(Math.abs(velocity) < baseSpeed*0.25) { velocity = baseSpeed; playing=true; }
    else { playing=true; }
  }
  panel.addEventListener('mousedown',pointerDown); window.addEventListener('mousemove',pointerMove); window.addEventListener('mouseup',pointerUp);
  panel.addEventListener('touchstart',pointerDown,{passive:true}); panel.addEventListener('touchmove',pointerMove,{passive:true}); window.addEventListener('touchend',pointerUp);
  window.addEventListener('resize',()=>{ getRadius(); update(true); });
  panel.tabIndex=0;
  panel.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){ angle -= step; update(true); } else if(e.key==='ArrowLeft'){ angle += step; update(true); } else if(e.code==='Space'){ e.preventDefault(); const pb=panel.querySelector('[data-action="playpause"]'); pb&&pb.click(); } });
  try{ const io=new IntersectionObserver(entries=>{ entries.forEach(ent=>{ if(ent.target===panel){ if(!ent.isIntersecting){ playing=false; } else { playing=true; velocity=baseSpeed; } const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.setAttribute('aria-pressed', playing?'true':'false'); pb.textContent=playing?'Pause':'Play'; } } }); }); io.observe(panel); }catch(err){}
})();
</script>
<!-- /wp:html -->
