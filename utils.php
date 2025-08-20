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
  return wp_get_theme()->get('Version');
}
