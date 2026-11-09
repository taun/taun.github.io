import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { HtmlBasePlugin } from '@11ty/eleventy';
import { buildGraph, newestFirst } from './lib/graph.js';
import { typeGlyph, typeKey } from './lib/glyphs.js';
import { parseFrontMatterYaml, parsePublished, toIso } from './lib/frontmatter.js';

const FEED_SIZE = 20;

export default function (eleventyConfig) {
  // Registers the URL transform that the core renderTransforms filter runs on feed items to make their URLs
  // absolute. Without it the filter still exists but leaves /assets/… and /n/… relative, with no error.
  eleventyConfig.addPlugin(HtmlBasePlugin);

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
  // RSS: only nodes with `published` (not `date`, which is when the thing happened), newest first.
  eleventyConfig.addCollection('feed', (api) => {
    // A day after today in UTC is in the future everywhere, so a typo like 2062 cannot pin itself to the top.
    const tomorrow = toIso(new Date(Date.now() + 86400000));
    return api
      .getFilteredByGlob('src/nodes/*.md')
      .map((item) => ({ item, published: parsePublished(item.data.published, item.fileSlug) }))
      .filter(({ item, published }) => {
        if (!published || published <= tomorrow) return !!published;
        console.warn(`[feed] "${item.fileSlug}" has a published date in the future: ${published}`);
        return false;
      })
      .sort((a, b) => b.published.localeCompare(a.published) || a.item.fileSlug.localeCompare(b.item.fileSlug))
      .slice(0, FEED_SIZE)
      .map(({ item }) => item);
  });
  // Midday UTC, so readers from Hawaii to New Zealand show the same calendar day the author chose.
  eleventyConfig.addFilter('feedDate', (iso) => new Date(`${iso}T12:00:00Z`).toUTCString());
  // XML 1.0 forbids most control characters even when escaped, and one of them makes strict readers reject the whole feed.
  eleventyConfig.addFilter('xmlChars', (text, where) => {
    const clean = String(text).replace(/[^\t\n\r\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu, '');
    if (clean !== String(text)) console.warn(`[feed] removed characters XML does not allow from "${where}"`);
    return clean;
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
  eleventyConfig.addFilter('newestFirst', (list) => [...list].sort(newestFirst));
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
  eleventyConfig.addFilter('year', (iso) => (iso ? String(iso).slice(0, 4) : ''));

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false, // keep {{ }} and {% %} in Markdown literal
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', '11ty.js', 'html'],
  };
}
