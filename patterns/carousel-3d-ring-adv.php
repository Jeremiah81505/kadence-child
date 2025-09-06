<?php // Fully purged advanced carousel pattern file. return; ?>
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
  <!-- /wp:html -->
    <!-- wp:html -->
