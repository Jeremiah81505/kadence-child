<?php
/**
 * Main template file.
 *
 * @package Kadence Child
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

get_header(); ?>

<main id="primary" class="site-main">
    <?php if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            the_content();
        endwhile;
    else : ?>
        <p><?php esc_html_e( 'No posts found.', 'kadence-child' ); ?></p>
    <?php endif; ?>
</main>

<?php get_footer();
