<?php
/**
 * Title: Hero — Showcase (with Carousel)
 * Slug: kadence-child/hero-showcase-carousel
 * Categories: kadence-child
 */
?>

<!-- wp:html -->
<section class="kc-hero-showcase" aria-label="Premium Countertops Hero">
  <div class="kc-hero-bg" style="--hero-bg:url('BACKGROUND_IMAGE_URL');"></div>
  <div class="kc-hero-scrim"></div>

  <div class="kc-hero-wrap">
    <div class="kc-hero-grid">
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

      <aside class="kc-hero-right" aria-label="<?php esc_attr_e( 'Browse categories', 'kadence-child' ); ?>">
        <a class="kc-card" href="/quartz"><span class="kc-card-title"><?php esc_html_e( 'Quartz', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/natural-stone"><span class="kc-card-title"><?php esc_html_e( 'Natural Stone', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/solid-surface"><span class="kc-card-title"><?php esc_html_e( 'Solid Surface', 'kadence-child' ); ?></span></a>
        <a class="kc-card" href="/ultra-compact"><span class="kc-card-title"><?php esc_html_e( 'Ultra Compact', 'kadence-child' ); ?></span></a>
        <a class="kc-card kc-card--wide" href="/laminate"><span class="kc-card-title"><?php esc_html_e( 'Laminate', 'kadence-child' ); ?></span></a>
        <a class="kc-card kc-card--wide" href="/sinks"><span class="kc-card-title"><?php esc_html_e( 'Sinks', 'kadence-child' ); ?></span></a>
      </aside>
    </div>

    <div class="kc-cta-bar" role="region" aria-label="Quick actions">
      <a class="kc-pill" href="/free-quote">Schedule Your Free Quote</a>
      <a class="kc-pill kc-pill--ghost" href="/color-samples">Explore Countertop Colors</a>
    </div>

    <!-- wp:pattern {"slug":"kadence-child/carousel-3d-ring"} /-->

  </div>
</section>
<!-- /wp:html -->

<?php
/**
 * Title: Fancy Header
 * Slug: kadence-child/header-fancy
 * Categories: kadence-child, header
 * Description: Modern header with logo, navigation, and call-to-action button.
 */

if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/header-fancy',
        array(
            'title'       => __( 'Fancy Header', 'kadence-child' ),
            'description' => __( 'Modern header with logo, navigation, and call-to-action button.', 'kadence-child' ),
            'categories'  => array( 'kadence-child', 'header' ),
            'content'     => '
<!-- wp:group {"align":"full","className":"kc-header-fancy"} -->
<div class="wp-block-group alignfull kc-header-fancy">
  <div class="kc-header-inner">
    <a href="/" class="kc-header-logo">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/elevated-logo.svg" alt="Elevated Surfaces Logo" />
    </a>
    <nav class="kc-header-nav" aria-label="Main navigation">
      <a href="/quartz">Quartz</a>
      <a href="/natural-stone">Natural Stone</a>
      <a href="/solid-surface">Solid Surface</a>
      <a href="/ultra-compact">Ultra Compact</a>
      <a href="/laminate">Laminate</a>
      <a href="/sinks">Sinks</a>
    </nav>
    <a href="/free-quote" class="kc-header-cta">Get a Free Quote</a>
  </div>
</div>
<!-- /wp:group -->
'
        )
    );
}

