<?php
/**
 * Title: Hero – Ultimate Motion (Enhanced)
 * Slug: kadence-child/hero-ultimate-motion
 * Categories: kadence-child, featured
 * Description: Enhanced motion hero with colorwash, floating blobs, animated gradient headline, material chips, and rotating brand ring.
 */
?>
<!-- wp:cover {"dimRatio":30,"isUserOverlayColor":true,"minHeight":78,"minHeightUnit":"vh","align":"full","className":"kc-hero-ultimate kc-hero-ultimate--v2","style":{"spacing":{"padding":{"top":"60px","bottom":"60px"}}}} -->
<div class="wp-block-cover alignfull kc-hero-ultimate kc-hero-ultimate--v2" data-enhanced="true" style="padding-top:60px;padding-bottom:60px;min-height:78vh;--kc-wash-opacity:.52;">
  <span aria-hidden="true" class="wp-block-cover__background"></span>
  <img class="wp-block-cover__image-background" alt="" data-object-fit="cover" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/AdobeStock_884069741-scaled.jpeg" />
  <!-- wp:html -->
  <div class="kc-colorwash" aria-hidden="true"></div>
  <!-- /wp:html -->
  <div class="wp-block-cover__inner-container">
    <!-- wp:group {"layout":{"type":"constrained","contentSize":"1900px"},"className":"kc-hero-wrap"} -->
    <div class="wp-block-group kc-hero-wrap">
      <!-- wp:html -->
      <div class="kc-float a" aria-hidden="true"></div>
      <div class="kc-float b" aria-hidden="true"></div>
      <div class="kc-float c" aria-hidden="true"></div>
      <!-- /wp:html -->

      <!-- wp:group {"className":"kc-hero-flex","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between","orientation":"horizontal"}} -->
      <div class="wp-block-group kc-hero-flex">
        <!-- wp:group {"className":"kc-hero-left","layout":{"type":"flex","orientation":"vertical"}} -->
        <div class="wp-block-group kc-hero-left">
          <!-- wp:group {"className":"kc-hero-head"} -->
          <div class="wp-block-group kc-hero-head">
            <!-- wp:paragraph {"className":"kc-eyebrow"} -->
            <p class="kc-eyebrow"><?php esc_html_e( 'Countertops • Fabrication • Installation', 'kadence-child' ); ?></p>
            <!-- /wp:paragraph -->

            <!-- wp:html -->
            <div class="kc-badges">
              <span class="kc-badge kc-badge--blue"><?php esc_html_e( 'Statewide — Wisconsin', 'kadence-child' ); ?></span>
              <span class="kc-badge kc-badge--blue"><?php esc_html_e( '5-Star Rated', 'kadence-child' ); ?></span>
            </div>
            <!-- /wp:html -->

            <!-- wp:heading {"level":1,"className":"kc-hero-title kc-title"} -->
            <h1 class="kc-hero-title kc-title">
              <?php
              printf(
                esc_html__( 'Premium %1$sCountertops%2$s%3$sAcross %4$sWisconsin%5$s.', 'kadence-child' ),
                '<span class="kc-gradient">',
                '</span>',
                '<br class="kc-break" />',
                '<span class="kc-underline">',
                '</span>'
              );
              ?>
            </h1>
            <!-- /wp:heading -->

            <!-- wp:paragraph {"className":"kc-hero-sub kc-sub"} -->
            <p class="kc-hero-sub kc-sub"><?php esc_html_e( 'Quartz, natural stone, solid surface, and laminate—crafted, delivered, and installed statewide with 5-star care.', 'kadence-child' ); ?></p>
            <!-- /wp:paragraph -->

            <!-- wp:buttons {"className":"kc-hero-ctas","layout":{"type":"flex","justifyContent":"left"}} -->
            <div class="wp-block-buttons kc-hero-ctas">
              <!-- wp:button {"className":"is-style-fill kc-cta-primary"} -->
              <div class="wp-block-button kc-cta-primary"><a class="wp-block-button__link wp-element-button" href="/get-a-quote/"><?php esc_html_e( 'Get a Quote', 'kadence-child' ); ?></a></div>
              <!-- /wp:button -->
              <!-- wp:button {"className":"is-style-outline kc-cta-secondary kc-btn-blue"} -->
              <div class="wp-block-button kc-cta-secondary kc-btn-blue"><a class="wp-block-button__link wp-element-button" href="/color-samples/"><?php esc_html_e( 'View Colors', 'kadence-child' ); ?></a></div>
              <!-- /wp:button -->
            </div>
            <!-- /wp:buttons -->
          </div>
          <!-- /wp:group -->
        </div>
        <!-- /wp:group -->

        <!-- wp:group {"className":"kc-hero-right","layout":{"type":"constrained"}} -->
        <div class="wp-block-group kc-hero-right">
          <!-- wp:html -->
          <div class="kc-materials-card">
            <h3 class="kc-materials-heading"><?php esc_html_e( 'Shop by Material', 'kadence-child' ); ?></h3>
            <div class="kc-material-grid">
              <a class="kc-chip kc-chip-quartz" href="/products/quartz/">Quartz</a>
              <a class="kc-chip kc-chip-stone" href="/products/natural-stone/">Natural Stone</a>
              <a class="kc-chip kc-chip-solid" href="/products/solid-surface/">Solid Surface</a>
              <a class="kc-chip kc-chip-ultra" href="/products/ultra-compact/">Ultra Compact</a>
              <a class="kc-chip kc-chip-laminate" href="/products/laminate/">Laminate</a>
              <a class="kc-chip kc-chip-sinks" href="/products/sinks/">Sinks</a>
            </div>
          </div>
          <!-- /wp:html -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"kc-hero-carousel-wrap","layout":{"type":"constrained","contentSize":"1800px"}} -->
      <div class="wp-block-group kc-hero-carousel-wrap">
        <!-- wp:html -->
        <div class="kc-adv-stage-wrap kc-adv-carousel" data-variant="ring">
          <div class="kc-adv-panel">
            <div class="kc-adv-world">
              <div class="kc-adv-ring">
                <?php
                $logos = array(
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-premium-quartz.webp','Premium Natural Quartz'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-himacs.webp','HI-MACS Solid Surface'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-dekton.webp','Dekton Ultra Compact'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-corian.webp','Corian Solid Surface'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-cambria.webp','Cambria Quartz'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-caesarstone.webp','Caesarstone Quartz'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-wilsonart.webp','Wilsonart Laminate'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-vadara.webp','Vadara Quartz'),
                  array('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/logo-ugm.webp','UGM Surfaces'),
                );
                foreach ( $logos as $l ) {
                  echo '<div class="kc-adv-tile"><img loading="lazy" decoding="async" src="' . esc_url( $l[0] ) . '" alt="' . esc_attr( $l[1] ) . '" /></div>';
                }
                ?>
              </div>
              <div class="kc-adv-spotlight" aria-hidden="true"></div>
              <div class="kc-adv-floor" aria-hidden="true"></div>
            </div>
            <div class="kc-adv-controls" aria-label="Carousel controls">
              <button class="kc-adv-btn" data-action="prev" type="button">Prev</button>
              <button class="kc-adv-btn" data-action="playpause" type="button" aria-pressed="true">Pause</button>
              <button class="kc-adv-btn" data-action="next" type="button">Next</button>
            </div>
          </div>
        </div>
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->

      <!-- wp:html -->
      <div class="kc-scroll-cue" aria-hidden="true"><?php esc_html_e( 'Scroll', 'kadence-child' ); ?></div>
      <!-- /wp:html -->
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->
