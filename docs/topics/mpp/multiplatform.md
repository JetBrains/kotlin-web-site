[//]: # (title: Multiplatform programming)

> Multiplatform projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Support for multiplatform programming is one of Kotlin’s key benefits. It reduces time spent writing and maintaining the
 same code for [different platforms](mpp-supported-platforms.md) while retaining the flexibility and benefits of native programming. 

This is how Kotlin Multiplatform works.

![Kotlin Multiplatform](kotlin-multiplatform.png){width=500}

*   **Common Kotlin** includes the language, core libraries, and basic tools. Code written in common Kotlin works 
everywhere on all platforms.
*   With Kotlin Multiplatform libraries, you can reuse the multiplatform logic in common and platform-specific code. 
Common code can rely on a set of libraries that cover everyday tasks such as [HTTP](https://ktor.io/clients/http-client/multiplatform.html), [serialization](https://github.com/Kotlin/kotlinx.serialization), and [managing 
coroutines](https://github.com/Kotlin/kotlinx.coroutines).
*   To interop with platforms, use platform-specific versions of Kotlin. **Platform-specific versions of Kotlin** 
(Kotlin/JVM, Kotlin/JS, Kotlin/Native) include extensions to the Kotlin language, and platform-specific libraries and tools. 
*   Through these platforms you can access the **platform native code** (JVM, JS, and Native) and leverage all native
 capabilities.

With Kotlin Multiplatform, spend less time on writing and maintaining the same code for [different platforms](mpp-supported-platforms.md)
 – just share it using the mechanisms Kotlin provides:

* [Share code among all platforms used in your project](mpp-share-on-platforms.md#share-code-on-all-platforms). Use it for sharing the common 
business logic that applies to all platforms. 
     
    ![Code shared for all platforms](flat-structure.png)
    
* [Share code among some platforms](mpp-share-on-platforms.md#share-code-on-similar-platforms) included in your project but not all. Do this 
when you can reuse much of the code in similar platforms.  
    
    ![Hierarchical structure](hierarchical-structure.png)

    ![Code shared for iOS targets](iosmain-hierarchy.png){width=400}

If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](mpp-connect-to-apis.md).

With this mechanism, a common source set defines an _expected declaration_, and platform source sets must provide the 
_actual declaration_ that corresponds to the expected declaration. This works for most Kotlin declarations, such as 
functions, classes, interfaces, enumerations, properties, and annotations.

![Expect and actual declarations](expect-actual.png){width=700}

```kotlin
//Common
expect fun randomUUID(): String
```

```kotlin
//Android
import java.util.*
actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
//iOS
import platform.Foundation.NSUUID
actual fun randomUUID(): String = NSUUID().UUIDString()
```

## Use cases

### Android — iOS

Sharing code between mobile platforms is one of the major Kotlin Multiplatform use cases. With Kotlin Multiplatform Mobile (KMM), 
you can build multiplatform mobile applications sharing code, such as business logic, connectivity, 
and more, between Android and iOS.

See [KMM features, case studies and examples](https://kotlinlang.org/lp/mobile/)

### Client — Server

Another scenario when code sharing may bring benefits is a connected application where the logic can be 
reused on both the server and the client side running in the browser. This is covered by Kotlin 
Multiplatform as well.

The [Ktor framework](https://ktor.io/) is suitable for building asynchronous servers and clients in connected systems.

## What's next?

New to Kotlin? Visit [Getting started with Kotlin](getting-started.md).

### Documentation

* [Get started with Kotlin Multiplatform Mobile (KMM)](kmm-getting-started.md)
* [Create a multiplatform project](mpp-create-lib.md)
* [Share code on multiple platforms](mpp-share-on-platforms.md)
* [Connect to platform-specific APIs](mpp-connect-to-apis.md)

### Tutorials

* [Create your first KMM application](kmm-create-first-app.md) shows how to create a mobile application that works on Android and iOS with the help of the [KMM plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile).
Create, run, and test your first multiplatform mobile application.

* [Creating a multiplatform Kotlin library](multiplatform-library.md) teaches how to create a multiplatform 
library available for JVM, JS, and Native and which can be used from any other common code (for example, shared with 
Android and iOS). It also shows how to write tests which will be executed on all platforms and use an efficient implementation
 provided by a specific platform.
 
* [Building a full stack web app with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) 
  teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server 
  application that makes use of shared code, serialization, and other multiplatform paradigms. It also provides a brief
  introduction to working with Ktor both as a server- and client-side framework.
  
## Sample projects

- [Kotlin Multiplatform Mobile (KMM) samples](kmm-samples.md)
- [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) 
- [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner)
