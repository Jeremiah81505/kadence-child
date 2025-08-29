<?php
/**
 * Title: Hero Ultimate (Premium, Animated, Accessible)
 * Slug: kadence-child/hero-ultimate
 * Description: Modern hero section with animated headline, badges, interactive chips, and accessible markup.
 * Categories: kadence-child, featured
 */
?>
<section class="kc-hero-ultimate">
  <div class="kc-hero-wrap">
    <div class="kc-hero-right">
      <div class="kc-eyebrow">Countertop Experts</div>
      <h1 class="kc-hero-title kc-revealed">
        <span class="kc-reveal">Premium Surfaces</span>
        <span class="kc-reveal">Across Wisconsin</span>
      </h1>
      <div class="kc-hero-sub">Explore our curated selection of quartz, stone, solid surface, ultra compact, laminate, and sinks. Trusted brands, expert installation, and stunning results.</div>
      <div class="kc-hero-badges">
        <span class="kc-info-badge" aria-label="Locally Owned">Locally Owned</span>
        <span class="kc-info-badge" aria-label="Certified Installers">Certified Installers</span>
        <span class="kc-info-badge" aria-label="Free Estimates">Free Estimates</span>
      </div>
      <ul class="kc-material-list" aria-label="Explore by Material">
        <li><a href="#quartz" class="kc-chip kc-material-quartz" tabindex="0" aria-label="Quartz surfaces"><img src="/wp-content/themes/kadence-child/assets/img/quartz.png" alt="Quartz" /><span>Quartz</span></a></li>
        <li><a href="#stone" class="kc-chip kc-material-stone" tabindex="0" aria-label="Stone surfaces"><img src="/wp-content/themes/kadence-child/assets/img/stone.png" alt="Stone" /><span>Stone</span></a></li>
        <li><a href="#solid" class="kc-chip kc-material-solid" tabindex="0" aria-label="Solid surface"><img src="/wp-content/themes/kadence-child/assets/img/solid.png" alt="Solid Surface" /><span>Solid Surface</span></a></li>
        <li><a href="#ultra" class="kc-chip kc-material-ultra" tabindex="0" aria-label="Ultra compact"><img src="/wp-content/themes/kadence-child/assets/img/ultra.png" alt="Ultra Compact" /><span>Ultra Compact</span></a></li>
        <li><a href="#laminate" class="kc-chip kc-material-laminate" tabindex="0" aria-label="Laminate"><img src="/wp-content/themes/kadence-child/assets/img/laminate.png" alt="Laminate" /><span>Laminate</span></a></li>
        <li><a href="#sinks" class="kc-chip kc-material-sinks" tabindex="0" aria-label="Sinks"><img src="/wp-content/themes/kadence-child/assets/img/sinks.png" alt="Sinks" /><span>Sinks</span></a></li>
      </ul>
      <div class="kc-hero-ctas">
        <a href="#get-quote" class="wp-element-button kc-cta-primary">Get a Quote</a>
        <a href="#view-colors" class="wp-element-button kc-cta-secondary">View Colors</a>
      </div>
    </div>
    <div class="kc-float a"></div>
    <div class="kc-float b"></div>
    <div class="kc-scroll-cue" aria-hidden="true">Scroll to explore</div>
  </div>
</section>
if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/hero-ultimate',
        array(
            'title'       => __( 'Hero Ultimate (Premium)', 'kadence-child' ),
            'description' => __( 'Modern hero section with animated headline, badges, interactive material chips, and accessibility.', 'kadence-child' ),
            'categories'  => array( 'kadence-child', 'featured' ),
            'content'     => '
<!-- wp:cover {"url":"https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg","dimRatio":60,"minHeight":520,"align":"full","className":"kc-hero-ultimate"} -->
<div class="wp-block-cover alignfull kc-hero-ultimate" style="min-height:520px">
  <span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span>
  <img class="wp-block-cover__image-background" alt="" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg" data-object-fit="cover"/>
  <div class="wp-block-cover__inner-container">
    <div class="kc-hero-wrap">
      <div class="kc-hero-right">
        <p class="kc-eyebrow">Colorado\'s Countertop Experts</p>
        <h1 class="kc-hero-title" style="animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.2s both; text-shadow: 0 6px 32px rgba(0,0,0,.22);">Elevate Your Space<br><span class="kc-reveal">with Premium Surfaces</span></h1>
        <p class="kc-hero-sub" style="animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.5s both; text-shadow: 0 2px 12px rgba(0,0,0,.18);">Quartz, stone, solid surface, and morecrafted and installed by local pros.</p>
        <div class="kc-hero-badges">
          <span class="kc-info-badge">Free In-Home Measure</span>
          <span class="kc-info-badge">Fast Turnaround</span>
          <span class="kc-info-badge">Expert Installers</span>
        </div>
        <div class="kc-hero-ctas">
          <a class="wp-element-button kc-cta-primary" href="/free-quote">Get a Free Quote</a>
          <a class="wp-element-button kc-cta-secondary" href="/color-samples">View Colors</a>
        </div>
        <ul class="kc-material-list" role="list">
          <li><a href="/quartz" class="kc-chip kc-material-quartz" tabindex="0" aria-label="Quartz" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Quartz"><span>Quartz</span></a></li>
          <li><a href="/natural-stone" class="kc-chip kc-material-stone" tabindex="0" aria-label="Natural Stone" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Natural Stone"><span>Natural Stone</span></a></li>
          <li><a href="/solid-surface" class="kc-chip kc-material-solid" tabindex="0" aria-label="Solid Surface" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="Solid Surface"><span>Solid Surface</span></a></li>
          <li><a href="/ultra-compact" class="kc-chip kc-material-ultra" tabindex="0" aria-label="Ultra Compact" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Ultra Compact"><span>Ultra Compact</span></a></li>
          <li><a href="/laminate" class="kc-chip kc-material-laminate" tabindex="0" aria-label="Laminate" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Laminate"><span>Laminate</span></a></li>
          <li><a href="/sinks" class="kc-chip kc-material-sinks" tabindex="0" aria-label="Sinks" role="listitem"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="Sinks"><span>Sinks</span></a></li>
        </ul>
      </div>
    </div>
  </div>
  <style>
    @keyframes kcFadeUp { from { opacity:0; transform:translateY(36px);} to { opacity:1; transform:none;} }
    .kc-hero-title, .kc-hero-sub { will-change: opacity, transform; }
    .kc-material-list { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); margin-top: 2rem; }
    .kc-chip { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #1b2433, #3e3052); color: #fff; border-radius: 14px; padding: 1.2rem 1rem; box-shadow: 0 6px 18px rgba(0,0,0,.18); text-decoration: none; font-weight: 700; transition: transform .25s, box-shadow .25s, background .25s; cursor: pointer; outline: none; }
    .kc-chip:focus, .kc-chip:hover { background: linear-gradient(135deg, #7a5cff, #563acc); transform: scale(1.07); box-shadow: 0 12px 32px rgba(111,125,255,.22); z-index: 2; }
    .kc-chip img { width: 54px; height: 54px; object-fit: contain; margin-bottom: .5rem; filter: drop-shadow(0 2px 8px rgba(0,0,0,.12)); }
    .kc-chip span { font-size: 1.08rem; margin-bottom: 0.2rem; }
    @media (max-width: 600px) { .kc-material-list { gap: 12px; } .kc-chip { padding: 0.7rem 0.5rem; } .kc-chip img { width: 38px; height: 38px; } }
  </style>
</div>
<!-- /wp:cover -->
'
        )
    );
}
