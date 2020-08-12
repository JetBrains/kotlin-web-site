---
type: doc
layout: reference
title: "Connect to platform-specific APIs"
---

# Connect to platform-specific APIs

> The `expect`/`actual` feature is currently in [Beta](evolution/components-stability.html). All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

If you’re developing a multiplatform application that needs to access platform-specific APIs that implement the required 
functionality, use the Kotlin mechanism of *expected and actual declarations*.

With this mechanism, a common source set defines an *expected declaration*, and platform source sets must provide the 
*actual declaration* that corresponds to the expected declaration. This works for most Kotlin declarations, such as 
functions, classes, interfaces, enumerations, properties, and annotations.

![Expect and actual declarations]({{ url_for('asset', path='images/reference/mpp/expect-actual.png') }})
 
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//Common
expect fun randomUUID(): String
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//Android
import java.util.*
actual fun randomUUID() = UUID.randomUUID().toString()
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//iOS
import platform.Foundation.NSUUID
actual fun randomUUID(): String = NSUUID().UUIDString()
```

</div>

Here's another example of code sharing and interaction between the common and platform logic in a minimalistic 
logging framework. 

<div style="display:flex">
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//Common
enum class LogLevel {
    DEBUG, WARN, ERROR
}

internal expect fun writeLogMessage(message: String, logLevel: LogLevel)

fun logDebug(message: String) = writeLogMessage(message, LogLevel.DEBUG)
fun logWarn(message: String) = writeLogMessage(message, LogLevel.WARN)
fun logError(message: String) = writeLogMessage(message, LogLevel.ERROR)
```

</div>
<div style="margin-left: 5px;white-space: pre-line; line-height: 18px; font-family: Tahoma;">
    <div style="display:flex">├<i style="margin-left:5px">compiled for all platforms</i></div>
    <div style="display:flex">├<i style="margin-left:5px">expected platform-specific API</i></div>
    <div style="display:flex">├<i style="margin-left:5px">expected API can be used in the common code</i></div>
</div>
</div>

It expects the targets to provide platform-specific implementations for `writeLogMessage`, and the common code can 
now use this declaration without any consideration of how it is implemented.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//JVM
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

</div>

For JavaScript, a completely different set of APIs is available, and the `actual` declaration will look like this.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//JS
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    when (logLevel) {
        LogLevel.DEBUG -> console.log(message)
        LogLevel.WARN -> console.warn(message)
        LogLevel.ERROR -> console.error(message)
    }
}
```

</div>

The main rules regarding expected and actual declarations are:
* An expected declaration is marked with the `expect` keyword; the actual declaration is marked with the `actual` keyword.
* `expect` and `actual` declarations have the same name and are located in the same package (have the same fully qualified name).
* `expect` declarations never contain any implementation code.

During each platform compilation, the compiler ensures that every declaration marked with the `expect` keyword in the common 
or intermediate source set has the corresponding declarations marked with the `actual` keyword in all platform source sets. 
The IDE provides tools that help you create the missing actual declarations.

If you have a platform-specific library that you want to use in shared code while providing your own implementation for 
another platform, you can provide a `typealias` to an existing class as the actual declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
expect class AtomicRef<V>(value: V) {
    fun get(): V
    fun set(value: V)
    fun getAndSet(value: V): V
    fun compareAndSet(expect: V, update: V): Boolean
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```

</div>

> We recommend that you use expected and actual declarations only for Kotlin declarations that have platform-specific 
> dependencies. It is better to implement as much functionality as possible in the shared module even if doing so takes 
> more time.
> 
> Don’t overuse expected and actual declarations – in some cases, an [interface](interfaces.html) may be a better choice 
> because it is more flexible and easier to test.
{:.note}
