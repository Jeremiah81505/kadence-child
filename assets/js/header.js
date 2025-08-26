/**
 * Interactivity for the fancy header.
 * Handles sticky behaviour, mobile drawer and search overlay.
 */

document.addEventListener('DOMContentLoaded', function () {
  var header       = document.getElementById('kc-header');
  var drawer       = document.getElementById('kc-drawer');
  var burger       = document.querySelector('.kc-burger');
  var drawerClose  = document.querySelector('.kc-drawer-close');
  var searchOverlay= document.querySelector('.kc-search');
  var searchBtn    = document.querySelector('.kc-search-btn');
  var searchClose  = document.querySelector('.kc-search-close');

  // If header not present, nothing to wire
  if (!header) return;

  // Sticky header toggle
  var offset = (window.KC_HEADER && window.KC_HEADER.stickyOffset) || 64;
  function onScroll() {
    if ((window.pageYOffset || document.documentElement.scrollTop || 0) > offset) {
      header.classList.add('kc--stuck');
      header.classList.remove('kc-header--transparent');
    } else {
      header.classList.remove('kc--stuck');
      header.classList.add('kc-header--transparent');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll lock helpers
  function lockScroll() { document.documentElement.style.overflow = 'hidden'; }
  function unlockScroll() { document.documentElement.style.overflow = ''; }

  // Drawer helpers
  function toggleDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', String(!open));
    if (burger) burger.setAttribute('aria-expanded', String(open));
    if (open) {
      lockScroll();
      var focusTarget = drawer.querySelector('a,button');
      if (focusTarget) focusTarget.focus();
    } else {
      unlockScroll();
    }
  }
  if (burger) burger.addEventListener('click', function () { toggleDrawer(true); });
  if (drawerClose) drawerClose.addEventListener('click', function () { toggleDrawer(false); });
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target === drawer) toggleDrawer(false); });

  // Search overlay helpers
  function toggleSearch(open) {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      lockScroll();
      var input = searchOverlay.querySelector('input[type="search"]') ||
                  searchOverlay.querySelector('input[type="text"]');
      if (input) input.focus();
    } else {
      unlockScroll();
    }
  }
  if (searchBtn) searchBtn.addEventListener('click', function () { toggleSearch(true); });
  if (searchClose) searchClose.addEventListener('click', function () { toggleSearch(false); });
  if (searchOverlay) searchOverlay.addEventListener('click', function (e) { if (e.target === searchOverlay) toggleSearch(false); });

  // ESC closes drawer/search
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      toggleSearch(false);
    }
  });
});
