(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.kc-hero-ultimate');
  if (!hero) return;

  /* Background parallax (scroll) & color wash dynamic hue */
  const bgImg = hero.querySelector('.wp-block-cover__image-background');
  const wash  = hero.querySelector('.kc-colorwash');
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
    }
  }
})();
