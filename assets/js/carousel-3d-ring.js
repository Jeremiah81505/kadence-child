// 3D Logo Carousel – Ring
// Rotates logos in a 3D ring, with autoplay and hover pause

document.addEventListener('DOMContentLoaded', function() {
  var ring = document.querySelector('.es-ring');
  if (!ring) return;

  var tiles = ring.querySelectorAll('.es-tile');
  var speed = parseFloat(ring.dataset.speed) || 28; // seconds per revolution
  var radius = parseFloat(ring.dataset.radius) || 560;
  var tilt = parseFloat(ring.dataset.tilt) || 8;
  var count = tiles.length;
  var angleStep = 360 / count;
  var start = Date.now();
  var paused = false;

  // Position tiles in a ring
  tiles.forEach(function(tile, i) {
    var angle = i * angleStep;
    tile.style.position = 'absolute';
    tile.style.transform =
      'rotateY(' + angle + 'deg) translateZ(' + radius + 'px) rotateX(' + tilt + 'deg)';
    tile.style.backfaceVisibility = 'hidden';
  });
  ring.style.position = 'relative';
  ring.style.transformStyle = 'preserve-3d';
  ring.style.height = (radius * 2 * 0.6) + 'px';

  // Animate rotation
  function animate() {
    if (!paused) {
      var elapsed = (Date.now() - start) / 1000;
      var deg = (elapsed / speed) * 360 % 360;
      ring.style.transform =
        'translateZ(-' + radius + 'px) rotateY(' + deg + 'deg)';
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Pause on hover
  ring.addEventListener('mouseenter', function() { paused = true; });
  ring.addEventListener('mouseleave', function() { paused = false; });

  // Show fallback if 3D not supported
  var fallback = document.querySelector('.es-fallback');
  var is3DSupported = (function() {
    var el = document.createElement('p');
    var has3d;
    var transforms = {
      'webkitTransform':'-webkit-transform',
      'OTransform':'-o-transform',
      'msTransform':'-ms-transform',
      'MozTransform':'-moz-transform',
      'transform':'transform'
    };
    document.body.insertBefore(el, null);
    for(var t in transforms){
      if( el.style[t] !== undefined ){
        el.style[t] = 'translateZ(1px)';
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }
    document.body.removeChild(el);
    return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
  })();
  if (!is3DSupported && fallback) {
    fallback.classList.remove('is-hidden');
    ring.parentNode.removeChild(ring);
  } else if (fallback) {
    fallback.classList.add('is-hidden');
  }
});
