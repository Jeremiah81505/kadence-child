<?php
/**
 * Child Theme Header Loader
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="kc-skip-link" href="#primary"><?php esc_html_e( 'Skip to content', 'kadence-child' ); ?></a>

<?php
// Use the Kadence parent theme header (header builder) instead of custom child header.
// If you later want the fancy header only on the front page you can do:
// if ( is_front_page() ) { get_template_part('template-parts/header-fancy'); } else { get_template_part('template-parts/header'); }
// For now we always load the parent header template part.
get_template_part( 'template-parts/header' );
?>
