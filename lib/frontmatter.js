// Front matter YAML parsing shared by the Eleventy build and docs/fixtures/check.mjs.
import yaml from 'js-yaml';

// js-yaml's default schema without timestamps, for reading `published` as written. Merge keys and the explicit
// tags (!!binary, !!set…) stay, so it reads everything else the same way the first load did.
const NO_TIMESTAMP_SCHEMA = yaml.CORE_SCHEMA.extend({
  implicit: [yaml.types.merge],
  explicit: [yaml.types.binary, yaml.types.omap, yaml.types.pairs, yaml.types.set],
});

// A date (or date string) as YYYY-MM-DD in UTC, or null. A string day that does not exist (2026-02-30) rolls over
// to another day, so `toIso(s) === s` holds only for real days.
export function toIso(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  return isNaN(date) ? null : date.toISOString().slice(0, 10);
}

// A year alone (`date: 2021`, read by YAML as a number Eleventy rejects, or quoted `"2021"`) becomes a
// year-precision date: 2021-01-01 with datePrecision: year (unless set explicitly).
export function parseFrontMatterYaml(src) {
  const data = yaml.load(src) ?? {};
  // `published` stays as written: as a Date, 2026-02-30 would already be March 2 and a timestamp could change day.
  if (data.published instanceof Date) {
    try {
      data.published = yaml.load(src, { schema: NO_TIMESTAMP_SCHEMA }).published;
    } catch {
      data.published = data.published.toISOString(); // e.g. an explicit !!timestamp: invalid, so it warns and stays out
    }
  }
  const year = typeof data.date === 'string' && /^\d{4}$/.test(data.date) ? Number(data.date) : data.date;
  if (Number.isInteger(year) && year >= 1000 && year <= 9999) {
    data.date = `${year}-01-01`;
    data.datePrecision ??= 'year';
  }
  return data;
}

// `published` (the day a node entered the RSS feed) as YYYY-MM-DD. Null if absent, or if it is not a real day in
// that form, which also warns: the node then stays out of the feed.
export function parsePublished(raw, from, warn = console.warn) {
  if (raw == null) return null;
  const valid = typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw) && toIso(raw) === raw;
  if (valid) return raw;
  warn(`[feed] "${from}" has an invalid published date: ${raw}`);
  return null;
}

