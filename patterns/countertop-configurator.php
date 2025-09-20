<?php
/**
 * Title: Countertop Configurator (HD-style)
 * Slug: kadence-child/countertop-configurator
 * Categories: kadence-child, featured
 * Description: Simple countertop configurator patterned after Home Depot's tool.
 */
?>
<!-- wp:group {"align":"wide","className":"kc-ct-configurator is-contained"} -->
<div class="wp-block-group alignwide kc-ct-configurator is-contained">
  <!-- wp:html -->
  <div>
    <div class="kc-ct-tabs" data-ct-tabs>
      <button class="kc-ct-tab is-active" type="button" data-ct-tab="shape-1">Shape 1</button>
      <button class="kc-ct-tab add" type="button" data-ct-add-shape>Add A Shape</button>
    </div>

    <div class="kc-ct-actions" data-ct-actions>
      <div class="kc-ct-actions-left">
        <button class="kc-btn" type="button" data-ct-rotate-left>Rotate Left</button>
        <button class="kc-btn" type="button" data-ct-rotate-right>Rotate Right</button>
      </div>
      <div class="kc-ct-actions-right">
        <button class="kc-btn" type="button" data-ct-reset disabled>Reset</button>
        <button class="kc-btn" type="button" data-ct-delete disabled>Delete</button>
      </div>
    </div>

    <div class="kc-ct-grid">
      <aside class="kc-ct-left">
        <section class="kc-card">
          <h3>Select a Shape</h3>
          <div class="kc-ct-shapes">
            <button class="kc-shape is-active" type="button" data-ct-shape="rect">
              <span class="ico rect"></span>
              <span>Rectangle</span>
            </button>
            <button class="kc-shape" type="button" data-ct-shape="l">
              <span class="ico l"></span>
              <span>L Shape</span>
            </button>
            <button class="kc-shape" type="button" data-ct-shape="u">
              <span class="ico u"></span>
              <span>U Shape</span>
            </button>
          </div>
        </section>

        <section class="kc-card">
          <h3>Enter Measurements</h3>
          <div class="kc-meas" data-ct-meas>
            <div class="row" data-side="A">
              <label>
                <span>A Length (in.)</span>
                <input type="number" min="1" step="1" value="60" data-ct-len="A" />
              </label>
              <label class="opt"><input type="checkbox" data-ct-wall="A" /> Side against wall</label>
              <label class="opt"><input type="checkbox" data-ct-backsplash="A" /> Add same-material backsplash</label>
            </div>
            <div class="row" data-side="B">
              <label>
                <span>B Length (in.)</span>
                <input type="number" min="1" step="1" value="25" data-ct-len="B" />
              </label>
              <label class="opt"><input type="checkbox" data-ct-wall="B" /> Side against wall</label>
              <label class="opt"><input type="checkbox" data-ct-backsplash="B" /> Add same-material backsplash</label>
            </div>
            <div class="row disabled" data-side="C">
              <div class="note">C <em>No length needed.</em></div>
              <label class="opt"><input type="checkbox" data-ct-wall="C" /> Side against wall</label>
              <label class="opt"><input type="checkbox" data-ct-backsplash="C" /> Add same-material backsplash</label>
            </div>
            <div class="row disabled" data-side="D">
              <div class="note">D <em>No length needed.</em></div>
              <label class="opt"><input type="checkbox" data-ct-wall="D" /> Side against wall</label>
              <label class="opt"><input type="checkbox" data-ct-backsplash="D" /> Add same-material backsplash</label>
            </div>
          </div>
        </section>
      </aside>

      <section class="kc-ct-right">
        <div class="kc-ct-preview" data-ct-preview>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet" data-ct-svg>
            <!-- Drawing injected by JS -->
          </svg>
          <div class="kc-ct-shape-label" data-ct-shape-label>Shape 1</div>
        </div>
      </section>
    </div>

    <div class="kc-ct-options" data-ct-options>
      <section class="kc-section">
        <h3>Surface Thickness <a href="#" class="kc-help">Go details</a></h3>
        <div class="kc-option-grid" role="group" aria-label="Surface Thickness">
          <button class="kc-opt is-active" type="button" data-ct-opt="thickness" data-value="3cm">3 cm</button>
          <button class="kc-opt" type="button" data-ct-opt="thickness" data-value="2cm">2 cm</button>
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
        <h3>Sinks</h3>
        <div class="kc-option-grid" role="radiogroup" aria-label="Sinks">
          <button class="kc-opt is-active" type="button" data-ct-radio="sinks" data-value="No">No</button>
          <button class="kc-opt" type="button" data-ct-radio="sinks" data-value="Yes">Yes</button>
        </div>
      </section>

      <section class="kc-section">
        <h3>Plumbing Services</h3>
        <div class="kc-fieldset">
          <div class="kc-field-label">Who will disconnect existing plumbing fixtures?</div>
          <div class="kc-option-grid" role="radiogroup" aria-label="Disconnect Plumbing">
            <button class="kc-opt is-active" type="button" data-ct-radio="plumb-disconnect" data-value="Customer">DIY (By Customer)</button>
            <button class="kc-opt" type="button" data-ct-radio="plumb-disconnect" data-value="Pro">By Pro (Added Service)</button>
          </div>
        </div>
        <div class="kc-fieldset">
          <div class="kc-field-label">Who will connect new plumbing fixtures at your existing pipes?</div>
          <div class="kc-option-grid" role="radiogroup" aria-label="Connect Plumbing">
            <button class="kc-opt is-active" type="button" data-ct-radio="plumb-connect" data-value="Customer">DIY (By Customer)</button>
            <button class="kc-opt" type="button" data-ct-radio="plumb-connect" data-value="Pro">By Pro (Added Service)</button>
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
          <div><strong>Thickness</strong><div data-ct-sum-thickness>3 cm</div></div>
          <div><strong>Edge</strong><div data-ct-sum-edge>Bevel</div></div>
          <div><strong>Sinks</strong><div data-ct-sum-sinks>No</div></div>
          <div><strong>Plumbing (Disconnect)</strong><div data-ct-sum-plumb-disconnect>Customer</div></div>
          <div><strong>Plumbing (Connect)</strong><div data-ct-sum-plumb-connect>Customer</div></div>
          <div><strong>Cutouts (Cooktop)</strong><div data-ct-sum-cut-cooktop>0</div></div>
          <div><strong>Cutouts (Faucet)</strong><div data-ct-sum-cut-faucet>0</div></div>
          <div><strong>Cutouts (Other)</strong><div data-ct-sum-cut-other>0</div></div>
          <div><strong>Removal</strong><div data-ct-sum-removal>Countertops Only</div></div>
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
