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
  for (const n of nodes) {
    for (const t of n.links) {
      const o = bySlug.get(t);
      if (o && n.slug < o.slug) links.push({ a: n, b: o });
    }
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      if (a.links.includes(b.slug)) continue;
      if (a.tags.some((t) => b.tags.includes(t))) tagLinks.push({ a, b });
    }
  }
  const degree = new Map(nodes.map((n) => [n.slug, n.links.length]));

  let W = 800, H = 600;
  const gTag = el('g', { class: 'edges tag-edges' });
  const gLink = el('g', { class: 'edges' });
  const gNode = el('g');
  svg.append(gTag, gLink, gNode);

  const lineFor = (l, parent) => { const ln = el('line'); l.el = ln; parent.append(ln); };
  tagLinks.forEach((l) => lineFor(l, gTag));
  links.forEach((l) => lineFor(l, gLink));

  for (const n of nodes) {
    const a = el('a', { href: n.url, class: `node type-${n.type}`, tabindex: 0 });
    const r = 7 + Math.min(8, (degree.get(n.slug) || 0) * 2);
    n.r = r;
    const c = el('circle', { r });
    const t = el('text', { x: r + 4, y: 4 });
    t.textContent = n.title.length > 26 ? n.title.slice(0, 25) + '…' : n.title;
    const title = el('title');
    title.textContent = `${n.title} (${n.type}${n.dateLabel ? ', ' + n.dateLabel : ''})`;
    a.append(c, t, title);
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
    for (const l of links) l.el.classList.toggle('on', !!n && (l.a === n || l.b === n));
  }

  // Simulation
  let alpha = 1;
  function tick() {
    const cx = W / 2, cy = H / 2;
    for (const n of nodes) {
      n.vx += (cx - n.x) * 0.0035 * alpha;
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
      const f = (d - 120) * 0.03 * alpha;
      const fx = (dx / d) * f, fy = (dy / d) * f;
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
      l.el.setAttribute('x1', l.a.x.toFixed(1)); l.el.setAttribute('y1', l.a.y.toFixed(1));
      l.el.setAttribute('x2', l.b.x.toFixed(1)); l.el.setAttribute('y2', l.b.y.toFixed(1));
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
      for (const l of [...links, ...tagLinks])
        l.el.classList.toggle('hidden', !visibleTypes.has(l.a.type) || !visibleTypes.has(l.b.type));
    })
  );
  const showTags = document.getElementById('show-tags');
  const setTags = () => gTag.classList.toggle('shown', showTags.checked);
  showTags.addEventListener('change', setTags); setTags();

  // Start on a circle so the layout is deterministic, then settle.
  size();
  nodes.forEach((n, i) => {
    const ang = (i / nodes.length) * Math.PI * 2;
    n.x = W / 2 + Math.cos(ang) * Math.min(W, H) * 0.3;
    n.y = H / 2 + Math.sin(ang) * Math.min(W, H) * 0.3;
  });
  // Settle quietly before first paint, unless the user prefers reduced motion.
  for (let i = 0; i < 250; i++) tick();
  draw();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) { alpha = 0.15; run(); }
  new ResizeObserver(() => { size(); reheat(0.3); }).observe(svg);
})();
