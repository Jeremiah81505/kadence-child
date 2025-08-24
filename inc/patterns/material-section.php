<?php
/**
 * Pattern: Material Section
 */

ob_start();
include get_theme_file_path( 'patterns/material-section.php' );
$pattern_content = ob_get_clean();

register_block_pattern(
    'kadence-child/material-section',
    [
        'title'       => __( 'Material Section', 'kadence-child' ),
        'description' => __( 'Six-card material navigation grid.', 'kadence-child' ),
        'categories'  => [ 'kadence-child', 'elevated' ],
        'content'     => $pattern_content,
    ]
);
