[//]: # (title: Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform allows creating cross-platform apps for desktop, web, and mobile devices.
Share application logic while keeping native user experience.)

> Kotlin Multiplatform is in [Beta](components-stability.md). It is almost stable, but migration steps may be required
> in the future. We'll do our best to minimize any changes you have to make.
>
{type="note"}

The Kotlin Multiplatform technology is designed to simplify the development of cross-platform projects. It reduces time
spent writing and maintaining the same code for [different platforms](#kotlin-multiplatform-use-cases)
while retaining the flexibility and benefits of native programming.

![Kotlin Multiplatform](kotlin-multiplatform.svg){width=700}

## Kotlin Multiplatform use cases

### Android and iOS applications

Sharing code between mobile platforms is a major Kotlin Multiplatform use cases. With Kotlin Multiplatform for mobile,
you can build cross-platform mobile applications that share code between Android and iOS, such as networking, data storage 
and data validation, analytics, computations, and other application logic. 

Thanks to [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), a Kotlin-based declarative UI framework developed by JetBrains, you 
can also share UIs across Android and iOS to create fully cross-platform apps.

![Sharing different levels and UI](multiplatform+compose.svg){width=500}

Check out the [Get started with Kotlin Multiplatform for mobile](multiplatform-mobile-getting-started.md) and [Get started with Compose for iOS](https://github.com/JetBrains/compose-multiplatform-ios-android-template/#readme) tutorials,
where you will create applications for Android and iOS with shared code for both platforms.

### Multiplatform libraries

Kotlin Multiplatform is also helpful for library authors. You can create a multiplatform library with common code and its
platform-specific implementations for JVM, web, and native platforms. Once published, a multiplatform library can be used
as a dependency in other cross-platform projects.

See the [Create and publish a multiplatform library](multiplatform-library.md) tutorial, where you will create
a multiplatform library, test it, and publish it to Maven.

## Code sharing between platforms

Kotlin Multiplatform enables you to maintain a single codebase for application logic while keeping advantages of native 
programming, including great app performance and full access to the platforms SDKs

Kotlin provides the following code sharing mechanisms:

* Share common code among [all platforms](multiplatform-share-on-platforms.md#share-code-on-all-platforms) used in your project.
* Share code among [some platforms](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) included in your project to reuse much of the code in similar platforms:

    ![Code shared for iOS targets](kotlin-multiplatform-hierarchical-structure.svg){width=700}

* If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-connect-to-apis.md).

## Get started

* Begin with the [Get started with Kotlin Multiplatform for mobile](multiplatform-mobile-getting-started.md) if you want to create iOS and Android applications with shared code
* Explore [sharing code principles and examples](multiplatform-share-on-platforms.md) if you want to create applications or libraries targeting other platforms

> New to Kotlin? Take a look at [Getting started with Kotlin](getting-started.md).
>
{type="tip"}

### Sample projects

Look through cross-platform application samples to understand how Kotlin Multiplatform works:

* [Kotlin Multiplatform for mobile samples](multiplatform-mobile-samples.md)
* [Compose Multiplatform samples](https://github.com/JetBrains/compose-multiplatform/blob/master/examples/README.md)

