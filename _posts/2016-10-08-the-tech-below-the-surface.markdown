---
title: The tech below the surface
tags: ios design
excerpt: An iOS implementation of a touch interactive Lindenmayer system fractal generator. The only iOS L-System generator which lets the user drag and drop graphic rule tiles to create new interesting fractals. Combines highly optimized C code, image filters and motion sensing and custom view transitions.
summary: An iOS implementation of a touch interactive Lindenmayer system fractal generator. The only iOS L-System generator which lets the user drag and drop graphic rule tiles to create new interesting fractals. Combines highly optimized C code, image filters and motion sensing and custom view transitions.
gallery:
  - url: /assets/images/blog/fractal_sample_before_filter.png
    image_path: /assets/images/blog/fractal_sample_before_filter.png
    alt: "before filter"
  - url: /assets/images/blog/fractal_sample_after_filter.png
    image_path: /assets/images/blog/fractal_sample_after_filter.png
    alt: "after filter"
---

![FractalScapes logo](/assets/images/fractalscapes-mini-logo.png){: .align-left}
FractalScapes is an iOS implementation of an touch interactive Lindenmayer system fractal generator. The only iOS L-System generator which lets the user drag and drop graphic rule tiles to create new interesting fractals. It's implementation combines highly optimized C code, core image filters, core motion sensing and custom segue transitions. This blog posting is a way too long list of most of the core technologies used to create FractalScapes.

# The Tech That Lies Below The Surface
 

>FractalScapes makes use of just about every tool in the Apple iOS box. 

## NSOperation Multi-threading

The heart of FractalScapes is a self contained thread safe L-System fractal rendering engine which takes the fractal rules as input and returns a fractal image of the desired size, type and constraints. As the user changes fractal settings interactively, the UI uses a concurrent NSOperation queue for the rendering operations.

 The rendering is performed in 2 separate and independent stages. 1) The rules transformation, which based on benchmarking, is the most compute intensive and cached for reuse. 2) The CoreGraphics path generation. Depending on which type of property the user is changing the renderer can bypass the first stage resulting in much faster rendering. For example, changing the line width only requires re-rendering the CGPaths resulting in a very responsive fractal experience when using touch gestures to change line widths, lengths, angles and more.

To further increase the responsiveness 1) the queued rendering operations during a drag are of reduced resolution and 2) if the queued operations are taking too long, the system will tell the renderer "stop and give me what you have already." A lower resolution partially rendered fractal image will be returned allowing the user to see the effect of their change immediately even if somewhat incomplete. As the user's drag slows down and gives the system more time to render, more complete renderings are returned. Once the user stops dragging and the rendering queue empties, a final high resolution fractal is rendered and returned.

Thanks to the self contained nature of the rendering engine, it is easy to use on a background thread anywhere a rendered fractal is needed. Such as the library thumbnails or the shared PDF and PNG Images. In an older version, there were even HUD views (Heads Up Display) which would show the various fractal generation stages. Each HUD was rendered concurrently with separate generation counts.

## UIStackView (before Apple's)

![Stack Views](/assets/images/blog/MDObjectListTilesViewerSmall.png){: .align-left}
At first, FractalScapes used UICollectionViews for all of the tile palettes. Unfortunately it did not work out for my use case. I wanted each set of rules to fully show the current rules. This meant the view should expand and contract as rules were added and removed. No Scrolling! UICollectionView is a subclass of UIScrollView so out of the box, it had a feature which was counter to the use. I discovered, thanks to Apple's awesome implementation UILayoutContraints, it was trivial to write a custom view class which behaved like a collection view but without the baggage of caching, UIScrollView and all the other performance enhancing features which were unnecessary for what were essentially a short list of static tiles. Imagine my pleasant surprise when Apple introduced UIStackView. Hey! I did that 2 years ago! Only I called it MDObjectListTilesViewer.

_

## UIDynamics & UIAnimation

No iOS application would complete without some nice animations. FractalScapes core animation is of course the users fractal. But that isn't enough is it? Each MDObjectListTilesViewer has a UIDynamic & Animation which allows it to be slid to the left or right to expose and "Add" or "Delete" action. 

