/* Basic 3D Logo Ring (ES5, minimal) */
(function(){
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function supports3D(){
    var el=document.createElement('p');
    var has, props=['transform','WebkitTransform','msTransform','MozTransform','OTransform'];
    document.body.appendChild(el);
    for(var i=0;i<props.length;i++){ if(el.style[props[i]]!==undefined){ el.style[props[i]]='translateZ(1px)'; has=getComputedStyle(el).getPropertyValue(props[i]); break; } }
    document.body.removeChild(el); return !!has && has!=='none';
  }
  function init(){
    if(!supports3D()) return;
    var rings = document.querySelectorAll('.kc-basic-ring');
    for(var r=0;r<rings.length;r++){ initRing(rings[r]); }
  }
  function initRing(ring){
    if(ring.__basic) return; ring.__basic=1;
    var tiles = ring.querySelectorAll('.kc-basic-tile'); if(!tiles.length) return;
    var count = tiles.length;
    var theta = 360 / count;
    var size = parseInt(ring.getAttribute('data-size')||'110',10);
    var radius = parseInt(ring.getAttribute('data-radius')||'0',10);
    if(!radius){
      // derive radius from container width
      var w = ring.offsetWidth || ring.parentNode.offsetWidth || 800;
      radius = Math.max(size*1.6, Math.min(w*0.35, 700));
    }
    ring.setAttribute('data-resolved-radius', radius);
    // position tiles
    for(var i=0;i<count;i++){
      var tile=tiles[i];
      tile.style.position='absolute';
      tile.style.top='50%'; tile.style.left='50%';
      tile.style.width=size+'px'; tile.style.height=size+'px';
      tile.style.margin=(-(size/2))+'px 0 0 '+(-(size/2))+'px';
      tile.style.transform='rotateY('+ (i*theta) +'deg) translateZ('+radius+'px)';
    }
    var speed = parseFloat(ring.getAttribute('data-speed')||'28');
    var tilt = parseFloat(ring.getAttribute('data-tilt')||'10');
    var start = Date.now();
    function frame(){
      var elapsed = (Date.now()-start)/1000; // s
      var deg = (elapsed / speed)*360 % 360;
      ring.style.transform='translate(-50%, -50%) rotateX('+tilt+'deg) rotateY('+deg+'deg)';
      requestAnimationFrame(frame);
    }
    ring.style.position='absolute'; ring.style.top='50%'; ring.style.left='50%';
    ring.style.transformStyle='preserve-3d';
    requestAnimationFrame(frame);
  }
  ready(init);
})();
