---
title: iOS AppDelegate Timeline
tags: ios cocoa
excerpt: A visual diagram of app delegate callback sequence for iOS applications.
summary: A visual diagram of  app delegate callback sequence for iOS applications.
gallery:
  - url: /assets/images/blog/ios-appdelegate-timeline.png
    image_path: /assets/images/blog/ios-appdelegate-timeline.png
    alt: "App Delegate Timeline"
  - url: /assets/presentations/iOS AppDelegate Timeline.pdf
    image_path: /assets/presentations/iOS AppDelegate Timeline.pdf
    alt: "App Delegate Timeline"

---

The Apple documentation is mostly in text. For those like myself who learn best from visual diagrams rather than words, here is the holy grail of iOS application delegate call sequencing. Or what happens in what order starting from the time your iOS application starts up and ending when your view is ready for user interaction.

For example, if a custom *UIViewController* object needs to interact with a controlled view's parameters, should it do it during:

- initWithCoder:
- loadView
- viewDidLoad
- or viewWillAppear?

The [Apple *UIViewController* documentation](http://developer.apple.com/library/ios/#featuredarticles/ViewControllerPGforiPhoneOS/BasicViewControllers/BasicViewControllers.html) offers the following advice for *awakeFromNib*.

> To finish instantiating it (the ViewController), you override its (the ViewControllers) *awakeFromNib* method.

And the [UIKit documentation for *awakeFromNib*](developer.apple.com/library/ios/#documentation/UIKit/Reference/NSObject_UIKitAdditions/Introduction/Introduction.html) states:

> The nib-loading infrastructure sends an *awakeFromNib* message to each object recreated from a nib archive, but only after all the objects in the archive have been loaded and initialized. When an object receives an *awakeFromNib* message, it is guaranteed to have all its outlet and action connections already established.

However, we can see from the chart that in the case of a *UIViewController*, views are **not** loaded by the time *awakeFromNib* is called on a *UIViewController*. They are not fully loaded until the appropriately named *viewDidLoad* callback.

In addition, while the ViewControllers views are fully loaded when viewDidLoad is called, they are not laid out so you still would not want to use parameters which are dependent on the views layout size. During viewDidLoad, you might set parameters which would effect the view layout but you would wait until viewWillAppear to get and use any final view size parameters.

I believe my [chart](/assets/images/blog/ios-appdelegate-timeline.png) makes this clear at a glance whereas the standard text documentation would not.

Here is a PDF of the Application Delegate Callbacks Timing Chart.

[iOS App Delegate Timeline](/assets/presentations/iOS AppDelegate Timeline.pdf)

{% include gallery caption="iOS App Delegate Timeline png & pdf" %}
