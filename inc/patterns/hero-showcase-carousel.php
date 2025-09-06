<?php
/**
 * Pattern: Hero — Showcase (with Carousel)
 */
if ( function_exists( 'register_block_pattern' ) ) {
    $file = get_theme_file_path( 'patterns/hero-showcase-carousel.php' );
    if ( file_exists( $file ) ) {
        ob_start();
        include $file;
        $pattern_content = ob_get_clean();
        register_block_pattern(
            'kadence-child/hero-showcase-carousel',
            [
                'title'       => __( 'Hero — Showcase (with Carousel)', 'kadence-child' ),
                'description' => __( 'Hero layout featuring a showcase grid, CTA bar, and built-in carousel.', 'kadence-child' ),
                'categories'  => [ 'kadence-child', 'featured' ],
                'content'     => $pattern_content,
            ]
        );
    }
}
