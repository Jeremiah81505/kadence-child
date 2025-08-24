<?php
/**
 * Pattern: Materials Grid (6 Cards, Hero + Mix)
 */

ob_start();
include get_theme_file_path( 'patterns/es-mats-grid.php' );
$pattern_content = ob_get_clean();

register_block_pattern(
    'kadence-child/es-mats-grid',
    [
        'title'       => __('Materials Grid (6 Cards, Hero + Mix)', 'kadence-child'),
        'description' => __( 'Six-card materials navigation grid with scroll-reveal animation and vertical tags.', 'kadence-child' ),
        'categories'  => [ 'kadence-child', 'elevated' ],
        'content'     => $pattern_content,
        'inserter'    => true,
    ]
);

