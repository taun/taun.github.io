---
title: "Digital waveform synthesizer for music"
type: project
date: 1980-01-01
datePrecision: year
tags: []
links: []
galleryCaption: "Really old school!"
header:
  image: /assets/images/ensoniq_mirage-1024x324.png
  teaser: /assets/images/ensoniq.jpeg
gallery:
  - url: /assets/images/OSI_Challenger_4PMF.png
    image_path: /assets/images/OSI_Challenger_4PMF.png
    alt: "Ohio Scientific C4P"
  - url: /assets/images/Taun_with_c4p_westtown_close@2x.JPG
    image_path: /assets/images/Taun_with_c4p_westtown_close@2x.JPG
    alt: "Taun in Westtown dorm room around 1979"
  - url: /assets/images/wirewrap_sample.png
    image_path: /assets/images/wirewrap_sample.png
    alt: "Wirewrap Breadboard image"
---

## The backstory

I grew up surrounded by music. 

![Bagpipe](/assets/images/bagpipe-200.png){.align-right} It probably started in the back woods of of Nova Scotia one summer when I was around 8 years old. We would camp out on the shore of [Clam Bay](https://archives.novascotia.ca/communityalbums/EasternShore/archives/?ID=777) for the summer. Then travel around to all the scottish highland games such as the [Antigonish Highland Games](https://www.antigonishhighlandgames.ca). This involved listening to lots of fiddle and bagpipe music, watching mass band competitions, watching axe throwing, log rolling, caber tosses and much more. They were pretty magical summers. Living out of a tent on the shore of the Atlantic ocean. Living in a Sir Walter Scott novel during the day. Or for the more modern readers, an episode of Outlander.

![Yellow Door Coffee House logo](/assets/images/2020ydlogo.png){.align-left} This was followed by summers and winters in Montréal at the [Yellow Door Coffee House](https://www.yellowdoor.org/coffeehouse.html), the longest-running coffeehouse in Canada. My mom worked there which meant I spent my weekends and after school time there when not out playing. I was fortunate enough to be able to hang out in the artists green room listening to the musicians practice. Or perhaps hanging out behind the long oak food counter across from the stage. Listening to famous (at the time) musicicians such as Jesse Winchester, Kate McGarrigle, Willie P. Bennett and Stan Rogers, and Jerry Jeff (Mr. Bojangles) Walker. That long oak food counter was my first entrepreneurial experience. Audience members would walk up to the counter, which olny offered coffee or tea (go figure) and ask for soda. I saw an opportunity. I could run out the back door and get them soda from the corner store. For a fee...

Of course, being surrounded my music made me want to participate in some way. So I learned to read music and play the flute, recorder, harpsichord, a little piano, congas, coronet, clarinet, saxophone, you name it, I tried it. And I was even able to play a tune on some of them. 

Add in, my father had played the drums growing up, my [brother](http://www.troychapman.com/) played guitar and is now a professional guitar player, my great uncle had been a lyricist, and you have a lot of musical influence. So much so that I spent my late teens trying to figure out ways I could use cool new microporcessors and digital processing to enhance the capabilities of musicians and their instruments.

For example, guitar wammy bars were limited in range and would ruin the tuning of the guitar. What if I invented a digital signal processing circuit which could digitize the guitars analog signal from it's pickups, then frequency shift the signal and convert it back into analog? It would be a digital wammy bar!  

<section class="gallery" aria-label="History">
<figure><a href="/assets/images/g-troy-jeter-lyrics.jpeg"><img src="/assets/images/g-troy-jeter-lyrics.jpeg" alt="Ohio Scientific C4P" loading="lazy"></a></figure>
<p class="caption">History</p>
</section>



My highschool, Westtown Friends School, 


## Imagination + C4P Computer + bread boarded circuit equals ...

As a senior in [high school](http://www.westtown.edu/), conceived of, designed, and implemented a programmable hardware and software based digital waveform synthesizer to be used as a keyboard synthesizer. This was in the day of analog MOOGs and FM synthesis.

Designed and bread boarded a digital circuit which involved filling a couple of RAM buffers with the desired cyclic waveform and volume envelope. A programmable clock was then used to feed the values from the buffers to a D/A, filter, op-amp as pre-amp then output to a normal amplifier. The board was programmed using a custom programmed written for a 6502 CPU and using an I/O board on an Ohio Scientific C4P computer. The circuit designed was mentored by an Electrical engineer in Edmonton, Alberta Canada during a Westtown Senior Project.


Unfortunately, the project was never commercialized. However a year later, and a mile down the road from my [High School](http://www.westtown.edu/), [Ensoniq](https://en.wikipedia.org/wiki/Ensoniq) was started with exactly the same concept and similar parts but as far as I know, totally unrelated to what I had done. Something in the local water perhaps?
