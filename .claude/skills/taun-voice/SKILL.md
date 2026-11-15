---
name: taun-voice
description: Taun's writing voice for taun.org. Use whenever writing or editing node/blog prose (src/nodes/*.md bodies, company/role/patent/project write-ups, summaries) on Taun's behalf, and for the required attribution footnote on anything Claude writes.
---

# Taun voice

Taun writes like an engineer talking to a friend over coffee: first person, plain words, a clear opinion, and a concrete story to back it up. This guide comes from his own posts in `src/nodes/`: hot-take-on-ai-tools, grit, endurance-by, breezy-a-native-static-blog-editor, theremin, hp-67, history-of-flash, waveform-synthesizer, fun-with-auto-layout, the-tech-below-the-surface, a-theory, nmr-pulse-programmer, oop-in-elixir, ios-appdelegate-timeline and daisy-sensor-api-p1. Re-read two or three of them before writing anything long.

**Whose words are whose:** all node prose written before 2026-11-15 is Taun's own, even though many commits carry a Claude `Co-Authored-By` line; those commits were migrations and code. From then on, Claude-written prose carries the `[^claude]` footnote. So when you re-derive or refine this voice, use only text without that footnote.

## The through-line: outcome over craft
- Software, like carpentry, is a means to the "stuff". He builds things because the thing he wanted didn't exist or cost too much: the bike speedometer, the furniture, the blog editor.
- Lead with **why** (the problem, the motivation, who it was for), then **what** was built, then **how it turned out**.
- The outcome is the full outcome: secure, reliable, worth using, observable, maintainable, flexible, built to last.

## Sentences
- First person ("I", "we", "my team"). Speak to the reader directly: "you might be asking…", "What's a theremin you ask?".
- Mostly short, declarative sentences. Use fragments for emphasis and rhythm: "Big picture stuff." "No bonking." "Lots and lots of carbs." "Yet."
- Keep long sentences for explaining a mechanism step by step.
- State the thesis outright, sometimes as a heading or a one-line paragraph: "The code doesn't matter." "The source is (almost) never wrong."
- Use "I believe…" and "I suggest…" for opinions. Hedge with a parenthetical, not with weasel words.
- Asides start with "By the way," or sit in parentheses.

## Content habits
- **Concrete specifics:** numbers, times, durations, places, part numbers and names (555 timer, PDP-11, 9:00am–12:00pm, "approximately 4 months", "for over a decade").
- **Analogies** from history and physical making: Lewis & Clark by canoe vs. flying, carpentry and furniture, punch cards. Use one per piece, two at most.
- **Story arc:** problem → what I tried or changed → result. Reviews use the headings About / I learned / I changed / Result.
- **Project write-ups:** a short why, a bulleted inventory of what was designed or integrated, then a closing outcome sentence ("It was used by scientists and future scientists for over a decade.").
- **Credit people by name** and link to them.
- A pull quote with a bold attribution can open a piece (`> quote` then `> - **Name** source`).
- Recurring phrases that are fine to use sparingly: "holy grail", "the $64,000 question", "Wow!", ":-)".

## Formatting
- **Bold** for the key idea or punchline. _Italics_ for book and product titles, and for quoted speech or questions.
- Link generously and inline to sources: Wikipedia, vendor and product pages, people's pages. Links are part of the voice.
- `##` section headings. Bullet lists, often with **bold lead-ins**, sometimes phrased as questions ("**Is it reliable?** Will it work tomorrow the same as today?").
- A `## Links` section at the end for references.

## Tone
- Warm, curious, self-deprecating ("I'm slow", "a carb based life form"). Enthusiastic without hype. Never snarky about people.
- Values that recur: reliability (100% or it's a failure), observability, maintainability, empathy for users, customers and teammates, team practice and mentoring.

## Avoid
- Resume-speak and corporate filler: "leveraging", "demonstrating", "showcasing", "spearheaded", "synergy", "cutting-edge", "robust solution", "passionate about".
- Hype and superlatives Taun didn't use. Filler openings ("In today's fast-paced world…") and summary closings ("In conclusion…").
- Third person about Taun inside his own pages (company pages may name him alongside co-founders when listing founders).
- Inventing feelings, anecdotes, numbers or claims. Every fact is either Taun's own (resume, his messages, his posts) or sourced and linked. When unsure, leave it out or ask.
- Em-dash-heavy, overly polished cadence. Taun's punctuation is plain, with commas and periods.

## Attribution (required)
Any node body that contains prose Claude wrote ends with this footnote, referenced with `[^claude]` at the end of each Claude-written section or paragraph:

```
[^claude]: Co-written by Claude (Anthropic, <model name>) in Taun's voice from the linked sources.
```

Name the real source at the end: "from the linked sources" for web research, "from Taun's account" when the prose is built from what Taun told you, or both.

- Text that is verbatim from Taun (his resume bullets, his own words from the conversation, his existing posts) gets no footnote.
- Front-matter `summary:` lines can't carry a footnote. Take them from Taun's own phrasing, or keep them to plain factual labels.
- Footnotes render through markdown-it-footnote (`eleventy.config.js`), so `[^claude]` can be referenced more than once on a page.
