(function(){
  const sel = (s, el=document)=> el.querySelector(s);
  const all = (s, el=document)=> Array.from(el.querySelectorAll(s));

  function init(root){
  if (!root || root.__ctInit) return;
  const svg = sel('[data-ct-svg]', root);
  if (!svg){ try{ console.warn('[kc][ct] init skipped: svg not found in root', root); }catch(e){} return; }
  root.__ctInit = true;
    const shapeLabel = sel('[data-ct-shape-label]', root);
  const actions = root;
  let mode = 'move'; // move | resize
  let isGestureActive = false; // disables undo/redo during active drag/resize
  let gestureHintTimer = null;

  // Simple multi-shape state
  let shapes = [];
  let active = -1;
  let hover = -1;
  let handles = [];
  let hoverHandle = null; // {i,h} from pickHandle
  let inlineHost = sel('[data-ct-inline]', root);
  // Poly drawing state
  let drawingPoly = false; // when true, clicks add vertices to the active poly
  let drawingIdx = -1;
  // Global options state (not per shape for now)
  const opts = {
    material: ['Laminate'], edge: 'Bevel',
    sinks: 'No',
    'cutout-cooktop': 0, 'cutout-faucet': 0, 'cutout-other': 0,
    'corner-small': 0, 'corner-medium': 0, 'corner-large': 0,
    removal: 'Countertops Only',
    color: '',
  bsOn: true,
  bsHeight: 4,
  snap: true,
  showSeams: false
  };
  const STATE_KEY = 'kcCountertopConfig:v1';
  let toolMode = 'move';
  let zoom = 1;
  // Debounce timer for measurement input history
  let lenEditTimer = null;
  // Lightweight announcer for a11y status updates
  const announce = (msg)=>{ try{ const live = sel('[data-ct-live]', root); if (live){ live.textContent=''; setTimeout(()=>{ live.textContent = String(msg||''); }, 10); } }catch(e){} };
  // Simple visual toast for quick feedback
  let toastTimer = null;
  const toast = (msg)=>{
    try{
      const el = sel('[data-ct-toast]', root);
      if (!el) return;
      el.textContent = String(msg||'');
      el.classList.add('is-show');
      el.setAttribute('aria-hidden', 'false');
      if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.classList.remove('is-show'); el.setAttribute('aria-hidden','true'); }, 900);
    }catch(e){}
  };

    // Normalize/migrate a shape object to current schema and constraints
    function normalizeShape(s){
      try{
        if (!s || typeof s !== 'object') return s;
        if (!s.len) s.len = {};
        if (s.type === 'u'){
          const clamp=(v,min,max)=> Math.min(Math.max(Number(v||0),min),max);
          const A = Number(s.len.A||0);
          const hasB = (s.len.B!=null);
          let BL = (s.len.BL!=null) ? Number(s.len.BL) : (hasB ? Number(s.len.B) : 25);
          let BR = (s.len.BR!=null) ? Number(s.len.BR) : (hasB ? Number(s.len.B) : 25);
          if (s.len.BL==null) s.len.BL = BL;
          if (s.len.BR==null) s.len.BR = BR;
          // E/H/C interplay with 1" minimum inner span
          const minSpan = 1;
          let E = Math.max(0, Number(s.len.E||0));
          let H = Math.max(0, Number(s.len.H||0));
          E = Math.min(E, Math.max(0, A - minSpan - H));
          H = Math.min(H, Math.max(0, A - minSpan - E));
          let C = Number(s.len.C|| (A ? Math.max(1, A - (E + H)) : 0));
          C = Math.max(1, Math.min(C, Math.max(1, A - minSpan)));
          if (E + H > Math.max(0, A - 1)){
            const spare = Math.max(0, A - C);
            const e = Math.floor(spare/2); const h = spare - e;
            E = e; H = h;
          }
          s.len.E = Math.round(E);
          s.len.H = Math.round(H);
          s.len.C = Math.round(Math.max(1, A - Math.max(0, s.len.E||0) - Math.max(0, s.len.H||0)));
          // D clamp to shallower leg - 1
          const minSide = Math.max(0, Math.min(BL, BR));
          const dMax = Math.max(0, minSide - 1);
          s.len.D = clamp(s.len.D||0, 0, dMax);
          // Backsplash keys migration (B -> BL/BR)
          s.bs = s.bs || {};
          if (s.bs.B!=null){
            if (s.bs.BL==null) s.bs.BL = !!s.bs.B;
            if (s.bs.BR==null) s.bs.BR = !!s.bs.B;
          }
          if (s.bs.BL==null) s.bs.BL = false;
          if (s.bs.BR==null) s.bs.BR = false;
          if (s.bs.E==null) s.bs.E = false;
          if (s.bs.H==null) s.bs.H = false;
          if (s.bs.A==null) s.bs.A = !!s.bs.A;
          if (s.bs.C==null) s.bs.C = !!s.bs.C;
          // Inside-corner defaults and auto-zero bottom when legs differ
          if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
          if (BL !== BR){
            s.icCorners.iBL = { mode:'square', value:0 };
            s.icCorners.iBR = { mode:'square', value:0 };
          }
        }
      }catch(e){}
      return s;
    }

    // Simple undo/redo history
    const HISTORY_LIMIT = 50;
    let _past = [];
    let _future = [];
    const snapshot = ()=> JSON.parse(JSON.stringify({ shapes, active, opts }));
    function restore(state){
      shapes = Array.isArray(state?.shapes) ? state.shapes : [];
      active = Math.max(-1, Math.min(Number(state?.active ?? -1), shapes.length-1));
      const restoredOpts = state?.opts || {};
      // mutate opts (const) back to restored state
      Object.keys(opts).forEach(k=>{ delete opts[k]; });
      Object.assign(opts, restoredOpts);
      renderTabs(); syncInputs(); syncOptionsUI(); draw(); updateOversize(); updateActionStates(); updateSummary(); save();
    }
    function pushHistory(){
      try{ _past.push(snapshot()); if (_past.length>HISTORY_LIMIT) _past.shift(); _future.length = 0; }catch(e){}
      // reflect new history availability in UI
      try{ updateActionStates(); }catch(e){}
    }
  function undo(){ if(!_past.length) return; try{ _future.push(snapshot()); const st=_past.pop(); restore(st); updateActionStates(); announce('Undid last change'); toast('Undid'); }catch(e){} }
  function redo(){ if(!_future.length) return; try{ _past.push(snapshot()); const st=_future.pop(); restore(st); updateActionStates(); announce('Redid last change'); toast('Redid'); }catch(e){} }

    function draw(){
  svg.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const gRoot = document.createElementNS(ns, 'g');
      svg.appendChild(gRoot);

      const px = (v)=> v * 2; // 2px per inch roughly
      hitAreas = [];
      handles = [];
      const drawGuideLine=(parent,x1,y1,x2,y2,txt)=>{
        const l=document.createElementNS(ns,'line');
        l.setAttribute('x1',String(x1)); l.setAttribute('y1',String(y1));
        l.setAttribute('x2',String(x2)); l.setAttribute('y2',String(y2));
        l.setAttribute('stroke','#bdc6da'); l.setAttribute('stroke-width','2');
        parent.appendChild(l);
        if (txt){
          const mx=(x1+x2)/2, my=(y1+y2)/2 - 6; const ang=Math.atan2(y2-y1, x2-x1)*180/Math.PI;
          const t=document.createElementNS(ns,'text'); t.setAttribute('x', String(mx)); t.setAttribute('y', String(my)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=txt; t.setAttribute('transform', `rotate(${ang} ${mx} ${my})`); parent.appendChild(t);
        }
      };

      const addHandle=(idx, cx, cy, rot, key)=>{
        // Expect world-space coordinates; no extra rotation here (alignment handled by localToWorld upstream)
        handles.push({ idx, cx, cy, rot, key, r:8 });
  // Only render visible handles when Resize mode is active on the selected shape
  if (!(idx===active && toolMode==='resize')) return;
  const c=document.createElementNS(ns,'circle');
  c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r','6');
  c.setAttribute('fill','#fff');
  // Default handle style (outer/side handles)
  c.setAttribute('stroke','#4f6bd8'); c.setAttribute('stroke-width','2');
        // Add an accessible tooltip describing the handle purpose
        const t=document.createElementNS(ns,'title');
        let tip='Adjust';
        const keyStr=String(key||'');
        if (keyStr==='A-right') tip='Drag to change A (increase)';
        else if (keyStr==='A-left') tip='Drag to change A (decrease)';
        else if (keyStr==='B-top') tip='Drag to change B (decrease)';
        else if (keyStr==='B-bottom') tip='Drag to change B (increase)';
        else if (keyStr==='C') tip='Drag to adjust C';
        else if (keyStr==='D') tip='Drag to adjust D';
        else if (keyStr==='BL') tip='Drag to adjust Left depth (BL)';
        else if (keyStr==='BR') tip='Drag to adjust Right depth (BR)';
        else if (keyStr==='E') tip='Drag to adjust Left return (E)';
        else if (keyStr==='H') tip='Drag to adjust Right return (H)';
  else if (keyStr.startsWith('P-')) tip='Drag to scale this side length';
  else if (keyStr.startsWith('RC-')) tip='Drag to adjust outer corner size';
  else if (keyStr.startsWith('IC-')) tip='Drag to adjust inner corner size';
        else if (keyStr.startsWith('V-')) tip='Drag to move this vertex';
        t.textContent=tip; c.appendChild(t);
        if (idx===active) gRoot.appendChild(c);
        // Draw a small label near the handle for clarity
        const label=document.createElementNS(ns,'text');
        label.setAttribute('x', String(cx + 10));
        label.setAttribute('y', String(cy - 10));
        label.setAttribute('font-size','11');
        label.setAttribute('font-weight','700');
        label.setAttribute('fill','#1f2b56');
        label.setAttribute('class','kc-hlabel');
  let ltxt='';
        if (keyStr==='A-right' || keyStr==='A-left') ltxt='A';
        else if (keyStr==='B-top' || keyStr==='B-bottom') ltxt='B';
        else if (keyStr==='BL') ltxt='BL';
        else if (keyStr==='BR') ltxt='BR';
        else if (keyStr==='C') ltxt='C';
        else if (keyStr==='D') ltxt='D';
        else if (keyStr==='E') ltxt='E';
        else if (keyStr==='H') ltxt='H';
        else if (keyStr.startsWith('P-')) ltxt='Side';
        else if (keyStr.startsWith('V-')) ltxt='Pt';
        else if (keyStr.startsWith('RC-')){
          const map={ 'RC-TL':'TL','RC-TR':'TR','RC-BR':'BR','RC-BL':'BL'}; ltxt = map[keyStr]||'RC';
        } else if (keyStr.startsWith('IC-')){
          const map={ 'IC-TL':'iTL','IC-TR':'iTR','IC-BR':'iBR','IC-BL':'iBL','IC-L':'iC'}; ltxt = map[keyStr]||'IC';
        }
        // Color IC handles distinctly for quick recognition
        if (keyStr.startsWith('IC-')){
          c.setAttribute('stroke', '#7db320');
          label.setAttribute('fill', '#1a3f14');
        }
        label.textContent = ltxt;
        if (idx===active) gRoot.appendChild(label);
      };

      const labelNumbers=(parent, cx, cy, cur, dims)=>{
        const mk=(x,y,txt)=>{ const t=document.createElementNS(ns,'text'); t.setAttribute('x',String(x)); t.setAttribute('y',String(y)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','14'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#2d4a7a'); t.textContent=txt; parent.appendChild(t); };
        const mkRot=(x,y,txt,deg)=>{ const t=document.createElementNS(ns,'text'); t.setAttribute('x',String(x)); t.setAttribute('y',String(y)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#2d4a7a'); t.textContent=txt; t.setAttribute('transform', `rotate(${deg} ${x} ${y})`); parent.appendChild(t); };
  const a=Number(dims.A ?? (cur.len?.A ?? 0)), b=Number(dims.B ?? (cur.len?.B ?? 0)), c=Number(dims.C ?? (cur.len?.C ?? 0)), d=Number(dims.D ?? (cur.len?.D ?? 0));

        if (cur.type==='rect'){
          const aPx=px(a), bPx=px(b);
          // A top
          mk(cx, cy - (bPx/2) - 10, `${a}\"`);
          // B left
          mkRot(cx - (aPx/2) - 22, cy, `${b}\"`, -90);
          return;
        }
        if (cur.type==='l'){
          const aPx=px(a), bPx=px(b), cPx=px(c), dPx=px(d);
          // A top
          mk(cx, cy - (bPx/2) - 10, `${a}\"`);
          const flipX = !!cur.flipX;
          // B side mirrors
          if (!flipX){ mkRot(cx - (aPx/2) - 22, cy, `${b}\"`, -90); }
          else { mkRot(cx + (aPx/2) + 22, cy, `${b}\"`, -90); }
          // C bottom inner run
          const cMidX = !flipX ? (cx - aPx/2 + cPx/2) : (cx + aPx/2 - cPx/2);
          const cY = cy + bPx/2 + 14; mk(cMidX, cY, `${c}\"`);
          // D outer vertical segment on mirrored side
          const dYmid = cy - bPx/2 + dPx/2;
          if (!flipX){ mkRot(cx + (aPx/2) + 22, dYmid, `${d}\"`, -90); }
          else { mkRot(cx - (aPx/2) - 22, dYmid, `${d}\"`, -90); }
          return;
        }
        if (cur.type==='u'){
          const aPx = px(a);
          const dPx = px(Number(dims.D ?? cur.len?.D ?? 0));
          const bl = Number(dims.BL ?? cur.len?.BL ?? cur.len?.B ?? 25);
          const br = Number(dims.BR ?? cur.len?.BR ?? cur.len?.B ?? 25);
          const blPx = px(bl), brPx = px(br);
          const hMax = Math.max(blPx, brPx);
          const yTop = cy - hMax/2;
          // A top
          mk(cx, yTop - 10, `${a}\"`);
          // B-L and B-R numbers (left and right verticals)
          mkRot(cx - (aPx/2) - 22, yTop + blPx/2, `${bl}\"`, -90);
          mkRot(cx + (aPx/2) + 22, yTop + brPx/2, `${br}\"`, -90);
          // Inner top C and D positions derived from E/H splits
          const e = Number(cur.len?.E ?? Math.max(0, Math.round((a - c)/2)));
          const h = Number(cur.len?.H ?? Math.max(0, Math.round((a - c)/2)));
          const xiL = cx - aPx/2 + px(e);
          const xiR = cx + aPx/2 - px(h);
          const innerTopY = yTop + dPx;
          const cX = xiL + (xiR - xiL) * 0.35; mk(cX, innerTopY - 6, `${c}\"`);
          const dX = xiL + (xiR - xiL) * 0.65; mk(dX, innerTopY - 26, `${d}\"`);
          // E/H bottom return labels
          const eMidX = cx - aPx/2 + px(e)/2; mk(eMidX, yTop + blPx + 14, `${e}\"`);
          const hMidX = cx + aPx/2 - px(h)/2; mk(hMidX, yTop + brPx + 14, `${h}\"`);
          return;
        }
      };

      // Inline numeric inputs are disabled per request; clear any remnants and no-op.
      const renderInlineInputs = () =>{
        if (!inlineHost) return;
        inlineHost.innerHTML = '';
        return;
      };

  shapes.forEach((cur, idx)=>{
  const centerX = cur.pos?.x ?? 300;
  const centerY = cur.pos?.y ?? 300;
        const len = cur.len; const shape = cur.type; const rotation = cur.rot;
        // Helpers to convert local (unrotated, origin at center in viewBox units) to world
        const toWorld = (lx, ly) => {
          const rad=(rotation||0)*Math.PI/180; const cos=Math.cos(rad), sin=Math.sin(rad);
          return { x: centerX + lx*cos - ly*sin, y: centerY + lx*sin + ly*cos };
        };

        if (shape==='rect'){
          const w = px(len.A || 60);
          const h = px(len.B || 25);
          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

          // backsplash per side
          const bh = px(Number(opts.bsHeight||0));
      if (bh>0){
            ['A','B','C','D'].forEach(side=>{
              if (cur.bs[side]){
                const r = document.createElementNS(ns,'rect');
                if (side==='A'){ r.setAttribute('x', String(centerX - w/2)); r.setAttribute('y', String(centerY - h/2 - bh)); r.setAttribute('width', String(w)); r.setAttribute('height', String(bh)); }
                if (side==='B'){ r.setAttribute('x', String(centerX - w/2 - bh)); r.setAttribute('y', String(centerY - h/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(h)); }
                if (side==='C'){ r.setAttribute('x', String(centerX - w/2)); r.setAttribute('y', String(centerY + h/2)); r.setAttribute('width', String(w)); r.setAttribute('height', String(bh)); }
                if (side==='D'){ r.setAttribute('x', String(centerX + w/2)); r.setAttribute('y', String(centerY - h/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(h)); }
        r.setAttribute('fill', '#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r);
              }
            });
          }

          // main top surface with optional corner ops
          let useCorners = cur.rcCorners;
          if (!useCorners){
            const rect = document.createElementNS(ns, 'rect');
            rect.setAttribute('x', String(centerX - w/2)); rect.setAttribute('y', String(centerY - h/2)); rect.setAttribute('width', String(w)); rect.setAttribute('height', String(h)); rect.setAttribute('fill', '#f8c4a0'); rect.setAttribute('stroke', '#ccc'); rect.setAttribute('stroke-width', '2'); rotG.appendChild(rect);
          } else {
            const t = (k)=> Math.max(0, Number(useCorners[k]?.value||0))*2; // inches->px along edges
            const mTL = useCorners.TL?.mode||'square', mTR=useCorners.TR?.mode||'square', mBR=useCorners.BR?.mode||'square', mBL=useCorners.BL?.mode||'square';
            const TL = {mode:mTL, t:t('TL')}, TR={mode:mTR, t:t('TR')}, BR={mode:mBR, t:t('BR')}, BL={mode:mBL, t:t('BL')};
            const x0 = centerX - w/2, y0 = centerY - h/2, x1 = centerX + w/2, y1 = centerY + h/2;
            const pTL = {x:x0, y:y0}, pTR={x:x1,y:y0}, pBR={x:x1,y:y1}, pBL={x:x0,y:y1};
            const off = (pA,pB,t)=>{ const len=Math.hypot(pB.x-pA.x,pB.y-pA.y)||1; const ux=(pB.x-pA.x)/len, uy=(pB.y-pA.y)/len; return { x: pA.x + ux*t, y: pA.y + uy*t }; };
            const aTL = off(pTL,pTR, TL.t), bTL = off(pTL,pBL, TL.t);
            const aTR = off(pTR,pBR, TR.t), bTR = off(pTR,pTL, TR.t);
            const aBR = off(pBR,pBL, BR.t), bBR = off(pBR,pTR, BR.t);
            const aBL = off(pBL,pTL, BL.t), bBL = off(pBL,pBR, BL.t);
            const arcTo = (r, to)=> `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`;
            const d=[];
            // Start at top edge, after TL
            d.push(`M ${aTL.x} ${aTL.y}`);
            // Top edge to before TR
            d.push(`L ${bTR.x} ${bTR.y}`);
            // TR corner
            if (TR.mode==='radius'){ const r=TR.t/Math.tan(Math.PI/4)||0; d.push(arcTo(r, aTR)); } else if (TR.mode==='clip'){ d.push(`L ${aTR.x} ${aTR.y}`); }
            // Right edge to before BR
            d.push(`L ${bBR.x} ${bBR.y}`);
            // BR corner
            if (BR.mode==='radius'){ const r=BR.t/Math.tan(Math.PI/4)||0; d.push(arcTo(r, aBR)); } else if (BR.mode==='clip'){ d.push(`L ${aBR.x} ${aBR.y}`); }
            // Bottom edge to before BL
            d.push(`L ${bBL.x} ${bBL.y}`);
            // BL corner
            if (BL.mode==='radius'){ const r=BL.t/Math.tan(Math.PI/4)||0; d.push(arcTo(r, aBL)); } else if (BL.mode==='clip'){ d.push(`L ${aBL.x} ${aBL.y}`); }
            // Left edge to before TL
            d.push(`L ${bTL.x} ${bTL.y}`);
            // TL corner closing back to start
            if (TL.mode==='radius'){ const r=TL.t/Math.tan(Math.PI/4)||0; d.push(arcTo(r, aTL)); } else if (TL.mode==='clip'){ d.push(`L ${aTL.x} ${aTL.y}`); }
            d.push('Z');
            const p=document.createElementNS(ns,'path'); p.setAttribute('d', d.join(' ')); p.setAttribute('fill','#f8c4a0'); p.setAttribute('stroke','#ccc'); p.setAttribute('stroke-width','2'); rotG.appendChild(p);
          }

          // wall side overlays (red if against wall)
          const sideColor = '#d32f2f';
          const mkLine = (x1,y1,x2,y2)=>{ const l=document.createElementNS(ns,'line'); l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2); l.setAttribute('stroke', sideColor); l.setAttribute('stroke-width','3'); return l; };
          if (cur.wall.A) rotG.appendChild(mkLine(centerX - w/2, centerY - h/2, centerX + w/2, centerY - h/2));
          if (cur.wall.B) rotG.appendChild(mkLine(centerX - w/2, centerY - h/2, centerX - w/2, centerY + h/2));
          if (cur.wall.C) rotG.appendChild(mkLine(centerX - w/2, centerY + h/2, centerX + w/2, centerY + h/2));
          if (cur.wall.D) rotG.appendChild(mkLine(centerX + w/2, centerY - h/2, centerX + w/2, centerY + h/2));

          // seams (draw before highlight)
          if (opts.showSeams && Array.isArray(cur.seams)){
            cur.seams.forEach(seam=>{
              const line=document.createElementNS(ns,'line');
              if (seam.type==='v'){
                const x = centerX + px(seam.atIn||0);
                line.setAttribute('x1', String(x)); line.setAttribute('y1', String(centerY - h/2));
                line.setAttribute('x2', String(x)); line.setAttribute('y2', String(centerY + h/2));
              } else { // 'h'
                const y = centerY + px(seam.atIn||0);
                line.setAttribute('x1', String(centerX - w/2)); line.setAttribute('y1', String(y));
                line.setAttribute('x2', String(centerX + w/2)); line.setAttribute('y2', String(y));
              }
              line.setAttribute('stroke','#666'); line.setAttribute('stroke-width','2'); line.setAttribute('stroke-dasharray','6 6');
              rotG.appendChild(line);
            });
          }

          // active highlight
          if (idx===active){
            const hi = document.createElementNS(ns,'rect');
            hi.setAttribute('x', String(centerX - w/2 - 4));
            hi.setAttribute('y', String(centerY - h/2 - 4));
            hi.setAttribute('width', String(w + 8));
            hi.setAttribute('height', String(h + 8));
            hi.setAttribute('fill','none'); hi.setAttribute('stroke','#4f6bd8'); hi.setAttribute('stroke-width','2'); hi.setAttribute('stroke-dasharray','6 4');
            rotG.appendChild(hi);
          }

          // side guides sized to A (top) and B (left)
          const m=18;
          // top (A)
          drawGuideLine(rotG, centerX - w/2 + m, centerY - h/2 + m, centerX + w/2 - m, centerY - h/2 + m, 'A');
          // left (B)
          drawGuideLine(rotG, centerX - w/2 + m, centerY - h/2 + m, centerX - w/2 + m, centerY + h/2 - m, 'B');
          gRoot.appendChild(rotG);
          labelNumbers(rotG, centerX, centerY, cur, {A:len.A,B:len.B});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w, h, rot:rotation });
          if (idx===active){
            // local anchors relative to center, then convert
            const pTop = toWorld(0, -h/2);
            const pRight = toWorld(w/2, 0);
            const pLeft = toWorld(-w/2, 0);
            const pBottom = toWorld(0, h/2);
            addHandle(idx, pTop.x, pTop.y, 0, 'B-top');
            addHandle(idx, pRight.x, pRight.y, 0, 'A-right');
            addHandle(idx, pLeft.x, pLeft.y, 0, 'A-left');
            addHandle(idx, pBottom.x, pBottom.y, 0, 'B-bottom');
            // Corner size handles (midpoint of offset points)
            const rc = cur.rcCorners || {TL:{value:0},TR:{value:0},BR:{value:0},BL:{value:0}};
            const tpx=(k)=> Math.max(0, Number(rc[k]?.value||0))*2;
            const TLm = toWorld(-w/2 + tpx('TL')/2, -h/2 + tpx('TL')/2);
            const TRm = toWorld( w/2 - tpx('TR')/2, -h/2 + tpx('TR')/2);
            const BRm = toWorld( w/2 - tpx('BR')/2,  h/2 - tpx('BR')/2);
            const BLm = toWorld(-w/2 + tpx('BL')/2,  h/2 - tpx('BL')/2);
            addHandle(idx, TLm.x, TLm.y, 0, 'RC-TL');
            addHandle(idx, TRm.x, TRm.y, 0, 'RC-TR');
            addHandle(idx, BRm.x, BRm.y, 0, 'RC-BR');
            addHandle(idx, BLm.x, BLm.y, 0, 'RC-BL');
          }

  } else if (shape==='l'){
          // L as outer A x B minus inner notch sized by C (width) and D (height)
          let aIn = Number(len.A||60), bIn = Number(len.B||25), cIn = Number(len.C||20), dIn = Number(len.D||10);
          if (cIn >= aIn) cIn = Math.max(0, aIn - 1);
          if (dIn >= bIn) dIn = Math.max(0, bIn - 1);
          const a = px(aIn), b = px(bIn), c = px(cIn), d = px(dIn);
          const x = centerX - a/2, y = centerY - b/2;
          const flipX = !!cur.flipX;
          // Inner removal rectangle anchors to right (default) or left (when flipped)
          const xi = flipX ? (centerX - a/2) : (centerX - a/2 + c);
          const yi = centerY - b/2 + d;
          const wi = a - c;
          const hi = b - d;
          const path = document.createElementNS(ns, 'path');
          // Build outer path with optional corner operations
          let outerD = '';
          if (!cur.rcCorners){
            outerD = `M ${x} ${y} h ${a} v ${b} h ${-a} Z`;
          } else {
            const rc = cur.rcCorners || {};
            const t = (k)=> Math.max(0, Number(rc[k]?.value||0)) * 2; // inches->px along edges
            const TL = { mode: (rc.TL?.mode)||'square', t: t('TL') };
            const TR = { mode: (rc.TR?.mode)||'square', t: t('TR') };
            const BR = { mode: (rc.BR?.mode)||'square', t: t('BR') };
            const BL = { mode: (rc.BL?.mode)||'square', t: t('BL') };
            const pTL = { x:x,     y:y };
            const pTR = { x:x + a, y:y };
            const pBR = { x:x + a, y:y + b };
            const pBL = { x:x,     y:y + b };
            const off = (pA,pB,dist)=>{ const L=Math.hypot(pB.x-pA.x,pB.y-pA.y)||1; const ux=(pB.x-pA.x)/L, uy=(pB.y-pA.y)/L; return { x: pA.x + ux*dist, y: pA.y + uy*dist }; };
            const aTL = off(pTL,pTR, TL.t), bTL = off(pTL,pBL, TL.t);
            const aTR = off(pTR,pBR, TR.t), bTR = off(pTR,pTL, TR.t);
            const aBR = off(pBR,pBL, BR.t), bBR = off(pBR,pTR, BR.t);
            const aBL = off(pBL,pTL, BL.t), bBL = off(pBL,pBR, BL.t);
            const arc = (r, to)=> `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`; // outside sweep
            const dSeg=[];
            // Start on top edge after TL
            dSeg.push(`M ${aTL.x} ${aTL.y}`);
            // Top edge to before TR
            dSeg.push(`L ${bTR.x} ${bTR.y}`);
            // TR corner
            if (TR.mode==='radius'){ const r=TR.t/Math.tan(Math.PI/4)||0; dSeg.push(arc(r, aTR)); } else if (TR.mode==='clip'){ dSeg.push(`L ${aTR.x} ${aTR.y}`); }
            // Right edge to before BR
            dSeg.push(`L ${bBR.x} ${bBR.y}`);
            // BR corner
            if (BR.mode==='radius'){ const r=BR.t/Math.tan(Math.PI/4)||0; dSeg.push(arc(r, aBR)); } else if (BR.mode==='clip'){ dSeg.push(`L ${aBR.x} ${aBR.y}`); }
            // Bottom edge to before BL
            dSeg.push(`L ${bBL.x} ${bBL.y}`);
            // BL corner
            if (BL.mode==='radius'){ const r=BL.t/Math.tan(Math.PI/4)||0; dSeg.push(arc(r, aBL)); } else if (BL.mode==='clip'){ dSeg.push(`L ${aBL.x} ${aBL.y}`); }
            // Left edge to before TL
            dSeg.push(`L ${bTL.x} ${bTL.y}`);
            // TL corner back to start
            if (TL.mode==='radius'){ const r=TL.t/Math.tan(Math.PI/4)||0; dSeg.push(arc(r, aTL)); } else if (TL.mode==='clip'){ dSeg.push(`L ${aTL.x} ${aTL.y}`); }
            dSeg.push('Z');
            outerD = dSeg.join(' ');
          }
          // Build inner notch rectangle with optional inside-corner ops
          let innerD = '';
          const ic = cur.icCorners || { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
          // For classic L-notch, only iTL and iBR are visible; others default to square
          const it = (k)=> Math.max(0, Number(ic[k]?.value||0)) * 2;
          const I_TL = { mode:(ic.iTL?.mode)||'square', t:it('iTL') };
          const I_TR = { mode:(ic.iTR?.mode)||'square', t:it('iTR') };
          const I_BR = { mode:(ic.iBR?.mode)||'square', t:it('iBR') };
          const I_BL = { mode:(ic.iBL?.mode)||'square', t:it('iBL') };
          const ipTL={x:xi,y:yi}, ipTR={x:xi+wi,y:yi}, ipBR={x:xi+wi,y:yi+hi}, ipBL={x:xi,y:yi+hi};
          const offI=(pA,pB,dist)=>{ const L=Math.hypot(pB.x-pA.x,pB.y-pA.y)||1; const ux=(pB.x-pA.x)/L, uy=(pB.y-pA.y)/L; return { x:pA.x+ux*dist, y:pA.y+uy*dist }; };
          const iaTL=offI(ipTL,ipTR,I_TL.t), ibTL=offI(ipTL,ipBL,I_TL.t);
          const iaTR=offI(ipTR,ipBR,I_TR.t), ibTR=offI(ipTR,ipTL,I_TR.t);
          const iaBR=offI(ipBR,ipBL,I_BR.t), ibBR=offI(ipBR,ipTR,I_BR.t);
          const iaBL=offI(ipBL,ipTL,I_BL.t), ibBL=offI(ipBL,ipBR,I_BL.t);
          const arcI=(r,to)=> `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`; // sweep outward relative to hole
          const dI=[];
          dI.push(`M ${iaTL.x} ${iaTL.y}`);
          dI.push(`L ${ibTR.x} ${ibTR.y}`);
          if (I_TR.mode==='radius'){ const r=I_TR.t/Math.tan(Math.PI/4)||0; dI.push(arcI(r, iaTR)); } else if (I_TR.mode==='clip'){ dI.push(`L ${iaTR.x} ${iaTR.y}`); }
          dI.push(`L ${ibBR.x} ${ibBR.y}`);
          if (I_BR.mode==='radius'){ const r=I_BR.t/Math.tan(Math.PI/4)||0; dI.push(arcI(r, iaBR)); } else if (I_BR.mode==='clip'){ dI.push(`L ${iaBR.x} ${iaBR.y}`); }
          dI.push(`L ${ibBL.x} ${ibBL.y}`);
          if (I_BL.mode==='radius'){ const r=I_BL.t/Math.tan(Math.PI/4)||0; dI.push(arcI(r, iaBL)); } else if (I_BL.mode==='clip'){ dI.push(`L ${iaBL.x} ${iaBL.y}`); }
          dI.push(`L ${ibTL.x} ${ibTL.y}`);
          if (I_TL.mode==='radius'){ const r=I_TL.t/Math.tan(Math.PI/4)||0; dI.push(arcI(r, iaTL)); } else if (I_TL.mode==='clip'){ dI.push(`L ${iaTL.x} ${iaTL.y}`); }
          dI.push('Z');
          innerD = dI.join(' ');
          const dPath = `${outerD} ${innerD}`;
          path.setAttribute('d', dPath);
          path.setAttribute('fill', '#f8c4a0');
          path.setAttribute('fill-rule', 'evenodd');
          path.setAttribute('stroke', '#ccc');
          path.setAttribute('stroke-width', '2');
          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

          // backsplash precise for L: A full top, B full left, C bottom segment length=c, D right-top segment length=d (mirrors with flipX)
          { const bh = px(Number(opts.bsHeight||0)); if (opts.bsOn && bh>0){
              const addRect=(x,y,w,h)=>{ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(x)); r.setAttribute('y', String(y)); r.setAttribute('width', String(w)); r.setAttribute('height', String(h)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); };
              if (cur.bs.A){ addRect(centerX - a/2, centerY - b/2 - bh, a, bh); }
              if (cur.bs.B){ addRect(centerX - a/2 - bh, centerY - b/2, bh, b); }
              if (cur.bs.C){
                if (!flipX){
                  // left bottom segment from left outer to notch start (length=c)
                  addRect(centerX - a/2, centerY + b/2, c, bh);
                } else {
                  // right bottom segment from notch start to right outer (length=c)
                  addRect(centerX + a/2 - c, centerY + b/2, c, bh);
                }
              }
              if (cur.bs.D){
                if (!flipX){
                  // top segment on right edge, height=d
                  addRect(centerX + a/2, centerY - b/2, bh, d);
                } else {
                  // top segment on left edge, height=d
                  addRect(centerX - a/2 - bh, centerY - b/2, bh, d);
                }
              }
          } }
          // seams for L (bounding-box approximation)
          if (opts.showSeams && Array.isArray(cur.seams)){
            cur.seams.forEach(seam=>{
              const line=document.createElementNS(ns,'line');
              if (seam.type==='v'){
                const x = centerX + px(seam.atIn||0);
                line.setAttribute('x1', String(x)); line.setAttribute('y1', String(centerY - b/2));
                line.setAttribute('x2', String(x)); line.setAttribute('y2', String(centerY + b/2));
              } else {
                const y = centerY + px(seam.atIn||0);
                line.setAttribute('x1', String(centerX - a/2)); line.setAttribute('y1', String(y));
                line.setAttribute('x2', String(centerX + a/2)); line.setAttribute('y2', String(y));
              }
              line.setAttribute('stroke','#666'); line.setAttribute('stroke-width','2'); line.setAttribute('stroke-dasharray','6 6');
              rotG.appendChild(line);
            });
          }

          rotG.appendChild(path);
          // wall sides (approx bounding box)
          const sideColor = '#d32f2f';
          const mkLine = (x1,y1,x2,y2)=>{ const l=document.createElementNS(ns,'line'); l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2); l.setAttribute('stroke', sideColor); l.setAttribute('stroke-width','3'); return l; };
          if (cur.wall.A) rotG.appendChild(mkLine(centerX - a/2, centerY - b/2, centerX + a/2, centerY - b/2));
          if (cur.wall.B) rotG.appendChild(mkLine(centerX - a/2, centerY - b/2, centerX - a/2, centerY + b/2));
          if (cur.wall.C) rotG.appendChild(mkLine(centerX - a/2, centerY + b/2, centerX + a/2, centerY + b/2));
          if (cur.wall.D) rotG.appendChild(mkLine(centerX + a/2, centerY - b/2, centerX + a/2, centerY + b/2));

          if (idx===active){
            const hi = document.createElementNS(ns,'rect');
            hi.setAttribute('x', String(centerX - a/2 - 4));
            hi.setAttribute('y', String(centerY - b/2 - 4));
            hi.setAttribute('width', String(a + 8));
            hi.setAttribute('height', String(b + 8));
            hi.setAttribute('fill','none'); hi.setAttribute('stroke','#4f6bd8'); hi.setAttribute('stroke-width','2'); hi.setAttribute('stroke-dasharray','6 4');
            rotG.appendChild(hi);
          }

          // L-guides for A(top), B(side mirror-aware), C(bottom inner run), D(right/left outer segment)
          const m=18;
          // A top full width
          drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX + a/2 - m, centerY - b/2 + m, 'A');
          // B full height: left by default, right when flipped
          if (!flipX){
            drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX - a/2 + m, centerY + b/2 - m, 'B');
          } else {
            drawGuideLine(rotG, centerX + a/2 - m, centerY - b/2 + m, centerX + a/2 - m, centerY + b/2 - m, 'B');
          }
          // C bottom inner run to notch start (mirrors when flipped)
          if (!flipX){
            drawGuideLine(rotG, centerX - a/2 + m, centerY + b/2 - m, centerX - a/2 + c - m, centerY + b/2 - m, 'C');
          } else {
            drawGuideLine(rotG, centerX + a/2 - c + m, centerY + b/2 - m, centerX + a/2 - m, centerY + b/2 - m, 'C');
          }
          // D inner vertical length shown on the adjacent outer edge segment only
          if (!flipX){
            // Notch on right: D is top segment on right outer edge, length = d
            drawGuideLine(rotG, centerX + a/2 - m, centerY - b/2 + m, centerX + a/2 - m, centerY - b/2 + d - m, 'D');
          } else {
            // Notch on left: D is top segment on left outer edge, length = d
            drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX - a/2 + m, centerY - b/2 + d - m, 'D');
          }
          gRoot.appendChild(rotG);
          labelNumbers(rotG, centerX, centerY, cur, {A:aIn,B:bIn});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w:a, h:b, rot:rotation });
          if (idx===active){
            // Outer handles via local anchors
            addHandle(idx, toWorld(0, -b/2).x, toWorld(0, -b/2).y, 0, 'B-top');
            addHandle(idx, toWorld(a/2, 0).x, toWorld(a/2, 0).y, 0, 'A-right');
            addHandle(idx, toWorld(-a/2, 0).x, toWorld(-a/2, 0).y, 0, 'A-left');
            addHandle(idx, toWorld(0, b/2).x, toWorld(0, b/2).y, 0, 'B-bottom');
            // L-shape inner handles: C bottom inner run midpoint, D outer edge top segment midpoint
            const ciLocalX = !flipX ? (-a/2 + c/2) : (a/2 - c/2);
            const cP = toWorld(ciLocalX, b/2);
            addHandle(idx, cP.x, cP.y, 0, 'C');
            const dYlocal = -b/2 + d/2; const dXlocal = !flipX ? (a/2) : (-a/2);
            const dP = toWorld(dXlocal, dYlocal);
            addHandle(idx, dP.x, dP.y, 0, 'D');
            // Corner size handles for L (outer rect corners)
            const rc = cur.rcCorners || {TL:{value:0},TR:{value:0},BR:{value:0},BL:{value:0}};
            const tpx=(k)=> Math.max(0, Number(rc[k]?.value||0))*2;
            const TLm = toWorld(-a/2 + tpx('TL')/2, -b/2 + tpx('TL')/2);
            const TRm = toWorld( a/2 - tpx('TR')/2, -b/2 + tpx('TR')/2);
            const BRm = toWorld( a/2 - tpx('BR')/2,  b/2 - tpx('BR')/2);
            const BLm = toWorld(-a/2 + tpx('BL')/2,  b/2 - tpx('BL')/2);
            addHandle(idx, TLm.x, TLm.y, 0, 'RC-TL');
            addHandle(idx, TRm.x, TRm.y, 0, 'RC-TR');
            addHandle(idx, BRm.x, BRm.y, 0, 'RC-BR');
            addHandle(idx, BLm.x, BLm.y, 0, 'RC-BL');
            // Inside-corner handles for L (iTL and iBR)
            const icC = cur.icCorners || { iTL:{value:0}, iBR:{value:0} };
            const itpx=(k)=> Math.max(0, Number(icC[k]?.value||0)) * 2;
            const iTLm = toWorld(-a/2 + c/2 + itpx('iTL')/2, -b/2 + d/2 + itpx('iTL')/2);
            const iBRm = toWorld( a/2 - itpx('iBR')/2,  b/2 - itpx('iBR')/2);
            addHandle(idx, iTLm.x, iTLm.y, 0, 'IC-TL');
            addHandle(idx, iBRm.x, iBRm.y, 0, 'IC-BR');
          }

  } else if (shape==='u'){
          // U with independent side depths: BL (left), BR (right)
          let aIn = Number(len.A||60);
          let blIn = Number((len.BL!=null ? len.BL : (len.B!=null ? len.B : 25)));
          let brIn = Number((len.BR!=null ? len.BR : (len.B!=null ? len.B : 25)));
          let dIn = Number(len.D||10);
          let eIn = Number(len.E != null ? len.E :  Math.round((aIn - (len.C||20))/2));
          let hIn = Number(len.H != null ? len.H :  Math.round((aIn - (len.C||20))/2));
          // clamp independently
          if (blIn < 1) blIn = 1; if (brIn < 1) brIn = 1;
          const minSide = Math.min(blIn, brIn);
          if (dIn < 0) dIn = 0; if (dIn > minSide - 1) dIn = minSide - 1;
          // compute local clamped values (do not mutate stored lengths here)
          const eMax = Math.max(0, aIn - 1 - Math.max(0,hIn));
          const hMaxRet = Math.max(0, aIn - 1 - Math.max(0,eIn));
          let eLocal = Math.min(Math.max(eIn,0), eMax);
          let hLocal = Math.min(Math.max(hIn,0), hMaxRet);
          // enforce a minimum inner width of 1 inch
          const minSpan = 1;
          if (eLocal + hLocal > aIn - minSpan){
            const over = (eLocal + hLocal) - (aIn - minSpan);
            if (hLocal >= eLocal) hLocal = Math.max(0, hLocal - over); else eLocal = Math.max(0, eLocal - over);
          }
          // derived C used only for rendering
          const cIn = Math.max(1, aIn - (eLocal + hLocal));
          const a = px(aIn);
          const blPx = px(blIn), brPx = px(brIn);
          // If legs differ, auto-zero bottom inside corners to avoid stale values
          if (blIn !== brIn){
            cur.icCorners = cur.icCorners || { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
            cur.icCorners.iBL = { mode:'square', value:0 };
            cur.icCorners.iBR = { mode:'square', value:0 };
          }
          const hMax = Math.max(blPx, brPx);
          const x = centerX - a/2;
          const yTop = centerY - hMax/2;
          // inner notch polygon (verticals extend to bottom)
          const xiL = x + px(eLocal);                // left inner x
          const xiR = x + px(aIn - hLocal);          // right inner x
          const yInnerTop = yTop + px(dIn);          // inner top y
          const yBotL = yTop + blPx;                 // left vertical bottom (outer)
          const yBotR = yTop + brPx;                 // right vertical bottom (outer)
          // Inner bottom aligns to the shallower leg so each side ends at its own depth
          const yInnerBottom = yTop + Math.min(blPx, brPx);

          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

  // backsplash along U edges with precise segments: A top full; BL/BR sides to each depth; C inner top; E/H returns (no D on U)
  { const aBox=a; const bh = px(Number(opts.bsHeight||0)); if (opts.bsOn && bh>0){
        // A top
        if (cur.bs.A){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(yTop - bh)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
        // BL/BR sides toggles independently
        if (cur.bs.BL){
          const rL=document.createElementNS(ns,'rect'); rL.setAttribute('x', String(centerX - aBox/2 - bh)); rL.setAttribute('y', String(yTop)); rL.setAttribute('width', String(bh)); rL.setAttribute('height', String(blPx)); rL.setAttribute('fill','#e6f2ff'); rL.setAttribute('stroke','#7fb3ff'); rL.setAttribute('stroke-width','1'); rotG.appendChild(rL);
        }
        if (cur.bs.BR){
          const rR=document.createElementNS(ns,'rect'); rR.setAttribute('x', String(centerX + aBox/2)); rR.setAttribute('y', String(yTop)); rR.setAttribute('width', String(bh)); rR.setAttribute('height', String(brPx)); rR.setAttribute('fill','#e6f2ff'); rR.setAttribute('stroke','#7fb3ff'); rR.setAttribute('stroke-width','1'); rotG.appendChild(rR);
        }
        // C inner top opening (xiL..xiR)
        if (cur.bs.C){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(xiL)); r.setAttribute('y', String(yInnerTop)); r.setAttribute('width', String(xiR - xiL)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
    // E (bottom left return) and H (bottom right return) precise lengths
              if (cur.bs && (cur.bs.E || cur.bs.H)){
                const eLen = px(Math.max(0, Number(len.E||0)));
                const hLen = px(Math.max(0, Number(len.H||0)));
                // world coords for returns along bottom outer edge
                if (cur.bs.E && eLen>0){
                  const rE = document.createElementNS(ns,'rect');
      rE.setAttribute('x', String(centerX - a/2));
      rE.setAttribute('y', String(yTop + blPx));
                  rE.setAttribute('width', String(eLen));
                  rE.setAttribute('height', String(bh));
                  rE.setAttribute('fill','#e6f2ff'); rE.setAttribute('stroke','#7fb3ff'); rE.setAttribute('stroke-width','1');
                  rotG.appendChild(rE);
                }
                if (cur.bs.H && hLen>0){
                  const rH = document.createElementNS(ns,'rect');
      rH.setAttribute('x', String(centerX + a/2 - hLen));
      rH.setAttribute('y', String(yTop + brPx));
                  rH.setAttribute('width', String(hLen));
                  rH.setAttribute('height', String(bh));
                  rH.setAttribute('fill','#e6f2ff'); rH.setAttribute('stroke','#7fb3ff'); rH.setAttribute('stroke-width','1');
                  rotG.appendChild(rH);
                }
              }
          } }
      // seams for U (bounding-box approximation)
          if (opts.showSeams && Array.isArray(cur.seams)){
            cur.seams.forEach(seam=>{
              const line=document.createElementNS(ns,'line');
              if (seam.type==='v'){
                const x = centerX + px(seam.atIn||0);
        line.setAttribute('x1', String(x)); line.setAttribute('y1', String(yTop));
        line.setAttribute('x2', String(x)); line.setAttribute('y2', String(yTop + hMax));
              } else {
        const y = yTop + px(seam.atIn||0);
        line.setAttribute('x1', String(centerX - a/2)); line.setAttribute('y1', String(y));
        line.setAttribute('x2', String(centerX + a/2)); line.setAttribute('y2', String(y));
              }
              line.setAttribute('stroke','#666'); line.setAttribute('stroke-width','2'); line.setAttribute('stroke-dasharray','6 6');
              rotG.appendChild(line);
            });
          }
    // U shape as a single path: outer rounded rect (rcCorners) minus inner opening (even-odd)
    const uPath = document.createElementNS(ns,'path');
    const x0 = x, y0 = yTop, x1 = x + a, y1 = yTop + hMax; // outer box
    // Build rounded outer rectangle path using rcCorners (similar to Rect/L)
    const rc = cur.rcCorners || {};
    const t = (k)=> Math.max(0, Number(rc[k]?.value||0)) * 2; // inches->px
    const C_TL = { mode:(rc.TL?.mode)||'square', t:t('TL') };
    const C_TR = { mode:(rc.TR?.mode)||'square', t:t('TR') };
    const C_BR = { mode:(rc.BR?.mode)||'square', t:t('BR') };
    const C_BL = { mode:(rc.BL?.mode)||'square', t:t('BL') };
    const pTL = {x:x0,y:y0}, pTR={x:x1,y:y0}, pBR={x:x1,y:y1}, pBL={x:x0,y:y1};
    const off=(pA,pB,dist)=>{ const L=Math.hypot(pB.x-pA.x,pB.y-pA.y)||1; const ux=(pB.x-pA.x)/L, uy=(pB.y-pA.y)/L; return { x:pA.x+ux*dist, y:pA.y+uy*dist }; };
    const aTL=off(pTL,pTR,C_TL.t), bTL=off(pTL,pBL,C_TL.t);
    const aTR=off(pTR,pBR,C_TR.t), bTR=off(pTR,pTL,C_TR.t);
    const aBR=off(pBR,pBL,C_BR.t), bBR=off(pBR,pTR,C_BR.t);
    const aBL=off(pBL,pTL,C_BL.t), bBL=off(pBL,pBR,C_BL.t);
  const arc=(r,to)=> `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`;
  const outer=[];
  // Start at top edge after TL
  outer.push(`M ${aTL.x} ${aTL.y}`);
  // Top edge to before TR
  outer.push(`L ${bTR.x} ${bTR.y}`);
  // TR corner
  if (C_TR.mode==='radius'){ const r=C_TR.t/Math.tan(Math.PI/4)||0; outer.push(arc(r,aTR)); } else if (C_TR.mode==='clip'){ outer.push(`L ${aTR.x} ${aTR.y}`); }
  // Right edge to before BR
  outer.push(`L ${bBR.x} ${bBR.y}`);
  // BR corner
  if (C_BR.mode==='radius'){ const r=C_BR.t/Math.tan(Math.PI/4)||0; outer.push(arc(r,aBR)); } else if (C_BR.mode==='clip'){ outer.push(`L ${aBR.x} ${aBR.y}`); }
  // Bottom edge to before BL
  outer.push(`L ${bBL.x} ${bBL.y}`);
  // BL corner
  if (C_BL.mode==='radius'){ const r=C_BL.t/Math.tan(Math.PI/4)||0; outer.push(arc(r,aBL)); } else if (C_BL.mode==='clip'){ outer.push(`L ${aBL.x} ${aBL.y}`); }
  // Left edge to before TL
  outer.push(`L ${bTL.x} ${bTL.y}`);
  // TL corner back to start
  if (C_TL.mode==='radius'){ const r=C_TL.t/Math.tan(Math.PI/4)||0; outer.push(arc(r,aTL)); } else if (C_TL.mode==='clip'){ outer.push(`L ${aTL.x} ${aTL.y}`); }
  outer.push('Z');
    // Build inner opening with inside-corner ops
  // Build inner opening with inside-corner ops
  const ic = cur.icCorners || { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
  const innerW = Math.max(0, xiR - xiL);
  const innerH = Math.max(0, yInnerBottom - yInnerTop);
  const tMaxPx = Math.max(0, Math.min(innerW/2, innerH/2));
  const it=(k)=> Math.min(Math.max(0, Number(ic[k]?.value||0))*2, tMaxPx);
  const I_TL={mode:(ic.iTL?.mode)||'square', t:it('iTL')};
  const I_TR={mode:(ic.iTR?.mode)||'square', t:it('iTR')};
  let I_BR={mode:(ic.iBR?.mode)||'square', t:it('iBR')};
  let I_BL={mode:(ic.iBL?.mode)||'square', t:it('iBL')};
  // If the inner bottom is truncated (true U), suppress bottom inner radiuses
  if (yInnerBottom < (yTop + hMax - 0.001)){
    I_BR = { mode:'square', t:0 };
    I_BL = { mode:'square', t:0 };
  }
  const ipTL={x:xiL,y:yInnerTop}, ipTR={x:xiR,y:yInnerTop}, ipBR={x:xiR,y:yInnerBottom}, ipBL={x:xiL,y:yInnerBottom};
  const offI=(pA,pB,dist)=>{ const L=Math.hypot(pB.x-pA.x,pB.y-pA.y)||1; const ux=(pB.x-pA.x)/L, uy=(pB.y-pA.y)/L; return { x:pA.x+ux*dist, y:pA.y+uy*dist }; };
  const iaTL=offI(ipTL,ipTR,I_TL.t), ibTL=offI(ipTL,ipBL,I_TL.t);
  const iaTR=offI(ipTR,ipBR,I_TR.t), ibTR=offI(ipTR,ipTL,I_TR.t);
  const iaBR=offI(ipBR,ipBL,I_BR.t), ibBR=offI(ipBR,ipTR,I_BR.t);
  const iaBL=offI(ipBL,ipTL,I_BL.t), ibBL=offI(ipBL,ipBR,I_BL.t);
  const arcI=(r,to)=> `A ${r} ${r} 0 0 1 ${to.x} ${to.y}`;
  const inner=[];
  inner.push(`M ${iaTL.x} ${iaTL.y}`);
  inner.push(`L ${ibTR.x} ${ibTR.y}`);
  if (I_TR.mode==='radius'){ const r=I_TR.t/Math.tan(Math.PI/4)||0; inner.push(arcI(r, iaTR)); } else if (I_TR.mode==='clip'){ inner.push(`L ${iaTR.x} ${iaTR.y}`); }
  inner.push(`L ${ibBR.x} ${ibBR.y}`);
  if (I_BR.mode==='radius'){ const r=I_BR.t/Math.tan(Math.PI/4)||0; inner.push(arcI(r, iaBR)); } else if (I_BR.mode==='clip'){ inner.push(`L ${iaBR.x} ${iaBR.y}`); }
  inner.push(`L ${ibBL.x} ${ibBL.y}`);
  if (I_BL.mode==='radius'){ const r=I_BL.t/Math.tan(Math.PI/4)||0; inner.push(arcI(r, iaBL)); } else if (I_BL.mode==='clip'){ inner.push(`L ${iaBL.x} ${iaBL.y}`); }
  inner.push(`L ${ibTL.x} ${ibTL.y}`);
  if (I_TL.mode==='radius'){ const r=I_TL.t/Math.tan(Math.PI/4)||0; inner.push(arcI(r, iaTL)); } else if (I_TL.mode==='clip'){ inner.push(`L ${iaTL.x} ${iaTL.y}`); }
  inner.push('Z');
  // Subtract the extra bottom overhang below each leg so the outer fill
  // does not extend to the deeper side's depth.
  if (blPx < hMax){
    inner.push(`M ${x} ${yTop + blPx}`);           // left outer bottom start
    inner.push(`L ${xiL} ${yTop + blPx}`);         // to notch start
    inner.push(`L ${xiL} ${yTop + hMax}`);         // down to outer bbox bottom
    inner.push(`L ${x} ${yTop + hMax}`);           // back to left outer bbox bottom
    inner.push('Z');
  }
  if (brPx < hMax){
    inner.push(`M ${xiR} ${yTop + brPx}`);         // notch end on right
    inner.push(`L ${x + a} ${yTop + brPx}`);       // to right outer bottom
    inner.push(`L ${x + a} ${yTop + hMax}`);       // down to outer bbox bottom
    inner.push(`L ${xiR} ${yTop + hMax}`);         // back to notch x
    inner.push('Z');
  }
  // Central strip under the inner bottom (between legs) — remove it
  if (yInnerBottom < yTop + hMax){
    inner.push(`M ${xiL} ${yInnerBottom}`);
    inner.push(`L ${xiR} ${yInnerBottom}`);
    inner.push(`L ${xiR} ${yTop + hMax}`);
    inner.push(`L ${xiL} ${yTop + hMax}`);
    inner.push('Z');
  }
  uPath.setAttribute('d', `${outer.join(' ')} ${inner.join(' ')}`);
    uPath.setAttribute('fill', '#f8c4a0');
    uPath.setAttribute('fill-rule', 'evenodd');
    uPath.setAttribute('stroke', '#ccc');
    uPath.setAttribute('stroke-width', '2');
    rotG.appendChild(uPath);

          // backsplash along U edges (render above countertop)
          { const aBox=a; const bh = px(Number(opts.bsHeight||0)); if (opts.bsOn && bh>0){
            if (cur.bs.A){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(yTop - bh)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
            if (cur.bs.BL){ const rL=document.createElementNS(ns,'rect'); rL.setAttribute('x', String(centerX - aBox/2 - bh)); rL.setAttribute('y', String(yTop)); rL.setAttribute('width', String(bh)); rL.setAttribute('height', String(blPx)); rL.setAttribute('fill','#e6f2ff'); rL.setAttribute('stroke','#7fb3ff'); rL.setAttribute('stroke-width','1'); rotG.appendChild(rL); }
            if (cur.bs.BR){ const rR=document.createElementNS(ns,'rect'); rR.setAttribute('x', String(centerX + aBox/2)); rR.setAttribute('y', String(yTop)); rR.setAttribute('width', String(bh)); rR.setAttribute('height', String(brPx)); rR.setAttribute('fill','#e6f2ff'); rR.setAttribute('stroke','#7fb3ff'); rR.setAttribute('stroke-width','1'); rotG.appendChild(rR); }
            if (cur.bs.C){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(xiL)); r.setAttribute('y', String(yInnerTop)); r.setAttribute('width', String(xiR - xiL)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
            if (cur.bs && (cur.bs.E || cur.bs.H)){
              const eLen = px(Math.max(0, Number(len.E||0)));
              const hLen = px(Math.max(0, Number(len.H||0)));
              if (cur.bs.E && eLen>0){ const rE = document.createElementNS(ns,'rect'); rE.setAttribute('x', String(centerX - a/2)); rE.setAttribute('y', String(yTop + blPx)); rE.setAttribute('width', String(eLen)); rE.setAttribute('height', String(bh)); rE.setAttribute('fill','#e6f2ff'); rE.setAttribute('stroke','#7fb3ff'); rE.setAttribute('stroke-width','1'); rotG.appendChild(rE); }
              if (cur.bs.H && hLen>0){ const rH = document.createElementNS(ns,'rect'); rH.setAttribute('x', String(centerX + a/2 - hLen)); rH.setAttribute('y', String(yTop + brPx)); rH.setAttribute('width', String(hLen)); rH.setAttribute('height', String(bh)); rH.setAttribute('fill','#e6f2ff'); rH.setAttribute('stroke','#7fb3ff'); rH.setAttribute('stroke-width','1'); rotG.appendChild(rH); }
            }
          } }

          // wall sides as red lines along outer perimeter; split bottom into left/right, not across opening
          const sideColor = '#d32f2f';
          const mkLine = (x1,y1,x2,y2)=>{ const l=document.createElementNS(ns,'line'); l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',x2); l.setAttribute('y2',y2); l.setAttribute('stroke', sideColor); l.setAttribute('stroke-width','3'); return l; };
      if (cur.wall.A) rotG.appendChild(mkLine(centerX - a/2, yTop, centerX + a/2, yTop));
      if (cur.wall.B) rotG.appendChild(mkLine(centerX - a/2, yTop, centerX - a/2, yTop + blPx));
      if (cur.wall.C){
        // left bottom to xiL
        rotG.appendChild(mkLine(centerX - a/2, yTop + blPx, xiL, yTop + blPx));
        // right bottom from xiR
        rotG.appendChild(mkLine(xiR, yTop + brPx, centerX + a/2, yTop + brPx));
      }
      if (cur.wall.D) rotG.appendChild(mkLine(centerX + a/2, yTop, centerX + a/2, yTop + brPx));

          if (idx===active){
            const hi = document.createElementNS(ns,'rect');
            hi.setAttribute('x', String(centerX - a/2 - 4));
            hi.setAttribute('y', String(yTop - 4));
            hi.setAttribute('width', String(a + 8));
            hi.setAttribute('height', String(hMax + 8));
            hi.setAttribute('fill','none'); hi.setAttribute('stroke','#4f6bd8'); hi.setAttribute('stroke-width','2'); hi.setAttribute('stroke-dasharray','6 4');
            rotG.appendChild(hi);
          }

          // U-guides for A–H (with BL/BR)
          const m=18;
          // A top outer
          drawGuideLine(rotG, centerX - a/2 + m, yTop + m, centerX + a/2 - m, yTop + m, 'A');
          // B-L left outer
          drawGuideLine(rotG, centerX - a/2 + m, yTop + m, centerX - a/2 + m, yTop + blPx - m, 'B-L');
          // B-R right outer
          drawGuideLine(rotG, centerX + a/2 - m, yTop + m, centerX + a/2 - m, yTop + brPx - m, 'B-R');
          // Use existing xiL/xiR/yTop to draw C/D/E/H guides (F/G removed)
          // C inner top opening
          drawGuideLine(rotG, xiL + m, yInnerTop + m, xiR - m, yInnerTop + m, 'C');
          // D inner depth (using center of opening)
          drawGuideLine(rotG, (xiL+xiR)/2, yTop + m, (xiL+xiR)/2, yInnerTop - m, 'D');
          // E bottom left return
          drawGuideLine(rotG, centerX - a/2 + m, yTop + blPx - m, xiL - m, yTop + blPx - m, 'E');
          // H bottom right return
          drawGuideLine(rotG, xiR + m, yTop + brPx - m, centerX + a/2 - m, yTop + brPx - m, 'H');
          gRoot.appendChild(rotG);
          labelNumbers(rotG, centerX, centerY, cur, {A:aIn,BL:blIn,BR:brIn,C:cIn,D:dIn});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w:a, h:Math.max(blPx, brPx), rot:rotation });
          if (idx===active){
            // outer A/B like rect using local anchors
            // top handle remains for panning vertically (no resize)
            addHandle(idx, toWorld(a/2, 0).x, toWorld(a/2, 0).y, 0, 'A-right');
            addHandle(idx, toWorld(-a/2, 0).x, toWorld(-a/2, 0).y, 0, 'A-left');
            // independent side-depth handles at each side bottom midpoint
            const wBL = toWorld(-a/2, (-hMax/2) + blPx);
            const wBR = toWorld(a/2, (-hMax/2) + brPx);
            addHandle(idx, wBL.x, wBL.y, 0, 'BL');
            addHandle(idx, wBR.x, wBR.y, 0, 'BR');
            // inner spans in local coords
            const xiLhLocal = -a/2 + px(eIn);
            const xiRhLocal =  a/2 - px(hIn);
            const yiLocal = -hMax/2 + px(dIn);
            const midXLocal = (xiLhLocal + xiRhLocal)/2;
            const pC = toWorld(midXLocal, yiLocal);
            addHandle(idx, pC.x, pC.y, 0, 'C');
            // D at the same inner-top midpoint
            addHandle(idx, pC.x, pC.y, 0, 'D');
            // E and H: midpoints of bottom returns
            const pE = toWorld(-a/2 + px(eIn)/2, hMax/2);
            const pH = toWorld( a/2 - px(hIn)/2, hMax/2);
            addHandle(idx, pE.x, pE.y, 0, 'E');
            addHandle(idx, pH.x, pH.y, 0, 'H');
            // Corner size handles for U (outer box corners)
            const rc = cur.rcCorners || {TL:{value:0},TR:{value:0},BR:{value:0},BL:{value:0}};
            const tpx=(k)=> Math.max(0, Number(rc[k]?.value||0))*2;
            const TLm = toWorld(-a/2 + tpx('TL')/2, -hMax/2 + tpx('TL')/2);
            const TRm = toWorld( a/2 - tpx('TR')/2, -hMax/2 + tpx('TR')/2);
            const BRm = toWorld( a/2 - tpx('BR')/2,  hMax/2 - tpx('BR')/2);
            const BLm = toWorld(-a/2 + tpx('BL')/2,  hMax/2 - tpx('BL')/2);
            addHandle(idx, TLm.x, TLm.y, 0, 'RC-TL');
            addHandle(idx, TRm.x, TRm.y, 0, 'RC-TR');
            addHandle(idx, BRm.x, BRm.y, 0, 'RC-BR');
            addHandle(idx, BLm.x, BLm.y, 0, 'RC-BL');
            // Inside-corner handles for U
            const icC = cur.icCorners || { iTL:{value:0}, iTR:{value:0}, iBR:{value:0}, iBL:{value:0} };
            const itpx=(k)=> Math.max(0, Number(icC[k]?.value||0))*2;
            const iTLm = toWorld(-a/2 + px(eIn) + itpx('iTL')/2, -hMax/2 + px(dIn) + itpx('iTL')/2);
            const iTRm = toWorld( a/2 - px(hIn) - itpx('iTR')/2, -hMax/2 + px(dIn) + itpx('iTR')/2);
            const iBRm = toWorld( a/2 - px(hIn) - itpx('iBR')/2,  hMax/2 - itpx('iBR')/2);
            const iBLm = toWorld(-a/2 + px(eIn) + itpx('iBL')/2,  hMax/2 - itpx('iBL')/2);
            addHandle(idx, iTLm.x, iTLm.y, 0, 'IC-TL');
            addHandle(idx, iTRm.x, iTRm.y, 0, 'IC-TR');
            // Only show bottom inside-corner handles if there is a true inner bottom
            if (blPx === brPx){
              addHandle(idx, iBRm.x, iBRm.y, 0, 'IC-BR');
              addHandle(idx, iBLm.x, iBLm.y, 0, 'IC-BL');
            }
          }
        } else if (shape==='poly'){
          // Custom polygon defined by local-inch points: [{x,y}, ...] in inches
          const ptsIn = Array.isArray(cur.points) && cur.points.length>=3 ? cur.points : [
            {x:-40,y:-30},{x:40,y:-30},{x:60,y:0},{x:10,y:40},{x:-30,y:20}
          ];
          // ensure bsPoly exists and matches edges count
          if (!Array.isArray(cur.bsPoly)) cur.bsPoly = new Array(ptsIn.length).fill(false);
          if (cur.bsPoly.length !== ptsIn.length){
            const old = cur.bsPoly.slice(0);
            const next = new Array(ptsIn.length).fill(false);
            for (let i=0;i<Math.min(old.length, next.length);i++){ next[i] = !!old[i]; }
            cur.bsPoly = next;
          }
          // local inches -> viewBox units
          const toWorld = (lx,ly)=>{
            const rad = (rotation||0) * Math.PI/180; const cos=Math.cos(rad), sin=Math.sin(rad);
            const x = centerX + (lx*2)*cos - (ly*2)*sin; // 2 px per inch
            const y = centerY + (lx*2)*sin + (ly*2)*cos;
            return {x,y};
          };
          // build path with corner operations (clip/radius)
          const polyPath = document.createElementNS(ns, 'path');
          // Determine orientation once for outside arc sweep
          let orientArea=0; for (let i=0;i<ptsIn.length;i++){ const a=ptsIn[i], b=ptsIn[(i+1)%ptsIn.length]; orientArea += (a.x*b.y - b.x*a.y); }
          const isCCW = orientArea > 0;
          let dStr='';
          const nPts = ptsIn.length;
          const getCorner = (i)=>{ const s=cur; if (!Array.isArray(s.corners)) return {mode:'square', value:0}; const c=s.corners[i]; return c||{mode:'square', value:0}; };
          const toW=(p)=> toWorld(p.x,p.y);
          const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t});
          for (let i=0;i<nPts;i++){
            const p0 = ptsIn[(i-1+nPts)%nPts];
            const p1 = ptsIn[i];
            const p2 = ptsIn[(i+1)%nPts];
            const c = getCorner(i);
            const w1 = toW(p1);
            if (!c || c.mode==='square' || !c.value){
              if (i===0){ dStr += `M ${w1.x} ${w1.y}`; } else { dStr += ` L ${w1.x} ${w1.y}`; }
              continue;
            }
            const sz = Math.max(0, Number(c.value||0));
            // compute points along edges from p1 towards p0 and p2 by sz inches
            const v10 = { x: p0.x - p1.x, y: p0.y - p1.y };
            const v12 = { x: p2.x - p1.x, y: p2.y - p1.y };
            const l10 = Math.hypot(v10.x, v10.y)||1; const l12=Math.hypot(v12.x, v12.y)||1;
            const a = { x: p1.x + v10.x*(sz/l10), y: p1.y + v10.y*(sz/l10) };
            const b = { x: p1.x + v12.x*(sz/l12), y: p1.y + v12.y*(sz/l12) };
            const aW = toW(a), bW=toW(b);
            if (i===0){ dStr += `M ${aW.x} ${aW.y}`; } else { dStr += ` L ${aW.x} ${aW.y}`; }
            if (c.mode==='clip'){
              dStr += ` L ${bW.x} ${bW.y}`;
            } else if (c.mode==='radius'){
              // precise fillet radius: r = t / tan(phi/2), where t=offset along edges
              const tOff = sz;
              // unit vectors along incoming and outgoing edges
              const u_in = { x: (p1.x - p0.x), y: (p1.y - p0.y) };
              const u_out = { x: (p2.x - p1.x), y: (p2.y - p1.y) };
              const uin_len = Math.hypot(u_in.x,u_in.y)||1; const uout_len=Math.hypot(u_out.x,u_out.y)||1;
              const vin = { x: u_in.x/uin_len, y: u_in.y/uin_len };
              const vout = { x: u_out.x/uout_len, y: u_out.y/uout_len };
              let dot = vin.x*vout.x + vin.y*vout.y; if (dot>1) dot=1; if (dot<-1) dot=-1;
              const phi = Math.acos(dot);
              const tanHalf = Math.tan(phi/2) || 1;
              const rPx = (tOff / tanHalf) * 2; // inches to px
              const large=0;
              // outside radius sweep: CW=1, CCW=0
              const sweep = isCCW ? 0 : 1;
              dStr += ` A ${rPx} ${rPx} 0 ${large} ${sweep} ${bW.x} ${bW.y}`;
            }
          }
          dStr += ' Z';
          polyPath.setAttribute('d', dStr);
          polyPath.setAttribute('fill', '#f8c4a0');
          polyPath.setAttribute('stroke', '#aab3c5');
          polyPath.setAttribute('stroke-width', '1.5');
          gRoot.appendChild(polyPath);

          // backsplash along selected polygon edges (render above countertop)
          {
            const bhPx = Number(opts.bsHeight||0) * 2; // pixels
            if (opts.bsOn && bhPx>0 && Array.isArray(cur.bsPoly)){
              // orientation via signed area (local inches)
              let area=0; for (let i=0;i<ptsIn.length;i++){ const a=ptsIn[i], b=ptsIn[(i+1)%ptsIn.length]; area += (a.x*b.y - b.x*a.y); }
              const isCCW = area > 0;
              for (let i=0;i<ptsIn.length;i++){
                if (!cur.bsPoly[i]) continue;
                const aL = ptsIn[i], bL = ptsIn[(i+1)%ptsIn.length];
                const aW = toWorld(aL.x, aL.y), bW = toWorld(bL.x, bL.y);
                const dx = bW.x - aW.x, dy = bW.y - aW.y; const len = Math.hypot(dx,dy)||1;
                // outward normal: right side for CCW, left for CW
                const nx = isCCW ? (dy/len) : (-dy/len);
                const ny = isCCW ? (-dx/len) : (dx/len);
                const p0x = aW.x, p0y = aW.y;
                const p1x = bW.x, p1y = bW.y;
                const q1x = p1x + nx*bhPx, q1y = p1y + ny*bhPx;
                const q0x = p0x + nx*bhPx, q0y = p0y + ny*bhPx;
                const bp = document.createElementNS(ns,'path');
                bp.setAttribute('d', `M ${p0x} ${p0y} L ${p1x} ${p1y} L ${q1x} ${q1y} L ${q0x} ${q0y} Z`);
                bp.setAttribute('fill', '#e6f2ff');
                bp.setAttribute('stroke', '#4d8fe8');
                bp.setAttribute('stroke-width', '1.25');
                gRoot.appendChild(bp);
              }
            }
          }

          // labels: edge lengths (inches) at midpoints
          const labelEdge=(x1,y1,x2,y2,txt)=>{ const mx=(x1+x2)/2, my=(y1+y2)/2 - 6; const ang=Math.atan2(y2-y1, x2-x1)*180/Math.PI; const t=document.createElementNS(ns,'text'); t.setAttribute('x', String(mx)); t.setAttribute('y', String(my)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#2d4a7a'); t.textContent=txt; t.setAttribute('transform', `rotate(${ang} ${mx} ${my})`); gRoot.appendChild(t); };
          // draw dynamic side guides and letters A.. as needed
          const m=10; let letterCode=65; // 'A'
          const drawGuide=(x1,y1,x2,y2,letTxt)=>{ const l=document.createElementNS(ns,'line'); l.setAttribute('x1',String(x1)); l.setAttribute('y1',String(y1)); l.setAttribute('x2',String(x2)); l.setAttribute('y2',String(y2)); l.setAttribute('stroke','#bdc6da'); l.setAttribute('stroke-width','2'); gRoot.appendChild(l); const mx=(x1+x2)/2, my=(y1+y2)/2 - 6; const ang=Math.atan2(y2-y1, x2-x1)*180/Math.PI; const t=document.createElementNS(ns,'text'); t.setAttribute('x', String(mx)); t.setAttribute('y', String(my)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=letTxt; t.setAttribute('transform', `rotate(${ang} ${mx} ${my})`); gRoot.appendChild(t); };
          for (let i=0;i<ptsIn.length;i++){
            const aP = ptsIn[i]; const bP = ptsIn[(i+1)%ptsIn.length];
            const lenIn = Math.round(Math.hypot(bP.x - aP.x, bP.y - aP.y));
            const w1 = toWorld(aP.x, aP.y); const w2 = toWorld(bP.x, bP.y);
            labelEdge(w1.x,w1.y,w2.x,w2.y, `${lenIn}\"`);
            // guide/letter sized exactly to this side
            drawGuide(w1.x, w1.y, w2.x, w2.y, String.fromCharCode(letterCode));
            letterCode++;
          }

          // active highlight: draw small handles at vertices
          if (idx===active){
            ptsIn.forEach((p,i)=>{ const w = toWorld(p.x, p.y); addHandle(idx, w.x, w.y, 0, `V-${i}`); });
            // also midpoint handles per edge for resizing length
            for (let i=0;i<ptsIn.length;i++){
              const aP = ptsIn[i], bP = ptsIn[(i+1)%ptsIn.length];
              const mid={ x:(aP.x+bP.x)/2, y:(aP.y+bP.y)/2 };
              const w = toWorld(mid.x, mid.y); addHandle(idx, w.x, w.y, 0, `P-${i}`);
            }
            // Corner size handles (midpoint between the two offset points per corner)
            const getCorner = (i)=>{ const s=cur; if (!Array.isArray(s.corners)) return {mode:'square', value:0}; const c=s.corners[i]; return c||{mode:'square', value:0}; };
            for (let i=0;i<ptsIn.length;i++){
              const p0 = ptsIn[(i-1+ptsIn.length)%ptsIn.length];
              const p1 = ptsIn[i];
              const p2 = ptsIn[(i+1)%ptsIn.length];
              const c = getCorner(i);
              const tIn = Math.max(0, Number(c.value||0));
              const v10 = { x: p0.x - p1.x, y: p0.y - p1.y };
              const v12 = { x: p2.x - p1.x, y: p2.y - p1.y };
              const l10 = Math.hypot(v10.x, v10.y)||1; const l12=Math.hypot(v12.x, v12.y)||1;
              const a = { x: p1.x + v10.x*(tIn/l10), y: p1.y + v10.y*(tIn/l10) };
              const b = { x: p1.x + v12.x*(tIn/l12), y: p1.y + v12.y*(tIn/l12) };
              const m = { x: (a.x+b.x)/2, y: (a.y+b.y)/2 };
              const w = toWorld(m.x, m.y);
              addHandle(idx, w.x, w.y, 0, `RC-P-${i}`);
            }
          }

          // hit area: bounding box in local inches -> px, rotated like others
          let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity; ptsIn.forEach(p=>{ if(p.x<minX) minX=p.x; if(p.y<minY) minY=p.y; if(p.x>maxX) maxX=p.x; if(p.y>maxY) maxY=p.y; });
          const w = (maxX - minX) * 2, h = (maxY - minY) * 2; // px
          hitAreas.push({ idx, cx:centerX, cy:centerY, w, h, rot:rotation||0 });
        }

        // end forEach
      });

  // Draw hover highlight if any
      if (hover >= 0){
        const ha = hitAreas.find(h=> h.idx===hover);
        if (ha){
          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${ha.rot} ${ha.cx} ${ha.cy})`);
          const hi = document.createElementNS(ns,'rect');
          hi.setAttribute('x', String(ha.cx - ha.w/2 - 6));
          hi.setAttribute('y', String(ha.cy - ha.h/2 - 6));
          hi.setAttribute('width', String(ha.w + 12));
          hi.setAttribute('height', String(ha.h + 12));
          hi.setAttribute('fill','none'); hi.setAttribute('stroke','#8aa3ff'); hi.setAttribute('stroke-width','2'); hi.setAttribute('stroke-dasharray','4 4'); hi.setAttribute('opacity','0.8');
          rotG.appendChild(hi);
          gRoot.appendChild(rotG);
        }
  }
  // After drawing vectors, sync inline numeric inputs
  renderInlineInputs();
      // Hover value badge in Resize mode
      if (toolMode==='resize' && hoverHandle && handles.length>0){
        const hh = hoverHandle.h; const s = shapes[hoverHandle.idx];
        if (s && hh){
          const keyStr = String(hh.key||'');
          const fmt = (v)=> `${Math.max(0, Math.round(Number(v||0)))}"`;
          let txt = '';
          if (keyStr==='A-right' || keyStr==='A-left') txt = fmt(s.len?.A||0);
          else if (keyStr==='B-top' || keyStr==='B-bottom') txt = fmt(s.len?.B||0);
          else if (keyStr==='C') txt = fmt(s.len?.C||0);
          else if (keyStr==='D') txt = fmt(s.len?.D||0);
          else if (keyStr==='BL') { const v=(s.len?.BL!=null)?s.len.BL:((s.len?.B!=null)?s.len.B:25); txt = fmt(v); }
          else if (keyStr==='BR') { const v=(s.len?.BR!=null)?s.len.BR:((s.len?.B!=null)?s.len.B:25); txt = fmt(v); }
          else if (keyStr==='E') txt = fmt(s.len?.E||0);
          else if (keyStr==='H') txt = fmt(s.len?.H||0);
          else if (keyStr.startsWith('P-')){
            const i = parseInt(keyStr.split('-')[1]||'-1',10);
            if (Array.isArray(s.points) && i>=0){ const a=s.points[i], b=s.points[(i+1)%s.points.length]; txt = fmt(Math.hypot((b.x-a.x),(b.y-a.y))); }
          } else if (keyStr.startsWith('RC-')){
            if (s.type==='poly'){
              const i = parseInt(keyStr.split('-')[2]||'-1',10);
              const v = (Array.isArray(s.corners) && s.corners[i]) ? s.corners[i].value : 0; txt = fmt(v);
            } else {
              const map = { 'RC-TL':'TL','RC-TR':'TR','RC-BR':'BR','RC-BL':'BL' };
              const k = map[keyStr]||'TL'; const v = s.rcCorners?.[k]?.value || 0; txt = fmt(v);
            }
          } else if (keyStr.startsWith('IC-')){
            const map = { 'IC-TL':'iTL','IC-TR':'iTR','IC-BR':'iBR','IC-BL':'iBL' };
            const k = map[keyStr]||'iTL'; const v = s.icCorners?.[k]?.value || 0; txt = fmt(v);
          }
          if (txt){
            const padX=12, padY=14;
            const t=document.createElementNS(ns,'text');
            t.setAttribute('x', String(hh.cx + padX));
            t.setAttribute('y', String(hh.cy - padY));
            t.setAttribute('font-size','12');
            t.setAttribute('font-weight','800');
            t.setAttribute('fill','#0f172a');
            t.setAttribute('class','kc-hval');
            t.textContent = txt;
            gRoot.appendChild(t);
          }
        }
      }
    }
    // Tool mode and panels (left palette)
    root.querySelectorAll('[data-ct-tool-mode]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        mode = btn.getAttribute('data-ct-tool-mode') || 'move';
        // keep toolbar toolMode in sync so resize works regardless of control used
        toolMode = mode;
        root.querySelectorAll('[data-ct-tool-mode]').forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // mirror active state to toolbar buttons
        root.querySelectorAll('.kc-ct-toolbar [data-ct-tool]').forEach(b=>{
          const name = b.getAttribute('data-ct-tool') || 'move';
          b.classList.toggle('is-active', name === toolMode);
        });
  // Open Measurements panel when choosing resize from left tiles
  if (toolMode==='resize'){ const mbtn = sel('[data-ct-panel="measure"]', root); if (mbtn) mbtn.click(); }
        // redraw to reflect handle visibility for the new mode
        draw();
      });
    });
    root.querySelectorAll('[data-ct-panel]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const p = btn.getAttribute('data-ct-panel');
        root.querySelectorAll('.kc-panel').forEach(panel=> panel.hidden = true);
        const pane = sel('.kc-panel-' + p, root); if (pane) pane.hidden = false;
        // When switching to Measurements, refresh constraint hints
        if (p==='measure'){ try{ updateConstraintsUI(); }catch(e){} }
      });
    });

    // Create shapes from panel
  root.querySelectorAll('[data-ct-shape]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        pushHistory();
  const type = btn.getAttribute('data-ct-shape')||'rect';
  const a = parseInt(btn.getAttribute('data-ct-len-a')||'60',10);
  const b = parseInt(btn.getAttribute('data-ct-len-b')||'25',10);
  const c = parseInt(btn.getAttribute('data-ct-len-c')|| (type==='rect'?'0':'20'),10);
  const d = parseInt(btn.getAttribute('data-ct-len-d')|| (type==='rect'?'0':'10'),10);
        const id='s'+(shapes.length+1);
        if (type==='poly'){
          const pts=[{x:-40,y:-30},{x:40,y:-30},{x:60,y:0},{x:10,y:40},{x:-30,y:20}];
          const bsPoly = new Array(pts.length).fill(true);
          shapes.push({ id, name:'Shape '+(shapes.length+1), type:'poly', rot:0, pos:{x:300,y:300}, points:pts, bsPoly, len:{A:0,B:0,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] });
        } else {
  const baseLen = {A:a,B:b,C:c,D:d};
  if (type==='u'){
    baseLen.E = Math.round((a - c)/2); baseLen.H = Math.round((a - c)/2);
    baseLen.BL = (baseLen.B!=null) ? baseLen.B : 25;
    baseLen.BR = (baseLen.B!=null) ? baseLen.B : 25;
  }
      const newShape = { id, name:'Shape '+(shapes.length+1), type, rot:0, pos:{x:300,y:300}, len:baseLen, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] };
      shapes.push(normalizeShape(newShape));
        }
        active = shapes.length-1; shapeLabel.textContent = shapes[active].name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Free draw: click the tile to start adding vertices on canvas until Enter or double-click to finish
    root.querySelectorAll('[data-ct-poly="free"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
          pushHistory();
        const id='s'+(shapes.length+1);
  const s={ id, name:'Shape '+(shapes.length+1), type:'poly', rot:0, pos:{x:300,y:300}, points:[], bsPoly:[], len:{A:0,B:0,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] };
        shapes.push(s); active=shapes.length-1; drawingPoly=true; drawingIdx=active; shapeLabel.textContent=s.name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Layout presets
    root.querySelectorAll('[data-ct-layout]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
          pushHistory();
        const layout = btn.getAttribute('data-ct-layout');
        const add = (type,len,pos)=>{ const id='s'+(shapes.length+1); shapes.push({ id, name:'Shape '+(shapes.length+1), type, rot:0, pos:pos||{x:300,y:300}, len, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] }); active=shapes.length-1; };
        if (layout==='straight'){
          add('rect', {A:96,B:25,C:0,D:0}, {x:300,y:280});
        } else if (layout==='galley-island'){
          add('rect', {A:120,B:25,C:0,D:0}, {x:300,y:240});
          add('rect', {A:72,B:36,C:0,D:0}, {x:300,y:360});
        } else if (layout==='l-standard'){
          add('l', {A:144,B:96,C:48,D:26}, {x:310,y:300});
        } else if (layout==='l-island'){
          add('l', {A:144,B:96,C:48,D:26}, {x:280,y:280});
          add('rect', {A:60,B:36,C:0,D:0}, {x:420,y:360});
        } else if (layout==='u-standard'){
          add('u', {A:180,BL:100,BR:100,C:84,D:26,E:48,H:48}, {x:300,y:300});
        } else if (layout==='peninsula'){
          add('rect', {A:96,B:25,C:0,D:0}, {x:280,y:260});
          add('rect', {A:60,B:25,C:0,D:0}, {x:360,y:340});
        }
        shapeLabel.textContent = shapes[active]?.name || 'Shape'; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Duplicate handler (reused for toolbar + sidebar)
    const onDuplicate = ()=>{
      if (active<0) return;
      pushHistory();
      const s=shapes[active];
      const copy=JSON.parse(JSON.stringify(s));
      copy.id='s'+(shapes.length+1);
      copy.name='Shape '+(shapes.length+1);
      copy.pos={x:s.pos.x+20,y:s.pos.y+20};
      shapes.push(copy); active=shapes.length-1;
      shapeLabel.textContent=copy.name; renderTabs(); draw(); updateSummary(); save();
    };
    all('[data-ct-duplicate]', root).forEach(el=> el.addEventListener('click', onDuplicate));

    // Measurement side letters A/B/C/D anchored to actual side centers with rotation
    function labelDims(parent, cx, cy, A, B, rotDeg){
      const ns='http://www.w3.org/2000/svg';
      const px=(v)=> v*2; const w=px(Number(A||0)), h=px(Number(B||0));
  const m=22; // outward offset (parent group handles rotation)
      const label=(x,y,txt)=>{ const t=document.createElementNS(ns,'text'); t.setAttribute('x',String(x)); t.setAttribute('y',String(y)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=txt; parent.appendChild(t); };
      // A top
      label(cx + 0, cy - h/2 - m, 'A');
      // B left
      label(cx - w/2 - m, cy + 0, 'B');
      // C bottom
      label(cx + 0, cy + h/2 + m, 'C');
      // D right
      label(cx + w/2 + m, cy + 0, 'D');
    }

  // (shape selection handled below in a single place)

  // Bind rotate controls across toolbar/sidebar
  all('[data-ct-rotate-left]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; pushHistory(); shapes[active].rot = (shapes[active].rot + 270)%360; draw(); }));
  all('[data-ct-rotate-right]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; pushHistory(); shapes[active].rot = (shapes[active].rot + 90)%360; draw(); }));
  // Mirror (horizontal) control
  all('[data-ct-mirror]', root).forEach(el=> el.addEventListener('click', ()=>{
    if (active<0) return; const cur = shapes[active];
    pushHistory();
    if (cur.type==='l'){
      cur.flipX = !cur.flipX;
    } else if (cur.type==='u'){
  // Mirror U: swap BL/BR depths, swap return lengths E/H, and swap backsplash flags E/H
  if (cur.len){ const tmpBL = cur.len.BL; cur.len.BL = cur.len.BR; cur.len.BR = tmpBL; }
  const eVal = Number(cur.len?.E||0), hVal = Number(cur.len?.H||0);
  if (!cur.len) cur.len = {};
  cur.len.E = hVal; cur.len.H = eVal;
  if (cur.bs){
    // swap E/H backsplash flags
    const tmpEH = cur.bs.E; cur.bs.E = cur.bs.H; cur.bs.H = tmpEH;
    // swap BL/BR backsplash flags
    const tmpB = cur.bs.BL; cur.bs.BL = cur.bs.BR; cur.bs.BR = tmpB;
  }
    } // rect/poly: no-op for now
    draw(); updateConstraintsUI(); save();
  }));

    // Delegated input handling for dynamic measurement fields
    root.addEventListener('input', (ev)=>{
      const inp = ev.target;
      if (!(inp instanceof HTMLElement)) return;
      if (!inp.matches('[data-ct-len]')) return;
      if (active<0) return;
      // Allow clearing field before new number is typed
      if ((inp).value === ''){ return; }
      // Debounce history: record once per burst of input changes
      if (!lenEditTimer){ pushHistory(); }
  if (lenEditTimer) clearTimeout(lenEditTimer);
  lenEditTimer = setTimeout(()=>{ lenEditTimer = null; }, 500);
      const s = shapes[active];
      const k = inp.getAttribute('data-ct-len');
      let v = parseInt(inp.value||'0',10); if(!isFinite(v)||v<0) v=0;
      if (s.type==='rect' && (k==='C' || k==='D')){
        // mirror to A/B
        if (k==='C') s.len.A = v; else s.len.B = v;
      } else if (s.type==='poly' && k && k.startsWith('P')){
        const idx = parseInt(k.slice(1)||'0',10);
        const pts = Array.isArray(s.points)? s.points: [];
        if (idx>=0 && pts.length>=2){
          const n = pts.length; const a = pts[idx]; const b = pts[(idx+1)%n];
          const vx = (b.x - a.x); const vy = (b.y - a.y); const cur = Math.hypot(vx,vy)||1; const ux = vx/cur; const uy = vy/cur;
          // set new B along A-> dir with length v
          pts[(idx+1)%n] = { x: Math.round(a.x + ux * v), y: Math.round(a.y + uy * v) };
        }
      } else {
        // Default assignment, then shape-specific clamps
        s.len[k] = v;
        if (s.type==='u'){
          const A = Number(s.len.A||0);
          const BL = Number((s.len.BL!=null)?s.len.BL:(s.len.B!=null?s.len.B:25));
          const BR = Number((s.len.BR!=null)?s.len.BR:(s.len.B!=null?s.len.B:25));
          const minSide = Math.max(0, Math.min(BL, BR));
          if (k==='E' || k==='H'){
            if (k==='E'){ s.len.E = Math.max(0, Math.min(v, Math.max(0, A - 1 - (s.len.H||0)))); }
            if (k==='H'){ s.len.H = Math.max(0, Math.min(v, Math.max(0, A - 1 - (s.len.E||0)))); }
            s.len.C = Math.max(1, A - Math.max(0, (s.len.E||0)) - Math.max(0, (s.len.H||0)));
          } else if (k==='D'){
            s.len.D = Math.max(0, Math.min(Number(s.len.D||0), Math.max(0, minSide-1)));
          } else if (k==='C'){
            // Update C by rebalancing E/H symmetrically to keep notch centered
            const newC = Math.max(1, Math.min(v, Math.max(1, A-1)));
            const spare = Math.max(0, A - newC);
            const e = Math.floor(spare/2), h = spare - e;
            s.len.C = newC; s.len.E = e; s.len.H = h;
          } else if (k==='BL' || k==='BR'){
            // Clamp D to the new shallower side - 1
            const nBL = Number((k==='BL'?v:(s.len.BL!=null?s.len.BL:(s.len.B!=null?s.len.B:25))));
            const nBR = Number((k==='BR'?v:(s.len.BR!=null?s.len.BR:(s.len.B!=null?s.len.B:25))));
            const m = Math.max(0, Math.min(nBL, nBR));
            s.len.D = Math.max(0, Math.min(Number(s.len.D||0), Math.max(0, m-1)));
          }
        }
      }
      draw(); updateOversize(); updateSummary(); updateConstraintsUI(); save();
    });

    function updateOversize(){
      // Any piece with any side over 120 inches triggers the alert
      const limit = 120;
      const over = shapes.some(s=>{
        const len = s.len||{};
        const base = (Number(len.A||0)>limit) || (Number(len.B||0)>limit) || (Number(len.C||0)>limit) || (Number(len.D||0)>limit);
        if (s.type==='u'){
          const BL = Number((len.BL!=null)?len.BL:((len.B!=null)?len.B:0));
          const BR = Number((len.BR!=null)?len.BR:((len.B!=null)?len.B:0));
          return base || BL>limit || BR>limit;
        }
        return base;
      });
  const alertEl = sel('[data-ct-alert]', root);
      if (alertEl) alertEl.hidden = !over;
    }

  function updateActionStates(){
  const del = sel('[data-ct-delete]', root);
  const rst = sel('[data-ct-reset]', root);
  if (del) del.disabled = shapes.length <= 0;
  if (rst) rst.disabled = (active<0);
  // Undo/Redo availability
  const u = sel('[data-ct-undo]', root);
  const r = sel('[data-ct-redo]', root);
  const lock = !!isGestureActive;
  if (u) u.disabled = lock || (_past.length <= 0);
  if (r) r.disabled = lock || (_future.length <= 0);
  // Gesture hint
  const gh = sel('[data-ct-gesture-hint]', root);
  if (gh) gh.hidden = !lock;
    }

    // Tabs handling
    const tabsWrap = sel('[data-ct-tabs]', root);
    function renderTabs(){
      tabsWrap.innerHTML = '';
    shapes.forEach((sh, idx)=>{
  const b=document.createElement('button'); b.className='kc-ct-tab' + (idx===active?' is-active':''); b.type='button'; b.textContent=sh.name; b.addEventListener('click', ()=>{ active=idx; shapeLabel.textContent=sh.name; syncInputs(); draw(); updateOversize(); renderTabs(); }); tabsWrap.appendChild(b);
      });
  const add=document.createElement('button'); add.className='kc-ct-tab add'; add.type='button'; add.textContent='Add A Shape'; add.addEventListener('click', ()=>{ const panelBtn = sel('[data-ct-panel="shapes"]', root); if (panelBtn) panelBtn.click(); }); tabsWrap.appendChild(add);
      updateActionStates();
    }

  function syncInputs(){
      const cur = shapes[active];
      if (active<0 || !cur){
        all('[data-ct-len]', root).forEach(inp=>{ inp.value = '0'; inp.disabled = true; });
        all('[data-ct-wall]', root).forEach(inp=>{ inp.checked = false; inp.disabled = true; });
        // clear dynamic backsplash list
        const bsList = sel('[data-ct-bs-list]', root); if (bsList) bsList.innerHTML = '';
        all('[data-ct-shape]', root).forEach(btn=> btn.classList.remove('is-active'));
  const rowC = sel('[data-row-c]', root); const rowD = sel('[data-row-d]', root);
  if (rowC) rowC.style.display='none'; if (rowD) rowD.style.display='none';
  const flipWrap = sel('[data-ct-l-flip-wrap]', root); if (flipWrap) flipWrap.hidden = true;
    const list = sel('[data-ct-meas-list]', root); if (list) list.innerHTML='';
      } else {
        // Build dynamic per-side inputs
        const list = sel('[data-ct-meas-list]', root);
        if (list){
          list.innerHTML = '';
          const addRow=(label,key)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span><input type="number" min="0" step="1" data-ct-len="${key}" /></label>`; list.appendChild(row); };
          if (cur.type==='rect'){
            addRow('Top (A)','A'); addRow('Left (B)','B'); addRow('Bottom (C)','C'); addRow('Right (D)','D');
            // Corner controls (outside corners)
            const cornersHdr=document.createElement('div'); cornersHdr.className='kc-subtle'; cornersHdr.textContent='Corners'; list.appendChild(cornersHdr);
            // Apply to all (Rect)
            const allRowR=document.createElement('div'); allRowR.className='row';
            allRowR.innerHTML = `<label><span>Apply to all</span>
              <select data-ct-rc-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-rc-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowR);
            const mkC=(key,label)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span>
              <select data-ct-rc-corner-mode="${key}" title="Corner mode">
                <option value="square">Square</option>
                <option value="radius">Radius</option>
                <option value="clip">Clip</option>
              </select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-val="${key}" placeholder="size (in)" />
              <span class="kc-mini-btns">
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.25">1/4"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.5">1/2"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="1">1"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="2">2"</button>
              </span>
            </label>`; list.appendChild(row); };
            mkC('TL','Corner TL'); mkC('TR','Corner TR'); mkC('BR','Corner BR'); mkC('BL','Corner BL');
  } else if (cur.type==='l'){
            addRow('Top (A)','A'); addRow('Left (B)','B'); addRow('Inner bottom run (C)','C'); addRow('Inner vertical (D)','D');
            const cornersHdr=document.createElement('div'); cornersHdr.className='kc-subtle'; cornersHdr.textContent='Corners (outside)'; list.appendChild(cornersHdr);
            const allRowL=document.createElement('div'); allRowL.className='row';
            allRowL.innerHTML = `<label><span>Apply to all</span>
              <select data-ct-rc-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-rc-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowL);
            const mkC=(key,label)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span>
              <select data-ct-rc-corner-mode="${key}"><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-val="${key}" placeholder="size (in)" />
              <span class="kc-mini-btns">
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.25">1/4"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.5">1/2"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="1">1"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="2">2"</button>
              </span>
            </label>`; list.appendChild(row); };
            mkC('TL','Corner TL'); mkC('TR','Corner TR'); mkC('BR','Corner BR'); mkC('BL','Corner BL');
            // Inside corners for L (iTL, iBR)
            const iHdr=document.createElement('div'); iHdr.className='kc-subtle'; iHdr.textContent='Inside Corners'; list.appendChild(iHdr);
            const allRowLI=document.createElement('div'); allRowLI.className='row';
            allRowLI.innerHTML = `<label><span>Apply to both</span>
              <select data-ct-ic-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-ic-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-ic-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowLI);
            const mkIC=(key,label)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span>
              <select data-ct-ic-corner-mode="${key}"><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-ic-corner-val="${key}" placeholder="size (in)" />
              <span class="kc-mini-btns">
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="0.25">1/4"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="0.5">1/2"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="1">1"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="2">2"</button>
              </span>
            </label>`; list.appendChild(row); };
            mkIC('iTL','Inside TL'); mkIC('iBR','Inside BR');
          } else if (cur.type==='u'){
            addRow('Top (A)','A');
            addRow('Left depth (BL)','BL');
            addRow('Right depth (BR)','BR');
            addRow('Inner opening width (C)','C');
            addRow('Inner setback (D)','D');
            // Center is always open on U; no base thickness control
            addRow('Left return (E)','E');
            addRow('Right return (H)','H');
            // Outside corner controls for U
            const cornersHdr=document.createElement('div'); cornersHdr.className='kc-subtle'; cornersHdr.textContent='Corners (outside)'; list.appendChild(cornersHdr);
            const allRowU=document.createElement('div'); allRowU.className='row';
            allRowU.innerHTML = `<label><span>Apply to all</span>
              <select data-ct-rc-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-rc-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowU);
            const mkC=(key,label)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span>
              <select data-ct-rc-corner-mode="${key}"><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-rc-corner-val="${key}" placeholder="size (in)" />
              <span class="kc-mini-btns">
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.25">1/4"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="0.5">1/2"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="1">1"</button>
                <button type="button" class="kc-mini" data-ct-rc-corner-preset data-key="${key}" data-value="2">2"</button>
              </span>
            </label>`; list.appendChild(row); };
            mkC('TL','Corner TL'); mkC('TR','Corner TR'); mkC('BR','Corner BR'); mkC('BL','Corner BL');
            // Inside corners for U (iTL, iTR, iBR, iBL)
            const iHdr=document.createElement('div'); iHdr.className='kc-subtle'; iHdr.textContent='Inside Corners'; list.appendChild(iHdr);
            const allRowUI=document.createElement('div'); allRowUI.className='row';
            allRowUI.innerHTML = `<label><span>Apply to all</span>
              <select data-ct-ic-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-ic-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-ic-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowUI);
            const mkIC=(key,label)=>{ const row=document.createElement('div'); row.className='row'; row.innerHTML=`<label><span>${label}</span>
              <select data-ct-ic-corner-mode="${key}"><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-ic-corner-val="${key}" placeholder="size (in)" />
              <span class="kc-mini-btns">
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="0.25">1/4"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="0.5">1/2"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="1">1"</button>
                <button type="button" class="kc-mini" data-ct-ic-corner-preset data-key="${key}" data-value="2">2"</button>
              </span>
            </label>`; list.appendChild(row); };
            mkIC('iTL','Inside TL'); mkIC('iTR','Inside TR'); mkIC('iBR','Inside BR'); mkIC('iBL','Inside BL');
          } else if (cur.type==='poly'){
            const n = (Array.isArray(cur.points)?cur.points.length:0); for(let i=0;i<n;i++){ const letter=String.fromCharCode(65+i); addRow(`Side ${letter}`, `P${i}`); }
            // Corner controls for polygon
            const cornersHdr=document.createElement('div'); cornersHdr.className='kc-subtle'; cornersHdr.textContent='Corners'; list.appendChild(cornersHdr);
            // Apply to all (Poly)
            const allRowP=document.createElement('div'); allRowP.className='row';
            allRowP.innerHTML = `<label><span>Apply to all</span>
              <select data-ct-corner-all-mode><option value="square">Square</option><option value="radius">Radius</option><option value="clip">Clip</option></select>
              <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-corner-all-val placeholder="size (in)" />
              <button type="button" class="kc-mini" data-ct-corner-apply-all>Apply</button>
            </label>`;
            list.appendChild(allRowP);
            const mkCorner=(i)=>{
              const letter=String.fromCharCode(65+i);
              const row=document.createElement('div'); row.className='row';
              row.innerHTML = `<label><span>Corner ${letter}</span>
                <select data-ct-corner-mode="${i}" title="Corner mode: Square keeps sharp; Radius adds an arc; Clip cuts corner straight">
                  <option value="square">Square</option>
                  <option value="radius">Radius</option>
                  <option value="clip">Clip</option>
                </select>
                <input type="number" min="0" step="0.25" class="kc-input-small" data-ct-corner-val="${i}" placeholder="size (in)" title="Corner size in inches (distance along each side from the vertex)" />
                <span class="kc-mini-btns">
                  <button type="button" class="kc-mini" data-ct-corner-preset data-index="${i}" data-value="0.25" title="Set 1/4 inch">1/4"</button>
                  <button type="button" class="kc-mini" data-ct-corner-preset data-index="${i}" data-value="0.5" title="Set 1/2 inch">1/2"</button>
                  <button type="button" class="kc-mini" data-ct-corner-preset data-index="${i}" data-value="1" title="Set 1 inch">1"</button>
                  <button type="button" class="kc-mini" data-ct-corner-preset data-index="${i}" data-value="2" title="Set 2 inches">2"</button>
                </span>
              </label>`;
              list.appendChild(row);
            };
            for (let i=0;i<n;i++){ mkCorner(i); }
          }
        }
        // Build dynamic backsplash options per shape
        const bsList = sel('[data-ct-bs-list]', root);
        if (bsList){
          bsList.innerHTML = '';
          const mk = (key, label)=>{
            const lab = document.createElement('label'); lab.className='kc-meas opt';
            const id = `bs_${key}`;
            lab.innerHTML = `<input type="checkbox" id="${id}" data-ct-backsplash="${key}" /> ${label}`;
            bsList.appendChild(lab);
            const inp = lab.querySelector('input'); if (inp){ inp.checked = !!(cur.bs && cur.bs[key]); inp.disabled = false; }
          };
          if (cur.type==='rect' || cur.type==='l'){
            ['A','B','C','D'].forEach(s=> mk(s, sideLabel(s)));
          } else if (cur.type==='u'){
            // migrate and ensure keys: use BL/BR instead of legacy B; omit D for U backsplash
            if (!cur.bs) cur.bs = {A:false,BL:false,BR:false,C:false,E:false,H:false};
            // Legacy migration: if B existed, apply to both BL and BR (do not render B anymore)
            if (cur.bs.B!=null){
              if (cur.bs.BL==null) cur.bs.BL = !!cur.bs.B;
              if (cur.bs.BR==null) cur.bs.BR = !!cur.bs.B;
            }
            if (cur.bs.BL==null) cur.bs.BL=false; if (cur.bs.BR==null) cur.bs.BR=false;
            if (cur.bs.E==null) cur.bs.E=false; if (cur.bs.H==null) cur.bs.H=false;
            ['A','BL','BR','C','E','H'].forEach(s=> mk(s, sideLabel(s)));
          } else if (cur.type==='poly'){
            const n = Array.isArray(cur.points) ? cur.points.length : 0;
            if (!Array.isArray(cur.bsPoly)) cur.bsPoly = new Array(n).fill(false);
            if (cur.bsPoly.length !== n){
              const old = cur.bsPoly.slice(0);
              const next = new Array(n).fill(false);
              for (let i=0;i<Math.min(old.length, next.length);i++){ next[i] = !!old[i]; }
              cur.bsPoly = next;
            }
            // Ensure corners array matches vertices
            if (!Array.isArray(cur.corners)) cur.corners = new Array(n).fill(null);
            if (cur.corners.length !== n){
              const old = cur.corners.slice(0);
              const next = new Array(n).fill(null);
              for (let i=0;i<Math.min(old.length, next.length);i++){ next[i] = old[i]; }
              cur.corners = next;
            }
            for (let i=0;i<n;i++){
              const letter = String.fromCharCode(65+i);
              const key = `P${i}`;
              const lab = document.createElement('label'); lab.className='kc-meas opt';
              const id = `bs_${key}`;
              lab.innerHTML = `<input type="checkbox" id="${id}" data-ct-backsplash="${key}" /> Side ${letter}`;
              bsList.appendChild(lab);
              const inp = lab.querySelector('input'); if (inp){ inp.checked = !!cur.bsPoly[i]; inp.disabled = false; }
            }
          } else {
            // default to A-D if unknown
            ['A','B','C','D'].forEach(s=> mk(s, sideLabel(s)));
          }
        }
    // Show L flip control for L shapes
    const flipWrap = sel('[data-ct-l-flip-wrap]', root);
    const flipInp = sel('[data-ct-l-flip]', root);
    if (flipWrap && flipInp){ flipWrap.hidden = cur.type!=='l'; flipInp.checked = !!cur.flipX; }
  all('[data-ct-len]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-len'); let v=0; if (cur.type==='poly' && k && k.startsWith('P')){ const idx=parseInt(k.slice(1)||'0',10); const pts=cur.points||[]; if (pts.length>=2){ const a=pts[idx], b=pts[(idx+1)%pts.length]; v=Math.round(Math.hypot((b.x-a.x),(b.y-a.y))); } } else { if (cur.type==='u' && (k==='BL' || k==='BR')){ if (k==='BL'){ v = (cur.len && cur.len.BL!=null) ? cur.len.BL : (cur.len && cur.len.B!=null ? cur.len.B : 25); } else { v = (cur.len && cur.len.BR!=null) ? cur.len.BR : (cur.len && cur.len.B!=null ? cur.len.B : 25); } } else { v = (cur.len && k in cur.len) ? cur.len[k] : 0; } } const activeEl=document.activeElement; inp.value = String(v||0); if (activeEl===inp) inp.focus(); });
        all('[data-ct-wall]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-wall'); inp.checked = !!cur.wall[k]; });
        all('[data-ct-shape]', root).forEach(btn=> btn.classList.toggle('is-active', btn.getAttribute('data-ct-shape')===cur.type));
    const rowC = sel('[data-row-c]', root); const rowD = sel('[data-row-d]', root);
  if (rowC) rowC.style.display='none'; if (rowD) rowD.style.display='none';
        // Update constraint hints for current selection
        try{ updateConstraintsUI(); }catch(e){}
      }
      const bsH = sel('[data-ct-bs-height]', root); if (bsH) bsH.value = String(opts.bsHeight||0);
      // Sync Rect/L/U outside corner controls
      if (cur && (cur.type==='rect' || cur.type==='l' || cur.type==='u')){
        if (!cur.rcCorners) cur.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
        ['TL','TR','BR','BL'].forEach(k=>{
          const selEl = sel(`[data-ct-rc-corner-mode="${k}"]`, root);
          const valEl = sel(`[data-ct-rc-corner-val="${k}"]`, root);
          const c = cur.rcCorners[k]||{mode:'square',value:0};
          if (selEl) selEl.value = c.mode||'square';
          if (valEl) valEl.value = String(c.value||0);
        });
        if (cur.type==='l' || cur.type==='u'){
          if (!cur.icCorners) cur.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
          ['iTL','iTR','iBR','iBL'].forEach(k=>{
            const selEl = sel(`[data-ct-ic-corner-mode="${k}"]`, root);
            const valEl = sel(`[data-ct-ic-corner-val="${k}"]`, root);
            const c = cur.icCorners[k]||{mode:'square',value:0};
            if (selEl) selEl.value = c.mode||'square';
            if (valEl) valEl.value = String(c.value||0);
              // For U with no true inner bottom, disable iBL/iBR controls
              if (cur.type==='u' && (k==='iBL' || k==='iBR')){
                const BL = Number((cur.len?.BL!=null)?cur.len.BL:((cur.len?.B!=null)?cur.len.B:25));
                const BR = Number((cur.len?.BR!=null)?cur.len.BR:((cur.len?.B!=null)?cur.len.B:25));
                const hasBottom = (BL === BR);
                if (selEl) selEl.disabled = !hasBottom;
                if (valEl) valEl.disabled = !hasBottom;
              }
          });
        }
      }
      // Sync polygon corner controls
      if (cur && cur.type==='poly'){
        const n = Array.isArray(cur.points)?cur.points.length:0;
        if (!Array.isArray(cur.corners)) cur.corners = new Array(n).fill(null);
        for (let i=0;i<n;i++){
          const selEl = sel(`[data-ct-corner-mode="${i}"]`, root);
          const valEl = sel(`[data-ct-corner-val="${i}"]`, root);
          const c = cur.corners[i] || {mode:'square', value:0};
          if (selEl) selEl.value = c.mode || 'square';
          if (valEl) valEl.value = String(c.value||0);
        }
      }
    }

    // Show light constraint hints in the Measurements panel
    function updateConstraintsUI(){
      const box = sel('[data-ct-constraints]', root);
      if (!box){ return; }
      if (active<0 || !shapes[active]){ box.hidden = true; box.textContent = ''; return; }
      const s = shapes[active];
      if (s.type==='u'){
        const A = Number(s.len?.A||0);
        const BL = Number((s.len?.BL!=null)?s.len.BL:((s.len?.B!=null)?s.len.B:25));
        const BR = Number((s.len?.BR!=null)?s.len.BR:((s.len?.B!=null)?s.len.B:25));
        const C = Number(s.len?.C||0);
        const minSide = Math.max(0, Math.min(BL, BR));
        const dMax = Math.max(0, minSide - 1);
        box.innerHTML = `D ≤ min(BL, BR) − 1 = <strong>${dMax}</strong>. E + H = A − C = <strong>${Math.max(0, A - C)}</strong>`;
        box.hidden = false;
      } else if (s.type==='l'){
        const B = Number(s.len?.B||0);
        box.innerHTML = `D ≤ B − 1 = <strong>${Math.max(0, B-1)}</strong>. C ≤ A − 1`;
        box.hidden = false;
      } else {
        box.hidden = true; box.textContent = '';
      }
    }

    function sideLabel(s){
      if (s==='A') return 'Top (A)';
  if (s==='B') return 'Left (B)';
  if (s==='BL') return 'Left (B-L)';
  if (s==='BR') return 'Right (B-R)';
      if (s==='C') return 'Bottom/Inner (C)';
      if (s==='D') return 'Right (D)';
      if (s==='E') return 'Bottom Left (E)';
      if (s==='H') return 'Bottom Right (H)';
      return s;
    }

    // Shape picker updates current
  all('[data-ct-shape]', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        all('.kc-shape', root).forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        // avoid converting to poly via this older handler (poly creation handled above)
        const btnType = btn.getAttribute('data-ct-shape')||'rect';
        if (btnType==='poly') return;
        if (active<0){
          const id='s'+(shapes.length+1);
          shapes.push({ id, name:'Shape '+(shapes.length+1), type:btnType, rot:0, pos:{x:300,y:300}, len:{A:60,B:25,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false} });
          active = shapes.length-1;
          shapeLabel.textContent = shapes[active].name;
          renderTabs();
        } else {
          shapes[active].type = btnType;
        }
        draw(); updateOversize();
      });
    });

    // Wall / backsplash bindings
    all('[data-ct-wall]', root).forEach(inp=>{
      inp.addEventListener('change', ()=>{
          pushHistory();
        const k = inp.getAttribute('data-ct-wall');
        shapes[active].wall[k] = !!inp.checked;
        updateSummary(); save(); draw();
      });
    });
    // Per-side backsplash controls (delegated for dynamic checkboxes)
    root.addEventListener('change', (ev)=>{
      const inp = ev.target;
      if (!(inp instanceof HTMLElement)) return;
      if (!inp.matches('[data-ct-backsplash]')) return;
      if (active<0) return;
        pushHistory();
      const k = inp.getAttribute('data-ct-backsplash'); if (!k) return;
      const s = shapes[active];
      const checked = (inp.tagName === 'INPUT') ? (inp).checked : !!inp.getAttribute('checked');
      if (s.type==='poly' && /^P\d+$/.test(k)){
        const idx = parseInt(k.slice(1),10);
        const n = Array.isArray(s.points) ? s.points.length : 0;
        if (!Array.isArray(s.bsPoly)) s.bsPoly = new Array(n).fill(false);
        if (s.bsPoly.length !== n){
          const old = s.bsPoly.slice(0);
          const next = new Array(n).fill(false);
          for (let i=0;i<Math.min(old.length, next.length);i++){ next[i] = !!old[i]; }
          s.bsPoly = next;
        }
        if (idx>=0 && idx<n) s.bsPoly[idx] = !!checked;
      } else {
        if (!s.bs) s.bs = {};
        s.bs[k] = !!checked;
      }
      updateSummary(); save(); draw();
    });
    // Polygon corner mode change
    root.addEventListener('change', (ev)=>{
      const el = ev.target;
      if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-corner-mode]')) return;
      if (active<0) return; const s = shapes[active]; if (s.type!=='poly') return;
      pushHistory();
      const idx = parseInt(el.getAttribute('data-ct-corner-mode')||'0',10);
      const n = Array.isArray(s.points)?s.points.length:0; if (idx<0||idx>=n) return;
      if (!Array.isArray(s.corners)) s.corners = new Array(n).fill(null);
      const cur = s.corners[idx] || {mode:'square', value:0};
      const mode = (el).value || 'square';
      s.corners[idx] = { mode, value: Number(cur.value||0) };
      updateSummary(); save(); draw();
    });
    // Rect/L/U corner mode change
    root.addEventListener('change', (ev)=>{
      const el = ev.target; if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-rc-corner-mode]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='rect' || s.type==='l' || s.type==='u')) return; pushHistory();
      if (!s.rcCorners) s.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
      const key = el.getAttribute('data-ct-rc-corner-mode'); const mode=(el).value||'square';
      const prev = s.rcCorners[key]||{mode:'square',value:0}; s.rcCorners[key]={mode, value:Number(prev.value||0)}; updateSummary(); save(); draw();
    });
    // Polygon corner value edit
    root.addEventListener('input', (ev)=>{
      const el = ev.target;
      if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-corner-val]')) return;
      if (active<0) return; const s = shapes[active]; if (s.type!=='poly') return;
      if ((el).value==='') return;
      if (!lenEditTimer){ pushHistory(); }
      if (lenEditTimer) clearTimeout(lenEditTimer);
      lenEditTimer = setTimeout(()=>{ lenEditTimer=null; }, 500);
      const idx = parseInt(el.getAttribute('data-ct-corner-val')||'0',10);
      const n = Array.isArray(s.points)?s.points.length:0; if (idx<0||idx>=n) return;
      if (!Array.isArray(s.corners)) s.corners = new Array(n).fill(null);
      const mode = (s.corners[idx]?.mode)||'square';
      let v = parseInt((el).value||'0',10); if (!isFinite(v)||v<0) v=0; if (v>48) v=48;
      s.corners[idx] = { mode, value: v };
      updateSummary(); save(); draw();
    });
    // Rect/L/U corner value edit
    root.addEventListener('input', (ev)=>{
      const el = ev.target; if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-rc-corner-val]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='rect' || s.type==='l' || s.type==='u')) return;
      if ((el).value==='') return; if (!lenEditTimer){ pushHistory(); } if (lenEditTimer) clearTimeout(lenEditTimer); lenEditTimer=setTimeout(()=>{ lenEditTimer=null; }, 500);
      if (!s.rcCorners) s.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
      const key = el.getAttribute('data-ct-rc-corner-val'); let v=parseFloat((el).value||'0'); if(!isFinite(v)||v<0)v=0; if(v>12)v=12;
      const mode = s.rcCorners[key]?.mode || 'square'; s.rcCorners[key]={mode, value:v}; updateSummary(); save(); draw();
    });
    // Rect/L/U corner presets
    root.addEventListener('click', (ev)=>{
      const btn = ev.target; if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-rc-corner-preset]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='rect' || s.type==='l' || s.type==='u')) return; ev.preventDefault(); pushHistory();
      if (!s.rcCorners) s.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
      const key=btn.getAttribute('data-key'); const v=Math.max(0, Math.min(12, parseFloat(btn.getAttribute('data-value')||'0')));
      const mode = s.rcCorners[key]?.mode || 'radius'; s.rcCorners[key]={mode, value:v};
      const valEl = sel(`[data-ct-rc-corner-val="${key}"]`, root); if (valEl) valEl.value=String(v);
      const selEl = sel(`[data-ct-rc-corner-mode="${key}"]`, root); if (selEl && selEl.value==='square') selEl.value='radius';
      updateSummary(); save(); draw();
    });

    // Inside-corner mode change (L/U)
    root.addEventListener('change', (ev)=>{
      const el = ev.target; if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-ic-corner-mode]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='l' || s.type==='u')) return; pushHistory();
      if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
      const key = el.getAttribute('data-ct-ic-corner-mode'); const mode=(el).value||'square';
      const prev = s.icCorners[key]||{mode:'square',value:0}; s.icCorners[key]={mode, value:Number(prev.value||0)}; updateSummary(); save(); draw();
    });
    // Inside-corner value edit (L/U)
    root.addEventListener('input', (ev)=>{
      const el = ev.target; if (!(el instanceof HTMLElement)) return;
      if (!el.matches('[data-ct-ic-corner-val]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='l' || s.type==='u')) return;
      if ((el).value==='') return; if (!lenEditTimer){ pushHistory(); } if (lenEditTimer) clearTimeout(lenEditTimer); lenEditTimer=setTimeout(()=>{ lenEditTimer=null; }, 500);
      if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
      const key = el.getAttribute('data-ct-ic-corner-val'); let v=parseFloat((el).value||'0'); if(!isFinite(v)||v<0)v=0; if(v>12)v=12;
      const mode = s.icCorners[key]?.mode || 'square'; s.icCorners[key]={mode, value:v}; updateSummary(); save(); draw();
    });
    // Inside-corner presets (L/U)
    root.addEventListener('click', (ev)=>{
      const btn = ev.target; if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-ic-corner-preset]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='l' || s.type==='u')) return; ev.preventDefault(); pushHistory();
      if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
      const key=btn.getAttribute('data-key'); const v=Math.max(0, Math.min(12, parseFloat(btn.getAttribute('data-value')||'0')));
      const mode = s.icCorners[key]?.mode || 'radius'; s.icCorners[key]={mode, value:v};
      const valEl = sel(`[data-ct-ic-corner-val="${key}"]`, root); if (valEl) valEl.value=String(v);
      const selEl = sel(`[data-ct-ic-corner-mode="${key}"]`, root); if (selEl && selEl.value==='square') selEl.value='radius';
      updateSummary(); save(); draw();
    });
    // Inside-corner apply-to-all (L/U)
    root.addEventListener('click', (ev)=>{
      const btn = ev.target; if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-ic-corner-apply-all]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='l' || s.type==='u')) return; const modeSel=sel('[data-ct-ic-corner-all-mode]', root); const valInp=sel('[data-ct-ic-corner-all-val]', root);
      const mode = modeSel ? modeSel.value : 'square'; const val = valInp ? Math.max(0, Math.min(12, parseFloat(valInp.value||'0'))) : 0; pushHistory();
      if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
      ['iTL','iTR','iBR','iBL'].forEach(k=>{ if (s.type==='l' && (k==='iTR' || k==='iBL')) return; s.icCorners[k] = { mode, value: val }; });
      updateSummary(); save(); draw();
    });
    // Corner presets handler
    root.addEventListener('click', (ev)=>{
      const btn = ev.target;
      if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-corner-preset]')) return;
      if (active<0) return; const s = shapes[active]; if (s.type!=='poly') return;
      ev.preventDefault();
      const idx = parseInt(btn.getAttribute('data-index')||'0',10);
      const v = parseFloat(btn.getAttribute('data-value')||'0');
      const n = Array.isArray(s.points)?s.points.length:0; if (idx<0||idx>=n) return;
      pushHistory();
      if (!Array.isArray(s.corners)) s.corners = new Array(n).fill(null);
      const mode = (s.corners[idx]?.mode)||'radius';
      s.corners[idx] = { mode, value: Math.max(0, Math.min(48, v)) };
      // sync UI
      const valEl = sel(`[data-ct-corner-val="${idx}"]`, root); if (valEl) valEl.value = String(s.corners[idx].value||0);
      const selEl = sel(`[data-ct-corner-mode="${idx}"]`, root); if (selEl && selEl.value==='square') selEl.value='radius';
      updateSummary(); save(); draw();
    });
    // Apply-to-all: Rect/L/U
    root.addEventListener('click', (ev)=>{
      const btn = ev.target; if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-rc-corner-apply-all]')) return; if (active<0) return;
      const s=shapes[active]; if (!(s.type==='rect' || s.type==='l' || s.type==='u')) return;
      const modeSel = sel('[data-ct-rc-corner-all-mode]', root);
      const valInp = sel('[data-ct-rc-corner-all-val]', root);
      const mode = modeSel ? modeSel.value : 'square';
      const val = valInp ? Math.max(0, Math.min(12, parseFloat(valInp.value||'0'))) : 0;
      pushHistory();
      if (!s.rcCorners) s.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
      ['TL','TR','BR','BL'].forEach(k=>{ s.rcCorners[k] = { mode, value: val }; });
      updateSummary(); save(); draw();
    });
    // Apply-to-all: Polygon
    root.addEventListener('click', (ev)=>{
      const btn = ev.target; if (!(btn instanceof HTMLElement)) return;
      if (!btn.matches('[data-ct-corner-apply-all]')) return; if (active<0) return;
      const s=shapes[active]; if (s.type!=='poly') return;
      const modeSel = sel('[data-ct-corner-all-mode]', root);
      const valInp = sel('[data-ct-corner-all-val]', root);
      const mode = modeSel ? modeSel.value : 'square';
      const val = valInp ? Math.max(0, Math.min(48, parseFloat(valInp.value||'0'))) : 0;
      const n = Array.isArray(s.points)?s.points.length:0; if (n<=0) return;
      pushHistory();
      if (!Array.isArray(s.corners)) s.corners = new Array(n).fill(null);
      for (let i=0;i<n;i++){ s.corners[i] = { mode, value: val }; }
      updateSummary(); save(); draw();
    });
    // L flip binding
    sel('[data-ct-l-flip]', root)?.addEventListener('change', (e)=>{
      const cur = shapes[active]; if (!cur || cur.type!=='l') return;
        pushHistory();
      cur.flipX = !!e.target.checked; draw(); updateSummary(); save();
    });
    // Backsplash height input
    sel('[data-ct-bs-height]', root)?.addEventListener('input', (e)=>{
  // Overhang removed

  // Seams UI removed
        pushHistory();
      let v = parseInt(e.target.value||'0',10); if(!isFinite(v)||v<0) v=0; if (v>24) v=24; opts.bsHeight = v; updateSummary(); save(); draw();
    });

    // Global backsplash toggle
    const bsOnEl = sel('[data-ct-bs-on]', root);
    if (bsOnEl){ bsOnEl.checked = !!opts.bsOn; bsOnEl.addEventListener('change', ()=>{ pushHistory(); opts.bsOn = !!bsOnEl.checked; updateSummary(); save(); draw(); }); }

    // Select/Clear all backsplash sides for current shape
    sel('[data-ct-bs-select]', root)?.addEventListener('click', ()=>{
      if (active<0 || !shapes[active]) return; pushHistory(); const s=shapes[active];
      if (s.type==='poly' && Array.isArray(s.points)){
        const n=s.points.length; if (!Array.isArray(s.bsPoly)) s.bsPoly=new Array(n).fill(false); s.bsPoly = new Array(n).fill(true);
      } else {
        s.bs = s.bs || {}; ['A','BL','BR','B','C','D','E','H'].forEach(k=>{ if (k in (s.len||{}) || ['A','B','C','D'].includes(k)) s.bs[k]=true; });
      }
      updateSummary(); save(); draw();
    });
    sel('[data-ct-bs-clear]', root)?.addEventListener('click', ()=>{
      if (active<0 || !shapes[active]) return; pushHistory(); const s=shapes[active];
      if (s.type==='poly' && Array.isArray(s.points)){
        const n=s.points.length; if (!Array.isArray(s.bsPoly)) s.bsPoly=new Array(n).fill(false); s.bsPoly = new Array(n).fill(false);
      } else {
        s.bs = s.bs || {}; Object.keys(s.bs).forEach(k=> s.bs[k]=false);
      }
      updateSummary(); save(); draw();
    });

    // Reset/Delete actions (bind to all matching buttons)
    all('[data-ct-reset]', root).forEach(el=> el.addEventListener('click', ()=>{
      if(active<0) return;
        pushHistory();
      const cur = shapes[active];
      cur.len = {A:60,B:25,C:0,D:0};
      cur.rot = 0;
      syncInputs(); draw(); updateOversize(); updateSummary();
    }));
    all('[data-ct-delete]', root).forEach(el=> el.addEventListener('click', ()=>{
        pushHistory();
        if (shapes.length <= 1) { shapes = []; active=-1; shapeLabel.textContent='No shape selected'; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary(); save(); return; }
      shapes.splice(active, 1);
      if (active >= shapes.length) active = shapes.length - 1;
      shapes.forEach((s,i)=> s.name = 'Shape ' + (i+1));
      shapeLabel.textContent = shapes[active].name;
      renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary(); save();
    }));

  // Initial draw
  // Options bindings
    // single-select buttons: data-ct-opt
  root.querySelectorAll('[data-ct-opt]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        pushHistory();
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
        pushHistory();
        const key = btn.getAttribute('data-ct-radio'); const val = btn.getAttribute('data-value');
        opts[key] = val;
    root.querySelectorAll(`[data-ct-radio="${key}"]`).forEach(b=>{ b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('is-active'); btn.setAttribute('aria-pressed','true');
    updateSummary(); save();
      });
    });
  // multi-select toggles: data-ct-multi
  root.querySelectorAll('[data-ct-multi]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        pushHistory();
        const key = btn.getAttribute('data-ct-multi'); const val = btn.getAttribute('data-value');
        if (!Array.isArray(opts[key])) opts[key] = opts[key] ? [opts[key]] : [];
        const idx = opts[key].indexOf(val);
        const on = idx === -1;
        if (on) opts[key].push(val); else opts[key].splice(idx,1);
        // update button state
        btn.classList.toggle('is-active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        updateSummary(); save();
      });
    });
    // counters: data-ct-counter with .kc-ctr-inc / .kc-ctr-dec
    // Color preference input
    sel('[data-ct-color]', root)?.addEventListener('input', (e)=>{ opts.color = e.target.value||''; updateSummary(); save(); });

    // Select and drag shapes directly in the preview
    let hitAreas = [];
    (function enableDrag(){
      const svgEl = sel('[data-ct-svg]', root);
      if (!svgEl){ return; }
      let dragging=false, start={}, orig={}, dragIdx=-1;
      let resizing=false, resizeKey=null, resizeIdx=-1, startLocal={};
      hover = -1;
      function getPoint(ev){
        const rect = svgEl.getBoundingClientRect();
        const vb = svgEl.viewBox?.baseVal || { x:0, y:0, width:rect.width, height:rect.height };
        const cX = ('touches' in ev ? ev.touches[0].clientX : ev.clientX);
        const cY = ('touches' in ev ? ev.touches[0].clientY : ev.clientY);
        const nx = (cX - rect.left) / rect.width;
        const ny = (cY - rect.top) / rect.height;
        return { x: vb.x + nx * vb.width, y: vb.y + ny * vb.height };
      }
      function pointInRotRect(px, py, cx, cy, w, h, rotDeg, pad=0){
        const rad = -rotDeg * Math.PI/180;
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const dx = px - cx, dy = py - cy;
        const lx = dx*cos - dy*sin; const ly = dx*sin + dy*cos;
        return Math.abs(lx) <= (w/2 + pad) && Math.abs(ly) <= (h/2 + pad);
      }
      function pickIndex(pt, pad=24){
        for (let i=hitAreas.length-1;i>=0;i--){ const h=hitAreas[i]; if (pointInRotRect(pt.x, pt.y, h.cx, h.cy, h.w, h.h, h.rot, pad)) return h.idx; }
        return -1;
      }
      function pickHandle(pt){
        for (let i=handles.length-1;i>=0;i--){ const h=handles[i]; const dx=pt.x-h.cx, dy=pt.y-h.cy; if ((dx*dx+dy*dy) <= Math.pow(h.r+6,2)) return {i, h}; }
        return null;
      }
      function worldToLocal(pxv, pyv, cx, cy, rotDeg){ const rad=-rotDeg*Math.PI/180; const cos=Math.cos(rad), sin=Math.sin(rad); const dx=pxv-cx, dy=pyv-cy; return { x: dx*cos - dy*sin, y: dx*sin + dy*cos }; }

      const onDown=(ev)=>{
        const pt=getPoint(ev);
        if (drawingPoly && drawingIdx>=0 && shapes[drawingIdx] && shapes[drawingIdx].type==='poly'){
          if (shapes[drawingIdx].points.length===0){ pushHistory(); }
          const s=shapes[drawingIdx];
          if (s.points.length===0){
            s.pos = { x: pt.x, y: pt.y };
            s.points.push({x:0,y:0});
          } else {
            const loc = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot||0);
            s.points.push({ x: Math.round(loc.x/2), y: Math.round(loc.y/2) });
          }
          const n = s.points.length;
          if (!Array.isArray(s.bsPoly)) s.bsPoly = new Array(n).fill(false);
          if (s.bsPoly.length !== n){
            const old = s.bsPoly.slice(0);
            const next = new Array(n).fill(false);
            for (let i=0;i<Math.min(old.length, next.length);i++){ next[i] = !!old[i]; }
            s.bsPoly = next;
          }
          active=drawingIdx; shapeLabel.textContent=s.name; draw(); save(); ev.preventDefault(); return;
        }
        if (toolMode==='resize'){
          const ph = pickHandle(pt);
          if (ph){
            pushHistory();
            const {h}=ph; resizeIdx=h.idx; resizeKey=h.key; resizing=true; isGestureActive=true; updateActionStates();
            if (gestureHintTimer) clearTimeout(gestureHintTimer);
            gestureHintTimer=setTimeout(()=>{ const gh=sel('[data-ct-gesture-hint]', root); if (gh && isGestureActive) gh.hidden=true; }, 2000);
            start=pt; const s=shapes[resizeIdx]; startLocal = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot);
            orig = { len: JSON.parse(JSON.stringify(s.len)), pos: {x:s.pos.x,y:s.pos.y} };
            ev.preventDefault(); return;
          }
        }
        if(!dragging){
          const idx=pickIndex(pt, 28);
          if (idx!==-1){
            if (idx!==active){ active=idx; shapeLabel.textContent=shapes[active].name; renderTabs(); syncInputs(); draw(); }
            if (toolMode==='move'){
              pushHistory(); dragging=true; isGestureActive=true; updateActionStates();
              if (gestureHintTimer) clearTimeout(gestureHintTimer);
              gestureHintTimer=setTimeout(()=>{ const gh=sel('[data-ct-gesture-hint]', root); if (gh && isGestureActive) gh.hidden=true; }, 2000);
              start=pt; orig={...shapes[active].pos}; dragIdx=active; ev.preventDefault();
            }
          }
        }
      };

      const snapper = (val)=> opts.snap ? Math.round(val/10)*10 : val;
      const onMove=(ev)=>{
        const pt=getPoint(ev);
        if(resizing){
          const s=shapes[resizeIdx];
          const curLocal = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot);
          let dxIn = (curLocal.x - startLocal.x) / 2;
          let dyIn = (curLocal.y - startLocal.y) / 2;
          if (opts.snap){ dxIn = Math.round(dxIn); dyIn = Math.round(dyIn); }
          const clamp=(v,min,max)=> Math.min(Math.max(v,min),max);
          const oLen = orig.len || {};
          if (resizeKey==='A-right'){
            const newA = clamp(Math.round((oLen.A||0) + dxIn), 1, 600);
            s.len.A = newA;
            if (s.type==='u'){
              const maxC = Math.max(1, newA-1);
              s.len.C = clamp(Math.round(s.len.C||1), 1, maxC);
              const spare = Math.max(0, newA - (s.len.C||1));
              let e = Math.max(0, Math.min(spare, s.len.E||0));
              let h = Math.max(0, Math.min(spare - e, s.len.H||0));
              const used = e + h;
              if (used > spare){ if (h > spare){ h = spare; e = 0; } else { e = spare - h; } }
              s.len.E = Math.round(e);
              s.len.H = Math.round(h);
            }
          } else if (resizeKey==='D'){
            if (s.type==='rect'){
              s.len.B = Math.max(1, Math.round((oLen.B||0)));
            } else if (s.type==='u'){
              const BL = Number((s.len.BL!=null)?s.len.BL:((s.len.B!=null)?s.len.B:25));
              const BR = Number((s.len.BR!=null)?s.len.BR:((s.len.B!=null)?s.len.B:25));
              const m = Math.max(0, Math.min(BL, BR));
              s.len.D = clamp(Math.round((oLen.D||0) + dyIn), 0, Math.max(0, m-1));
            } else if (s.type==='l'){
              s.len.D = clamp(Math.round((oLen.D||0) + dyIn), 0, Math.max(0, (s.len.B||0)-1));
            }
          } else if (resizeKey==='BL' && s.type==='u'){
            const curBL = (oLen.BL!=null)?oLen.BL:((oLen.B!=null)?oLen.B:25);
            const newBL = clamp(Math.round(curBL + dyIn), 1, 240);
            s.len.BL = newBL;
            const BR = Number((s.len.BR!=null)?s.len.BR:((s.len.B!=null)?s.len.B:25));
            const m = Math.max(0, Math.min(newBL, BR));
            s.len.D = Math.max(0, Math.min(Math.round(s.len.D||0), Math.max(0, m-1)));
          } else if (resizeKey==='BR' && s.type==='u'){
            const curBR = (oLen.BR!=null)?oLen.BR:((oLen.B!=null)?oLen.B:25);
            const newBR = clamp(Math.round(curBR + dyIn), 1, 240);
            s.len.BR = newBR;
            const BL = Number((s.len.BL!=null)?s.len.BL:((s.len.B!=null)?s.len.B:25));
            const m = Math.max(0, Math.min(BL, newBR));
            s.len.D = Math.max(0, Math.min(Math.round(s.len.D||0), Math.max(0, m-1)));
          } else if (['E','H'].includes(String(resizeKey)) && s.type==='u'){
            if (resizeKey==='E'){
              const maxE = Math.max(0, (s.len.A||0) - 1 - (s.len.H||0));
              s.len.E = clamp(Math.round((oLen.E||0) + dxIn), 0, maxE);
            } else if (resizeKey==='H'){
              const maxH = Math.max(0, (s.len.A||0) - 1 - (s.len.E||0));
              s.len.H = clamp(Math.round((oLen.H||0) - dxIn), 0, maxH);
            }
          } else if (resizeKey && String(resizeKey).startsWith('P-') && s.type==='poly'){
            const i = parseInt(String(resizeKey).split('-')[1]||'-1',10);
            if (Array.isArray(s.points) && i>=0){
              if (!orig.points) orig.points = s.points.map(p=> ({x:p.x, y:p.y}));
              const a = orig.points[i]; const b = orig.points[(i+1)%orig.points.length];
              const ax=a.x, ay=a.y, bx=b.x, by=b.y;
              const vx=bx-ax, vy=by-ay; const len=Math.hypot(vx,vy)||1; const nx=vx/len, ny=vy/len;
              const t = (dxIn*nx + dyIn*ny);
              const move = t;
              s.points[(i+1)%s.points.length] = { x: Math.round(bx + move*nx), y: Math.round(by + move*ny) };
            }
          } else if (resizeKey && String(resizeKey).startsWith('V-')){
            const i = parseInt(String(resizeKey).split('-')[1]||'-1',10);
            if (Array.isArray(s.points) && i>=0 && i<s.points.length){
              if (!orig.points) orig.points = s.points.map(p=> ({x:p.x, y:p.y}));
              const op = orig.points[i];
              const nx = (op.x||0) + dxIn; const ny = (op.y||0) + dyIn;
              s.points[i] = { x: Math.round(nx), y: Math.round(ny) };
            }
          } else if (resizeKey && String(resizeKey).startsWith('RC-P-') && s.type==='poly'){
            // Corner size drag for polygon: adjust corner[i].value by projecting drag along bisector direction
            const i = parseInt(String(resizeKey).split('-')[2]||'-1',10);
            if (Array.isArray(s.points) && i>=0){
              if (!orig.points) orig.points = s.points.map(p=> ({x:p.x, y:p.y}));
              const pts = orig.points; const n=pts.length;
              const p0 = pts[(i-1+n)%n], p1=pts[i], p2=pts[(i+1)%n];
              const v10 = { x: p0.x - p1.x, y: p0.y - p1.y };
              const v12 = { x: p2.x - p1.x, y: p2.y - p1.y };
              const l10=Math.hypot(v10.x,v10.y)||1, l12=Math.hypot(v12.x,v12.y)||1;
              const u10={x:v10.x/l10,y:v10.y/l10}, u12={x:v12.x/l12,y:v12.y/l12};
              // unit bisector direction inward from p1
              const bis = { x: u10.x + u12.x, y: u10.y + u12.y };
              const bl=Math.hypot(bis.x,bis.y)||1; const ub={x:bis.x/bl,y:bis.y/bl};
              const delta = (dxIn*ub.x + dyIn*ub.y);
              const nOld = (Array.isArray(s.corners) && s.corners[i]) ? Number(s.corners[i].value||0) : 0;
              const vNew = Math.max(0, Math.min(48, Math.round(nOld + delta)));
              if (!Array.isArray(s.corners)) s.corners = new Array(n).fill(null);
              const mode = (s.corners[i]?.mode)||'radius';
              s.corners[i] = { mode, value: vNew };
            }
          } else if (resizeKey && String(resizeKey).startsWith('RC-') && (s.type==='rect' || s.type==='l' || s.type==='u')){
            // Corner size drag for Rect/L/U: use average of dx,dy magnitude in local space as inches delta
            const map = { 'RC-TL':'TL','RC-TR':'TR','RC-BR':'BR','RC-BL':'BL' };
            const key = map[String(resizeKey)]||'TL';
            const prev = (s.rcCorners && s.rcCorners[key]) ? Number(s.rcCorners[key].value||0) : 0;
            const deltaIn = (Math.abs(dxIn) + Math.abs(dyIn)) / 2;
            const vNew = Math.max(0, Math.min(12, Math.round(prev + deltaIn)));
            if (!s.rcCorners) s.rcCorners = {TL:{mode:'square',value:0}, TR:{mode:'square',value:0}, BR:{mode:'square',value:0}, BL:{mode:'square',value:0}};
            const mode = s.rcCorners[key]?.mode || 'radius';
            s.rcCorners[key] = { mode, value: vNew };
          } else if (resizeKey && String(resizeKey).startsWith('IC-') && (s.type==='l' || s.type==='u')){
            const map = { 'IC-TL':'iTL','IC-TR':'iTR','IC-BR':'iBR','IC-BL':'iBL' };
            const key = map[String(resizeKey)]||'iTL';
            const prev = (s.icCorners && s.icCorners[key]) ? Number(s.icCorners[key].value||0) : 0;
            const deltaIn = (Math.abs(dxIn) + Math.abs(dyIn)) / 2;
            const vNew = Math.max(0, Math.min(12, Math.round(prev + deltaIn)));
            if (!s.icCorners) s.icCorners = { iTL:{mode:'square',value:0}, iTR:{mode:'square',value:0}, iBR:{mode:'square',value:0}, iBL:{mode:'square',value:0} };
            const mode = s.icCorners[key]?.mode || 'radius';
            s.icCorners[key] = { mode, value: vNew };
          }
          draw(); updateOversize(); updateSummary(); return;
        }
        if(!dragging){
          const idx=pickIndex(pt, 28);
          if (hover!==idx){ hover=idx; }
          let changed=false;
          let ph = null;
          if (toolMode==='resize'){
            ph = pickHandle(pt);
            svgEl.style.cursor = ph ? 'nwse-resize' : (hover!==-1 ? 'move' : 'default');
          } else {
            svgEl.style.cursor = hover!==-1 ? 'move' : 'default';
          }
          const newSig = ph ? (ph.h.key+':'+ph.i) : '';
          const oldSig = hoverHandle ? (hoverHandle.h.key+':'+hoverHandle.i) : '';
          if (newSig !== oldSig){ hoverHandle = ph; changed=true; }
          if (changed){ draw(); }
          return;
        }
        const dx=pt.x-start.x, dy=pt.y-start.y; shapes[dragIdx].pos={x:snapper(orig.x+dx),y:snapper(orig.y+dy)}; draw();
      };

      const onUp=()=>{
        if(resizing){
          resizing=false; resizeIdx=-1; resizeKey=null; hoverHandle=null; isGestureActive=false;
          if (gestureHintTimer) clearTimeout(gestureHintTimer);
          try{ const pop=sel('[data-ct-gesture-pop]', root); if (pop) pop.hidden=true; }catch(e){}
          updateActionStates(); save(); return;
        }
        if(!dragging) return;
        dragging=false; dragIdx=-1; isGestureActive=false;
        if (gestureHintTimer) clearTimeout(gestureHintTimer);
        try{ const pop=sel('[data-ct-gesture-pop]', root); if (pop) pop.hidden=true; }catch(e){}
        updateActionStates(); save();
      };

      svgEl.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      svgEl.addEventListener('touchstart', onDown, {passive:false});
      window.addEventListener('touchmove', onMove, {passive:false});
      window.addEventListener('touchend', onUp);
      window.addEventListener('keydown', (ev)=>{
        if (ev.key !== 'Escape') return;
        try{ const pop = sel('[data-ct-gesture-pop]', root); if (pop && !pop.hidden){ pop.hidden = true; } }catch(e){}
        if (!dragging && !resizing) return;
        ev.preventDefault();
        undo();
        dragging=false; dragIdx=-1; resizing=false; resizeIdx=-1; resizeKey=null; hoverHandle=null; isGestureActive=false; updateActionStates();
        announce('Canceled'); try{ toast('Canceled'); }catch(e){}
      });
      svgEl.addEventListener('dblclick', ()=>{ if(drawingPoly){ pushHistory(); drawingPoly=false; drawingIdx=-1; save(); draw(); } });
    })();
  // Reposition inline inputs on resize/scroll
  window.addEventListener('resize', ()=>{ if (inlineHost) { try{ renderInlineInputs(); }catch(e){} } });
  window.addEventListener('scroll', ()=>{ if (inlineHost) { try{ renderInlineInputs(); }catch(e){} } }, true);

    // Toolbar bindings
    root.querySelectorAll('.kc-ct-toolbar [data-ct-tool]')?.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const type = btn.getAttribute('data-ct-tool')||'move';
        if (type==='shapes'){
          const panelBtn = sel('[data-ct-panel="shapes"]', root); if (panelBtn) panelBtn.click();
          // restore Move active
          root.querySelectorAll('.kc-ct-toolbar .kc-tool').forEach(b=> b.classList.remove('is-active'));
          const mv = sel('.kc-ct-toolbar [data-ct-tool="move"]', root); if (mv){ mv.classList.add('is-active'); }
          toolMode='move'; mode='move';
          root.querySelectorAll('[data-ct-tool-mode]').forEach(b=> b.classList.toggle('is-active', (b.getAttribute('data-ct-tool-mode')||'move')==='move'));
          return;
        }
        if (type==='resize'){
          const panelBtn = sel('[data-ct-panel="measure"]', root); if (panelBtn) panelBtn.click();
        }
        root.querySelectorAll('.kc-ct-toolbar .kc-tool').forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        toolMode = type;
        // sync left palette
        root.querySelectorAll('[data-ct-tool-mode]').forEach(b=>{
          const name = b.getAttribute('data-ct-tool-mode') || 'move';
          b.classList.toggle('is-active', name===toolMode);
        });
        mode = toolMode;
        // redraw to reflect handle visibility for the new mode
        draw();
      });
    });
  // Undo / Redo toolbar buttons
  sel('[data-ct-undo]', root)?.addEventListener('click', ()=>{ undo(); });
  sel('[data-ct-redo]', root)?.addEventListener('click', ()=>{ redo(); });
  // Gesture cancel button
  sel('[data-ct-gesture-cancel]', root)?.addEventListener('click', (e)=>{ e.preventDefault(); if (isGestureActive) { undo(); isGestureActive=false; updateActionStates(); announce('Canceled'); try{ toast('Canceled'); }catch(e){} } });
  // Help popover toggle
  sel('[data-ct-gesture-help]', root)?.addEventListener('click', (e)=>{ e.preventDefault(); const pop = sel('[data-ct-gesture-pop]', root); if (!pop) return; pop.hidden = !pop.hidden; });
  // Duplicate already bound to all matching buttons above
  const svgView = sel('[data-ct-svg]', root);
  function applyZoom(){ svgView.setAttribute('viewBox', `0 0 ${600/zoom} ${600/zoom}`); }
  sel('[data-ct-zoom-in]', root)?.addEventListener('click', ()=>{ zoom=Math.min(3, zoom+0.2); applyZoom(); draw(); });
  sel('[data-ct-zoom-out]', root)?.addEventListener('click', ()=>{ zoom=Math.max(0.4, zoom-0.2); applyZoom(); draw(); });
    root.querySelectorAll('[data-ct-counter]').forEach(box=>{
      const key = box.getAttribute('data-ct-counter');
      const valEl = box.querySelector('.kc-ctr-val');
      const sync = ()=>{ valEl.textContent = String(opts[key]); };
  box.querySelector('.kc-ctr-inc')?.addEventListener('click', ()=>{ pushHistory(); opts[key] = (opts[key]||0)+1; sync(); updateSummary(); save(); });
  box.querySelector('.kc-ctr-dec')?.addEventListener('click', ()=>{ pushHistory(); opts[key] = Math.max(0,(opts[key]||0)-1); sync(); updateSummary(); save(); });
      sync();
    });

    // keyboard nudging for active shape
    root.addEventListener('keydown', (e)=>{
      if (drawingPoly){
        if (e.key==='Enter'){ pushHistory(); drawingPoly=false; drawingIdx=-1; draw(); save(); }
        if (e.key==='Escape'){ // cancel drawing: remove empty poly
          if (drawingIdx>=0 && shapes[drawingIdx] && Array.isArray(shapes[drawingIdx].points) && shapes[drawingIdx].points.length<3){ shapes.splice(drawingIdx,1); active=Math.max(-1, Math.min(active, shapes.length-1)); }
          drawingPoly=false; drawingIdx=-1; draw(); save();
        }
        return;
      }
      // Undo/Redo shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase()==='z'){ e.preventDefault(); undo(); return; }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase()==='y' || (e.shiftKey && e.key.toLowerCase()==='z'))){ e.preventDefault(); redo(); return; }
      if (active<0) return;
      const step = opts.snap ? 10 : 2;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        e.preventDefault();
        pushHistory();
        const p = shapes[active].pos;
        if (e.key==='ArrowLeft') p.x -= step;
        if (e.key==='ArrowRight') p.x += step;
        if (e.key==='ArrowUp') p.y -= step;
        if (e.key==='ArrowDown') p.y += step;
        draw(); save();
      }
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
      root.querySelectorAll('[data-ct-multi]').forEach(btn=>{
        const key=btn.getAttribute('data-ct-multi'); const val=btn.getAttribute('data-value');
        const list = Array.isArray(opts[key]) ? opts[key] : (opts[key] ? [opts[key]] : []);
        const on = list.includes(val); btn.classList.toggle('is-active', on); btn.setAttribute('aria-pressed', on?'true':'false');
      });
      root.querySelectorAll('[data-ct-counter]').forEach(box=>{
        const key = box.getAttribute('data-ct-counter'); const valEl = box.querySelector('.kc-ctr-val');
        if (valEl) valEl.textContent = String(opts[key]||0);
      });
  // Overhang/Seams UI state
  // Overhang removed
  const seamShow = sel('[data-ct-seam-show]', root); if (seamShow){ seamShow.checked = !!opts.showSeams; }
    }

    function updateSummary(){
  const piecesEl = sel('[data-ct-sum-pieces]', root);
      const areaEl = sel('[data-ct-sum-area]', root);
  const matEl = sel('[data-ct-sum-material]', root);
      const edgeEl = sel('[data-ct-sum-edge]', root);
      const sinksEl = sel('[data-ct-sum-sinks]', root);
  const colorEl = sel('[data-ct-sum-color]', root);
      const cutCookEl = sel('[data-ct-sum-cut-cooktop]', root);
      const cutFaucEl = sel('[data-ct-sum-cut-faucet]', root);
      const cutOtherEl = sel('[data-ct-sum-cut-other]', root);
      const removalEl = sel('[data-ct-sum-removal]', root);
  const seamsEl = sel('[data-ct-sum-seams]', root);
      if (piecesEl) piecesEl.textContent = String(shapes.length);
      // area: rect A*B, U: A*(BL+BR)/2 - C*(min(BL,BR)-D), L: A*B - (A-C)*(B-D)
  const totalSqIn = shapes.reduce((acc,s)=>{
        const A=Number(s.len?.A||0), B=Number(s.len?.B||0), C=Number(s.len?.C||0), D=Number(s.len?.D||0);
        if (s.type==='u'){
          const BL = Number((s.len?.BL!=null)?s.len.BL:((s.len?.B!=null)?s.len.B:25));
          const BR = Number((s.len?.BR!=null)?s.len.BR:((s.len?.B!=null)?s.len.B:25));
          const minSide = Math.max(0, Math.min(BL, BR));
          return acc + (A*((BL+BR)/2) - Math.max(0, C*Math.max(0, minSide - D)));
        }
        if (s.type==='l') return acc + (A*B - Math.max(0, (A-C)*Math.max(0, B-D)));
        if (s.type==='poly' && Array.isArray(s.points) && s.points.length>=3){
          // shoelace formula (in^2) on local-inch points
          let area=0; for (let i=0;i<s.points.length;i++){ const p1=s.points[i], p2=s.points[(i+1)%s.points.length]; area += (p1.x*p2.y - p2.x*p1.y); } area=Math.abs(area)/2; return acc + area;
        }
        return acc + (A*B);
      }, 0);
  const sqFt = totalSqIn/144; const sqFtTxt = (Math.round(sqFt*10)/10).toFixed(1); if (areaEl) areaEl.textContent = sqFtTxt;
  if (matEl) matEl.textContent = Array.isArray(opts.material)? (opts.material.join(', ')||'') : (opts.material||'');
      if (edgeEl) edgeEl.textContent = opts.edge||'';
      if (sinksEl) sinksEl.textContent = opts.sinks||'';
  if (colorEl) colorEl.textContent = opts.color||'-';
      if (cutCookEl) cutCookEl.textContent = String(opts['cutout-cooktop']||0);
      if (cutFaucEl) cutFaucEl.textContent = String(opts['cutout-faucet']||0);
      if (cutOtherEl) cutOtherEl.textContent = String(opts['cutout-other']||0);
  if (removalEl) removalEl.textContent = opts.removal||'';
  if (seamsEl){ const seamCount = shapes.reduce((acc,s)=> acc + (Array.isArray(s.seams)? s.seams.length:0), 0); seamsEl.textContent = String(seamCount); }
      // Mini summary mirrors
      const pMini = sel('[data-ct-sum-pieces-mini]', root); if (pMini) pMini.textContent = String(shapes.length);
      const aMini = sel('[data-ct-sum-area-mini]', root); if (aMini) aMini.textContent = sqFtTxt;
      const sMini = sel('[data-ct-sum-seams-mini]', root); if (sMini){ const seamCount = shapes.reduce((acc,s)=> acc + (Array.isArray(s.seams)? s.seams.length:0), 0); sMini.textContent = String(seamCount); }
    }

    // Load saved state if present
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if (raw){
        const parsed = JSON.parse(raw);
  if (parsed && Array.isArray(parsed.shapes) && parsed.opts){ shapes = parsed.shapes.map(normalizeShape); active = Math.max(0, Math.min(parsed.active||0, shapes.length-1)); }
        if (parsed && parsed.opts) Object.assign(opts, parsed.opts);
        // migrate material to array if stored as string
        if (typeof opts.material === 'string') opts.material = opts.material ? [opts.material] : [];
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

    // Snap toggle
  const snapEl = sel('[data-ct-snap]', root); if (snapEl){ snapEl.checked = !!opts.snap; snapEl.addEventListener('change', ()=>{ pushHistory(); opts.snap = !!snapEl.checked; save(); }); }

    // Export current config
    sel('[data-ct-export]', root)?.addEventListener('click', ()=>{
      const blob = new Blob([JSON.stringify({shapes,active,opts}, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a=document.createElement('a'); a.href=url; a.download='countertop-config.json'; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
    });
    // Import config
    sel('[data-ct-import]', root)?.addEventListener('click', ()=> sel('[data-ct-import-input]', root)?.click());
    sel('[data-ct-import-input]', root)?.addEventListener('change', (e)=>{
      const f=e.target.files?.[0]; if(!f) return; const reader=new FileReader(); reader.onload=()=>{
        try{
          const data=JSON.parse(String(reader.result||'{}'));
          if (data && Array.isArray(data.shapes) && data.opts){
            shapes=data.shapes.map(normalizeShape); active=Math.max(-1, Math.min(data.active??-1, shapes.length-1)); Object.assign(opts, data.opts);
            renderTabs(); syncInputs(); syncOptionsUI(); draw(); updateOversize(); updateActionStates(); updateSummary(); save();
          }
        }catch(err){}
      }; reader.readAsText(f);
    });

  // do not auto-open panels so controls show only when selected
  shapeLabel.textContent = (active>=0 && shapes[active]) ? shapes[active].name : 'No shape selected'; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); syncOptionsUI(); updateSummary(); save();
  }

  function boot(){
    document.querySelectorAll('.kc-ct-configurator').forEach(init);
  }
  // Expose a tiny runtime for diagnostics/manual boot
  try{
    window.KC_CT = window.KC_CT || {};
  window.KC_CT.version = '2025-09-22T29';
    window.KC_CT.init = init;
    window.KC_CT.initAll = boot;
  }catch(e){}

  // Auto-boot now and also watch for late-added nodes (e.g., injected at footer)
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  try{
    const mo = new MutationObserver((mutations)=>{
      for (const m of mutations){
        if (!m.addedNodes) continue;
        m.addedNodes.forEach(n=>{
          if (!(n instanceof Element)) return;
          if (n.classList && n.classList.contains('kc-ct-configurator')) { init(n); }
          n.querySelectorAll && n.querySelectorAll('.kc-ct-configurator').forEach(init);
        });
      }
    });
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }catch(e){}
})();
