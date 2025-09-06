// 3D Logo Carousel – Ring (Rebuilt)
// Robust geometry, multi-instance, resize recalculation, visibility + hover pause,
// reduced-motion & no-3D fallback, keyboard nudge, mutation observer for late DOM.

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function onReady(cb){
    if(document.readyState === 'complete' || document.readyState === 'interactive'){ cb(); }
    else document.addEventListener('DOMContentLoaded', cb, { once:true });
  }

  function supports3D(){
    var el=document.createElement('p');
    var has; var props=['transform','WebkitTransform','msTransform','MozTransform','OTransform'];
    document.body.appendChild(el);
    for(var i=0;i<props.length;i++) if(el.style[props[i]]!==undefined){ el.style[props[i]]='translateZ(1px)'; has=window.getComputedStyle(el).getPropertyValue(props[i]); break; }
    document.body.removeChild(el); return !!has && has!=='none';
  }

  function initAll(){
    document.querySelectorAll('.es-ring').forEach(function(r){ initRing(r); });
  }

  function initRing(ring){
    if(ring.__esInit) return; ring.__esInit = true;
    var stage = ring.closest('.es-stage'); if(!stage) return;
    var fallback = stage.parentElement.querySelector('.es-fallback');
    var tiles = ring.querySelectorAll('.es-tile'); if(!tiles.length) return;

    stage.setAttribute('role','region');
    if(!stage.hasAttribute('aria-label')) stage.setAttribute('aria-label','Logo carousel');

    var enable3D = supports3D() && !reduce.matches;
    if(!enable3D){ if(fallback) fallback.classList.remove('is-hidden'); stage.classList.add('is-ready'); return; }
    if(fallback) fallback.classList.add('is-hidden');

    var speed = parseFloat(ring.dataset.speed)||28; // seconds / revolution
    var tilt  = parseFloat(ring.dataset.tilt)||8;
    var radius = parseFloat(ring.dataset.radius)||0;
    var size  = parseInt(ring.dataset.size)||140;
    ring.style.setProperty('--es-tile-size', size+'px');

    function layout(){
      var count = tiles.length;
      // Auto radius if not specified: aim for no overlap (arc length ≈ tile width)
      var autoR = (size * count)/(2*Math.PI); // circumference ~ count * size
      if(!radius){ radius = Math.max(size*2, Math.min(autoR, size*count)); }
      var angleStep = 360 / count;
      stage.style.height = Math.max(size*2.4, radius*1.4) + 'px';

      ring.style.position='absolute';
      ring.style.top='50%'; ring.style.left='50%';
      ring.style.transformStyle='preserve-3d';
      ring.style.willChange='transform';

      tiles.forEach(function(tile,i){
        var angle = i*angleStep;
        tile.style.position='absolute';
        tile.style.top='50%'; tile.style.left='50%';
        tile.style.width=size+'px'; tile.style.height=size+'px';
        tile.style.transform='rotateY('+angle+'deg) translateZ('+radius+'px)';
        tile.style.backfaceVisibility='hidden';
      });
    }
    layout();
    stage.classList.add('is-ready');

    var start = performance.now();
    var paused=false, offscreen=false;

    ring.addEventListener('mouseenter', ()=>paused=true);
    ring.addEventListener('mouseleave', ()=>paused=false);
    ring.tabIndex=0;
    ring.addEventListener('keydown', function(e){
      if(e.key==='ArrowLeft' || e.key==='Left'){ start -= speed*160; e.preventDefault(); }
      else if(e.key==='ArrowRight' || e.key==='Right'){ start += speed*160; e.preventDefault(); }
    });

    if('IntersectionObserver' in window){
      new IntersectionObserver(function(entries){ entries.forEach(e=>offscreen=!e.isIntersecting); },{threshold:.05}).observe(stage);
    }

    function frame(now){
      if(!paused && !offscreen){
        var deg = ((now - start)/1000 / speed)*360 % 360;
        ring.style.transform = 'translate(-50%, -50%) rotateX('+tilt+'deg) translateZ(-'+radius+'px) rotateY('+deg+'deg)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Resize debounce
    var to;
    window.addEventListener('resize', function(){ clearTimeout(to); to=setTimeout(function(){ radius= parseFloat(ring.dataset.radius)||0; layout(); }, 160); });

    // Custom event
    stage.dispatchEvent(new CustomEvent('esRingReady',{detail:{ring:ring}}));
  }

  // Mutation observer for rings added later (e.g., block inserter)
  var mo = new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes && m.addedNodes.forEach(function(n){
        if(n.nodeType===1){ if(n.matches && n.matches('.es-ring')) initRing(n); n.querySelectorAll && n.querySelectorAll('.es-ring').forEach(initRing); }
      });
    });
  });
  onReady(function(){ initAll(); mo.observe(document.body,{childList:true,subtree:true}); });

})();
