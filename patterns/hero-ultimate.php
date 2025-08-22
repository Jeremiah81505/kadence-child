<?php
/**
 * Title: Hero – Ultimate (Motion)
 * Slug: kadence-child/hero-ultimate
 * Categories: kadence-child, featured
 * Description: Full-bleed hero with layered parallax, animated headline, and dual CTAs.
 */
?>
<!-- wp:cover {"dimRatio":30,"isUserOverlayColor":true,"overlayColor":"black","minHeight":80,"minHeightUnit":"vh","align":"full","className":"kc-hero-ultimate","style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}}} -->
<div class="wp-block-cover alignfull kc-hero-ultimate" style="padding-top:80px;padding-bottom:80px;min-height:80vh">
  <span aria-hidden="true" class="wp-block-cover__background has-black-background-color has-background-dim-30 has-background-dim"></span>
  <!-- Set your background image in block settings after inserting the pattern -->
  <img class="wp-block-cover__image-background" alt="" data-object-fit="cover"/>
  <div class="wp-block-cover__inner-container">
    <!-- wp:group {"layout":{"type":"constrained","contentSize":"1200px"}} -->
    <div class="wp-block-group kc-hero-wrap">
      <!-- Decorative floating chips -->
      <div class="kc-float a"></div>
      <div class="kc-float b"></div>

        <!-- wp:paragraph {"className":"kc-eyebrow"} -->
        <p class="kc-eyebrow">Countertops for every space • Wisconsin.</p>
        <!-- /wp:paragraph -->

        <!-- wp:heading {"level":1,"className":"kc-hero-title"} -->
        <h1 class="kc-hero-title"><span class="kc-reveal">Premium Countertops</span> <span class="kc-reveal">without the Premium Headache.</span></h1>
        <!-- /wp:heading -->

        <!-- wp:paragraph {"className":"kc-hero-sub"} -->
        <p class="kc-hero-sub">Shop quartz, natural stone, solid surface, laminate, and ultra compact—installed by local pros, free in-home measures.</p>
        <!-- /wp:paragraph -->

        <!-- wp:buttons {"className":"kc-hero-ctas"} -->
        <div class="wp-block-buttons kc-hero-ctas">
          <!-- wp:button {"className":"is-style-fill kc-cta-primary"} -->
          <div class="wp-block-button is-style-fill kc-cta-primary"><a class="wp-block-button__link wp-element-button" href="/contact">Get a Free Quote</a></div>
          <!-- /wp:button -->

          <!-- wp:button {"className":"is-style-outline kc-cta-secondary"} -->
          <div class="wp-block-button is-style-outline kc-cta-secondary"><a class="wp-block-button__link wp-element-button" href="/gallery">Browse Colors</a></div>
          <!-- /wp:button -->
        </div>
        <!-- /wp:buttons -->

      <div class="kc-scroll-cue" aria-hidden="true">Scroll</div>
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->
