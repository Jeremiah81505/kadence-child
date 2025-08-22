<?php
/**
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

<?php wp_footer(); ?>
</body>
</html>
