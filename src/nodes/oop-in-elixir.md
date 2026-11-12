---
title: "OOP in Elixir"
type: talk
tags: [smalltalk, oop, elixir, software]
links: []
summary: "Or, what we still have to  learn from Smalltalk"
date: 2025-05-15
slides: /assets/presentations/oop-in-elixir.pdf
---
> I thought of objects being like biological cells and/or individual computers on a network, only able to communicate with messages.

> Alan Kay

This is a talk I gave a [GigCity Elixir](#gigcity) in May 2025. Unfortunately, a video was never published. But here are the slides.

Most OOP talks and papers focus on OOP as a software implementation architecture. They discuss single vs multiple inheritance and other esoteric “OOP” programming paradigms.

I feel this ignores what really made the original OOP language, Smalltalk, so powerful and productive. It was the tools created in Smalltalk for Smalltalk. 

This talk was a call to action, to the Elixir community, to think like Smalltalk when it comes to our tooling. For example, why is the developer still responsible for the file system? Elixir has a convention that the folder and file naming reflect the module name. Why not let our IDE handle this when we create a new module? Better yet, why does the developer deal with files at all when what we really care about is functions? 

The talk included a live hands on demo of how Smalltalk’s IDE helped the developer organize and focus on their code from a higher level of abstraction than a folder+file. Without having to replace the actual folders and files storing the content.


## Links
- [Pharo Smalltalk](https://www.pharo.org), they have a single click download and run app. You can try out the Smalltalk IDE yourself in under  minutes! Highly recommended if you truly want to start to understand the source of the revolution that never really happened. Yet.
- [Alan Kay](https://www.quora.com/Is-there-a-programming-language-thats-effectively-a-successor-to-Smalltalk/answer/ix_/Alan-Kay-11)
- [Joe Armstrong](https://en.wikipedia.org/wiki/Joe_Armstrong_(programmer))
- [The Murderbot Diaries](https://marthawells.com/murderbot.htm) by Martha Wells
- [Thnking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking%2C_Fast_and_Slow) by Daniel Kahneman

—

[#GigCity](#gigcity)

By the way, if you go to Elixir conferences and have never been to [GigCity Elixir](https://www.gigcityelixir.com), you’re in luck, after taking a year off in 2026, Bruce and Maggie are again hosting GigCity for 2027. But who knows about 2028.

What makes GigCity special is its hospitality and size. It is a smaller, more personal, conference, where you can actually get to know everyone. Sometimes, smaller is better. And you can’t beat the hospitality of Bruce and Maggie Tate! According to [Lars Wikman](https://underjord.io/blog.html), it was also the inspiration for [Goatmire](https://goatmire.com). Another small intimate Elixir conference, held in the welcoming city (town?) of Varberg, Sweden.