[//]: # (title: Get started with Kotlin Multiplatform Mobile)
[//]: # (description: Simplify cross-platform app development with Kotlin Multiplatform Mobile. Create a single codebase
for the business logic of your iOS and Android apps.)

> Kotlin Multiplatform Mobile is in [Alpha](components-stability.md). Language features and tooling may change in future
> Kotlin versions.
> 
> * Check out our update on the [Kotlin Multiplatform Mobile Beta Roadmap](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)
> to learn about the steps we are taking to move toward the Beta release.
> * You can also see how [different companies](https://kotlinlang.org/lp/mobile/case-studies/) already use Kotlin for
> cross-platform app development.
>
{type="note"}

Kotlin Multiplatform Mobile (KMM) is an SDK designed to simplify the development of cross-platform mobile applications.
You can share common code between iOS and Android apps and write platform-specific code only where it's necessary.
For example, to implement a native UI or when working with platform-specific APIs.

Watch the introductory [video](https://www.youtube.com/watch?v=mdN6P6RI__k), in which Kotlin Product Marketing Manager Ekaterina 
Petrova explains what Kotlin Multiplatform Mobile is and how to use it in your project. With Ekaterina,
you'll set up an environment and prepare to create your first cross-platform mobile application:

<video href="mdN6P6RI__k" title="Meet Kotlin Multiplatform Mobile!"/>

You can also check out other videos about [Kotlin Multiplatform Multiverse](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) on YouTube.

## Supported platforms

* Android applications and libraries
* [Android NDK](https://developer.android.com/ndk) (ARM64 and ARM32)
* Apple iOS devices (ARM64 and ARM32) and simulators
* Apple watchOS devices (ARM64 and ARM32) and simulators

[Kotlin Multiplatform](multiplatform.md) technology also supports [other platforms](multiplatform-dsl-reference.md#targets), including
JavaScript, Linux, Windows, and WebAssembly.

## Start from scratch

* [Set up the environment for cross-platform mobile development](multiplatform-mobile-setup.md)
* [Create your first app that works both on Android and iOS with IDE](multiplatform-mobile-create-first-app.md)
* [Check out the list of sample projects](multiplatform-mobile-samples.md)
* [Introduce cross-platform mobile development to your team](multiplatform-mobile-introduce-your-team.md)

## Make your Android application work on iOS

If you already have an Android mobile application and want to make it cross-platform, here are some resources to help
you get started:

* [Set up the environment for cross-platform development](multiplatform-mobile-setup.md)
* [Make a sample Android application work well on iOS](multiplatform-mobile-integrate-in-existing-app.md)

## Get help

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)
