[//]: # (title: Introduce your team to KMM)
[//]: # (auxiliary-id: Introduce_your_team_to_KMM)

These recommendations will help you introduce your team to KMM:

* [Start with empathy](#start-with-empathy)
* [Explain how KMM works](#explain-how-it-works)
* [Show the value of KMM using case studies](#show-the-value)
* [Offer a proof by creating a KMM project yourself](#offer-proof)
* [Prepare for questions from your team](#prepare-for-questions)
* [Support your team during KMM adaptation](#be-supportive)

## Start with empathy

Software development is a team game, with each critical decision needing the approval of all team members. Integrating any cross-platform technology will significantly affect the development process for your mobile application. So before you start integrating Kotlin Multiplatform Mobile in your project, you’ll need to introduce your team to the technology and guide them gently to see it's worth adopting.

Understanding the people who work on your project is the first step to successful integration. Your boss is responsible for delivering features with the best quality in the shortest time possible. To them, any new technology is a risk. Your colleagues have a different perspective, as well. They have experience building apps with the “native” technology stack. They know how to write the UI and business logic, work with dependencies, test, and debug code in the IDE, and they are already familiar with the language. Switching to a different ecosystem is very uncomfortable, as it always means leaving your comfort zone.

Given all that, be ready to face lots of biases and answer a lot of questions when advocating for the move to KMM. As you do, never lose sight of what your team needs. Some of the advice below might be useful for preparing your KMM pitch.

## Explain how it works

At this stage, you need to get rid of any preexisting bad feelings about cross-platform applications and show that using KMM in your project is not only possible but also won't bring regular cross-platform problems. You should explain why there won't be any problems, such as:

*   _Limitations of using all iOS and Android features_ – Whenever a task cannot be solved in the shared code or whenever you want to use specific native features, you can use the expect/actual pattern to seamlessly write platform-specific code.
*   _Performance issues_ – Shared code written in Kotlin is compiled to different output formats for different targets: to Java bytecode for Android and to native binaries for iOS. Thus, there is no additional runtime overhead when it comes to executing this code on platforms, and the performance is comparable to native apps.
*   _Legacy code problems_ – No matter how large your project is, your existing code will not prevent you from integrating KMM. You can start writing cross-platform code at any moment and connect it to your iOS and Android Apps as a regular dependency, or you can use the code you’ve already written and simply modify it to be compatible with iOS.

Being able to explain _how_ KMM works is important, as nobody likes when a discussion of technology seems to rely on magic. People might think the worst if anything is unclear to them, so be careful not to make the mistake of thinking something is too obvious to warrant explanation. Instead try to explain all the basic concepts before moving on to the next stage. This document on [multiplatform programming](multiplatform.md) could help you systemize your knowledge to prepare for this experience.

## Show the value

Understanding how the technology works is necessary, but not enough. Your team needs to see the gains of using it, and the way you present these gains should be related to your product. Kotlin Multiplatform Mobile allows you to use a single codebase for the business logic of iOS and Android apps. So if you develop a very thin client and the majority of the code is UI logic, then the main power of Kotlin Multiplatform Mobile will be unused in your project. However, if your application has complex business logic, for example if you have features like networking, data storage, payments, complex computations, or data synchronization, then this logic could easily be written and shared between iOS and Android so you can experience the real power of KMM.

At this stage, you need to explain the main gains of using KMM in your product. One of the ways to do this is to share stories of other companies who already benefit from KMM. The successful experience of these teams, especially ones with similar product objectives, could become a key factor in the final decision.

Citing case studies of different companies who already use KMM in production could significantly help you make a compelling argument:

*   **[Chalk.com](https://kotlinlang.org/lp/mobile/case-studies/chalk)** – The UI for each of the Chalk.com apps is native to the platform, but otherwise almost everything for their apps can be shared with Kotlin Multiplatform Mobile.
*   **[Cash App](https://kotlinconf.com/2019/talks/video/2019/116027/)** – A lot of the app’s business logic, including the ability to search through all transactions, is implemented with Kotlin Multiplatform Mobile.
*   **[Yandex.Disk](https://kotlinlang.org/lp/mobile/case-studies/yandex)** – They started out by experimenting with the integration of a small feature, and as the experiment was considered successful, they implemented their whole data synchronization logic in KMM.

Explore [the case studies page](https://kotlinlang.org/lp/mobile/case-studies) for inspirational references.

## Offer proof

The theory is good, but putting it into practice is ultimately most important. As one option to make your case more convincing, you can take the risky choice of devoting some of your personal free time to creating something with KMM and then bringing in the results for your team to discuss. Your prototype could be some sort of test project, which you would write from scratch and which would demonstrate features that are needed in your application. 
[Networking & data storage – hands-on tutorial](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) can guide you well on this process. 

The more relevant examples could be produced by experimenting with your current project. You could take one existing feature implemented in Kotlin and make it cross-platform, or you could even create a new Multiplatform Module in your existing project, take one non-priority feature from the bottom of the backlog, and implement it in the shared module. 
[Make your Android application work on iOS – tutorial](kmm-integrate-in-existing-app.md) provides a step-by-step guide based on a sample project.

The new [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile) will allow you to accomplish either of these tasks in the shortest amount of time by using the _New KMM Application_ or _New KMM Module_ wizards.

## Prepare for questions

No matter how detailed your pitch is, your team will have a lot of questions. Listen carefully, and try to answer them all patiently. You might expect the majority of the questions to come from the iOS part of the team, as they are the developers who aren’t used to seeing Kotlin in their everyday developer routine. This list of some of the most common questions could help you here:

**Q: I heard applications based on cross-platform technologies can be rejected from the AppStore. Is taking this risk worth it?**

A: The Apple Store has strict guidelines for application publishing. One of the limitations is that apps may not download, install, or execute code which introduces or changes features or functionality of the app ([App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)). This is relevant for some cross-platform technologies, but not for KMM. Shared Kotlin code compiles to native binaries with Kotlin/Native, bundles a regular iOS framework into your app, and doesn't provide the ability for dynamic code execution.

**Q: Multiplatform projects are built with Gradle, and Gradle has an extremely steep learning curve. Do I need to spend a lot of time now trying to configure my project?**

A: There’s actually no need. There are various ways to organize the work process around building KMM applications. First, only Android developers could be responsible for the builds, in which case the iOS team would only write code or even only consume the resulting artifact. You also can organize some workshops or practice pair programming while facing tasks that require working with Gradle, and this would increase your team’s Gradle skills. You can explore different ways of <!-- [organizing teamwork for multiplatform projects﻿](organize-process-around-kmm.md) --> and choose the one that’s most appropriate for your team.

Also, in basic scenarios, you simply need to configure your project at the start, and then you just add dependencies to it. The new AS plugin makes configuring your project much easier, so it can now be done in a few clicks.

When only the Android part of the team works with shared code, the iOS developers don’t even need to learn Kotlin. But when you are ready for your team to move to the next stage, where everyone contributes to the shared code, making the transition won’t take much time. The similarities between the syntax and functionality of Swift and Kotlin greatly reduce the work required to learn how to read and write shared Kotlin code. [Try it yourself!](https://play.kotlinlang.org/koans/overview)

**Q: I heard that KMM is experimental technology. Does that mean that we shouldn't use it for production?**

A: Experimental status means we and the whole Kotlin community are just trying out an idea, but if it doesn't work, it may be dropped anytime. However, after the release of Kotlin 1.4, **KMM is in Alpha** status. This means the Kotlin team is fully committed to working to improve and evolve this technology and will not suddenly drop it. However, before going Beta, there could be some migration issues yet. But even experimental status doesn’t prevent a feature from being used successfully in production, as long as you understand all the risks. Check [the Kotlin evolution page](kotlin-evolution.md) for information about the stability statuses of KMM components.

**Q: There are not enough multiplatform libraries to implement the business logic, it's much easier to find native alternatives.**

A: Of course, we can't compare the number of multiplatform libraries with React Native, for example. But it took five years for React Native to expand their ecosystem to its current size. Kotlin Multiplatform Mobile is still young, but the ecosystem has tremendous potential as there are already a lot of modern libraries written in Kotlin that can be easily ported to multiplatform. 

It’s also a great time to be an iOS developer in the KMM open-source community because the iOS experience is in demand and there are plenty of opportunities to gain recognition from iOS-specific contributions.

And the more your team digs into KMM, the more interesting and complex their questions will be. Don't worry if you don't have the answers – Kotlin Multiplatform has a large and [supportive community in the Kotlin Slack,](https://kotlinlang.slack.com/archives/C3PQML5NU) where a lot of developers who already use KMM can help you. We would be very thankful if you could [share with us](mailto:kmm.feedback@kotlinlang.org) the most popular questions asked by your team. This information will help us understand what topics need to be covered in the KMM documentation. 

## Be supportive

After you decide to use KMM, there will be an adaptation period as your team experiments with the technology. And your mission will not be over yet! By providing continuous support for your teammates, you will reduce the time it takes for your team to dive into the technology and achieve their first results.

Here are some tips on how you can support your team at this stage:

*   Collect the questions you were asked during the previous stage on the “_KMM: Frequently asked questions”_ wiki page and share it with your team.
*   Create a _#kmm-support_ slack channel and become the most active user there.
*   Organize an informal team building event with popcorn and pizza where you watch educational or inspirational videos about KMM. [“Shipping a Mobile Multiplatform Project on iOS & Android ” by Ben Asher & Alec Strong](https://www.youtube.com/watch?v=je8aqW48JiA) could be a good choice.

The reality is that you probably will not change people's hearts and minds in a day or even a week. But patience and attentiveness to the needs of your colleagues will undoubtedly bring results. 

The Kotlin Multiplatform Mobile team looks forward to hearing [your story of using KMM](mailto:kmm.feedback@kotlinlang.org).

_We'd like to thank the [Touchlab team](https://touchlab.co) for helping us write this article._
