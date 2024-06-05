[//]: # (title: Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform allows creating cross-platform apps for desktop, web, and mobile devices.
Share application logic while keeping native user experience.)

The Kotlin Multiplatform technology is designed to simplify the development of cross-platform projects. It reduces time
spent writing and maintaining the same code for [different platforms](#kotlin-multiplatform-use-cases)
while retaining the flexibility and benefits of native programming.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## Kotlin Multiplatform use cases

### Android and iOS applications

Sharing code between mobile platforms is a major Kotlin Multiplatform use case. With Kotlin Multiplatform,
you can build cross-platform mobile applications that share code between Android and iOS projects to implement networking,
data storage and data validation, analytics, computations, and other application logic.

Check out the [Get started with Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) and
[Create a multiplatform app using Ktor and SQLDelight](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) tutorials,
where you will create applications for Android and iOS that include a module with shared code for both platforms.

Thanks to [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/),
a Kotlin-based declarative UI framework developed by JetBrains,
you can also share UIs across Android and iOS to create fully cross-platform apps:

![Sharing different levels and UI](multiplatform-compose.svg){width=600}

Check out the [Get started with Compose Multiplatform](https://github.com/JetBrains/compose-multiplatform-ios-android-template/#readme)
tutorial to create your own mobile application with UIs shared between both platforms.

### Multiplatform libraries

Kotlin Multiplatform is also helpful for library authors. You can create a multiplatform library with common code and its
platform-specific implementations for JVM, web, and native platforms. Once published, a multiplatform library can be used
as a dependency in other cross-platform projects.

See the [Publish a multiplatform library](multiplatform-publish-lib.md) for more details.

### Desktop applications

Compose Multiplatform helps share UIs across desktop platforms like Windows, macOS, and Linux. Many applications,
including the [JetBrains Toolbox app](https://blog.jetbrains.com/kotlin/2021/12/compose-multiplatform-toolbox-case-study/),
have already adopted this approach.

Try this [Compose Multiplatform desktop application](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme)
template to create your own project with UIs shared among desktop platforms.

## Code sharing between platforms

Kotlin Multiplatform allows you to maintain a single codebase of the application logic for [different platforms](multiplatform-dsl-reference.md#targets).
You also get advantages of native programming, including great performance and full access to platform SDKs.

Kotlin provides the following code sharing mechanisms:

* Share common code among [all platforms](multiplatform-share-on-platforms.md#share-code-on-all-platforms) used in your project.
* Share code among [some platforms](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) included in your project to reuse much of the code in similar platforms:

  ![Code shared across different platforms](kotlin-multiplatform-hierarchical-structure.svg){width=700}

* If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-expect-actual.md).

## Get started

* Begin with the [Get started with Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) if you want to create iOS and Android applications with shared code
* Explore [sharing code principles and examples](multiplatform-share-on-platforms.md) if you want to create applications or libraries targeting other platforms

> New to Kotlin? Take a look at [Getting started with Kotlin](getting-started.md).
>
{type="tip"}

### Sample projects

Look through [cross-platform application samples](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) to understand how Kotlin Multiplatform works.
