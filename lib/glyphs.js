// Infers a text-style Unicode glyph from a node type name: first by keyword, then a stable shape by name hash.
// Glyphs are BMP symbols (no emoji) so they inherit the type color.
const KEYWORDS = [
  [/person|people|author|human|contact/, '☺'],
  [/org|company|team|employer|school|univers/, '⌂'],
  [/project|build|prototype/, '◈'],
  [/work|job|role|career|tool|craft/, '⚒'],
  [/post|article|blog|note|essay|write/, '✎'],
  [/cv|resume|vita|experience|history/, '☰'],
  [/talk|present|slide|speak|video/, '▶'],
  [/book|read|paper|doc|ref/, '❡'],
  [/event|date|time|milestone/, '◷'],
  [/place|location|city|map/, '⚑'],
  [/idea|concept|theory|thought/, '✦'],
  [/thing|item|object|misc/, '◆'],
];
const SHAPES = ['●', '■', '▲', '★', '✚', '⬟', '▼', '♦'];

export function typeGlyph(type) {
  const t = String(type).toLowerCase();
  for (const [re, g] of KEYWORDS) if (re.test(t)) return g;
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return SHAPES[h % SHAPES.length];
}
