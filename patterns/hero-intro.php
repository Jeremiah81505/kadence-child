<?php
/**
 * Title: Hero Intro
 * Slug: kadence-child/hero-intro
 * Categories: kadence-child, text, featured
 * Description: Premium hero intro section with animated heading, subheading, and call-to-action.
 */
?>
<!-- wp:cover {"url":"https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg","dimRatio":60,"minHeight":480,"align":"full","className":"kc-hero-intro"} -->
<div class="wp-block-cover alignfull kc-hero-intro" style="min-height:480px">
  <span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span>
  <img class="wp-block-cover__image-background" alt="" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg" data-object-fit="cover"/>
  <div class="wp-block-cover__inner-container">
    <!-- wp:group {"layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"72px","bottom":"72px","left":"32px","right":"32px"}}}} -->
    <div class="wp-block-group" style="padding-top:72px;padding-right:32px;padding-bottom:72px;padding-left:32px">
      <!-- wp:heading {"level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"900","lineHeight":"1.1"},"color":{"text":"#fff"}},"className":"kc-hero-title"} -->
      <h1 class="kc-hero-title" style="color:#fff;font-size:3.5rem;font-weight:900;line-height:1.1;">
        Elevated Surfaces<br>
        <span style="color:#ffd700;font-weight:700;">Countertop Experts</span>
      </h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.35rem","fontWeight":"500"},"color":{"text":"#f8f8f8"}},"className":"kc-hero-sub"} -->
      <p class="kc-hero-sub" style="color:#f8f8f8;font-size:1.35rem;font-weight:500;text-align:center;">
        Premium countertops—crafted, delivered, and installed with care.<br>
        Serving Colorado homes with passion and precision.
      </p>
      <!-- /wp:paragraph -->

      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons" style="margin-top:32px;">
        <!-- wp:button {"backgroundColor":"vivid-cyan-blue","textColor":"white","style":{"border":{"radius":"999px"},"typography":{"fontWeight":"700","fontSize":"1.1rem"}}} -->
        <div class="wp-block-button"><a class="wp-block-button__link has-white-color has-vivid-cyan-blue-background-color has-text-color has-background" style="border-radius:999px;font-weight:700;font-size:1.1rem;padding:16px 36px;" href="/contact/">Get a Free Estimate</a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
  </div>
</div>
<!-- /wp:cover -->
<style>
.kc-hero-intro .kc-hero-title {
  animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.2s both;
  text-shadow: 0 6px 32px rgba(0,0,0,.22);
}
.kc-hero-intro .kc-hero-sub {
  animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.5s both;
  text-shadow: 0 2px 12px rgba(0,0,0,.18);
}
@keyframes kcFadeUp {
  from { opacity:0; transform:translateY(36px);}
  to { opacity:1; transform:none;}
}
</style>
