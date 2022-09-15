[//]: # (title: Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform allows creating cross-platform apps for desktop, web, and mobile devices.
Share application logic while keeping native user experience.)

> Multiplatform projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Support for multiplatform programming is one of Kotlin's key benefits. It reduces time spent writing and maintaining the
 same code for [different platforms](multiplatform-dsl-reference.md#targets) while retaining the flexibility and benefits of native programming. 

## Kotlin Multiplatform use cases

### Android and iOS applications

Sharing code between mobile platforms is one of the major Kotlin Multiplatform use cases. With Kotlin Multiplatform Mobile,
you can build cross-platform mobile applications and share common code between Android and iOS, such as business logic, connectivity,
and more.

Check out the [Get started with Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/) section and
[Kotlin Multiplatform Hands-on: Networking and Data Storage](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction),
where you will create an application for Android and iOS that includes a module with shared code for both platforms.

### Full-stack web applications

Another scenario when code sharing may bring benefits is a connected application where the logic can be
reused on both the server and the client side running in the browser. This is covered by Kotlin
Multiplatform as well.

See [Build a full-stack web app with Kotlin Multiplatform](multiplatform-full-stack-app.md)
tutorial, where you will create a connected application consisting of a server part, using Kotlin/JVM and a web client,
using Kotlin/JS.

### Multiplatform libraries

Kotlin Multiplatform is also useful for library authors. You can create a multiplatform library with common code and its
platform-specific implementations for JVM, JS, and Native platforms. Once published, a multiplatform library can be used
in other cross-platform projects as a dependency.

See the [Create and publish a multiplatform library](multiplatform-library.md) tutorial, where you will create
a multiplatform library, test it, and publish it to Maven.

### Common code for mobile and web applications

One more popular case for using Kotlin Multiplatform is sharing the same code across Android, iOS, and web apps. It
reduces the amount of business logic coded by frontend developers and helps implement products more efficiently,
decreasing the coding and testing efforts.

See the [RSS Reader](https://github.com/Kotlin/kmm-production-sample/tree/c6a0d9182802490d17729ae634fb59268f68a447) sample
project — a cross-platform application for iOS and Android with desktop and web clients implemented as experimental features.

## How Kotlin Multiplatform works

![Kotlin Multiplatform](kotlin-multiplatform.png){width=500}

* **Common Kotlin** includes the language, core libraries, and basic tools. Code written in common Kotlin works 
everywhere on all platforms.
* With Kotlin Multiplatform libraries, you can reuse the multiplatform logic in common and platform-specific code. 
Common code can rely on a set of libraries that cover everyday tasks such as [HTTP](https://ktor.io/clients/http-client/multiplatform.html), [serialization](https://github.com/Kotlin/kotlinx.serialization), and [managing 
coroutines](https://github.com/Kotlin/kotlinx.coroutines).
* To interop with platforms, use platform-specific versions of Kotlin. **Platform-specific versions of Kotlin** 
(Kotlin/JVM, Kotlin/JS, Kotlin/Native) include extensions to the Kotlin language, and platform-specific libraries and tools. 
* Through these platforms you can access the **platform native code** (JVM, JS, and Native) and leverage all native
 capabilities.

### Code sharing between platforms

With Kotlin Multiplatform, spend less time on writing and maintaining the same code for [different platforms](multiplatform-dsl-reference.md#targets)
 – just share it using the mechanisms Kotlin provides:

* [Share code among all platforms used in your project](multiplatform-share-on-platforms.md#share-code-on-all-platforms). Use it for sharing the common 
business logic that applies to all platforms.

* [Share code among some platforms](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) included in your project but not all. Do this 
when you can reuse much of the code in similar platforms:

    ![Code shared for iOS targets](kotlin-multiplatofrm-hierarchical-structure.png){width=700}

* If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](multiplatform-connect-to-apis.md).

## Get started

* Look through [our examples and tutorials](multiplatform-share-on-platforms.md) if you want to create applications or libraries targeting JVM, JavaScript, and other platforms
* Start with the [Get started with Kotlin Multiplatform Mobile](multiplatform-mobile-getting-started.md) if you want to create iOS and Android applications with shared code

> New to Kotlin? Take a look at [Getting started with Kotlin](getting-started.md).
>
{type="tip"}

### Sample projects

Look through cross-platform application samples to understand how Kotlin Multiplatform works:

* [Kotlin Multiplatform Mobile samples](multiplatform-mobile-samples.md)
* [KotlinConf app](https://github.com/JetBrains/kotlinconf-app)
* [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner)
* [Build a full-stack web app with Kotlin Multiplatform](multiplatform-full-stack-app.md)
