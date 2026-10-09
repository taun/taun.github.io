import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { buildGraph } from './lib/graph.js';

export default function (eleventyConfig) {
  // Static files copied as-is
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/CNAME');

  // Markdown: allow raw HTML and {.class} attributes on images/blocks
  const md = markdownIt({ html: true, linkify: true }).use(markdownItAttrs);
  eleventyConfig.setLibrary('md', md);

  // The graph: every node plus its resolved connections, computed once from front matter.
  let graph = null;
  eleventyConfig.addCollection('graph', (api) => {
    graph = buildGraph(api.getFilteredByGlob('src/nodes/*.md'));
    return graph.list; // array of plain node records
  });
  eleventyConfig.addFilter('nodeInfo', (slug) => graph?.list.find((n) => n.slug === slug));
  eleventyConfig.addFilter('neighbors', (slug) => graph?.neighborsOf(slug) ?? []);
  eleventyConfig.addFilter('sharedTags', (slug) => graph?.sharedTagNeighbors(slug) ?? []);
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v).replace(/</g, '\\u003c'));
  eleventyConfig.addFilter('byYear', (list) => {
    const groups = new Map();
    for (const n of list) {
      const key = n.date ? n.date.slice(0, 4) : 'Undated';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(n);
    }
    return [...groups].map(([label, items]) => ({ label, items }));
  });
  eleventyConfig.addFilter('year', (iso) => (iso ? String(iso).slice(0, 4) : ''));

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false, // keep {{ }} and {% %} in Markdown literal
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', '11ty.js', 'html'],
  };
}
