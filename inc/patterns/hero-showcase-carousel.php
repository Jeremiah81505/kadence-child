<?php
/**
 * Pattern: Hero — Showcase (with Carousel)
 */
if ( function_exists( 'register_block_pattern' ) ) {
        ob_start(); ?>
<!-- wp:group {"tagName":"section","className":"kc-hero-showcase","layout":{"type":"constrained","contentSize":"1900px"}} -->
<section class="wp-block-group kc-hero-showcase" aria-label="<?php esc_attr_e( 'Premium Countertops Hero', 'kadence-child' ); ?>">
    <div class="kc-hero-bg" style="--hero-bg:url('https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/hero-bg-countertop.jpg');"></div>
    <div class="kc-hero-scrim"></div>
    <!-- wp:group {"className":"kc-hero-wrap","layout":{"type":"constrained","contentSize":"1900px"}} -->
    <div class="wp-block-group kc-hero-wrap">
        <!-- wp:group {"className":"kc-hero-grid","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
        <div class="wp-block-group kc-hero-grid">
            <!-- wp:group {"className":"kc-hero-left","layout":{"type":"constrained"}} -->
            <div class="wp-block-group kc-hero-left">
                <p class="kc-eyebrow"><?php esc_html_e( 'Countertops for every space · Wisconsin', 'kadence-child' ); ?></p>
                <h1 class="kc-heading">
                    <?php esc_html_e( 'Premium Countertops', 'kadence-child' ); ?>
                    <span class="kc-break"><?php esc_html_e( 'without the Premium', 'kadence-child' ); ?></span>
                    <span class="kc-highlight"><?php esc_html_e( 'Headache.', 'kadence-child' ); ?></span>
                </h1>
                <p class="kc-sub"><?php esc_html_e( 'Shop quartz, natural stone, solid surface, laminate, and ultra-compact materials—installed by local pros. Precise fabrication, seamless installs, and free in-home measures.', 'kadence-child' ); ?></p>
                <nav class="kc-cta-row" aria-label="<?php esc_attr_e( 'Primary actions', 'kadence-child' ); ?>">
                    <a class="kc-btn kc-btn--primary" href="/free-quote"><?php esc_html_e( 'Schedule Your Free Quote', 'kadence-child' ); ?></a>
                    <a class="kc-btn kc-btn--ghost" href="/color-samples"><?php esc_html_e( 'Explore Countertop Colors', 'kadence-child' ); ?></a>
                </nav>
            </div>
            <!-- /wp:group -->
            <!-- wp:group {"className":"kc-hero-right","layout":{"type":"flex","orientation":"vertical"}} -->
            <div class="wp-block-group kc-hero-right" aria-label="<?php esc_attr_e( 'Browse categories', 'kadence-child' ); ?>">
                <a class="kc-card" href="/quartz"><span class="kc-card-title"><?php esc_html_e( 'Quartz', 'kadence-child' ); ?></span></a>
                <a class="kc-card" href="/natural-stone"><span class="kc-card-title"><?php esc_html_e( 'Natural Stone', 'kadence-child' ); ?></span></a>
                <a class="kc-card" href="/solid-surface"><span class="kc-card-title"><?php esc_html_e( 'Solid Surface', 'kadence-child' ); ?></span></a>
                <a class="kc-card" href="/ultra-compact"><span class="kc-card-title"><?php esc_html_e( 'Ultra Compact', 'kadence-child' ); ?></span></a>
                <a class="kc-card kc-card--wide" href="/laminate"><span class="kc-card-title"><?php esc_html_e( 'Laminate', 'kadence-child' ); ?></span></a>
                <a class="kc-card kc-card--wide" href="/sinks"><span class="kc-card-title"><?php esc_html_e( 'Sinks', 'kadence-child' ); ?></span></a>
            </div>
            <!-- /wp:group -->
        </div>
        <!-- /wp:group -->
        <!-- wp:group {"className":"kc-cta-bar","layout":{"type":"flex","justifyContent":"left"}} -->
        <div class="wp-block-group kc-cta-bar" role="region" aria-label="<?php esc_attr_e( 'Quick actions', 'kadence-child' ); ?>">
            <a class="kc-pill" href="/free-quote"><?php esc_html_e( 'Schedule Your Free Quote', 'kadence-child' ); ?></a>
            <a class="kc-pill kc-pill--ghost" href="/color-samples"><?php esc_html_e( 'Explore Countertop Colors', 'kadence-child' ); ?></a>
        </div>
        <!-- /wp:group -->
        <!-- wp:group {"className":"kc-ring-inline","layout":{"type":"constrained","contentSize":"1900px"}} -->
        <div class="wp-block-group kc-ring-inline">
            <div class="es-stage">
                <div class="es-ring" data-speed="32" data-tilt="10" data-size="120">
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
                    <div class="es-tile"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
                </div>
            </div>
            <div class="es-fallback is-hidden">
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Wilsonart-01.png" alt="Wilsonart" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vicostone-01.png" alt="Vicostone" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Viatera-01.png" alt="Viatera" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Vadara-Capture-the-world-in-quartz-01.png" alt="Vadara" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/UGM-Surfaces-01.png" alt="UGM Surfaces" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Trends-01.png" alt="Trends" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Teracanto-01.png" alt="Teracanto" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Silestone-01.png" alt="Silestone" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Q-Quartz-01.png" alt="Q Quartz" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Pionite-01.png" alt="Pionite" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Nevamar-01.png" alt="Nevamar" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Hi-Macs-01.png" alt="HI-MACS" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Formica-01.png" alt="Formica" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Dekton-01.png" alt="Dekton" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Corian-01.png" alt="Corian" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Cambria-01.png" alt="Cambria" /></div>
                <div class="es-card"><img src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/Caesarstone-01-scaled.png" alt="Caesarstone" /></div>
            </div>
        </div>
        <!-- /wp:group -->
    </div>
    <!-- /wp:group -->
<style>
/* Hero Showcase styles embedded for pattern preview */
</style>
</section>
<!-- /wp:group -->
<?php
        $pattern_content = ob_get_clean();
        register_block_pattern(
                'kadence-child/hero-showcase-carousel',
                [
                        'title'       => __( 'Hero — Showcase (with Carousel)', 'kadence-child' ),
                        'description' => __( 'Hero layout featuring a showcase grid, CTA bar, and built-in carousel.', 'kadence-child' ),
                        'categories'  => [ 'kadence-child', 'featured' ],
                        'content'     => $pattern_content,
                ]
        );
}
