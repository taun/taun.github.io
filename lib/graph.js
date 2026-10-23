import { typeGlyph, typeKey } from './glyphs.js';
import { parseVideo } from './media.js';
import { parseLinks, relLabel, relRank } from './relations.js';

// Builds the node graph from front matter. Pure function over Eleventy's template list.


function toIso(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date) ? null : date.toISOString().slice(0, 10);
}

// Newest first by ISO date (undated last), then title. Shared by every list view.
export const newestFirst = (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title);

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
        typeKey: typeKey(i.data.type || 'thing'),
        glyph: typeGlyph(i.data.type || 'thing'),
        date: iso, // ISO date or null (undated)
        dateLabel: iso ? (precision === 'year' ? iso.slice(0, 4) : iso) : '',
        summary: i.data.summary || '',
        tags: (i.data.tags || []).map(String),
        url: `/n/${slug}/`,
        media: {
          video: parseVideo(i.data.video),
          archive: parseVideo(i.data.archive),
          slides: i.data.slides || '',
          repo: i.data.repo || '',
        },
        out: parseLinks(i.data.links, slug), // directed: [{ to, rel }]
      };
    })
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999') || a.title.localeCompare(b.title));

  const bySlug = new Map(records.map((r) => [r.slug, r]));

  // Links are directed (declaring node -> target). `in` is derived; `links` is the undirected neighbor list.
  const adj = new Map(records.map((r) => [r.slug, new Set()]));
  for (const r of records) r.in = [];
  for (const r of records) {
    r.out = r.out.filter((e) => {
      if (!bySlug.has(e.to)) {
        console.warn(`[graph] "${r.slug}" links to unknown node "${e.to}"`);
        return false;
      }
      return true;
    });
    for (const e of r.out) {
      bySlug.get(e.to).in.push({ from: r.slug, rel: e.rel });
      adj.get(r.slug).add(e.to);
      adj.get(e.to).add(r.slug);
    }
  }
  for (const r of records) r.links = [...adj.get(r.slug)].sort();

  const edges = [];
  for (const r of records) for (const e of r.out) edges.push({ from: r.slug, to: e.to, rel: e.rel });

  // Connections of one node grouped by wording, e.g. "Led to", "Came from", "Worked at".
  const relationsOf = (slug) => {
    const me = bySlug.get(slug);
    if (!me) return [];
    const groups = new Map();
    const add = (dir, rel, other) => {
      const key = `${dir}|${rel}`;
      if (!groups.has(key)) groups.set(key, { dir, rel, label: relLabel(rel, dir), items: [] });
      groups.get(key).items.push(bySlug.get(other));
    };
    for (const e of me.out) add('out', e.rel, e.to);
    for (const e of me.in) add('in', e.rel, e.from);
    return [...groups.values()]
      .sort((a, b) => (a.dir === 'in') - (b.dir === 'in') || relRank(a.rel) - relRank(b.rel) || a.label.localeCompare(b.label))
      .map((g) => ({ ...g, items: g.items.sort(newestFirst) }));
  };

  return {
    list: records,
    edges,
    relationsOf,
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
