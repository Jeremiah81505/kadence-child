<?php
/**
 * Proxy to Kadence parent theme header.
 *
 * Keeping this file (instead of deleting) guarantees future updates won't accidentally recreate a custom markup.
 * It simply includes the parent theme's original header.php so you get the normal Kadence Header Builder output.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

// Directly load the parent theme header template and stop.
// This prevents duplicate DOCTYPE/body tags that occurred when we manually output them here.
require get_template_directory() . '/header.php';
return; // Safety: ensure nothing else runs below.
?>
