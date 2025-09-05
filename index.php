<?php
/**
<<<<<<< HEAD
 * Main index template for Kadence Child Theme
 */
get_header();
?>

<main id="main-content" class="kc-main-content" role="main">
  <?php if ( have_posts() ) : ?>
    <div class="kc-post-list">
      <?php while ( have_posts() ) : the_post(); ?>
        <article <?php post_class('kc-post-item'); ?> id="post-<?php the_ID(); ?>">
          <header class="kc-post-header">
            <h2 class="kc-post-title">
              <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h2>
          </header>
          <div class="kc-post-excerpt">
            <?php the_excerpt(); ?>
          </div>
        </article>
      <?php endwhile; ?>
    </div>
    <?php the_posts_navigation(); ?>
  <?php else : ?>
    <div class="kc-no-posts">
      <h2>No posts found</h2>
      <p>Sorry, there are no posts to display.</p>
    </div>
  <?php endif; ?>
=======
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
>>>>>>> kadence-child/main
</main>

<?php get_footer();
