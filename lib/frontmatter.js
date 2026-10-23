// Front matter YAML parsing shared by the Eleventy build and docs/fixtures/check.mjs.
import yaml from 'js-yaml';

// A bare year (`date: 2021`) is read by YAML as a number, which Eleventy rejects.
// Treat it as a year-precision date: 2021-01-01 with datePrecision: year (unless set explicitly).
export function parseFrontMatterYaml(src) {
  const data = yaml.load(src) ?? {};
  if (Number.isInteger(data.date) && data.date >= 1000 && data.date <= 9999) {
    data.date = `${data.date}-01-01`;
    data.datePrecision ??= 'year';
  }
  return data;
}
