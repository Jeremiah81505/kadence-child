/**
 * Interactivity for the fancy header.
 * Handles sticky behaviour, mobile drawer and search overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body         = document.body;
  const header       = document.getElementById('kc-header');
  const drawer       = document.getElementById('kc-drawer');
  const burger       = document.querySelector('.kc-burger');
  const drawerClose  = document.querySelector('.kc-drawer-close');
  const searchOverlay= document.querySelector('.kc-search');
  const searchBtn    = document.querySelector('.kc-search-btn');
  const searchClose  = document.querySelector('.kc-search-close');

  // JS helpers
  body.classList.remove('no-js');
  body.classList.add('js');

  // If header not present, nothing to wire
  if (!header) return;

  // Sticky header toggle
  const offset = (window.KC_HEADER && window.KC_HEADER.stickyOffset) || 64;
  const onScroll = () => {
    if ((window.pageYOffset || document.documentElement.scrollTop || 0) > offset) {
      header.classList.add('kc--stuck');
      header.classList.remove('kc-header--transparent');
    } else {
      header.classList.remove('kc--stuck');
      header.classList.add('kc-header--transparent');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll lock helpers
  const lockScroll = () => { document.documentElement.style.overflow = 'hidden'; };
  const unlockScroll = () => { document.documentElement.style.overflow = ''; };

  // Drawer helpers
  const toggleDrawer = (open) => {
    if (!drawer) return;
    drawer.setAttribute('aria-hidden', String(!open));
    burger?.setAttribute('aria-expanded', String(open));
    if (open) {
      lockScroll();
      drawer.querySelector('a,button')?.focus();
    } else {
      unlockScroll();
    }
  };
  burger?.addEventListener('click', () => toggleDrawer(true));
  drawerClose?.addEventListener('click', () => toggleDrawer(false));
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) toggleDrawer(false); });

  // Search overlay helpers
  const toggleSearch = (open) => {
    if (!searchOverlay) return;
    searchOverlay.setAttribute('aria-hidden', String(!open));
    if (open) {
      lockScroll();
      (searchOverlay.querySelector('input[type="search"]') ||
       searchOverlay.querySelector('input[type="text"]'))?.focus();
    } else {
      unlockScroll();
    }
  };
  searchBtn?.addEventListener('click', () => toggleSearch(true));
  searchClose?.addEventListener('click', () => toggleSearch(false));
  searchOverlay?.addEventListener('click', (e) => { if (e.target === searchOverlay) toggleSearch(false); });

  // ESC closes drawer/search
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      toggleSearch(false);
    }
  });
});
