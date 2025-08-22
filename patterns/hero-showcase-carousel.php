<?php
/**
 * Pattern: Hero — Showcase (with Carousel)
 * Location: Patterns → Kadence Child
 */

if ( ! function_exists( 'register_block_pattern' ) ) {
  return;
}

add_action( 'init', function () {

  // Ensure our pattern category exists (safe to re-run).
  if ( function_exists( 'register_block_pattern_category' ) ) {
    register_block_pattern_category(
      'kadence-child',
      array( 'label' => __( 'Kadence Child', 'kadence-child' ) )
    );
  }

  $content = <<<'HTML'
<!-- wp:group {"tagName":"section","className":"kc-hero-showcase","layout":{"type":"constrained"}} -->
<section class="kc-hero-showcase" aria-label="Premium Countertops Hero">
  <div class="kc-hero-bg" style="--hero-bg:url('BACKGROUND_IMAGE_URL');"></div>
  <div class="kc-hero-scrim"></div>

  <div class="kc-hero-wrap">
    <div class="kc-hero-grid">
      <!-- LEFT -->
      <header class="kc-hero-left">
        <p class="kc-eyebrow">Countertops for every space · <span class="nowrap">Wisconsin</span></p>
        <h1 class="kc-heading">
          Premium Countertops
          <span class="kc-break">without the Premium</span>
          <span class="kc-highlight">Headache.</span>
        </h1>
        <p class="kc-sub">
          Shop quartz, natural stone, solid surface, laminate, and ultra-compact materials—installed by local pros.
          Precise fabrication, seamless installs, and free in-home measures.
        </p>

        <nav class="kc-cta-row" aria-label="Primary actions">
          <a class="kc-btn kc-btn--primary" href="/free-quote">Schedule Your Free Quote</a>
          <a class="kc-btn kc-btn--ghost" href="/color-samples">Explore Countertop Colors</a>
        </nav>
      </header>

      <!-- RIGHT -->
      <aside class="kc-hero-right" aria-label="Browse categories">
        <a class="kc-card" href="/quartz"><span class="kc-card-title">Quartz</span></a>
        <a class="kc-card" href="/natural-stone"><span class="kc-card-title">Natural Stone</span></a>
        <a class="kc-card" href="/solid-surface"><span class="kc-card-title">Solid Surface</span></a>
        <a class="kc-card" href="/ultra-compact"><span class="kc-card-title">Ultra Compact</span></a>
        <a class="kc-card kc-card--wide" href="/laminate"><span class="kc-card-title">Laminate</span></a>
        <a class="kc-card kc-card--wide" href="/sinks"><span class="kc-card-title">Sinks</span></a>
      </aside>
    </div>

    <!-- CTA BAR -->
    <div class="kc-cta-bar" role="region" aria-label="Quick actions">
      <a class="kc-pill" href="/free-quote">Schedule Your Free Quote</a>
      <a class="kc-pill kc-pill--ghost" href="/color-samples">Explore Countertop Colors</a>
    </div>

    <!-- Reuse the existing, working carousel pattern -->
    <!-- IMPORTANT: This slug must match the existing pattern. -->
    <!-- wp:pattern {"slug":"kadence-child/carousel-3d-ring"} /-->

  </div>
</section>
<!-- /wp:group -->
HTML;

  register_block_pattern(
    'kadence-child/hero-showcase-carousel',
    array(
      'title'       => __( 'Hero — Showcase (with Carousel)', 'kadence-child' ),
      'categories'  => array( 'kadence-child' ),
      'content'     => $content,
    )
  );
});
