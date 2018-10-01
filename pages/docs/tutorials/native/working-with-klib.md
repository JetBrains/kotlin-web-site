---
type: tutorial
layout: tutorial
title:  "Working with Kotlin/Native Libraries"
description: "A look at how to work with Kotlin/Native libraries"
authors: Hadi Hariri 
date: 2018-01-22
showAuthorInfo: false
---


In this tutorial we'll see

* [What is a Kotlin/Native Libary](#what-is-kotlinnative-library)
* [How to create a Kotlin/Native Library](#creating-a-kotlinnative-libraries)
* [How to consume Kotlin/Native libraries](#consuming-a-kotlinnative-library)
* [How to use and create library repositories](#using-and-creating-library-repositories)


## What is Kotlin/Native Library

The concept of a library, a collection of functions and other resources such as images, to be used by applications is available in Kotlin/Native and it is represented
as a file with the extension `klib`. Kotlin/Native libraries are artifacts that are only available at compile time, i.e. we do not ship these as dependencies to our application
(as we would for instance with DLL files on the Windows platform).

A `klib` file is a compressed archive in zip format with the specific layout. See
the [reference](https://github.com/JetBrains/kotlin-native/blob/master/LIBRARIES.md#the-library-format) for details.
 
## Creating a Kotlin/Native Libraries

There are two ways we can create a Kotlin/Native library. The first and most common way is to use the Kotlin compiler. Let's assume
we create a small library called `utils.kt` which contains the following two functions

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package utils

fun printMessage(message: String) {
    println("Message: $message")
}

fun printWarning(warning: String) {
    println("Warning: $warning")
}
```
</div>

To create a library from this file, we can use the compiler with the parameter `-produce library` or `-p library` for short:

```bash
kotlinc-native utils.kt -p library
```
By default, the output of the filename is `library.klib`. We can override it using the `-output` or `-o` parameter:

```bash
kotlinc-native utils.kt -p library -o utils
```

The second way to create a library is using the `cinterop` tool which allows us to create a Kotlin/Native library from an existing
C library. See the [Interop with C tutorial](interop-with-c.html) on how to accomplish this.
 
## Consuming a Kotlin/Native Library

Now that we have our library, we can use it in our application. In our case this is a simple file named `sample.kt` with the following contents:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only="1" auto-indent="false">

```kotlin
import utils.printWarning

fun main(args: Array<String>) {
    printWarning("App is about to shut down!")
}
```
</div>

Notice how we need to import the necessary package from the library on the first line using the `import` statement. 

In order for the compiler to correctly link in the library, we need to pass the library name using the `-library` or `-l` parameter

```bash
kotlinc-native sample.kt -l utils
```
    
This would then produce a single executable file with no runtime dependencies.    
    
## Using and creating library repositories

Often it is useful to use the same library across multiple applications. To avoid having various copies of the same library, the Kotlin
compiler can search for libraries in what's called a library repository. The default repository is usually installed under the folder `~/konanc/klib` and we can 
add and remove our own libraries with a utility named `klib` that ships as part of the compiler tools.  

### Installing libraries to the default repository

The easiest way to install a library so that it can be later referenced by any application is to use `klib` with the following command:

```bash
klib install utils
```
    
This will copy and extract the necessary files to the proper locations in the default library folder, allowing us to then compile our application and link 
a specific library without needing to have the `klib` file in the project folder:

```bash
kotlinc-native sample.kt -l utils
```

We can of course also uninstall libraries at any point by issuing the command:

```bash
klib remove utils
```

### Installing libraries to custom repositories

In addition to using the default repository, we can also have libraries stored in custom repositories, which can be useful for instance
if we want to share libraries amongst a group of projects.

In order to do this, we can once again use the command `klib`: 

```bash
klib install utils -repository jetbrains
```
    
but this time adding the parameter `-repository` with the value `jetbrains`. This installs the `utils` library into a custom repository located in a subdirecty named `jetbrains` relative to where we execute the command. For instance if our project is located under the directory `/home/kotlin/projects/`, the above command would install the library to the directory `/home/kotlin/projects/jetbrains/utils`. 


For more information about the commands available for `klib` as well as the sequence when searching for libraries, please see the [README](/docs/reference/native/libraries.html#advanced-topics)


