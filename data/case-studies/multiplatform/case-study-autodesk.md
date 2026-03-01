---
id: "case-study-autodesk"
slug: "autodesk"
title: "Autodesk"
country: "United States, Israel, Global"
size: "9000+"
usedProductTitle: "Kotlin\u00A0Multiplatform"
usedProductLink: "/multiplatform/"
industry: "Software Development, Mobile Development"
coverImg: /images/case-studies/content/autodesk-cover.png
---


<div class="rs-subtitle-2">
At <a href="https://www.autodesk.com/" target="_blank" rel="noopener noreferrer">Autodesk ↗</a>, we exist to turn ideas into new realities that shape a thriving future. Our software and services harness emerging technologies — such as additive manufacturing (3D printing), artificial intelligence, generative design, and robotics — that give companies and individuals the power to work more quickly, effectively, and sustainably throughout the entire project lifecycle.
</div>

### Could you say a few words about your company?

PlanGrid by Autodesk is a construction productivity app that allows people to collaborate on construction projects. My team at Autodesk is based in San Francisco and Tel Aviv, but it is a global company with offices in many countries.

### Are there any statistics you'd like to share, for example, numbers of users and downloads?

PlanGrid (the app I work on where we use Multiplatform) is used on over 1.8 million construction projects in more than 100 countries around the world.

### How is Kotlin Multiplatform used in your product (maybe with respect to its architecture scheme)?

We use Kotlin Multiplatform to ship a single source of truth for offline sync logic and data models on our 3 mobile platforms: iOS, Android, and Windows.

### Why did your team decide to use Kotlin Multiplatform, and what alternatives did you consider?

Kotlin is a modern language that a large portion of our team already works with, which meant we wouldn't need to necessarily throw code away if Multiplatform didn't work out for us. It's native to Android (so no JNI), and it worked well for iOS out of the box. That is a rare combination for a language that can work without the JVM. Often, cross-platform solutions require a lot of work with the JNI.

## What have been your most significant gains and pains?

### Benefits

An engineer can build out a new feature and test it on one platform, and then other platforms can just hook up the data models and business logic to the UI on their platform and reuse most of the groundwork. Now that we're working in a shared codebase, we collaborate more across platforms.

### Pains

Maintaining development workflows across multiple platforms can be challenging. Kotlin/Native is newer technology, so that part has been a bit bumpier. Our Windows team has had to spend a lot more time on interop compared to iOS and Android, for example. There were also some hiccups with crash logging early on. In general, the toolchain isn't as polished as Android's, but it gets better with each release.

### Do you have any life hacks or advice you'd like to share?

The best advice I can give about getting into multiplatform is to read through some of the docs on <a href="http://gradle.org/" class="wt-link" target="_blank" rel="noopener noreferrer">gradle.org</a> about authoring tasks to familiarize yourself with how gradle and gradle tasks work. A good understanding of what gradle is doing has helped us a lot along the way.

> With Kotlin Multiplatform an engineer can build out a new feature and test it on one platform, and then other platforms can just hook up the data models and business logic to the UI on their platform and reuse most of the groundwork. Now that we're working in a shared codebase, we collaborate more across platforms.
>
> **Ben Asher, iOS Developer, Autodesk**
