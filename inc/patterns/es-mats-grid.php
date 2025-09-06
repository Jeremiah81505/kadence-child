<?php
/**
 * Pattern: Materials Grid
 */
if ( function_exists( 'register_block_pattern' ) ) {
    $file = get_theme_file_path( 'patterns/es-mats-grid.php' );
    if ( file_exists( $file ) ) {
        ob_start();
        include $file;
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
    }
}
