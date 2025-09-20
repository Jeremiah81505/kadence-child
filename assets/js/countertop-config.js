(function(){
  const sel = (s, el=document)=> el.querySelector(s);
  const all = (s, el=document)=> Array.from(el.querySelectorAll(s));

  function init(root){
    if (!root || root.__ctInit) return; root.__ctInit = true;
    const svg = sel('[data-ct-svg]', root);
    const shapeLabel = sel('[data-ct-shape-label]', root);
    const actions = root;

  // Simple multi-shape state
  let shapes = [ { id:'s1', name:'Shape 1', type:'rect', rot:0, len:{A:60,B:25,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false} } ];
  let active = 0;
  // Global options state (not per shape for now)
  const opts = {
    thickness: '3cm', edge: 'Bevel',
    sinks: 'No',
    'plumb-disconnect': 'Customer', 'plumb-connect': 'Customer',
    'cutout-cooktop': 0, 'cutout-faucet': 0, 'cutout-other': 0,
    'corner-small': 0, 'corner-medium': 0, 'corner-large': 0,
    removal: 'Countertops Only'
  };
  const STATE_KEY = 'kcCountertopConfig:v1';

    function draw(){
  svg.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  svg.appendChild(g);

      // convert inches to pixels (just for preview scale)
      const px = (v)=> v * 2; // 2px per inch roughly
      const centerX = 300, centerY = 180;

      const cur = shapes[active];
      const len = cur.len; const shape = cur.type; const rotation = cur.rot;
      if (shape==='rect'){
        const w = px(len.A || 60);
        const h = px(len.B || 25);
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', String(centerX - w/2));
        rect.setAttribute('y', String(centerY - h/2));
        rect.setAttribute('width', String(w));
        rect.setAttribute('height', String(h));
        rect.setAttribute('fill', '#f8c4a0');
        rect.setAttribute('stroke', '#ccc');
        rect.setAttribute('stroke-width', '2');
        const rot = document.createElementNS(ns, 'g');
        rot.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);
        rot.appendChild(rect);
        g.appendChild(rot);
        labelDims(centerX, centerY, len.A, len.B);
  } else if (shape==='l'){
        const a = px(len.A||60), b = px(len.B||25);
        const t = 40; // thickness for L leg visual only
        const path = document.createElementNS(ns, 'path');
        const x = centerX - a/2, y = centerY - b/2;
        const d = `M ${x} ${y} h ${a} v ${t} h ${-a+t} v ${b-t} h ${-t} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', '#f8c4a0');
        path.setAttribute('stroke', '#ccc');
        path.setAttribute('stroke-width', '2');
        const rot = document.createElementNS(ns, 'g');
        rot.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);
        rot.appendChild(path);
        g.appendChild(rot);
        labelDims(centerX, centerY, len.A, len.B);
  } else if (shape==='u'){
        const a = px(len.A||60), b = px(len.B||25);
        const t = 40; // side thickness for U visual only
        const path = document.createElementNS(ns, 'path');
        const x = centerX - a/2, y = centerY - b/2;
        const d = `M ${x} ${y} h ${a} v ${t} h ${-a/2 + t/2} v ${b-t} h ${-t} v ${-(b-t)} h ${-a/2 + t/2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', '#f8c4a0');
        path.setAttribute('stroke', '#ccc');
        path.setAttribute('stroke-width', '2');
        const rot = document.createElementNS(ns, 'g');
        rot.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);
        rot.appendChild(path);
        g.appendChild(rot);
        labelDims(centerX, centerY, len.A, len.B);
      }
    }

    function labelDims(cx, cy, a, b){
      // A top, B left, C bottom, D right (like the screenshot)
      const make = (x1,y1,x2,y2,txt)=>{
        const ns='http://www.w3.org/2000/svg';
        const g=document.createElementNS(ns,'g');
        const line=document.createElementNS(ns,'line');
        line.setAttribute('x1',x1); line.setAttribute('y1',y1); line.setAttribute('x2',x2); line.setAttribute('y2',y2);
        line.setAttribute('stroke','#bbb'); line.setAttribute('stroke-width','2');
        const t=document.createElementNS(ns,'text');
        t.setAttribute('x', (x1+x2)/2); t.setAttribute('y', (y1+y2)/2 - 6);
        t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=txt;
        g.appendChild(line); g.appendChild(t); svg.appendChild(g);
      };
      const px=(v)=> v*2;
      make(cx-100, cy-80, cx+100, cy-80, 'A');
      make(cx-140, cy-60, cx-140, cy+60, 'B');
      make(cx-100, cy+80, cx+100, cy+80, 'C');
      make(cx+140, cy-60, cx+140, cy+60, 'D');
    }

  // (shape selection handled below in a single place)

  sel('[data-ct-rotate-left]', root)?.addEventListener('click', ()=>{ shapes[active].rot = (shapes[active].rot + 270)%360; draw(); });
  sel('[data-ct-rotate-right]', root)?.addEventListener('click', ()=>{ shapes[active].rot = (shapes[active].rot + 90)%360; draw(); });

  all('[data-ct-len]', root).forEach(inp=>{
      inp.addEventListener('input', ()=>{
    const k = inp.getAttribute('data-ct-len');
  let v = parseInt(inp.value||'0',10); if(!isFinite(v)||v<0) v=0; shapes[active].len[k] = v; draw(); updateOversize(); updateSummary();
      });
    });

    function updateOversize(){
      // Simple heuristic: any span over 120 inches is oversized
      const limit = 120;
      const cur = shapes[active]; const len = cur.len;
      const over = (len.A>limit) || (len.B>limit) || (len.C>limit) || (len.D>limit);
      const alertEl = sel('[data-ct-alert]', root);
      if (alertEl) alertEl.hidden = !over;
    }

    function updateActionStates(){
      const del = sel('[data-ct-delete]', root);
      const rst = sel('[data-ct-reset]', root);
      if (del) del.disabled = shapes.length <= 1;
      if (rst) rst.disabled = false;
    }

    // Tabs handling
    const tabsWrap = sel('[data-ct-tabs]', root);
    function renderTabs(){
      const activeId = 's' + (active+1);
      tabsWrap.innerHTML = '';
      shapes.forEach((sh, idx)=>{
        const b=document.createElement('button'); b.className='kc-ct-tab' + (idx===active?' is-active':''); b.type='button'; b.textContent=sh.name; b.addEventListener('click', ()=>{ active=idx; shapeLabel.textContent=sh.name; syncInputs(); draw(); updateOversize(); renderTabs(); }); tabsWrap.appendChild(b);
      });
  const add=document.createElement('button'); add.className='kc-ct-tab add'; add.type='button'; add.textContent='Add A Shape'; add.addEventListener('click', ()=>{ const id='s'+(shapes.length+1); shapes.push({ id, name:'Shape '+(shapes.length+1), type:'rect', rot:0, len:{A:60,B:25,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false} }); active=shapes.length-1; shapeLabel.textContent=shapes[active].name; syncInputs(); draw(); updateOversize(); renderTabs(); updateActionStates(); updateSummary(); }); tabsWrap.appendChild(add);
      updateActionStates();
    }

    function syncInputs(){
      const cur = shapes[active];
      all('[data-ct-len]', root).forEach(inp=>{ const k=inp.getAttribute('data-ct-len'); inp.value = String(cur.len[k]||0); });
  all('[data-ct-wall]', root).forEach(inp=>{ const k=inp.getAttribute('data-ct-wall'); inp.checked = !!cur.wall[k]; });
  all('[data-ct-backsplash]', root).forEach(inp=>{ const k=inp.getAttribute('data-ct-backsplash'); inp.checked = !!cur.bs[k]; });
      all('[data-ct-shape]', root).forEach(btn=> btn.classList.toggle('is-active', btn.getAttribute('data-ct-shape')===cur.type));
      const off = (cur.type==='rect');
      const cRow = sel('.kc-meas .row[data-side="C"]', root);
      const dRow = sel('.kc-meas .row[data-side="D"]', root);
      [cRow,dRow].forEach(row=> row && row.classList.toggle('disabled', off));
    }

    // Shape picker updates current
    all('[data-ct-shape]', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        all('.kc-shape', root).forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        shapes[active].type = btn.getAttribute('data-ct-shape')||'rect';
        const off = (shapes[active].type==='rect');
        const cRow = sel('.kc-meas .row[data-side="C"]', root);
        const dRow = sel('.kc-meas .row[data-side="D"]', root);
        [cRow,dRow].forEach(row=> row && row.classList.toggle('disabled', off));
        draw(); updateOversize();
      });
    });

    // Wall / backsplash bindings
    all('[data-ct-wall]', root).forEach(inp=>{
      inp.addEventListener('change', ()=>{
        const k = inp.getAttribute('data-ct-wall');
        shapes[active].wall[k] = !!inp.checked;
  updateSummary(); save();
      });
    });
    all('[data-ct-backsplash]', root).forEach(inp=>{
      inp.addEventListener('change', ()=>{
        const k = inp.getAttribute('data-ct-backsplash');
        shapes[active].bs[k] = !!inp.checked;
  updateSummary(); save();
      });
    });

    // Reset/Delete actions
    sel('[data-ct-reset]', root)?.addEventListener('click', ()=>{
      const cur = shapes[active];
      cur.len = {A:60,B:25,C:0,D:0};
      cur.rot = 0;
      // keep current type
  syncInputs(); draw(); updateOversize(); updateSummary();
    });
    sel('[data-ct-delete]', root)?.addEventListener('click', ()=>{
      if (shapes.length <= 1) return;
      shapes.splice(active, 1);
      if (active >= shapes.length) active = shapes.length - 1;
      shapes.forEach((s,i)=> s.name = 'Shape ' + (i+1));
      shapeLabel.textContent = shapes[active].name;
  renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
    });

  // Initial draw
    // Options bindings
    // single-select buttons: data-ct-opt
  root.querySelectorAll('[data-ct-opt]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const key = btn.getAttribute('data-ct-opt'); const val = btn.getAttribute('data-value');
        opts[key] = val;
        // activate visual
    root.querySelectorAll(`[data-ct-opt="${key}"]`).forEach(b=>{ b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true');
    updateSummary(); save();
      });
    });
    // radio groups: data-ct-radio
  root.querySelectorAll('[data-ct-radio]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const key = btn.getAttribute('data-ct-radio'); const val = btn.getAttribute('data-value');
        opts[key] = val;
    root.querySelectorAll(`[data-ct-radio="${key}"]`).forEach(b=>{ b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true');
    updateSummary(); save();
      });
    });
    // counters: data-ct-counter with .kc-ctr-inc / .kc-ctr-dec
    root.querySelectorAll('[data-ct-counter]').forEach(box=>{
      const key = box.getAttribute('data-ct-counter');
      const valEl = box.querySelector('.kc-ctr-val');
      const sync = ()=>{ valEl.textContent = String(opts[key]); };
      box.querySelector('.kc-ctr-inc')?.addEventListener('click', ()=>{ opts[key] = (opts[key]||0)+1; sync(); updateSummary(); save(); });
      box.querySelector('.kc-ctr-dec')?.addEventListener('click', ()=>{ opts[key] = Math.max(0,(opts[key]||0)-1); sync(); updateSummary(); save(); });
      sync();
    });

    function syncOptionsUI(){
      root.querySelectorAll('[data-ct-opt]').forEach(btn=>{
        const key=btn.getAttribute('data-ct-opt'); const val=btn.getAttribute('data-value');
        const on = (opts[key]===val); btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', on?'true':'false');
      });
      root.querySelectorAll('[data-ct-radio]').forEach(btn=>{
        const key=btn.getAttribute('data-ct-radio'); const val=btn.getAttribute('data-value');
        const on = (opts[key]===val); btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', on?'true':'false');
      });
      root.querySelectorAll('[data-ct-counter]').forEach(box=>{
        const key = box.getAttribute('data-ct-counter'); const valEl = box.querySelector('.kc-ctr-val');
        if (valEl) valEl.textContent = String(opts[key]||0);
      });
    }

    function updateSummary(){
      const piecesEl = sel('[data-ct-sum-pieces]', root);
      const areaEl = sel('[data-ct-sum-area]', root);
      const thEl = sel('[data-ct-sum-thickness]', root);
      const edgeEl = sel('[data-ct-sum-edge]', root);
      const sinksEl = sel('[data-ct-sum-sinks]', root);
      const plDiscEl = sel('[data-ct-sum-plumb-disconnect]', root);
      const plConnEl = sel('[data-ct-sum-plumb-connect]', root);
      const cutCookEl = sel('[data-ct-sum-cut-cooktop]', root);
      const cutFaucEl = sel('[data-ct-sum-cut-faucet]', root);
      const cutOtherEl = sel('[data-ct-sum-cut-other]', root);
      const removalEl = sel('[data-ct-sum-removal]', root);
      if (piecesEl) piecesEl.textContent = String(shapes.length);
      // rough area: sum A*B for each shape (in sq ft)
      const totalSqIn = shapes.reduce((acc,s)=> acc + (Number(s.len?.A||0)*Number(s.len?.B||0)), 0);
      const sqFt = totalSqIn/144; if (areaEl) areaEl.textContent = (Math.round(sqFt*10)/10).toFixed(1);
      if (thEl) thEl.textContent = opts.thickness||'';
      if (edgeEl) edgeEl.textContent = opts.edge||'';
      if (sinksEl) sinksEl.textContent = opts.sinks||'';
      if (plDiscEl) plDiscEl.textContent = opts['plumb-disconnect']||'';
      if (plConnEl) plConnEl.textContent = opts['plumb-connect']||'';
      if (cutCookEl) cutCookEl.textContent = String(opts['cutout-cooktop']||0);
      if (cutFaucEl) cutFaucEl.textContent = String(opts['cutout-faucet']||0);
      if (cutOtherEl) cutOtherEl.textContent = String(opts['cutout-other']||0);
      if (removalEl) removalEl.textContent = opts.removal||'';
    }

    // Load saved state if present
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if (raw){
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.shapes) && parsed.opts){ shapes = parsed.shapes; active = Math.max(0, Math.min(parsed.active||0, shapes.length-1)); }
        if (parsed && parsed.opts) Object.assign(opts, parsed.opts);
      }
    } catch(e){}

    const stateEl = sel('[data-ct-state]', root);
    const save = ()=>{
      const data = { shapes, active, opts };
      try{ localStorage.setItem(STATE_KEY, JSON.stringify(data)); }catch(e){}
      if (stateEl) stateEl.value = JSON.stringify(data);
      updateSummary();
    };

    // Save on meaningful interactions
    const saveAnd = (fn)=> (...args)=>{ const r=fn(...args); save(); return r; };
    // wrap key handlers
    const origDraw = draw; draw = saveAnd(draw);
    const origRenderTabs = renderTabs; renderTabs = saveAnd(renderTabs);
    const origSyncInputs = syncInputs; syncInputs = saveAnd(syncInputs);

  shapeLabel.textContent = shapes[active].name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); syncOptionsUI(); updateSummary(); save();
  }

  function boot(){
    document.querySelectorAll('.kc-ct-configurator').forEach(init);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
