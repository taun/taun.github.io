// Infers a text-style Unicode glyph from a node type name: first by keyword, then a stable shape by name hash.
// Glyphs are BMP symbols (no emoji) so they inherit the type color.
const KEYWORDS = [
  [/person|people|author|human|contact/, '☺'],
  [/company|firm|business|employer|corp/, '⌂'],
  [/org|team|club|group|school|univers/, '⚐'],
  [/project|build|prototype/, '◈'],
  [/work|job|role|career|tool|craft/, '⚒'],
  [/post|article|blog|note|essay|write/, '✎'],
  [/cv|resume|vita|experience|history/, '☰'],
  [/talk|present|slide|speak|video/, '▶'],
  [/book|read|paper|doc|ref/, '❡'],
  [/event|date|time|milestone/, '◷'],
  [/place|location|city|map/, '⌖'],
  [/idea|concept|theory|thought/, '✦'],
  [/thing|item|object|misc/, '◆'],
];
const SHAPES = ['●', '■', '▲', '★', '✚', '⬟', '▼', '♦'];

// CSS-safe key for a type, used in `type-<key>` classes. Types that are not already a plain
// lowercase word get a short hash so different types never share a key ("C++" vs "C").
export function typeKey(type) {
  const t = String(type).toLowerCase();
  const base = t.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'type';
  if (base === t) return base;
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return `${base}-${h.toString(36).slice(0, 4)}`;
}

export function typeGlyph(type) {
  const t = String(type).toLowerCase();
  for (const [re, g] of KEYWORDS) if (re.test(t)) return g;
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return SHAPES[h % SHAPES.length];
}
