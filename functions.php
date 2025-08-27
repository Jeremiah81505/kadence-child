<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Enqueue child + header assets
 */
add_action( 'wp_enqueue_scripts', function() {
  // Ensure child stylesheet after parent
  wp_enqueue_style( 'kadence-child', get_stylesheet_uri(), array( 'kadence-theme' ), '1.0.0' );

  // Header assets
  wp_enqueue_style(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/css/header.css',
    array(),
    '1.0.0'
  );
  wp_enqueue_script(
    'kc-header',
    get_stylesheet_directory_uri() . '/assets/js/header.js',
    array(),
    '1.0.0',
    true
  );

  // Pass settings to JS
  wp_localize_script( 'kc-header', 'KC_HEADER', array(
    'stickyOffset' => 64,
  ) );
}, 20 );

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
    <span class="kc-cart-count" data-count="<?php echo WC()->cart->get_cart_contents_count(); ?>">
      <?php echo WC()->cart->get_cart_contents_count(); ?>
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

