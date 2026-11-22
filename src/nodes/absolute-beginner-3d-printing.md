---
title: "Absolute beginner 3D Printing "
type: review
tags: []
links: []
draft: true
summary: "I bought a Phrozen 3D Armco FDM printer"
date: 2026-11-22
header:
  image: /assets/images/absolute-beginner-3d-printing-header.png
  teaser: /assets/images/absolute-beginner-3d-printing-teaser.png
---

I recently bought an [Arco 3D printer](https://phrozen3d.com/en/products/arco-fdm-printer) by Phrozen 3D. It was on sale for $200! How could I resist. Obviously I couldn’t.

Despite my job being in tech and my background being as a mechanical design engineer with 10 years of 3D CAD experience, this is only my 2nd 3D printer in at least 10 years. The first printer was given to my kids by my father, cost him about $300, and was a total disaster. After months of effort, we finally got 1 good print out of it. This was after sticking the whole thing in a cardboard box with a hair dryer to help it work.

After 10 years, I figured I had finally recovered enough from that trauma to break down and buy another one. After 10 years, they have to have solved all this problems right? Like some many people have one. They wouldn’t all have 3D printers if they weren’t easy to use and reliable. right?

This page will be a living journal to answer that question. Or at least highlight my learnings as I start from ground zero with a new printer.

—-

### 2026-11-05

The printer arrives. It has a big label saying moving it is a 2 person job yet somehow, I manage to get it into the basement by myself. And without hurting myself. It was heavy and awkward but I was determined and impatient.

### 2026-11-06

I open the box and realize, this is more like the platesetters I used to design on the ‘90s than I expected. Lots of assembly required. Followed by alignment, testing, and updates.

The mechanical assembly all went fairly smoothly right up until the end when the instructions explained how to install the spool cover… Spool cover … There’s should be a spool cover somewhere. This is where I should post a picture of the multiple very large piles of boxes and packing materials which I searched numerous times to find the spool cover. Without success.

Well, let’s forget about the spool cover for a bit and try the firmware upgrade instead. It was on 177 and needed to be upgraded to 1.9.9. And the upgrade had to go through about 5 separate updates step to get to the latest 199. The instructions say to definitely not just go straight to 199.

#### Firmware upgrade failure

What fun would it be if the firmware upgrade worked the first time, or the 2nd, or even the 10th? For context, I work with Macs or Linux. That has been my platform of choice for the last 20 years. And the [upgrade instructions](https://helpcenter.phrozen3d.com/hc/en-us/articles/51204066421401--Arco-Firmware-Update-Guide) are pretty simple. 
- download the firmware
- unzip the zip
- copy the `phrozen_dev` file to an empty USB drive.
- insert the USB drive into the front USB port of the printer. 
- update!

And it worked for “1 of 6” updates. Then froze on “2 of 6”. Forever. So I power cycled and tried again. This time there was a white screen with an error. 

> Model does not match TJC2048N250_011C

Time to reach out to tech support

### 2026-11-15

Tech support suggests it is the LCD display which has a corrupted driver and needs to be updated.

That update went fine.

The next firmware update resulted in the same problem again.

Tech support sent the complete eMMC firmware image. I buy a [Makerspace adapter](https://www.amazon.com/clp/B0D1MY7943), open the base of the printer, remove the eMMC board, flash it (about 3 times till success) using the Mac and [BalenaEtcher](https://www.balena.io/etcher), replace the cover, power, … but we finally got it working… now back on firmware 163.

### 2026-11-16

> Do you have access to a Windows machine …?

Do I? I don’t use Windows. I got rid of all my Windows machines years ago. 

It took me at least a day or two to realize I had a headless mini Windows machine sitting on my work bench for about 2 years. I use it as a test BACnet server for work. 

Once I used the Windows machine to extract and copy the firmware onto a USB drive, all was good with the world. Sort of. Yes the updates worked and went smoothly “1 of 3”, “2 of 3”, “3 of 3” (notice not 6). 

But for some $%^&* reason, the machine went through the whole we have new firmware **every single step to 199**. Which means, naming the machine, calibrating the head position, auto-leveling of the plate. A pointlessly long process if one is just trying to get to the next update.

### 2026-11-17

We now have a fully updated ready to print printer. Except, what about that missing spool cover? This is when I finally realize (or reread the manuals) that the spool cover needs to be printed. By the printer. I now know what my first print job will be.

### 2026-11-18

We have a spool cover. The first print was a success! 

What to print next?

### 2026-11-19

I decide on a [fruit fly catcher](https://makerworld.com/en/models/2711760-decorative-fruit-fly-trap). 

I installed the [ChromaKit](https://phrozen3d.com/en/products/chroma-kit-multicolor-printing-system) so I can do multi-color. This will also be my first opportunity to use the Phrozen custom [Orca Slicer](https://phrozen3d.com/en/pages/software) software. It’s by Phrozen so it should “just work out of the Box.”

#### Orca Slicer

Hmmm, 
- how do I do multi-color?
- what bed type is it? Is the default correct?
- what nozzle size is it? Is the default correct?
- what kind of support should I use?


