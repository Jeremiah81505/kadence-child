<?php
/**
<<<<<<< HEAD
 * Footer template for Kadence Child Theme
 */
?>

<!-- wp:group {"align":"full","className":"kc-footer"} -->
<footer class="wp-block-group alignfull kc-footer" role="contentinfo">
  <div class="kc-footer-inner">
    <div class="kc-footer-brand">
      <a href="/" class="kc-footer-logo">
        <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/elevated-logo.svg" alt="Elevated Surfaces Logo" />
      </a>
      <span class="kc-footer-title">Elevated Surfaces</span>
    </div>
    <nav class="kc-footer-nav" aria-label="Footer navigation">
      <a href="/quartz">Quartz</a>
      <a href="/natural-stone">Natural Stone</a>
      <a href="/solid-surface">Solid Surface</a>
      <a href="/ultra-compact">Ultra Compact</a>
      <a href="/laminate">Laminate</a>
      <a href="/sinks">Sinks</a>
      <a href="/contact">Contact</a>
    </nav>
    <div class="kc-footer-copy">
      &copy; <?php echo date('Y'); ?> Elevated Surfaces. All rights reserved.
    </div>
  </div>
</footer>
<!-- /wp:group -->
=======
 * Theme footer template.
 *
 * @package Kadence Child
 */
?>
<footer class="site-footer">
  <div class="site-info">
    <?php echo esc_html__( 'Theme version:', 'kadence-child' ); ?> <?php echo esc_html( kc_get_theme_version() ); ?>
  </div>
</footer>
>>>>>>> kadence-child/main

<?php wp_footer(); ?>
</body>
</html>
