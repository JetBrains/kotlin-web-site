[//]: # (title: Get started with Kotlin Multiplatform)
[//]: # (description: Learn how to create your first Kotlin cross-platform app or library benefiting from Kotlin Multiplatform.)

> Multiplatform projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Support for multiplatform programming is one of Kotlin’s key benefits. It reduces time spent writing and maintaining the 
same code for [different platforms](multiplatform-dsl-reference.md#targets) while retaining the flexibility and benefits of native programming.   

Learn more about [Kotlin Multiplatform benefits](multiplatform.md).

## Start from scratch

* [Create and publish a multiplatform library](multiplatform-library.md) teaches how to create a multiplatform 
library available for JVM, JS, and Native and which can be used from any other common code (for example, shared with 
Android and iOS). It also shows how to write tests which will be executed on all platforms and use an efficient implementation
 provided by a specific platform.

* [Build a full-stack web app with Kotlin Multiplatform](multiplatform-full-stack-app.md) 
  teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server 
  application that makes use of shared code, serialization, and other multiplatform paradigms. It also provides a brief
  introduction to working with Ktor both as a server- and client-side framework.

* [Create your first Kotlin Multiplatform Mobile application](multiplatform-mobile-create-first-app.md) shows how to create a mobile
  application that works on Android and iOS with the help of the [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile).
  Create, run, and test your first multiplatform mobile application.

## Dive deep into Kotlin Multiplatform

Once you have gained some experience with Kotlin Multiplatform and want to know how to solve particular cross-platform development tasks:

* [Share code on platforms](multiplatform-share-on-platforms.md) in your Kotlin Multiplatform project.

* [Connect to platform-specific APIs](multiplatform-connect-to-apis.md) using the Kotlin mechanism of expected and actual declarations.

* [Set up targets manually](multiplatform-set-up-targets.md) for your Kotlin Multiplatform project.

* [Add dependencies](multiplatform-add-dependencies.md) on the standard, test, or another kotlinx library.

* [Configure compilations](multiplatform-configure-compilations.md) for production and test purposes in your project.

* [Run tests](multiplatform-run-tests.md) for JVM, JavaScript, Android, Linux, Windows, macOS, iOS, watchOS, and tvOS simulators.

* [Publish a multiplatform library](multiplatform-publish-lib.md) to the Maven repository.

* [Build native binaries](multiplatform-build-native-binaries.md) as executables or shared libraries, like universal frameworks or XCFrameworks.

## Get help

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform)
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)