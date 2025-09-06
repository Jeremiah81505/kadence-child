<?php
/**
 * Pattern: 3D Logo Carousel – Ring
 */
if ( function_exists( 'register_block_pattern' ) ) {
    $file = get_theme_file_path( 'patterns/carousel-3d-ring.php' );
    if ( file_exists( $file ) ) {
        ob_start();
        include $file;
        $pattern_content = ob_get_clean();
        register_block_pattern(
            'kadence-child/carousel-3d-ring',
            [
                'title'       => __( '3D Logo Carousel – Ring', 'kadence-child' ),
                'description' => __( '3D rotating ring of logos with autoplay and hover pause.', 'kadence-child' ),
                'categories'  => [ 'kadence-child' ],
                'content'     => $pattern_content,
            ]
        );
    }
}
