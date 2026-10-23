---
title: "Edge cases"
type: thing
tags: []
links: [edge-cases-self, no-such-node, { rel: founded }, 42]
---

Self links and duplicates are dropped silently; a link that is neither a slug nor { to, rel } warns; an unknown target warns at graph build time.
