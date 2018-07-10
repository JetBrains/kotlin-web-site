---
type: tutorial
layout: tutorial
title:  "Targeting Multiple Platforms"
description: "Compiling with Kotlin/Native for different platforms"
authors: Eugene Petrenko
date: 2018-07-10
showAuthorInfo: false
issue: EVAN-5121
---

With Kotlin/Native we are able to target to 
the following platforms, including (as of Kotlin/Native v0.8): 
- Windows (x86_64),
- Linux (x86_64, arm32, MIPS, MIPS little endian),
- MacOS (x86_64),
- iOS (arm32, arm64, x64),
- Android (arm32, arm64),
- STM32
- WebAssembly (wasm32).

In this tutorial, we'll see how to

* [Specify a Target Platform](#specifying-target-platform)
* [Build for a Specific Platform](#building-for-a-specific-platform)
* [Build a Console Utility for several OSes](#building-a-console-utility)

We need to have Kotlin/Native compiler on our machines. 
The step is already covered in 
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#obtaining-the-compiler)
tutorial.
Let's assume we have a console, where `kotlinc` (or the older `konanc`) command is available. 

## Specifying Target Platform

The list of supported target platforms of `kotlinc` depends 
on the operating system where you run it. We may list them via 

```bash
kotlinc -list_targets
```

command. For example, on macOS X with Kotlin/Native v0.8:
```
> kotlinc -list_targets
macos_x64:                    (default) macbook, macos, imac
ios_arm32:                              iphone32
ios_arm64:                              iphone, ipad, ios
ios_x64:                                iphone_sim
android_arm32:
android_arm64:
wasm32:
zephyr_stm32f4_disco:
```

For Linux with Kotlin/Native v0.8 we have:

```
> kotlinc -list_targets
linux_x64:                    (default) linux
linux_arm32_hfp:                        raspberrypi
linux_mips32:
linux_mipsel32:
android_arm32:
android_arm64:
wasm32:
zephyr_stm32f4_disco:
```

On Windows with Kotlin/Native v0.8 it shows:
```
> kotlinc -list_targets
mingw_x64:                    (default) mingw
wasm32:
zephyr_stm32f4_disco:
```

The set of targets of Kotlin/Native compiler depends on the host operation system.
We may specify target explicitly with `-target <name>` argument. The default target 
is highlighted with `(default)` and used if no `-target` argument was 
specified.

## Building for a Specific Platform

Let's create a sample Kotlin/Native program and save it as `main.kt`. You may see the previous tutorial 
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html#creating-hello-kotlin) for more details.

```kotlin
fun main(args: Array<String>) {
  println("Hello Kotlin/Native!")
}
```

We use `-target` argument of the `kotlinc` to specify the platform. It is also 
helpful to use `-output` to clearly instruct
the compiler on where to create the compiled binary, e.g. to build for iOS emulator on macOS we use:

```bash
    kotlinc -target ios_x64 -output bin/ios_x64 main.kt
``` 

We use the command 
```bash
    kotlinc -target ios_arm64 -output bin/ios_arm64 main.kt
```
to create a binary for fresh iPhone supporting arm64. 

## Building a Console Utility

We saw above that the set of supported target platforms depends on the host operation system. 
It is required to run the compiler on Windows, macOS and Linux to create a console application 
for those OSes. So on each of the operation systems we call the compiler:

```bash
    kotlinc main.kt
```

There is no need to specify `-target` parameter explicitly, because 
the default value will work the best on every OS. 
A [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration)
may be used to automate and simplify the process. 

## Next Steps

Build tools helps to deal with compiler arguments. You may probably 
like using [Gradle build system](gradle-for-kotlin-native.html) for your project. 
Gradle with Kotlin/Native plugin simplify the setup for every operating system, download and run 
Kotlin/Native compiler for you easier. 

