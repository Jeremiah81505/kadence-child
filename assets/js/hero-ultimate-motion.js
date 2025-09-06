(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.kc-hero-ultimate');
  if (!hero) return;

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
})();
