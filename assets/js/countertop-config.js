(function(){
  const sel = (s, el=document)=> el.querySelector(s);
  const all = (s, el=document)=> Array.from(el.querySelectorAll(s));

  function init(root){
    if (!root || root.__ctInit) return; root.__ctInit = true;
    const svg = sel('[data-ct-svg]', root);
    const shapeLabel = sel('[data-ct-shape-label]', root);
  const actions = root;
  let mode = 'move'; // move | resize

  // Simple multi-shape state
  let shapes = [];
  let active = -1;
  let hover = -1;
  let handles = [];
  // Global options state (not per shape for now)
  const opts = {
    material: ['Laminate'], edge: 'Bevel',
    sinks: 'No',
    'cutout-cooktop': 0, 'cutout-faucet': 0, 'cutout-other': 0,
    'corner-small': 0, 'corner-medium': 0, 'corner-large': 0,
    removal: 'Countertops Only',
    color: '',
  bsHeight: 4,
  snap: true,
  showSeams: false
  };
  const STATE_KEY = 'kcCountertopConfig:v1';
  let toolMode = 'move';
  let zoom = 1;

    function draw(){
  svg.innerHTML = '';
      const ns = 'http://www.w3.org/2000/svg';
      const gRoot = document.createElementNS(ns, 'g');
      svg.appendChild(gRoot);

      const px = (v)=> v * 2; // 2px per inch roughly
      hitAreas = [];
      handles = [];

  const addHandle=(idx, cx, cy, rot, key)=>{
        handles.push({ idx, cx, cy, rot, key, r:8 });
        // visual circle
        const g=document.createElementNS(ns,'g');
        g.setAttribute('transform', `rotate(${rot} ${cx} ${cy})`);
        const c=document.createElementNS(ns,'circle');
        c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r','6');
        c.setAttribute('fill','#fff'); c.setAttribute('stroke','#4f6bd8'); c.setAttribute('stroke-width','2');
        if (idx===active) gRoot.appendChild(g), g.appendChild(c);
      };

      const labelNumbers=(parent, cx, cy, cur, dims)=>{
        const mk=(x,y,txt)=>{ const t=document.createElementNS(ns,'text'); t.setAttribute('x',String(x)); t.setAttribute('y',String(y)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','14'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#2d4a7a'); t.textContent=txt; parent.appendChild(t); };
        const a=Number(dims.A||cur.len?.A||0), b=Number(dims.B||cur.len?.B||0), c=Number(dims.C||cur.len?.C||0), d=Number(dims.D||cur.len?.D||0);
        // outer labels
        mk(cx, cy - (px(b)/2) - 10, `${a}\"`);
        mk(cx - (px(a)/2) - 16, cy, `B`);
        mk(cx + (px(a)/2) + 16, cy, `D`);
        // add numeric ticks for B and D along the mid points
        const ty = cy - (px(b)/2) + px(b)/2; // center Y
        const leftTxt=document.createElementNS(ns,'text'); leftTxt.setAttribute('x', String(cx - (px(a)/2) - 22)); leftTxt.setAttribute('y', String(ty)); leftTxt.setAttribute('text-anchor','end'); leftTxt.setAttribute('font-size','12'); leftTxt.textContent = `${b}\"`; parent.appendChild(leftTxt);
        const rightTxt=document.createElementNS(ns,'text'); rightTxt.setAttribute('x', String(cx + (px(a)/2) + 22)); rightTxt.setAttribute('y', String(ty)); rightTxt.setAttribute('text-anchor','start'); rightTxt.setAttribute('font-size','12'); rightTxt.textContent = `${d}\"`; parent.appendChild(rightTxt);
        // inner where applicable
        if (cur.type==='u'){
          const aPx=px(a), bPx=px(b), cPx=px(c), dPx=px(d);
          const innerTopY = cy - bPx/2 + dPx; const innerLeftX = cx - aPx/2 + px(26); // approx offset for readability
          mk(cx, innerTopY - 6, `${c}\"`);
          mk(innerLeftX - 20, cy + (bPx/2) - (bPx - dPx)/2, `${b-d}\"`);
        }
        if (cur.type==='l'){
          // show inner legs
          mk(cx - 30, cy + 14, `${d||0}\"`);
        }
      };

  shapes.forEach((cur, idx)=>{
  const centerX = cur.pos?.x ?? 300;
  const centerY = cur.pos?.y ?? 300;
        const len = cur.len; const shape = cur.type; const rotation = cur.rot;

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
                r.setAttribute('fill', '#ffd8a6'); r.setAttribute('stroke','none'); rotG.appendChild(r);
              }
            });
          }

          // main top surface
          const rect = document.createElementNS(ns, 'rect');
          rect.setAttribute('x', String(centerX - w/2));
          rect.setAttribute('y', String(centerY - h/2));
          rect.setAttribute('width', String(w));
          rect.setAttribute('height', String(h));
          rect.setAttribute('fill', '#f8c4a0');
          rect.setAttribute('stroke', '#ccc');
          rect.setAttribute('stroke-width', '2');
          rotG.appendChild(rect);

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

          gRoot.appendChild(rotG);
          labelDims(rotG, centerX, centerY, len.A, len.B);
          labelNumbers(rotG, centerX, centerY, cur, {A:len.A,B:len.B});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w, h, rot:rotation });
          if (idx===active){
            // resize handles for A (width) and B (depth)
            // top mid adjusts B
            addHandle(idx, centerX, centerY - h/2, rotation, 'B');
            // right mid adjusts A
            addHandle(idx, centerX + w/2, centerY, rotation, 'A');
          }

  } else if (shape==='l'){
          // L as outer A x B minus inner notch sized by C (width) and D (height)
          let aIn = Number(len.A||60), bIn = Number(len.B||25), cIn = Number(len.C||20), dIn = Number(len.D||10);
          if (cIn >= aIn) cIn = Math.max(0, aIn - 1);
          if (dIn >= bIn) dIn = Math.max(0, bIn - 1);
          const a = px(aIn), b = px(bIn), c = px(cIn), d = px(dIn);
          const x = centerX - a/2, y = centerY - b/2;
          const xi = centerX - a/2 + c, yi = centerY - b/2 + d, wi = a - c, hi = b - d;
          const path = document.createElementNS(ns, 'path');
          const dPath = [
            `M ${x} ${y} h ${a} v ${b} h ${-a} Z`,
            `M ${xi} ${yi} h ${wi} v ${hi} h ${-wi} Z`
          ].join(' ');
          path.setAttribute('d', dPath);
          path.setAttribute('fill', '#f8c4a0');
          path.setAttribute('fill-rule', 'evenodd');
          path.setAttribute('stroke', '#ccc');
          path.setAttribute('stroke-width', '2');
          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

          // backsplash approx for L bounding box
          { const aBox=a, bBox=b; const bh = px(Number(opts.bsHeight||0)); if (bh>0){ ['A','B','C','D'].forEach(side=>{ if (cur.bs[side]){ const r = document.createElementNS(ns,'rect'); if (side==='A'){ r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(centerY - bBox/2 - bh)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); } if (side==='B'){ r.setAttribute('x', String(centerX - aBox/2 - bh)); r.setAttribute('y', String(centerY - bBox/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(bBox)); } if (side==='C'){ r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(centerY + bBox/2)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); } if (side==='D'){ r.setAttribute('x', String(centerX + aBox/2)); r.setAttribute('y', String(centerY - bBox/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(bBox)); } r.setAttribute('fill','#ffd8a6'); r.setAttribute('stroke','none'); rotG.appendChild(r); } }); } }
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

          gRoot.appendChild(rotG);
          labelDims(rotG, centerX, centerY, aIn, bIn);
          labelNumbers(rotG, centerX, centerY, cur, {A:aIn,B:bIn});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w:a, h:b, rot:rotation });
          if (idx===active){
            // top adjusts B, right adjusts A
            addHandle(idx, centerX, centerY - b/2, rotation, 'B');
            addHandle(idx, centerX + a/2, centerY, rotation, 'A');
          }

  } else if (shape==='u'){
          // Use A (outer width), B (outer height), C (inner opening width), D (inner opening depth)
          let aIn = Number(len.A||60), bIn = Number(len.B||25), cIn = Number(len.C||20), dIn = Number(len.D||10);
          // clamp to keep geometry valid
          if (cIn >= aIn) cIn = Math.max(0, aIn - 1);
          if (dIn >= bIn) dIn = Math.max(0, bIn - 1);
          const a = px(aIn), b = px(bIn), c = px(cIn), d = px(dIn);
          const x = centerX - a/2, y = centerY - b/2;
          // inner notch is centered horizontally, starts d from top, extends to bottom
          const xi = centerX - c/2, yi = y + d, wi = c, hi = b - d;

          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

          // backsplash along outer bounding box
          { const aBox=a, bBox=b; const bh = px(Number(opts.bsHeight||0)); if (bh>0){ ['A','B','C','D'].forEach(side=>{ if (cur.bs[side]){ const r = document.createElementNS(ns,'rect'); if (side==='A'){ r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(centerY - bBox/2 - bh)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); } if (side==='B'){ r.setAttribute('x', String(centerX - aBox/2 - bh)); r.setAttribute('y', String(centerY - bBox/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(bBox)); } if (side==='C'){ r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(centerY + bBox/2)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); } if (side==='D'){ r.setAttribute('x', String(centerX + aBox/2)); r.setAttribute('y', String(centerY - bBox/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(bBox)); } r.setAttribute('fill','#ffd8a6'); r.setAttribute('stroke','none'); rotG.appendChild(r); } }); } }
          // seams for U (bounding-box approximation)
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

          // U shape as outer rect minus inner notch (evenodd)
          const path = document.createElementNS(ns, 'path');
          const dPath = [
            `M ${x} ${y} h ${a} v ${b} h ${-a} Z`,
            `M ${xi} ${yi} h ${wi} v ${hi} h ${-wi} Z`
          ].join(' ');
          path.setAttribute('d', dPath);
          path.setAttribute('fill', '#f8c4a0');
          path.setAttribute('fill-rule', 'evenodd');
          path.setAttribute('stroke', '#ccc');
          path.setAttribute('stroke-width', '2');
          rotG.appendChild(path);

          // wall sides as red lines along outer bounding box
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

          gRoot.appendChild(rotG);
          labelDims(rotG, centerX, centerY, aIn, bIn);
          labelNumbers(rotG, centerX, centerY, cur, {A:aIn,B:bIn,C:cIn,D:dIn});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w:a, h:b, rot:rotation });
          if (idx===active){
            // outer handles: top adjusts B, right adjusts A
            addHandle(idx, centerX, centerY - b/2, rotation, 'B');
            addHandle(idx, centerX + a/2, centerY, rotation, 'A');
            // inner C/D
            const xi = centerX - (px(aIn))/2 + px((aIn - cIn)/2) + px(cIn)/2; // inner top center
            const yi = centerY - (px(bIn))/2 + px(dIn);
            addHandle(idx, centerX, yi, rotation, 'C');
            // inner left mid for D depth (use left inner vertical center)
            const innerLeftX = centerX - (px(aIn))/2 + (px(aIn)-px(cIn))/2; // approx inner left x
            const innerMidY = centerY + (px(bIn)-px(dIn))/2 - px(bIn)/2 + px(dIn);
            addHandle(idx, innerLeftX, innerMidY, rotation, 'D');
          }
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
      });
    });
    root.querySelectorAll('[data-ct-panel]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const p = btn.getAttribute('data-ct-panel');
        root.querySelectorAll('.kc-panel').forEach(panel=> panel.hidden = true);
        const pane = sel('.kc-panel-' + p, root); if (pane) pane.hidden = false;
      });
    });

    // Create shapes from panel
  root.querySelectorAll('[data-ct-shape]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
  const type = btn.getAttribute('data-ct-shape')||'rect';
  const a = parseInt(btn.getAttribute('data-ct-len-a')||'60',10);
  const b = parseInt(btn.getAttribute('data-ct-len-b')||'25',10);
  const c = parseInt(btn.getAttribute('data-ct-len-c')|| (type==='rect'?'0':'20'),10);
  const d = parseInt(btn.getAttribute('data-ct-len-d')|| (type==='rect'?'0':'10'),10);
        const id='s'+(shapes.length+1);
  shapes.push({ id, name:'Shape '+(shapes.length+1), type, rot:0, pos:{x:300,y:300}, len:{A:a,B:b,C:c,D:d}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] });
        active = shapes.length-1; shapeLabel.textContent = shapes[active].name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Layout presets
  root.querySelectorAll('[data-ct-layout]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const layout = btn.getAttribute('data-ct-layout');
    const add = (type,len)=>{ const id='s'+(shapes.length+1); shapes.push({ id, name:'Shape '+(shapes.length+1), type, rot:0, pos:{x:300,y:300}, len, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, oh:{A:false,B:false,C:false,D:false}, seams:[] }); active=shapes.length-1; };
        if (layout==='straight') add('rect', {A:96,B:25,C:0,D:0});
        if (layout==='l-standard') add('l', {A:120,B:96,C:26,D:26});
        if (layout==='u-standard') add('u', {A:180,B:100,C:129,D:26});
        shapeLabel.textContent = shapes[active].name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Duplicate handler (reused for toolbar + sidebar)
    const onDuplicate = ()=>{
      if (active<0) return;
      const s=shapes[active];
      const copy=JSON.parse(JSON.stringify(s));
      copy.id='s'+(shapes.length+1);
      copy.name='Shape '+(shapes.length+1);
      copy.pos={x:s.pos.x+20,y:s.pos.y+20};
      shapes.push(copy); active=shapes.length-1;
      shapeLabel.textContent=copy.name; renderTabs(); draw(); updateSummary(); save();
    };
    all('[data-ct-duplicate]', root).forEach(el=> el.addEventListener('click', onDuplicate));

    // Measurement label guides around the shape
    function labelDims(parent, cx, cy, A, B){
      const ns='http://www.w3.org/2000/svg';
      const make = (x1,y1,x2,y2,txt)=>{
        const g=document.createElementNS(ns,'g');
        const line=document.createElementNS(ns,'line');
        line.setAttribute('x1',x1); line.setAttribute('y1',y1); line.setAttribute('x2',x2); line.setAttribute('y2',y2);
        line.setAttribute('stroke','#bbb'); line.setAttribute('stroke-width','2');
        const t=document.createElementNS(ns,'text');
        t.setAttribute('x', (x1+x2)/2); t.setAttribute('y', (y1+y2)/2 - 6);
        t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=txt;
        g.appendChild(line); g.appendChild(t); parent.appendChild(g);
      };
      const px=(v)=> v*2;
      // Use the provided A/B values for text but position with fixed offsets around center
      make(cx-100, cy-80, cx+100, cy-80, 'A');
      make(cx-140, cy-60, cx-140, cy+60, 'B');
      make(cx-100, cy+80, cx+100, cy+80, 'C');
      make(cx+140, cy-60, cx+140, cy+60, 'D');
    }

  // (shape selection handled below in a single place)

  // Bind rotate controls across toolbar/sidebar
  all('[data-ct-rotate-left]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; shapes[active].rot = (shapes[active].rot + 270)%360; draw(); }));
  all('[data-ct-rotate-right]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; shapes[active].rot = (shapes[active].rot + 90)%360; draw(); }));

  all('[data-ct-len]', root).forEach(inp=>{
      inp.addEventListener('input', ()=>{
    if(active<0) return;
    const k = inp.getAttribute('data-ct-len');
  let v = parseInt(inp.value||'0',10); if(!isFinite(v)||v<0) v=0; shapes[active].len[k] = v; draw(); updateOversize(); updateSummary(); save();
      });
    });

    function updateOversize(){
      // Any piece with any side over 120 inches triggers the alert
      const limit = 120;
      const over = shapes.some(s=>{
        const len = s.len||{};
        return (Number(len.A||0)>limit) || (Number(len.B||0)>limit) || (Number(len.C||0)>limit) || (Number(len.D||0)>limit);
      });
      const alertEl = sel('[data-ct-alert]', root);
      if (alertEl) alertEl.hidden = !over;
    }

  function updateActionStates(){
  const del = sel('[data-ct-delete]', root);
  const rst = sel('[data-ct-reset]', root);
  if (del) del.disabled = shapes.length <= 0;
  if (rst) rst.disabled = (active<0);
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
        all('[data-ct-backsplash]', root).forEach(inp=>{ inp.checked = false; inp.disabled = true; });
        all('[data-ct-shape]', root).forEach(btn=> btn.classList.remove('is-active'));
    const rowC = sel('[data-row-c]', root); const rowD = sel('[data-row-d]', root);
    if (rowC) rowC.style.display='none'; if (rowD) rowD.style.display='none';
      } else {
        all('[data-ct-len]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-len'); inp.value = String(cur.len[k]||0); });
        all('[data-ct-wall]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-wall'); inp.checked = !!cur.wall[k]; });
        all('[data-ct-backsplash]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-backsplash'); inp.checked = !!cur.bs[k]; });
        all('[data-ct-shape]', root).forEach(btn=> btn.classList.toggle('is-active', btn.getAttribute('data-ct-shape')===cur.type));
    const rowC = sel('[data-row-c]', root); const rowD = sel('[data-row-d]', root);
    const showInner = (cur.type==='u' || cur.type==='l');
    if (rowC) rowC.style.display = showInner ? '' : 'none';
    if (rowD) rowD.style.display = showInner ? '' : 'none';
      }
      const bsH = sel('[data-ct-bs-height]', root); if (bsH) bsH.value = String(opts.bsHeight||0);
    }

    // Shape picker updates current
  all('[data-ct-shape]', root).forEach(btn=>{
      btn.addEventListener('click', ()=>{
        all('.kc-shape', root).forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        if (active<0){
          const id='s'+(shapes.length+1);
          shapes.push({ id, name:'Shape '+(shapes.length+1), type:btn.getAttribute('data-ct-shape')||'rect', rot:0, pos:{x:300,y:300}, len:{A:60,B:25,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false} });
          active = shapes.length-1;
          shapeLabel.textContent = shapes[active].name;
          renderTabs();
        } else {
          shapes[active].type = btn.getAttribute('data-ct-shape')||'rect';
        }
        draw(); updateOversize();
      });
    });

    // Wall / backsplash bindings
    all('[data-ct-wall]', root).forEach(inp=>{
      inp.addEventListener('change', ()=>{
        const k = inp.getAttribute('data-ct-wall');
        shapes[active].wall[k] = !!inp.checked;
        updateSummary(); save(); draw();
      });
    });
    // Per-side backsplash controls
    all('[data-ct-backsplash]', root).forEach(inp=>{
      inp.addEventListener('change', ()=>{
        const k = inp.getAttribute('data-ct-backsplash');
        shapes[active].bs[k] = !!inp.checked;
        updateSummary(); save(); draw();
      });
    });
    // Backsplash height input
    sel('[data-ct-bs-height]', root)?.addEventListener('input', (e)=>{
  // Overhang removed

    // Seams
    sel('[data-ct-seam-show]', root)?.addEventListener('change', (e)=>{ opts.showSeams = !!e.target.checked; save(); draw(); });
    sel('[data-ct-seam-clear]', root)?.addEventListener('click', ()=>{ shapes.forEach(s=> s.seams=[]); save(); draw(); });
    sel('[data-ct-seam-suggest]', root)?.addEventListener('click', ()=>{
      // simple suggestion: add vertical seams every 96 inches if A > 120
      shapes.forEach(s=>{
        const A = Number(s.len?.A||0);
        const seams=[];
        if (A>120){ const span=96; for(let x=span; x<A; x+=span){ seams.push({type:'v', atIn: x - A/2}); } }
        s.seams = seams;
      });
      save(); draw();
    });
      let v = parseInt(e.target.value||'0',10); if(!isFinite(v)||v<0) v=0; if (v>24) v=24; opts.bsHeight = v; updateSummary(); save(); draw();
    });

    // Reset/Delete actions (bind to all matching buttons)
    all('[data-ct-reset]', root).forEach(el=> el.addEventListener('click', ()=>{
      if(active<0) return;
      const cur = shapes[active];
      cur.len = {A:60,B:25,C:0,D:0};
      cur.rot = 0;
      syncInputs(); draw(); updateOversize(); updateSummary();
    }));
    all('[data-ct-delete]', root).forEach(el=> el.addEventListener('click', ()=>{
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
  // multi-select toggles: data-ct-multi
  root.querySelectorAll('[data-ct-multi]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
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
      let dragging=false, start={}, orig={}, dragIdx=-1;
      let resizing=false, resizeKey=null, resizeIdx=-1, startLocal={};
      hover = -1;
  const svgEl = sel('[data-ct-svg]', root);
      function getPoint(ev){
        const rect = svgEl.getBoundingClientRect();
        const vb = svgEl.viewBox?.baseVal || { x:0, y:0, width:rect.width, height:rect.height };
        const cX = ('touches' in ev ? ev.touches[0].clientX : ev.clientX);
        const cY = ('touches' in ev ? ev.touches[0].clientY : ev.clientY);
        const nx = (cX - rect.left) / rect.width; // 0..1
        const ny = (cY - rect.top) / rect.height; // 0..1
        return { x: vb.x + nx * vb.width, y: vb.y + ny * vb.height };
      }
      function pointInRotRect(px, py, cx, cy, w, h, rotDeg, pad=0){
        const rad = -rotDeg * Math.PI/180; // inverse rotate
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
        if (toolMode==='resize'){
          const ph = pickHandle(pt);
          if (ph){ const {h}=ph; resizeIdx=h.idx; resizeKey=h.key; resizing=true; start=pt; const s=shapes[resizeIdx]; startLocal = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot); orig = JSON.parse(JSON.stringify(s.len)); ev.preventDefault(); return; }
        }
        const idx=pickIndex(pt, 28);
        if (idx!==-1){
          if (idx!==active){ active=idx; shapeLabel.textContent=shapes[active].name; renderTabs(); syncInputs(); draw(); }
      if (toolMode==='move'){ dragging=true; start=pt; orig={...shapes[active].pos}; dragIdx=active; ev.preventDefault(); }
        }
      };
      const snapper = (val)=> opts.snap ? Math.round(val/10)*10 : val;
      const onMove=(ev)=>{
        const pt=getPoint(ev);
        if(resizing){
          const s=shapes[resizeIdx];
          const curLocal = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot);
          let dxIn = (curLocal.x - startLocal.x) / 2; // px->in
          let dyIn = (curLocal.y - startLocal.y) / 2;
          if (opts.snap){ dxIn = Math.round(dxIn); dyIn = Math.round(dyIn); }
          const clamp=(v,min,max)=> Math.min(Math.max(v,min),max);
          if (resizeKey==='A') s.len.A = Math.max(1, Math.round((orig.A||0) + dxIn));
          if (resizeKey==='B') s.len.B = Math.max(1, Math.round((orig.B||0) + dyIn));
          if (resizeKey==='C') s.len.C = clamp(Math.round((orig.C||0) + dxIn), 0, Math.max(0, (s.len.A||0)-1));
          if (resizeKey==='D') s.len.D = clamp(Math.round((orig.D||0) + dyIn), 0, Math.max(0, (s.len.B||0)-1));
          draw(); updateOversize(); updateSummary(); return;
        }
        if(!dragging){
          const idx=pickIndex(pt, 28);
          if (hover!==idx){ hover=idx; draw(); }
          if (toolMode==='resize' && pickHandle(pt)) svgEl.style.cursor='nwse-resize'; else svgEl.style.cursor = hover!==-1 ? 'move' : 'default';
          return;
        }
        const dx=pt.x-start.x, dy=pt.y-start.y; shapes[dragIdx].pos={x:snapper(orig.x+dx),y:snapper(orig.y+dy)}; draw();
      };
  const onUp=()=>{ if(resizing){ resizing=false; resizeIdx=-1; resizeKey=null; save(); return; } if(!dragging) return; dragging=false; dragIdx=-1; save(); };
      svgEl.addEventListener('mousedown', onDown);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      svgEl.addEventListener('touchstart', onDown, {passive:false});
      window.addEventListener('touchmove', onMove, {passive:false});
      window.addEventListener('touchend', onUp);
    })();

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
        root.querySelectorAll('.kc-ct-toolbar .kc-tool').forEach(b=> b.classList.remove('is-active'));
        btn.classList.add('is-active');
        toolMode = type;
        // sync left palette
        root.querySelectorAll('[data-ct-tool-mode]').forEach(b=>{
          const name = b.getAttribute('data-ct-tool-mode') || 'move';
          b.classList.toggle('is-active', name===toolMode);
        });
        mode = toolMode;
      });
    });
    // Duplicate already bound to all matching buttons above
    const svgEl = sel('[data-ct-svg]', root);
    function applyZoom(){ svgEl.setAttribute('viewBox', `0 0 ${600/zoom} ${600/zoom}`); }
    sel('[data-ct-zoom-in]', root)?.addEventListener('click', ()=>{ zoom=Math.min(3, zoom+0.2); applyZoom(); });
    sel('[data-ct-zoom-out]', root)?.addEventListener('click', ()=>{ zoom=Math.max(0.4, zoom-0.2); applyZoom(); });
    root.querySelectorAll('[data-ct-counter]').forEach(box=>{
      const key = box.getAttribute('data-ct-counter');
      const valEl = box.querySelector('.kc-ctr-val');
      const sync = ()=>{ valEl.textContent = String(opts[key]); };
      box.querySelector('.kc-ctr-inc')?.addEventListener('click', ()=>{ opts[key] = (opts[key]||0)+1; sync(); updateSummary(); save(); });
      box.querySelector('.kc-ctr-dec')?.addEventListener('click', ()=>{ opts[key] = Math.max(0,(opts[key]||0)-1); sync(); updateSummary(); save(); });
      sync();
    });

    // keyboard nudging for active shape
    root.addEventListener('keydown', (e)=>{
      if (active<0) return;
      const step = opts.snap ? 10 : 2;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
        e.preventDefault();
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
      // area: rect A*B, U: A*B - C*(B-D), L: A*B - (A-C)*(B-D)
      const totalSqIn = shapes.reduce((acc,s)=>{
        const A=Number(s.len?.A||0), B=Number(s.len?.B||0), C=Number(s.len?.C||0), D=Number(s.len?.D||0);
        if (s.type==='u') return acc + (A*B - Math.max(0, C*Math.max(0, B-D)));
        if (s.type==='l') return acc + (A*B - Math.max(0, (A-C)*Math.max(0, B-D)));
        return acc + (A*B);
      }, 0);
      const sqFt = totalSqIn/144; if (areaEl) areaEl.textContent = (Math.round(sqFt*10)/10).toFixed(1);
  if (matEl) matEl.textContent = Array.isArray(opts.material)? (opts.material.join(', ')||'') : (opts.material||'');
      if (edgeEl) edgeEl.textContent = opts.edge||'';
      if (sinksEl) sinksEl.textContent = opts.sinks||'';
  if (colorEl) colorEl.textContent = opts.color||'-';
      if (cutCookEl) cutCookEl.textContent = String(opts['cutout-cooktop']||0);
      if (cutFaucEl) cutFaucEl.textContent = String(opts['cutout-faucet']||0);
      if (cutOtherEl) cutOtherEl.textContent = String(opts['cutout-other']||0);
  if (removalEl) removalEl.textContent = opts.removal||'';
  if (seamsEl){ const seamCount = shapes.reduce((acc,s)=> acc + (Array.isArray(s.seams)? s.seams.length:0), 0); seamsEl.textContent = String(seamCount); }
    }

    // Load saved state if present
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if (raw){
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.shapes) && parsed.opts){ shapes = parsed.shapes; active = Math.max(0, Math.min(parsed.active||0, shapes.length-1)); }
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
    const snapEl = sel('[data-ct-snap]', root); if (snapEl){ snapEl.checked = !!opts.snap; snapEl.addEventListener('change', ()=>{ opts.snap = !!snapEl.checked; save(); }); }

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
            shapes=data.shapes; active=Math.max(-1, Math.min(data.active??-1, shapes.length-1)); Object.assign(opts, data.opts);
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
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
