<?php
/**
 * Title: Materials Grid
 * Slug: kadence-child/es-mats-grid
 * Categories: kadence-child, elevated
 * Description: Six-card materials navigation grid with vertical labels and scroll reveal animation.
 */
?>
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group">
<!-- wp:html -->
<div id="es-mats" data-replay="true" data-stagger="140" style="max-width:1440px;margin:0 auto;padding:6px;color:#fff;font-family:inherit;">

  <div class="es-grid" style="display:grid;gap:18px;grid-template-columns:1.35fr 1fr 1fr;grid-template-rows:320px 260px 260px;">

    <!-- QUARTZ (hero: col 1, rows 1–2) -->
    <a href="https://elevatedcountertopexperts.com/quartz/" class="es-card" data-dir="left" style="grid-column:1/2;grid-row:1/3;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg" alt="<?php echo esc_attr__( 'Quartz countertop', 'kadence-child' ); ?>">
      <span class="vtag"><?php echo esc_html__( 'Quartz', 'kadence-child' ); ?></span>
    </a>

    <!-- NATURAL STONE (top-right #1) — down 20% -->
    <a href="https://elevatedcountertopexperts.com/natural-stone/" class="es-card" data-dir="up" style="grid-column:2/3;grid-row:1/2;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg" alt="<?php echo esc_attr__( 'Natural stone countertop', 'kadence-child' ); ?>" style="object-position:50% 88%;">
      <span class="vtag"><?php echo esc_html__( 'Natural Stone', 'kadence-child' ); ?></span>
    </a>

    <!-- SOLID SURFACE (top-right #2) -->
    <a href="https://elevatedcountertopexperts.com/solid-surface/" class="es-card" data-dir="down" style="grid-column:3/4;grid-row:1/2;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Solid-Surface-1.jpg" alt="<?php echo esc_attr__( 'Solid surface countertop', 'kadence-child' ); ?>" style="object-position:50% 55%;">
      <span class="vtag"><?php echo esc_html__( 'Solid Surface', 'kadence-child' ); ?></span>
    </a>

    <!-- ULTRA COMPACT (middle wide) — tagged .ultra -->
    <a href="https://elevatedcountertopexperts.com/ultra-compact/" class="es-card ultra" data-dir="right" style="grid-column:2/4;grid-row:2/3;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-Countertops.avif" alt="<?php echo esc_attr__( 'Ultra compact surface', 'kadence-child' ); ?>" style="object-position:50% 82%;">
      <span class="vtag vtag--right"><?php echo esc_html__( 'Ultra Compact', 'kadence-child' ); ?></span>
    </a>

    <!-- LAMINATE (bottom-left wide) — way down -->
    <a href="https://elevatedcountertopexperts.com/laminate/" class="es-card" data-dir="up" style="grid-column:1/3;grid-row:3/4;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-7404-Neapolitan-Stone-3-scaled_4aaa1f1a-c749-4986-97ce-57f9ddcdcf1b_1080x.webp" alt="<?php echo esc_attr__( 'Laminate countertop', 'kadence-child' ); ?>" style="object-position:50% 92%;">
      <span class="vtag"><?php echo esc_html__( 'Laminate', 'kadence-child' ); ?></span>
    </a>

    <!-- SINKS (bottom-right) -->
    <a href="https://elevatedcountertopexperts.com/sinks/" class="es-card" data-dir="left" style="grid-column:3/4;grid-row:3/4;">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="<?php echo esc_attr__( 'Kitchen sinks', 'kadence-child' ); ?>" style="object-position:50% 62%;">
      <span class="vtag"><?php echo esc_html__( 'Sinks', 'kadence-child' ); ?></span>
    </a>

  </div>

  <style>
    /* Cards */
    #es-mats .es-card{position:relative;display:block;width:100%;height:100%;border-radius:18px;overflow:hidden;text-decoration:none;color:#fff;background:#000;box-shadow:0 8px 28px rgba(0,0,0,.35);opacity:0;transform:translateY(28px) scale(.98);transition:transform .70s cubic-bezier(.22,.67,.38,1),opacity .70s cubic-bezier(.22,.67,.38,1);will-change:transform,opacity;isolation:isolate;}
    #es-mats .es-card img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(1.02) contrast(1.02);}
    #es-mats .es-card::before{content:"";position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(0,0,0,.32) 0%,rgba(0,0,0,.50) 100%),radial-gradient(120% 100% at 110% -10%,rgba(255,255,255,.18),rgba(255,255,255,0) 45%);pointer-events:none;}
    #es-mats .es-card::after{content:"";position:absolute;inset:-20% -40%;transform:skewX(-18deg) translateX(-120%);background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 50%,rgba(255,255,255,0) 100%);mix-blend-mode:soft-light;filter:blur(6px);opacity:.0;z-index:1;pointer-events:none;}
    #es-mats .es-card._in::after{animation:es-sheen .9s .25s ease forwards;}
    @keyframes es-sheen{to{transform:skewX(-18deg) translateX(120%);opacity:.55;}}

    /* Vertical labels */
    #es-mats .vtag{position:absolute;left:10px;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;white-space:nowrap;line-height:1;background:#111;color:#fff;border-radius:999px;padding:10px 9px;font-weight:800;letter-spacing:.6px;box-shadow:0 6px 22px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.15);z-index:2;}
    #es-mats .vtag.vtag--right{left:auto;right:10px;}

    /* Scroll-reveal */
    #es-mats .es-card[data-dir="left"]{transform:translateX(-44px) scale(.98);}
    #es-mats .es-card[data-dir="right"]{transform:translateX(44px) scale(.98);}
    #es-mats .es-card[data-dir="up"]{transform:translateY(-44px) scale(.98);}
    #es-mats .es-card[data-dir="down"]{transform:translateY(44px) scale(.98);}
    #es-mats .es-card._in{opacity:1;transform:none;}
    #es-mats .es-card{transition-delay:var(--delay,0ms);}

    /* Ultra Compact responsive focal point */
    #es-mats .ultra img{object-position:50% 82% !important;}
    @media (max-width:1024px){ #es-mats .ultra img{object-position:50% 80% !important;} }

    @media (prefers-reduced-motion:reduce){
      #es-mats .es-card{opacity:1!important;transform:none!important;transition:none!important;}
      #es-mats .es-card._in::after{animation:none;}
    }
    @media (max-width:1024px){ #es-mats .es-grid{grid-template-columns:1fr 1fr;} }
    @media (max-width:640px){ #es-mats .es-grid{grid-template-columns:1fr;gap:16px;} #es-mats .es-card{height:240px;} }
  </style>

  <script>
    document.addEventListener('DOMContentLoaded',function(){
      var root=document.getElementById('es-mats'); if(!root) return;
      var cards=[].slice.call(root.querySelectorAll('.es-card'));
      var replay=(root.getAttribute('data-replay')||'true').toLowerCase()==='true';
      var stagger=parseInt(root.getAttribute('data-stagger')||'140',10);
      cards.forEach(function(c,i){ c.style.setProperty('--delay',(i*stagger)+'ms'); });
      try{
        var io=new IntersectionObserver(function(entries){
          entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('_in'); } else if(replay){ e.target.classList.remove('_in'); } });
        },{threshold:0.18});
        cards.forEach(function(c){ io.observe(c); });
      }catch(e){ cards.forEach(function(c){ c.classList.add('_in'); }); }
    });
  </script>

  <noscript><style>#es-mats .es-card{opacity:1!important;transform:none!important}</style></noscript>
</div>
<!-- /wp:html -->
</section>
<!-- /wp:group -->
