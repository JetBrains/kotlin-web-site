[//]: # (title: Kotlin Multiplatform Mobile)

> Multiplatform Mobile projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Kotlin Multiplatform Mobile (_KMM_) is an SDK designed to simplify creating cross-platform mobile applications.
With the help of KMM, you can share common code between iOS and Android apps and write platform-specific code only where it’s necessary.
For example, to implement a native UI or when working with platform-specific APIs.

## Get started with Kotlin Multiplatform Mobile

[Get started with KMM](kmm-getting-started.md) if you're already familiar with the Kotlin language and want to try out Kotlin Multiplatform Mobile (KMM).
If you're new to Kotlin, [get started with these tutorials](getting-started.md).

If you want to introduce KMM to your team, look through [our recommendations](kmm-introduce-your-team.md).

## Supported platforms

KMM supports the following mobile targets:

* Android applications and libraries
* [Android NDK](https://developer.android.com/ndk) on ARM32 and ARM64 platforms
* Apple iOS on ARM64 (iPhone 5s and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms
* Apple watchOS on ARM64 (Apple Watch Series 4 and newer), ARM32 (earlier models) platforms, and desktop simulators on both Intel-based and Apple Silicon platforms

KMM is built on top of the [Kotlin Multiplatform](multiplatform.md) technology,
which supports other platforms inlcuding JavaScript, Linux, WebAssembly, and [more](mpp-dsl-reference.md#targets).

See [supported platforms for Kotlin multiplatform programming](mpp-supported-platforms.md).

## Sample projects

[Check our list of KMM sample projects](kmm-samples.md) for inspiration.

## Videos

Learn KMM with [Kotlin Multiplatform Multiverse](https://www.youtube.com/playlist?list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C) videos on YouTube.

## Community

* **Kotlin Slack**: Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).
* **Kotlin issue tracker**: [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).

## Security

We do our best to make sure our software is free of security vulnerabilities.
To reduce the risk of introducing a vulnerability, you can follow [Kotlin security recommendations](security.md).

We are very eager and grateful to hear about any security issues you find.
To report vulnerabilities that you discover in any part of KMM, please post a message directly to our [issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) or send us an [email](mailto:security@jetbrains.org).

For further information on how our responsible disclosure process works, please check the [JetBrains Coordinated Disclosure Policy](https://www.jetbrains.com/legal/terms/coordinated-disclosure.html).