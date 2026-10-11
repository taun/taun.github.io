import yaml from 'js-yaml';
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { buildGraph } from './lib/graph.js';
import { typeGlyph } from './lib/glyphs.js';

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/CNAME');

  // Markdown: allow raw HTML and {.class} attributes on images/blocks
  const md = markdownIt({ html: true, linkify: true }).use(markdownItAttrs);
  eleventyConfig.setLibrary('md', md);

  // A bare year (`date: 2021`) is read by YAML as a number, which Eleventy rejects.
  // Treat it as a year-precision date: 2021-01-01 with datePrecision: year (unless set explicitly).
  eleventyConfig.setFrontMatterParsingOptions({
    engines: {
      yaml: (src) => {
        const data = yaml.load(src) ?? {};
        if (Number.isInteger(data.date) && data.date >= 1000 && data.date <= 9999) {
          data.date = `${data.date}-01-01`;
          data.datePrecision ??= 'year';
        }
        return data;
      },
    },
  });

  // The graph: every node plus its resolved connections, computed once from front matter.
  let graph = null;
  eleventyConfig.addCollection('graph', (api) => {
    graph = buildGraph(api.getFilteredByGlob('src/nodes/*.md'));
    return graph.list; // array of plain node records
  });
  eleventyConfig.addFilter('nodeInfo', (slug) => graph?.list.find((n) => n.slug === slug));
  eleventyConfig.addFilter('relations', (slug) => graph?.relationsOf(slug) ?? []);
  eleventyConfig.addFilter('neighbors', (slug) => graph?.neighborsOf(slug) ?? []);
  eleventyConfig.addFilter('sharedTags', (slug) => graph?.sharedTagNeighbors(slug) ?? []);
  eleventyConfig.addFilter('types', (list) => [...new Set(list.map((n) => n.type))].sort());
  // Equal hue spacing over the sorted types; neighbors on the wheel alternate light/dark (even/odd).
  eleventyConfig.addFilter('typeHue', (i, n) => Math.round((25 + (360 * i) / n) % 360));
  eleventyConfig.addFilter('typeGlyph', typeGlyph);
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v).replace(/</g, '\\u003c'));
  eleventyConfig.addFilter('byYear', (list) => {
    const groups = new Map();
    for (const n of list) {
      const key = n.date ? n.date.slice(0, 4) : 'Undated';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(n);
    }
    // Newest first; undated last. Within a year, newest first too.
    const newestFirst = (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title);
    return [...groups]
      .sort(([a], [b]) => (a === 'Undated') - (b === 'Undated') || b.localeCompare(a))
      .map(([label, items]) => ({ label, items: items.sort(newestFirst) }));
  });
  // Newest first, grouped into 5-year spans aligned to multiples of 5 (2015–2019); undated last.
  eleventyConfig.addFilter('byFiveYears', (list) => {
    const groups = new Map();
    for (const n of list) {
      const start = n.date ? Math.floor(Number(n.date.slice(0, 4)) / 5) * 5 : null;
      if (!groups.has(start)) groups.set(start, []);
      groups.get(start).push(n);
    }
    const newestFirst = (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title);
    return [...groups]
      .sort(([a], [b]) => (a === null) - (b === null) || b - a)
      .map(([start, items]) => ({ label: start === null ? 'Undated' : `${start}–${start + 4}`, items: items.sort(newestFirst) }));
  });
  // Talks grouped by the organization node they link to (e.g. CocoaHeads); newest first, unaffiliated under "Other".
  eleventyConfig.addFilter('talkGroups', (list) => {
    const groups = new Map();
    for (const n of list.filter((x) => x.type === 'talk')) {
      const org = (graph?.neighborsOf(n.slug) ?? []).find((m) => m.type === 'organization');
      const label = org ? org.title : 'Other';
      if (!groups.has(label)) groups.set(label, { label, url: org?.url, items: [] });
      groups.get(label).items.push(n);
    }
    const newestFirst = (a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title);
    return [...groups.values()]
      .sort((a, b) => (a.label === 'Other') - (b.label === 'Other') || a.label.localeCompare(b.label))
      .map((g) => ({ ...g, items: g.items.sort(newestFirst) }));
  });
  eleventyConfig.addFilter('year', (iso) => (iso ? String(iso).slice(0, 4) : ''));

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false, // keep {{ }} and {% %} in Markdown literal
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', '11ty.js', 'html'],
  };
}
