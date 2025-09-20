<?php
/**
 * Title: Countertop Configurator
 * Slug: kadence-child/countertop-configurator
 * Categories: kadence-child, featured
 * Description: Interactive countertop configurator with shapes, per-side backsplash, and summary.
 */
?>
<!-- wp:group {"align":"wide","className":"kc-ct-configurator is-contained"} -->
<div class="wp-block-group alignwide kc-ct-configurator is-contained">
  <!-- wp:html -->
  <div>
  <div class="kc-ct-tabs" data-ct-tabs role="tablist" aria-label="Shapes"></div>

    <div class="kc-ct-actions" data-ct-actions>
      <div class="kc-ct-actions-left">
        <label class="kc-toggle"><input type="checkbox" data-ct-snap checked /> <span>Snap to grid</span></label>
      </div>
      <div class="kc-ct-actions-right">
        <button class="kc-btn" type="button" data-ct-export title="Download JSON">Export</button>
        <button class="kc-btn" type="button" data-ct-import title="Import JSON">Import</button>
        <input type="file" accept="application/json" data-ct-import-input class="kc-visually-hidden" aria-hidden="true" />
      </div>
    </div>

    <div class="kc-ct-grid">
      <aside class="kc-ct-left">
        <div class="kc-side">
          <div class="kc-side-col">
            <button class="kc-tile is-active" type="button" data-ct-tool-mode="move"><span>Move</span></button>
            <button class="kc-tile" type="button" data-ct-tool-mode="resize"><span>Resize</span></button>
            <button class="kc-tile" type="button" data-ct-panel="shapes"><span>Shapes</span></button>
            <button class="kc-tile" type="button" data-ct-panel="backsplash"><span>Backsplash</span></button>
            <button class="kc-tile" type="button" data-ct-panel="sinks"><span>Sinks</span></button>
            <button class="kc-tile" type="button" data-ct-panel="seams"><span>Seams</span></button>
          </div>
          <div class="kc-panels">
            <div class="kc-panel kc-panel-shapes" hidden>
              <div class="kc-panel-grid">
                <button class="kc-tile" type="button" data-ct-shape="rect" data-ct-len-a="60" data-ct-len-b="25">Rectangle</button>
                <button class="kc-tile" type="button" data-ct-shape="l" data-ct-len-a="120" data-ct-len-b="96" data-ct-len-c="26" data-ct-len-d="26">L Shape</button>
                <button class="kc-tile" type="button" data-ct-shape="u" data-ct-len-a="160" data-ct-len-b="100" data-ct-len-c="60" data-ct-len-d="25">U Shape</button>
                <button class="kc-tile" type="button" data-ct-shape="rect" data-ct-len-a="72" data-ct-len-b="36">Island 36×72</button>
                <button class="kc-tile" type="button" data-ct-shape="rect" data-ct-len-a="96" data-ct-len-b="26">Bar Top 26×96</button>
                <button class="kc-tile" type="button" data-ct-shape="rect" data-ct-len-a="120" data-ct-len-b="25">Galley 25×120</button>
              </div>
              <section class="kc-section">
                <h3>Measurements</h3>
                <div class="kc-meas">
                  <div class="row">
                    <label><span>Width (A)</span><input type="number" min="0" step="1" data-ct-len="A" /></label>
                  </div>
                  <div class="row">
                    <label><span>Depth (B)</span><input type="number" min="0" step="1" data-ct-len="B" /></label>
                  </div>
                  <div class="row" data-row-c>
                    <label><span>Opening Width (C)</span><input type="number" min="0" step="1" data-ct-len="C" /></label>
                  </div>
                  <div class="row" data-row-d>
                    <label><span>Opening Depth (D)</span><input type="number" min="0" step="1" data-ct-len="D" /></label>
                  </div>
                </div>
              </section>
            </div>

            <div class="kc-panel kc-panel-backsplash" hidden>
              <section class="kc-section">
                <h3>Backsplash</h3>
                <div class="kc-option-grid">
                  <label class="kc-meas opt"><input type="checkbox" data-ct-backsplash="A" /> Top (A)</label>
                  <label class="kc-meas opt"><input type="checkbox" data-ct-backsplash="B" /> Left (B)</label>
                  <label class="kc-meas opt"><input type="checkbox" data-ct-backsplash="C" /> Bottom (C)</label>
                  <label class="kc-meas opt"><input type="checkbox" data-ct-backsplash="D" /> Right (D)</label>
                </div>
                <div class="kc-fieldset">
                  <div class="kc-field-label">Backsplash Height (inches)</div>
                  <input type="number" class="kc-input" min="0" max="24" step="1" data-ct-bs-height />
                </div>
              </section>
            </div>

            <div class="kc-panel kc-panel-sinks" hidden>
              <section class="kc-section">
                <h3>Sinks</h3>
                <div class="kc-option-grid" role="radiogroup" aria-label="Sinks">
                  <button class="kc-opt is-active" type="button" data-ct-radio="sinks" data-value="No">No</button>
                  <button class="kc-opt" type="button" data-ct-radio="sinks" data-value="Yes">Yes</button>
                </div>
              </section>
            </div>

            <div class="kc-panel kc-panel-seams" hidden>
              <section class="kc-section">
                <h3>Seams</h3>
                <div class="kc-option-grid">
                  <button class="kc-btn" type="button" data-ct-seam-suggest>Suggest Seams</button>
                  <button class="kc-btn" type="button" data-ct-seam-clear>Clear Seams</button>
                  <label class="kc-toggle"><input type="checkbox" data-ct-seam-show /> <span>Show Seams</span></label>
                </div>
              </section>
            </div>
            
          </div>
        </div>
      </aside>

      <section class="kc-ct-right">
        <div class="kc-ct-preview" data-ct-preview>
          <div class="kc-ct-toolbar" aria-label="Tools" role="toolbar">
            <button type="button" class="kc-tool is-active" data-ct-tool="move" title="Move">Move</button>
            <button type="button" class="kc-tool" data-ct-tool="resize" title="Resize">Resize</button>
            <button type="button" class="kc-tool" data-ct-tool="shapes" title="Shapes">Shapes</button>
            <button type="button" class="kc-tool" data-ct-rotate-left title="Rotate Left">⟲</button>
            <button type="button" class="kc-tool" data-ct-rotate-right title="Rotate Right">⟳</button>
            <button type="button" class="kc-tool" data-ct-duplicate title="Duplicate">Duplicate</button>
            <button type="button" class="kc-tool danger" data-ct-delete title="Delete">Delete</button>
            <div class="kc-tool-split"></div>
            <button type="button" class="kc-tool" data-ct-zoom-in title="Zoom In">＋</button>
            <button type="button" class="kc-tool" data-ct-zoom-out title="Zoom Out">－</button>
          </div>
          <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" data-ct-svg>
            <!-- Drawing injected by JS -->
          </svg>
          <div class="kc-ct-shape-label" data-ct-shape-label>No shape selected</div>
          <div class="kc-ct-legend" aria-hidden="true">
            <span class="lg lg-wall"></span> Wall side
            <span class="lg lg-bs"></span> Backsplash
          </div>
        </div>
      </section>
    </div>

  <div class="kc-ct-options" data-ct-options>
      <section class="kc-section">
        <h3>Material Quote Request options</h3>
        <div class="kc-option-grid" role="group" aria-label="Material Quote Request options">
          <button class="kc-opt is-active" type="button" data-ct-multi="material" data-value="Laminate" aria-pressed="true">Laminate</button>
          <button class="kc-opt" type="button" data-ct-multi="material" data-value="Solid Surface" aria-pressed="false">Solid Surface</button>
          <button class="kc-opt" type="button" data-ct-multi="material" data-value="Quartz" aria-pressed="false">Quartz</button>
          <button class="kc-opt" type="button" data-ct-multi="material" data-value="Granite" aria-pressed="false">Granite</button>
        </div>
      </section>

      <section class="kc-section">
        <h3>Edges & Corners <span class="sub">Edge Style</span></h3>
        <div class="kc-option-grid kc-edge-grid" role="group" aria-label="Edge Style">
          <button class="kc-opt is-active" type="button" data-ct-opt="edge" data-value="Bevel">Bevel</button>
          <button class="kc-opt" type="button" data-ct-opt="edge" data-value="Bullnose">Bullnose</button>
          <button class="kc-opt" type="button" data-ct-opt="edge" data-value="Double Radius">Double Radius</button>
          <button class="kc-opt" type="button" data-ct-opt="edge" data-value="Basic">Basic</button>
          <button class="kc-opt" type="button" data-ct-opt="edge" data-value="Half Bullnose">Half Bullnose</button>
          <button class="kc-opt" type="button" data-ct-opt="edge" data-value="Ogee">Ogee</button>
        </div>
      </section>

      <section class="kc-section">
        <h3>Color Preference</h3>
        <div>
          <input type="text" class="kc-input" placeholder="e.g. light gray with subtle veining" data-ct-color />
        </div>
      </section>

      <section class="kc-section">
        <h3>Corner Roundness <a href="#" class="kc-help">Go details</a></h3>
        <div class="kc-option-grid kc-round-grid">
          <div class="kc-round">
            <div class="kc-round-title">Radius up to 3/8"</div>
            <div class="kc-counter" data-ct-counter="corner-small"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
          <div class="kc-round">
            <div class="kc-round-title">Radius between 3/8" and 3/4"</div>
            <div class="kc-counter" data-ct-counter="corner-medium"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
          <div class="kc-round">
            <div class="kc-round-title">Radius between 3/4" and 1-1/2"</div>
            <div class="kc-counter" data-ct-counter="corner-large"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
        </div>
      </section>


      <section class="kc-section">
        <h3>Cutouts</h3>
        <div class="kc-option-grid kc-cutouts">
          <div class="kc-cut">
            <div class="kc-cut-title">Cooktop Cutout</div>
            <div class="kc-counter" data-ct-counter="cutout-cooktop"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
          <div class="kc-cut">
            <div class="kc-cut-title">Faucet Cutout (1 included)</div>
            <div class="kc-counter" data-ct-counter="cutout-faucet"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
          <div class="kc-cut">
            <div class="kc-cut-title">Other Cutout</div>
            <div class="kc-counter" data-ct-counter="cutout-other"><button type="button" class="kc-ctr-dec" aria-label="Decrease">-</button><span class="kc-ctr-val" aria-live="polite">0</span><button type="button" class="kc-ctr-inc" aria-label="Increase">+</button></div>
          </div>
        </div>
      </section>

      <section class="kc-section">
        <h3>Removal Options</h3>
        <div class="kc-option-grid" role="radiogroup" aria-label="Removal Options">
          <button class="kc-opt is-active" type="button" data-ct-radio="removal" data-value="Countertops Only">Countertops Only</button>
          <button class="kc-opt" type="button" data-ct-radio="removal" data-value="Countertops + Backsplash">Countertops + Backsplash</button>
        </div>
      </section>
      
    <section class="kc-section kc-summary">
        <h3>Summary</h3>
        <div class="kc-summary-grid">
          <div><strong>Pieces</strong><div data-ct-sum-pieces>1</div></div>
          <div><strong>Area (sq ft)</strong><div data-ct-sum-area>10.4</div></div>
      <div><strong>Material</strong><div data-ct-sum-material>Laminate</div></div>
          <div><strong>Edge</strong><div data-ct-sum-edge>Bevel</div></div>
          <div><strong>Sinks</strong><div data-ct-sum-sinks>No</div></div>
      <div><strong>Color Preference</strong><div data-ct-sum-color>-</div></div>
          <div><strong>Cutouts (Cooktop)</strong><div data-ct-sum-cut-cooktop>0</div></div>
          <div><strong>Cutouts (Faucet)</strong><div data-ct-sum-cut-faucet>0</div></div>
          <div><strong>Cutouts (Other)</strong><div data-ct-sum-cut-other>0</div></div>
          <div><strong>Removal</strong><div data-ct-sum-removal>Countertops Only</div></div>
          <div><strong>Seams</strong><div data-ct-sum-seams>0</div></div>
        </div>
      </section>
    </div>

    <div class="kc-ct-alert" data-ct-alert hidden>
      <div class="ico">i</div>
      <div>
        This design contains an oversized piece. An oversized piece charge has been added to the total price. For more information, including details on how to avoid this charge by using seams <a href="#" target="_blank" rel="noreferrer noopener">Click Here</a>.
      </div>
    </div>
  <textarea class="kc-visually-hidden" data-ct-state name="countertop_config" aria-hidden="true"></textarea>
  </div>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
