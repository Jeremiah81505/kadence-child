<?php
/**
 * Title: Hero Intro (Premium)
 * Slug: kadence-child/hero-intro
 * Description: Premium hero intro section with animated heading, subheading, call-to-action, and accessibility.
 * Categories: kadence-child, featured
 */

<!-- wp:cover {"url":"https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg","dimRatio":60,"minHeight":480,"align":"full","className":"kc-hero-intro"} -->
<div class="wp-block-cover alignfull kc-hero-intro" style="min-height:480px">
  <span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span>
  <img class="wp-block-cover__image-background" alt="" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg" data-object-fit="cover"/>
  <div class="wp-block-cover__inner-container">
    <div class="wp-block-group" style="padding-top:72px;padding-right:32px;padding-bottom:72px;padding-left:32px">
      <h1 class="kc-hero-title" style="color:#fff;font-size:3.5rem;font-weight:900;line-height:1.1;animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.2s both; text-shadow: 0 6px 32px rgba(0,0,0,.22);">
        Elevated Surfaces<br>
        <span style="color:#ffd700;font-weight:700;">Countertop Experts</span>
      </h1>
      <p class="kc-hero-sub" style="color:#f8f8f8;font-size:1.35rem;font-weight:500;text-align:center;animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.5s both; text-shadow: 0 2px 12px rgba(0,0,0,.18);">
        Premium countertops—crafted, delivered, and installed with care.<br>
        Serving Colorado homes with passion and precision.
      </p>
      <div class="wp-block-buttons" style="margin-top:32px;">
        <div class="wp-block-button"><a class="wp-block-button__link has-white-color has-vivid-cyan-blue-background-color has-text-color has-background" style="border-radius:999px;font-weight:700;font-size:1.1rem;padding:16px 36px;box-shadow:0 8px 24px rgba(0,0,0,.18);transition:transform .25s;" href="/contact/">Get a Free Estimate</a></div>
      </div>
    </div>
  </div>
  <style>
    @keyframes kcFadeUp { from { opacity:0; transform:translateY(36px);} to { opacity:1; transform:none;} }
    .kc-hero-title, .kc-hero-sub { will-change: opacity, transform; }
    .wp-block-button__link:hover, .wp-block-button__link:focus { transform: scale(1.06); box-shadow:0 16px 32px rgba(111,125,255,.22); }
  </style>
</div>
<!-- /wp:cover -->
'
        )
    );
}
