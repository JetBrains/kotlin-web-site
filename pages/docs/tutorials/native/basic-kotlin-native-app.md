---
type: tutorial
layout: tutorial
title:  "A Basic Kotlin/Native Application"
description: "A look at how to compile our first Kotlin/Native application"
authors: Hadi Hariri 
date: 2017-12-03
showAuthorInfo: false
---


In this tutorial we'll see how to

* [Obtain the Kotlin/Native compiler](#obtaining-the-compiler)
* [Write the application](#creating-hello-kotlin)
* [Compile and examine output](#compiling-and-examining-output)
* [Run the application](#running-the-application)


## Obtaining the compiler

Kotlin/Native is available for macOS, Linux and Windows. Depending on the operating system we're working on, we'll need to download
the correct compiler. While cross-platform compilation is possible (i.e. using one platform to compile for another), in this first tutorial
we're going to compile for the same operating system we're running on. In our case this will be macOS. 

We can obtain the latest version of the compiler from the [GitHub releases page](https://github.com/JetBrains/kotlin-native/releases).

Once downloaded, we can uncompress it in any folder, e.g. ~/kotlin-native. For convenience it's useful to add the `bin` folder to the system path so that we can invoke the 
compiler from any location. If we uncompressed to ~/kotlin-native, this would be ~/kotlin-native/bin) 

While the output by the compiler does not have any dependencies, the compiler itself does require Java 8, which should be on the system. If we're using macOS, we also need the macOS SDK which can be installed by installing Xcode. 

## Creating Hello Kotlin

Our first application is going to simply print some text on the standard output. In our case, this will be "Hello Kotlin/Native"
 
We can open up our favorite IDE or editor and write the following code in a file named `hello.kt` 

<div class="sample" markdown="1" theme="idea">
```kotlin
fun main(args: Array<String>) {
    println("Hello Kotlin/Native!")
}
```
</div>

## Compiling and examining output 

The Kotlin compiler uses a technology known as [LLVM](https://en.wikipedia.org/wiki/LLVM) to target multiple platforms. LLVM requires as input what's know as intermediate representation or IR. This IR is
represented by a bitcode file, which is a bitstream file format. 

![Compiler Diagram]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/llvm-diagram.png')}})


We now need to compile our application, which is done using the compiler downloaded in the first step. If we have the `bin` folder
correctly added to the path, we should be able to invoke the compiler using

    kotlinc-native hello.kt

which is telling the compiler to compile the source code `hello.kt`.

The first time the compiler runs, it downloads a list of necessary requirements, thus first run does take longer. If everything runs correctly, the output 
should be `hello.kexe`

The file is the actual binary produced for our target platform. The compiler provides us with a series of options, one of these
being the ability to specify the output filename. In order to do this, we can use the -output (or -o) option

    kotlinc-native -o first hello.kt

which would produce `first.kexe`

The extension cannot be set and is determined based on the target platform, but we can of course rename the executable to anything we like, using 
the usual system commands to rename files.

## Running the application

To run the application, we can merely invoke it

    /hello.kexe

It's important to understand that this is now a native application, and no runtime or virtual machine is required. The output should be

```
Hello Kotlin/Native!
```




