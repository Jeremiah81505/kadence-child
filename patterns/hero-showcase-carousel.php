<?php
/**
 * Title: Hero — Showcase (with Carousel)
 * Slug: kadence-child/hero-showcase-carousel
 * Categories: kadence-child, featured
 * Description: Hero showcase with headline, category cards, CTA bar and integrated 3D logo ring.
 */
?>
<!-- wp:group {"tagName":"section","className":"kc-hero-showcase","layout":{"type":"constrained","contentSize":"1900px"}} -->
<section class="wp-block-group kc-hero-showcase" aria-label="<?php esc_attr_e( 'Premium Countertops Hero', 'kadence-child' ); ?>">
  <div class="kc-hero-bg" style="--hero-bg:url('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg');"></div>
  <div class="kc-hero-scrim"></div>
  <!-- wp:group {"className":"kc-hero-wrap","layout":{"type":"constrained","contentSize":"1900px"}} -->
  <div class="wp-block-group kc-hero-wrap">
    <!-- wp:group {"className":"kc-hero-grid","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
    <div class="wp-block-group kc-hero-grid">
      <!-- wp:group {"className":"kc-hero-left","layout":{"type":"constrained"}} -->
      <div class="wp-block-group kc-hero-left">
        <p class="kc-eyebrow"><?php esc_html_e( 'Countertops for every space · Wisconsin', 'kadence-child' ); ?></p>
        <h1 class="kc-heading">
          <?php esc_html_e( 'Premium Countertops', 'kadence-child' ); ?>
          <span class="kc-break"><?php esc_html_e( 'without the Premium', 'kadence-child' ); ?></span>
          <span class="kc-highlight"><?php esc_html_e( 'Headache.', 'kadence-child' ); ?></span>
        </h1>
        <p class="kc-sub"><?php esc_html_e( 'Shop quartz, natural stone, solid surface, laminate, and ultra-compact materials—installed by local pros. Precise fabrication, seamless installs, and free in-home measures.', 'kadence-child' ); ?></p>
        <nav class="kc-cta-row" aria-label="<?php esc_attr_e( 'Primary actions', 'kadence-child' ); ?>">
          <a class="kc-btn kc-btn--primary" href="/free-quote"><?php esc_html_e( 'Schedule Your Free Quote', 'kadence-child' ); ?></a>
          <a class="kc-btn kc-btn--ghost" href="/color-samples"><?php esc_html_e( 'Explore Countertop Colors', 'kadence-child' ); ?></a>
        </nav>
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"kc-hero-right","layout":{"type":"flex","orientation":"vertical"}} -->
      <div class="wp-block-group kc-hero-right" aria-label="<?php esc_attr_e( 'Browse categories', 'kadence-child' ); ?>">
        <a class="kc-card" href="/quartz"><span class="kc-card-title"><?php esc_html_e( 'Quartz', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/natural-stone"><span class="kc-card-title"><?php esc_html_e( 'Natural Stone', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/solid-surface"><span class="kc-card-title"><?php esc_html_e( 'Solid Surface', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/ultra-compact"><span class="kc-card-title"><?php esc_html_e( 'Ultra Compact', 'kadence-child' ); ?></span></a>
        <a class="kc-card kc-card--wide" href="/laminate"><span class="kc-card-title"><?php esc_html_e( 'Laminate', 'kadence-child' ); ?></span></a>
        <a class="kc-card kc-card--wide" href="/sinks"><span class="kc-card-title"><?php esc_html_e( 'Sinks', 'kadence-child' ); ?></span></a>
      </div>
      <!-- /wp:group -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"className":"kc-cta-bar","layout":{"type":"flex","justifyContent":"left"}} -->
    <div class="wp-block-group kc-cta-bar" role="region" aria-label="<?php esc_attr_e( 'Quick actions', 'kadence-child' ); ?>">
      <a class="kc-pill" href="/free-quote"><?php esc_html_e( 'Schedule Your Free Quote', 'kadence-child' ); ?></a>
      <a class="kc-pill kc-pill--ghost" href="/color-samples"><?php esc_html_e( 'Explore Countertop Colors', 'kadence-child' ); ?></a>
    </div>
    <!-- /wp:group -->

    <!-- Inline 3D ring (instead of nested pattern inside HTML so JS initializes) -->
    <!-- wp:group {"className":"kc-ring-inline","layout":{"type":"constrained","contentSize":"1900px"}} -->
    <div class="wp-block-group kc-ring-inline">
      <div class="es-stage">
  <div class="es-ring" data-speed="32" data-tilt="10" data-size="120">
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
          <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
        </div>
      </div>
      <div class="es-fallback is-hidden">
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
        <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
      </div>
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:group -->
</section>
<!-- /wp:group -->
<style>
/* Hero Showcase structural & visual styles */
.kc-hero-showcase{position:relative;padding:60px 24px 80px;overflow:hidden;}
.kc-hero-showcase .kc-hero-bg{position:absolute;inset:0;background:var(--hero-bg, #111) center/cover no-repeat;filter:brightness(.55);z-index:0;}
.kc-hero-showcase .kc-hero-scrim{position:absolute;inset:0;background:linear-gradient(120deg,rgba(0,0,0,.75),rgba(0,0,0,.25));mix-blend-mode:normal;z-index:1;}
.kc-hero-showcase .kc-hero-wrap{position:relative;z-index:2;}
.kc-hero-showcase .kc-heading{font-size:clamp(2.4rem,5vw,3.8rem);line-height:1.08;font-weight:800;margin:0 0 18px;color:#fff;}
.kc-hero-showcase .kc-highlight{display:inline-block;background:linear-gradient(90deg,#4db6ff,#0094ff);-webkit-background-clip:text;color:transparent;}
.kc-hero-showcase .kc-eyebrow{font-size:.9rem;letter-spacing:.08em;text-transform:uppercase;color:#aad7ff;margin:0 0 12px;font-weight:600;}
.kc-hero-showcase .kc-sub{color:#e9f4ff;max-width:640px;margin:0 0 28px;font-size:1.05rem;line-height:1.45;}
.kc-cta-row{display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;}
.kc-btn{display:inline-flex;align-items:center;justify-content:center;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;transition:background .35s, color .35s, transform .35s;}
.kc-btn--primary{background:#0094ff;color:#fff;}
.kc-btn--primary:hover{background:#1aa0ff;}
.kc-btn--ghost{background:rgba(255,255,255,.12);color:#fff;backdrop-filter:blur(4px);} 
.kc-btn--ghost:hover{background:rgba(255,255,255,.22);} 
.kc-hero-right{display:grid;gap:12px;align-content:start;grid-template-columns:1fr 1fr;} 
.kc-card{position:relative;display:flex;align-items:center;justify-content:center;padding:26px 18px;background:#0d1f29;border:1px solid rgba(255,255,255,.08);color:#fff;text-decoration:none;font-weight:600;border-radius:18px;box-shadow:0 8px 28px -8px rgba(0,0,0,.4);transition:transform .5s cubic-bezier(.22,.67,.38,1), background .4s;}
.kc-card:hover{transform:translateY(-6px);} 
.kc-card--wide{grid-column:span 2;} 
.kc-cta-bar{margin:48px 0 36px;gap:12px;} 
.kc-pill{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;border-radius:999px;font-weight:600;background:#fff;color:#003049;text-decoration:none;transition:.35s;} 
.kc-pill--ghost{background:rgba(255,255,255,.12);color:#fff;} 
.kc-pill--ghost:hover{background:rgba(255,255,255,.22);} 
/* Ring inline adjustments */
.kc-ring-inline{margin-top:24px;}
.kc-ring-inline .es-stage{height:440px;}
.kc-ring-inline .es-tile img{filter:drop-shadow(0 4px 12px rgba(0,0,0,.45));}
@media (max-width:960px){.kc-hero-grid{flex-direction:column;}.kc-hero-right{grid-template-columns:repeat(3,1fr);}.kc-ring-inline .es-stage{height:360px;}}
@media (max-width:640px){.kc-hero-right{grid-template-columns:repeat(2,1fr);} .kc-ring-inline .es-stage{height:320px;} }
/* Motion preference */
@media (prefers-reduced-motion:reduce){.kc-card,.kc-btn,.kc-pill{transition:none!important;}}
</style>
