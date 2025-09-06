<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once get_theme_file_path( 'utils.php' ); // Provides kc_get_theme_version()
require_once get_theme_file_path( 'inc/customizer.php' );

/**
 * Enqueue child + header assets
 */
add_action( 'wp_enqueue_scripts', function() {
  $theme_version = kc_get_theme_version();
  // Ensure child stylesheet after parent
  wp_enqueue_style( 'kadence-child', get_stylesheet_uri(), array( 'kadence-theme' ), $theme_version );

  // Header assets
  wp_enqueue_style(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/css/header.css',
    array(),
    $theme_version
  );
  wp_enqueue_script(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/js/header.js',
    array(),
    $theme_version,
    true
  );
    // 3D Carousel Ring JS
    wp_enqueue_script(
      'kc-carousel-3d-ring',
      get_stylesheet_directory_uri() . '/assets/js/carousel-3d-ring.js',
      array(),
      $theme_version,
      true
    );

  // Core child theme scripts
  wp_enqueue_script(
    'kadence-child-js',
    get_stylesheet_directory_uri() . '/assets/child.js',
    array(),
    $theme_version,
    true
  );
  wp_enqueue_script(
    'kc-hero-motion',
    get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js',
    array(),
    $theme_version,
    true
  );

  // Pass settings to JS
  wp_localize_script( 'kc-header', 'KC_HEADER', array(
    'stickyOffset' => 64,
  ) );
}, 20 );

// Removed legacy automatic raw file registration of patterns.
// We now explicitly register patterns via buffered includes in inc/patterns/*.php
// to ensure clean markup (no PHP headers) and proper titles/descriptions.

// Load pattern registration scripts (each script buffers and registers a pattern).
// First ensure our custom pattern categories exist.
add_action( 'init', function() {
  if ( function_exists( 'register_block_pattern_category' ) ) {
    $cats = array(
      'kadence-child' => __( 'Kadence Child', 'kadence-child' ),
      'elevated'      => __( 'Elevated', 'kadence-child' ),
      'featured'      => __( 'Featured', 'kadence-child' ),
    );
    foreach ( $cats as $slug => $label ) {
      if ( ! WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $slug ) ) {
        register_block_pattern_category( $slug, array( 'label' => $label ) );
      }
    }
  }
}, 8 );

add_action( 'init', function() {
  $pattern_files = glob( get_theme_file_path( 'inc/patterns/*.php' ) );
  if ( ! empty( $pattern_files ) ) {
    foreach ( $pattern_files as $file ) {
      require_once $file;
    }
  }
}, 9 );