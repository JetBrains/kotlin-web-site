[//]: # (title: Connect to platform-specific APIs)

> The `expect`/`actual` feature is in [Beta](components-stability.md). It is almost stable, but migration steps may be required in the future.
> We'll do our best to minimize any changes you will have to make.
>
{type="warning"}

If you’re developing a multiplatform application that needs to access platform-specific APIs that implement the required 
functionality, use the Kotlin mechanism of _expected and actual declarations_.

With this mechanism, a common source set defines an _expected declaration_, and platform source sets must provide the 
_actual declaration_ that corresponds to the expected declaration. This works for most Kotlin declarations, such as 
functions, classes, interfaces, enumerations, properties, and annotations.

![Expect and actual declarations](expect-actual.png)

```kotlin
// Common
expect fun randomUUID(): String
```

```kotlin
// Android
import java.util.*
actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// iOS
import platform.Foundation.NSUUID
actual fun randomUUID(): String = NSUUID().UUIDString()
```

Here's another example of code sharing and interaction between the common and platform logic in a minimalistic 
logging framework. 

```kotlin
// Common
enum class LogLevel {
    DEBUG, WARN, ERROR
}

internal expect fun writeLogMessage(message: String, logLevel: LogLevel) 

fun logDebug(message: String) = writeLogMessage(message, LogLevel.DEBUG)
fun logWarn(message: String) = writeLogMessage(message, LogLevel.WARN)
fun logError(message: String) = writeLogMessage(message, LogLevel.ERROR)
```

```kotlin
// JVM
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

For JavaScript, a completely different set of APIs is available, and the `actual` declaration will look like this.

```kotlin
// JS
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    when (logLevel) {
        LogLevel.DEBUG -> console.log(message)
        LogLevel.WARN -> console.warn(message)
        LogLevel.ERROR -> console.error(message)
    }
}
```

## Rules for expected and actual declarations

The main rules regarding expected and actual declarations are:
* An expected declaration is marked with the `expect` keyword; the actual declaration is marked with the `actual` keyword.
* `expect` and `actual` declarations have the same name and are located in the same package (have the same fully qualified name).
* `expect` declarations never contain any implementation code.

During each platform compilation, the compiler ensures that every declaration marked with the `expect` keyword in the common 
or intermediate source set has the corresponding declarations marked with the `actual` keyword in all platform source sets. 
The IDE provides tools that help you create the missing actual declarations.

If you have a platform-specific library that you want to use in shared code while providing your own implementation for 
another platform, you can provide a `typealias` to an existing class as the actual declaration:

```kotlin
expect class AtomicRef<V>(value: V) {
    fun get(): V
    fun set(value: V)
    fun getAndSet(value: V): V
    fun compareAndSet(expect: V, update: V): Boolean
}
```

```kotlin
actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```

> Use expected and actual declarations only for Kotlin declarations that have platform-specific 
> dependencies. It is better to implement as much functionality as possible in the shared module even if doing so takes 
> more time.
> 
> Don’t overuse expected and actual declarations – in some cases, an [interface](interfaces.md) may be a better choice 
> because it is more flexible and easier to test.
>
{type="note"}