<?php
/**
 * Title: Material Section (Premium)
 * Slug: kadence-child/material-section
 * Description: Premium materials grid section with animated chips, icons, tooltips, and accessibility.
 * Categories: kadence-child, featured
 */

<!-- wp:group {"align":"full","className":"kc-materials-card"} -->
<div class="wp-block-group alignfull kc-materials-card" aria-label="Countertop Materials">
  <!-- wp:heading {"level":2,"className":"kc-materials-heading"} -->
  <h2 class="kc-materials-heading">Premium Countertop Materials</h2>
  <!-- /wp:heading -->

  <!-- wp:group {"className":"kc-material-grid"} -->
  <div class="kc-material-grid" role="list">
    <a href="/quartz" class="kc-chip kc-quartz" tabindex="0" aria-label="Quartz" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Quartz Icon" class="kc-chip-icon" />
      <span class="kc-txt">Quartz</span>
      <span class="kc-chip-tooltip">Durable, non-porous, and beautiful. Perfect for busy kitchens.</span>
    </a>
    <a href="/natural-stone" class="kc-chip kc-stone" tabindex="0" aria-label="Natural Stone" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Natural Stone Icon" class="kc-chip-icon" />
      <span class="kc-txt">Natural Stone</span>
      <span class="kc-chip-tooltip">Timeless elegance and unique patterns. Granite, marble, and more.</span>
    </a>
    <a href="/solid-surface" class="kc-chip kc-solid" tabindex="0" aria-label="Solid Surface" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="Solid Surface Icon" class="kc-chip-icon" />
      <span class="kc-txt">Solid Surface</span>
      <span class="kc-chip-tooltip">Seamless, repairable, and versatile. Great for custom shapes.</span>
    </a>
    <a href="/ultra-compact" class="kc-chip kc-ultra" tabindex="0" aria-label="Ultra Compact" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Ultra Compact Icon" class="kc-chip-icon" />
      <span class="kc-txt">Ultra Compact</span>
      <span class="kc-chip-tooltip">Heat, scratch, and stain resistant. Modern and ultra-durable.</span>
    </a>
    <a href="/laminate" class="kc-chip kc-lam" tabindex="0" aria-label="Laminate" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Laminate Icon" class="kc-chip-icon" />
      <span class="kc-txt">Laminate</span>
      <span class="kc-chip-tooltip">Affordable, stylish, and easy to maintain. Endless color options.</span>
    </a>
    <a href="/sinks" class="kc-chip kc-sinks" tabindex="0" aria-label="Sinks" role="listitem">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="Sinks Icon" class="kc-chip-icon" />
      <span class="kc-txt">Sinks</span>
      <span class="kc-chip-tooltip">Premium undermount and drop-in sinks for every style.</span>
    </a>
  </div>
  <!-- /wp:group -->

  <style>
    .kc-material-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
    .kc-chip { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1b2433, #3e3052); color: #fff; border-radius: 14px; padding: 1.2rem 1rem; box-shadow: 0 6px 18px rgba(0,0,0,.18); text-decoration: none; font-weight: 700; transition: transform .25s, box-shadow .25s, background .25s; cursor: pointer; outline: none; }
    .kc-chip:focus, .kc-chip:hover { background: linear-gradient(135deg, #7a5cff, #563acc); transform: scale(1.07); box-shadow: 0 12px 32px rgba(111,125,255,.22); z-index: 2; }
    .kc-chip-icon { width: 54px; height: 54px; object-fit: contain; margin-bottom: .5rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,.12)); }
    .kc-txt { font-size: 1.08rem; margin-bottom: 0.2rem; }
    .kc-chip-tooltip { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(30,30,40,0.97); color: #fff; padding: 7px 18px; border-radius: 8px; font-size: 0.95rem; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 10; box-shadow: 0 2px 12px rgba(0,0,0,.18); }
    .kc-chip:focus .kc-chip-tooltip, .kc-chip:hover .kc-chip-tooltip { opacity: 1; }
    @media (max-width: 600px) { .kc-material-grid { gap: 12px; } .kc-chip { padding: 0.7rem 0.5rem; } .kc-chip-icon { width: 38px; height: 38px; } }
  </style>
</div>
<!-- /wp:group -->
'
        )
    );
}
