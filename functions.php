<?php
require_once __DIR__ . '/utils.php';

add_action( 'after_setup_theme', function () {
  load_child_theme_textdomain( 'kadence-child', get_stylesheet_directory() . '/languages' );
} );
/**
 * Kadence Child – enqueue styles & JS
 */

add_filter( 'body_class', function ( $classes ) {
  if ( ! in_array( 'no-js', $classes, true ) ) {
    $classes[] = 'no-js';
  }
  return $classes;
} );

add_action('wp_enqueue_scripts', function () {
  // Parent theme CSS
  $parent_css_path = get_template_directory() . '/style.css';
  wp_enqueue_style(
    'kadence-parent',
    get_template_directory_uri() . '/style.css',
    [],
    file_exists( $parent_css_path ) ? filemtime( $parent_css_path ) : null
  );

  // Child theme CSS (cache-bust via file modification time)
  $child_css_path = get_stylesheet_directory() . '/style.css';
  wp_enqueue_style(
    'kadence-child',
    get_stylesheet_uri(),
    ['kadence-parent'],
    file_exists( $child_css_path ) ? filemtime( $child_css_path ) : null
  );

  // ---- Child JS (loads only if the file exists) ----
    $child_js_file = get_stylesheet_directory() . '/assets/child.js';
    if ( file_exists( $child_js_file ) ) {
      wp_enqueue_script(
        'kadence-child-js',
        get_stylesheet_directory_uri() . '/assets/child.js',
        [],                                   // Add deps here if you ever need (e.g., ['jquery'])
        filemtime( $child_js_file ),          // Cache-bust when file changes
        true                                  // Load in footer
      );
    }
  });

add_action( 'wp_enqueue_scripts', function () {
  wp_enqueue_script(
    'kc-hero-ultimate-motion',
    get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js',
    [],
    '1.0.0',
    true
  );
}, 20 );

/** ---------- BEGIN: Kadence Child Pattern Category ---------- */
add_action( 'init', function () {
  if ( function_exists( 'register_block_pattern_category' ) ) {
    register_block_pattern_category(
      'kadence-child',
      [ 'label' => __( 'Kadence Child', 'kadence-child' ) ]
    );
  }
});

/** ---------- END: Kadence Child Pattern Category ---------- */

// Enqueue editor-only styles so patterns preview correctly in the editor
add_action('enqueue_block_editor_assets', function () {
  $dir = get_stylesheet_directory();
  $uri = get_stylesheet_directory_uri();

  $editor = $dir . '/assets/css/editor.css';
  if ( file_exists( $editor ) ) {
    wp_enqueue_style(
      'kadence-child-editor',
      $uri . '/assets/css/editor.css',
      [],
      filemtime( $editor )
    );
  }

  $mats = $dir . '/assets/css/es-mats.css';
  if ( file_exists( $mats ) ) {
    wp_enqueue_style(
      'es-mats',
      $uri . '/assets/css/es-mats.css',
      [],
      filemtime( $mats )
    );
  }
});

add_action('wp_enqueue_scripts', function () {
  $ver = wp_get_theme()->get('Version');

  wp_enqueue_style(
    'es-mats',
    get_stylesheet_directory_uri() . '/assets/css/es-mats.css',
    [],
    $ver
  );

  wp_enqueue_script(
    'es-mats',
    get_stylesheet_directory_uri() . '/assets/js/es-mats.js',
    [],
    $ver,
    true
  );
});

add_action('init', function () {
  if ( function_exists('register_block_pattern_category') ) {
    register_block_pattern_category(
      'elevated',
      ['label' => __('Elevated Surfaces', 'kadence-child')]
    );
  }
  $pattern_file = get_stylesheet_directory() . '/inc/patterns/es-mats-grid.php';
  if ( file_exists($pattern_file) ) {
    require_once $pattern_file;
  }
});
