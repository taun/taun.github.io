---
title: "NMR Pulse Programmer Interface"
header:
  image: /assets/images/nmr_fullsize_banner.png
  teaser: /assets/images/nmr_mini.png
gallery:
  - url: /assets/images/nmr_fullsize.png
    image_path: /assets/images/nmr_fullsize.png
    alt: "NMR Schematic"
---

## Still a High-water

Around 1991, in approximately 4 months, designed and implemented a DOS based GUI interface for controlling the inputs to a nuclear magnetic resonance machine then gathering presenting and storing the results in real time.

This work was performed for [Myer Bloom](https://en.wikipedia.org/wiki/Myer_Bloom) at the [Physics department of the University of British Columbia](http://www.phas.ubc.ca/~michal/index.html) to improve the materials research using nuclear magnetic resonance (NMR).

It involved developing custom software to integrate:

- A PC running DOS
- A custom NMR Pulse Program hardware box
- An NMR machine
- A high speed, high accuracy, low jitter, 12bit, 2 channel analog to digital signal converter
 
Taun designed all of the software including 

- Real time OS principles for meeting data control and acquisition requirements.
- a custom C++ GUI framework to be used in implementing the application UI.
the UI for displaying real time data acquisition in a format similar to a digital oscilloscope.
- a custom scripting and macro capability for programming the complete system.
- ability for future software expansion using dynamically linked libraries with a defined interface for adding commands and functionality in the future without any need for recompiling.
- remote network access for checking the status of an experiment from home.
- a built-in terminal style interactive view for sending commands to the pulse programmer and A/D converter. 

The physics department was very satisfied with the system. The software was robust and no major changes or fixes were ever needed. It was used by scientists and future scientists for over a decade.

{% include gallery caption="Nuclear Magnetic Resonance" %}
