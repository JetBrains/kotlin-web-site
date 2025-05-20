[//]: # (title: Kotlin/Native)

Kotlin/Native is a technology for compiling Kotlin code to native binaries that can run without a virtual machine.
Kotlin/Native includes an [LLVM](https://llvm.org/)-based backend for the Kotlin compiler and a native implementation of
the Kotlin standard library.

## Why Kotlin/Native?

Kotlin/Native is primarily designed to allow compilation for platforms on which _virtual machines_ are not desirable or
possible, such as embedded devices or iOS. It's ideal for situations when you need to to produce a self-contained
program that doesn't require an additional runtime or a virtual machine.

It's easy to include compiled Kotlin code in existing projects written in C, C++, Swift, Objective-C, and other languages.
You can also use existing native code, static or dynamic C libraries, Swift/Objective-C frameworks, graphical engines,
and anything else directly from Kotlin/Native.

<a href="native-get-started.md"><img src="native-get-started-button.svg" width="350" alt="Get started with Kotlin/Native" style="block"/></a>

## Target platforms

Kotlin/Native supports the following platforms:

* Linux
* Windows (through [MinGW](https://www.mingw-w64.org/))
* [Android NDK](https://developer.android.com/ndk)
* Apple targets for macOS, iOS, tvOS, and watchOS

  > To compile Apple targets, you need to install [Xcode](https://apps.apple.com/us/app/xcode/id497799835)
  > and its command-line tools.
  >
  {style="note"}

[See the full list of supported targets](native-target-support.md).

## Interoperability

Kotlin/Native supports two-way interoperability with native programming languages for different operating systems.
The compiler can create executables for many platforms, static or dynamic C libraries, and Swift/Objective-C frameworks.

### Interoperability with C

Kotlin/Native provides [interoperability with C](native-c-interop.md). You can use existing C libraries directly from
Kotlin code.

To learn more, complete the following tutorials:

* [Create a dynamic library with C headers for C/C++ projects](native-dynamic-libraries.md)
* [Learn how C types are mapped into Kotlin](mapping-primitive-data-types-from-c.md)
* [Create a native HTTP client using C interop and libcurl](native-app-with-c-and-libcurl.md)

### Interoperability with Swift/Objective-C

Kotlin/Native provides [interoperability with Swift through Objective-C](native-objc-interop.md). You can use
Kotlin code directly from Swift/Objective-C applications on macOS and iOS.

To learn more, complete the [Kotlin/Native as an Apple framework](apple-framework.md) tutorial.

## Sharing code between platforms

Kotlin/Native includes a set of prebuilt [platform libraries](native-platform-libs.md) that help share Kotlin code
between projects. POSIX, gzip, OpenGL, Metal, Foundation, and many other popular libraries and Apple frameworks
are pre-imported and included as Kotlin/Native libraries in the compiler package.

Kotlin/Native is a part of the [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) technology that helps share common code
across multiple platforms, including Android, iOS, JVM, web, and native. Multiplatform libraries provide the necessary
APIs for common Kotlin code and allow writing shared parts of projects in Kotlin all in one place.

## Memory manager

Kotlin/Native uses an automatic [memory manager](native-memory-manager.md) that is similar to the JVM and Go.
It has its own tracing garbage collector, which is also integrated with Swift/Objective-C's ARC.

The memory consumption is controlled by a custom memory allocator. It optimizes memory usage and helps prevent sudden
surges in memory allocation.