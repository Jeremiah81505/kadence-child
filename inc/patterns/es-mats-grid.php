<?php
/**
 * Pattern: Materials Grid (6 Cards, Hero + Mix)
 *
 * Registers a block pattern for a 6-card materials grid.
 * If patterns/es-mats-grid.php exists, its output is used.
 * Otherwise, a safe inline HTML fallback is registered.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$include_path = get_theme_file_path( 'patterns/es-mats-grid.php' );

if ( file_exists( $include_path ) ) {
	ob_start();
	include $include_path;
	$pattern_content = ob_get_clean();
} else {
	$pattern_content = <<<HTML
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group">
<!-- wp:html -->
<div id="es-mats" data-replay="true" data-stagger="140">
  <div class="es-grid">

    <!-- QUARTZ (hero: col 1, rows 1–2) -->
    <a href="https://elevatedcountertopexperts.com/quartz/" class="es-card cell-quartz" data-dir="left">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg" alt="Quartz countertop">
      <span class="vtag">Quartz</span>
    </a>

    <!-- NATURAL STONE -->
    <a href="https://elevatedcountertopexperts.com/natural-stone/" class="es-card cell-ns" data-dir="up">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg" alt="Natural stone countertop">
      <span class="vtag">Natural&nbsp;Stone</span>
    </a>

    <!-- SOLID SURFACE -->
    <a href="https://elevatedcountertopexperts.com/solid-surface/" class="es-card cell-solid" data-dir="down">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Solid-Surface-1.jpg" alt="Solid surface countertop">
      <span class="vtag">Solid&nbsp;Surface</span>
    </a>

    <!-- ULTRA COMPACT (wide middle) -->
    <a href="https://elevatedcountertopexperts.com/ultra-compact/" class="es-card cell-ultra" data-dir="right">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-Countertops.avif" alt="Ultra compact surface">
      <span class="vtag vtag--right">Ultra&nbsp;Compact</span>
    </a>

    <!-- LAMINATE (bottom-left wide) -->
    <a href="https://elevatedcountertopexperts.com/laminate/" class="es-card cell-laminate" data-dir="up">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-7404-Neapolitan-Stone-3-scaled_4aaa1f1a-c749-4986-97ce-57f9ddcdcf1b_1080x.webp" alt="Laminate countertop">
      <span class="vtag">Laminate</span>
    </a>

    <!-- SINKS (bottom-right) -->
    <a href="https://elevatedcountertopexperts.com/sinks/" class="es-card cell-sinks" data-dir="left">
      <img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Undermount-SInk-Karran.jpg" alt="Kitchen sinks">
      <span class="vtag">Sinks</span>
    </a>

  </div>
</div>
<!-- /wp:html -->
</section>
<!-- /wp:group -->
HTML;
}

if ( function_exists( 'register_block_pattern' ) ) {
	register_block_pattern(
		'kadence-child/es-mats-grid',
		[
			'title'       => __( 'Materials Grid (6 Cards, Hero + Mix)', 'kadence-child' ),
			'description' => __( 'Six-card materials navigation grid with scroll-reveal animation and vertical tags.', 'kadence-child' ),
			'categories'  => [ 'kadence-child', 'elevated' ],
			'content'     => $pattern_content,
			'inserter'    => true,
		]
	);
}
