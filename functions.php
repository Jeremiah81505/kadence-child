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
