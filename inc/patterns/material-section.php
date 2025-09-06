<?php
/**
 * Pattern: Material Section
 */
if ( function_exists( 'register_block_pattern' ) ) {
        ob_start(); ?>
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
<?php
        $pattern_content = ob_get_clean();
        register_block_pattern(
                'kadence-child/material-section',
                [
                        'title'       => __( 'Material Section', 'kadence-child' ),
                        'description' => __( 'Premium materials grid section with heading and animated chips.', 'kadence-child' ),
                        'categories'  => [ 'kadence-child', 'featured' ],
                        'content'     => $pattern_content,
                ]
        );
}
