// Front matter YAML parsing shared by the Eleventy build and docs/fixtures/check.mjs.
import yaml from 'js-yaml';

// A year alone (`date: 2021`, read by YAML as a number Eleventy rejects, or quoted `"2021"`) becomes a
// year-precision date: 2021-01-01 with datePrecision: year (unless set explicitly).
export function parseFrontMatterYaml(src) {
  const data = yaml.load(src) ?? {};
  const year = typeof data.date === 'string' && /^\d{4}$/.test(data.date) ? Number(data.date) : data.date;
  if (Number.isInteger(year) && year >= 1000 && year <= 9999) {
    data.date = `${year}-01-01`;
    data.datePrecision ??= 'year';
  }
  return data;
}
