// Builds the node graph from front matter. Pure function over Eleventy's template list.

const TYPE_ORDER = ['person', 'organization', 'project', 'work', 'post', 'thing'];

function toIso(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date) ? null : date.toISOString().slice(0, 10);
}

export function buildGraph(items) {
  const records = items
    .filter((i) => !i.data.draft)
    .map((i) => {
      const slug = i.fileSlug;
      const iso = toIso(i.data.date);
      const precision = i.data.datePrecision || 'day';
      return {
        slug,
        title: i.data.title || slug,
        type: i.data.type || 'thing',
        date: iso, // ISO date or null (undated)
        dateLabel: iso ? (precision === 'year' ? iso.slice(0, 4) : iso) : '',
        summary: i.data.summary || '',
        tags: (i.data.tags || []).map(String),
        url: `/n/${slug}/`,
        links: [...new Set((i.data.links || []).map(String))],
      };
    })
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.title.localeCompare(b.title));

  const bySlug = new Map(records.map((r) => [r.slug, r]));

  // Links are undirected: A listing B is enough, B shows A too.
  const adj = new Map(records.map((r) => [r.slug, new Set()]));
  for (const r of records) {
    for (const target of r.links) {
      if (!bySlug.has(target)) {
        console.warn(`[graph] "${r.slug}" links to unknown node "${target}"`);
        continue;
      }
      adj.get(r.slug).add(target);
      adj.get(target).add(r.slug);
    }
  }
  for (const r of records) r.links = [...adj.get(r.slug)].sort();

  const edges = [];
  for (const r of records) for (const t of r.links) if (r.slug < t) edges.push([r.slug, t]);

  return {
    list: records,
    edges,
    neighborsOf: (slug) => (adj.get(slug) ? [...adj.get(slug)].map((s) => bySlug.get(s)) : []),
    sharedTagNeighbors: (slug) => {
      const me = bySlug.get(slug);
      if (!me) return [];
      return records.filter(
        (o) => o.slug !== slug && !adj.get(slug).has(o.slug) && o.tags.some((t) => me.tags.includes(t))
      );
    },
  };
}

export { TYPE_ORDER };
