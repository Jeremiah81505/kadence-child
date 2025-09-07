(() => {
  const VERSION = 'hero-motion:2025-09-06T2';
  const debug = /[?&]kc_hero_debug=1/.test(location.search);
  if (debug) {
    console.info('[KC HERO]', VERSION, 'debug mode ON');
  } else {
    console.log('[KC HERO]', VERSION);
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.kc-hero-ultimate');
  if (!hero) return;

  /* Runtime upgrade: if legacy hero instance lacks data-enhanced + layers, add them */
  if (!hero.hasAttribute('data-enhanced')) {
    hero.setAttribute('data-enhanced', 'true');
    // Color wash layer
    if (!hero.querySelector('.kc-colorwash')) {
      const washLayer = document.createElement('div');
      washLayer.className = 'kc-colorwash';
      washLayer.setAttribute('aria-hidden', 'true');
      const bgRef = hero.querySelector('.wp-block-cover__image-background');
      if (bgRef && bgRef.parentNode) {
        bgRef.insertAdjacentElement('afterend', washLayer);
      } else {
        hero.insertBefore(washLayer, hero.firstChild);
      }
    }
    // Floating blobs
    if (!hero.querySelector('.kc-float')) {
      const wrap = hero.querySelector('.kc-hero-wrap') || hero;
      ['a','b','c'].forEach(cls => {
        const blob = document.createElement('div');
        blob.className = 'kc-float ' + cls;
        blob.setAttribute('aria-hidden','true');
        wrap.appendChild(blob);
      });
    }
  }

  /* Background parallax (scroll) & color wash dynamic hue */
  if (debug) hero.classList.add('kc-hero-debug');
  const bgImg = hero.querySelector('.wp-block-cover__image-background');
  const wash  = hero.querySelector('.kc-colorwash');
  if (debug) {
    console.log('[KC HERO] initial state', {
      enhanced: hero.getAttribute('data-enhanced'),
      hasWash: !!wash,
      hasBlobs: hero.querySelectorAll('.kc-float').length,
      bgImg: !!bgImg
    });
  }
  const onScroll = () => {
    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = 1 - Math.min(Math.max((rect.bottom)/ (vh + rect.height), 0), 1); // 0 top in view -> 1 scrolled past
    if(bgImg){
      const y = progress * 40; // shift image for depth
      bgImg.style.transform = `translateY(${y}px) scale(1.05)`;
    }
    if(wash){
      const hue = 200 + progress * 140; // 200 -> 340
      wash.style.setProperty('--kc-wash-hue', hue.toFixed(1));
      wash.style.opacity = (0.35 + progress * 0.25).toFixed(3);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
  if (debug) console.log('[KC HERO] scroll handler attached');

  /* Staggered reveal */
  const items = hero.querySelectorAll('.kc-hero-title, .kc-hero-sub, .kc-hero-ctas, .kc-materials-card, .kc-material-grid .kc-chip');
  if (!reduce && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((ents)=>{
      ents.forEach((e)=>{
        if(e.isIntersecting){
          e.target.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1), opacity .45s ease';
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0) scale(1)';
          io.unobserve(e.target);
        }
      });
    },{rootMargin:'0px 0px -10% 0px', threshold:.15});
    items.forEach((el,i)=>{
      el.style.opacity='0'; el.style.transform='translateY(14px) scale(.98)';
      setTimeout(()=>io.observe(el), i*70);
    });
  if (debug) console.log('[KC HERO] IO observing', items.length, 'elements');
  }

  /* Magnetic hover + ripple for chips & CTAs */
  if (!reduce){
    const mags = hero.querySelectorAll('.kc-chip, .kc-hero-ctas .wp-block-button__link');
    mags.forEach((el)=>{
      const strength = 10;
      el.style.willChange='transform';
      el.addEventListener('mousemove',(e)=>{
        const r = el.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*2;
        const y=((e.clientY-r.top)/r.height-.5)*2;
        el.style.transform=`translate(${x*strength}px, ${y*strength}px)`;
      });
      const reset=()=>{ el.style.transform=''; };
      el.addEventListener('mouseleave', reset);
      el.addEventListener('blur', reset);

      // ripple
      el.style.position = getComputedStyle(el).position==='static' ? 'relative' : getComputedStyle(el).position;
      el.style.overflow='hidden';
      el.addEventListener('click',(e)=>{
        const r=el.getBoundingClientRect(), s=document.createElement('span');
        s.className='kc-ripple'; s.style.left=(e.clientX-r.left)+'px'; s.style.top=(e.clientY-r.top)+'px';
        el.appendChild(s); s.addEventListener('animationend',()=>s.remove());

        // spark burst (6 particles)
        for(let i=0;i<6;i++){ const p=document.createElement('span'); p.className='kc-spark'; const ang=Math.random()*Math.PI*2; const dist=14+Math.random()*22; p.style.setProperty('--sx', (Math.cos(ang)*dist).toFixed(2)+'px'); p.style.setProperty('--sy',(Math.sin(ang)*dist).toFixed(2)+'px'); p.style.left=(e.clientX-r.left)+'px'; p.style.top=(e.clientY-r.top)+'px'; el.appendChild(p); p.addEventListener('animationend',()=>p.remove()); }
      });
    });
  }

  /* Subtle parallax on mouse move for hero wrapper */
  if (!reduce){
    const wrap = hero.querySelector('.kc-hero-wrap');
    if(wrap){
      let rect; const updateRect=()=>{ rect=wrap.getBoundingClientRect(); };
      updateRect(); window.addEventListener('resize', updateRect);
      window.addEventListener('mousemove', (e)=>{
        if(!rect) return; const cx=rect.left+rect.width/2; const cy=rect.top+rect.height/2; const dx=(e.clientX-cx)/rect.width; const dy=(e.clientY-cy)/rect.height; wrap.style.transform=`translate3d(${dx*12}px, ${dy*8}px, 0)`; });
      hero.addEventListener('mouseleave', ()=>{ wrap.style.transform=''; });
    }
  }

  /* Floating organic blobs (decor) */
  if(!reduce){
    const blobs = hero.querySelectorAll('.kc-float');
    blobs.forEach((b,i)=>{
      const speed = 12000 + Math.random()*8000;
      const driftX = 12 + Math.random()*18;
      const driftY = 10 + Math.random()*14;
      const scale = 0.8 + Math.random()*0.6;
      b.style.setProperty('--fx-speed', speed+'ms');
      b.style.setProperty('--fx-dx', driftX+'px');
      b.style.setProperty('--fx-dy', driftY+'px');
      b.style.setProperty('--fx-scale', scale);
      b.classList.add('is-float');
    });
  }

  /* Animated gradient text hue rotation (CSS variable tick) */
  if(!reduce){
    const gradientWord = hero.querySelector('.kc-title .kc-gradient');
    if(gradientWord){
      let hue = 0; const tick=()=>{ hue=(hue+0.35)%360; gradientWord.style.setProperty('--kc-grad-hue', hue.toFixed(1)); requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
        if (debug) console.log('[KC HERO] gradient animation started');
    }
  }
    if (debug) {
      // Fallback visual if CSS file missing (no computed mix-blend-mode on colorwash)
      try {
        const hasStyles = wash && getComputedStyle(wash).mixBlendMode !== 'normal';
        if (!hasStyles) {
          console.warn('[KC HERO] CSS enhancement likely missing. Injecting minimal fallback styles.');
          const style = document.createElement('style');
          style.textContent = `.kc-hero-debug{background:#0a0f18;color:#fff;} .kc-hero-debug .kc-colorwash{background:linear-gradient(120deg,rgba(80,120,255,.4),rgba(125,226,209,.35));position:absolute;inset:0;}`;
          document.head.appendChild(style);
        }
      } catch(e){ console.warn('[KC HERO] style probe failed', e); }
    }
})();
