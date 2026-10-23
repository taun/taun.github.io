// Runs the site's real front matter and link parsing over docs/fixtures and prints (or verifies) the result.
//   node docs/fixtures/check.mjs            verify against docs/fixtures/expected.json
//   node docs/fixtures/check.mjs --write    regenerate expected.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { parseFrontMatterYaml } from '../../lib/frontmatter.js';
import { parseLinks } from '../../lib/relations.js';

const dir = path.dirname(fileURLToPath(import.meta.url));
const result = {};
for (const group of ['valid', 'edge']) {
  for (const f of fs.readdirSync(path.join(dir, group)).filter((x) => x.endsWith('.md')).sort()) {
    const slug = f.replace(/\.md$/, '');
    const { data } = matter(fs.readFileSync(path.join(dir, group, f), 'utf8'), { engines: { yaml: parseFrontMatterYaml } });
    const warnings = [];
    const iso = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date ?? null;
    result[`${group}/${slug}`] = {
      type: data.type ?? 'thing',
      date: iso,
      datePrecision: data.datePrecision ?? (iso ? 'day' : null),
      draft: !!data.draft,
      links: parseLinks(data.links, slug, (m) => warnings.push(m)),
      warnings,
    };
  }
}
const out = JSON.stringify(result, null, 2) + '\n';
const expectedPath = path.join(dir, 'expected.json');
if (process.argv.includes('--write')) {
  fs.writeFileSync(expectedPath, out);
  console.log(`wrote ${expectedPath}`);
} else if (fs.readFileSync(expectedPath, 'utf8') !== out) {
  console.error('fixtures differ from expected.json (run with --write to update)');
  process.exit(1);
} else {
  console.log(`ok: ${Object.keys(result).length} fixtures match expected.json`);
}
