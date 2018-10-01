---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin/Native"
---

# What is Kotlin/Native?

Kotlin/Native is a technology for compiling Kotlin code to native binaries, which can run without a virtual machine.
It is an [LLVM](https://llvm.org/) based backend for the Kotlin compiler and native implementation of the Kotlin standard
library

# Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms where *virtual machines* are not
desirable or possible, for example, embedded devices or iOS.
It solves the situations when a developer needs to produce a 
self-contained program that does not require an additional runtime or virtual machine.

# Target Platforms

Kotlin/Native supports the following platforms:
   * iOS (arm32, arm64, emulator x86_64)
   * MacOS (x86_64)
   * Android (arm32, arm64)
   * Windows (mingw x86_64)
   * Linux (x86_64, arm32, MIPS, MIPS little endian)
   * WebAssembly (wasm32)

# Interoperability

Kotlin/Native supports two-way interoperability with the Native world. 
On the one hand, the compiler creates:
- an executable for many [platforms](#target-platforms)
- a static library or [dynamic](/docs/tutorials/native/dynamic-libraries.html) library with C headers for C/C++ projects
- an [Apple framework](/docs/tutorials/native/apple-framework.html) for Swift and Objective-C projects

That makes it easy to include compiled Kotlin code into
existing projects written in C, C++, Swift, Objective-C, and other languages.

On the other hand, Kotlin/Native supports interoperability to use existing libraries
directly from Kotlin/Native:
- static or dynamic [C Libraries](/docs/reference/native/c_interop.html) 
- C, [Swift, and Objective-C](/docs/reference/native/objc_interop.html) frameworks 

That makes it easy to use the existing native code, libraries, frameworks, graphical engines, and anything else
directly from Kotlin/Native. Thanks to the Swift and Objective-C Frameworks
[interop](/docs/reference/native/objc_interop.html), it is easy to use
existing frameworks in Kotlin/Native projects.

There are Kotlin/Native [libraries]((/docs/reference/native/platform_libs.html) that help share Kotlin
and native code between projects. Popular platform libraries and Apple frameworks are available as Kotlin/Native
libraries and included with the compiler. It includes POSIX, gzip, OpenGL, Metal, Foundation, and many other
pre-imported libraries

# Sharing Code between Platforms

[Multiplatform projects](/docs/reference/multiplatform.html) are supported between different Kotlin and
Kotlin/Native targets.
This is the way to share common Kotlin code between many platforms, including Android, iOS, server-side, JVM, client-side, 
JavaScript, CSS, and native.

Kotlin multiplatform libraries provide the necessary APIs for the common Kotlin code and help to develop
shared parts of a project in Kotlin code once and share it with all of the target platforms. 

# How to Start

Check out the [tutorials](/docs/tutorials/native/apple-framework.html) or [documentation](/docs/reference/native/multiplatform.html)
for Kotlin/Native.

Like learning from examples? Here are some more example projects: 
 * The [Kotlin/Native GitHub repository](https://github.com/JetBrains/kotlin-native/tree/master/samples) contains sample projects
 * The [KotlinConf app](https://github.com/JetBrains/kotlinconf-app/tree/master/ios) is an iOS app
   with a UIKit-based UI, showcasing the Objective-C interop facilities of Kotlin/Native
 * The [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner) is a simple cross-platform 
   mobile multiplayer game built completely in Kotlin/Native, consisting of the following components:
     - a backend, using SQLite for data storage and exposing a REST/JSON API
     - mobile clients for iOS and Android, using OpenGL
     - a WebAssembly-based browser frontend for viewing the game scores

Check out the [Community](/community/) page too!
