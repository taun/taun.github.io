// Home page views. The query picks the view and filters, e.g. /?view=timeline&type=talk&tag=ios&hero=0:
// view (list, timeline, connections), type and tag (repeatable; any type and any tag must match), q (text), hero (0 hides).
// Every view is built at build time; this shows one, hides list items that do not match, and tells the graph which to dim.
(() => {
  const VIEWS = ['list', 'timeline', 'connections'];
  const root = document.documentElement;
  const data = JSON.parse(document.getElementById('graph-data').textContent);
  const q = document.getElementById('q');
  const viewButtons = [...document.querySelectorAll('.views button')];
  const typeChips = [...document.querySelectorAll('.filters button[data-type]')];
  const tagChips = [...document.querySelectorAll('.filters button[data-tag]')];
  const tagBox = document.querySelector('.tag-filters');
  const items = [...document.querySelectorAll('.view [data-slug]')];
  const groups = [...document.querySelectorAll('.view .group')];
  const menu = [...document.querySelectorAll('.site-header nav a')];
  const siteTitle = document.querySelector('.brand').textContent.trim();
  const baseTitle = document.title;

  const read = (search) => {
    const p = new URLSearchParams(search);
    return {
      view: VIEWS.includes(p.get('view')) ? p.get('view') : 'list',
      types: new Set(p.getAll('type')),
      tags: new Set(p.getAll('tag')),
      text: p.get('q') || '',
      hero: !/^(0|false)$/.test(p.get('hero') || ''),
    };
  };
  // Defaults (list, no filters, hero shown) are left out, so the plain home page is "/".
  const write = (s) => {
    const p = new URLSearchParams();
    if (s.view !== 'list') p.set('view', s.view);
    for (const t of s.types) p.append('type', t);
    for (const t of s.tags) p.append('tag', t);
    if (s.text) p.set('q', s.text);
    if (!s.hero) p.set('hero', '0');
    const qs = p.toString();
    return qs ? `?${qs}` : '';
  };

  let state = read(location.search);

  function apply() {
    root.dataset.view = state.view;
    root.classList.toggle('no-hero', !state.hero);
    const text = state.text.trim().toLowerCase();
    const shown = new Set(
      data
        .filter((n) =>
          (!state.types.size || state.types.has(n.type)) &&
          (!state.tags.size || n.tags.some((t) => state.tags.has(t))) &&
          (!text || `${n.title} ${n.tags.join(' ')}`.toLowerCase().includes(text)))
        .map((n) => n.slug)
    );
    for (const li of items) li.hidden = !shown.has(li.dataset.slug);
    for (const g of groups) g.hidden = !g.querySelector('[data-slug]:not([hidden])');
    document.dispatchEvent(new CustomEvent('nodefilter', { detail: shown }));

    for (const b of viewButtons) b.setAttribute('aria-pressed', b.dataset.view === state.view);
    for (const b of typeChips) b.setAttribute('aria-pressed', state.types.has(b.dataset.type));
    for (const b of tagChips) b.setAttribute('aria-pressed', state.tags.has(b.dataset.tag));
    if (state.tags.size) tagBox.open = true;
    if (q.value !== state.text) q.value = state.text;
    if (state.text) root.classList.add('searching');
    else if (document.activeElement !== q) root.classList.remove('searching');

    // The menu entry whose query is this state is the current page (a search stays within it).
    const here = write({ ...state, text: '' });
    let label = '';
    for (const a of menu) {
      const current = a.pathname === location.pathname && write(read(a.search)) === here;
      if (current) { a.setAttribute('aria-current', 'page'); label = a.getAttribute('aria-label') || a.textContent.trim(); } else a.removeAttribute('aria-current');
    }
    document.title = label ? `${label} · ${siteTitle}` : baseTitle;
  }

  // Filter edits replace the history entry; view changes and menu clicks add one, so Back returns to the previous view.
  const update = (change, push = false) => {
    state = { ...state, ...change };
    history[push ? 'pushState' : 'replaceState'](null, '', location.pathname + write(state));
    apply();
  };
  const toggle = (set, v) => { const s = new Set(set); s.has(v) ? s.delete(v) : s.add(v); return s; };

  q.addEventListener('input', () => update({ text: q.value }));
  q.form.addEventListener('submit', (e) => e.preventDefault()); // the header search filters in place here
  typeChips.forEach((b) => b.addEventListener('click', () => update({ types: toggle(state.types, b.dataset.type) })));
  tagChips.forEach((b) => b.addEventListener('click', () => update({ tags: toggle(state.tags, b.dataset.tag) })));
  viewButtons.forEach((b) => b.addEventListener('click', () => update({ view: b.dataset.view }, true)));

  // Links back to this page (the menu, the site title) switch state in place instead of reloading.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
    if (a.origin !== location.origin || a.pathname !== location.pathname || a.hash) return;
    e.preventDefault();
    state = read(a.search);
    history.pushState(null, '', location.pathname + write(state));
    apply();
    scrollTo(0, 0);
  });
  addEventListener('popstate', () => { state = read(location.search); apply(); });

  apply();
})();
