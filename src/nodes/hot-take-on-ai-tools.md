---
title: "Hot take on AI tools"
type: post
tags: []
links: []
summary: "It’s about the output not the ingredients"
date: 2026-11-04
published: 2026-11-04
---

I just finished reading the book [Grit](https://www.taun.org/n/grit) by Angela Duckworth. 

> … grit is about having what some researchers call an "ultimate concern"—a goal you care about so much that it organizes and gives meaning to almost everything you do. And grit is holding steadfast to that goal. Even when you fall down. Even when you screw up. Even when progress toward that goal is halting or slow.
> - **Angela Duckworth** Grit FAQ

I have persevered in following a singular goal my whole life. An external observer might think that goal has been, **to make stuff**. But, it hasn’t really been about the making. It was always about the stuff. If I could have afforded to buy the “stuff” I wanted, I probably would have.

For example, I’ve made quite a bit of custom furniture. Not because I love carpentry (I do) but because I couldn’t find the furniture I wanted at a price I could afford.

My first software driven product was a digital bike speedometer based on a magnet, Hall effect sensor, and microprocessor. At the time, this didn’t exist. I loved cycling, and I wanted a better speedometer. So, I learned enough, physics, electronics, and programming, to make one. The means to an end. But again, really, I just wanted a better, no drag, speedometer. 

This fall, I had the good fortune to be able to attended two software development conferences.
- [Elixir Conf](https://www.elixirconf.com/) 
- and the amazing [Goatmire](https://goatmire.com/) in Varberg Sweden (more on that in a different post). 

Both conferences had a strong focus on AI. How to use it, its implications, the problems, etc. But one strong sentiment expressed in the many workshops and individual conversations was, “_but what about the code?_”, “_how do we maintain code quality?_”, “_how do junior developers learn to write **good** software?_”. This post is my answer to those questions.

## The code doesn’t matter. 

It is and always has been about the [outcome](#outcome) rather than the journey.

Lewis & Clark [canoed across North America](https://en.wikipedia.org/wiki/Lewis_and_Clark_Expedition) not because they loved canoeing, braving blood thirsty mosquitoes, indignant indigenous peoples, canoe busting rapids, and more, but because that was the **easiest** way to cross the country at the time.

> _Our trio of pests still invade and obstruct us on all occasions, these are the Musquetoes eye knats and prickley pears, equal to any three curses that ever poor Egypt laiboured under, except the Mahometant yoke._
> - **Meriwether Lewis** July 24th, 1805

My hot take is that it’s the same for software. I have been writing software to solve problems since punching [punch cards](https://en.wikipedia.org/wiki/Punched_card) for a [PDP11](https://en.wikipedia.org/wiki/PDP-11) and flipping switches on an [Altair 8800](https://en.wikipedia.org/wiki/Altair_8800) was the height of the craft.

The goal of writing software has always been to make a process easier. Whether that meant making it faster and easier to calculate artillery trajectories, or rocket ship trajectories, the people who wrote software were writing with the goal of getting to the desired outcome faster and easier. Or in the case of the moon, getting there and back alive. Of course, they also spent their time and effort on making their craft easier by constantly inventing higher level languages and organizational abstractions. The holy grail of software development has always been to move the human aspect of it to a higher level of abstraction. It was never about writing in a particular language because of the aesthetics of that language. The purpose of new languages were to make reaching the desired outcome, faster, easier, more robust, and more secure, than what was available at the time.

AI is a new higher level of abstraction. It is the equivalent of being able to fly across the country in 6 hours rather than canoe across the country in 6 months. I don’t miss fighting with punch cards nor will I miss the “good ol days” of hand writing and debugging code in ‘#{xyz_language_of_your_choice}’.

—-

[Outcome](#outcome)

When I say “outcome”, I mean the full outcome. Not just “it works”, we’re done. The full outcome being all the goals we have always had for good products.

- **Is it secure?** Can we put our trust in it?
- **Is it reliable?** Will it work tomorrow the same as today? 
- **Is it worth using?** Or is the solution more trouble than it’s worth? Like Apple’s iPhone keyboard since they lost [Ken Kocienda](https://bookshop.org/p/books/creative-selection-inside-apple-s-design-process-during-the-golden-age-of-steve-jobs-ken-kocienda/d762c346f7f7cb7c)
- **Is its internal and external state Observable?** Can we observe when it is doing the wrong thing? Or when there are impending performance issues?
- **Is it maintainable?** If something goes wrong, is it easy fix (for humans or AI)?
- **Is it flexible enough for easy enhancements?** Is the architecture the right fit to enable the future desired changes?
- **Will it last?** Are the materials (libraries and framework) high enough quality to still be viable in 5 years?

[^1]: **And now for the disclaimer**. When I say “outcome”, I mean the full outcome. Not just “it works”, we’re done. The full outcome being all the goals we have always had for good products.