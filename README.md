# taun.org

A static site where every page is a **node** and the views (blog list, CV, talks, connections graph) are generated from each node's front matter. Built with [Eleventy](https://www.11ty.dev/), hosted free on GitHub Pages.

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
video: https://youtu.be/...    # optional media: video, archive (own copy), slides, repo
---

Write the page in Markdown.
```

- **Links are directed.** A node's `links:` point from it to the listed nodes, and the target shows the reverse ("Came from" etc.). A plain name means `led-to`; `{ to: name, rel: relation }` sets the relation. Known relations: `led-to`, `worked-at`, `founded`, `part-of`; any other word is shown as written. The graph draws an arrowhead at the target (hover a node to see the relation text). A typo in a link name prints a warning at build time.
- **Images** go in `src/assets/images/` and are referenced as `/assets/images/name.jpg`. Use `![alt](/assets/images/x.png){.align-left}` to float one (`align-left`, `align-right`, `align-center`).
- A `gallery:` list in front matter (`url`, `image_path`, `alt`) renders a thumbnail gallery; `galleryCaption:` adds a caption.
- **Types need no setup.** Filter chips, colors and glyphs are derived from the `type:` values in use. Talks are nodes with `type: talk`; the Talks page groups them by the organization node they link to.
- **Video:** a YouTube `video:` becomes a click-to-load embed on the node page; an `.mp4`/`.webm` URL becomes a player; other URLs are links. `archive:` is your own copy.
- Regular pages (About, Contact, 404) are in `src/pages/`.
- The blog list (home), CV, talks and connections views all update automatically from the nodes. Nothing else to maintain.

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
| `src/pages/` | About, Contact, 404 |
| `src/_includes/` | Page layouts |
| `src/css/site.css`, `src/js/` | Styling, graph, list and video scripts (no dependencies) |
| `src/_data/site.json` | Site title, tagline, footer links |
| `lib/` | `graph.js` builds nodes and connections from front matter; also relations, glyphs, media |

## Migration notes

- Old URLs changed: posts and projects now live at `/n/<name>/`, and the views are `/` (blog), `/talks/`, `/cv/`, `/connections/`. Old links such as `/funw-with-autolayout` will not redirect.
- `_posts_draft/a-theory` was migrated with `draft: true` so it is not published.
