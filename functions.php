<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once get_theme_file_path( 'utils.php' ); // Provides kc_get_theme_version()
require_once get_theme_file_path( 'inc/customizer.php' );

/**
 * Polyfills & defensive guards
 */
// PHP 8 str_starts_with used later; add lightweight polyfill for older PHP.
if ( ! function_exists( 'str_starts_with' ) ) {
  function str_starts_with( $haystack, $needle ) {
    if ( $needle === '' ) { return true; }
    return strpos( $haystack, $needle ) === 0;
  }
}

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
    // Allow emergency disabling of carousel scripts (define KC_DISABLE_CAROUSEL true in wp-config.php)
    if ( ! defined( 'KC_DISABLE_CAROUSEL' ) || ! KC_DISABLE_CAROUSEL ) {
      // 3D Carousel Ring JS (cache-busted)
      $carousel_file = get_stylesheet_directory() . '/assets/js/carousel-3d-ring.js';
      if ( file_exists( $carousel_file ) ) {
        wp_enqueue_script(
          'kc-carousel-3d-ring',
          get_stylesheet_directory_uri() . '/assets/js/carousel-3d-ring.js',
          array(),
          filemtime( $carousel_file ),
          true
        );
      }
      // Basic fallback script (for debugging environment issues). Will run only if markup uses .kc-basic-ring
      $carousel_basic = get_stylesheet_directory() . '/assets/js/carousel-3d-ring-basic.js';
      if ( file_exists( $carousel_basic ) ) {
        wp_enqueue_script(
          'kc-carousel-3d-ring-basic',
          get_stylesheet_directory_uri() . '/assets/js/carousel-3d-ring-basic.js',
          array(),
          filemtime( $carousel_basic ),
          true
        );
      }
    }

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

/**
 * Theme setup: load translations, enable features.
 */
add_action( 'after_setup_theme', function() {
  load_child_theme_textdomain( 'kadence-child', get_stylesheet_directory() . '/languages' );
  // Support for automatic title tag if not already by parent.
  add_theme_support( 'title-tag' );
} );

// Removed legacy automatic raw file registration of patterns.
// We now explicitly register patterns via buffered includes in inc/patterns/*.php
// to ensure clean markup (no PHP headers) and proper titles/descriptions.

// Load pattern registration scripts (each script buffers and registers a pattern).
// First ensure our custom pattern categories exist.
add_action( 'init', function() {
  if ( ! function_exists( 'register_block_pattern_category' ) ) {
    return; // Older WP.
  }
  // Register (duplicate calls safely ignored by core)
  register_block_pattern_category( 'kadence-child', array( 'label' => __( 'Kadence Child', 'kadence-child' ) ) );
  register_block_pattern_category( 'elevated', array( 'label' => __( 'Elevated', 'kadence-child' ) ) );
  register_block_pattern_category( 'featured', array( 'label' => __( 'Featured', 'kadence-child' ) ) );
}, 8 );

// Removed old manual loader for inc/patterns/*.php (now relying on core /patterns auto-registration).

// Removed legacy fallback auto-registration (now using only explicit inc/patterns/*.php loaders).

/**
 * Optional on-demand debug: add ?kc_patterns_debug=1 to any admin page to see
 * a list of registered Kadence Child patterns & categories.
 */
add_action( 'admin_notices', function() {
  if ( ! current_user_can( 'manage_options' ) ) { return; }
  if ( empty( $_GET['kc_patterns_debug'] ) ) { return; }
  if ( ! class_exists( 'WP_Block_Patterns_Registry' ) ) { echo '<div class="notice notice-error"><p>Block Patterns Registry unavailable.</p></div>'; return; }
  $registry = WP_Block_Patterns_Registry::get_instance();
  $patterns = array();
  foreach ( $registry->get_all_registered() as $slug => $data ) {
    if ( str_starts_with( $slug, 'kadence-child/' ) ) {
      $patterns[] = esc_html( $slug . ' — ' . $data['title'] );
    }
  }
  echo '<div class="notice notice-info"><p><strong>Kadence Child Patterns:</strong><br>' . ( $patterns ? implode( '<br>', $patterns ) : 'None registered' ) . '</p></div>';
} );