<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

if ( ! function_exists( 'kc_es_mats_grid_markup' ) ) {
    function kc_es_mats_grid_markup() {
        $base = 'https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/';
        $cards = [
            [
                'slug'  => 'quartz',
                'url'   => 'https://elevatedcountertopexperts.com/quartz/',
                'img'   => $base . 'VIATERA-Residential-Taj-Crema-kitchen-Mid2-scaled.jpg',
                'alt'   => 'Quartz countertop',
                'title' => 'Quartz',
                'index' => '01',
                'dir'   => 'left',
            ],
            [
                'slug'  => 'ns',
                'url'   => 'https://elevatedcountertopexperts.com/natural-stone/',
                'img'   => $base . 'Vertical-Application-of-Natural-Stone-Kitchen-Lakewood-CO-1-1.jpeg',
                'alt'   => 'Natural stone countertop',
                'title' => 'Natural&nbsp;Stone',
                'index' => '02',
                'dir'   => 'up',
            ],
            [
                'slug'  => 'solid',
                'url'   => 'https://elevatedcountertopexperts.com/solid-surface/',
                'img'   => $base . 'Solid-Surface-1.jpg',
                'alt'   => 'Solid surface countertop',
                'title' => 'Solid&nbsp;Surface',
                'index' => '03',
                'dir'   => 'down',
            ],
            [
                'slug'  => 'ultra',
                'url'   => 'https://elevatedcountertopexperts.com/ultra-compact/',
                'img'   => $base . 'Dekton-Countertops.avif',
                'alt'   => 'Ultra compact surface',
                'title' => 'Ultra&nbsp;Compact',
                'index' => '04',
                'dir'   => 'right',
            ],
            [
                'slug'  => 'laminate',
                'url'   => 'https://elevatedcountertopexperts.com/laminate/',
                'img'   => $base . 'Formica-7404-Neapolitan-Stone-3-scaled_4aaa1f1a-c749-4986-97ce-57f9ddcdcf1b_1080x.webp',
                'alt'   => 'Laminate countertop',
                'title' => 'Laminate',
                'index' => '05',
                'dir'   => 'up',
            ],
            [
                'slug'  => 'sinks',
                'url'   => 'https://elevatedcountertopexperts.com/sinks/',
                'img'   => $base . 'Undermount-SInk-Karran.jpg',
                'alt'   => 'Kitchen sinks',
                'title' => 'Sinks',
                'index' => '06',
                'dir'   => 'left',
            ],
        ];

        ob_start();
        ?>
<!-- wp:group {"tagName":"section","layout":{"type":"constrained"}} -->
<section class="wp-block-group">
<!-- wp:html -->
<div id="es-mats" data-replay="true" data-stagger="140">
  <div class="es-grid">
    <?php foreach ( $cards as $c ) : ?>
    <a href="<?php echo esc_url( $c['url'] ); ?>" class="es-card cell-<?php echo esc_attr( $c['slug'] ); ?>" data-dir="<?php echo esc_attr( $c['dir'] ); ?>">
      <img src="<?php echo esc_url( $c['img'] ); ?>" alt="<?php echo esc_attr( $c['alt'] ); ?>">
      <span class="tint"></span>
      <span class="card-title"><?php echo $c['title']; ?></span>
      <span class="card-index"><?php echo $c['index']; ?></span>
    </a>
    <?php endforeach; ?>
  </div>
</div>
<!-- /wp:html -->
</section>
<!-- /wp:group -->
<?php
        return ob_get_clean();
    }
}
