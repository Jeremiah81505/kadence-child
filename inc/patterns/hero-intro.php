<?php
/**
 * Pattern: Hero Intro
 */
if ( function_exists( 'register_block_pattern' ) ) {
    $file = get_theme_file_path( 'patterns/hero-intro.php' );
    if ( file_exists( $file ) ) {
        ob_start();
        include $file;
        $pattern_content = ob_get_clean();
        register_block_pattern(
            'kadence-child/hero-intro',
            [
                'title'       => __( 'Hero Intro', 'kadence-child' ),
                'description' => __( 'Simple hero intro section with heading and paragraph.', 'kadence-child' ),
                'categories'  => [ 'kadence-child', 'text', 'featured' ],
                'content'     => $pattern_content,
            ]
        );
    }
}
