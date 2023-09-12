[//]: # (title: Use platform-specific APIs)

In this article you'll learn how to use platform-specific APIs when developing multiplatform applications and libraries.

## Kotlin multiplatform libraries

Before writing code that uses platform-specific API, check whether you can avoid it by using a multiplatform library
that already does the job. Such a library provides a common Kotlin API that is implemented differently for different
platforms.

There are already many libraries you can use to implement networking, logging, analytics, accessing device
functionality, and so on. You can look for one in [this curated list](https://github.com/terrakok/kmm-awesome).

## Expected and actual functions and properties

> The mechanism of expected and actual declarations is in [Beta](components-stability.md).
> It is almost stable, but migration steps may be required in the future.
> We'll do our best to minimize any changes you will have to make.
>
{type="warning"}

Kotlin provides a language mechanism to access platform-specific APIs while developing the common logic,
[expected and actual declarations](multiplatform-expect-actual.md).

With this mechanism, a common source set of a multiplatform module defines an expected declaration, and every platform
source set must provide the actual declaration that corresponds to the expected declaration. The compiler ensures that
every declaration marked with the `expect` keyword in the common source set has the corresponding declarations marked
with the `actual` keyword in all targeted platform source sets.

This works for most Kotlin declarations, such as functions, classes, interfaces, enumerations, properties, and
annotations. This section focuses on using expected and actual functions and properties.

![Using expected and actual functions and properties](expect-functions-properties.png){width=500}

In this example, you define an expected `platform()` function in the common source set and provide actual
implementations in platform source sets. While generating the code for a specific platform, the Kotlin compiler merges
expected and actual declarations. It generates one `platform()` function with its actual implementation. Expected and
actual declarations should be defined in the same package and are merged into _one declaration_ in the resulting
platform code. Any invocation of the expected `platform()` function in the generated platform code will call the correct
actual implementation.

### Example. Generate a UUID

Let's assume that you are developing iOS and Android applications using Kotlin Multiplatform, and you want to generate a
universally unique identifier (UUID).

For this purpose, declare the expected function `randomUUID()` with the `expect` keyword in the common source set of
your Kotlin Multiplatform module. Don't include any implementation code.

```kotlin
// In the common source set:
expect fun randomUUID(): String
```

In each platform-specific source set (iOS and Android), provide the actual implementation for the
function `randomUUID()` expected in the common module. Use the `actual` keyword to mark these actual implementations.

![(Generating UUID with expected and actual declarations).](expect-generate-uuid.png){width=500}

The following snippets show the implementations for Android and iOS. Platform-specific code uses the `actual` keyword
and the same name for the function:

```kotlin
// In the android source set:
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// In the iOS source set:
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

The Android implementation uses APIs available on Android, while the iOS implementation uses iOS APIs. Note that you can
access Apple APIs from the Kotlin/Native code.

While producing the resulting code for Android, the Kotlin compiler automatically merges expected and actual
declarations and generates a single `randomUUID()` function with its actual Android-specific implementation. The same
works for producing the resulting code for iOS.

For simplicity, this and the following examples use simplified source set names, "common", "ios", and "android".
Typically, it implies `commonMain`, `iosMain`, and `androidMain`, and similar logic can be defined in the test source
sets `commonTest`, `iosTest`, and `androidTest`.

Similarly to expected and actual functions, expected and actual properties provide you with different values on
different platforms. Use expected and actual functions and properties for simple cases.

## Interfaces

If platform-specific logic is too big and complex, you can define an interface to represent it in the common code and
then provide different implementations in platform source sets.

![Using interfaces](expect-interfaces.png){width=500}

The implementations in platform source sets use corresponding dependencies:

```kotlin
// In the commonMain source set:
interface Platform {
    val name: String
}
```

```kotlin
// In the androidMain source set:
import android.os.Build
class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// In the iosMain source set:
import platform.UIKit.UIDevice
class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

To inject correct platform implementations when you need the common interface, you can use [expected and actual
functions](#expected-and-actual-functions), provide implementations through [different entry points](#different-entry-points),
or use a [dependency injection (DI) framework](#dependency-injection-framework).

### Expected and actual functions

Define an expected function returning a value of this interface and actual functions returning the subclasses:

```kotlin
// In the commonMain source set:
interface Platform

expect fun platform(): Platform
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

You call `platform()` in the common code and can work with an object of the `Platform` type. When you run this common
code on Android, the `platform()` call will return an instance of the `AndroidPlatform` class. When you run it on
iOS, `platform()` will return an instance of the `IOSPlatform` class.

### Different entry points

If you control the entry points, you can construct implementations of each platform artifact without using the
expect/actual mechanism. This way, you define the platform implementations in the shared Kotlin Multiplatform module,
but instantiate them in platform modules:

```kotlin
// Shared Kotlin Multiplatform module
// In the commonMain source set:
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform
```

```kotlin
// In the androidApp platform module:
import android.app.Application
import mysharedpackage.*

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        application(AndroidPlatform())
    }
}
```

```Swift
// In the iosApp platform module (in Swift):
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

On Android, you create an instance of `AndroidPlatform` and pass it to the `application()` function, while on iOS, you
similarly create and pass an instance of `IOSPlatform`. These entry points don't need to be the entry points of your
apps, but this is where you can call the specific functionality of your shared module.

Providing correct implementations with expected and actual functions or directly through entry points work well for
simple scenarios. However, if you use DI in your project, we recommend you to use it in such cases as well for
consistency.

### Dependency injection framework

A modern application typically uses a dependency injection (DI) framework to create a loosely coupled architecture. The
DI framework allows injecting dependencies into components based on the current environment.

Any DI framework that supports Kotlin Multiplatform can help you inject different dependencies for different platforms.
We don't want to recommend any specific framework, use the one you prefer.

For instance, that's how to inject platform implementations with one of the frameworks that support Kotlin
Multiplatform, [Koin](https://insert-koin.io/):

```kotlin
// In the common source set:
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// In the androidMain source set:
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// In the iosMain source set:
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

Here, Koin DSLs create modules that define components for injection. You declare a module in common code with
the `expect` keyword, and then provide a platform-specific implementation for each platform using the `actual` keyword.
The framework takes care of selecting the correct implementation at runtime.

When you use a DI framework, you inject all the dependencies though this framework. The same logic applies to handling
platform dependencies. We recommend sticking to DI if you already have it in your project instead of using the expected
and actual functions manually. This way, you avoid mixing two different ways of injecting dependencies.

Note that you don't have to implement the common interface in Kotlin. You can do it in other languages, for example in
Swift, in a different _platform module_. Then you provide the implementation from the iOS platform module using the DI
framework:

![Using dependency injection framework](expect-di-framework.png){width=500}

This approach only works if you put implementations in the platform modules. It isn't very scalable because your Kotlin
Multiplatform module can't be self-sufficient − you should implement the common interface in a different module.

<!--If you're interested in expanding this functionality to a shared module, please vote for this issue [TODO create or find an issue] and describe your use case.-->

## What's next?

For more examples and information on the expect/actual mechanism, see [Expected and actual declarations](multiplatform-expect-actual.md).