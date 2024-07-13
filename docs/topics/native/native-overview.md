[//]: # (title: Kotlin Native)

Kotlin/Native is a technology for compiling Kotlin code to native binaries which can run without a virtual machine.
Kotlin/Native includes an [LLVM](https://llvm.org/)-based backend for the Kotlin compiler and a native implementation of the Kotlin standard
library.

## Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms on which _virtual machines_ are not
desirable or possible, such as embedded devices or iOS.
It is ideal for situations when a developer needs to produce a
self-contained program that does not require an additional runtime or virtual machine.

## Target platforms

Kotlin/Native supports the following platforms:
* macOS
* iOS, tvOS, watchOS
* Linux
* Windows (MinGW)
* Android NDK

> To compile Apple targets, macOS, iOS, tvOS, and watchOS, you need [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
> and its command-line tools installed.
> 
{style="note"}

[See the full list of supported targets](native-target-support.md).

## Interoperability

Kotlin/Native supports two-way interoperability with native programming languages for different operating systems.
The compiler creates:
* an executable for many [platforms](#target-platforms)
* a static library or [dynamic](native-dynamic-libraries.md) library with C headers for C/C++ projects
* an [Apple framework](apple-framework.md) for Swift and Objective-C projects

Kotlin/Native supports interoperability to use existing libraries
directly from Kotlin/Native:
* static or dynamic [C libraries](native-c-interop.md)
* C, [Swift, and Objective-C](native-objc-interop.md) frameworks

It is easy to include compiled Kotlin code in
existing projects written in C, C++, Swift, Objective-C, and other languages.
It is also easy to use existing native code,
static or dynamic [C libraries](native-c-interop.md),
Swift/Objective-C [frameworks](native-objc-interop.md),
graphical engines, and anything else directly from Kotlin/Native.

Kotlin/Native [libraries](native-platform-libs.md) help share Kotlin
code between projects.
POSIX, gzip, OpenGL, Metal, Foundation, and many other popular libraries and Apple frameworks
are pre-imported and included as Kotlin/Native libraries in the compiler package.

## Sharing code between platforms

[Kotlin Multiplatform](multiplatform-intro.md) helps share common code across multiple platforms, including Android, iOS, JVM,
web, and native. Multiplatform libraries provide the necessary APIs for common Kotlin code and allow writing shared parts
of projects in Kotlin all in one place.

You can use the [Create a Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) tutorial
to create applications and share business logic between iOS and Android. To share UIs among iOS, Android, desktop, and web,
use tutorial for [Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html),
JetBrains' declarative UI framework based on Kotlin and [Jetpack Compose](https://developer.android.com/jetpack/compose).

## How to get started

New to Kotlin? Take a look at [Getting started with Kotlin](getting-started.md).

Recommended documentation:

* [Introduction to Kotlin Multiplatform](multiplatform-intro.md)
* [Interoperability with C](native-c-interop.md)
* [Interoperability with Swift/Objective-C](native-objc-interop.md)

Recommended tutorials:

* [Get started with Kotlin/Native](native-get-started.md)
* [Create a Kotlin Multiplatform app](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* [Mapping primitive data types from C](mapping-primitive-data-types-from-c.md)
* [Kotlin/Native as a dynamic Library](native-dynamic-libraries.md)
* [Kotlin/Native as an Apple framework](apple-framework.md)
