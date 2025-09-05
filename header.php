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

<?php get_template_part( 'template-parts/header-fancy' ); ?>
<<<<<<< HEAD

<!-- wp:group {"align":"full","className":"kc-header"} -->
<header class="wp-block-group alignfull kc-header" role="banner">
  <div class="kc-header-inner">
    <a href="/" class="kc-header-logo">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/elevated-logo.svg" alt="Elevated Surfaces Logo" />
    </a>
    <nav class="kc-header-nav" aria-label="Main navigation">
      <a href="/quartz">Quartz</a>
      <a href="/natural-stone">Natural Stone</a>
      <a href="/solid-surface">Solid Surface</a>
      <a href="/ultra-compact">Ultra Compact</a>
      <a href="/laminate">Laminate</a>
      <a href="/sinks">Sinks</a>
    </nav>
    <a href="/free-quote" class="kc-header-cta">Get a Free Quote</a>
  </div>
</header>
<!-- /wp:group -->
=======
>>>>>>> kadence-child/main
