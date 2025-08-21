<?php
require_once __DIR__ . '/utils.php';
/**
 * Kadence Child – enqueue styles & JS
 */

add_action('wp_enqueue_scripts', function () {
  // Parent theme CSS
  wp_enqueue_style(
    'kadence-parent',
    get_template_directory_uri() . '/style.css',
    [],
    null
  );

  // Child theme CSS (cache-bust via theme version)
  wp_enqueue_style(
    'kadence-child',
    get_stylesheet_uri(),
    ['kadence-parent'],
    wp_get_theme()->get('Version')
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

/** ---------- BEGIN: Kadence Child Pattern Category ---------- */
add_action( 'init', function () {
  if ( function_exists( 'register_block_pattern_category' ) ) {
    register_block_pattern_category(
      'kadence-child',
      [ 'label' => __( 'Kadence Child', 'kadence-child' ) ]
    );
  }
});

// (Editor-only sanity ping in browser console so we know this loaded)
add_action( 'enqueue_block_editor_assets', function () {
  if ( function_exists( 'wp_add_inline_script' ) ) {
    wp_add_inline_script( 'wp-blocks', 'console.log("Kadence Child: pattern category registered");' );
  }
});
/** ---------- END: Kadence Child Pattern Category ---------- */

// Enqueue editor-only styles so the 3D ring carousel previews nicely in the editor
add_action('enqueue_block_editor_assets', function () {
  $path = get_stylesheet_directory() . '/assets/css/editor.css';
  if ( file_exists( $path ) ) {
    wp_enqueue_style(
      'kadence-child-editor',
      get_stylesheet_directory_uri() . '/assets/css/editor.css',
      [],
      filemtime( $path )
    );
  }
});
// Ensure child styles load after parent, with cache-busting
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_style('kadence-parent', get_template_directory_uri() . '/style.css', [], null);
  $child_css_path = get_stylesheet_directory() . '/style.css';
  wp_enqueue_style(
    'kadence-child',
    get_stylesheet_uri(),
    ['kadence-parent'],
    file_exists($child_css_path) ? filemtime($child_css_path) : null
  );
}, 5);
