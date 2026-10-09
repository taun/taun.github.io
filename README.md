# taun.org

A static site where every page is a **node** and the views (graph, timeline, list) are generated from each node's front matter. Built with [Eleventy](https://www.11ty.dev/), hosted free on GitHub Pages.

## Add or edit a node

Create `src/nodes/some-name.md`:

```markdown
---
title: "Dan Gelbart"
type: person          # person | organization | project | work | post | thing
date: 1983-01-01      # optional; omit for undated
datePrecision: year   # optional; "year" shows just the year
summary: One line shown in lists and on the timeline.
tags: [engineering]
links: [creo, ken-spencer]   # file names (without .md) of connected nodes
draft: true           # optional; keeps the page out of the build
---

Write the page in Markdown.
```

- **Links are two-way.** If A lists B, B shows A as well. A typo in a link name prints a warning at build time.
- **Images** go in `src/assets/images/` and are referenced as `/assets/images/name.jpg`. Use `![alt](/assets/images/x.png){.align-left}` to float one (`align-left`, `align-right`, `align-center`).
- A `gallery:` list in front matter (`url`, `image_path`, `alt`) renders a thumbnail gallery; `galleryCaption:` adds a caption.
- Regular pages (About, Talks, Contact) are in `src/pages/`.
- The graph, timeline and list all update automatically from the nodes. Nothing else to maintain.

## First-time setup: copy your images

The images, slide PDFs and sounds (about 70 MB) are not in this download. They are unchanged from your current repo. From the folder containing both repos:

```
mkdir -p taun-site/src/assets
cp -r taun.github.io/assets/images taun.github.io/assets/presentations taun.github.io/assets/sounds taun-site/src/assets/
```

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
| `src/pages/` | About, Talks, Contact, 404 |
| `src/_includes/` | Page layouts |
| `src/css/site.css`, `src/js/` | Styling, graph and list scripts (no dependencies) |
| `src/_data/site.json` | Site title, tagline, footer links |
| `lib/graph.js` | Builds nodes and connections from front matter |

## Migration notes

- Old URLs changed: posts and projects now live at `/n/<name>/`. Old links such as `/funw-with-autolayout` will not redirect.
- Dates for undated projects (waveform synthesizer 1980, 2 plane balancer 1990, NMR 1991, MailPortals 2015) were taken from the page text and are set to year precision. Check them.
- The Jekyll site's YouTube/Vimeo auto-embed script was not carried over. Bare video links stay as normal links.
- `_posts_draft/a-theory` was migrated with `draft: true` so it is not published.
