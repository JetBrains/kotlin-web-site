---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin/Native"
---

# Kotlin/Native

[Kotlin/Native](https://github.com/JetBrains/kotlin-native/) is a technology for compiling Kotlin to native binaries that run without any VM.
It comprises a LLVM-based backend for the Kotlin compiler and a native implementation of the Kotlin runtime
library. Kotlin/Native is primarily designed to allow compilation for platforms where virtual machines 
are not desirable or possible (such as iOS, embedded targets), or where a developer needs to produce 
a reasonably-sized self-contained program that does not require an additional runtime.

Kotlin/Native fully supports interoperability with native code. For platform libraries, the corresponding
interop libraries are available out of the box. For other libraries, we provide a 
[tool to generate an interop library](https://github.com/JetBrains/kotlin-native/blob/master/INTEROP.md) 
from a C header file, with full support for all C language features. 
On macOS and iOS, interoperability with Objective-C code is also supported.

Kotlin/Native is currently in development; preview releases are available for you to try. IDE support
for Kotlin/Native is available as plugins for [CLion](https://www.jetbrains.com/clion/) and [AppCode](https://www.jetbrains.com/objc/), both require the plugin to be installed via *Plugins | Install JetBrains plugin...* in the IDE preferences.

### Target Platforms

Kotlin/Native currently supports the following platforms:

   * Windows (x86_64 only at the moment)
   * Linux (x86_64, arm32, MIPS, MIPS little endian)
   * MacOS (x86_64)
   * iOS (arm32 and arm64)
   * Android (arm32 and arm64)
   * WebAssembly (wasm32 only)

### Sample Projects

We've built a number of sample projects to showcase the possibilities of Kotlin/Native:

 * The [Kotlin/Native GitHub repository](https://github.com/JetBrains/kotlin-native/tree/master/samples) contains a number of sample projects;
 * The [KotlinConf Spinner app](https://github.com/jetbrains/kotlinconf-spinner) is a simple cross-platform 
   mobile multiplayer game fully built in Kotlin/Native, consisting of the following components:
     - a backend, using SQLite for data storage and exposing a REST/JSON API;
     - mobile clients for iOS and Android, using OpenGL;
     - a WebAssembly-based browser frontend for viewing the game scores.
 * The [KotlinConf app](https://github.com/JetBrains/kotlinconf-app/tree/master/ios) is an iOS app
   with a UIKit-based UI, showcasing the Objective-C interop facilities of Kotlin/Native.

       


