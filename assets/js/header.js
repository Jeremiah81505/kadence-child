/**
 * Interactivity for the fancy header.
 * Handles sticky behaviour, mobile drawer and search overlay.
 */

document.addEventListener('DOMContentLoaded', function () {
  var body   = document.body;
  var header = document.getElementById('kc-header');
  if (!header) {
    body.classList.remove('no-js');
    body.classList.add('js');
    return;
  }
  var drawer = document.getElementById('kc-drawer');
  var burger = document.querySelector('.kc-burger');
  var drawerClose = document.querySelector('.kc-drawer-close');
  var searchOverlay = document.querySelector('.kc-search');
  var searchBtn   = document.querySelector('.kc-search-btn');
  var searchClose = document.querySelector('.kc-search-close');

  // Remove no-js marker and add js helper class
  body.classList.remove('no-js');
  body.classList.add('js');

  // Sticky header toggle
  var offset = (window.KC_HEADER && window.KC_HEADER.stickyOffset) || 64;
  var onScroll = function () {
    var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (scrollY > offset) {
      header.classList.add('kc--stuck');
    } else {
      header.classList.remove('kc--stuck');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Drawer helpers
  var toggleDrawer = function (open) {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', String(!open));
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
    }
    if (open) {
      var focusable = drawer.querySelector('a,button');
      if (focusable) {
        focusable.focus();
      }
    }
  };
  if (burger) {
    burger.addEventListener('click', function () { toggleDrawer(true); });
  }
  if (drawerClose) {
    drawerClose.addEventListener('click', function () { toggleDrawer(false); });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) {
        toggleDrawer(false);
      }
    });
  }

  // Search overlay helpers
  var toggleSearch = function (open) {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      var input = searchOverlay.querySelector('input[type="search"]');
      if (input) {
        input.focus();
      }
    }
  };
  if (searchBtn) {
    searchBtn.addEventListener('click', function () { toggleSearch(true); });
  }
  if (searchClose) {
    searchClose.addEventListener('click', function () { toggleSearch(false); });
  }
});
