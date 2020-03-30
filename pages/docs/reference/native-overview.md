---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin/Native"
---

# **Kotlin/Native for Native**

![Compiler Diagram]({{ url_for('asset', path='images/landing/native/native_overview.png')}})

Kotlin/Native is a technology for compiling Kotlin code to native binaries, which can run without a virtual machine.
It is an [LLVM](https://llvm.org/) based backend for the Kotlin compiler and native implementation of the Kotlin standard
library.

## Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms where *virtual machines* are not
desirable or possible, for example, embedded devices or iOS.
It solves the situations when a developer needs to produce a 
self-contained program that does not require an additional runtime or virtual machine.

## Target Platforms

Kotlin/Native supports the following platforms:
   * iOS (arm32, arm64, simulator x86_64)
   * macOS (x86_64)
   * watchOS (arm32, arm64, x86)
   * tvOS (arm64, x86_64)
   * Android (arm32, arm64, x86, x86_64)
   * Windows (mingw x86_64, x86)
   * Linux (x86_64, arm32, arm64, MIPS, MIPS little endian)
   * WebAssembly (wasm32)

## Interoperability

Kotlin/Native supports two-way interoperability with the Native world. 
On the one hand, the compiler creates:
- an executable for many [platforms](#target-platforms)
- a static library or [dynamic](/docs/tutorials/native/dynamic-libraries.html) library with C headers for C/C++ projects
- an [Apple framework](/docs/tutorials/native/apple-framework.html) for Swift and Objective-C projects

On the other hand, Kotlin/Native supports interoperability to use existing libraries
directly from Kotlin/Native:
- static or dynamic [C Libraries](/docs/reference/native/c_interop.html)
- C, [Swift, and Objective-C](/docs/reference/native/objc_interop.html) frameworks

It is easy to include a compiled Kotlin code into
existing projects written in C, C++, Swift, Objective-C, and other languages.
It is also easy to use existing native code, 
static or dynamic [C libraries](/docs/reference/native/c_interop.html),
Swift/Objective-C [frameworks](/docs/reference/native/objc_interop.html),
graphical engines, and anything else directly from Kotlin/Native.

Kotlin/Native [libraries](/docs/reference/native/platform_libs.html) help to share Kotlin
code between projects.
POSIX, gzip, OpenGL, Metal, Foundation, and many other popular libraries and Apple frameworks
are pre-imported and included as Kotlin/Native libraries into the compiler package.

## Sharing Code between Platforms

[Multiplatform projects](/docs/reference/multiplatform.html) are supported between different Kotlin and
Kotlin/Native targets.
This is the way to share common Kotlin code between many platforms, including Android, iOS, server-side, JVM, client-side, 
JavaScript, CSS, and native.

[Multiplatform libraries](/docs/reference/multiplatform.html#multiplatform-libraries)
provide the necessary APIs for the common Kotlin code and help to develop
shared parts of a project in Kotlin code once and share it with all of the target platforms. 

## How to Start

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Tutorials and Documentation</b>
</div>

New to Kotlin? Take a look at the [Getting Started](/docs/reference/basic-syntax.html) page.

Suggested documentation pages:
- [C interop](/docs/reference/native/c_interop.html)
- [Swift/Objective-C interop](/docs/reference/native/objc_interop.html)

Recommended tutorials:
- [Hello Kotlin/Native](/docs/tutorials/native/using-command-line-compiler.html)
- [Multiplatform Project: iOS and Android](/docs/tutorials/native/mpp-ios-android.html)
- [Types mapping between C and Kotlin/Native](/docs/tutorials/native/mapping-primitive-data-types-from-c.html)
- [Kotlin/Native as a Dynamic Library](/docs/tutorials/native/dynamic-libraries.html) 
- [Kotlin/Native as an Apple Framework](/docs/tutorials/native/apple-framework.html)

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Example Projects</b>
</div>

- [Kotlin/Native sources and examples](https://github.com/JetBrains/kotlin-native/tree/master/samples) 
- [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) 
- [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner)
- [Kotlin/Native sources and examples (.tgz)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.tar.gz)
- [Kotlin/Native sources and examples (.zip)](https://download.jetbrains.com/kotlin/native/kotlin-native-samples-1.0.1.zip)

Even more examples are on [GitHub](https://github.com/JetBrains/kotlin-examples).

