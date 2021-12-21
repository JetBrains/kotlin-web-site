[//]: # (title: Get started with Kotlin Multiplatform Mobile)
[//]: # (description: cross platform mobile development, android vs ios development)

> Kotlin Multiplatform Mobile is in [Alpha](components-stability.md). Language features and tooling may change in future
> Kotlin versions.
> 
> Beta is expected in spring 2022. See [KMM Beta Roadmap](https://youtu.be/LE-Dy9XCLxk) video
> to learn about upcoming features.
>
{type="note"}

Kotlin Multiplatform Mobile (KMM) is an SDK designed to simplify development of cross-platform mobile applications.
You can share common code between iOS and Android apps and write platform-specific code only where it's necessary.
For example, to implement a native UI or when working with platform-specific APIs.

Watch the introductory [video](https://www.youtube.com/watch?v=mdN6P6RI__k), in which Kotlin Developer Advocate Ekaterina 
Petrova explains what Kotlin Multiplatform Mobile is and how you can use it in your project. With Ekaterina,
you'll set up an environment and prepare to create your first cross-platform mobile application:

<video href="mdN6P6RI__k" title="Kotlin Multiplatform Multiverse, Episode 1: Meet KMM!"/>

You can also check out other videos about [Kotlin Multiplatform Multiverse](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) on YouTube.

## Supported platforms

* Android applications and libraries
* [Android NDK](https://developer.android.com/ndk) on ARM32 and ARM64 platforms
* Apple iOS on ARM64 (iPhone 5s and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms
* Apple watchOS on ARM64 (Apple Watch Series 4 and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms

[Kotlin Multiplatform](multiplatform.md) technology also supports other platforms, including JavaScript, Linux, WebAssembly,
and [more](mpp-dsl-reference.md#targets).

See [supported platforms for Kotlin multiplatform programming](mpp-supported-platforms.md).

## Start from scratch

* [Set up the environment for cross-platform mobile development](kmm-setup.md)
* [Create your first multiplatform mobile app using the IDE wizard](kmm-create-first-app.md)
* [Check out the list of sample projects](kmm-samples.md)
* [Introduce Kotlin for cross-platform mobile app development to your team](kmm-introduce-your-team.md)

## Make your Android application work on iOS

If you already have an Android mobile application and want to make it cross-platform:

* [Set the environment for cross-platform mobile development](kmm-setup.md)
* [Make a sample Android application work well on iOS](kmm-integrate-in-existing-app.md)

## Get help

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)