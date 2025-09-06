<?php
/**
 * Utility functions for Kadence Child theme.
 */

/**
 * Returns the current theme version.
 *
 * @return string Theme version string.
 */
function kc_get_theme_version() {
  $theme = wp_get_theme();
  $version = $theme ? $theme->get( 'Version' ) : '1.0.0';
  if ( empty( $version ) ) {
    $version = '1.0.0';
  }
  return $version;
}
// End utils
