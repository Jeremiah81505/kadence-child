/* Kitchen Layout Designer - lightweight canvas + export
   Author: Kadence Child
*/
(function(){
  const sel = (s, el=document) => el.querySelector(s);
  const all = (s, el=document) => Array.from(el.querySelectorAll(s));

  function init(root){
    if (!root || root.__kcInit) return; root.__kcInit = true;
    const canvas = document.createElement('canvas');
    canvas.className = 'kc-kd-canvas';
    const ctx = canvas.getContext('2d');

    const stage = sel('.kc-kd-stage', root);
    stage.appendChild(canvas);

    // state
    const state = {
      unit: 'in',        // inches
      scale: 6,          // pixels per inch @ 100% zoom
      zoom: 1,
      pan: {x:0,y:0},
      drawing: false,
      dragStart: null,
  rooms: [],         // { id, x, y, w, h, type: 'counter'|'seam', radius }
      selId: null,
      grid: { size: 6 },
  snapping: true,
  backsplash: { on: true, heightIn: 4 },
  edge: 'eased',
  seam: { show: true },
  sink: { type: 'undermount', w:30, h:20, x:12, y:12, center:false },
    };

    const aside = sel('.kc-kd-aside', root);
    const roomCountEl = sel('[data-kc-room-count]', aside);
    const areaEl = sel('[data-kc-area]', aside);
  const exportJsonBtn = sel('[data-kc-export-json]', root);
    const exportPngBtn = sel('[data-kc-export-png]', root);
    const resetBtn = sel('[data-kc-reset]', root);
    const addRectBtn = sel('[data-kc-add-rect]', root);
    const addLBtn = sel('[data-kc-add-l]', root);
  const snapBtn = sel('[data-kc-snap]', root);
  const zoomInBtn = sel('[data-kc-zoom-in]', root);
  const zoomOutBtn = sel('[data-kc-zoom-out]', root);
  let bindJsonEl = sel('[data-kc-bind="layout-json"]', root);
  let bindAreaEl = sel('[data-kc-bind="area-ft2"]', root);
  const copyJsonBtn = sel('[data-kc-copy-json]', root);
  const copyToFormBtn = sel('[data-kc-copy-form]', root);
  const inputW = sel('[data-kc-input-w]', root);
  const inputH = sel('[data-kc-input-h]', root);
  const inputR = sel('[data-kc-input-radius]', root);
  const delBtn = sel('[data-kc-delete]', root);
  const bsOn = sel('[data-kc-bs-on]', root);
  const bsHeight = sel('[data-kc-bs-height]', root);
  const edgeSel = sel('[data-kc-edge]', root);
  const addSeamBtn = sel('[data-kc-add-seam]', root);
  const showSeam = sel('[data-kc-show-seam]', root);
  const sinkType = sel('[data-kc-sink-type]', root);
  const sinkW = sel('[data-kc-sink-w]', root);
  const sinkH = sel('[data-kc-sink-h]', root);
  const sinkX = sel('[data-kc-sink-x]', root);
  const sinkY = sel('[data-kc-sink-y]', root);
  const sinkCentre = sel('[data-kc-sink-centre]', root);
  const bsAreaEl = sel('[data-kc-bs-area]', aside);
  const perimEl = sel('[data-kc-perim]', aside);
  const edgeReadout = sel('[data-kc-edge-readout]', aside);

    // sync canvas size
    function fit(){
      const r = stage.getBoundingClientRect();
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor((r.height - 1) * dpr);
      canvas.style.width = r.width + 'px';
      canvas.style.height = (r.height - 1) + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      draw();
    }
    const ro = new ResizeObserver(fit); ro.observe(stage);

    function worldToScreen(x,y){
      return {
        x: (x*state.scale*state.zoom) + state.pan.x + canvas.width/(window.devicePixelRatio||1)/2,
        y: (y*state.scale*state.zoom) + state.pan.y + canvas.height/(window.devicePixelRatio||1)/2,
      };
    }
    function screenToWorld(x,y){
      const dpr = window.devicePixelRatio||1;
      const cx = canvas.width/dpr/2; const cy = canvas.height/dpr/2;
      return {
        x: (x - cx - state.pan.x) / (state.scale*state.zoom),
        y: (y - cy - state.pan.y) / (state.scale*state.zoom),
      };
    }
    function snap(v){
      if (!state.snapping) return v;
      const g = 1; // 1 inch grid
      return Math.round(v/g)*g;
    }

    function addRect(){
      const id = 'r' + Math.random().toString(36).slice(2,7);
      state.rooms.push({ id, x: snap(-24), y: snap(-12), w: snap(48), h: snap(24), type: 'counter', radius: 0 });
      state.selId = id; draw(); updateAside();
    }
    function addL(){
      // L = two rectangles merged; store as two segments
      const id = 'l' + Math.random().toString(36).slice(2,7);
      state.rooms.push({ id, x: snap(-36), y: snap(-12), w: snap(48), h: snap(24), type: 'counter', radius: 0, seg: 'a', parent: id });
      state.rooms.push({ id, x: snap(0), y: snap(-12), w: snap(24), h: snap(36), type: 'counter', radius: 0, seg: 'b', parent: id });
      state.selId = id; draw(); updateAside();
    }
    function addSeamLayout(){
      const id = 'seam' + Math.random().toString(36).slice(2,6);
      state.rooms.push({ id, x: snap(-30), y: snap(-12), w: snap(60), h: snap(24), type: 'counter', radius: 0, seg: 'a', parent: id });
      state.rooms.push({ id, x: snap(0), y: snap(-12), w: snap(24), h: snap(48), type: 'counter', radius: 0, seg: 'b', parent: id });
      state.rooms.push({ id: 'seam-'+id, x: 0, y: -12, w: 0.01, h: 48, type: 'seam', parent: id });
      state.selId = id; draw(); updateAside();
    }

  function updateAside(){
      const in2 = totalAreaIn2();
      const ft2 = in2/144;
      roomCountEl.textContent = String(countShapes());
      areaEl.textContent = ft2.toFixed(2);
      snapBtn.classList.toggle('is-primary', state.snapping);
      // form binding
      const payload = { unit: state.unit, rooms: state.rooms, area_ft2: Number(ft2.toFixed(2)), options: {
        backsplash: state.backsplash,
        edge: state.edge,
        seam: state.seam,
        sink: state.sink,
        backsplash_area_ft2: Number((backsplashAreaIn2()/144).toFixed(2)),
        perimeter_lf: Number((perimeterIn()/12).toFixed(2)),
      } };
      if (bindJsonEl){ bindJsonEl.value = JSON.stringify(payload); bindJsonEl.dispatchEvent(new Event('input',{bubbles:true})); }
      if (bindAreaEl){ bindAreaEl.value = String(payload.area_ft2); bindAreaEl.dispatchEvent(new Event('input',{bubbles:true})); }
    }

    function countShapes(){
      // group L shapes
      const parents = new Set();
      let count = 0;
      for (const r of state.rooms){
        if (r.parent){ if (!parents.has(r.parent)){ parents.add(r.parent); count++; } }
        else { count++; }
      }
      return count;
    }

    function totalAreaIn2(){
      // naive: sum area; L shape counted twice so divide by parent grouping
      let area = 0;
      const seen = new Set();
      for (const r of state.rooms){
        const key = r.parent || r.id;
        if (seen.has(key)) continue;
        if (r.parent){
          const segs = state.rooms.filter(x => x.parent === r.parent);
          area += segs.reduce((a,b)=> a + Math.abs(b.w*b.h), 0);
          seen.add(r.parent);
        } else {
          area += Math.abs(r.w*r.h);
          seen.add(r.id);
        }
      }
      return area;
    }

    function drawGrid(){
      const dpr = window.devicePixelRatio||1;
      const w = canvas.width/dpr; const h = canvas.height/dpr;
      ctx.save();
      ctx.fillStyle = getComputedStyle(root).getPropertyValue('--kc-surface') || '#141925';
      ctx.fillRect(0,0,w,h);
      ctx.translate(w/2 + state.pan.x, h/2 + state.pan.y);
      ctx.scale(state.scale*state.zoom, state.scale*state.zoom);

      // grid every 1 inch
      const step = 1;
      const minX = -w/(2*state.scale*state.zoom) - 2;
      const maxX =  w/(2*state.scale*state.zoom) + 2;
      const minY = -h/(2*state.scale*state.zoom) - 2;
      const maxY =  h/(2*state.scale*state.zoom) + 2;
      ctx.lineWidth = 1/(state.scale*state.zoom);
      for (let x=Math.floor(minX); x<=Math.ceil(maxX); x++){
        ctx.strokeStyle = (x%12===0)? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)';
        ctx.beginPath(); ctx.moveTo(x, minY); ctx.lineTo(x, maxY); ctx.stroke();
      }
      for (let y=Math.floor(minY); y<=Math.ceil(maxY); y++){
        ctx.strokeStyle = (y%12===0)? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)';
        ctx.beginPath(); ctx.moveTo(minX, y); ctx.lineTo(maxX, y); ctx.stroke();
      }
      ctx.restore();
    }

  function drawRooms(){
      const dpr = window.devicePixelRatio||1;
      const w = canvas.width/dpr; const h = canvas.height/dpr;
      ctx.save();
      ctx.translate(w/2 + state.pan.x, h/2 + state.pan.y);
      ctx.scale(state.scale*state.zoom, state.scale*state.zoom);

      for (const r of state.rooms){
        const isSel = state.selId && (r.id===state.selId || r.parent===state.selId);
        if (r.type==='seam'){
          if (!state.seam.show) continue;
          ctx.strokeStyle = '#ffd54a';
          ctx.lineWidth = 2/(state.scale*state.zoom);
          ctx.setLineDash([6/(state.scale*state.zoom), 6/(state.scale*state.zoom)]);
          ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + r.w, r.y + r.h); ctx.stroke();
          ctx.setLineDash([]);
          continue;
        }
        ctx.fillStyle = isSel ? 'rgba(62,166,255,.25)' : 'rgba(62,166,255,.16)';
        ctx.strokeStyle = isSel ? '#3ea6ff' : (state.edge==='ogee' ? '#caa9ff' : 'rgba(255,255,255,.45)');
        ctx.lineWidth = 2/(state.scale*state.zoom);
        roundRect(ctx, r.x, r.y, r.w, r.h, (r.radius||0)/state.scale);
        ctx.fill(); ctx.stroke();

        // dimensions
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,.55)';
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        ctx.lineWidth = 1/(state.scale*state.zoom);
        const midx = r.x + r.w/2; const midy = r.y + r.h/2;
        // labels in inches
        const label = `${Math.round(Math.abs(r.w))}\" x ${Math.round(Math.abs(r.h))}\"`;
        ctx.scale(1/(state.scale*state.zoom), 1/(state.scale*state.zoom));
        ctx.font = '600 12px system-ui';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const p = worldToScreen(midx, midy);
        ctx.fillStyle = 'rgba(10,14,22,.7)';
        ctx.fillRect(p.x-26, p.y-10, 52, 20);
        ctx.strokeStyle = 'rgba(255,255,255,.1)';
        ctx.strokeRect(p.x-26, p.y-10, 52, 20);
        ctx.fillStyle = '#eaf2ff';
        ctx.fillText(label, p.x, p.y+1);
        ctx.restore();
      }

      // Backsplash render
      if (state.backsplash.on && Number(state.backsplash.heightIn||0)>0){
        ctx.save();
        ctx.fillStyle = 'rgba(125,226,209,.18)';
        ctx.strokeStyle = 'rgba(125,226,209,.6)';
        ctx.lineWidth = 1.5/(state.scale*state.zoom);
        const bh = Number(state.backsplash.heightIn||0);
        for (const r of state.rooms){ if (r.type!=='counter') continue; const rect = normalizeRect(r);
          ctx.beginPath(); ctx.rect(rect.x, rect.y - bh, rect.w, bh); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }

      // Sink overlay on selected section
      const selSegs = currentSelected();
      if (selSegs && state.sink.type!=='none'){
        const base = normalizeRect(selSegs[0]);
        const sx = state.sink.center ? (base.x + base.w/2 - state.sink.w/2) : (base.x + Math.min(Math.max(0, state.sink.x), Math.max(0, base.w - state.sink.w)));
        const sy = base.y + Math.min(Math.max(0, state.sink.y), Math.max(0, base.h - state.sink.h));
        ctx.save();
        ctx.strokeStyle = '#e57373';
        ctx.setLineDash([4/(state.scale*state.zoom), 4/(state.scale*state.zoom)]);
        ctx.lineWidth = 2/(state.scale*state.zoom);
        ctx.strokeRect(sx, sy, state.sink.w, state.sink.h);
        ctx.setLineDash([]);
        ctx.restore();
      }
      ctx.restore();
    }

  function normalizeRect(r){
    const x = Math.min(r.x, r.x + r.w);
    const y = Math.min(r.y, r.y + r.h);
    const w = Math.abs(r.w); const h = Math.abs(r.h);
    return { x, y, w, h };
  }

  function backsplashAreaIn2(){
    if (!state.backsplash.on) return 0;
    const h = Math.max(0, Number(state.backsplash.heightIn||0));
    let sum = 0; for (const r of state.rooms){ if (r.type!=='counter') continue; const rect = normalizeRect(r); sum += rect.w * h; }
    return sum;
  }

  function perimeterIn(){
    let p = 0; const seen = new Set();
    for (const r of state.rooms){ const key = r.parent || r.id; if (seen.has(key)) continue; seen.add(key); if (r.type!=='counter') continue; const rect = normalizeRect(r); p += 2*(rect.w + rect.h); }
    return p;
  }

    function roundRect(ctx, x, y, w, h, r){
      const rr = Math.min(Math.abs(w), Math.abs(h)) * r;
      ctx.beginPath();
      ctx.moveTo(x+rr, y);
      ctx.lineTo(x+w-rr, y);
      ctx.quadraticCurveTo(x+w, y, x+w, y+rr);
      ctx.lineTo(x+w, y+h-rr);
      ctx.quadraticCurveTo(x+w, y+h, x+w-rr, y+h);
      ctx.lineTo(x+rr, y+h);
      ctx.quadraticCurveTo(x, y+h, x, y+h-rr);
      ctx.lineTo(x, y+rr);
      ctx.quadraticCurveTo(x, y, x+rr, y);
      ctx.closePath();
    }

  function draw(){
      drawGrid();
      drawRooms();
    }

    function hitTest(mx,my){
      const p = screenToWorld(mx,my);
      for (let i=state.rooms.length-1; i>=0; i--){
        const r = state.rooms[i];
        const minX = Math.min(r.x, r.x+r.w), maxX = Math.max(r.x, r.x+r.w);
        const minY = Math.min(r.y, r.y+r.h), maxY = Math.max(r.y, r.y+r.h);
        if (p.x>=minX && p.x<=maxX && p.y>=minY && p.y<=maxY) return r;
      }
      return null;
    }

    // interactions
    canvas.addEventListener('mousedown', (e)=>{
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
      const hit = hitTest(mx, my);
      if (hit){
        state.drawing = 'move';
        state.dragStart = { mx, my, x: hit.x, y: hit.y, r: hit };
  state.selId = hit.parent || hit.id;
  syncSelectedInputs();
        draw();
      } else {
        state.drawing = 'pan';
        state.dragStart = { mx, my, panX: state.pan.x, panY: state.pan.y };
      }
    });
    window.addEventListener('mousemove', (e)=>{
      if (!state.drawing) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
      if (state.drawing==='move'){
        const { mx: sx, my: sy, x, y, r } = state.dragStart;
        const dx = (mx - sx)/(state.scale*state.zoom);
        const dy = (my - sy)/(state.scale*state.zoom);
  r.x = state.snapping ? snap(x+dx) : x+dx;
  r.y = state.snapping ? snap(y+dy) : y+dy;
  draw(); updateAside(); syncSelectedInputs();
      } else if (state.drawing==='pan'){
        const { mx: sx, my: sy, panX, panY } = state.dragStart;
        state.pan.x = panX + (mx - sx);
        state.pan.y = panY + (my - sy);
        draw();
      }
    });
    window.addEventListener('mouseup', ()=>{ state.drawing=false; state.dragStart=null; });

    // wheel zoom
    stage.addEventListener('wheel', (e)=>{
      if (!e.ctrlKey) return; e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      state.zoom = Math.min(4, Math.max(0.25, state.zoom*factor));
      draw();
    }, { passive:false });

    // toolbar actions
  addRectBtn?.addEventListener('click', addRect);
  addLBtn?.addEventListener('click', addL);
  snapBtn?.addEventListener('click', ()=>{ state.snapping = !state.snapping; updateAside(); });
  zoomInBtn?.addEventListener('click', ()=>{ state.zoom = Math.min(4, state.zoom*1.1); draw(); });
  zoomOutBtn?.addEventListener('click', ()=>{ state.zoom = Math.max(0.25, state.zoom/1.1); draw(); });
    resetBtn?.addEventListener('click', ()=>{ state.rooms = []; state.selId=null; draw(); updateAside(); });
  addSeamBtn?.addEventListener('click', addSeamLayout);
  showSeam?.addEventListener('change', ()=>{ state.seam.show = !!showSeam.checked; draw(); });
  bsOn?.addEventListener('change', ()=>{ state.backsplash.on = !!bsOn.checked; draw(); updateAside(); });
  bsHeight?.addEventListener('input', ()=>{ state.backsplash.heightIn = Number(bsHeight.value||0); draw(); updateAside(); });
  edgeSel?.addEventListener('change', ()=>{ state.edge = edgeSel.value; edgeReadout && (edgeReadout.textContent = edgeSel.options[edgeSel.selectedIndex].text); updateAside(); draw(); });
  sinkType?.addEventListener('change', ()=>{ state.sink.type = sinkType.value; draw(); updateAside(); });
  sinkW?.addEventListener('input', ()=>{ state.sink.w = Math.max(0, Number(sinkW.value||0)); draw(); updateAside(); });
  sinkH?.addEventListener('input', ()=>{ state.sink.h = Math.max(0, Number(sinkH.value||0)); draw(); updateAside(); });
  sinkX?.addEventListener('input', ()=>{ state.sink.x = Math.max(0, Number(sinkX.value||0)); draw(); });
  sinkY?.addEventListener('input', ()=>{ state.sink.y = Math.max(0, Number(sinkY.value||0)); draw(); });
  sinkCentre?.addEventListener('change', ()=>{ state.sink.center = !!sinkCentre.checked; draw(); });
  sinkW?.addEventListener('input', ()=>{ state.sink.w = Math.max(0, Number(sinkW.value||0)); draw(); updateAside(); });
  sinkH?.addEventListener('input', ()=>{ state.sink.h = Math.max(0, Number(sinkH.value||0)); draw(); updateAside(); });
  sinkX?.addEventListener('input', ()=>{ state.sink.x = Math.max(0, Number(sinkX.value||0)); draw(); });
  sinkY?.addEventListener('input', ()=>{ state.sink.y = Math.max(0, Number(sinkY.value||0)); draw(); });
  sinkCentre?.addEventListener('change', ()=>{ state.sink.center = !!sinkCentre.checked; draw(); });
    exportJsonBtn?.addEventListener('click', ()=>{
      const data = { unit: state.unit, rooms: state.rooms, area_ft2: Number((totalAreaIn2()/144).toFixed(2)), options: {
        backsplash: state.backsplash,
        edge: state.edge,
        seam: state.seam,
        sink: state.sink,
        backsplash_area_ft2: Number((backsplashAreaIn2()/144).toFixed(2)),
        perimeter_lf: Number((perimeterIn()/12).toFixed(2)),
      } };
      const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kitchen-layout.json'; a.click();
      setTimeout(()=> URL.revokeObjectURL(a.href), 1500);
    });
    copyJsonBtn?.addEventListener('click', async ()=>{
      try{
  const data = bindJsonEl?.value || JSON.stringify({ unit: state.unit, rooms: state.rooms, area_ft2: Number((totalAreaIn2()/144).toFixed(2)) });
        await navigator.clipboard.writeText(data);
        copyJsonBtn.textContent = 'Copied!'; setTimeout(()=> copyJsonBtn.textContent = 'Copy JSON', 1200);
      }catch(err){
        alert('Copy failed. You can download JSON instead.');
      }
    });
    copyToFormBtn?.addEventListener('click', ()=>{
      updateAside();
      copyToFormBtn.textContent = 'Synced'; setTimeout(()=> copyToFormBtn.textContent = 'Copy to Form', 1200);
    });
    exportPngBtn?.addEventListener('click', ()=>{
      // temporarily draw at 2x for crisp export
      const dpr = window.devicePixelRatio||1; const w = canvas.width; const h = canvas.height;
      const tmp = document.createElement('canvas'); tmp.width = w*2; tmp.height = h*2;
      const tctx = tmp.getContext('2d');
      const saved = { scale: state.scale, zoom: state.zoom };
      state.scale *= 2; state.zoom *= 1;
      // draw into tmp
      const realCtx = ctx; const realCanvas = canvas;
      // Redirect rendering by swapping globals
      const oldW = canvas.width; const oldH = canvas.height; const oldStyleW = canvas.style.width; const oldStyleH = canvas.style.height;
      canvas.width = tmp.width; canvas.height = tmp.height; canvas.style.width = tmp.width+'px'; canvas.style.height = tmp.height+'px';
      const oldSet = ctx.setTransform.bind(ctx);
      ctx.setTransform(2*(dpr),0,0,2*(dpr),0,0); // boost
      draw();
      const dataURL = canvas.toDataURL('image/png');
      // restore
      state.scale = saved.scale; state.zoom = saved.zoom;
      canvas.width = oldW; canvas.height = oldH; canvas.style.width = oldStyleW; canvas.style.height = oldStyleH; oldSet(dpr,0,0,dpr,0,0); draw();
      const a = document.createElement('a'); a.href = dataURL; a.download = 'kitchen-layout.png'; a.click();
    });

    // Try to find a form to attach hidden fields to, if not already inside one
    function ensureFormBindings(){
      const candidates = [
        root.querySelector('form'),
        root.closest('form'),
        document.querySelector('.wp-block-kadence-form form'),
        document.querySelector('form.wpcf7-form'),
        document.querySelector('form.wpforms-form'),
        document.querySelector('.gform_wrapper form'),
        document.querySelector('form.elementor-form'),
      ].filter(Boolean);
      const form = candidates[0];
      if (!form) return;
      // Move or create hidden inputs inside the form
      if (!bindJsonEl){ bindJsonEl = document.createElement('input'); bindJsonEl.type='hidden'; bindJsonEl.name='kc_layout_json'; }
      if (!bindAreaEl){ bindAreaEl = document.createElement('input'); bindAreaEl.type='hidden'; bindAreaEl.name='kc_area_ft2'; }
      if (!form.contains(bindJsonEl)) form.appendChild(bindJsonEl);
      if (!form.contains(bindAreaEl)) form.appendChild(bindAreaEl);
      updateAside();
    }

    function currentSelected(){
      if (!state.selId) return null;
      const segs = state.rooms.filter(r=> r.id===state.selId || r.parent===state.selId);
      return segs.length? segs : null;
    }
    function syncSelectedInputs(){
      const segs = currentSelected();
      if (!segs){ if (inputW) inputW.value=''; if (inputH) inputH.value=''; if (inputR) inputR.value='0'; return; }
      // use first segment as representative
      const r = segs[0];
      if (inputW) inputW.value = String(Math.round(Math.abs(r.w)));
      if (inputH) inputH.value = String(Math.round(Math.abs(r.h)));
      if (inputR) inputR.value = String(Math.round(r.radius||0));
    }
    inputW?.addEventListener('input', ()=>{
      const segs = currentSelected(); if (!segs) return;
      let v = parseFloat(inputW.value||'0'); if (!isFinite(v)||v<=0) return;
      segs.forEach(s=> s.w = Math.sign(s.w||1) * (state.snapping ? snap(v) : v));
      draw(); updateAside();
    });
    inputH?.addEventListener('input', ()=>{
      const segs = currentSelected(); if (!segs) return;
      let v = parseFloat(inputH.value||'0'); if (!isFinite(v)||v<=0) return;
      segs.forEach(s=> s.h = Math.sign(s.h||1) * (state.snapping ? snap(v) : v));
      draw(); updateAside();
    });
    inputR?.addEventListener('input', ()=>{
      const segs = currentSelected(); if (!segs) return;
      let v = Math.max(0, parseFloat(inputR.value||'0'));
      segs.forEach(s=> s.radius = v);
      draw(); updateAside();
    });
    delBtn?.addEventListener('click', ()=>{
      if (!state.selId) return;
      state.rooms = state.rooms.filter(r=> r.id!==state.selId && r.parent!==state.selId);
      state.selId = null; draw(); updateAside(); syncSelectedInputs();
    });

    fit(); updateAside(); ensureFormBindings(); syncSelectedInputs();
  }

  function boot(){
    all('.kc-kitchen-designer').forEach(init);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
