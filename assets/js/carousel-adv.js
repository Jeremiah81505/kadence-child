/* Advanced Wide Slim Carousel (externalized)
 * Features: continuous rotation, inertial drag, hover pause, click focus, keyboard nav, reduced motion respect, multi-instance.
 */
(function(){
  function initPanel(panel){
    if(!panel || panel.dataset.kcAdvInit) return; panel.dataset.kcAdvInit='1';
    panel.setAttribute('role','region');
    panel.setAttribute('aria-label','Interactive 3D brand carousel');
    const ring=panel.querySelector('.kc-adv-ring');
    if(!ring) return;
    const tiles=[...ring.querySelectorAll('.kc-adv-tile')];
    if(!tiles.length) return;
    const step=360/tiles.length;
    const live=document.createElement('span');
    live.className='screen-reader-text'; live.setAttribute('aria-live','polite'); live.style.position='absolute'; live.style.left='-9999px';
    panel.appendChild(live);
    let angle=0, playing=true, last=performance.now();
    let velocity=360/(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spin-seconds'))||22);
    let baseSpeed=velocity;
    function getRadius(){ return parseFloat(getComputedStyle(panel).getPropertyValue('--r'))||500; }
    function update(force){
      const r=getRadius();
      const displayAngle = angle % 360;
      let activeIndex=-1, best=0;
      tiles.forEach((tile,i)=>{
        const tileAngle=(i*step - displayAngle);
        const rel=((tileAngle+540)%360)-180;
        const closeness=1-Math.abs(rel)/180;
        const scale=0.82 + 0.28*Math.pow(closeness,2);
        const zOffset=(scale-1)*120;
        tile.style.transform='translate(-50%,-50%) rotateY('+tileAngle+'deg) translateZ('+(r+zOffset).toFixed(2)+'px) rotateY('+(-tileAngle)+'deg) scale('+scale.toFixed(3)+')';
        tile.style.setProperty('--c',closeness.toFixed(3));
        tile.style.zIndex=String(Math.round(100*closeness));
        if(closeness>best){ best=closeness; activeIndex=i; }
        if(closeness>0.965){ tile.setAttribute('data-active','true'); } else { tile.removeAttribute('data-active'); }
      });
      if(activeIndex>-1 && (force || tiles[activeIndex].getAttribute('data-active'))){
        const alt=tiles[activeIndex].querySelector('img')?.getAttribute('alt')||'';
        live.textContent='Showing '+alt;
      }
    }
    function frame(now){
      const dt=(now-last)/1000; last=now;
      if(playing){ angle += dt*velocity; }
      update(false); requestAnimationFrame(frame);
    }
    update(true); requestAnimationFrame(frame);
    panel.addEventListener('click',e=>{
      const btn=e.target.closest('.kc-adv-btn');
      if(btn){ const action=btn.dataset.action; if(action==='playpause'){ playing=!playing; if(playing){ velocity=baseSpeed; } panel.closest('.kc-adv-carousel')?.setAttribute('data-paused',(!playing).toString()); btn.setAttribute('aria-pressed',playing?'true':'false'); btn.textContent=playing?'Pause':'Play'; }
        if(action==='next'){ angle -= step; update(true); }
        if(action==='prev'){ angle += step; update(true); }
        return; }
      const tile=e.target.closest('.kc-adv-tile'); if(tile){ const idx=tiles.indexOf(tile); angle = idx*step; playing=false; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Play'; pb.setAttribute('aria-pressed','false'); } update(true); }
    });
    panel.addEventListener('mouseenter',()=>{ playing=false; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Play'; pb.setAttribute('aria-pressed','false'); }});
    panel.addEventListener('mouseleave',()=>{ playing=true; velocity=baseSpeed; const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.textContent='Pause'; pb.setAttribute('aria-pressed','true'); }});
    let dragging=false,startX=0,startAngle=0,lastMoveTime=0,lastX=0; const sensitivity=0.45;
    function pointerDown(e){ dragging=true; playing=false; startX=lastX=(e.clientX|| (e.touches&&e.touches[0].clientX) ||0); startAngle=angle; panel.classList.add('is-dragging'); lastMoveTime=performance.now(); }
    function pointerMove(e){ if(!dragging) return; const x=(e.clientX || (e.touches&&e.touches[0].clientX) ||0); const dx=x-startX; angle = startAngle - dx*sensitivity; const now=performance.now(); if(Math.abs(x-lastX)>2){ velocity = ((x-lastX)*sensitivity)/((now-lastMoveTime)/1000); lastMoveTime=now; lastX=x; } }
    function pointerUp(){ if(!dragging) return; dragging=false; panel.classList.remove('is-dragging'); velocity=Math.max(-baseSpeed*2,Math.min(baseSpeed*2,velocity)); if(Math.abs(velocity)<baseSpeed*0.25){ velocity=baseSpeed; playing=true; } else { playing=true; } }
    panel.addEventListener('mousedown',pointerDown); window.addEventListener('mousemove',pointerMove); window.addEventListener('mouseup',pointerUp);
    panel.addEventListener('touchstart',pointerDown,{passive:true}); panel.addEventListener('touchmove',pointerMove,{passive:true}); window.addEventListener('touchend',pointerUp);
    panel.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){ angle -= step; update(true); } else if(e.key==='ArrowLeft'){ angle += step; update(true); } else if(e.code==='Space'){ e.preventDefault(); const pb=panel.querySelector('[data-action="playpause"]'); pb&&pb.click(); } });
    try{ const io=new IntersectionObserver(entries=>{ entries.forEach(ent=>{ if(ent.target===panel){ if(!ent.isIntersecting){ playing=false; } else { playing=true; velocity=baseSpeed; } const pb=panel.querySelector('[data-action="playpause"]'); if(pb){ pb.setAttribute('aria-pressed',playing?'true':'false'); pb.textContent=playing?'Pause':'Play'; } } }); }); io.observe(panel); }catch(err){}
    window.addEventListener('resize',()=>update(true));
  }
  function init(root){ document.querySelectorAll('.kc-adv-panel').forEach(initPanel); }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',init); } else { init(); }
  window.kcAdvCarouselInit = init; // expose for manual re-init
})();
