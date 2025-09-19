<?php
/**
 * Title: Countertop Measurement Landing
 * Slug: kadence-child/countertop-measurement-landing
 * Categories: kadence-child, pages
 * Description: Full-page pattern guiding customers to measure and submit a countertop quote.
 */
?>
<!-- wp:group {"align":"wide","className":"kc-landing"} -->
<div class="wp-block-group alignwide kc-landing">
  <!-- wp:html -->
  <section class="kc-section kc-hero">
    <div class="kc-hero-inner">
      <h1>Countertop Quote — Fast & Accurate</h1>
      <p>Use the simple steps below to sketch your kitchen, take basic measurements, and submit for a same‑day estimate.</p>
      <div class="kc-hero-ctas">
        <a href="#designer" class="kc-btn is-primary">Start Your Layout</a>
        <a href="#guide" class="kc-btn">How to Measure</a>
      </div>
    </div>
  </section>

  <section id="guide" class="kc-section kc-steps">
    <h2>How to Measure Your Countertops</h2>
    <div class="kc-steps-grid">
      <article class="kc-step">
        <h3>1) Break Into Rectangles</h3>
        <p>Divide your countertop into simple rectangles or L‑shapes. Islands, peninsulas, and runs next to appliances are all just rectangles.</p>
      </article>
      <article class="kc-step">
        <h3>2) Measure Width & Depth</h3>
        <p>For each piece, measure width (left to right) and depth (front to back) to the nearest inch. Typical depths are ~25".</p>
      </article>
      <article class="kc-step">
        <h3>3) Note Cutouts</h3>
        <p>Record sink type and size, cooktop size, faucet holes (1,2,3), and backsplash height. Add any overhangs for seating.</p>
      </article>
      <article class="kc-step">
        <h3>4) Mark Seams (if any)</h3>
        <p>Large U‑shapes or long runs may need a seam. Use our seam preset or toggle seam visibility in the designer.</p>
      </article>
      <article class="kc-step">
        <h3>5) Take Photos (optional)</h3>
        <p>Snap a few photos of your current countertops and any walls/obstacles. You can attach them when you submit.</p>
      </article>
    </div>
  </section>

  <section id="designer" class="kc-section kc-designer">
    <h2>Your Layout</h2>
    <p class="kc-muted">Add rectangles or an L‑shape, then drag to position. Use Presets for a quick start. The area and edge length are calculated for you.</p>
  <!-- Reuse our Kitchen Designer pattern -->
  <!-- wp:pattern {"slug":"kadence-child/kitchen-layout-quote"} /-->
  </section>

  <section class="kc-section kc-measurements">
    <h2>Measurement Worksheet</h2>
    <p class="kc-muted">Use this quick checklist to capture the details our team needs:</p>
    <div class="kc-grid">
      <div class="kc-card">
        <h3>Section Details</h3>
        <ul>
          <li>For each section, width × depth in inches</li>
          <li>Corner radius (if any)</li>
          <li>Backsplash: include? Height?</li>
        </ul>
      </div>
      <div class="kc-card">
        <h3>Fixtures & Cutouts</h3>
        <ul>
          <li>Sink: type (undermount/top/farmhouse), cutout size, location or center</li>
          <li>Faucet: holes (0/1/2/3), diameter, spacing (for 3‑hole)</li>
          <li>Cooktop: size and position or center</li>
        </ul>
      </div>
      <div class="kc-card">
        <h3>Material & Edge</h3>
        <ul>
          <li>Material (Granite/Quartz/Marble/Quartzite/Laminate)</li>
          <li>Thickness and finish</li>
          <li>Edge profile and total linear feet</li>
        </ul>
      </div>
      <div class="kc-card">
        <h3>Seams & Overhangs</h3>
        <ul>
          <li>Any required seams or long runs</li>
          <li>Overhang dimensions for seating</li>
          <li>Backsplash linear feet and height</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="submit" class="kc-section kc-submit">
    <h2>Submit for a Fast Quote</h2>
    <p class="kc-muted">When you’re ready, copy your layout JSON to the form or let the hidden fields auto‑fill. Attach your PNG export and any photos.</p>
    <div class="kc-grid">
      <div class="kc-card">
        <h3>Included Data</h3>
        <ul>
          <li>Layout JSON (auto‑filled)</li>
          <li>Total Area (ft²) (auto‑filled)</li>
          <li>Backsplash Area (ft²) and Edge Length (lf)</li>
        </ul>
      </div>
      <div class="kc-card">
        <h3>Attach Files</h3>
        <p>Use the Export PNG in the designer to generate an image of your layout. Add any photos of your space.</p>
      </div>
    </div>
    <div class="kc-form-placeholder">
      <!-- Optional: Drop in Kadence Form / Contact Form 7 / WPForms shortcode here -->
      <!-- Example: [kadence_form id="your-form-id"] -->
    </div>
  </section>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
