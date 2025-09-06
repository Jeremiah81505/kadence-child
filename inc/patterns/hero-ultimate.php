<?php
// Neutralized duplicate hero-ultimate pattern file.
<?php
        $pattern_content = ob_get_clean();
        register_block_pattern(
                'kadence-child/hero-ultimate',
                [
                        'title'       => __( 'Hero – Ultimate (Motion)', 'kadence-child' ),
                        'description' => __( 'Full-bleed hero with layered parallax, animated headline, and dual CTAs.', 'kadence-child' ),
                        'categories'  => [ 'kadence-child', 'featured' ],
                        'content'     => $pattern_content,
                ]
        );
}
