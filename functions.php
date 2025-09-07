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
// Simple file-based version (cache bust on change) with fallback to theme version.
if ( ! function_exists( 'kc_asset_ver' ) ) {
  function kc_asset_ver( $rel_path ) {
    $file = get_stylesheet_directory() . '/' . ltrim( $rel_path, '/' );
    $mtime = file_exists( $file ) ? filemtime( $file ) : false;
    return $mtime ? (string) $mtime : kc_get_theme_version();
  }
}

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

/*--------------------------------------------------------------
| OPTIONAL: FORCE A SPECIFIC REUSABLE BLOCK AS HEADER (ID 1769)
| If the Kadence Header Builder UI isn't outputting your desired
| block (e.g. "Header 1769"), this provides a guaranteed fallback.
| Disable by commenting out the define() below.
--------------------------------------------------------------*/
if ( ! defined( 'KC_FORCE_HEADER_BLOCK_ID' ) ) {
  // Set to the reusable block (wp_block post) ID for "Header 1769".
  define( 'KC_FORCE_HEADER_BLOCK_ID', 1769 );
}

// Output the forced header block just after <body> opens, BEFORE page content.
add_action( 'wp_body_open', function() {
  if ( ! KC_FORCE_HEADER_BLOCK_ID ) { return; }
  $block_post = get_post( KC_FORCE_HEADER_BLOCK_ID );
  if ( ! $block_post || 'wp_block' !== $block_post->post_type || 'publish' !== $block_post->post_status ) { return; }
  // Optionally hide the normal Kadence header (uncomment style below if needed).
  // echo '<style>#masthead{display:none!important}</style>';
  echo '<header id="kc-forced-header" class="kc-forced-header" data-source="kc-force-header-block">';
  echo do_blocks( $block_post->post_content );
  echo '</header>';
}, 5 );

// End of file.
// Removed legacy carousel content scrubbing filter after full purge.

/**
 * Enqueue child + header assets
 */
add_action( 'wp_enqueue_scripts', function() {
  // Styles
  wp_enqueue_style( 'kadence-child', get_stylesheet_uri(), array( 'kadence-theme' ), kc_asset_ver( 'style.css' ) );
  wp_enqueue_style( 'kc-header', get_stylesheet_directory_uri() . '/assets/css/header.css', array(), kc_asset_ver( 'assets/css/header.css' ) );
  wp_enqueue_style( 'kc-carousel-adv', get_stylesheet_directory_uri() . '/assets/css/carousel-adv.css', array(), kc_asset_ver( 'assets/css/carousel-adv.css' ) );

  // Scripts
  wp_enqueue_script( 'kc-header', get_stylesheet_directory_uri() . '/assets/js/header.js', array(), kc_asset_ver( 'assets/js/header.js' ), true );
  wp_enqueue_script( 'kadence-child-js', get_stylesheet_directory_uri() . '/assets/child.js', array(), kc_asset_ver( 'assets/child.js' ), true );
  wp_enqueue_script( 'kc-hero-motion', get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js', array(), kc_asset_ver( 'assets/js/hero-ultimate-motion.js' ), true );
  wp_enqueue_script( 'kc-carousel-adv', get_stylesheet_directory_uri() . '/assets/js/carousel-adv.js', array(), kc_asset_ver( 'assets/js/carousel-adv.js' ), true );

  wp_localize_script( 'kc-header', 'KC_HEADER', array( 'stickyOffset' => 64 ) );
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

/* -------------------------------------------------------------
| HERO ULTIMATE AUTO-UPGRADE (non-destructive frontend patch)
| Reason: Previously inserted block pattern instances are static
| snapshots. Users reported new motion / color-wash changes not
| appearing because existing content lacked new markup pieces.
| This filter augments legacy hero markup on the fly by:
|  1. Adding data-enhanced="true" attribute
|  2. Injecting .kc-colorwash layer after background image
|  3. Injecting floating blob elements inside .kc-hero-wrap
| Safe Guards:
|  - Skips if already enhanced (data-enhanced or existing nodes)
|  - Runs only on singular front-end content (not feeds / admin)
|  - Light regex; avoids heavy DOM libs for performance
| Remove once all pages re-saved with new pattern structure.
-------------------------------------------------------------- */
add_filter( 'the_content', function( $content ) {
  if ( is_admin() || ! is_singular() ) { return $content; }
  if ( false === strpos( $content, 'kc-hero-ultimate' ) ) { return $content; }
  // Already enhanced? Presence of data-enhanced attr or colorwash layer.
  if ( preg_match( '/kc-hero-ultimate[^>]*data-enhanced="true"/i', $content ) || strpos( $content, 'kc-colorwash' ) !== false ) {
    return $content;
  }
  $modified = $content;
  // 1. Add data-enhanced attribute to first hero container.
  $modified = preg_replace( '/(<div[^>]*class="[^"]*kc-hero-ultimate[^"]*"[^>]*)>/', '$1 data-enhanced="true">', $modified, 1 );
  // 2. Inject colorwash layer after background image element.
  $modified = preg_replace( '/(<img[^>]*wp-block-cover__image-background[^>]*>)/', "$1\n  <div class=\"kc-colorwash\" aria-hidden=\"true\"></div>", $modified, 1 );
  // 3. Inject floating blobs just inside hero wrap container.
  $modified = preg_replace( '/(<div[^>]*class="[^"]*kc-hero-wrap[^"]*"[^>]*>)/', '$1\n  <div class="kc-float a" aria-hidden="true"></div><div class="kc-float b" aria-hidden="true"></div><div class="kc-float c" aria-hidden="true"></div>', $modified, 1 );
  return $modified;
}, 12 );

/**
 * Lightweight diagnostic output: append HTML comment in footer with hero detection.
 * Usage: add ?kc_hero_diag=1 to a singular URL while logged in or not.
 */
add_action( 'wp_footer', function() {
  if ( empty( $_GET['kc_hero_diag'] ) || ! is_singular() ) { return; }
  global $post; $raw = $post ? $post->post_content : '';
  $has_pattern_slug = ( false !== strpos( $raw, 'kc-hero-ultimate' ) );
  $has_enhanced_attr = ( false !== strpos( $raw, 'data-enhanced="true"' ) );
  echo "\n<!-- kc-hero-diag id=" . ( $post ? intval( $post->ID ) : 0 ) . " pattern_present=" . ( $has_pattern_slug ? 'yes' : 'no' ) . " enhanced_attr_present=" . ( $has_enhanced_attr ? 'yes' : 'no' ) . " -->\n"; // phpcs:ignore WordPress.Security.EscapeOutput
}, 99 );

