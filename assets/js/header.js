/**
 * Interactivity for the fancy header.
 * Handles sticky behaviour, mobile drawer and search overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
  const body          = document.body;
  const header        = document.getElementById('kc-header');
  const drawer        = document.getElementById('kc-drawer');
  const burger        = document.querySelector('.kc-burger');
  const drawerClose   = document.querySelector('.kc-drawer-close');
  const searchOverlay = document.querySelector('.kc-search');
  const searchBtn     = document.querySelector('.kc-search-btn');
  const searchClose   = document.querySelector('.kc-search-close');

  // JS helpers
  body.classList.remove('no-js');
  body.classList.add('js');

  // If header not present, nothing to wire
  if (!header) return;

  // Sticky header toggle
  const offset = (window.KC_HEADER && window.KC_HEADER.stickyOffset) || 64;
  const onScroll = () => {
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (y > offset) {
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

  // Submenu toggles
  const menuButtons = header.querySelectorAll('.kc-nav .menu-item-has-children > button');
  menuButtons.forEach((btn) => {
    const li = btn.parentElement;
    const close = () => btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      menuButtons.forEach((b) => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!expanded));
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      } else if (e.key === 'Escape') {
        close();
      }
    });

    li?.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget)) {
        close();
      }
    });

    const submenu = document.getElementById(btn.getAttribute('aria-controls'));
    submenu?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        btn.focus();
      }
    });
  });

  // ESC closes drawer/search
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      toggleSearch(false);
      menuButtons.forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
    }
  });
});

