[//]: # (title: Get started with Kotlin Multiplatform)
[//]: # (description: Learn how to create your first Kotlin cross-platform app or library benefiting from Kotlin Multiplatform.)

> Kotlin Multiplatform is in [Beta](components-stability.md). It is almost stable, but migration steps may be required
> in the future. We'll do our best to minimize any changes you have to make.
>
{type="note"}

Support for multiplatform programming is one of Kotlin's key benefits. It reduces time spent writing and maintaining the 
same code for [different platforms](multiplatform-dsl-reference.md#targets) while retaining the flexibility and benefits of native programming.   

Learn more about [Kotlin Multiplatform benefits](multiplatform.md).

## Start from scratch

* [Create and publish a multiplatform library](multiplatform-library.md). Complete a project for JVM, web,
  and native platforms, which can be used from any other common code (for example, shared with Android and iOS).
  Learn how to write tests that can be executed on all platforms and use an efficient implementation provided by a specific platform.
* [Get started with Kotlin Multiplatform for mobile](multiplatform-mobile-getting-started.md). Create your first cross-platform 
  application that works on Android and iOS with the help of the [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile).
  Learn how to create, run, and add dependencies to multiplatform mobile applications.
* [Share UIs between iOS and Android](https://github.com/JetBrains/compose-multiplatform-ios-android-template/#readme).
  Create a Kotlin Multiplatform application that uses the [Compose Multiplatform UI framework](https://www.jetbrains.com/lp/compose-multiplatform/)
  for sharing UIs between iOS and Android.

## Dive deep into Kotlin Multiplatform

Once you have gained some experience with Kotlin Multiplatform and want to know how to solve particular cross-platform development tasks:

* [Share code on platforms](multiplatform-share-on-platforms.md) in your Kotlin Multiplatform project.
* [Connect to platform-specific APIs](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html) when developing multiplatform applications and libraries.
* [Set up targets manually](multiplatform-set-up-targets.md) for your Kotlin Multiplatform project.
* [Add dependencies](multiplatform-add-dependencies.md) on the standard, test, or another kotlinx library.
* [Configure compilations](multiplatform-configure-compilations.md) for production and test purposes in your project.
* [Run tests](multiplatform-run-tests.md) for JVM, JavaScript, Android, Linux, Windows, macOS, iOS, watchOS, and tvOS simulators.
* [Publish a multiplatform library](multiplatform-publish-lib.md) to the Maven repository.
* [Build native binaries](multiplatform-build-native-binaries.md) as executables or shared libraries, like universal frameworks or XCFrameworks.

## Get help

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **StackOverflow**: Subscribe to the ["kotlin-multiplatform" tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)