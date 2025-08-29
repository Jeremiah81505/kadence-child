<?php
/**
 * Title: Hero Ultimate
 * Slug: kadence-child/hero-ultimate
 * Categories: kadence-child, featured
 * Description: Modern hero section with headline, subheading, badges, and material chips.
 */

if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/hero-ultimate',
        array(
            'title'       => __( 'Hero Ultimate', 'kadence-child' ),
            'description' => __( 'Modern hero section with headline, subheading, badges, and material chips.', 'kadence-child' ),
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