There is a timer delayed dispatch action to change the alpha of the status indicator background in the top right of the canvas. Once there has been no user interaction for a set time, the background of the status indicator is faded out of view to give a cleaner view of the users fractal. Once the user re-commences editing, the background is faded back in to increase contrast for the labels.

If the user has enable iCloud for FractalScapes, each library entry has a little cloud icon to show the iCloud state of the fractal. As the fractal is being downloaded from the cloud, the icon is red and slowly fills with blue from the top down to show the progress of the download. Once downloaded, the icon fill is transparent so it gets out of the way. Uploads/syncs turn the icon blue and it slowly goes clear from the bottom up. 

The fractal drawing canvas uses CoreMotion to add a parallax effect. As the user moves their device around, just like on the iPhone home screen, the fractal canvas moves as if it has depth under the screen. The tool bar also has parallax but at a slightly higher elevation to add to the depth effect. This can all be disabled in the settings.

## Custom Transitions

![UIView Transitions](/assets/images/blog/ui-transitions-example.gif){: .align-left}
I implemented custom transitions from the library to the fractal editor and for the reverse transition. When the user selects a fractal in their library, I start the editor view at the size and position of the selected fractal thumbnail in the library. This view is then expanded to fill the screen. The tool bar is then exposed from the screen edge and stopped with a bounce animation. 

When the user transitions back to the library, the editor tool bar is retracted back off the screen. The editor view is then replaced with fractal thumbnail fullscreen which is then scaled and translated to fit into the library thumbnail position for the edited fractal. 

## ReplayKit

![UIView Transitions](/assets/images/blog/replay-kit-example.gif){: .align-left}
Part of the fun in creating a fractal is trying to figure out how it grows. I added the ability for the rendering engine to walk the tree of rendering operations from 0% to 100%. I then added timer dispatched rendering operations from 0% to 100% and now you have a great fractal Playback feature. The rendering percent is also tied to a slider control so the user has interactive control of the rendering percent allowing them to scrub up and down around a particularly interesting fractal rendering point. 

Integrating ReplayKit allows the user to share their fractal playback as a video. They can easily show the fractal growth of a tree or fern. In the future, it would be nice to allow the user to also show videos of changing other fractal features such as angles.



## UIDocument CoreData & iCloud

Initially, the fractals were all stored in a single CoreData database. This caused many usability issues before I finally realized the fractals were really just documents and needed to be treated as such. Changing to UIDocument with NSFilewrapper storage of the fractal definition and thumbnail made much more sense, was easier to implement, was much more robust and was a surprisingly easy transition from CoreData. I no longer had CoreData context and query code polluting the object manipulation code. This also made the multi-threading much easier.

Again if the user has iCloud enabled for FractalScapes, all of the fractals will be stored in their iCloud account and seamlessly synchronized between all their iOS devices. The user can create and edit a fractal on their iPad then later show friends the same fractal on the iPhone and make minor edits. They could make major edits but due to screen size, it is much easier to edit fractals on an iPad.

Thanks to using UIDocument, it will be easy to share fractal definitions with other platforms such as the Mac.

## CloudKit

FractalScapes uses public container in it's CloudKit account to enable users to share fractals. Anyone with iCloud enabled can share their fractal to the public CloudKit store. FractalScapes has a Fractals CloudKit browser to enable users to find interesting fractals, download the fractal and start editing it. 

In the future, I would like to add user ratings, rankings and sorting to the CloudKit implementation. Maybe even user comments.

## CoreGraphics Playground

> At it's heart, FractalScapes is an interactive CoreGraphics playground.

Just about every CoreGraphics operation is represented by a rule tile. The tiles can be combined in any order and can call other tiles. 

### Some examples:

 ![draw line rule](/assets/images/blog/kBIconRuleDrawLine.png) draws a line by calling CGPathAddLineToPoint. The frame of reference is moved using CGPointApplyAffineTransform so that the next line can start at "zero".

 ![rotate rule](/assets/images/blog/rotate-cc-rule.png) uses CGAffineTransformRotate to rotate the frame of reference so the next line is still just going from zero to a point on the X axis line length away. Every line is from 0,0 to X,0 and all the turns and movements are made with CGAffineTransform.

 ![rotate rule](/assets/images/blog/circle-rule.png) draws an unfilled circle using CGPathAddEllipseInRect. 

