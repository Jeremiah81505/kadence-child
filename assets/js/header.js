/**
 * Interactivity for the fancy header.
 * Handles sticky behaviour, mobile drawer and search overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body   = document.body;
  const header = document.getElementById('kc-header');
  const drawer = document.getElementById('kc-drawer');
  const burger = document.querySelector('.kc-burger');
  const drawerClose = document.querySelector('.kc-drawer-close');
  const searchOverlay = document.querySelector('.kc-search');
  const searchBtn   = document.querySelector('.kc-search-btn');
  const searchClose = document.querySelector('.kc-search-close');

  // Remove no-js marker and add js helper class
  body.classList.remove('no-js');
  body.classList.add('js');

  // Sticky header toggle
  const offset = (window.KC_HEADER && window.KC_HEADER.stickyOffset) || 64;
  const onScroll = () => {
    if (window.scrollY > offset) {
      header.classList.add('kc--stuck');
    } else {
      header.classList.remove('kc--stuck');
    }
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // Drawer helpers
  const toggleDrawer = (open) => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', String(!open));
    burger?.setAttribute('aria-expanded', String(open));
    if (open) {
      drawer.querySelector('a,button')?.focus();
    }
  };
  burger?.addEventListener('click', () => toggleDrawer(true));
  drawerClose?.addEventListener('click', () => toggleDrawer(false));
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) toggleDrawer(false);
  });

  // Search overlay helpers
  const toggleSearch = (open) => {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      searchOverlay.querySelector('input[type="search"]')?.focus();
    }
  };
  searchBtn?.addEventListener('click', () => toggleSearch(true));
  searchClose?.addEventListener('click', () => toggleSearch(false));
});
