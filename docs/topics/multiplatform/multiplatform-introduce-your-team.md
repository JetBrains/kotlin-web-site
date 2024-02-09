[//]: # (title: How to introduce multiplatform mobile development to your team)

[//]: # (description:  Learn how to introduce multiplatform mobile app development to your team with these six recommendations for smooth and efficient adoption.)

Implementing new technologies and tools into an organization comes with challenges. How do you help your team adopt a [multiplatform approach to mobile app development](cross-platform-mobile-development.md) to optimize and streamline your workflow? Here are some recommendations and best practices to help you effectively introduce your team to [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/), an open-source technology built by JetBrains that allows developers to share code across platforms while retaining the benefits of native programming.

* [Start with empathy](#start-with-empathy)
* [Explain how Kotlin Multiplatform works](#explain-how-kotlin-multiplatform-works)
* [Use case studies to demonstrate the value of multiplatform development](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [Offer proof by creating a sample project](#offer-proof-by-creating-a-sample-project)
* [Prepare for questions about multiplatform development from your team](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [Support your team during the adaptation period](#support-your-team-during-the-adaptation-period)

## Start with empathy

Software development is a team game, with each critical decision needing the approval of all team members. Integrating any cross-platform technology will significantly affect the development process for your mobile application. So before you start integrating Kotlin Multiplatform into your project, you'll need to introduce your team to the technology and guide them gently to see that it's worth adopting.

Understanding the people who work on your project is the first step to successful integration. Your boss is responsible for delivering features with the best quality in the shortest time possible. To them, any new technology is a risk. Your colleagues have a different perspective, as well. They have experience building apps with the "native" technology stack. They know how to write the UI and business logic, work with dependencies, test, and debug code in the IDE, and they are already familiar with the language. Switching to a different ecosystem is always inconvenient, as it always means leaving your comfort zone.

Given all that, be ready to face lots of biases and answer a lot of questions when advocating for the move to Kotlin Multiplatform. As you do, never lose sight of what your team needs. Some of the advice below might be useful for preparing your pitch.

## Explain how Kotlin Multiplatform works

At this stage, you need to show that using Kotlin Multiplatform could bring value to your project and eliminate any biased opinions and doubts about cross-platform mobile applications that your team might have.

KMP has been widely used in production since its Alpha release. As a result, JetBrains has been able to collect extensive feedback and provide an even better development experience in the [Stable version](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/).

*   **Ability to use all iOS and Android features** – Whenever a task cannot be accomplished in the shared code or whenever you want to use specific native features, you can use the [expect/actual](multiplatform-expect-actual.md) pattern to seamlessly write platform-specific code.
*   **Seamless performance** – Shared code written in Kotlin is compiled into different output formats for different targets: Java bytecode for Android and native binaries for iOS. Thus, there is no additional runtime overhead when it comes to executing this code on platforms, and the performance is comparable to [native apps](native-and-cross-platform.md).
*   **Compatibility with legacy code** – No matter how large your project is, your existing code will not prevent you from integrating Kotlin Multiplatform. You can start writing cross-platform code at any moment and connect it to your iOS and Android apps as a regular dependency, or you can use the code you've already written and modify it to be compatible with iOS.

Being able to explain _how_ a technology works is crucial, as nobody likes it when a discussion seems to rely on magic. People might think the worst if anything is unclear to them, so be careful not to make the mistake of thinking something is too obvious to warrant an explanation. Instead, try to explain all the basic concepts before moving on to the next stage. This document on [multiplatform programming](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) could help you systemize your knowledge to prepare for this experience.

## Use case studies to demonstrate the value of multiplatform development

Understanding how the multiplatform technology works is necessary, but not enough. Your team needs to see the gains of using it, and the way you present these gains should be related to your product.

At this stage, you need to explain the main gains of using Kotlin Multiplatform in your product. One way is to share stories of other companies who already benefit from cross-platform mobile development. The successful experience of these teams, especially ones with similar product objectives, could become a key factor in the final decision.

Citing case studies of different companies who already use Kotlin Multiplatform in production could significantly help you make a compelling argument:

* **McDonald’s** – By leveraging Kotlin Multiplatform for the Global Mobile App, McDonald’s built a codebase that can be shared across platforms, removing the need for codebase redundancies.
* **Netflix** – With the help of Kotlin Multiplatform, Netflix optimizes product reliability and delivery speed, which is crucial for serving their customers' needs.
* **Forbes** – By sharing over 80% of logic across iOS and Android, Forbes now rolls out new features simultaneously on both platforms while retaining flexibility for platform-specific customization.
* **9GAG** – After trying both Flutter and React Native, 9GAG gradually adopted the Kotlin Multiplatform, which now helps them ship features faster while providing a consistent experience to their users.

> Explore [the case studies page](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html) for inspirational references.
> 
{type="note"}

## Offer proof by creating a sample project

The theory is good, but putting it into practice is ultimately most important. As one option to make your case more convincing and show the potential of multiplatform mobile app development, you can devote some of your time to creating something with Kotlin Multiplatform and then bringing in the results for your team to discuss. Your prototype could be some sort of test project, which you would write from scratch and which would demonstrate features that are needed in your application. 
The [Create a multiplatform app using Ktor and SQLDelight – tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) can guide you well on this process. 

You may be able to produce more relevant examples by experimenting with your current project. You could take one existing feature implemented in Kotlin and make it cross-platform, or you could even create a new Multiplatform Module in your existing project, take a non-priority feature from the bottom of the backlog, and implement it in the shared module. 
The [Make your Android application work on iOS – tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html) provides a step-by-step guide based on a sample project.

## Prepare for questions about multiplatform development from your team

No matter how detailed your pitch is, your team will have a lot of questions. Listen carefully, and try to answer them all patiently. You might expect the majority of the questions to come from the iOS part of the team, as they are the developers who aren't used to seeing Kotlin in their everyday developer routine. This list of some of the most common questions could help you here:

### Q: I heard applications based on cross-platform technologies can be rejected from the App Store. Is taking this risk worth it?

A: The Apple Store has strict guidelines for publishing applications. One of the limitations is that apps may not download, install, or execute code that introduces or changes any features or functionality of the app ([App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)). This is relevant for some cross-platform technologies, but not for Kotlin Multiplatform. Shared Kotlin code compiles to native binaries with Kotlin/Native, bundles a regular iOS framework into your app, and doesn't provide the ability for dynamic code execution.

### Q: Multiplatform projects are built with Gradle, and Gradle has an extremely steep learning curve. Does this mean that I now need to spend a lot of time trying to configure my project?

A: There's actually no need. There are various ways to organize the work process around building Kotlin mobile applications. First, only Android developers could be responsible for the builds, in which case the iOS team would only write code or even only consume the resulting artifact. You can also organize some workshops or practice pair programming when dealing with tasks that require working with Gradle, which would increase your team's Gradle skills. You can explore different ways of organizing teamwork for multiplatform projects and choose the one that's most appropriate for your team.

When only the Android part of the team works with shared code, the iOS developers don't even need to learn Kotlin. But when you are ready for your team to move to the next stage, where everyone contributes to the shared code, making the transition won't take much time. The similarities between the syntax and functionality of Swift and Kotlin greatly reduce the work required to learn how to read and write shared Kotlin code. [Try it yourself with Kotlin Koans](https://play.kotlinlang.org/koans/overview), a series of exercises to familiarize yourself with Kotlin syntax and some idioms.

At the end of 2023, JetBrains introduced [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/), a new experimental project configuration tool focused on usability, onboarding, and IDE support. To get more insights into Amper’s functionality, take a look at its [tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/amper.html).

### Q: Is Kotlin Multiplatform production ready?

A: In November 2023, we announced that Kotlin Multiplatform is now Stable, which means it’s now fully ready for you to use in production.

### Q: There are not enough multiplatform libraries to implement my app’s business logic, and it’s much easier to find native alternatives. Why should I choose Kotlin Multiplatform?

A: The Kotlin Multiplatform ecosystem is thriving and is being cultivated by many Kotlin developers around the world. Just take a look at how fast the number of KMP libraries has been growing over the years.

![The number of Kotlin Multiplatform libraries over years](kmp-libraries-over-years.png){width=700}

It's also a great time to be an iOS developer in the Kotlin Multiplatform open-source community because iOS experience is in demand and there are plenty of opportunities to gain recognition for iOS-specific contributions.

The more your team digs into multiplatform mobile development, the more interesting and complex their questions will be. Don't worry if you don't have the answers – Kotlin Multiplatform has a large and supportive community in the Kotlin Slack with a dedicated [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) channel where a lot of developers who already use it can help you. We would be very thankful if you could [share with us](mailto:kotlin.multiplatform.feedback@kotlinlang.org) the most popular questions asked by your team. This information will help us understand what topics need to be covered in the documentation. 

## Support your team during the adaptation period

After you decide to use Kotlin Multiplatform, there will be an adaptation period as your team experiments with the technology. And your mission will not be over yet! By providing continuous support for your teammates, you will reduce the time it takes for your team to dive into the technology and achieve their first results.

Here are some tips on how you can support your team at this stage:

*   Collect the questions you were asked during the previous stage on a "Kotlin Multiplatform: Frequently Asked Questions" wiki page and share them with your team.
*   Create a _#kotlin-multiplatform-support_ Slack channel and become the most active user there.
*   Organize an informal team-building event with popcorn and pizza where you watch educational or inspirational videos about Kotlin Multiplatform. Here are a few good choices for videos:
  * [Getting Started With KMP: Build Apps for iOS and Android With Shared Logic and Native UIs](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu) 
  * [Build Apps for iOS, Android, and Desktop With Compose Multiplatform](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97) 
  * [iOS Development With Kotlin Multiplatform: Tips and Tricks](https://www.youtube.com/watch?v=eFzy1BRtHps) 
  * [Kotlin Multiplatform Mobile for Teams by Kevin Galligan](https://www.youtube.com/watch?v=-tJvCOfJesk)


The reality is that you probably will not change people's hearts and minds in a day or even a week. But patience and attentiveness to the needs of your colleagues will undoubtedly bring results. 

The JetBrains team looks forward to hearing [your story about your experience with Kotlin Multiplatform](mailto:kotlin.multiplatform.feedback@kotlinlang.org).

_We'd like to thank the [Touchlab team](https://touchlab.co) for helping with the creation of this article._
