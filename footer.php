<?php
/**
 * Child footer proxy – defer rendering to Kadence parent theme.
 *
 * Why: A child footer.php overrides the parent and forces static markup,
 * which makes the footer look "stuck" and uneditable. This file simply
 * loads the parent footer template so the Kadence Footer Builder controls
 * the output again.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

// Load the parent theme's footer template.
// get_template_directory() always points to the parent (Kadence) theme.
require get_template_directory() . '/footer.php';
