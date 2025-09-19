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
  // Set to 0 to disable forced header block output.
  define( 'KC_FORCE_HEADER_BLOCK_ID', 0 );
}

// Disable front-page auto hero injection so homepage shows nothing unless content exists.
if ( ! defined( 'KC_DISABLE_HERO_FRONT' ) ) {
  define( 'KC_DISABLE_HERO_FRONT', true );
}

// Global motion toggle. Default to no motion for a calmer, classy feel.
if ( ! defined( 'KC_NO_MOTION' ) ) {
  define( 'KC_NO_MOTION', true );
}

// Add a body class when motion is disabled; allow runtime override via ?kc_motion=1 to preview animations.
add_filter( 'body_class', function( $classes ) {
  $enable = isset( $_GET['kc_motion'] ) && $_GET['kc_motion'] == '1';
  if ( KC_NO_MOTION && ! $enable && ! in_array( 'kc-no-motion', $classes, true ) ) {
    $classes[] = 'kc-no-motion';
  }
  return $classes;
}, 5 );

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
  // Dedicated hero motion styles (isolated from main style.css for reliability)
  wp_enqueue_style( 'kc-hero-motion-css', get_stylesheet_directory_uri() . '/assets/css/hero-motion.css', array( 'kadence-child' ), kc_asset_ver( 'assets/css/hero-motion.css' ) );

  // Scripts
  wp_enqueue_script( 'kc-header', get_stylesheet_directory_uri() . '/assets/js/header.js', array(), kc_asset_ver( 'assets/js/header.js' ), true );
  wp_enqueue_script( 'kadence-child-js', get_stylesheet_directory_uri() . '/assets/child.js', array(), kc_asset_ver( 'assets/child.js' ), true );
  wp_enqueue_script( 'kc-hero-motion', get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js', array(), kc_asset_ver( 'assets/js/hero-ultimate-motion.js' ), true );
  wp_enqueue_script( 'kc-carousel-adv', get_stylesheet_directory_uri() . '/assets/js/carousel-adv.js', array(), kc_asset_ver( 'assets/js/carousel-adv.js' ), true );

  wp_localize_script( 'kc-header', 'KC_HEADER', array( 'stickyOffset' => 64 ) );
  // Provide a flag to tone down hero motion without affecting carousel
  wp_localize_script( 'kc-hero-motion', 'KC_HERO', array( 'minimal' => true ) );
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

// Lightweight footer hook diagnostic: visit any page with ?kc_footer_diag=1 and view-source
add_action( 'wp_footer', function() {
  if ( empty( $_GET['kc_footer_diag'] ) ) { return; }
  $ts = gmdate( 'c' );
  // Emit multiple signals so minifiers/caches can't hide them all
  echo "\n<!-- kc-footer-hook ok ts={$ts} -->\n"; // phpcs:ignore WordPress.Security.EscapeOutput
  echo '<script>window.KC_FOOTER_HOOK_OK = ' . json_encode( $ts ) . '; console.log("[kc] footer hook ok", window.KC_FOOTER_HOOK_OK);</script>'; // phpcs:ignore WordPress.Security.EscapeOutput
  echo '<div id="kc-footer-marker" data-ts="' . esc_attr( $ts ) . '" style="display:none"></div>' ; // phpcs:ignore WordPress.Security.EscapeOutput
}, 999 );

// Add diagnostics header early to confirm child theme is active and hooks run.
add_action( 'send_headers', function( $wp ) {
  if ( empty( $_GET['kc_footer_diag'] ) && empty( $_GET['kc_diag'] ) ) { return; }
  header( 'X-KC-Child: active' );
  header( 'X-KC-Time: ' . gmdate( 'c' ) );
  // Strongly discourage caches when diagnosing
  header( 'Cache-Control: no-cache, no-store, must-revalidate, max-age=0' );
  header( 'Pragma: no-cache' );
  header( 'Expires: 0' );
} );

// Body-open marker for verification
add_action( 'wp_body_open', function() {
  if ( empty( $_GET['kc_diag'] ) ) { return; }
  echo "\n<!-- kc-body-open ok -->\n"; // phpcs:ignore WordPress.Security.EscapeOutput
}, 1 );

// Optional visible admin-only footer outline (toggle with ?kc_footer_outline=1)
add_action( 'wp_head', function() {
  if ( empty( $_GET['kc_footer_outline'] ) || ! function_exists( 'current_user_can' ) || ! current_user_can( 'manage_options' ) ) { return; }
  echo '<style>#colophon,.kc-footer{outline: 3px solid #e91e63 !important; outline-offset: -3px;}</style>'; // phpcs:ignore WordPress.Security.EscapeOutput
}, 99 );

/**
 * Body class helper: add `has-hero` when the Ultimate Hero exists on the page.
 * Enables header transparency and removes any hairline border gap above hero.
 */
add_filter( 'body_class', function( $classes ) {
  $has = false;
  if ( is_front_page() ) {
    $has = true; // front page commonly hosts hero
  } elseif ( is_singular() ) {
    global $post;
    $has = $post && ( false !== strpos( (string) $post->post_content, 'kc-hero-ultimate' ) );
  }
  if ( $has && ! in_array( 'has-hero', $classes, true ) ) {
    $classes[] = 'has-hero';
  }
  return $classes;
}, 20 );

/* -------------------------------------------------------------
| OPTIONAL AUTO FRONT PAGE HERO INJECTION (for debugging)
| Purpose: User confusion around pattern reinsertion. This makes
| updates to /patterns/hero-ultimate-motion.php appear instantly
| on the front page without editing the page content. Remove or
| disable (define KC_DISABLE_HERO_FRONT true) once resolved.
-------------------------------------------------------------- */
// Disabled by default: only inject when KC_ENABLE_HERO_FRONT is explicitly true.
add_action( 'wp_body_open', function() {
  if ( ! ( defined( 'KC_ENABLE_HERO_FRONT' ) && KC_ENABLE_HERO_FRONT ) ) { return; }
  if ( ! is_front_page() ) { return; }
  $file = get_stylesheet_directory() . '/patterns/hero-ultimate-motion.php';
  if ( file_exists( $file ) ) {
    echo "\n<!-- kc-hero-auto (front page) -->\n"; // phpcs:ignore WordPress.Security.EscapeOutput
    include $file; // phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude
  } else {
    echo "\n<!-- kc-hero-auto missing pattern file -->\n"; // phpcs:ignore WordPress.Security.EscapeOutput
  }
}, 15 );

/* -------------------------------------------------------------
| CRITICAL INLINE HERO CSS (failsafe)
| If style.css isn't loading or caching strips rules, this ensures
| minimal visuals so JS doesn't flag missing CSS. Remove after fix.
-------------------------------------------------------------- */
add_action( 'wp_head', function() {
  // Only output if hero likely present on this request (cheap check in post content or auto front injection on front page)
  if ( is_admin() ) { return; }
  $need = is_front_page();
  if ( ! $need && is_singular() ) {
    global $post; $need = $post && strpos( $post->post_content, 'kc-hero-ultimate' ) !== false;
  }
  if ( ! $need ) { return; }
  echo '<style id="kc-hero-critical">.kc-hero-ultimate{position:relative;overflow:hidden;color:#fff;} .kc-hero-ultimate .wp-block-cover__image-background{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;z-index:0;filter:brightness(.72);} .kc-hero-ultimate .kc-colorwash{position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;background:radial-gradient(circle at 30% 40%,rgba(120,160,255,.55),transparent 60%),radial-gradient(circle at 75% 70%,rgba(125,226,209,.45),transparent 65%),linear-gradient(120deg,rgba(20,26,36,.4),rgba(12,16,26,.55));opacity:.45;z-index:1;} .kc-hero-ultimate .kc-hero-wrap{position:relative;z-index:2;} .kc-hero-ultimate .kc-float{position:absolute;border-radius:50%;filter:blur(38px) saturate(140%);opacity:.5;mix-blend-mode:screen;} .kc-hero-ultimate .kc-float.a{width:320px;height:320px;top:-80px;left:-100px;background:radial-gradient(circle at 30% 30%,rgba(185,156,255,.75),rgba(120,90,255,.28) 70%,transparent 74%);} .kc-hero-ultimate .kc-float.b{width:260px;height:260px;bottom:-40px;right:8%;background:radial-gradient(circle at 40% 40%,rgba(125,226,209,.75),rgba(60,170,150,.3) 68%,transparent 72%);} .kc-hero-ultimate .kc-float.c{width:220px;height:220px;top:12%;right:-4%;background:radial-gradient(circle at 45% 30%,rgba(255,212,121,.8),rgba(220,160,80,.25) 72%,transparent 76%);} .kc-hero-ultimate .kc-title{margin:.5em 0;font-weight:800;line-height:1.05;} .kc-hero-ultimate .kc-title .kc-gradient{background:linear-gradient(90deg,#fff,#dfe7ff);-webkit-background-clip:text;background-clip:text;color:transparent;} .kc-hero-ultimate .kc-materials-card{background:rgba(10,10,20,.6);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,.4);} .kc-hero-ultimate .kc-chip{display:inline-flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);padding:10px 14px;border-radius:12px;margin:4px;font-size:.85rem;color:#fff;text-decoration:none;} </style>';
}, 5 );

