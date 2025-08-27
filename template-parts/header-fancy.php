<?php
/**
 * Fancy Header (transparent + sticky + mega-menu ready)
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

$has_woo = class_exists( 'WooCommerce' );
$phone   = get_theme_mod( 'es_header_phone', '(920) 555-1234' );
$cta_url = get_theme_mod( 'es_header_cta_url', '/contact/' );
$cta_txt = get_theme_mod( 'es_header_cta_txt', 'Get a Quote' );
$logo_id = get_theme_mod( 'custom_logo' );
$logo    = $logo_id ? wp_get_attachment_image( $logo_id, 'full', false, array('class'=>'kc-logo-img') ) : '';
?>
<header id="kc-header" class="kc-header kc-header--transparent" data-sticky="true">

  <!-- Top bar -->
  <div class="kc-topbar">
    <div class="kc-container">
      <div class="kc-topbar-left">
        <span class="kc-chip kc-chip--accent">Locally Owned</span>
        <span class="kc-chip">Green Bay • NE Wisconsin</span>
      </div>
      <div class="kc-topbar-right">
        <a class="kc-top-link" href="tel:<?php echo esc_attr( preg_replace('/\D+/','',$phone) ); ?>">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-phone"></use></svg>
          <span><?php echo esc_html( $phone ); ?></span>
        </a>
        <a class="kc-top-link" href="/showroom/">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-pin"></use></svg>
          <span>Visit Our Showroom</span>
        </a>
        <button class="kc-theme-toggle" aria-label="Toggle dark mode">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-moon"></use></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Main bar -->
  <div class="kc-mainbar">
    <div class="kc-container">

      <div class="kc-left">
        <a class="kc-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
          <?php
            if ( $logo ) {
              echo $logo;
            } else {
              echo '<span class="kc-logo-text">' . esc_html( get_bloginfo('name') ) . '</span>';
            }
          ?>
        </a>
      </div>

      <nav class="kc-nav" aria-label="Primary">
        <?php
          wp_nav_menu( array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'kc-menu',
            'depth'          => 3,
            'fallback_cb'    => '__return_empty_string',
          ) );
        ?>
      </nav>

      <div class="kc-right">
        <button class="kc-search-btn" aria-label="Open search">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-search"></use></svg>
        </button>

        <?php if ( $has_woo ) : ?>
          <a class="kc-cart" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="Cart">
            <svg aria-hidden="true" class="kc-ico"><use href="#ico-cart"></use></svg>
            <span class="kc-cart-count" data-count="<?php echo esc_attr( WC()->cart->get_cart_contents_count() ); ?>">
              <?php echo esc_html( WC()->cart->get_cart_contents_count() ); ?>
            </span>
          </a>
        <?php endif; ?>

        <a class="kc-cta" href="<?php echo esc_url( $cta_url ); ?>">
          <span><?php echo esc_html( $cta_txt ); ?></span>
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-arrow"></use></svg>
        </a>

        <button class="kc-burger" aria-label="Open menu" aria-expanded="false" aria-controls="kc-drawer">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>
  </div>

  <!-- Mobile drawer -->
  <div id="kc-drawer" class="kc-drawer" aria-hidden="true">
    <div class="kc-drawer__inner">
      <div class="kc-drawer__head">
        <a class="kc-brand" href="<?php echo esc_url( home_url('/') ); ?>">
          <?php
            if ( $logo ) {
              echo $logo;
            } else {
              echo '<span class="kc-logo-text">' . esc_html( get_bloginfo('name') ) . '</span>';
            }
          ?>
        </a>
        <button class="kc-drawer-close" aria-label="Close menu">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-close"></use></svg>
        </button>
      </div>

      <div class="kc-drawer__search">
        <?php get_search_form(); ?>
      </div>

      <nav class="kc-drawer__nav" aria-label="Mobile">
        <?php
          wp_nav_menu( array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'kc-menu-mobile',
            'depth'          => 2,
            'fallback_cb'    => '__return_empty_string',
          ) );
        ?>
      </nav>

      <div class="kc-drawer__cta">
        <a class="kc-cta kc-cta--block" href="<?php echo esc_url( $cta_url ); ?>">
          <span><?php echo esc_html( $cta_txt ); ?></span>
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-arrow"></use></svg>
        </a>
        <a class="kc-top-link kc-top-link--block" href="tel:<?php echo esc_attr( preg_replace('/\D+/','',$phone) ); ?>">
          <svg aria-hidden="true" class="kc-ico"><use href="#ico-phone"></use></svg>
          <span><?php echo esc_html( $phone ); ?></span>
        </a>
      </div>
    </div>
  </div>

  <!-- Search overlay -->
  <div class="kc-search" role="dialog" aria-modal="true" aria-hidden="true">
    <button class="kc-search-close" aria-label="Close search">
      <svg aria-hidden="true" class="kc-ico"><use href="#ico-close"></use></svg>
    </button>
    <div class="kc-search__inner">
      <?php get_search_form(); ?>
      <p class="kc-search-hint">Tip: Try “Quartz Group 3” or “Dekton”</p>
    </div>
  </div>

  <!-- SVG sprite -->
  <svg width="0" height="0" style="position:absolute;visibility:hidden" aria-hidden="true">
    <symbol id="ico-phone" viewBox="0 0 24 24"><path d="M6.6 10.8c1.5 2.9 3.8 5.1 6.7 6.7l2.2-2.2c.3-.3.8-.4 1.1-.2 1.2.4 2.6.7 4 .7.6 0 1 .4 1 1v3.6c0 .6-.4 1-1 1C11.1 21.4 2.6 12.9 2.6 2.4c0-.6.4-1 1-1H7c.6 0 1 .4 1 1 0 1.4.2 2.8.7 4 .1.4 0 .8-.3 1.1l-1.8 2.3z"/></symbol>
    <symbol id="ico-pin" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></symbol>
    <symbol id="ico-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></symbol>
    <symbol id="ico-search" viewBox="0 0 24 24"><path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm11 19-5.3-5.3"/></symbol>
    <symbol id="ico-cart" viewBox="0 0 24 24"><path d="M7 22a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3 3h2l2.6 12.2A2 2 0 0 0 9.6 17h8.9a2 2 0 0 0 2-1.6l1.3-7.4H6.2"/></symbol>
    <symbol id="ico-arrow" viewBox="0 0 24 24"><path d="M4 12h16M12 4l8 8-8 8"/></symbol>
    <symbol id="ico-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  </svg>
</header>
