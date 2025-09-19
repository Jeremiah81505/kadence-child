<?php
/**
 * Title: Kitchen Layout for Countertop Quote
 * Slug: kadence-child/kitchen-layout-quote
 * Categories: kadence-child, featured
 * Description: Interactive kitchen layout designer for quick countertop quote requests.
 */
?>
<!-- wp:group {"align":"wide","className":"kc-kitchen-designer is-contained"} -->
<div class="wp-block-group alignwide kc-kitchen-designer is-contained">
  <!-- wp:html -->
  <div>
    <div class="kc-kd-toolbar">
      <div class="kc-group">
        <button class="kc-btn is-primary" type="button" data-kc-add-rect>Add Rectangle</button>
        <button class="kc-btn" type="button" data-kc-add-l>Add L-Shape</button>
  <button class="kc-btn" type="button" data-kc-snap>Snap</button>
  <button class="kc-btn" type="button" data-kc-zoom-in>Zoom +</button>
  <button class="kc-btn" type="button" data-kc-zoom-out>Zoom -</button>
  <button class="kc-btn" type="button" data-kc-fit>Fit</button>
      </div>
      <div class="kc-group">
  <button class="kc-btn" type="button" data-kc-reset>Reset</button>
  <button class="kc-btn" type="button" data-kc-delete-all>Delete All</button>
      </div>
      <div class="kc-spacer"></div>
      <div class="kc-group">
        <button class="kc-btn" type="button" data-kc-export-json>Download JSON</button>
        <button class="kc-btn" type="button" data-kc-copy-json>Copy JSON</button>
        <button class="kc-btn" type="button" data-kc-export-png>Export PNG</button>
      </div>
    </div>
    <div class="kc-kd-wrap">
      <div class="kc-kd-stage" aria-label="Kitchen layout canvas"></div>
      <aside class="kc-kd-aside">
        <div class="kc-card kc-span-2 kc-sticky">
          <h3>Summary</h3>
          <dl>
            <dt>Sections</dt><dd><span data-kc-room-count>0</span></dd>
            <dt>Total Area</dt><dd><span data-kc-area>0.00</span> ft²</dd>
            <dt>Backsplash Area</dt><dd><span data-kc-bs-area>0.00</span> ft²</dd>
            <dt>Edge Length</dt><dd><span data-kc-perim>0.00</span> lf</dd>
          </dl>
          <div class="kc-row" style="margin-top:6px">
            <span class="kc-badge">Options</span>
          </div>
        </div>
  <div class="kc-card kc-span-2">
          <h3>Presets</h3>
          <div class="kc-row" style="gap:8px;margin-bottom:6px">
            <button class="kc-btn" type="button" data-kc-preset="island">Island</button>
            <button class="kc-btn" type="button" data-kc-preset="galley">Galley</button>
            <button class="kc-btn" type="button" data-kc-preset="ushape">U-Shape</button>
          </div>
        </div>
        <div class="kc-card">
          <h3>Selected Section</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Width (in)</span>
              <input type="number" step="1" min="1" data-kc-input-w>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Depth (in)</span>
              <input type="number" step="1" min="1" data-kc-input-h>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;grid-column:1/-1">
              <span style="opacity:.75;font-size:12px">Corner Radius (in)</span>
              <input type="number" step="1" min="0" value="0" data-kc-input-radius>
            </label>
          </div>
          <div style="margin-top:8px;display:flex;gap:8px">
            <button class="kc-btn" type="button" data-kc-delete>Delete Selected</button>
            <button class="kc-btn" type="button" data-kc-swap>Swap W/D</button>
          </div>
        </div>
        <div class="kc-card">
          <h3>Backsplash & Edges</h3>
          <div class="kc-row">
            <label class="kc-check"><input type="checkbox" data-kc-bs-on checked> Include Backsplash</label>
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Height (in)</span>
              <input type="number" min="0" step="1" value="4" data-kc-bs-height>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Edge Profile</span>
              <select data-kc-edge>
                <option value="eased">Eased</option>
                <option value="bevel">Bevel</option>
                <option value="bullnose">Bullnose</option>
                <option value="ogee">Ogee</option>
              </select>
            </label>
          </div>
        </div>
        <div class="kc-card">
          <h3>Materials & Finish</h3>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Material</span>
              <select data-kc-mat>
                <option value="granite" selected>Granite</option>
                <option value="quartz">Quartz</option>
                <option value="marble">Marble</option>
                <option value="quartzite">Quartzite</option>
                <option value="laminate">Laminate</option>
              </select>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Thickness (in)</span>
              <input type="number" min="0.5" step="0.25" value="1.25" data-kc-thickness>
            </label>
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Finish</span>
              <select data-kc-finish>
                <option value="polished" selected>Polished</option>
                <option value="honed">Honed</option>
                <option value="leathered">Leathered</option>
              </select>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Overhang (in)</span>
              <input type="number" min="0" step="0.25" value="1.5" data-kc-overhang>
            </label>
          </div>
        </div>
        <div class="kc-card">
          <h3>Cutouts</h3>
          <div class="kc-row" style="margin-bottom:6px">
            <span class="kc-badge">Cooktop</span>
            <label class="kc-check"><input type="checkbox" data-kc-ct-on> Include</label>
          </div>
          <div class="kc-row">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Width (in)</span>
              <input type="number" min="0" step="1" value="30" data-kc-ct-w>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Depth (in)</span>
              <input type="number" min="0" step="1" value="21" data-kc-ct-h>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Left (in)</span>
              <input type="number" min="0" step="1" value="24" data-kc-ct-x>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Front (in)</span>
              <input type="number" min="0" step="1" value="12" data-kc-ct-y>
            </label>
            <label class="kc-check"><input type="checkbox" data-kc-ct-centre> Center</label>
          </div>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:10px 0">
          <div class="kc-row" style="margin-bottom:6px">
            <span class="kc-badge">Faucet</span>
          </div>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Holes</span>
              <select data-kc-fh-count>
                <option value="0">0</option>
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </label>
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Diameter (in)</span>
              <input type="number" min="0.5" step="0.125" value="1.375" data-kc-fh-dia>
            </label>
            <label class="kc-check"><input type="checkbox" data-kc-fh-centre checked> Center above sink</label>
          </div>
          <div class="kc-row">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Left (in)</span>
              <input type="number" min="0" step="1" value="24" data-kc-fh-x>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Back (in)</span>
              <input type="number" min="0" step="0.5" value="2" data-kc-fh-from-back>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">3-hole spacing (in)</span>
              <input type="number" min="3" step="0.5" value="8" data-kc-fh-spacing>
            </label>
          </div>
        </div>
        <div class="kc-card">
          <h3>90° Counter w/ Seam</h3>
          <div class="kc-row" style="gap:10px">
            <button class="kc-btn" type="button" data-kc-add-seam>Add 90° Layout</button>
            <label class="kc-check"><input type="checkbox" data-kc-show-seam checked> Show Seam</label>
          </div>
        </div>
        <div class="kc-card">
          <h3>Sink Details</h3>
          <div class="kc-row">
            <label style="display:flex;align-items:center;gap:8px">
              <span style="opacity:.75;font-size:12px">Type</span>
              <select data-kc-sink-type>
                <option value="none">None</option>
                <option value="undermount" selected>Undermount</option>
                <option value="topmount">Top-mount</option>
                <option value="farmhouse">Farmhouse</option>
              </select>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Cutout Width (in)</span>
              <input type="number" step="1" min="0" value="30" data-kc-sink-w>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">Cutout Depth (in)</span>
              <input type="number" step="1" min="0" value="20" data-kc-sink-h>
            </label>
          </div>
          <div class="kc-row">
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Left Edge (in)</span>
              <input type="number" step="1" min="0" value="12" data-kc-sink-x>
            </label>
            <label style="display:flex;flex-direction:column;gap:6px">
              <span style="opacity:.75;font-size:12px">From Front Edge (in)</span>
              <input type="number" step="1" min="0" value="12" data-kc-sink-y>
            </label>
          </div>
          <div class="kc-row">
            <label class="kc-check"><input type="checkbox" data-kc-sink-centre> Center on Section</label>
          </div>
        </div>
        <div class="kc-card">
          <h3>Quote Form Sync</h3>
          <p style="margin:.3em 0 .8em;opacity:.8">These hidden fields auto-fill a contact form on submit.</p>
          <input type="hidden" name="kc_layout_json" data-kc-bind="layout-json">
          <input type="hidden" name="kc_area_ft2" data-kc-bind="area-ft2">
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="kc-btn" type="button" data-kc-copy-form>Copy to Form</button>
            <button class="kc-btn" type="button" data-kc-copy-json>Copy JSON</button>
          </div>
        </div>
        <div class="kc-card">
          <h3>Tips</h3>
          <ul style="margin:.2em 0 .2em .95em;opacity:.9">
            <li>Hold Ctrl and scroll to zoom.</li>
            <li>Drag background to pan; drag shapes to move.</li>
            <li>Each grid square equals 1 inch.</li>
            <li>Use Export PNG to attach an image to your request.</li>
          </ul>
        </div>
      </aside>
    </div>
    <div class="kc-kd-footer">
      <div class="kc-info">Estimate only. Final quote requires on-site measurement.</div>
    </div>
  </div>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
