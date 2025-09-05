<?php
/**
 * Title: Material Section
 * Slug: kadence-child/material-section
<<<<<<< HEAD
 * Categories: kadence-child, featured
 * Description: Premium materials grid section with heading and animated chips.
 */

if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/material-section',
        array(
            'title'       => __( 'Material Section', 'kadence-child' ),
            'description' => __( 'Premium materials grid section with heading and animated chips.', 'kadence-child' ),
            'categories'  => array( 'kadence-child', 'featured' ),
            'content'     => '
<!-- wp:group {"align":"full","className":"kc-materials-card"} -->
<div class="wp-block-group alignfull kc-materials-card">
  <!-- wp:heading {"level":2,"className":"kc-materials-heading"} -->
  <h2 class="kc-materials-heading">Premium Countertop Materials</h2>
  <!-- /wp:heading -->

  <!-- wp:group {"className":"kc-material-grid"} -->
  <div class="kc-material-grid">
    <a href="/quartz" class="kc-chip kc-quartz"><span class="kc-txt">Quartz</span></a>
    <a href="/natural-stone" class="kc-chip kc-stone"><span class="kc-txt">Natural Stone</span></a>
    <a href="/solid-surface" class="kc-chip kc-solid"><span class="kc-txt">Solid Surface</span></a>
    <a href="/ultra-compact" class="kc-chip kc-ultra"><span class="kc-txt">Ultra Compact</span></a>
    <a href="/laminate" class="kc-chip kc-lam"><span class="kc-txt">Laminate</span></a>
    <a href="/sinks" class="kc-chip kc-sinks"><span class="kc-txt">Sinks</span></a>
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
'
        )
    );
}
=======
 * Categories: kadence-child, text
 * Description: Heading with three material columns.
 */
?>
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'Materials', 'kadence-child' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://elevatedcountertopexperts.com/quartz/"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg" alt="<?php esc_attr_e( 'Quartz countertop', 'kadence-child' ); ?>" /></a><figcaption><?php esc_html_e( 'Quartz', 'kadence-child' ); ?></figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://elevatedcountertopexperts.com/natural-stone/"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg" alt="<?php esc_attr_e( 'Natural stone countertop', 'kadence-child' ); ?>" /></a><figcaption><?php esc_html_e( 'Natural Stone', 'kadence-child' ); ?></figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column">
<!-- wp:image {"linkDestination":"custom"} -->
<figure class="wp-block-image"><a href="https://elevatedcountertopexperts.com/solid-surface/"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Solid-Surface-1.jpg" alt="<?php esc_attr_e( 'Solid surface countertop', 'kadence-child' ); ?>" /></a><figcaption><?php esc_html_e( 'Solid Surface', 'kadence-child' ); ?></figcaption></figure>
<!-- /wp:image -->
</div>
<!-- /wp:column -->

</div>
<!-- /wp:columns -->
</section>
<!-- /wp:group -->
>>>>>>> kadence-child/main
