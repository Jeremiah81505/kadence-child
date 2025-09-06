<?php
/**
 * Kadence Child Theme core functions (repaired).
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

// Utilities (version helper, etc.)
if ( file_exists( get_theme_file_path( 'utils.php' ) ) ) {
  require_once get_theme_file_path( 'utils.php' );
}
if ( ! function_exists( 'kc_get_theme_version' ) ) {
  function kc_get_theme_version() { return wp_get_theme()->get( 'Version' ); }
}

// PHP 8 polyfill (older hosts)
if ( ! function_exists( 'str_starts_with' ) ) {
  function str_starts_with( $haystack, $needle ) {
    if ( $needle === '' ) { return true; }
    return strpos( $haystack, $needle ) === 0;
  }
}

/*--------------------------------------------------------------
| ASSETS
--------------------------------------------------------------*/
add_action( 'wp_enqueue_scripts', function() {
  $ver = kc_get_theme_version();
  wp_enqueue_style( 'kadence-child', get_stylesheet_uri(), array( 'kadence-theme' ), $ver );
  wp_enqueue_style( 'kc-header', get_stylesheet_directory_uri() . '/assets/css/header.css', array(), $ver );
  wp_enqueue_script( 'kc-header', get_stylesheet_directory_uri() . '/assets/js/header.js', array(), $ver, true );
  wp_enqueue_script( 'kadence-child-js', get_stylesheet_directory_uri() . '/assets/child.js', array(), $ver, true );
  wp_enqueue_script( 'kc-hero-motion', get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js', array(), $ver, true );
  wp_localize_script( 'kc-header', 'KC_HEADER', array( 'stickyOffset' => 64 ) );
}, 20 );

/*--------------------------------------------------------------
| THEME SETUP
--------------------------------------------------------------*/
add_action( 'after_setup_theme', function() {
  load_child_theme_textdomain( 'kadence-child', get_stylesheet_directory() . '/languages' );
  add_theme_support( 'title-tag' );
} );

/*--------------------------------------------------------------
| PATTERN CATEGORIES
--------------------------------------------------------------*/
add_action( 'init', function() {
  if ( ! function_exists( 'register_block_pattern_category' ) ) { return; }
  register_block_pattern_category( 'kadence-child', array( 'label' => __( 'Kadence Child', 'kadence-child' ) ) );
  register_block_pattern_category( 'elevated', array( 'label' => __( 'Elevated', 'kadence-child' ) ) );
  register_block_pattern_category( 'featured', array( 'label' => __( 'Featured', 'kadence-child' ) ) );
}, 8 );

/*--------------------------------------------------------------
| OPTIONAL DEBUG (opt‑in with constant + query parameter)
--------------------------------------------------------------*/
if ( defined( 'KC_DEBUG_PATTERNS' ) && KC_DEBUG_PATTERNS ) {
  add_action( 'admin_init', function() {
    if ( empty( $_GET['kc_patterns_debug'] ) || ! current_user_can( 'manage_options' ) ) { return; }
    if ( ! class_exists( 'WP_Block_Patterns_Registry' ) ) { require_once ABSPATH . 'wp-includes/class-wp-block-patterns-registry.php'; }
    add_action( 'admin_notices', function() {
      if ( ! class_exists( 'WP_Block_Patterns_Registry' ) ) { echo '<div class="notice notice-error"><p>Block Patterns Registry unavailable.</p></div>'; return; }
      $reg = WP_Block_Patterns_Registry::get_instance();
      $rows = array();
      foreach ( $reg->get_all_registered() as $slug => $data ) {
        if ( str_starts_with( $slug, 'kadence-child/' ) ) { $rows[] = esc_html( $slug . ' — ' . $data['title'] ); }
      }
      echo '<div class="notice notice-info"><p><strong>Kadence Child Patterns (' . count( $rows ) . ')</strong><br>' . ( $rows ? implode( '<br>', $rows ) : 'None registered' ) . '</p></div>';
    } );
  } );
}

/*--------------------------------------------------------------
| FORCE UNREGISTER DEPRECATED PATTERNS
--------------------------------------------------------------*/
add_action( 'init', function() {
  if ( ! function_exists( 'unregister_block_pattern' ) ) { return; }
  foreach ( array(
    'kadence-child/carousel-3d-ring',
    'kadence-child/carousel-3d-ring-basic',
    'kadence-child/carousel-3d-ring-v2',
    'kadence-child/carousel-3d-ring-adv',
    'kadence-child/hero-showcase-carousel'
  ) as $slug ) {
    unregister_block_pattern( $slug );
  }
}, 99 );

// End of file.
// Removed legacy carousel content scrubbing filter after full purge.

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

  // 3D advanced carousel assets (used in hero pattern)
  wp_enqueue_style(
    'kc-carousel-adv',
    get_stylesheet_directory_uri() . '/assets/css/carousel-adv.css',
    array(),
    $theme_version
  );
  wp_enqueue_script(
    'kc-carousel-adv',
    get_stylesheet_directory_uri() . '/assets/js/carousel-adv.js',
    array(),
    $theme_version,
    true
  );

  // 3D advanced carousel assets (used in hero pattern)
  wp_enqueue_style(
    'kc-carousel-adv',
    get_stylesheet_directory_uri() . '/assets/css/carousel-adv.css',
    array(),
    $theme_version
  );
  wp_enqueue_script(
    'kc-carousel-adv',
    get_stylesheet_directory_uri() . '/assets/js/carousel-adv.js',
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
// Inc patterns loader removed; rely solely on core /patterns auto-discovery.

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
// Removed custom manual loader. Relying on core pattern auto-discovery (child + parent /patterns directory).
// Pattern PHP files begin with a header comment (Title, Slug, Categories, Description) then close PHP and emit markup.
// Translation calls inside markup are executed when core includes the file, so manual buffering is unnecessary.

// Removed legacy fallback auto-registration (now using only explicit inc/patterns/*.php loaders).

/**
 * Optional on-demand debug: add ?kc_patterns_debug=1 to any admin page to see
 * a list of registered Kadence Child patterns & categories.
 */
// Lightweight optional pattern debug: enable by defining KC_DEBUG_PATTERNS true and visiting /wp-admin/?kc_patterns_debug=1
if ( defined( 'KC_DEBUG_PATTERNS' ) && KC_DEBUG_PATTERNS ) {
  add_action( 'admin_init', function() {
    if ( empty( $_GET['kc_patterns_debug'] ) || ! current_user_can( 'manage_options' ) ) { return; }
    if ( ! class_exists( 'WP_Block_Patterns_Registry' ) ) { require_once ABSPATH . 'wp-includes/class-wp-block-patterns-registry.php'; }
    add_action( 'admin_notices', function() {
      if ( ! class_exists( 'WP_Block_Patterns_Registry' ) ) { echo '<div class="notice notice-error"><p>Block Patterns Registry unavailable.</p></div>'; return; }
      $registry = WP_Block_Patterns_Registry::get_instance();
      $rows = array();
      foreach ( $registry->get_all_registered() as $slug => $data ) {
        if ( str_starts_with( $slug, 'kadence-child/' ) ) { $rows[] = esc_html( $slug . ' — ' . $data['title'] ); }
      }
      echo '<div class="notice notice-info"><p><strong>Kadence Child Patterns (' . count( $rows ) . '):</strong><br>' . ( $rows ? implode( '<br>', $rows ) : 'None registered' ) . '</p></div>';
    } );
  } );
}

// Final safeguard: explicitly unregister any deprecated carousel pattern slugs if they somehow exist.
add_action( 'init', function() {
  if ( ! function_exists( 'unregister_block_pattern' ) ) { return; }
  foreach ( array(
    'kadence-child/carousel-3d-ring',
    'kadence-child/carousel-3d-ring-basic',
    'kadence-child/carousel-3d-ring-v2',
    'kadence-child/carousel-3d-ring-adv',
    'kadence-child/hero-showcase-carousel'
  ) as $slug ) {
    unregister_block_pattern( $slug );
  }
}, 99 );

