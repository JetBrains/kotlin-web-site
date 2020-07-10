---
type: doc
layout: reference
category: "Other"
title: "Multiplatform Projects"
---

# Multiplatform Programming

> Multiplatform projects are an experimental feature in Kotlin 1.2 and 1.3. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

Working on all platforms is an explicit goal for Kotlin, but we see it as a premise to a much more important 
goal: sharing code between platforms. With support for JVM, Android, JavaScript, iOS, Linux, Windows, 
Mac and even embedded systems like STM32, Kotlin can handle any and all components of a modern application. 
And this brings the invaluable benefit of reuse for code and expertise, saving the effort for tasks more 
challenging than implementing everything twice or multiple times.

## How it works

Overall, multiplatform is not about compiling all code for all platforms. This model has its obvious 
limitations, and we understand that modern applications need access to unique features of the platforms 
they are running on. Kotlin doesn't limit you to the common subset of all APIs in the world. 
Every component can share as much code as needed with others but can access platform APIs at any time 
through the [`expect`/`actual` mechanism](platform-specific-declarations.html) provided by the language. 

Here's an example of code sharing and interaction between the common and platform logic in a minimalistic 
logging framework. The common code would look like this:

<div style="display:flex">
<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
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

On the JVM, one could provide an implementation that writes the log to the standard output:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    println("[$logLevel]: $message")
}
```

</div>

In the JavaScript world, a completely different set of APIs is available, 
so one could instead implement logging to the console:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
internal actual fun writeLogMessage(message: String, logLevel: LogLevel) {
    when (logLevel) {
        LogLevel.DEBUG -> console.log(message)
        LogLevel.WARN -> console.warn(message)
        LogLevel.ERROR -> console.error(message)
    }
}
```

</div>

In 1.3 we reworked the entire multiplatform model. The [new DSL](building-mpp-with-gradle.html) we have for describing multiplatform Gradle 
projects is much more flexible, and we'll keep working on it to make project configuration straightforward.

## Multiplatform Libraries

Common code can rely on a set of libraries that cover everyday tasks such as [HTTP](http://ktor.io/clients/http-client/multiplatform.html), [serialization](https://github.com/Kotlin/kotlinx.serialization), and [managing 
coroutines](https://github.com/Kotlin/kotlinx.coroutines). Also, an extensive standard library is available on all platforms. 

You can always write your 
own library providing a common API and implementing it differently on every platform.

## Use cases

### Android — iOS

Sharing code between mobile platforms is one of the major Kotlin Multiplatform use cases, and it is now 
possible to build mobile applications with parts of the code, such as business logic, connectivity, 
and more, shared between Android and iOS.

See: 
- [Mobile Multiplatform features, case studies and examples](https://www.jetbrains.com/lp/mobilecrossplatform/)
- [Setting up a Mobile Multiplatform Project](/docs/tutorials/native/mpp-ios-android.html)

### Client — Server

Another scenario when code sharing may bring benefits is a connected application where the logic may be 
reused on both the server and the client side running in the browser. This is covered by Kotlin 
Multiplatform as well.

The [Ktor framework](https://ktor.io/) is suitable for building asynchronous servers and clients in connected systems.

## How to start

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Tutorials and Documentation</b>
</div>

New to Kotlin? Take a look at the [Getting Started](/docs/reference/basic-syntax.html) page.

Suggested documentation pages: 
- [Setting up a Multiplatform Project](building-mpp-with-gradle.html#setting-up-a-multiplatform-project) 
- [Platform-Specific Declarations](platform-specific-declarations.html) 

Recommended tutorials:
- [Multiplatform Kotlin Library](/docs/tutorials/mpp/multiplatform-library.html)
- [Multiplatform Project: iOS and Android](/docs/tutorials/native/mpp-ios-android.html)
  
<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Example Projects</b>
</div>

- [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) 
- [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner)

Even more examples are on [GitHub](https://github.com/JetBrains/kotlin-examples)
