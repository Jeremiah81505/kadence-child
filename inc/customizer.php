<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Register simple header options in the Customizer.
 */
add_action( 'customize_register', function( $wp_customize ) {
  $wp_customize->add_section( 'kc_header', array(
    'title'    => __( 'Header', 'kadence-child' ),
    'priority' => 30,
  ) );

  // Phone number
  $wp_customize->add_setting( 'es_header_phone', array(
    'default'           => '(920) 555-1234',
    'sanitize_callback' => 'sanitize_text_field',
  ) );
  $wp_customize->add_control( 'es_header_phone', array(
    'section' => 'kc_header',
    'label'   => __( 'Phone number', 'kadence-child' ),
    'type'    => 'text',
  ) );

  // CTA text
  $wp_customize->add_setting( 'es_header_cta_txt', array(
    'default'           => 'Get a Quote',
    'sanitize_callback' => 'sanitize_text_field',
  ) );
  $wp_customize->add_control( 'es_header_cta_txt', array(
    'section' => 'kc_header',
    'label'   => __( 'CTA text', 'kadence-child' ),
    'type'    => 'text',
  ) );

  // CTA URL
  $wp_customize->add_setting( 'es_header_cta_url', array(
    'default'           => '/contact/',
    'sanitize_callback' => 'esc_url_raw',
  ) );
  $wp_customize->add_control( 'es_header_cta_url', array(
    'section' => 'kc_header',
    'label'   => __( 'CTA URL', 'kadence-child' ),
    'type'    => 'url',
  ) );
} );