All of the drawing commands are used to generate CGPath segments which are cached for later reuse. FractalScapes includes a drawing segment Stack. The user can push all of the current settings onto the stack, change the line width, colors or other properties, draw using the new properties then pop the original position and properties off the stack to resume the original drawing. This is one of the key implementation details allowing for such cool fractals. In order to be thread safe and performant, the segments and drawing properties are stored in immutable C structs. The array pointer structure referencing the structs are pre-allocated with accessors which perform bounds checks. There are even C inline utility functions for the most heavily used code again based on benchmarking performance.

## Core Image Filters aka CIFilter

Even with the interactive drag and drop, creating one's own fractal is difficult. Trying to think recursively is not natural for most people. On the other hand, anyone can tap a filter icon and transform a plain looking drawing into something much more interesting.

Implementing CIFilters was fairly straight forward thanks to Apple's key value interface. It is possible to query each device for their available filters and then display all the possible filters to the user sorted by category. As Apple adds new filters, they will automatically be available in FractalScapes without any new code or releases. 

{% include gallery caption="Before and after filter application" %}

CIFilters also include a feature where filter definitions can be chained before execution. This allows my standard drag and drop tile interface to work with filters. The user can drag consecutive filters into the tile holder and they will be applied to the fractal image in the same order. They can live re-order the filters to find the best combination. All of this functionality just slides right into the rendering engine, MDObjectListTilesViewer. The filters are just more objects being arranged by the user in a MDObjectListTilesViewer.

## In App Purchase IAP

![UIView Transitions](/assets/images/blog/FractalScapesIAPStoreMini.png){: .align-left}
I have experimented with In App Purchases to help pay for all the effort put into FractalScapes. The app uses a custom IAP receipt management module with obfuscated code as recommended by Apple. As implemented, I added in app purchases for extra colors and features. FractalScapes was written to help people experiment with fractals. Charging for the in app purchases just seemed to present a barrier to use. However I did learn much about implementing IAP and the feature is still in the app. There is even a little store in the app. The purchases are just free for now.

_
## PaintCode
All of the assets were created using PaintCode. It can not be stressed enough how much easier it was to develop the assets with PaintCode vs any other tool out there and I have used them all.

All of the assets are in a single PaintCode document. Changing the over color palette for the asset tints was trivial thanks to the Object Oriented nature of PaintCode's approach to drawing assets. Asset colors are "by reference" rather than "by value". This means when a color is used to draw a shape, that shape keeps a reference to that particular color object. Changing the color of the color object changes the color of every shape which uses it. Similar to the same way system tints work in iOS. Most drawing packages copy the value of the color for each shape meaning one would need to manually change the color of every shape if you decide to make a minor change to the apps color palette! PaintCode's symbols, stretchable canvases, StyleKits and a powerful export feature all work to make the developers life easier.

## The Future - SceneKit?

I am investigating adding a 3D rendering engine! The fractal rendering engine and rules really only have 2 primitives. A line and a circle. Maybe 3 if you include being able to curve the line and line segments. It should be fairly straightforward to replace the line and circle with 3D SceneKit models. Then instead of iterating through the rules to create the rules structure and iterating through it to execute CG commands. I could turn the rules directly into a SceneKit node structure. The user would then be manipulating a rules generated 3D tree in real time!

## Summary
Wow that was a lot and if you made it this far, I am stunned. I but be honest, you just skimmed right to the end right?

I am incredibly happy with the way FractalScapes has turned out and amazed at how many of Apple's core technologies were used to make FractalScapes into the app it has become. I realize the UX still needs a lot more work. It is too difficult for the user to create a fractal with intent. It is easy to create a random fractal. Difficult to explicitly create what you have in your mind. I am investigating ways to make it easier to create a fractal. Unfortunately, so far all the ideas would only work on an iPad. What I have now works on every device size. The exploration and learning continues.

Thanks