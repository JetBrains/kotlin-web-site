---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin/Native"
---

# What is Kotlin/Native?

Kotlin/Native is a technology for compiling Kotlin code to native binaries, which run without any VM.
It is an [LLVM](https://llvm.org/) based backend for the Kotlin compiler and a native implementation of the Kotlin standard
library

# Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms where *virtual machines* are not
desirable or possible, for example, embedded devices or iOS.
It solves a developer needs to produce a 
self-contained program that does not require an additional runtime or virtual machine.


# Interoperability

Kotlin/Native supports two-way interoperability with the Native world. 
On one hand the compiler creates
- an executable for many [platforms](#target-platforms)
- a static library or [dynamic](/docs/tutorials/native/dynamic-libraries.html) library with C headers for C/C++ projects
- an [Apple framework](/docs/tutorials/native/apple-framework.html) for Swift and Objective-C projects

That makes it easy to include the compiled Kotlin code into
existing projects written in C, C++, Swift, Objective-C, and other languages.

On the other hand, Kotlin/Native supports interoperability to use existing libraries
directly from Kotlin/Native:
- static or dynamic [C Libraries](/docs/reference/native/c_interop.html) 
- C, [Swift, and Objective-C](/docs/reference/native/objc_interop.html) frameworks 

That makes it easy to use an existing native code, libraries, frameworks, graphical engines, or anything else
directly from Kotlin/Native. Thanks to the Swift and Objective-C Frameworks
[interop](/docs/reference/native/objc_interop.html), one may easily use
existing frameworks in their Kotlin/Native projects.

Popular platform libraries and Apple frameworks are available with the compiler out of the box. 

# Target Platforms

Kotlin/Native supports the following platforms:
   * iOS (arm32, arm64, emulator x86_64)
   * MacOS (x86_64)
   * Android (arm32, arm64)
   * Windows (mingw x86_64)
   * Linux (x86_64, arm32, MIPS, MIPS little endian)
   * WebAssembly (wasm32)

# Libraries

There are libraries for Kotlin/Native. That is the way to easily share common
Kotlin/Native code between projects. A [klib](/docs/reference/native/platform_libs.html)
library includes metadata and binary part for selected platforms.
There are several popular Kotlin/Native libraries:

- Kotlin stdlib
- [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/native/README.md)
- [kotlinx.io](https://github.com/Kotlin/kotlinx-io)
- [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
- [ktor](https://ktor.io/)
- [ktor-http-client](https://ktor.io/clients/http-client.html)

Popular platform libraries and Apple frameworks are available with the compiler out of the box.
It includes POSIX, gzip, OpenGL, Metal, Foundation and many more pre-imported libraries. 

# Sharing Code with Other Platforms

Most of the projects targeting to a set of platforms: Android, iOS, server-side, JVM, client-side, JavaScript, CSS, native.
With Kotlin/Native and Kotlin multiplatform projects, you may easily re-use Kotlin code between all those platforms. 
See [__TODO___MULTIPLATFORM__LINK__](#) for more details to take a look at the [iOS and Android application tutorial].

# How to Start?

Check out [tutorials](/docs/tutorials/native/apple-framework.html) or [documentation](/docs/reference/native/multiplatform.html)
for Kotlin/Native.

Do you like to learn by example? There are example projects for you: 
 * The [Kotlin/Native GitHub repository](https://github.com/JetBrains/kotlin-native/tree/master/samples) contains a number of sample projects;
 * The [KotlinConf app](https://github.com/JetBrains/kotlinconf-app/tree/master/ios) is an iOS app
   with a UIKit-based UI, showcasing the Objective-C interop facilities of Kotlin/Native.
 * The [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner) is a simple cross-platform 
   mobile multiplayer game fully built in Kotlin/Native, consisting of the following components:
     - a backend, using SQLite for data storage and exposing a REST/JSON API;
     - mobile clients for iOS and Android, using OpenGL;
     - a WebAssembly-based browser frontend for viewing the game scores.

Still have questions? Check out the [Community](/community/) page for more info
