<?php
/**
 * Title: Materials Grid (Premium)
 * Slug: kadence-child/es-mats-grid
 * Categories: kadence-child, elevated
 * Description: Premium six-card materials navigation grid with vertical labels, animated scroll reveal, and accessibility.
 */

if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/es-mats-grid',
        array(
            'title'       => __( 'Materials Grid (Premium)', 'kadence-child' ),
            'description' => __( 'Premium six-card materials navigation grid with vertical labels, animated scroll reveal, and accessibility.', 'kadence-child' ),
            'categories'  => array( 'kadence-child', 'elevated' ),
            'content'     => '
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group" aria-label="Materials Grid">
  <div id="es-mats" data-replay="true" data-stagger="140" style="max-width:1440px;margin:0 auto;padding:6px;color:#fff;font-family:inherit;">
    <div class="es-grid" style="display:grid;gap:18px;grid-template-columns:1.35fr 1fr 1fr;grid-template-rows:320px 260px 260px;">
      <a href="/quartz" class="es-card" data-dir="left" style="grid-column:1/2;grid-row:1/3;" tabindex="0" aria-label="Quartz">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg" alt="Quartz countertop">
        <span class="vtag">Quartz</span>
      </a>
      <a href="/natural-stone" class="es-card" data-dir="up" style="grid-column:2/3;grid-row:1/2;" tabindex="0" aria-label="Natural Stone">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg" alt="Natural stone countertop" style="object-position:50% 88%;">
        <span class="vtag">Natural Stone</span>
      </a>
      <a href="/solid-surface" class="es-card" data-dir="down" style="grid-column:3/4;grid-row:1/2;" tabindex="0" aria-label="Solid Surface">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Solid-Surface-1.jpg" alt="Solid surface countertop" style="object-position:50% 55%;">
        <span class="vtag">Solid Surface</span>
      </a>
      <a href="/ultra-compact" class="es-card ultra" data-dir="right" style="grid-column:2/4;grid-row:2/3;" tabindex="0" aria-label="Ultra Compact">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-Countertops.avif" alt="Ultra compact surface" style="object-position:50% 82%;">
        <span class="vtag vtag--right">Ultra Compact</span>
      </a>
      <a href="/laminate" class="es-card" data-dir="up" style="grid-column:1/3;grid-row:3/4;" tabindex="0" aria-label="Laminate">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-7404-Neapolitan-Stone-3-scaled_4aaa1f1a-c749-4986-97ce-57f9ddcdcf1b_1080x.webp" alt="Laminate countertop" style="object-position:50% 92%;">
        <span class="vtag">Laminate</span>
      </a>
      <a href="/sinks" class="es-card" data-dir="left" style="grid-column:3/4;grid-row:3/4;" tabindex="0" aria-label="Sinks">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="Kitchen sinks" style="object-position:50% 62%;">
        <span class="vtag">Sinks</span>
      </a>
    </div>
    <style>
      #es-mats .es-card{position:relative;display:block;width:100%;height:100%;border-radius:18px;overflow:hidden;text-decoration:none;color:#fff;background:#000;box-shadow:0 8px 28px rgba(0,0,0,.35);opacity:0;transform:translateY(28px) scale(.98);transition:transform .70s cubic-bezier(.22,.67,.38,1),opacity .70s cubic-bezier(.22,.67,.38,1);will-change:transform,opacity;isolation:isolate;outline:none;}
      #es-mats .es-card:focus, #es-mats .es-card:hover{box-shadow:0 16px 40px rgba(111,125,255,.22);transform:scale(1.04);z-index:2;}
      #es-mats .es-card img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(1.02) contrast(1.02);}
      #es-mats .es-card::before{content:"";position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(0,0,0,.32) 0%,rgba(0,0,0,.50) 100%),radial-gradient(120% 100% at 110% -10%,rgba(255,255,255,.18),rgba(255,255,255,0) 45%);pointer-events:none;}
      #es-mats .es-card::after{content:"";position:absolute;inset:-20% -40%;transform:skewX(-18deg) translateX(-120%);background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 50%,rgba(255,255,255,0) 100%);mix-blend-mode:soft-light;filter:blur(6px);opacity:.0;z-index:1;pointer-events:none;}
      #es-mats .es-card._in::after{animation:es-sheen .9s .25s ease forwards;}
      @keyframes es-sheen{to{transform:skewX(-18deg) translateX(120%);opacity:.55;}}
      #es-mats .vtag{position:absolute;left:10px;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;white-space:nowrap;line-height:1;background:#111;color:#fff;border-radius:999px;padding:10px 9px;font-weight:800;letter-spacing:.6px;box-shadow:0 6px 22px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.15);z-index:2;}
      #es-mats .vtag.vtag--right{left:auto;right:10px;}
      #es-mats .es-card[data-dir="left"]{transform:translateX(-44px) scale(.98);}
      #es-mats .es-card[data-dir="right"]{transform:translateX(44px) scale(.98);}
      #es-mats .es-card[data-dir="up"]{transform:translateY(-44px) scale(.98);}
      #es-mats .es-card[data-dir="down"]{transform:translateY(44px) scale(.98);}
      #es-mats .es-card._in{opacity:1;transform:none;}
      @media (max-width: 600px) { .es-grid { gap: 12px; } .es-card { border-radius: 10px; } .vtag { padding: 7px 6px; font-size: 0.95rem; } }
    </style>
  </div>
</section>
<!-- /wp:group -->
'
        )
    );
}
