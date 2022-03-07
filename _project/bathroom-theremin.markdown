---
title: "Bathroom Theremin!"
header:
  image: /assets/images/timer_555_banner.png
  teaser: /assets/images/door_handle_small.jpg
---

Probably my first ever fun successful electronics project as a kid.

What's a theremin you ask? Well, here's the [Wikipedia Theremin Entry](https://en.wikipedia.org/wiki/Theremin) entry. In short it is that sound all the old 50's and 60's SciFi shows used to indicate scary, alien things happening. And I watched lots of old SciFi movies on late night TV. What is now __Turner Classic Movies__. You know, the "woooWOwoAhhhAHHHAaWOOOooo" sound.

So way back then, the 555 timer IC (integrated circuit) was very cheap and popular. What couldn't you make with it? It was easy to get at Radio Shack and came with sample circuit diagrams for making cool stuff. 

Put together lots of SciFi movie watching, a 555 timer, and a little imagination, and you get ...

![bathroom door handle](/assets/images/door_handle.jpg){: .align-center}

**the bathroom door theremin!!** imagine, someone needs to visit the bathroom, they walk up to the door, reach out their hand towards the door knob and start to hear a quiet __woooWOwoAhhhAHHHAaWOOOooo__, as they get closer, it gets louder and more insistent, **woooWOwoAhhhAHHHAaWOOOooo**. They touch the knob and the sound goes crazy! That was my 12 year old dream come true.

How did it work? As shown in this [Instructable](https://www.instructables.com/Theremin-an-Electronic-Odyssey-Tinkercad/), the frequency from the 555 timer depends on the value of an RC circuit (Resistance & Capacitance). In the Instructable, they vary the resistance. In my bathroom theremin, I varied the capacitance. One half of the capacitor is the door knob. The other half is the user reaching out to touch the door knob. As the distance between the door knob and their hand varies, the frequency output by the speaker attached to the 555 circuit varies. Providing a spooky bathroom adventure.

[Play Spooky sounds](/assets/sounds/theremin-lead_100bpm_B_minor.mp3?controls=1)

[Instructable Instructions](https://www.instructables.com/Theremin-an-Electronic-Odyssey-Tinkercad/)

<style>
    .videoWrapper {
        position: relative;
        padding-bottom: 56.333%;
        height: 0;
        background: black;
    }
    .videoWrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    }    
</style>
    
{% include open-embed.js %}