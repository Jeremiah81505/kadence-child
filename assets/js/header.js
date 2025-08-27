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
  const themeToggle   = document.querySelector('.kc-theme-toggle');
  const themeIcon     = themeToggle?.querySelector('use');

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

  // ESC closes drawer/search
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      toggleSearch(false);
    }
  });

  // Theme toggle
  const root = document.documentElement;
  const applyTheme = (mode) => {
    root.setAttribute('data-theme', mode);
    localStorage.setItem('kc-theme', mode);
    themeIcon?.setAttribute('href', mode === 'light' ? '#ico-moon' : '#ico-sun');
    themeToggle?.setAttribute('aria-label', mode === 'light' ? 'Activate dark mode' : 'Activate light mode');
  };
  const storedTheme = localStorage.getItem('kc-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(storedTheme);
  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
});

