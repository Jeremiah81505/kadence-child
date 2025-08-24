<?php
/**
 * Fallback template for Materials Grid pattern.
 *
 * Provides a translation-ready markup for the Materials Grid pattern.
 */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group">
<!-- wp:html -->
<div id="es-mats" data-replay="true" data-stagger="140">
  <div class="es-grid">

    <!-- QUARTZ (hero: col 1, rows 1–2) -->
    <a href="https://elevatedcountertopexperts.com/quartz/" class="es-card cell-quartz" data-dir="left">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg" alt="<?php echo esc_attr( __( 'Quartz countertop', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo esc_html( __( 'Quartz', 'kadence-child' ) ); ?></span>
      <span class="card-index">01</span>
    </a>

    <!-- NATURAL STONE -->
    <a href="https://elevatedcountertopexperts.com/natural-stone/" class="es-card cell-ns" data-dir="up">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg" alt="<?php echo esc_attr( __( 'Natural stone countertop', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo wp_kses_post( __( 'Natural&nbsp;Stone', 'kadence-child' ) ); ?></span>
      <span class="card-index">02</span>
    </a>

    <!-- SOLID SURFACE -->
    <a href="https://elevatedcountertopexperts.com/solid-surface/" class="es-card cell-solid" data-dir="down">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Solid-Surface-1.jpg" alt="<?php echo esc_attr( __( 'Solid surface countertop', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo wp_kses_post( __( 'Solid&nbsp;Surface', 'kadence-child' ) ); ?></span>
      <span class="card-index">03</span>
    </a>

    <!-- ULTRA COMPACT (wide middle) -->
    <a href="https://elevatedcountertopexperts.com/ultra-compact/" class="es-card cell-ultra" data-dir="right">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-Countertops.avif" alt="<?php echo esc_attr( __( 'Ultra compact surface', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo wp_kses_post( __( 'Ultra&nbsp;Compact', 'kadence-child' ) ); ?></span>
      <span class="card-index">04</span>
    </a>

    <!-- LAMINATE (bottom-left wide) -->
    <a href="https://elevatedcountertopexperts.com/laminate/" class="es-card cell-laminate" data-dir="up">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-7404-Neapolitan-Stone-3-scaled_4aaa1f1a-c749-4986-97ce-57f9ddcdcf1b_1080x.webp" alt="<?php echo esc_attr( __( 'Laminate countertop', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo esc_html( __( 'Laminate', 'kadence-child' ) ); ?></span>
      <span class="card-index">05</span>
    </a>

    <!-- SINKS (bottom-right) -->
    <a href="https://elevatedcountertopexperts.com/sinks/" class="es-card cell-sinks" data-dir="left">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="<?php echo esc_attr( __( 'Kitchen sinks', 'kadence-child' ) ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo esc_html( __( 'Sinks', 'kadence-child' ) ); ?></span>
      <span class="card-index">06</span>
    </a>

  </div>
</div>
<!-- /wp:html -->
</section>
<!-- /wp:group -->
