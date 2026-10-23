// Link relations. Every link is directed (declaring node -> target) and carries a relation; plain slugs mean DEFAULT_REL.
// Free-form relations are allowed; the ones below just get nicer wording.
export const DEFAULT_REL = 'led-to';

const VOCAB = {
  'led-to': { out: 'Led to', in: 'Came from' },
  'worked-at': { out: 'Worked at', in: 'Worked here' },
  founded: { out: 'Founded', in: 'Founded by' },
  'part-of': { out: 'Part of', in: 'Includes' },
};
const ORDER = Object.keys(VOCAB);

const humanize = (rel) => rel.replace(/[-_]+/g, ' ').replace(/^./, (c) => c.toUpperCase());

export function relLabel(rel, dir) {
  return VOCAB[rel]?.[dir] ?? (dir === 'out' ? humanize(rel) : `${humanize(rel)} (incoming)`);
}

export function relRank(rel) {
  const i = ORDER.indexOf(rel);
  return i === -1 ? ORDER.length : i;
}

// `links:` entries are a slug string or { to, rel }. Returns [{ to, rel }] without duplicates.
export function parseLinks(raw, from, warn = console.warn) {
  const seen = new Set();
  const out = [];
  for (const entry of raw || []) {
    const e = typeof entry === 'string' ? { to: entry } : entry;
    if (!e || typeof e.to !== 'string') {
      warn(`[graph] "${from}" has a link that is neither a slug nor { to, rel }: ${JSON.stringify(entry)}`);
      continue;
    }
    const rel = String(e.rel || DEFAULT_REL).trim().toLowerCase().replace(/\s+/g, '-');
    const key = `${e.to}|${rel}`;
    if (e.to === from || seen.has(key)) continue;
    seen.add(key);
    out.push({ to: e.to, rel });
  }
  return out;
}
