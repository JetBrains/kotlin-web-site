---
id: "case-study-mirego"
slug: "mirego"
title: "Mirego"
country: "Québec City and Montréal, Canada"
size: "125"
usedProductTitle: "Kotlin\u00A0Multiplatform"
usedProductLink: "/multiplatform/"
industry: "Software development"
coverImg: /images/case-studies/content/mirego-cover.png
---


<div class="rs-subtitle-2">
<a href="https://www.mirego.com/" target="_blank" rel="noopener noreferrer">Mirego&nbsp;↗</a> is an end-to-end digital product team. They work with major brand names as well as startups to envision, define, design and develop new digital products and services that fuel their growth.
</div>

### Could you say a few words about your company?

Mirego was founded in 2007 by managers and developers from Copernic with a simple objective: to build the greatest team, the best workplace and a better world. For the past 12 years, our team has focused on one single thing: creating game-changing digital products that fuel our clients' digital transformation. Keeping that focus, we've built a unique expertise in what we believe truly matters when it comes to creating successful products: product strategy, design and engineering.

### Are there any statistics you'd like to share, for example, numbers of users and downloads?

- ~ 20 Kotlin Multiplatform developers
- 8 Open sourced Kotlin Multiplatform libraries at the time of writing
- 7 active Kotlin Multiplatform projects for clients

### How is Kotlin Multiplatform used in your product (maybe with respect to its architecture scheme)?

The Mirego team developed multiple higher-level libraries to accelerate multiplatform development. We named this ecosystem Trikot. They are now open sourced and can be found on <a href="https://github.com/mirego" target="_blank" rel="noopener noreferrer">Github</a>.

When using Trikot, the shared code is imported by the native code. In a sense, it is the native code that forms the application's outer shell. It then imports Trikot as its inner layer to create an interface between the platform and the shared code at its core. All of the common logic shared by every platform is contained within that core. Trikot handles all the data flows between the native and shared code. This explains why the first module we've developed within Trikot is an implementation of Reactive Streams for Kotlin Multiplatform. The native platform expert can then create a platform optimized UI, encryption module, Bluetooth interface, or background task scheduler using the native language and SDK and connect it to the business logic in the application's core.

### Why did your team decide to use Kotlin Multiplatform, and what alternatives did you consider?

Over the past six years, we've become experts at sharing code between web, mobile, and TV platforms, while never losing our focus on native user experience. Scratch, a library we have developed in-house, leveraged the Java to Objective-C transpiler made by Google (j2objc) and the Java to Javascript transpiler (j2js) made by Mirego. It rapidly became a reactive programming framework for mobile and web applications.

In 2018, we started re-evaluating our options for multiplatform development. The emerging solutions at the time were React Native and Flutter. We ended up rejecting them for reasons of performance, maturity, or because they didn't allow our team to tailor applications to each platform. Most of the solutions also required adding a new programming language to the mix, adding a new programming environment, and thus a level of complexity when interacting directly with the platform.

The multiplatform approach of Kotlin Multiplatform met our requirements by simplifying the sharing of business logic while empowering the benefits of each platform. Kotlin's being the main development language for Android, the rapidly growing community, and the great interoperability between Swift and Javascript was the main reason we decided to make the switch.

In September 2019, we released <a href="https://www.tv5unis.ca/" target="_blank" rel="noopener noreferrer">TV5Unis</a>, our first public Kotlin Multiplatform project. The same business logic runs on the web, iOS (iPhone and iPad), tvOS, Android (Device & TV), and Amazon Fire TV. From what we heard from the Kotlin community managers, it was the first TV project to be deployed on the stores.

Since then, Kotlin Multiplatform has been the go-to framework for mobile development at Mirego. By the time of writing, we have released a total of 4 successful and still maintained projects built with Kotlin Multiplatform.

### What have been your most significant gains and pains?

**Gains**

- Quality of interoperability between shared code and platforms
- Strong supportive community
- Handover to other teams
- Speed of development
- Few languages to learn for multiplatform development (in our case, Kotlin, JavaScript, and Swift)

**Pains**

- Native strict immutability between threads
- Coroutines are not production-ready for native development
- Libraries incompatible between minor versions of Kotlin Multiplatform

### Do you have any tips or advice you'd like to share with our readers?

- Use Kotlin Multiplatform as a functional language; it solves most of the native Native strict immutability between threads.
- Join the Kotlin slack – you'll find most of the support you need there.

<div class="rs-subtitle-2">
> The multiplatform approach of Kotlin Multiplatform met our requirements by simplifying the sharing of business logic while empowering the benefits of each platform. Kotlin's being the main development language for Android, the rapidly growing community, and the great interoperability between Swift and Javascript was the main reason we decided to make the switch.
>
> <small>Martin Gagnon, Co-Founder & Engineering Lead, Mirego</small>
</div>

## Contact

**Email:** <a href="mailto:mgagnon@mirego.com" class="wt-link">mgagnon@mirego.com</a>

**Kotlin slack:** Martin Gagnon
