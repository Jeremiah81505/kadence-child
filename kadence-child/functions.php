<?php
function kadence_child_enqueue_styles() {
    wp_enqueue_style('kadence-parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('kadence-child-style', get_stylesheet_directory_uri() . '/assets/css/style.css', array('kadence-parent-style'));
}

function kadence_child_enqueue_scripts() {
    wp_enqueue_script('kadence-child-script', get_stylesheet_directory_uri() . '/assets/js/main.js', array('jquery'), null, true);
}

add_action('wp_enqueue_scripts', 'kadence_child_enqueue_styles');
add_action('wp_enqueue_scripts', 'kadence_child_enqueue_scripts');

function kadence_child_setup() {
    add_theme_support('custom-logo');
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
}

add_action('after_setup_theme', 'kadence_child_setup');
?>