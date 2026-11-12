# Content model

The authoritative description of a node file, for tools that read or write this site's content (for example the Breezy app in `../Breezy`). If the build code and this document disagree, the code wins: fix the document, then run `node docs/fixtures/check.mjs --write` and review the diff.

Code that implements it: `lib/frontmatter.js` (dates), `lib/relations.js` (links), `lib/media.js` (video URLs), `lib/graph.js` (derived data), `lib/glyphs.js`.

## File

`src/nodes/<slug>.md`, a flat folder (the collection glob is not recursive). The file is YAML front matter between `---` lines, then a Markdown body.

- **Identity:** the slug is the filename without `.md`. It is the node's ID, the target in `links:`, and the URL `/n/<slug>/`. Two nodes cannot share a slug.
- **Slug characters:** lowercase letters, digits and hyphens by convention (nothing enforces it).
- **Body:** Markdown with raw HTML allowed, `{.class}` attributes on images/blocks, footnotes (`[^1]` with a `[^1]: text` definition, or inline `^[text]`), and no template processing (`{{ }}` stays literal).

## Front matter

| Key | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes in practice | Falls back to the slug if missing. |
| `type` | string | no (default `thing`) | Open vocabulary; any string, including spaces or symbols (CSS classes use a sanitized key from `typeKey` in `lib/glyphs.js`). Types in use: company, cv, organization, person, post, project, talk, thing, work (`event` is anticipated). New values need no setup: chips, colors and glyphs derive from the data. |
| `date` | date string or year | no | `YYYY-MM-DD`, or a bare year (`2021`). Undated nodes are allowed. |
| `datePrecision` | `day` \| `year` | no | `year` shows only the year. Implied `year` for a bare-year date. |
| `published` | `YYYY-MM-DD` | no | The day the node entered the RSS feed. Absent means it is not in the feed. See below. |
| `summary` | string | no | One line for lists and the CV. |
| `tags` | string[] | no | Shared tags produce the "Same tags" list and the optional dashed graph edges. |
| `links` | (slug \| `{to, rel}`)[] | no | See below. |
| `draft` | boolean | no | `true` keeps the node out of the build entirely (no page, not in the graph). |
| `video` | URL | no | YouTube URL (click-to-load embed), `.mp4/.webm/.m4v/.mov` (player), or any other URL (link). |
| `archive` | URL | no | Own copy of the video; played inline if `video` is not playable. |
| `slides` | path or URL | no | Usually `/assets/presentations/<file>.pdf`. |
| `repo` | URL | no | Source link. |
| `header` | `{image, teaser, image_description}` | no | `image` renders as a banner on the node page. `teaser` is the node's thumbnail on the home page's bookshelf view (shown at its own aspect ratio; nodes without one appear as a spine). `image_description` is not used yet. |
| `gallery` | `{url, image_path, alt}[]` | no | Thumbnail gallery; `galleryCaption` (string) adds a caption. |

Text values and the body must not contain control characters other than tab, line feed and carriage return in the body (XML forbids them in the feed, and YAML cannot hold them unescaped). One-line values (title, type, tags, relations, media) have no line breaks or tabs. A summary may have line breaks; the site shows them as spaces. The build removes forbidden characters from the feed with a warning; writers should refuse them as they are typed.

Unknown keys are ignored by the build. **Writers must preserve keys they do not understand**, as well as their order, comments and formatting where possible, so that edits produce minimal diffs.

### Dates

- A year alone, `date: 2021` (an integer 1000–9999) or `date: "2021"`, is converted to `2021-01-01` with `datePrecision: year` unless a precision is given.
- Dates order lists and the graph. The graph ranks distinct dates and spaces them evenly (not proportionally). Nodes without a date float.
- A numeric date outside 1000–9999 makes the build fail ("Data cascade value for `date` is invalid"). Writers must not emit one.

### Published

`date` is when the thing happened (a 1975 project can be written today), so the feed cannot use it. `/feed.xml` lists the newest nodes that have `published` (20, `FEED_SIZE` in `eleventy.config.js`), newest first, ignoring drafts. A value that is not a real calendar day written as `YYYY-MM-DD` (a bare year, a timestamp, `2026-02-30`) is invalid: the node stays out of the feed, and the build warns once the node is live (drafts are not built, so editors should flag it earlier; the fixtures record the warning either way). A day after tomorrow (UTC) is taken as a typo: the build warns and leaves the node out until then. Items are dated midday UTC on that day. Characters XML does not allow, such as a pasted form feed, are removed from the feed with a warning naming the node.

Feed readers identify an entry by its URL, so editing a node, or changing `published`, should not make it new to subscribers; renaming its slug does. The feed is opt-in and off by default: writers must not add `published` on their own, including when a node goes live, and must not set it from `date`. It is added only when the author asks, with the current day. Writers should remove it when a node goes back to draft, and otherwise leave it alone. All new content starts as a draft (writers should create nodes with `draft: true`).

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

## Editor state files (Breezy only)

`.breezy/nodes/<slug>.json`, one per node, written only by Breezy: the editing state of that node (tab, mode, cursor) and its unpublished body draft, so they follow the node from one device to another. They are outside `src`, so the build never reads, copies or publishes them, and a push that changes only them does not deploy the site (`paths-ignore` in `.github/workflows/deploy.yml`). The repository is public, so they can be read on GitHub.

```json
{
  "version": 1,
  "editor": { "tab": "body", "mode": "draft", "selection": [1204, 1204] },
  "draft": { "text": "…", "base": "<git blob sha of the body the draft started from>" }
}
```

- **Keys:** `editor.tab` is `title`, `date`, `links`, `media` or `body`; `editor.mode` is `edit`, `draft` or `preview`; `editor.selection` is `[start, end]` in UTF-16 offsets into the body; `draft` is absent when there is no draft. Every key is optional except `version`.
- **Compatibility:** writers keep keys they do not understand and never lower `version`. A file that does not parse is treated as absent.
- **Lifecycle:** deleted together with its node. A node without one simply has no saved state. Other tools can ignore these files.

## Assets

Files live in `src/assets/` (`images/`, `presentations/`, `sounds/`) and are referenced by absolute path from the site root: `/assets/images/name.jpg`. They are copied unchanged.

## Fixtures

`docs/fixtures/valid` and `docs/fixtures/edge` hold sample node files, and `expected.json` holds what the real parsing code derives from each (type, date, precision, draft, published, normalized links, warnings). `node docs/fixtures/check.mjs` verifies them. Other implementations should produce the same normalized values for the same files.
