// 2D connection graph. No dependencies: a small force simulation drawn as SVG.
(() => {
  const svg = document.getElementById('graph');
  const data = JSON.parse(document.getElementById('graph-data').textContent);
  const NS = 'http://www.w3.org/2000/svg';
  const el = (name, attrs = {}) => {
    const e = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  };

  const nodes = data.map((d, i) => ({ ...d, x: 0, y: 0, vx: 0, vy: 0, i }));
  const bySlug = new Map(nodes.map((n) => [n.slug, n]));
  const links = [];
  const tagLinks = [];
  // One drawn line per connected pair. Arrowheads show direction: ab = a -> b relations, ba = b -> a.
  const pairs = new Map();
  for (const n of nodes) {
    for (const e of n.out) {
      const o = bySlug.get(e.to);
      if (!o) continue;
      const [a, b] = n.slug < o.slug ? [n, o] : [o, n];
      const key = `${a.slug}|${b.slug}`;
      if (!pairs.has(key)) pairs.set(key, { a, b, ab: [], ba: [] });
      pairs.get(key)[n === a ? 'ab' : 'ba'].push(e.rel);
    }
  }
  links.push(...pairs.values());
  const relText = (rel) => rel.replace(/[-_]+/g, ' ');
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (a.links.includes(b.slug)) continue;
      if (a.tags.some((t) => b.tags.includes(t))) tagLinks.push({ a, b });
    }
  }
  const degree = new Map(nodes.map((n) => [n.slug, n.links.length]));

  let W = 800, H = 600;
  let byDate = true; // layout: x by date rank (oldest left), or free-floating
  const gTag = el('g', { class: 'edges tag-edges' });
  const gLink = el('g', { class: 'edges' });
  const gNode = el('g');
  const gLabel = el('g', { class: 'edge-labels' });
  const defs = el('defs');
  const arrow = (id, orient) => {
    const m = el('marker', { id, viewBox: '0 0 10 8', refX: 10, refY: 4, markerWidth: 10, markerHeight: 8, markerUnits: 'userSpaceOnUse', orient });
    m.append(el('path', { d: 'M0,0 L10,4 L0,8 z' }));
    return m;
  };
  defs.append(arrow('arrow-end', 'auto'), arrow('arrow-start', 'auto-start-reverse'));
  const gAxis = el('g', { class: 'date-axis' });
  svg.append(defs, gAxis, gTag, gLink, gLabel, gNode);

  const lineFor = (l, parent) => { const ln = el('line'); l.el = ln; parent.append(ln); };
  tagLinks.forEach((l) => lineFor(l, gTag));
  links.forEach((l) => {
    lineFor(l, gLink);
    if (l.ab.length) l.el.setAttribute('marker-end', 'url(#arrow-end)');
    if (l.ba.length) l.el.setAttribute('marker-start', 'url(#arrow-start)');
    const parts = [];
    if (l.ab.length) parts.push(`${l.a.title} → ${l.b.title}: ${l.ab.map(relText).join(', ')}`);
    if (l.ba.length) parts.push(`${l.b.title} → ${l.a.title}: ${l.ba.map(relText).join(', ')}`);
    const tip = el('title'); tip.textContent = parts.join('\n'); l.el.append(tip);
    // Short label shown only while an end of the line is highlighted.
    l.lab = el('text', { class: 'edge-label' });
    l.lab.textContent = [...new Set([...l.ab, ...l.ba])].map(relText).join(' / ');
    gLabel.append(l.lab);
  });

  for (const n of nodes) {
    const a = el('a', { href: n.url, class: `node type-${n.type}`, tabindex: 0 });
    const r = 7 + Math.min(8, (degree.get(n.slug) || 0) * 2);
    n.r = r;
    const c = el('circle', { r });
    const g = el('text', { class: 'glyph' });
    g.textContent = n.glyph + '\uFE0E';
    const t = el('text', { x: r + 4, y: 4 });
    t.textContent = n.title.length > 26 ? n.title.slice(0, 25) + '…' : n.title;
    const title = el('title');
    title.textContent = `${n.title} (${n.type}${n.dateLabel ? ', ' + n.dateLabel : ''})`;
    a.append(c, g, t, title);
    gNode.append(a);
    n.el = a;
    a.addEventListener('mouseenter', () => highlight(n));
    a.addEventListener('focus', () => highlight(n));
    a.addEventListener('mouseleave', () => highlight(null));
    a.addEventListener('blur', () => highlight(null));
    drag(n);
  }

  function highlight(n) {
    svg.classList.toggle('hl', !!n);
    for (const m of nodes) m.el.classList.toggle('on', !!n && (m === n || n.links.includes(m.slug)));
    for (const l of links) {
      const on = !!n && (l.a === n || l.b === n);
      l.el.classList.toggle('on', on);
      l.lab.classList.toggle('on', on);
    }
  }

  // Date layout: x is the rank of the node's date among all distinct dates, so spacing is even, not proportional.
  // Undated nodes (organizations, groups...) have no column: they float horizontally, drawn toward the dated
  // nodes they connect to (e.g. CocoaHeads sits among its talks).
  const dates = [...new Set(nodes.map((n) => n.date).filter(Boolean))].sort();
  const rankOf = new Map(dates.map((d, i) => [d, i]));
  for (const n of nodes) n.datedNbrs = n.date ? [] : n.links.map((s) => bySlug.get(s)).filter((m) => m && m.date);
  function layoutTargets() {
    const left = 36;
    const datedMax = Math.max(left + 120, W - 170);
    const step = dates.length > 1 ? (datedMax - left) / (dates.length - 1) : 0;
    for (const n of nodes) n.tx = n.date ? left + rankOf.get(n.date) * step : null;
    // Year ticks at the first column of each year; skip ticks that would crowd the previous label.
    gAxis.replaceChildren();
    let lastX = -Infinity, lastYear = null;
    dates.forEach((d, i) => {
      const year = d.slice(0, 4);
      if (year === lastYear) return;
      lastYear = year;
      const x = left + i * step;
      gAxis.append(el('line', { x1: x, x2: x, y1: 8, y2: H - 22 }));
      if (x - lastX >= 34) { const t = el('text', { x, y: H - 8 }); t.textContent = year; gAxis.append(t); lastX = x; }
    });
  }

  // Simulation
  let alpha = 1;
  function tick() {
    const cx = W / 2, cy = H / 2;
    for (const n of nodes) {
      if (byDate) {
        if (n.date) n.vx += (n.tx - n.x) * 0.1;
        else if (n.datedNbrs.length) n.vx += (n.datedNbrs.reduce((sum, m) => sum + m.x, 0) / n.datedNbrs.length - n.x) * 0.05;
        else n.vx += (cx - n.x) * 0.0035 * alpha;
      } else n.vx += (cx - n.x) * 0.0035 * alpha;
      n.vy += (cy - n.y) * 0.0045 * alpha;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let d2 = dx * dx + dy * dy || 0.01;
        const d = Math.sqrt(d2);
        const f = (4500 / d2) * alpha;
        dx /= d; dy /= d;
        a.vx -= dx * f; a.vy -= dy * f;
        b.vx += dx * f; b.vy += dy * f;
      }
    }
    for (const { a, b } of links) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      // By date, x belongs to the date: links only pull their ends level vertically.
      const f = byDate ? dy * 0.02 * alpha : (d - 120) * 0.03 * alpha;
      const fx = byDate ? 0 : (dx / d) * f, fy = byDate ? f : (dy / d) * f;
      a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
    }
    for (const n of nodes) {
      if (n.fixed) { n.vx = n.vy = 0; continue; }
      n.vx *= 0.8; n.vy *= 0.8;
      n.x = Math.max(n.r + 4, Math.min(W - 150, n.x + n.vx)); // leave room for the label
      n.y = Math.max(n.r + 14, Math.min(H - n.r - 14, n.y + n.vy));
    }
    alpha = Math.max(0, alpha - 0.004);
  }

  function draw() {
    for (const n of nodes) n.el.setAttribute('transform', `translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`);
    for (const l of [...links, ...tagLinks]) {
      // Stop arrow-ended lines at the circle's edge so the arrowhead is not hidden under the node.
      const dx = l.b.x - l.a.x, dy = l.b.y - l.a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / d, uy = dy / d;
      const s0 = l.ba && l.ba.length ? l.a.r + 2 : 0;
      const s1 = l.ab && l.ab.length ? l.b.r + 2 : 0;
      l.el.setAttribute('x1', (l.a.x + ux * s0).toFixed(1)); l.el.setAttribute('y1', (l.a.y + uy * s0).toFixed(1));
      l.el.setAttribute('x2', (l.b.x - ux * s1).toFixed(1)); l.el.setAttribute('y2', (l.b.y - uy * s1).toFixed(1));
      if (l.lab) { l.lab.setAttribute('x', ((l.a.x + l.b.x) / 2).toFixed(1)); l.lab.setAttribute('y', ((l.a.y + l.b.y) / 2 - 4).toFixed(1)); }
    }
  }

  let running = false;
  function run() {
    if (running) return;
    running = true;
    const frame = () => {
      tick(); draw();
      if (alpha > 0.01) requestAnimationFrame(frame); else running = false;
    };
    requestAnimationFrame(frame);
  }
  const reheat = (a = 0.5) => { alpha = Math.max(alpha, a); run(); };

  function size() {
    const r = svg.getBoundingClientRect();
    W = Math.max(300, r.width); H = Math.max(300, r.height);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    layoutTargets();
  }

  function drag(n) {
    let moved = false, start = null;
    const pt = (e) => {
      const r = svg.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    n.el.addEventListener('pointerdown', (e) => {
      start = pt(e); moved = false; n.fixed = true;
      n.el.setPointerCapture(e.pointerId);
    });
    n.el.addEventListener('pointermove', (e) => {
      if (!start) return;
      const p = pt(e);
      if (Math.abs(p.x - start.x) + Math.abs(p.y - start.y) > 4) moved = true;
      if (moved) { n.x = p.x; n.y = p.y; reheat(0.3); draw(); }
    });
    const end = () => { start = null; n.fixed = false; };
    n.el.addEventListener('pointerup', end);
    n.el.addEventListener('pointercancel', end);
    n.el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } });
  }

  // Controls
  const visibleTypes = new Set(nodes.map((n) => n.type));
  document.querySelectorAll('.graph-controls input[data-type]').forEach((cb) =>
    cb.addEventListener('change', () => {
      cb.checked ? visibleTypes.add(cb.dataset.type) : visibleTypes.delete(cb.dataset.type);
      for (const n of nodes) n.el.classList.toggle('hidden', !visibleTypes.has(n.type));
      for (const l of [...links, ...tagLinks]) {
        const hide = !visibleTypes.has(l.a.type) || !visibleTypes.has(l.b.type);
        l.el.classList.toggle('hidden', hide);
        l.lab?.classList.toggle('hidden', hide);
      }
    })
  );
  const dateToggle = document.getElementById('by-date');
  const setLayout = () => {
    byDate = !dateToggle || dateToggle.checked;
    gAxis.classList.toggle('shown', byDate);
    reheat(0.8);
  };
  dateToggle?.addEventListener('change', setLayout);
  const showTags = document.getElementById('show-tags');
  const setTags = () => gTag.classList.toggle('shown', showTags.checked);
  showTags.addEventListener('change', setTags); setTags();

  // Start on a circle so the layout is deterministic, then settle.
  size();
  byDate = !dateToggle || dateToggle.checked;
  gAxis.classList.toggle('shown', byDate);
  nodes.forEach((n, i) => {
    const ang = (i / nodes.length) * Math.PI * 2;
    n.x = byDate && n.tx != null ? n.tx : W / 2 + Math.cos(ang) * Math.min(W, H) * 0.3;
    n.y = byDate ? H / 2 + (((i * 37) % 100) / 100 - 0.5) * H * 0.7 : H / 2 + Math.sin(ang) * Math.min(W, H) * 0.3;
  });
  // Settle quietly before first paint, unless the user prefers reduced motion.
  for (let i = 0; i < 250; i++) tick();
  draw();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { alpha = 0.15; run(); }
  new ResizeObserver(() => { size(); reheat(0.3); }).observe(svg);
})();
