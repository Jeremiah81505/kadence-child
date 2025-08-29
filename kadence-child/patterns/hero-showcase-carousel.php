<?php
/**
 * Title: Hero Showcase Carousel (Premium)
 * Slug: kadence-child/hero-showcase-carousel
 * Description: Premium hero section with animated headline, category cards, CTA bar, and integrated 3D logo carousel.
 * Categories: kadence-child, featured
 */

<!-- wp:html -->
<section class="kc-hero-showcase" aria-label="Premium Countertops Hero">
  <div class="kc-hero-bg" style="--hero-bg:url(\'BACKGROUND_IMAGE_URL\');"></div>
  <div class="kc-hero-scrim"></div>
  <div class="kc-hero-wrap">
    <div class="kc-hero-grid">
      <header class="kc-hero-left">
        <p class="kc-eyebrow">Countertops for every space · <span class="nowrap">Wisconsin</span></p>
        <h1 class="kc-heading" style="animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.2s both; text-shadow: 0 6px 32px rgba(0,0,0,.22);">
          Premium Countertops
          <span class="kc-break">without the Premium</span>
          <span class="kc-highlight">Headache.</span>
        </h1>
        <p class="kc-sub" style="animation: kcFadeUp 1.1s cubic-bezier(.22,.67,.38,1) 0.5s both; text-shadow: 0 2px 12px rgba(0,0,0,.18);">
          Shop quartz, natural stone, solid surface, laminate, and ultra-compact materials—installed by local pros.
          Precise fabrication, seamless installs, and free in-home measures.
        </p>
        <nav class="kc-cta-row" aria-label="Primary actions">
          <a class="kc-btn kc-btn--primary" href="/free-quote">Schedule Your Free Quote</a>
          <a class="kc-btn kc-btn--ghost" href="/color-samples">Explore Countertop Colors</a>
        </nav>
      </header>
      <aside class="kc-hero-right" aria-label="Browse categories">
        <a class="kc-card" href="/quartz"><span class="kc-card-title">Quartz</span></a>
        <a class="kc-card" href="/natural-stone"><span class="kc-card-title">Natural Stone</span></a>
        <a class="kc-card" href="/solid-surface"><span class="kc-card-title">Solid Surface</span></a>
        <a class="kc-card" href="/ultra-compact"><span class="kc-card-title">Ultra Compact</span></a>
        <a class="kc-card kc-card--wide" href="/laminate"><span class="kc-card-title">Laminate</span></a>
        <a class="kc-card kc-card--wide" href="/sinks"><span class="kc-card-title">Sinks</span></a>
      </aside>
    </div>
    <div class="kc-cta-bar" role="region" aria-label="Quick actions">
      <a class="kc-pill" href="/free-quote">Schedule Your Free Quote</a>
      <a class="kc-pill kc-pill--ghost" href="/color-samples">Explore Countertop Colors</a>
    </div>
    <!-- wp:pattern {"slug":"kadence-child/carousel-3d-ring"} /-->
  </div>
  <style>
    @keyframes kcFadeUp { from { opacity:0; transform:translateY(36px);} to { opacity:1; transform:none;} }
    .kc-heading, .kc-sub { will-change: opacity, transform; }
    .kc-card { position: relative; display: block; background: linear-gradient(135deg, #1b2433, #3e3052); color: #fff; border-radius: 14px; padding: 1.2rem 1rem; box-shadow: 0 6px 18px rgba(0,0,0,.18); text-decoration: none; font-weight: 700; transition: transform .25s, box-shadow .25s, background .25s; cursor: pointer; outline: none; margin-bottom: 12px; }
    .kc-card:focus, .kc-card:hover { background: linear-gradient(135deg, #7a5cff, #563acc); transform: scale(1.07); box-shadow: 0 12px 32px rgba(111,125,255,.22); z-index: 2; }
    .kc-card-title { font-size: 1.08rem; margin-bottom: 0.2rem; }
    .kc-card--wide { grid-column: 1 / -1; }
    .kc-pill { display: inline-block; background: #7a5cff; color: #fff; border-radius: 999px; padding: 0.7em 1.6em; font-weight: 700; margin-right: 8px; text-decoration: none; transition: background .2s, transform .2s; }
    .kc-pill--ghost { background: #1b2433; border: 1px solid #7a5cff; color: #7a5cff; }
    .kc-pill:focus, .kc-pill:hover { background: #563acc; color: #fff; transform: scale(1.06); }
    @media (max-width: 600px) { .kc-card { padding: 0.7rem 0.5rem; } .kc-card-title { font-size: 0.95rem; } }
  </style>
</section>
<!-- /wp:html -->
'
        )
    );
}
