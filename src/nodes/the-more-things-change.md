---
title: "The more things change"
type: post
tags: [AI, software, development]
links: []
summary: "The more the stay the same"
date: 2026-11-24
published: 2026-11-24
---

There’s an old French saying, [“_Plus ça change, plus c’est la même_”](https://en.wikipedia.org/wiki/Jean-Baptiste_Alphonse_Karr). This means the more things change, the more they stay the same. AI is a huge change, yet I keep finding that big-picture software development is still the same. Breadth of experience still counts if you want a quality output.

AI has a vast store of knowledge but doesn’t know everything. For example, I am developing a personal Apple platform app. It asks the user for their height. In a text field! But I only noticed because the AI was creating a parser for the height text and having issues. Now, without Apple HIG experience, you just let it keep going down that path. It’ll figure it out. 

But if you have Apple development experience, you would know Apple has published a [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) (HIG) document. If you read that document, or used some decent apps, you would realize the height should be a picker, not a text field. Actually, 2 pickers for imperial units. One for feet and one for inches. Then no parsing would be required. Note, I have seen plenty of apps make this same mistake without the help of AI. It’s not an AI problem.

There was a similar case earlier when it was laying out the Mac UI, and there were sizing issues. Plus, it just looked weird. I told the AI to reference the [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/). It easily redesigned the layout, and it was so much easier to use. It was like the UI went from being painful to being relaxing.

The height issue was after this. The AI now knew about the HIG but somehow was still going down the wrong path. Again, it needed my experience, persistence, and intolerance for bad design to tell it to “**always reference the HIG for all UI designs at the page level AND individual field level.**” Things have been going better since.

I have found, over and over again, that despite its seemingly limitless knowledge, it doesn’t know basic, relevant things like libraries that could make life easier, human interface guidelines, design style guidelines, color theory, and so much more. The AI is maybe at the level of a precocious junior developer. It still needs the guidance from someone with battle scars. Someone who knows there’s a better way out there and knows how to point to it. Just like a librarian.

_Plus ça change, plus c’est la même._