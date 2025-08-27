<?php
/**
 * Pattern: 3D Logo Carousel – Ring
 */

ob_start();
include get_theme_file_path( 'patterns/carousel-3d-ring.php' );
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
