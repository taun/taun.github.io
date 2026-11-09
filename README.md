# taun.org

A static site where every page is a **node** and the home page's views (list, timeline, connections graph), filtered by type and tag, are generated from each node's front matter. Built with [Eleventy](https://www.11ty.dev/), hosted free on GitHub Pages.

## Add or edit a node

Create `src/nodes/some-name.md`:

```markdown
---
title: "Dan Gelbart"
type: person          # any word: person, company, organization, project, work, post, talk, cv, event, thing...
date: 1983-01-01      # optional; omit for undated. A bare year (date: 1983) means year precision
datePrecision: year   # optional; "year" shows just the year (implied by a bare year)
summary: One line shown in lists and on the timeline.
tags: [engineering]
links: [creo, { to: ken-spencer, rel: worked-at }]   # node file names (without .md), optionally with a relation
draft: true           # optional; keeps the page out of the build
published: 2026-11-09 # optional; the day it entered the RSS feed. Without it the node is not in the feed
video: https://youtu.be/...    # optional media: video, archive (own copy), slides, repo
---

Write the page in Markdown.
```

- **RSS:** `/feed.xml` lists the newest nodes with `published` (20, `FEED_SIZE` in `eleventy.config.js`), in full. It is off by default: a node is in the feed only once you add `published`. It is separate from `date`, which is when the thing happened.
- **Links are directed.** A node's `links:` point from it to the listed nodes, and the target shows the reverse ("Came from" etc.). A plain name means `led-to`; `{ to: name, rel: relation }` sets the relation. Known relations: `led-to`, `worked-at`, `founded`, `part-of`; any other word is shown as written. The graph draws an arrowhead at the target (hover a node to see the relation text). A typo in a link name prints a warning at build time.
- **Images** go in `src/assets/images/` and are referenced as `/assets/images/name.jpg`. Use `![alt](/assets/images/x.png){.align-left}` to float one (`align-left`, `align-right`, `align-center`).
- A `gallery:` list in front matter (`url`, `image_path`, `alt`) renders a thumbnail gallery; `galleryCaption:` adds a caption.
- **Types need no setup.** Filter chips, colors and glyphs are derived from the `type:` values in use. Talks are nodes with `type: talk`; the Talks menu entry is the list filtered to that type.
- **Video:** a YouTube `video:` becomes a click-to-load embed on the node page; an `.mp4`/`.webm` URL becomes a player; other URLs are links. `archive:` is your own copy.
- Regular pages (currently just 404, and the forwarding pages for the old view URLs) are in `src/pages/`.
- The views and filters update automatically from the nodes. Nothing else to maintain.

## Views, filters and the menu

The home page is the only list page. Its query picks what it shows:

| Parameter | Values | Default |
|---|---|---|
| `view` | `list` (newest first, each with its date), `timeline` (by year, with summaries), `connections` (graph), `shelf` (bookshelf: each node's `header.teaser` image, or a spine in its type color, newest first) | `list` |
| `type` | a node type; repeat for more (`type=talk&type=post`) | all types |
| `tag` | a tag; repeat for more | all tags |
| `q` | text to find in titles and tags (the header search) | none |
| `hero` | `0` hides the hero image and welcome text | shown |

A node matches when it has any of the chosen types and any of the chosen tags (and the text, if given). Lists and the graph hide the rest, and the graph lays out just the matches; its "neighbors" checkbox adds the nodes they link to, drawn smaller, so their connections show. The controls on the page change the query, so any view can be bookmarked or shared, and a node page's type and tags link to the matching filter.

Search is the magnifier at the end of the menu. On the home page it filters the current view as you type, within any type and tag filters already set, and the view and filter controls are hidden while it is open to leave room for the results; Escape clears and closes it. On other pages, Enter goes to the home list with `q=` and the hero hidden.

The header menu is `menu` in `site.json`: each entry is a `label` and a `query` (without `?`), e.g. `{ "label": "Talks", "query": "view=list&type=talk&hero=0" }`; an empty query is the plain home page. An optional `icon` (the name of an SVG in `src/_includes/icons/`, e.g. `"home"`) shows that icon instead of the label, which becomes its accessible name and tooltip. The old `/cv/`, `/talks/` and `/connections/` URLs forward to the matching query (`src/pages/redirects.njk`).

A new view is a section with class `view view-<name>` in `src/_includes/home.njk`, its name in `VIEWS` in `src/js/view.js`, and one CSS line showing it for `html[data-view="<name>"]`. Its items need `data-slug` (and their groups `class="group"`) for filtering.

## Run locally

```
npm install
npm start        # http://localhost:8080, rebuilds on save
npm run build    # writes _site/
```

## Publish (free)

1. Push this folder to the `main` branch of your `taun.github.io` repository (replacing the Jekyll files).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push. `src/CNAME` keeps the custom domain `www.taun.org`.

Tip: do the first push on a branch and check the Actions run before switching Pages over, so the live site is never down.

## Where things are

| Path | What |
|---|---|
| `src/nodes/` | All node pages |
| `src/pages/` | 404, forwarding pages for old URLs |
| `src/_includes/` | Page layouts (`home.njk` holds the views) |
| `src/css/site.css`, `src/js/` | Styling; view, graph and video scripts (no dependencies) |
| `src/_data/site.json` | Site title, tagline, footer `links` (`label`, `url`, optional `rel` and `type`), `menu` (above), and `hero` (home banner style, below) |
| `lib/` | `graph.js` builds nodes and connections from front matter; also relations, glyphs, media |

The home banner image is `header.image` in `src/index.md`. `hero` in `site.json` sets how it is shown:

- `"overlay"` (the default when absent): the header bar is at the top, and the site title and tagline are drawn over the image below it.
- `"top"`: the image, with no text, is at the very top of the home page, above the header. The site title in the header is the home page's heading, the header and footer use the content width, and the footer on every page shows the tagline centered above the centered footer links.

## Migration notes

- Old URLs changed: posts and projects now live at `/n/<name>/`, and the views are query views of `/` (see above; `/talks/`, `/cv/` and `/connections/` forward there). Old links such as `/funw-with-autolayout` will not redirect.
- `_posts_draft/a-theory` was migrated with `draft: true` so it is not published.
