<?php
/**
 * Title: Kitchen Layout for Countertop Quote
 * Slug: kadence-child/kitchen-layout-quote
 * Categories: kadence-child, featured
 * Description: Interactive kitchen layout designer for quick countertop quote requests.
 */
?>
<!-- wp:group {"align":"full","className":"kc-kitchen-designer"} -->
<div class="wp-block-group alignfull kc-kitchen-designer">
  <div class="kc-kd-toolbar">
    <div class="kc-group">
      <button class="kc-btn is-primary" type="button" data-kc-add-rect>Add Rectangle</button>
      <button class="kc-btn" type="button" data-kc-add-l>Add L-Shape</button>
      <button class="kc-btn" type="button" data-kc-snap>Snap</button>
    </div>
    <div class="kc-group">
      <button class="kc-btn" type="button" data-kc-reset>Reset</button>
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
      <div class="kc-card">
        <h3>Summary</h3>
        <dl>
          <dt>Sections</dt><dd><span data-kc-room-count>0</span></dd>
          <dt>Total Area</dt><dd><span data-kc-area>0.00</span> ft²</dd>
        </dl>
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
<!-- /wp:group -->
