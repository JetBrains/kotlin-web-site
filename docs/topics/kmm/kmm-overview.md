[//]: # (title: Kotlin Multiplatform Mobile)

> Multiplatform Mobile projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Kotlin Multiplatform Mobile (_KMM_) is an SDK designed to simplify creating multiplatform mobile applications.
Kotlin Multiplatform Mobile allows you to use a single codebase for the business logic of iOS and Android apps.

You only need to write platform-specific code where it’s necessary, for example to implement a native UI or when working with platform-specific APIs.

![Code shared for iOS targets](iosmain-hierarchy.png){width=400}

## Supported platforms 

KMM supports the following mobile targets:

* Android applications and libraries
* [Android NDK](https://developer.android.com/ndk) on ARM32 and ARM64 platforms
* Apple iOS on ARM64 (iPhone 5s and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms
* Apple watchOS on ARM64 (Apple Watch Series 4 and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms

KMM is built on top of the [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html) technology,
which supports other platforms inlcuding JavaScript, Linux, WebAssembly, and [more](https://kotlinlang.org/docs/mpp-dsl-reference.html#targets).

See [supported platforms for Kotlin multiplatform programming](https://kotlinlang.org/docs/mpp-supported-platforms.html)

## Get started with Kotlin Multiplatform Mobile

* [Get started with KMM](kmm-getting-started.md) if you're already familiar with the Kotlin language and want to try out Kotlin Multiplatform Mobile (KMM).
* [Get started with Kotlin](getting-started.md) if you're new to Kotlin. 

### Sample projects

* [Check our list of KMM sample projects](kmm-samples.md) for inspiration.

### Videos

* "Kotlin Multiplatform Multiverse Episode 1: Meet KMM!" by Ekaterina Petrova, Kotlin Developer Advocate

  <!-- <video href="mdN6P6RI__k" title="Kotlin Multiplatform Multiverse, Episode 1: Meet KMM!"/> -->

* "Kotlin Multiplatform Multiverse, Episode 2: Your First Kotlin Multiplatform Mobile App Tutorial" by 
  Ekaterina Petrova, Kotlin Developer Advocate
  
  <!-- <video href="GcqFhoUuNNI" title="Kotlin Multiplatform Multiverse, Episode 2: Your First Kotlin Multiplatform Mobile App Tutorial"/> -->

## Community

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).
* [New KMM plugin releases](kmm-plugin-releases.md)
* [What's new in Kotlin for KMM](whats-new-in-kotlin-for-kmm.md)
* [Multiplatform roadmap](https://youtrack.jetbrains.com/agiles/153-1251/current)

## Security

We do our best to make sure our software is free of security vulnerabilities.
To reduce the risk of introducing a vulnerability, you can follow [Kotlin security recommendations](https://kotlinlang.org/security.html).

We are very eager and grateful to hear about any security issues you find.
To report vulnerabilities that you discover in any part of KMM, please post a message directly to our [issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) or send us an [email](mailto:security@jetbrains.org).

For further information on how our responsible disclosure process works, please check the [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/terms/coordinated-disclosure.html).