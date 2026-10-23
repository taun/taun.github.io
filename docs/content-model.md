# Content model

The authoritative description of a node file, for tools that read or write this site's content (for example the Breezy app in `../Breezy`). If the build code and this document disagree, the code wins: fix the document, then run `node docs/fixtures/check.mjs --write` and review the diff.

Code that implements it: `lib/frontmatter.js` (dates), `lib/relations.js` (links), `lib/media.js` (video URLs), `lib/graph.js` (derived data), `lib/glyphs.js`.

## File

`src/nodes/<slug>.md`, a flat folder (the collection glob is not recursive). The file is YAML front matter between `---` lines, then a Markdown body.

- **Identity:** the slug is the filename without `.md`. It is the node's ID, the target in `links:`, and the URL `/n/<slug>/`. Two nodes cannot share a slug.
- **Slug characters:** lowercase letters, digits and hyphens by convention (nothing enforces it).
- **Body:** Markdown with raw HTML allowed, `{.class}` attributes on images/blocks, and no template processing (`{{ }}` stays literal).

## Front matter

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes in practice | Falls back to the slug if missing. |
| `type` | string | no (default `thing`) | Open vocabulary. Types in use: company, cv, organization, person, post, project, talk, thing, work (`event` is anticipated). New values need no setup: chips, colors and glyphs derive from the data. |
| `date` | date string or year | no | `YYYY-MM-DD`, or a bare year (`2021`). Undated nodes are allowed. |
| `datePrecision` | `day` \| `year` | no | `year` shows only the year. Implied `year` for a bare-year date. |
| `summary` | string | no | One line for lists and the CV. |
| `tags` | string[] | no | Shared tags produce the "Same tags" list and the optional dashed graph edges. |
| `links` | (slug \| `{to, rel}`)[] | no | See below. |
| `draft` | boolean | no | `true` keeps the node out of the build entirely (no page, not in the graph). |
| `video` | URL | no | YouTube URL (click-to-load embed), `.mp4/.webm/.m4v/.mov` (player), or any other URL (link). |
| `archive` | URL | no | Own copy of the video; played inline if `video` is not playable. |
| `slides` | path or URL | no | Usually `/assets/presentations/<file>.pdf`. |
| `repo` | URL | no | Source link. |
| `header` | `{image, teaser, image_description}` | no | `image` renders as a banner on the node page. |
| `gallery` | `{url, image_path, alt}[]` | no | Thumbnail gallery; `galleryCaption` (string) adds a caption. |

Unknown keys are ignored by the build. **Writers must preserve keys they do not understand**, as well as their order, comments and formatting where possible, so that edits produce minimal diffs.

### Dates

- `date: 2021` (an unquoted integer 1000–9999) is converted to `2021-01-01` with `datePrecision: year` unless a precision is given.
- A quoted `"2021"` is a string, not converted. Prefer the unquoted form or a full date.
- Dates order lists and the graph. The graph ranks distinct dates and spaces them evenly (not proportionally). Nodes without a date float.
- A numeric date outside 1000–9999 makes the build fail ("Data cascade value for `date` is invalid"). Writers must not emit one.

### Links

`links:` points *from* this node *to* each target. They are directed; the target's page lists the reverse.

- A plain slug means relation `led-to`.
- `{ to: <slug>, rel: <relation> }` sets the relation. A missing `rel` is `led-to`.
- Relations are normalized: trimmed, lowercased, whitespace to hyphens (`Worked At` becomes `worked-at`).
- Known relations (with their wording): `led-to` ("Led to" / "Came from"), `worked-at` ("Worked at" / "Worked here"), `founded` ("Founded" / "Founded by"), `part-of` ("Part of" / "Includes"). Any other word is allowed and shown as written (incoming gets "(incoming)").
- Duplicates (same target and relation) and self links are dropped silently.
- An entry that is neither a slug nor `{to, rel}` prints a warning and is dropped.
- A target slug with no node prints a warning at graph build and is dropped.
- A node can link to the same target with several relations.
- Writers should keep the simplest form: a plain slug for `led-to`, an object only when the relation is something else.

### Derived data (do not store)

The build computes incoming links, undirected neighbors, the display date label (`2021` for year precision), media kind, the type glyph and color, and the URL. Editors may compute them for display but must never write them into a file.

## Assets

Files live in `src/assets/` (`images/`, `presentations/`, `sounds/`) and are referenced by absolute path from the site root: `/assets/images/name.jpg`. They are copied unchanged.

## Fixtures

`docs/fixtures/valid` and `docs/fixtures/edge` hold sample node files, and `expected.json` holds what the real parsing code derives from each (type, date, precision, draft, normalized links, warnings). `node docs/fixtures/check.mjs` verifies them. Other implementations should produce the same normalized values for the same files.
