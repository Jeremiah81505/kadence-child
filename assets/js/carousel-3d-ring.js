// 3D Logo Carousel – Ring (Enhanced)
// Features: multi-instance support, visibility pause, reduced-motion fallback,
// dynamic radius (if none specified), hover pause, per-instance fallback, a11y.

(function() {
  document.addEventListener('DOMContentLoaded', initAll);

  function supports3D() {
    var el = document.createElement('p');
    var has3d;
    var transforms = {
      'webkitTransform':'-webkit-transform',
      'OTransform':'-o-transform',
      'msTransform':'-ms-transform',
      'MozTransform':'-moz-transform',
      'transform':'transform'
    };
    document.body.appendChild(el);
    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = 'translateZ(1px)';
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        break;
      }
    }
    document.body.removeChild(el);
    return (has3d && has3d !== 'none');
  }

  function initAll() {
    var rings = document.querySelectorAll('.es-ring');
    if (!rings.length) return;
    var enable3D = supports3D();
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    rings.forEach(function(ring, idx) {
      initRing(ring, { enable3D: enable3D, reduce: reduce, index: idx });
    });
  }

  function initRing(ring, ctx) {
    var stage = ring.closest('.es-stage');
    if (!stage) return;
    var fallback = stage.parentElement.querySelector('.es-fallback');
    var tiles = ring.querySelectorAll('.es-tile');
    if (!tiles.length) return;

    // Accessibility region labeling
    stage.setAttribute('role', 'region');
    stage.setAttribute('aria-label', stage.getAttribute('aria-label') || 'Logo carousel');
    ring.setAttribute('aria-hidden', ctx.enable3D ? 'false' : 'true');

    // Determine geometry
    var speed = parseFloat(ring.dataset.speed) || 28; // seconds per revolution
    var tilt = parseFloat(ring.dataset.tilt) || 8;
    var radius = parseFloat(ring.dataset.radius);
    if (!radius) {
      // Derive from container width for responsiveness
      var w = stage.clientWidth || 1200;
      radius = Math.max(320, Math.min(680, w / 2.4));
    }
    var count = tiles.length;
    var angleStep = 360 / count;

    if (!ctx.enable3D || ctx.reduce) {
      // Fallback: show grid
      if (fallback) fallback.classList.remove('is-hidden');
      stage.classList.add('is-ready');
      return;
    }

    // Set explicit stage height based on derived radius so content reserves space
    stage.style.height = (radius * 1.25) + 'px';

    // Position ring (centered) and tiles
    ring.style.position = 'absolute';
    ring.style.top = '50%';
    ring.style.left = '50%';
    ring.style.transformStyle = 'preserve-3d';
    ring.style.willChange = 'transform';

    tiles.forEach(function(tile, i) {
      var angle = i * angleStep;
      tile.style.position = 'absolute';
      tile.style.top = '50%';
      tile.style.left = '50%';
      tile.style.transform = 'rotateY(' + angle + 'deg) translateZ(' + radius + 'px)';
      tile.style.transformOrigin = 'center center ' + (-radius) + 'px';
      tile.style.backfaceVisibility = 'hidden';
      tile.style.willChange = 'transform';
    });
    stage.classList.add('is-ready');

    // Base transform (excluding rotation around Y which is animated)
    var base = 'translate(-50%, -50%) rotateX(' + tilt + 'deg) translateZ(-' + radius + 'px)';
    var start = performance.now();
    var paused = false;
    var offscreen = false;

    // Hover pause
    ring.addEventListener('mouseenter', function(){ paused = true; });
    ring.addEventListener('mouseleave', function(){ paused = false; });

    // Visibility / intersection pause
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){ offscreen = !e.isIntersecting; });
      }, { threshold: 0.10 });
      io.observe(stage);
    }

    // Keyboard nudge for accessibility (Left/Right arrows)
    ring.tabIndex = 0;
    ring.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        start -= speed * 100; // rotate backwards a bit
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        start += speed * 100; // rotate forwards
        e.preventDefault();
      }
    });

    function frame(now) {
      if (!paused && !offscreen) {
        var elapsed = (now - start) / 1000; // seconds
        var deg = (elapsed / speed) * 360 % 360;
        ring.style.transform = base + ' rotateY(' + deg + 'deg)';
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // Hide fallback for 3D case
    if (fallback) fallback.classList.add('is-hidden');

    // Dispatch custom event
    var evt = new CustomEvent('esRingReady', { detail: { ring: ring } });
    stage.dispatchEvent(evt);
  }
})();
