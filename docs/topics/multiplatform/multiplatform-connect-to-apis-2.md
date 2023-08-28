[//]: # (title: Connect to platform-specific APIs)

Some multiplatform applications can be written entirely in common code. Others have requirements that go beyond what
multiplatform libraries can provide.

In the second case, you need to work with the APIs of the underlying platform, such as Android or iOS. The Kotlin
language provides a mechanism of expected and actual declarations to enable this process.

You can use these declarations directly in your code. However, many projects are better off using the same functionality
indirectly using dependency injection (DI). Let's compare these approaches.

## Work with a DI framework

To create a loosely coupled architecture, many Kotlin projects adopt the dependency injection framework. The DI
framework allows injecting dependencies into components based on the current environment.

For example, you might inject different dependencies in QA and in production or when deployed to the cloud compared to
hosting locally. As long as the dependency is expressed through an interface, any number of different implementations
can be injected, either at compile time or runtime.

The same principle applies when the dependencies are platform-specific. In common code, a component can express its
dependencies using regular [Kotlin interfaces](interfaces.md). The DI framework can then be configured to inject a
platform-specific implementation, for example, from a JVM or an iOS module.

This means that the only case when expected and actual declarations are needed is in the configuration of the DI
framework. In the [Koin framework](https://insert-koin.io/), you can use DSLs to create modules that define components
for injection. It's possible to declare a module in common code with the `expect` keyword and then provide a
platform-specific implementation for each platform using the `actual` keyword. The framework takes care of selecting the
correct implementation at build time.

With this approach, you can adopt Kotlin Multiplatform simply by using interfaces and some object-oriented best
practices. The drawback is that you need to choose and work with a DI framework.<!-- For more details, see the Dependency
injection.-->

## Use expected and actual declarations directly

If you choose not to work with a DI framework, you can use expected and actual declarations directly. Follow these
steps:

1. In the common source set, declare a standard Kotlin construct. This could be a function, property, class, interface,
   enumeration, or annotation.
2. Mark this construct with the `expect` keyword. It's your _expected declaration_. These declarations can be used in
   common code but should not include implementation. Instead, the platform-specific code provides this implementation.
3. In each platform-specific source set, declare the same construct in the same package and mark it with the `actual`
   keyword. It's your _actual declaration_. Typically, it contains an implementation using platform-specific libraries.

While compiling a specific target, the compiler tries to match each actual declaration it finds with the corresponding
_expected_ declaration in common code. The compiler ensures that:

* Every expected declaration in the common module has a matching actual declaration in every platform-specific module.
* Expected declarations do not contain any implementation.
* Every actual declaration shares the same package as the corresponding expected declaration, such
  as `org.mygroup.myapp.MyType`.

The IDE provides assistance for common issues when declarations are missing, the expected declaration contains
implementation, the signatures of declarations do not match, or the declarations are in different packages.

You can also use the IDE to navigate from the expected to actual declarations. You can select the gutter icon to view
actual declarations or use [shortcuts](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation).

### A sample project

You can find a simple example of expected and actual declarations in the **Kotlin Multiplatform App** template in
Android Studio. The project wizard generates sample code that uses expected and actual declarations:

* In the `commonMain` source set, you'll find the following common code:

  ```kotlin
  class Greeting {
      private val platform: Platform = getPlatform()
  
      fun greet(): String {
          return "Hello, ${platform.name}!"
      }
  }
  
  interface Platform {
      val name: String
  }
  
  expect fun getPlatform(): Platform
  ```

The `Greeting` and `Platform` types belong to common code, but the `getPlatform()` function is an expected declaration.
So, it should be implemented on each supported platform.

* In the `androidMain` source set, you can find the following implementation for Android:

  ```kotlin
  class AndroidPlatform : Platform {
      override val name: String = "Android ${android.os.Build.VERSION.SDK_INT}"
  }
  
  actual fun getPlatform(): Platform = AndroidPlatform()
  ```

* In the `iosMain` source set, you can find the following implementation for iOS:

  ```kotlin
  class IOSPlatform : Platform {
      override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
  }
  
  actual fun getPlatform(): Platform = IOSPlatform()
  ```

Neither the `Platform` interface here nor the `AndroidPlatform` and `IOSPlatform` implementations are actual
declarations. The `getPlatform()` function is the only place where the compiler has to apply the special mechanism of
replacing the expected declaration with an actual one.

If you used a DI framework like Koin, you would instead configure the framework to provide the correct implementation.

## Avoid overusing expect and actuals

The `expect` keyword can be used with most Kotlin constructs, meaning any given problem has multiple solutions. However,
it could lead to overusing the feature, especially during the initial design.

Consider this implementation of the `Identity` type containing the user login name and the process ID. It uses the
mechanism of expect and actual declarations to work on JVM and in native environments like iOS.

The project has the `commonMain`, `jvmMain`, and `nativeMain` source sets:

* The `commonMain` source set declares the `Identity` type with `expect`:

  ```kotlin
  expect class Identity() {
      val userName: String
      val processID: Int
  }
  ```

* `jvmMain` implements a solution using standard Java libraries:

  ```kotlin
  import java.lang.System.getProperty
  import java.lang.ProcessHandle.current
  
  actual class Identity {
      actual val userName: String
      actual val processID: Long
      
      init {
          userName = getProperty("user.name") ?: "none"
          processID = current().pid()
      }
  }
  ```

* `nativeMain` implements a solution using [POSIX](https://en.wikipedia.org/wiki/POSIX):

  ```kotlin
  import kotlinx.cinterop.toKString
  import platform.posix.getlogin
  import platform.posix.getpid
  
  actual class Identity {
      actual val userName: String
      actual val processID: Long
  
  
      init {
          userName = getlogin()?.toKString() ?: "None"
          processID = getpid().toLong()
      }
  }
  ```

This approach works but introduces a lot of complexity; you have to implement the type for every supported platform.

Check out a couple of options on how it can be refactored into something simpler.

### Option 1. Factory functions

A simpler solution is to have a single `Identity` type and encapsulate the platform-specific differences into a factory
function:

1. In `commonMain`, declare a simple type and expect a factory function:

  ```kotlin
  expect fun buildIdentity(): Identity
  
  class Identity(val userName: String, val processID: Long)
  ```

2. Implement the actual function in jvmMain:

  ```kotlin
  // In jvmMain:
  actual fun buildIdentity() = Identity(
          getProperty("user.name") ?: "none",
          current().pid()
      )
  ```
  
3. And in `nativeMain`:
  
  ```kotlin
  // In nativeMain:
  actual fun buildIdentity() = Identity(
      getlogin()?.toKString() ?: "None",
      getpid().toLong()
  )
  ```

This solution is easier to understand and requires less code. As a general rule, try to limit the use of expected and
actual declarations and rely on standard language constructs wherever possible.

## Option 2. Interfaces

In some cases, the previous approach doesn't work. Platform-specific logic could be too big or complex to encapsulate in
a factory function.

If this is the case, you can use standard language constructs, like interfaces:

In `commonMain`, declare the same types as above, but this time, create the `Identity` type with an `IdentityBuilder`
implemented by a factory function:

```kotlin
expect fun identityBuilder(): IdentityBuilder

interface IdentityBuilder {
    fun build(): Identity
}

class Identity(val userName: String, val processID: Long)
```

Create platform-specific implementations of the interface without additional use of `expect` and `actual`:

```kotlin
// In `jvmMain`:
actual fun identityBuilder(): IdentityBuilder = JvmIdentityProvider()

class JvmIdentityBuilder : IdentityBuilder {
    override fun build() = Identity(
        getProperty("user.name") ?: "none",
        current().pid()
    )
}

// In `nativeMain`:
actual fun identityBuilder(): IdentityBuilder = NativeIdentityProvider()

class NativeIdentityBuilder : IdentityBuilder {
    override fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

The `JvmIdentityBuilder` and `NativeIdentityBuilder` types can be expanded as much as required, for example, with helper
functions and supporting types.

### Option 3. Inheritance

There are special cases when using the `expect` keyword with classes is the best approach. Let's say that the `Identity`
type already exists on JVM:

```kotlin
open class Identity {
    val login: String
    val pid: Long


    init {
        login = getProperty("user.name") ?: "none"
        pid = current().pid()
    }
}
```

To fit it in the existing codebase and frameworks, your implementation of the `Identity` type should inherit from this
type and reuse its functionality:

1. To solve this problem, declare a class in `commonMain` using the `expect` keyword:

  ```kotlin
  expect class CommonIdentity() {
      val userName: String
      val processID: Long
  }
  ```

2. In `nativeMain`, provide an actual declaration that implements the functionality:

  ```kotlin
  actual class CommonIdentity {
      actual val userName = getlogin()?.toKString() ?: "None"
      actual val processID = getpid().toLong()
  }
  ```

3. In `jvmMain`, provide an actual declaration that inherits from the platform-specific base class:

  ```kotlin
  actual class CommonIdentity : Identity() {
      actual val userName = login
      actual val processID = pid
  }
  ```

Here, the `CommonIdentity` type is compatible with both your own design and the existing architecture.

## For framework authors

If you're a framework author, you can also find expected and actual declarations useful for your framework.

Imagine that the example above is a part of a framework. The user has to derive a type from `CommonIdentity` to provide
a display name.

In this case, the expected declaration is abstract and declares an abstract method:

```kotlin
// commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

Similarly, actual implementations are abstract as well and declare the `displayName` method:

```kotlin
// nativeMain of the framework codebase:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}

// jvmMain of the framework codebase:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

The framework users then need to write common code that inherits from the expected declaration and implement the missing
method themselves:

```kotlin
// commonMain of the users' codebase:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

You'll end up with the following relationship between declarations:

A similar scheme works in any library that provides a common `ViewModel`. Such a library typically provides an
expected `CommonViewModel` class, whose actual Android counterpart extends the `ViewModel` class from the Android
framework.

When users compile their code, the expected declaration they inherit from is replaced with the actual implementation
corresponding to the current platform. This helps the framework to operate as a multiplatform library.

> Expected and actual declarations provide a powerful mechanism for implementing multiplatform applications that rely on
> platform-specific APIs. You can implement the majority of your codebase in the common module and use expected
> declarations to specify where the compiler should substitute a platform-specific version of a particular function, type,
> and so on.
>
> However, it's important to keep your solution simple. You should only introduce platform-specific types when custom
> types are really necessary on one or more platforms. In most cases, it's best to use a dependency injection framework
> and standard Kotlin interfaces instead of building your own injection mechanism with expected and actual declarations.
>
{type="tip"}

<!-- 
What's next?

Learn about special cases of using expected and actual declarations.
-->