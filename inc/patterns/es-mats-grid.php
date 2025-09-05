<?php
/**
 * Pattern: Materials Grid
 */

ob_start();
include get_theme_file_path( 'patterns/es-mats-grid.php' );
$pattern_content = ob_get_clean();

register_block_pattern(
    'kadence-child/es-mats-grid',
    [
        'title'       => __( 'Materials Grid', 'kadence-child' ),
        'description' => __( 'Six-card materials navigation grid with vertical labels and scroll-reveal motion.', 'kadence-child' ),
        'categories'  => [ 'kadence-child', 'elevated' ],
        'content'     => $pattern_content,
    ]
);
