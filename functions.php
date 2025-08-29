<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once get_theme_file_path( 'utils.php' );
require_once get_theme_file_path( 'inc/customizer.php' );

/**
 * Returns the current theme version.
 *
 * @return string Theme version string.
 */
function kc_get_theme_version() {
    $theme = wp_get_theme();
    return $theme->get('Version');
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