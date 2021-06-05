---
layout: post
title: "Do not render a PDF in a canvas"
author: Daniel Oltmanns
tags: bug, pdf
---

Mobile browsers are far from perfect. Browsing larger GitHub Source files, slow loading websites with one gig of images and js. They are just not done for it. However, there are things, that should just not be. Things, that kill the browser.

<!--abstract-->

<hr>

> I am a student in my second semester of computer science. I have a lot of stuff to learn, but this is something that "I don't enjoy". Just do not build it in the first place. Done.

A fellow student of mine, send me a lecture notes to a module to prepare for my exams. We have an own GitLab instance running for our university where every student is free to create and share their work. In this case, a user create a repo for a specific module to store the source files and final PDF of his lecture notes. So far, so good.

Got the link, opened up on my smartphone, waited for the PDF to load and ... crash. The browser closed, the homescreen restarted. Wait, what? Opened up the messenger, clicked the link again, waited for the PDF to load. Crash. My first thought was, my phone was just too bad. But I have a Samsung Galaxy S9, nothing low end, nothing ultra. But does the job in everything ... except this. So I started digging.

First off, GitLab (at least the version 13.1.3-ee, used by our university) renders the PDF file in a HTML canvas, each page, one canvas. First thought, maybe there are too many pages. No, there are just 90 pages in that PDF. But as I have exams coming up, I cannot dig deeper into the JavaScript Part of GitLab. So I did some other testing for now instead.

The default Browser I have on my phone is Chrome v83.0.4103.106 and additionally Firefox v68.10.1, running on Android 10 and One UI v2.1 (build number: QP1A.190711.020.G960FXXU9ETF5). So I know Chrome fails to render the PDF in 90 Canvas elements. So I checked Firefox, same thing happens. With this knowledge I asked in the computer science group of my university, for other people to verify this behavior and the android users could verify it. Apple users verified that it renders successfully in both Safari and Firefox on IOS. I wanted to record my screen in order to document this crash, but as lucky I am, the screen recorder app is killed straight away after the browser crashed. As I have no additional equipment to record, feel free to crash it yourself.

### how do we test

Well, as the GitLab instance of my university is public and repos can be shared publicly, I still do not want to get into any trouble. But, now problem, we have GitLab itself and a small demo side I built. Technical stuff: GitLab uses PDF.js from mozilla. My version is based on one of their examples, as I am not currently able to dive into GitLab source code. For a PDF I used the ethereum PDF file, twice, to have a PDF file that is large enough. It is a bit bigger than the original PDF file I had, but roughly the same number of pages (just 78 here).

During the development I tested in my desktop to see if the page displays everything correctly, and then continue testing on my mobile device. During this phase I crashed by laptop while it was rendering 78Pages of PDF in Firefox, running OpenSUSE with KDE. Note here, my Laptop is an XPS15 with an Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz with 6 cores. Due to my time limits, I need to continue my work in the future (1 month from now). Moreover, the GitLab Version does not crash at all on my laptop. So I personally would note this issue on the browser side.

## ATTENTION

THESE LINKS ARE LIKELY TO CRASH YOUR BROWSER, IF YOU ARE ON ANDROID. IF THERE IS ANY DAMAGE DONE BY OPENING THIS LINK, I HAVE WARNED YOU WITH THIS MESSAGE AND AM NOT ACCOUNTABLE FOR ANY DAMAGE. IF THE TAB LOADS, JUST CLOSE IT TO AVOID THE CRASH. I SUGGEST MY VERSION, AS YOU JUST NEED TO CLICK A BUTTON TO CRASH YOUR BROWSER.

[My Version](/pdf_test.html)

[GitLab Version](https://gitlab.com/oltdaniel/crash-pdf/-/blob/master/paper.pdf)

### conclusion

PDF files are like SVG files. You can zoom into each character without seeing any pixels. It's a great format. But as usual, there where people that need to render PDF files to a raw canvas. Nothing wrong with it, but e.g. to keep up the Quality GitLab renders each page in a 2381x3367 canvas (at least on my computer). It is required, because if you reduce the scale there is no damn way to read the pdf in this rendered format. But that is the reason, why there are so many PDF readers on so many platforms. That is the reason why desktop browser have built-in PDF readers, because in any other format you just kill system resources and/or do not get the same visual quality.

In the end, I am fascinated how quickly someone can crash a browser. And I mean, really crash a browser. Nobody, expects a mobile browser crashing just by rendering a PDF file. It could be fixed in this special case, by reducing the size of each canvas, or just render pager per page (as the key example of mozilla's PDF.js presents [here](https://mozilla.github.io/pdf.js/examples/)).

More to this scenario will follow in the future with further details and demos.