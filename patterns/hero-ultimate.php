<?php
/**
 * Title: Hero – Ultimate (Motion)
 * Slug: kadence-child/hero-ultimate
 * Categories: kadence-child, featured
 * Description: Full-bleed hero with layered parallax, animated headline, and dual CTAs.
 */
?>
<!-- wp:cover {"dimRatio":0,"isUserOverlayColor":true,"customGradient":"linear-gradient(90deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0) 100%)","minHeight":45,"minHeightUnit":"vh","align":"full","className":"kc-hero-ultimate","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}}} -->
<div class="wp-block-cover alignfull kc-hero-ultimate" style="padding-top:40px;padding-bottom:40px;min-height:45vh">
  <span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim has-background-gradient" style="background:linear-gradient(90deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0) 100%)"></span>
  <img class="wp-block-cover__image-background" alt="" data-object-fit="cover" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/AdobeStock_884069741-scaled.jpeg"/>
  <div class="wp-block-cover__inner-container">
    <!-- wp:group {"layout":{"type":"constrained","contentSize":"1900px"}} -->
    <div class="wp-block-group kc-hero-wrap">
      <div class="kc-float a"></div>
      <div class="kc-float b"></div>

      <!-- wp:group {"className":"kc-hero-flex","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"nowrap"}} -->
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
                /* translators: 1: opening span for gradient text, 2: closing span for gradient text, 3: line break element, 4: opening span for underlined text, 5: closing span for underlined text */
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
              <div class="wp-block-button kc-cta-primary">
                <a class="wp-block-button__link wp-element-button" href="/get-a-quote/"><?php esc_html_e( 'Get a Quote', 'kadence-child' ); ?></a>
              </div>
              <!-- /wp:button -->

              <!-- wp:button {"className":"is-style-outline kc-cta-secondary kc-btn-blue"} -->
              <div class="wp-block-button kc-cta-secondary kc-btn-blue">
                <a class="wp-block-button__link wp-element-button" href="/color-samples/"><?php esc_html_e( 'View Colors', 'kadence-child' ); ?></a>
              </div>
              <!-- /wp:button -->
            </div>
            <!-- /wp:cover -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

  <!-- Carousel section removed -->

      <div class="kc-scroll-cue" aria-hidden="true"><?php esc_html_e( 'Scroll', 'kadence-child' ); ?></div>
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->
