<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

require_once get_theme_file_path( 'utils.php' );
require_once get_theme_file_path( 'inc/customizer.php' );

/**
<<<<<<< HEAD
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
=======
 * Enqueue child + header assets
 */
add_action( 'wp_enqueue_scripts', function() {
  // Ensure child stylesheet after parent
  wp_enqueue_style( 'kadence-child', get_stylesheet_uri(), array( 'kadence-theme' ), '1.0.0' );
>>>>>>> kadence-child/main

  // Header assets
  wp_enqueue_style(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/css/header.css',
    array(),
<<<<<<< HEAD
    $theme_version
=======
    '1.0.0'
>>>>>>> kadence-child/main
  );
  wp_enqueue_script(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/js/header.js',
    array(),
<<<<<<< HEAD
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
=======
    '1.0.0',
    true
  );
>>>>>>> kadence-child/main

  // Core child theme scripts
  wp_enqueue_script(
    'kadence-child-js',
    get_stylesheet_directory_uri() . '/assets/child.js',
    array(),
<<<<<<< HEAD
    $theme_version,
=======
    '1.0.0',
>>>>>>> kadence-child/main
    true
  );
  wp_enqueue_script(
    'kc-hero-motion',
    get_stylesheet_directory_uri() . '/assets/js/hero-ultimate-motion.js',
    array(),
<<<<<<< HEAD
    $theme_version,
=======
    '1.0.0',
>>>>>>> kadence-child/main
    true
  );

  // Pass settings to JS
  wp_localize_script( 'kc-header', 'KC_HEADER', array(
    'stickyOffset' => 64,
  ) );
}, 20 );
<<<<<<< HEAD
// Register custom block patterns from patterns folder
add_action('init', function() {
  $patterns_dir = get_stylesheet_directory() . '/patterns';
  foreach (glob($patterns_dir . '/*.php') as $file) {
    $content = file_get_contents($file);
    // Extract header info (optional: for advanced parsing)
    register_block_pattern(
      'kadence-child/' . basename($file, '.php'),
      array(
        'title'       => '', // Title is read from the file header
        'description' => '', // Description is read from the file header
        'categories'  => array('kadence-child', 'featured'), // Categories from header
        'content'     => $content // Block markup
      )
    );
  }
});
=======

/**
 * Declare menu locations
 */
add_action( 'after_setup_theme', function() {
  register_nav_menus( array(
    'primary'   => __( 'Primary Menu', 'kadence-child' ),
    'secondary' => __( 'Secondary Menu', 'kadence-child' ),
    'footer'    => __( 'Footer Menu', 'kadence-child' ),
  ) );
} );

/**
 * WooCommerce mini-cart count fragment (optional)
 */
if ( class_exists( 'WooCommerce' ) ) {
  add_filter( 'woocommerce_add_to_cart_fragments', function( $fragments ) {
    ob_start(); ?>
    <span class="kc-cart-count" data-count="<?php echo esc_attr( WC()->cart->get_cart_contents_count() ); ?>">
      <?php echo esc_html( WC()->cart->get_cart_contents_count() ); ?>
    </span>
    <?php
    $fragments['span.kc-cart-count'] = ob_get_clean();
    return $fragments;
  } );
}

/**
 * Optional: add .has-hero class for transparent header pages (front page or hero template)
 */
add_filter( 'body_class', function( $classes ){
  if ( is_front_page() ) {
    $classes[] = 'has-hero';
  }
  return $classes;
} );

/**
 * Register custom block pattern category and load pattern definitions.
 */
add_action( 'init', function() {
  register_block_pattern_category(
    'kadence-child',
    array( 'label' => __( 'Kadence Child', 'kadence-child' ) )
  );

  $pattern_dir = get_theme_file_path( 'inc/patterns' );
  if ( is_dir( $pattern_dir ) ) {
    foreach ( glob( $pattern_dir . '/*.php' ) as $pattern ) {
      include $pattern;
    }
  }
} );

>>>>>>> kadence-child/main
