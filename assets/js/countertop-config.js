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
      const drawGuideLine=(parent,x1,y1,x2,y2,txt)=>{
        const l=document.createElementNS(ns,'line');
        l.setAttribute('x1',String(x1)); l.setAttribute('y1',String(y1));
        l.setAttribute('x2',String(x2)); l.setAttribute('y2',String(y2));
        l.setAttribute('stroke','#bdc6da'); l.setAttribute('stroke-width','2');
        parent.appendChild(l);
        if (txt){ const t=document.createElementNS(ns,'text'); t.setAttribute('x', String((x1+x2)/2)); t.setAttribute('y', String((y1+y2)/2 - 6)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=txt; parent.appendChild(t); }
      };

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
        // common: top A number
        mk(cx, cy - (px(b)/2) - 10, `${a}\"`);
        if (cur.type==='rect'){
          // Only two measurements for rect: A (length) and B (width)
          const ty = cy; const leftTxt=document.createElementNS(ns,'text'); leftTxt.setAttribute('x', String(cx - (px(a)/2) - 22)); leftTxt.setAttribute('y', String(ty)); leftTxt.setAttribute('text-anchor','end'); leftTxt.setAttribute('font-size','12'); leftTxt.textContent = `${b}\"`; parent.appendChild(leftTxt);
          return;
          // Outer right B (mirror numeric label)
          const rightTxt=document.createElementNS(ns,'text'); rightTxt.setAttribute('x', String(cx + (aPx/2) + 22)); rightTxt.setAttribute('y', String(cy)); rightTxt.setAttribute('text-anchor','start'); rightTxt.setAttribute('font-size','12'); rightTxt.textContent = `${b}"`; parent.appendChild(rightTxt);
        }
        if (cur.type==='l'){
          const aPx=px(a), bPx=px(b), cPx=px(c), dPx=px(d);
          // Numbers on all four: A top, B left, C inner bottom run, D right outer
          // B left
          const leftTxt=document.createElementNS(ns,'text'); leftTxt.setAttribute('x', String(cx - (aPx/2) - 22)); leftTxt.setAttribute('y', String(cy)); leftTxt.setAttribute('text-anchor','end'); leftTxt.setAttribute('font-size','12'); leftTxt.textContent = `${b}\"`; parent.appendChild(leftTxt);
          // C bottom inner run
          const flipX = !!cur.flipX; const cMidX = !flipX ? (cx - aPx/2 + cPx/2) : (cx + aPx/2 - cPx/2); const cY = cy + bPx/2 + 14; mk(cMidX, cY, `${c}\"`);
          // D right outer side number
          const rightTxt=document.createElementNS(ns,'text'); rightTxt.setAttribute('x', String(cx + (aPx/2) + 22)); rightTxt.setAttribute('y', String(cy)); rightTxt.setAttribute('text-anchor','start'); rightTxt.setAttribute('font-size','12'); rightTxt.textContent = `${b}\"`; parent.appendChild(rightTxt);
          return;
        }
        if (cur.type==='u'){
          const aPx=px(a), bPx=px(b), cPx=px(c), dPx=px(d);
          // B on both outer left and right
          const leftTxt=document.createElementNS(ns,'text'); leftTxt.setAttribute('x', String(cx - (aPx/2) - 22)); leftTxt.setAttribute('y', String(cy)); leftTxt.setAttribute('text-anchor','end'); leftTxt.setAttribute('font-size','12'); leftTxt.textContent = `${b}\"`; parent.appendChild(leftTxt);
          const rightTxt=document.createElementNS(ns,'text'); rightTxt.setAttribute('x', String(cx + (aPx/2) + 22)); rightTxt.setAttribute('y', String(cy)); rightTxt.setAttribute('text-anchor','start'); rightTxt.setAttribute('font-size','12'); rightTxt.textContent = `${b}\"`; parent.appendChild(rightTxt);
          // Inner top C centered between returns
          const e = Number(cur.len?.E||Math.max(0, (a - c)/2));
          const h = Number(cur.len?.H||Math.max(0, (a - c)/2));
          const xiL = cx - aPx/2 + px(e);
          const xiR = cx + aPx/2 - px(h);
          const innerTopY = cy - bPx/2 + dPx;
          // Stagger C and D horizontally to avoid stacking
          const cX = xiL + (xiR - xiL) * 0.35; mk(cX, innerTopY - 6, `${c}\"`);
          const dX = xiL + (xiR - xiL) * 0.65; mk(dX, innerTopY - 26, `${d}\"`);
          // E/H along bottom near returns
          const eMidX = cx - aPx/2 + px(e)/2; mk(eMidX, cy + bPx/2 + 14, `${e}\"`);
          const hMidX = cx + aPx/2 - px(h)/2; mk(hMidX, cy + bPx/2 + 14, `${h}\"`);
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
            // resize handles for A (width) and B (depth)
            // top/bottom adjust B, left/right adjust A
            addHandle(idx, centerX, centerY - h/2, rotation, 'B-top');
            addHandle(idx, centerX + w/2, centerY, rotation, 'A-right');
            addHandle(idx, centerX - w/2, centerY, rotation, 'A-left');
            addHandle(idx, centerX, centerY + h/2, rotation, 'B-bottom');
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

          // backsplash precise for L: A full top, B full left, C bottom segment length=c, D right-top segment length=d (mirrors with flipX)
          { const bh = px(Number(opts.bsHeight||0)); if (bh>0){
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

          // L-guides for A(top), B(left), C(bottom inner run), D(right outer side)
          const m=18;
          // A top full width
          drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX + a/2 - m, centerY - b/2 + m, 'A');
          // B left full height
          drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX - a/2 + m, centerY + b/2 - m, 'B');
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
            addHandle(idx, centerX, centerY - b/2, rotation, 'B-top');
            addHandle(idx, centerX + a/2, centerY, rotation, 'A-right');
            addHandle(idx, centerX - a/2, centerY, rotation, 'A-left');
            addHandle(idx, centerX, centerY + b/2, rotation, 'B-bottom');
            // L-shape inner handles: C bottom inner run midpoint, D inner vertical midpoint
            const bottomY = centerY + b/2;
            const ciMidX = !flipX ? (centerX - a/2 + c/2) : (centerX + a/2 - c/2);
            addHandle(idx, ciMidX, bottomY, rotation, 'C');
            const dX = !flipX ? (centerX - a/2 + c) : (centerX + a/2 - c);
            const dMidY = centerY - b/2 + d/2;
            addHandle(idx, dX, dMidY, rotation, 'D');
          }

  } else if (shape==='u'){
          // Independent sides: A,B outer, D offset from top, E/H returns, F/G inner verticals; derive C from E/H
          let aIn = Number(len.A||60), bIn = Number(len.B||25);
          let dIn = Number(len.D||10);
          let eIn = Number(len.E != null ? len.E :  Math.round((aIn - (len.C||20))/2));
          let hIn = Number(len.H != null ? len.H :  Math.round((aIn - (len.C||20))/2));
          // clamp each independently
          if (dIn < 0) dIn = 0; if (dIn > bIn-1) dIn = bIn-1;
          // compute local clamped values (do not mutate stored lengths here)
          const eMax = Math.max(0, aIn - 1 - Math.max(0,hIn));
          const hMax = Math.max(0, aIn - 1 - Math.max(0,eIn));
          let eLocal = Math.min(Math.max(eIn,0), eMax);
          let hLocal = Math.min(Math.max(hIn,0), hMax);
          // enforce a minimum inner width of 1 inch
          const minSpan = 1; const maxSum = Math.max(minSpan, aIn - minSpan);
          if (eLocal + hLocal > aIn - minSpan){
            const over = (eLocal + hLocal) - (aIn - minSpan);
            if (hLocal >= eLocal) hLocal = Math.max(0, hLocal - over); else eLocal = Math.max(0, eLocal - over);
          }
          // derived C used only for rendering
          const cIn = Math.max(1, aIn - (eLocal + hLocal));
          const a = px(aIn), b = px(bIn);
          const x = centerX - a/2, y = centerY - b/2;
          // inner notch polygon (verticals extend to bottom; F/G removed)
          const xiL = x + px(eLocal);                // left inner x
          const xiR = x + px(aIn - hLocal);          // right inner x
          const yTop = y + px(dIn);               // inner top y
          // inner verticals extend to the outer bottom to ensure a true U opening
          const yBotL = y + b;                       // left vertical bottom at outer bottom
          const yBotR = y + b;                       // right vertical bottom at outer bottom

          const rotG = document.createElementNS(ns, 'g');
          rotG.setAttribute('transform', `rotate(${rotation} ${centerX} ${centerY})`);

          // overhang removed

      // backsplash along U edges with precise segments: A top full; B both left & right full; C inner top opening; D right full; E/H precise returns
      { const aBox=a, bBox=b; const bh = px(Number(opts.bsHeight||0)); if (bh>0){
        // A top
        if (cur.bs.A){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(centerX - aBox/2)); r.setAttribute('y', String(centerY - bBox/2 - bh)); r.setAttribute('width', String(aBox)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
        // B both sides
        if (cur.bs.B){ const rL=document.createElementNS(ns,'rect'); rL.setAttribute('x', String(centerX - aBox/2 - bh)); rL.setAttribute('y', String(centerY - bBox/2)); rL.setAttribute('width', String(bh)); rL.setAttribute('height', String(bBox)); rL.setAttribute('fill','#e6f2ff'); rL.setAttribute('stroke','#7fb3ff'); rL.setAttribute('stroke-width','1'); rotG.appendChild(rL); const rR=document.createElementNS(ns,'rect'); rR.setAttribute('x', String(centerX + aBox/2)); rR.setAttribute('y', String(centerY - bBox/2)); rR.setAttribute('width', String(bh)); rR.setAttribute('height', String(bBox)); rR.setAttribute('fill','#e6f2ff'); rR.setAttribute('stroke','#7fb3ff'); rR.setAttribute('stroke-width','1'); rotG.appendChild(rR); }
        // C inner top opening (xiL..xiR)
        if (cur.bs.C){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(xiL)); r.setAttribute('y', String(yTop)); r.setAttribute('width', String(xiR - xiL)); r.setAttribute('height', String(bh)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
        // D right outer
        if (cur.bs.D){ const r=document.createElementNS(ns,'rect'); r.setAttribute('x', String(centerX + aBox/2)); r.setAttribute('y', String(centerY - bBox/2)); r.setAttribute('width', String(bh)); r.setAttribute('height', String(bBox)); r.setAttribute('fill','#e6f2ff'); r.setAttribute('stroke','#7fb3ff'); r.setAttribute('stroke-width','1'); rotG.appendChild(r); }
        // E (bottom left return) and H (bottom right return) precise lengths
              if (cur.bs && (cur.bs.E || cur.bs.H)){
                const eLen = px(Math.max(0, Number(len.E||0)));
                const hLen = px(Math.max(0, Number(len.H||0)));
                // world coords for returns along bottom outer edge
                if (cur.bs.E && eLen>0){
                  const rE = document.createElementNS(ns,'rect');
                  rE.setAttribute('x', String(centerX - a/2));
                  rE.setAttribute('y', String(centerY + b/2));
                  rE.setAttribute('width', String(eLen));
                  rE.setAttribute('height', String(bh));
                  rE.setAttribute('fill','#e6f2ff'); rE.setAttribute('stroke','#7fb3ff'); rE.setAttribute('stroke-width','1');
                  rotG.appendChild(rE);
                }
                if (cur.bs.H && hLen>0){
                  const rH = document.createElementNS(ns,'rect');
                  rH.setAttribute('x', String(centerX + a/2 - hLen));
                  rH.setAttribute('y', String(centerY + b/2));
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

          // U shape as outer rect minus inner notch polygon (evenodd)
          const path = document.createElementNS(ns, 'path');
          const dPath = [
            `M ${x} ${y} h ${a} v ${b} h ${-a} Z`,
            `M ${xiL} ${yTop} L ${xiR} ${yTop} L ${xiR} ${yBotR} L ${xiL} ${yBotL} Z`
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

          // U-guides for A–H
          const m=18;
          // A top outer
          drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX + a/2 - m, centerY - b/2 + m, 'A');
          // B left outer
          drawGuideLine(rotG, centerX - a/2 + m, centerY - b/2 + m, centerX - a/2 + m, centerY + b/2 - m, 'B');
          // B right outer (mirror)
          drawGuideLine(rotG, centerX + a/2 - m, centerY - b/2 + m, centerX + a/2 - m, centerY + b/2 - m, 'B');
          // Use existing xiL/xiR/yTop to draw C/D/E/H guides (F/G removed)
          // C inner top opening
          drawGuideLine(rotG, xiL + m, yTop + m, xiR - m, yTop + m, 'C');
          // D inner depth (using center of opening)
          drawGuideLine(rotG, (xiL+xiR)/2, centerY - b/2 + m, (xiL+xiR)/2, yTop - m, 'D');
          // E bottom left return
          drawGuideLine(rotG, centerX - a/2 + m, centerY + b/2 - m, xiL - m, centerY + b/2 - m, 'E');
          // H bottom right return
          drawGuideLine(rotG, xiR + m, centerY + b/2 - m, centerX + a/2 - m, centerY + b/2 - m, 'H');
          gRoot.appendChild(rotG);
          labelNumbers(rotG, centerX, centerY, cur, {A:aIn,B:bIn,C:cIn,D:dIn});
          hitAreas.push({ idx, cx:centerX, cy:centerY, w:a, h:b, rot:rotation });
          if (idx===active){
            addHandle(idx, centerX, centerY - b/2, rotation, 'B-top');
            addHandle(idx, centerX + a/2, centerY, rotation, 'A-right');
            addHandle(idx, centerX - a/2, centerY, rotation, 'A-left');
            addHandle(idx, centerX, centerY + b/2, rotation, 'B-bottom');
            // inner C handle at inner top midpoint
            const xiLh = centerX - (px(aIn))/2 + px(eIn);
            const xiRh = centerX + (px(aIn))/2 - px(hIn);
            const yi = centerY - (px(bIn))/2 + px(dIn);
            addHandle(idx, (xiLh+xiRh)/2, yi, rotation, 'C');
            // D handle slightly above inner top center
            addHandle(idx, (xiLh+xiRh)/2, yi - 10, rotation, 'D');
            // add handles for E and H (F/G removed)
            const bottomY = centerY + b/2;
            // E mid of left bottom return
            addHandle(idx, centerX - a/2 + px(eIn)/2, bottomY, rotation, 'E');
            // H mid of right bottom return
            addHandle(idx, centerX + a/2 - px(hIn)/2, bottomY, rotation, 'H');
          }
        } else if (shape==='poly'){
          // Custom polygon defined by local-inch points: [{x,y}, ...] in inches
          const ptsIn = Array.isArray(cur.points) && cur.points.length>=3 ? cur.points : [
            {x:-40,y:-30},{x:40,y:-30},{x:60,y:0},{x:10,y:40},{x:-30,y:20}
          ];
          // local inches -> viewBox units
          const toWorld = (lx,ly)=>{
            const rad = (rotation||0) * Math.PI/180; const cos=Math.cos(rad), sin=Math.sin(rad);
            const x = centerX + (lx*2)*cos - (ly*2)*sin; // 2 px per inch
            const y = centerY + (lx*2)*sin + (ly*2)*cos;
            return {x,y};
          };
          // build path
          const polyPath = document.createElementNS(ns, 'path');
          let dStr='';
          ptsIn.forEach((p,i)=>{
            const w = toWorld(p.x, p.y);
            dStr += (i===0?`M ${w.x} ${w.y}`:` L ${w.x} ${w.y}`);
          });
          dStr += ' Z';
          polyPath.setAttribute('d', dStr);
          polyPath.setAttribute('fill', '#f8c4a0');
          polyPath.setAttribute('stroke', '#ccc');
          polyPath.setAttribute('stroke-width', '2');
          gRoot.appendChild(polyPath);

          // labels: edge lengths (inches) at midpoints
          const labelEdge=(x1,y1,x2,y2,txt)=>{ const t=document.createElementNS(ns,'text'); t.setAttribute('x', String((x1+x2)/2)); t.setAttribute('y', String((y1+y2)/2 - 6)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','700'); t.setAttribute('fill','#2d4a7a'); t.textContent=txt; gRoot.appendChild(t); };
          // draw dynamic side guides and letters A.. as needed
          const m=10; let letterCode=65; // 'A'
          const drawGuide=(x1,y1,x2,y2,letTxt)=>{ const l=document.createElementNS(ns,'line'); l.setAttribute('x1',String(x1)); l.setAttribute('y1',String(y1)); l.setAttribute('x2',String(x2)); l.setAttribute('y2',String(y2)); l.setAttribute('stroke','#bdc6da'); l.setAttribute('stroke-width','2'); gRoot.appendChild(l); const t=document.createElementNS(ns,'text'); t.setAttribute('x', String((x1+x2)/2)); t.setAttribute('y', String((y1+y2)/2 - 6)); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','12'); t.setAttribute('font-weight','600'); t.textContent=letTxt; gRoot.appendChild(t); };
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
            ptsIn.forEach((p,i)=>{ const w = toWorld(p.x, p.y); addHandle(idx, w.x, w.y, rotation||0, `V-${i}`); });
            // also midpoint handles per edge for resizing length
            for (let i=0;i<ptsIn.length;i++){
              const aP = ptsIn[i], bP = ptsIn[(i+1)%ptsIn.length];
              const mid={ x:(aP.x+bP.x)/2, y:(aP.y+bP.y)/2 };
              const w = toWorld(mid.x, mid.y); addHandle(idx, w.x, w.y, rotation||0, `P-${i}`);
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
        if (type==='poly'){
          const pts=[{x:-40,y:-30},{x:40,y:-30},{x:60,y:0},{x:10,y:40},{x:-30,y:20}];
          shapes.push({ id, name:'Shape '+(shapes.length+1), type:'poly', rot:0, pos:{x:300,y:300}, points:pts, len:{A:0,B:0,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] });
        } else {
  const baseLen = {A:a,B:b,C:c,D:d};
  if (type==='u'){ baseLen.E = Math.round((a - c)/2); baseLen.H = Math.round((a - c)/2); }
      shapes.push({ id, name:'Shape '+(shapes.length+1), type, rot:0, pos:{x:300,y:300}, len:baseLen, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] });
        }
        active = shapes.length-1; shapeLabel.textContent = shapes[active].name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Free draw: click the tile to start adding vertices on canvas until Enter or double-click to finish
    root.querySelectorAll('[data-ct-poly="free"]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id='s'+(shapes.length+1);
        const s={ id, name:'Shape '+(shapes.length+1), type:'poly', rot:0, pos:{x:300,y:300}, points:[], len:{A:0,B:0,C:0,D:0}, wall:{A:false,B:false,C:false,D:false}, bs:{A:false,B:false,C:false,D:false}, seams:[] };
        shapes.push(s); active=shapes.length-1; drawingPoly=true; drawingIdx=active; shapeLabel.textContent=s.name; renderTabs(); syncInputs(); draw(); updateOversize(); updateActionStates(); updateSummary();
      });
    });

    // Layout presets
    root.querySelectorAll('[data-ct-layout]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
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
          add('u', {A:180,B:100,C:84,D:26}, {x:300,y:300});
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
  all('[data-ct-rotate-left]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; shapes[active].rot = (shapes[active].rot + 270)%360; draw(); }));
  all('[data-ct-rotate-right]', root).forEach(el=> el.addEventListener('click', ()=>{ if(active<0) return; shapes[active].rot = (shapes[active].rot + 90)%360; draw(); }));
  // Mirror (horizontal) control
  all('[data-ct-mirror]', root).forEach(el=> el.addEventListener('click', ()=>{
    if (active<0) return; const cur = shapes[active];
    if (cur.type==='l'){
      cur.flipX = !cur.flipX;
    } else if (cur.type==='u'){
  // Mirror U: swap return lengths E/H and swap backsplash flags E/H
  const eVal = Number(cur.len?.E||0), hVal = Number(cur.len?.H||0);
  if (!cur.len) cur.len = {};
  cur.len.E = hVal; cur.len.H = eVal;
  if (cur.bs){ const tmp = cur.bs.E; cur.bs.E = cur.bs.H; cur.bs.H = tmp; }
    } // rect/poly: no-op for now
    draw(); save();
  }));

    // Delegated input handling for dynamic measurement fields
    root.addEventListener('input', (ev)=>{
      const inp = ev.target;
      if (!(inp instanceof HTMLElement)) return;
      if (!inp.matches('[data-ct-len]')) return;
      if (active<0) return;
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
          const A = Number(s.len.A||0), B = Number(s.len.B||0);
          if (k==='E' || k==='H'){
            if (k==='E'){ s.len.E = Math.max(0, Math.min(v, Math.max(0, A - 1 - (s.len.H||0)))); }
            if (k==='H'){ s.len.H = Math.max(0, Math.min(v, Math.max(0, A - 1 - (s.len.E||0)))); }
            s.len.C = Math.max(1, A - Math.max(0, (s.len.E||0)) - Math.max(0, (s.len.H||0)));
          } else if (k==='D'){
            s.len.D = Math.max(0, Math.min(Number(s.len.D||0), Math.max(0, B-1)));
          } else if (k==='C'){
            // Update C by rebalancing E/H symmetrically to keep notch centered
            const newC = Math.max(1, Math.min(v, Math.max(1, A-1)));
            const spare = Math.max(0, A - newC);
            const e = Math.floor(spare/2), h = spare - e;
            s.len.C = newC; s.len.E = e; s.len.H = h;
          }
        }
      }
      draw(); updateOversize(); updateSummary(); save();
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
      } else if (cur.type==='l'){
            addRow('Top (A)','A'); addRow('Left (B)','B'); addRow('Inner bottom run (C)','C'); addRow('Inner vertical (D)','D');
          } else if (cur.type==='u'){
            ['A','B','C','D','E','H'].forEach(k=> addRow(`${k}`, k));
          } else if (cur.type==='poly'){
            const n = (Array.isArray(cur.points)?cur.points.length:0); for(let i=0;i<n;i++){ const letter=String.fromCharCode(65+i); addRow(`Side ${letter}`, `P${i}`); }
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
            if (!cur.bs) cur.bs = {A:false,B:false,C:false,D:false,E:false,H:false};
            if (cur.bs.E==null) cur.bs.E=false; if (cur.bs.H==null) cur.bs.H=false;
            ['A','B','C','D','E','H'].forEach(s=> mk(s, sideLabel(s)));
          } else {
            // default to A-D if unknown
            ['A','B','C','D'].forEach(s=> mk(s, sideLabel(s)));
          }
        }
    // Show L flip control for L shapes
    const flipWrap = sel('[data-ct-l-flip-wrap]', root);
    const flipInp = sel('[data-ct-l-flip]', root);
    if (flipWrap && flipInp){ flipWrap.hidden = cur.type!=='l'; flipInp.checked = !!cur.flipX; }
  all('[data-ct-len]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-len'); let v=0; if (cur.type==='poly' && k && k.startsWith('P')){ const idx=parseInt(k.slice(1)||'0',10); const pts=cur.points||[]; if (pts.length>=2){ const a=pts[idx], b=pts[(idx+1)%pts.length]; v=Math.round(Math.hypot((b.x-a.x),(b.y-a.y))); } } else { v = (cur.len && k in cur.len) ? cur.len[k] : 0; } const activeEl=document.activeElement; inp.value = String(v||0); if (activeEl===inp) inp.focus(); });
        all('[data-ct-wall]', root).forEach(inp=>{ inp.disabled=false; const k=inp.getAttribute('data-ct-wall'); inp.checked = !!cur.wall[k]; });
        all('[data-ct-shape]', root).forEach(btn=> btn.classList.toggle('is-active', btn.getAttribute('data-ct-shape')===cur.type));
    const rowC = sel('[data-row-c]', root); const rowD = sel('[data-row-d]', root);
  if (rowC) rowC.style.display='none'; if (rowD) rowD.style.display='none';
      }
      const bsH = sel('[data-ct-bs-height]', root); if (bsH) bsH.value = String(opts.bsHeight||0);
    }

    function sideLabel(s){
      if (s==='A') return 'Top (A)';
      if (s==='B') return 'Left (B)';
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
      const k = inp.getAttribute('data-ct-backsplash'); if (!k) return;
      if (!shapes[active].bs) shapes[active].bs = {};
  const checked = (inp.tagName === 'INPUT') ? (inp).checked : !!inp.getAttribute('checked');
  shapes[active].bs[k] = !!checked;
      updateSummary(); save(); draw();
    });
    // L flip binding
    sel('[data-ct-l-flip]', root)?.addEventListener('change', (e)=>{
      const cur = shapes[active]; if (!cur || cur.type!=='l') return;
      cur.flipX = !!e.target.checked; draw(); updateSummary(); save();
    });
    // Backsplash height input
    sel('[data-ct-bs-height]', root)?.addEventListener('input', (e)=>{
  // Overhang removed

  // Seams UI removed
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
        // Handle free-draw polygon creation clicks
        if (drawingPoly && drawingIdx>=0 && shapes[drawingIdx] && shapes[drawingIdx].type==='poly'){
          const s=shapes[drawingIdx];
          if (s.points.length===0){
            s.pos = { x: pt.x, y: pt.y };
            s.points.push({x:0,y:0});
          } else {
            const loc = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot||0);
            // convert viewBox units to inches
            s.points.push({ x: Math.round(loc.x/2), y: Math.round(loc.y/2) });
          }
          active=drawingIdx; shapeLabel.textContent=s.name; draw(); save(); ev.preventDefault(); return;
        }
        if (toolMode==='resize'){
          const ph = pickHandle(pt);
          if (ph){ const {h}=ph; resizeIdx=h.idx; resizeKey=h.key; resizing=true; start=pt; const s=shapes[resizeIdx]; startLocal = worldToLocal(pt.x, pt.y, s.pos.x, s.pos.y, s.rot); orig = { len: JSON.parse(JSON.stringify(s.len)), pos: {x:s.pos.x,y:s.pos.y} }; ev.preventDefault(); return; }
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
          const oLen = orig.len || {}, oPos = orig.pos || {};
          if (resizeKey==='A-right'){
            s.len.A = Math.max(1, Math.round((oLen.A||0) + dxIn));
          } else if (resizeKey==='A-left'){
            const newA = Math.max(1, Math.round((oLen.A||0) - dxIn));
            const delta = (newA - (oLen.A||0))/2 * 2; // px in inches then px? here inches
            s.len.A = newA;
            s.pos.x = oPos.x - dxIn; // move center left when dragging left side
          } else if (resizeKey==='B-top'){
            const newB = Math.max(1, Math.round((oLen.B||0) - dyIn));
            s.len.B = newB; s.pos.y = oPos.y - dyIn;
          } else if (resizeKey==='B-bottom'){
            s.len.B = Math.max(1, Math.round((oLen.B||0) + dyIn));
          } else if (resizeKey==='C'){
            if (s.type==='rect'){
              s.len.A = Math.max(1, Math.round((oLen.A||0))); // mirrored via UI; no drag-op
            } else if (s.type==='u'){
              // Change C by adjusting E/H symmetrically to keep notch centered
              const A = s.len.A||0; const newC = clamp(Math.round((oLen.C||0) + dxIn), 1, Math.max(1, A-1));
              const spare = Math.max(0, A - newC);
              s.len.E = Math.round(spare/2); s.len.H = spare - s.len.E; s.len.C = newC;
            } else if (s.type==='l'){
              // L: C is the inner bottom run; clamp 0..A-1
              const newC = clamp(Math.round((oLen.C||0) + dxIn), 0, Math.max(0, (s.len.A||0)-1));
              s.len.C = newC;
            }
          } else if (resizeKey==='D'){
            if (s.type==='rect'){
              s.len.B = Math.max(1, Math.round((oLen.B||0)));
            } else if (s.type==='u'){
              s.len.D = clamp(Math.round((oLen.D||0) + dyIn), 0, Math.max(0, (s.len.B||0)-1));
            } else if (s.type==='l'){
              // L: D is the inner vertical; clamp 0..B-1
              s.len.D = clamp(Math.round((oLen.D||0) + dyIn), 0, Math.max(0, (s.len.B||0)-1));
            }
          } else if (['E','H'].includes(String(resizeKey)) && s.type==='u'){
            // adjust corresponding return/inner verticals independently
            if (resizeKey==='E'){
              const maxE = Math.max(0, (s.len.A||0) - 1 - (s.len.H||0));
              s.len.E = clamp(Math.round((oLen.E||0) + dxIn), 0, maxE);
            } else if (resizeKey==='H'){
              const maxH = Math.max(0, (s.len.A||0) - 1 - (s.len.E||0));
              s.len.H = clamp(Math.round((oLen.H||0) - dxIn), 0, maxH);
            }
          } else if (resizeKey && String(resizeKey).startsWith('P-') && s.type==='poly'){
            // edge midpoint drag: scale edge length by moving the far vertex along edge normal
            const i = parseInt(String(resizeKey).split('-')[1]||'-1',10);
            if (Array.isArray(s.points) && i>=0){
              if (!orig.points) orig.points = s.points.map(p=> ({x:p.x, y:p.y}));
              const a = orig.points[i]; const b = orig.points[(i+1)%orig.points.length];
              const ax=a.x, ay=a.y, bx=b.x, by=b.y;
              const vx=bx-ax, vy=by-ay; const len=Math.hypot(vx,vy)||1; const nx=vx/len, ny=vy/len; // unit along edge
              // project movement along edge direction (dxIn,dyIn) in local inches
              const t = (dxIn*nx + dyIn*ny);
              const move = t; // inches along edge
              s.points[(i+1)%s.points.length] = { x: Math.round(bx + move*nx), y: Math.round(by + move*ny) };
            }
          } else if (resizeKey && String(resizeKey).startsWith('V-')){
            // polygon vertex drag
            const i = parseInt(String(resizeKey).split('-')[1]||'-1',10);
            if (Array.isArray(s.points) && i>=0 && i<s.points.length){
              if (!orig.points) orig.points = s.points.map(p=> ({x:p.x, y:p.y}));
              const op = orig.points[i];
              // move vertex by delta inches
              const nx = (op.x||0) + dxIn; const ny = (op.y||0) + dyIn;
              s.points[i] = { x: Math.round(nx), y: Math.round(ny) };
            }
          }
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
      // finish free draw on double click
      svgEl.addEventListener('dblclick', ()=>{ if(drawingPoly){ drawingPoly=false; drawingIdx=-1; save(); draw(); } });
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
      });
    });
    // Duplicate already bound to all matching buttons above
    const svgEl = sel('[data-ct-svg]', root);
    function applyZoom(){ svgEl.setAttribute('viewBox', `0 0 ${600/zoom} ${600/zoom}`); }
  sel('[data-ct-zoom-in]', root)?.addEventListener('click', ()=>{ zoom=Math.min(3, zoom+0.2); applyZoom(); draw(); });
  sel('[data-ct-zoom-out]', root)?.addEventListener('click', ()=>{ zoom=Math.max(0.4, zoom-0.2); applyZoom(); draw(); });
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
      if (drawingPoly){
        if (e.key==='Enter'){ drawingPoly=false; drawingIdx=-1; draw(); save(); }
        if (e.key==='Escape'){ // cancel drawing: remove empty poly
          if (drawingIdx>=0 && shapes[drawingIdx] && Array.isArray(shapes[drawingIdx].points) && shapes[drawingIdx].points.length<3){ shapes.splice(drawingIdx,1); active=Math.max(-1, Math.min(active, shapes.length-1)); }
          drawingPoly=false; drawingIdx=-1; draw(); save();
        }
        return;
      }
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
        if (s.type==='poly' && Array.isArray(s.points) && s.points.length>=3){
          // shoelace formula (in^2) on local-inch points
          let area=0; for (let i=0;i<s.points.length;i++){ const p1=s.points[i], p2=s.points[(i+1)%s.points.length]; area += (p1.x*p2.y - p2.x*p1.y); } area=Math.abs(area)/2; return acc + area;
        }
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
