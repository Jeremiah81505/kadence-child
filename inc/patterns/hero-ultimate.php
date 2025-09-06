<?php
/**
 * Pattern: Hero – Ultimate (Motion)
 * Defensive: Only register if block pattern APIs exist.
 */
if ( function_exists( 'register_block_pattern' ) ) {
    $file = get_theme_file_path( 'patterns/hero-ultimate.php' );
    if ( file_exists( $file ) ) {
        ob_start();
        include $file;
        $pattern_content = ob_get_clean();
        register_block_pattern(
            'kadence-child/hero-ultimate',
            [
                'title'       => __( 'Hero – Ultimate (Motion)', 'kadence-child' ),
                'description' => __( 'Full-bleed hero with layered parallax, animated headline, and dual CTAs.', 'kadence-child' ),
                'categories'  => [ 'kadence-child', 'featured' ],
                'content'     => $pattern_content,
            ]
        );
    }
}
