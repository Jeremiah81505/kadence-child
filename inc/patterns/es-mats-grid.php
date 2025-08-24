<?php
/**
 * Pattern: Materials Grid (6 Cards, Hero + Mix)
 *
 * Registers the Materials Grid block pattern.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once __DIR__ . '/es-mats-grid-template.php';

if ( function_exists( 'register_block_pattern' ) ) {
    register_block_pattern(
        'kadence-child/es-mats-grid',
        [
            'title'       => __( 'Materials Grid (6 Cards, Hero + Mix)', 'kadence-child' ),
            'description' => __( 'Six-card materials navigation grid with aligned images, sliding overlays, and hover motion.', 'kadence-child' ),
            'categories'  => [ 'kadence-child', 'elevated' ],
            'content'     => kc_es_mats_grid_markup(),
            'inserter'    => true,
        ]
    );
}
