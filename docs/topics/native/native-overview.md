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

[The full list of supported targets is available here](mpp-supported-platforms.md).


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

[Multiplatform projects](multiplatform.md) allow sharing common Kotlin code between multiple platforms, including Android, iOS, JVM, JavaScript, and native.
Multiplatform libraries provide required APIs for common Kotlin code and help develop shared parts of a project in
Kotlin in one place and share it with some or all target platforms.

You can use [Kotlin Multiplatform Mobile (KMM)](https://kotlinlang.org/lp/mobile/) to create multiplatform mobile applications with code shared between Android and iOS.

## How to get started

### Tutorials and documentation

New to Kotlin? Take a look at [Getting started with Kotlin](getting-started.md).

Recommended documentation:
* [Kotlin Multiplatform Mobile documentation](kmm-getting-started.md)
* [Multiplatform documentation](mpp-intro.md)
* [C interop](native-c-interop.md)
* [Swift/Objective-C interop](native-objc-interop.md)

Recommended tutorials:
* [Get started with Kotlin/Native](native-get-started.md)
* [Create your first KMM application](kmm-create-first-app.md)
* [Types mapping between C and Kotlin/Native](mapping-primitive-data-types-from-c.md)
* [Kotlin/Native as a Dynamic Library](native-dynamic-libraries.md)
* [Kotlin/Native as an Apple Framework](apple-framework.md)

## Sample projects

* [Kotlin Multiplatform Mobile samples](kmm-samples.md)
* [Kotlin/Native sources and examples](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/samples)
* [KotlinConf app](https://github.com/JetBrains/kotlinconf-app)
* [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner)
* [Kotlin/Native sources and examples (.tgz)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.tar.gz)
* [Kotlin/Native sources and examples (.zip)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.zip)