<?php
/**
 * Pattern: Materials Grid (6 Cards, Hero + Mix)
 *
 * Registers a block pattern for a 6-card materials grid.
 * If patterns/es-mats-grid.php exists, its output is used.
 * Otherwise, a safe inline HTML fallback is registered.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$include_path = get_theme_file_path( 'patterns/es-mats-grid.php' );

if ( file_exists( $include_path ) ) {
        ob_start();
        include $include_path;
        $pattern_content = ob_get_clean();
} else {
        ob_start();
        include get_theme_file_path( 'inc/patterns/es-mats-grid-template.php' );
        $pattern_content = ob_get_clean();
}

if ( function_exists( 'register_block_pattern' ) ) {
	register_block_pattern(
		'kadence-child/es-mats-grid',
		[
			'title'       => __( 'Materials Grid (6 Cards, Hero + Mix)', 'kadence-child' ),
			'description' => __( 'Six-card materials navigation grid with aligned images, sliding overlays, and hover motion.', 'kadence-child' ),
			'categories'  => [ 'kadence-child', 'elevated' ],
			'content'     => $pattern_content,
			'inserter'    => true,
		]
	);
}
