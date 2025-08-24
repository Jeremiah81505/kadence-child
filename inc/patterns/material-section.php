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
        'description' => __( 'Section highlighting materials with heading and columns.', 'kadence-child' ),
        'categories'  => [ 'kadence-child', 'text' ],
        'content'     => $pattern_content,
    ]
);
