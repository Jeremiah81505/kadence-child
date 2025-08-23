document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('es-mats');
  if (!root) return;

  // Opt-in animations only when JS is available
  root.classList.add('es-animate');

  var cards = Array.prototype.slice.call(root.querySelectorAll('.es-card'));
  var replay  = (root.getAttribute('data-replay')  || 'true').toLowerCase() === 'true';
  var stagger = parseInt(root.getAttribute('data-stagger') || '140', 10);

  cards.forEach(function (c, i) { c.style.setProperty('--delay', (i * stagger) + 'ms'); });

  try {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('_in');
        else if (replay) e.target.classList.remove('_in');
      });
    }, { threshold: 0.18 });
    cards.forEach(function (c) { io.observe(c); });
  } catch (err) {
    cards.forEach(function (c) { c.classList.add('_in'); });
  }
});
