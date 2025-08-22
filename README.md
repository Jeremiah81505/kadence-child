# Kadence Child Theme

A minimal child theme for the [Kadence](https://www.kadencewp.com/kadence-theme/) parent theme. It adds a few bespoke block patterns and light CSS/JS enhancements, including a draggable 3D logo carousel.

## Setup

1. Install and activate the Kadence parent theme.
2. Copy or clone this `kadence-child` folder into your WordPress `wp-content/themes` directory.
3. Activate **Kadence Child** under **Appearance → Themes**.
4. In the block editor, look for patterns under the **Kadence Child** category.

## Build

No build step is required. CSS and JavaScript are loaded directly from `style.css` and `assets/child.js` and are cache‑busted automatically. If you want to bundle or minify assets, output to those files and refresh your site.

## Custom Blocks & Patterns

The theme registers a `Kadence Child` pattern category and provides:

- **3D Logo Carousel – Ring** (`patterns/carousel-3d-ring.php`)
  - Rotating ring of logo tiles.
  - `<div class="es-ring">` accepts the following data attributes:
    - `data-speed` – seconds per revolution (default `28`).
    - `data-radius` – ring radius in pixels (auto if omitted).
    - `data-tilt` – tilt angle in degrees (default `8`).
- **Hero Intro** (`patterns/hero-intro.php`): simple headline and paragraph section.
- **Hero – Ultimate (Motion)** (`patterns/hero-ultimate.php`): full‑bleed hero with parallax elements and dual CTAs.

## Development Workflow

- Edit PHP pattern files, `style.css`, and `assets/child.js` directly.
- Run `php -l` on modified PHP files to catch syntax errors.
- Use a local WordPress environment to preview patterns and the carousel.

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and verify PHP syntax with `php -l`.
3. Commit with clear messages and open a pull request describing the update.

