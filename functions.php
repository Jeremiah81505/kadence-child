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
  if ( ! function_exists( 'register_block_pattern_category' ) ) {
    return; // Older WP.
  }
  // Register (duplicate calls safely ignored by core)
  register_block_pattern_category( 'kadence-child', array( 'label' => __( 'Kadence Child', 'kadence-child' ) ) );
  register_block_pattern_category( 'elevated', array( 'label' => __( 'Elevated', 'kadence-child' ) ) );
  register_block_pattern_category( 'featured', array( 'label' => __( 'Featured', 'kadence-child' ) ) );
}, 8 );

add_action( 'init', function() {
  $pattern_files = glob( get_theme_file_path( 'inc/patterns/*.php' ) );
  if ( ! empty( $pattern_files ) ) {
    foreach ( $pattern_files as $file ) {
      require_once $file;
    }
  }
}, 9 );

/**
 * Fallback: if for any reason our explicit registration didn't yield patterns
 * (e.g. include failure on remote, missing files), attempt to auto-register
 * any files in /patterns with proper headers. This runs slightly later.
 */
add_action( 'init', function() {
  if ( ! function_exists( 'register_block_pattern' ) ) {
    return;
  }
  // If at least one of our namespace patterns is registered, skip fallback.
  $registry = WP_Block_Patterns_Registry::get_instance();
  $has_namespace = false;
  foreach ( $registry->get_all_registered() as $slug => $data ) {
    if ( str_starts_with( $slug, 'kadence-child/' ) ) { $has_namespace = true; break; }
  }
  if ( $has_namespace ) { return; }

  $dir = get_theme_file_path( 'patterns' );
  foreach ( glob( trailingslashit( $dir ) . '*.php' ) as $file ) {
    $contents = file_get_contents( $file );
    if ( ! $contents ) { continue; }
    if ( ! preg_match( '/^\s*<\?php\s*\/\*.*?\*\//s', $contents, $m ) ) { continue; }
    $header = $m[0];
    $get = function( $field ) use ( $header ) {
      return ( preg_match( '/^\s*\*\s*' . preg_quote( $field, '/' ) . '\s*:\s*(.+)$/mi', $header, $mm ) ) ? trim( $mm[1] ) : '';
    };
    $title = $get( 'Title' );
    $slug  = $get( 'Slug' );
    $cats  = $get( 'Categories' );
    if ( ! $title || ! $slug ) { continue; }
    if ( ! $registry->is_registered( $slug ) ) {
      // Extract description
      $desc = $get( 'Description' );
      $categories = array();
      if ( $cats ) {
        foreach ( preg_split( '/\s*,\s*/', $cats ) as $c ) { if ( $c ) { $categories[] = $c; } }
      }
      // Buffer the markup portion (include file to allow PHP in markup if any)
      ob_start();
      include $file;
      $content = ob_get_clean();
      register_block_pattern( $slug, array(
        'title'       => $title,
        'description' => $desc,
        'categories'  => $categories ?: array( 'kadence-child' ),
        'content'     => $content,
      ) );
    }
  }
}, 15 );

/**
 * Optional on-demand debug: add ?kc_patterns_debug=1 to any admin page to see
 * a list of registered Kadence Child patterns & categories.
 */
add_action( 'admin_notices', function() {
  if ( ! current_user_can( 'manage_options' ) ) { return; }
  if ( empty( $_GET['kc_patterns_debug'] ) ) { return; }
  $registry = WP_Block_Patterns_Registry::get_instance();
  $patterns = array();
  foreach ( $registry->get_all_registered() as $slug => $data ) {
    if ( str_starts_with( $slug, 'kadence-child/' ) ) {
      $patterns[] = esc_html( $slug . ' — ' . $data['title'] );
    }
  }
  echo '<div class="notice notice-info"><p><strong>Kadence Child Patterns:</strong><br>' . ( $patterns ? implode( '<br>', $patterns ) : 'None registered' ) . '</p></div>';
} );