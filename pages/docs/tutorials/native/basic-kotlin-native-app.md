---
type: tutorial
layout: tutorial
title:  "A Basic Kotlin/Native Application"
description: "A look at how to compile our first Kotlin/Native application"
authors: 
  - Hadi Hariri
  - Eugene Petrenko 
date: 2019-04-01
showAuthorInfo: false
---


In this tutorial, we'll see how to

* [Obtain the Kotlin/Native compiler](#obtaining-the-compiler)
* [Write the application](#creating-hello-kotlin)
* [Compile the code](#compiling-the-code)
* [Run the application](#running-the-application)


## Obtaining the compiler

Kotlin/Native is available for macOS, Linux and Windows. Depending on the operating system we're working on, we'll need to download
the correct compiler. While cross-platform compilation is possible (i.e. using one platform to compile for another), in this first tutorial
we're going to compile for the same operating system we're running on. 

The best way to use Kotlin/Native compiler is to rely on
Gradle build system and use the [kotlin-multiplatform](../reference/building-mpp-with-gradle.html) Gradle plugin.
The build configuration helps to download Kotlin/Native compiler binaries, caches the binaries, 
configure Kotlin/Native compiler call and run the compiler, cache compilation results. It also provides IDE support.

We may still obtain the latest version of the Kotlin/Native compiler manually from the
[GitHub releases page](https://github.com/JetBrains/kotlin-native/releases). In the tutorial we will focus on using
Gradle builds instead of the command line. 

While the output by the compiler does not have any dependencies, the compiler itself and Gradle build system
require [Java](https://java.sun.com) 8 (or newer),
which should be on the system.
On a macOS we also need the macOS SDK which can be installed by installing Xcode.

## Kotlin/Native IDE support
There are several IDEs from JetBrains that provides first-level support for Kotlin/Native:

|IDE|Type|Remark|
|---|----|----|
| [IntelliJ IDEA Community Edition](https://jetbrains.com/idea) | Free | Kotlin plugin is bundled |
| [IntelliJ IDEA Ultimate Edition](https://jetbrains.com/idea) | Commercial | Kotlin plugin is bundled |
| [CLion](https://jetbrains.com/clion) | Commercial | Install [Kotlin/Native for CLion](https://plugins.jetbrains.com/plugin/10454-kotlin-native-for-clion) plugin |
| [AppCode](https://jetbrains.com/clion) | Commercial | Install [Kotlin/Native for AppCode](https://plugins.jetbrains.com/plugin/10619-kotlin-native-for-appcode) plugin |
{:.zebra}


IntelliJ IDEA Community and Ultimate editions comes with bundled Kotlin plugin and it supports opening
Kotlin/Native projects out of the box.
For advanced scenarios like C, Swift and Objective-C support, native debugger, one may use
[CLion](https://jetbrains.com/clion) or 
[AppCode](https://jetbrains.com/appcode). AppCode also provides Xcode integration
for Kotlin/Native and Objective-C/Swift projects.

## Creating Hello Kotlin

Our first application is going to simply print some text on the standard output. In our case, this will be "Hello Kotlin/Native"
 
We can open up our favorite IDE or editor and write the following code in a file named `hello.kt` 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main(args: Array<String>) {
    println("Hello Kotlin/Native!")
}
```
</div>

## Compiling the code 

The manual way to compile the application is to call the download compiler command to generate
`hello.kexe` (Linux and macOS) or `hello.exe` (windows)
binary file for you:

```bash
kotlinc-native hello.kt
```

It requires few more efforts to start with a Gradle project builds, and we'd have IDE support in exchange.
We may use a _New Project_ wizard in IntelliJ IDEA, or in CLion or AppCode IDEs with Kotlin/Native plugin.
In the tutorial, we create a simple project manually for the better understanding of the approach.

Let's create a project folder. All paths below will be relative to that folder. Sometimes
you may need to create missing directories to create files.

We need to create an empty `settings.gradle.kts` file in the project root directory. Then, we
create **either** `build.gradle.kts` or `build.gradle` file. Note, there must be only one file, preferably
`build.gradle.kts`. 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  // uncomment the next line for Windows  
  //mingwX64("native") {

  // uncomment the next line for Linux 
  //linuxX64("native) { 

  // uncomment the next line for macOS
  //macosX64("native") {

    binaries {
      executable()
    }
  }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  // uncomment the next line for Windows  
  //mingwX64("native") {

  // uncomment the next line for Linux 
  //linuxX64("native) { 

  // uncomment the next line for macOS
  //macosX64("native") {

    binaries {
      executable()
    }
  }
}
```
</div>
</div>

Let's move the created `hello.kt` file onto the `src/nativeMain/kotlin` folder under the project
root.

At that point we the Gradle project that is ready to be opened in an IDE.
IntelliJ IDEA, CLion and AppCode will help to generate
[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
scripts for our project. To continue without an IDE, we'll need to download 
[Gradle](https://gradle.org) and run `gradle wrapper` command.  
[Getting Started with Gradle](https://docs.gradle.org/current/userguide/getting_started.html) article
explains more details on how to start using Gradle projects.
For advanced scenarios with Kotlin, it is recommended to refer to the
[the more detailed](../reference/building-mpp-with-gradle.html#setting-up-a-multiplatform-project)
documentation in the Kotlin plugin.


## Running the application

To run the application, we can invoke it with a Gradle task `runDebugExecutableNative` or `runReleaseExecutableNative`:
<div class="multi-language-sample" data-lang="Linux and macOS">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew runDebugExecutableNative
```
</div>
</div>
<div class="multi-language-sample" data-lang="Windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat runDebugExecutableNative
```
</div>
</div>

It's important to understand that this is now a native application, and no runtime or virtual machine is required. The output should be

```
> Task :runDebugExecutableNative
Hello Kotlin/Native!

BUILD SUCCESSFUL
```

The binary file is generated by the build tool into the `bin/native/debugExecutable` or `bin/native/releaseExecutable`
folders. The file has `.kexe` extension on Linux and macOS and `.exe` extension on Windows. Use the following command
to instruct our Gradle to build program binaries

<div class="multi-language-sample" data-lang="Linux and macOS">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>
<div class="multi-language-sample" data-lang="Windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat build
```
</div>
</div>

