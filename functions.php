<?php
/**
 * Kadence Child – core setup
 */
add_action('wp_enqueue_scripts', function () {
  // Parent CSS
  wp_enqueue_style(
    'kadence-parent',
    get_template_directory_uri() . '/style.css',
    [],
    null
  );

  // Child CSS (cache-bust via theme version)
  wp_enqueue_style(
    'kadence-child',
    get_stylesheet_uri(),
    ['kadence-parent'],
    wp_get_theme()->get('Version')
  );

  // Optional child JS (enqueued only if the file exists)
  $child_js_path = get_stylesheet_directory() . '/assets/child.js';
  if (file_exists($child_js_path)) {
    wp_enqueue_script(
      'kadence-child',
      get_stylesheet_directory_uri() . '/assets/child.js',
      [],
      filemtime($child_js_path),
      true
    );
  }
});

// (Optional) Add a patterns category so your patterns group nicely in the editor
add_action('init', function () {
  if ( function_exists('register_block_pattern_category') ) {
    register_block_pattern_category(
      'kadence-child',
      ['label' => __('Kadence Child', 'kadence-child')]
    );
  }
});
