import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { buildGraph, newestFirst } from './lib/graph.js';
import { typeGlyph, typeKey } from './lib/glyphs.js';
import { parseFrontMatterYaml } from './lib/frontmatter.js';

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/CNAME');
  // Appended to CSS/JS URLs (?v=) so each deploy is fetched fresh instead of mixing new pages with cached files.
  eleventyConfig.addGlobalData('buildStamp', Date.now().toString(36));

  // Markdown: allow raw HTML and {.class} attributes on images/blocks
  const md = markdownIt({ html: true, linkify: true }).use(markdownItAttrs);
  eleventyConfig.setLibrary('md', md);

  // Bare-year dates (`date: 2021`) become year-precision dates; see lib/frontmatter.js.
  eleventyConfig.setFrontMatterParsingOptions({ engines: { yaml: parseFrontMatterYaml } });

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
  eleventyConfig.addFilter('tagList', (list) => [...new Set(list.flatMap((n) => n.tags))].sort((a, b) => a.localeCompare(b)));
  // Equal hue spacing over the sorted types; neighbors on the wheel alternate light/dark (even/odd).
  eleventyConfig.addFilter('typeHue', (i, n) => Math.round((25 + (360 * i) / n) % 360));
  // Lightness/chroma set for position i of n. With an odd count the last type would sit between two
  // "even" neighbors (the wheel wraps), so it gets a third, middle tone.
  eleventyConfig.addFilter('typeTone', (i, n) => (n % 2 === 1 && n > 1 && i === n - 1 ? 'mid' : i % 2 === 0 ? 'even' : 'odd'));
  eleventyConfig.addFilter('typeKey', typeKey);
  eleventyConfig.addFilter('isImage', (url) => /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i.test(String(url || '')));
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
    return [...groups]
      .sort(([a], [b]) => (a === 'Undated') - (b === 'Undated') || b.localeCompare(a))
      .map(([label, items]) => ({ label, items: items.sort(newestFirst) }));
  });
  // Newest first, grouped into 5-year spans aligned to multiples of 5 (2015–2019); undated last.
  // A span never ends in the future: the current one ends this year (2025–2026), or at its newest node if later.
  eleventyConfig.addFilter('byFiveYears', (list) => {
    const thisYear = new Date().getFullYear();
    const groups = new Map();
    for (const n of list) {
      const start = n.date ? Math.floor(Number(n.date.slice(0, 4)) / 5) * 5 : null;
      if (!groups.has(start)) groups.set(start, []);
      groups.get(start).push(n);
    }
    return [...groups]
      .sort(([a], [b]) => (a === null) - (b === null) || b - a)
      .map(([start, items]) => {
        if (start === null) return { label: 'Undated', items: items.sort(newestFirst) };
        const newest = Math.max(...items.map((n) => Number(n.date.slice(0, 4))));
        const end = Math.min(start + 4, Math.max(thisYear, newest));
        return { label: end === start ? `${start}` : `${start}–${end}`, items: items.sort(newestFirst) };
      });
  });
  eleventyConfig.addFilter('year', (iso) => (iso ? String(iso).slice(0, 4) : ''));

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false, // keep {{ }} and {% %} in Markdown literal
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', '11ty.js', 'html'],
  };
}
