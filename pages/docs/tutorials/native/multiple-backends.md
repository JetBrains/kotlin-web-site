---
type: tutorial
layout: tutorial
title:  "Targeting different platforms with Kotlin/Native"
description: "Compiling the same code for Windows, Linux and Mac"
authors: Eugene Petrenko
date: 2018-03-30
showAuthorInfo: false
## /*EVAN-5121*/
---

#Targeting Different Platforms with Kotlin/Native

Kotlin/Native supports compiling code for different platforms including
Linux, Windows, macOS, Android, iPhone, Raspberri Pi, STM32 and Web Assembly.
In this tutorial we'll see how to

* [Specify a Target Platform](#specifying-target-platform)
* [Build a Commandline Utility for all OS](#building-a-console-utility)

To start with you need to have Kotlin/Native compiler on your machine. Check out to the 
[A Basic Kotlin/Native Application](basic-kotlin-native-app.md) tutorial for the instructions.

## Specifying Target Platform

The list of supported target platforms of `kotlinc` depends 
on your host operation system. You may list them via `konanc -list_targets`
console command. For example, on macOS with Kotlin/Native 0.6.2 you'll have the following:
```
> konanc -list_targets
macbook:                      (default)
iphone:
iphone_sim:
android_arm32:
android_arm64:
wasm32:
zephyr_stm32f4_disco:
```

**TODO**: include Windows and Linux hosts ouptut too.

The default target is highlighted with `(default)` and used if no `-target` argument was 
specified.

Let's create a sample Kotlin program and save it as `main.kt`
```kotlin
fun main(args: Array<String>) {
  println("Hello Kotlin/Native!")
}
```

We use `-target` argument of the `konanc` to specify the platform. It is also 
helpful to use `-output` to clearly 
instruct the compiler on where to create the compiled binary. 

```
> konanc -target iphone_sim -output bin/iphone_sim main.kt
```

## Building a Console Utility

To create a command line utility for all 
operation system, namely Windows, Linux and macOS we 
need to call Kotlin/Native compiler on every of OS:

    konanc main.kt
    
There is no need to specify `-target` parameter explicitly, because 
the default value will work the best.  

[Gradle build system](gradle-for-kotlin-native.md) helps to simplify
the setup for every OS. You may consider using it for bigger projects.

