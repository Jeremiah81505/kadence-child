<?php
/**
 * Title: 3D Logo Carousel – Basic Debug
 * Slug: kadence-child/carousel-3d-ring-basic
 * Categories: kadence-child
 * Description: Simplest possible 3D ring (no depth scaling) for debugging. If this renders, advanced script conflict is isolated.
 */
?>
<!-- wp:group {"className":"kc-basic-ring-wrap","layout":{"type":"constrained","contentSize":"1400px"}} -->
<div class="wp-block-group kc-basic-ring-wrap">
  <!-- wp:html -->
  <div style="position:relative;height:380px;">
    <div class="kc-basic-stage" style="position:absolute;inset:0;perspective:1400px;perspective-origin:50% 50%;">
      <div class="kc-basic-ring" data-speed="30" data-tilt="10" data-size="120">
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
        <div class="kc-basic-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
      </div>
    </div>
  </div>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:html -->
<style>
.kc-basic-ring-wrap img{max-width:100%;max-height:100%;object-fit:contain;}
.kc-basic-ring{position:absolute;top:50%;left:50%;}
.kc-basic-tile{background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(0,0,0,.18),0 3px 8px rgba(0,0,0,.15);}
</style>
<!-- /wp:html -->
