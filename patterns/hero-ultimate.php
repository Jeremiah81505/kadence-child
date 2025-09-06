<?php
/**
 * Title: Hero Ultimate
 * Slug: kadence-child/hero-ultimate
 * Categories: kadence-child, featured
 * Description: Modern hero section with headline, subheading, badges, and material chips.
 */
?>
<!-- wp:cover {"url":"https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg","dimRatio":60,"minHeight":520,"align":"full","className":"kc-hero-ultimate"} -->
<div class="wp-block-cover alignfull kc-hero-ultimate" style="min-height:520px">
  <span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span>
  <img class="wp-block-cover__image-background" alt="" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg" data-object-fit="cover"/>
  <div class="wp-block-cover__inner-container">
    <div class="kc-hero-wrap">
      <div class="kc-hero-right">
        <p class="kc-eyebrow">Colorado\'s Countertop Experts</p>
        <h1 class="kc-hero-title">Elevate Your Space<br><span class="kc-reveal">with Premium Surfaces</span></h1>
        <p class="kc-hero-sub">Quartz, stone, solid surface, and more—crafted and installed by local pros.</p>
        <div class="kc-hero-badges">
          <span class="kc-info-badge">Free In-Home Measure</span>
          <span class="kc-info-badge">Fast Turnaround</span>
          <span class="kc-info-badge">Expert Installers</span>
        </div>
        <div class="kc-hero-ctas">
          <a class="wp-element-button kc-cta-primary" href="/free-quote">Get a Free Quote</a>
          <a class="wp-element-button kc-cta-secondary" href="/color-samples">View Colors</a>
        </div>
        <ul class="kc-material-list">
          <li><a href="/quartz" class="kc-chip kc-material-quartz"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Quartz"><span>Quartz</span></a></li>
          <li><a href="/natural-stone" class="kc-chip kc-material-stone"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Natural Stone"><span>Natural Stone</span></a></li>
          <li><a href="/solid-surface" class="kc-chip kc-material-solid"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="Solid Surface"><span>Solid Surface</span></a></li>
          <li><a href="/ultra-compact" class="kc-chip kc-material-ultra"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Ultra Compact"><span>Ultra Compact</span></a></li>
          <li><a href="/laminate" class="kc-chip kc-material-laminate"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Laminate"><span>Laminate</span></a></li>
          <li><a href="/sinks" class="kc-chip kc-material-sinks"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="Sinks"><span>Sinks</span></a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
<!-- /wp:cover -->
',
        )
    );
}
=======
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
        <div class="es-fallback">
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria"></div>
          <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone"></div>
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
>>>>>>> kadence-child/main
