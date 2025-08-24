<?php
/**
 * Title: Material Section
 * Slug: kadence-child/material-section
 * Categories: kadence-child, text
 * Description: Section highlighting materials with heading and columns.
 */
?>
<!-- wp:group {"tagName":"section","style":{"spacing":{"padding":{"top":"50px","bottom":"50px"}}},"layout":{"type":"constrained"}} -->
<section class="wp-block-group" style="padding-top:50px;padding-bottom:50px">
<!-- wp:heading {"textAlign":"center"} -->
<h2 class="has-text-align-center"><?php esc_html_e( 'Our Materials', 'kadence-child' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns">
 <!-- wp:column -->
 <div class="wp-block-column">
  <!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
  <figure class="wp-block-image size-large"><img src="https://placehold.co/400x300" alt="<?php esc_attr_e( 'Material sample', 'kadence-child' ); ?>" /></figure>
  <!-- /wp:image -->

  <!-- wp:heading {"level":3,"textAlign":"center"} -->
  <h3 class="has-text-align-center"><?php esc_html_e( 'Material One', 'kadence-child' ); ?></h3>
  <!-- /wp:heading -->
 </div>
 <!-- /wp:column -->

 <!-- wp:column -->
 <div class="wp-block-column">
  <!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
  <figure class="wp-block-image size-large"><img src="https://placehold.co/400x300" alt="<?php esc_attr_e( 'Material sample', 'kadence-child' ); ?>" /></figure>
  <!-- /wp:image -->

  <!-- wp:heading {"level":3,"textAlign":"center"} -->
  <h3 class="has-text-align-center"><?php esc_html_e( 'Material Two', 'kadence-child' ); ?></h3>
  <!-- /wp:heading -->
 </div>
 <!-- /wp:column -->

 <!-- wp:column -->
 <div class="wp-block-column">
  <!-- wp:image {"sizeSlug":"large","linkDestination":"none"} -->
  <figure class="wp-block-image size-large"><img src="https://placehold.co/400x300" alt="<?php esc_attr_e( 'Material sample', 'kadence-child' ); ?>" /></figure>
  <!-- /wp:image -->

  <!-- wp:heading {"level":3,"textAlign":"center"} -->
  <h3 class="has-text-align-center"><?php esc_html_e( 'Material Three', 'kadence-child' ); ?></h3>
  <!-- /wp:heading -->
 </div>
 <!-- /wp:column -->
</div>
<!-- /wp:columns -->
</section>
<!-- /wp:group -->
