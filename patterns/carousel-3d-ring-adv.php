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
.kc-adv-panel{--count:17;width:min(96vw,1280px);height:clamp(var(--panel-h-min),28vh,var(--panel-h-max));perspective:1000px;perspective-origin:50% 52%;position:relative;overflow:hidden;border-radius:16px;background:radial-gradient(140% 100% at 50% -30%,rgba(255,255,255,.05),transparent 70%),rgba(10,12,18,.78);outline:1px solid rgba(255,255,255,.08);box-shadow:0 18px 60px rgba(0,0,0,.5);}
.kc-adv-panel:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(160% 120% at 50% 120%,rgba(0,0,0,.55),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.05),transparent 35%);}
.kc-adv-world{position:absolute;inset:0;transform-style:preserve-3d;}
.kc-adv-ring{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}
.kc-adv-panel{--r:clamp(var(--radius-min),calc(52cqw - 0.40 * clamp(var(--tile-min),11vw,var(--tile-max))),var(--radius-max));}
.kc-adv-tile{--s:0.9;--z:0px;position:absolute;top:50%;left:50%;width:clamp(var(--tile-min),11vw,var(--tile-max));aspect-ratio:1/1;border-radius:12px;background:#fff;border:1px solid rgba(0,0,0,.10);box-shadow:0 10px 20px rgba(0,0,0,.18),0 2px 6px rgba(0,0,0,.16);display:grid;place-items:center;transform-style:preserve-3d;overflow:hidden;--n:0;transform:translate(-50%,-50%) rotateY(calc(var(--n)*(360deg/var(--count)))) translateZ(calc(var(--r) + var(--z))) scale(var(--s));transition:filter .35s cubic-bezier(.22,.67,.38,1),box-shadow .35s,opacity .35s;}
.kc-adv-tile:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.22),transparent 35%),radial-gradient(90% 70% at 50% 55%,rgba(255,255,255,.10),transparent 60%);mix-blend-mode:screen;}
.kc-adv-tile img{max-width:82%;max-height:82%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.16));transition:filter .35s;}
.kc-adv-spotlight{position:absolute;inset:0;pointer-events:none;background:radial-gradient(30% 44% at 50% 60%,rgba(255,255,255,.18),transparent 60%),radial-gradient(65% 85% at 50% 110%,rgba(0,0,0,.62),transparent 60%);mix-blend-mode:screen;}
.kc-adv-floor{position:absolute;left:8%;right:8%;bottom:-36%;height:45%;background:radial-gradient(80% 80% at 50% 0%,rgba(255,255,255,.05),transparent 70%),radial-gradient(70% 140% at 50% 100%,rgba(0,0,0,.72),transparent 60%);transform:translateZ(-220px) rotateX(78deg);filter:blur(2px);pointer-events:none;}
.kc-adv-controls{position:absolute;inset-inline:0;bottom:8px;display:flex;gap:8px;justify-content:center;align-items:center;z-index:4;}
.kc-adv-btn{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);color:#fff;padding:6px 12px;border-radius:999px;font-size:13px;line-height:1;backdrop-filter:blur(8px);cursor:pointer;user-select:none;min-width:58px;}
.kc-adv-btn:hover{background:rgba(255,255,255,.16)}
@media (prefers-reduced-motion:reduce){.kc-adv-controls{display:none}.kc-adv-ring{animation:none!important}}
</style>
<script>
(function(){
  const panel=document.currentScript.previousElementSibling?.previousElementSibling?.querySelector?.('.kc-adv-panel')||document.querySelector('.kc-adv-panel');
  if(!panel) return; panel.setAttribute('role','region'); panel.setAttribute('aria-label','Interactive 3D brand carousel');
  const ring=panel.querySelector('.kc-adv-ring');
  const tiles=[...ring.querySelectorAll('.kc-adv-tile')];
  const total=tiles.length; if(!total) return;
  const step=360/total; let angle=0; let playing=true; let last=performance.now();
  const spinSeconds = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spin-seconds')) || 22;
  function update(){
    ring.style.transform='translateZ(-10px) rotateY('+angle+'deg)';
    tiles.forEach((tile,i)=>{
      const a=((i*step - angle + 540)%360)-180; // -180..180
      const closeness=1-Math.abs(a)/180; // 1 at front
      const scale=0.78 + 0.42*Math.pow(closeness,2);
      const zOffset=(scale-1)*90; // subtle pop
      tile.style.setProperty('--s',scale.toFixed(3));
      tile.style.setProperty('--z',zOffset.toFixed(2)+'px');
      tile.style.opacity=(0.30 + 0.70*closeness).toFixed(3);
      tile.style.zIndex=String( Math.round( 100*closeness ) );
      tile.style.filter=closeness>0.85?'brightness(1.05) drop-shadow(0 8px 20px rgba(0,0,0,.35))':'brightness(.92)';
      if(closeness>0.96){ tile.setAttribute('data-active','true'); } else { tile.removeAttribute('data-active'); }
    });
  }
  function frame(now){
    if(playing){
      const dt=now-last; angle=(angle + (dt/1000)*(360/spinSeconds))%360; last=now; update();
    } else { last=now; }
    requestAnimationFrame(frame);
  }
  update(); requestAnimationFrame(frame);
  panel.addEventListener('click',e=>{
    const btn=e.target.closest('.kc-adv-btn'); if(!btn) return; const action=btn.dataset.action;
    if(action==='playpause'){ playing=!playing; btn.setAttribute('aria-pressed', playing?'true':'false'); btn.textContent=playing?'Pause':'Play'; }
    if(action==='next'){ angle=(angle - step)%360; update(); }
    if(action==='prev'){ angle=(angle + step)%360; update(); }
  });
  panel.tabIndex=0;
  panel.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){ angle=(angle - step)%360; update(); } else if(e.key==='ArrowLeft'){ angle=(angle + step)%360; update(); } else if(e.code==='Space'){ e.preventDefault(); const btn=panel.querySelector('[data-action="playpause"]'); if(btn){ btn.click(); } } });
  try{ const io=new IntersectionObserver(entries=>{ entries.forEach(ent=>{ if(ent.target===panel){ if(!ent.isIntersecting){ playing=false; } else { playing=true; } const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.setAttribute('aria-pressed', playing?'true':'false'); pb.textContent=playing?'Pause':'Play'; } } }); }); io.observe(panel); }catch(err){}
})();
</script>
<!-- /wp:html -->
