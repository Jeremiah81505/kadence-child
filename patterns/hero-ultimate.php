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
            <!-- /wp:buttons -->

          </div>
          <!-- /wp:group -->
        </div>
        <!-- /wp:group -->

        <!-- wp:group {"className":"kc-hero-right","layout":{"type":"flex","orientation":"vertical"}} -->
        <div class="wp-block-group kc-hero-right">
          <!-- wp:group {"className":"kc-materials-card"} -->
          <div class="wp-block-group kc-materials-card" role="region" aria-label="<?php esc_attr_e( 'Browse materials', 'kadence-child' ); ?>">
            <!-- wp:heading {"level":3,"className":"kc-materials-heading"} -->
            <h3 class="kc-materials-heading"><?php esc_html_e( 'Explore by Material', 'kadence-child' ); ?></h3>
            <!-- /wp:heading -->

            <!-- wp:html -->
            <nav class="kc-material-grid" aria-label="<?php esc_attr_e( 'Material categories', 'kadence-child' ); ?>">
              <a class="kc-chip kc-quartz" href="/quartz/"><span class="kc-txt"><?php esc_html_e( 'Quartz', 'kadence-child' ); ?></span></a>
              <a class="kc-chip kc-stone" href="/natural-stone/"><span class="kc-txt"><?php printf( esc_html__( 'Natural%1$sStone', 'kadence-child' ), '<wbr>' ); ?></span></a>
              <a class="kc-chip kc-solid" href="/solid-surface/"><span class="kc-txt"><?php printf( esc_html__( 'Solid%1$sSurface', 'kadence-child' ), '<wbr>' ); ?></span></a>
              <a class="kc-chip kc-ultra" href="/ultra-compact/"><span class="kc-txt"><?php printf( esc_html__( 'Ultra%1$sCompact', 'kadence-child' ), '<wbr>' ); ?></span></a>
              <a class="kc-chip kc-lam" href="/laminate/"><span class="kc-txt"><?php esc_html_e( 'Laminate', 'kadence-child' ); ?></span></a>
              <a class="kc-chip kc-sinks" href="/sinks/"><span class="kc-txt"><?php esc_html_e( 'Sinks', 'kadence-child' ); ?></span></a>
            </nav>
            <!-- /wp:html -->
          </div>
          <!-- /wp:group -->
        </div>
        <!-- /wp:group -->
      </div>
      <!-- /wp:group -->

      <!-- wp:group {"className":"kc-ring-wrap","layout":{"type":"constrained","contentSize":"1900px"}} -->
      <div class="wp-block-group kc-ring-wrap">
        <!-- wp:html -->
        <div class="es-stage">
          <div class="es-ring" data-radius="560" data-speed="30" data-tilt="0">
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria"></div>
            <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone"></div>
          </div>
        </div>
        <!-- /wp:html -->
      </div>
      <!-- /wp:group -->

      <div class="kc-scroll-cue" aria-hidden="true"><?php esc_html_e( 'Scroll', 'kadence-child' ); ?></div>
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->
