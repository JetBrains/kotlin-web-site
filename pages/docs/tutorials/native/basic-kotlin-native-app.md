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

* [Obtain the Kotlin/Native compiler and IDE](#obtaining-the-compiler)
* [Write the application](#creating-hello-kotlin)
* [Setting up an IDE](#setting-up-an-ide)
* [Run the application](#running-the-application)


## Obtaining the compiler and IDE
<a name="obtaining-the-compiler"></a>

Kotlin/Native is available for macOS, Linux and Windows. While cross-platform compilation is possible
(i.e. using one platform to compile for another), in this first tutorial
we're going to compile for the same operating system we're running on. 

The best way to use Kotlin/Native compiler is to rely on a build system.
It helps to download and cache Kotlin/Native compiler binaries,
it run the compiler for us, helps to start tests. Compilation results are cached too.
Lastly, a build system is used to explain our project to an IDE.

Kotlin/Native uses Gradle build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) Gradle plugin.
We'll see how to configure a Gradle build for us below.

For some corner cases, Kotlin/Native compiler can still be obtained manually (but not recommended) from the
[Kotlin releases page on GitHub](https://github.com/JetBrains/kotlin/releases).
In the tutorial we will focus on using the Gradle builds instead of the command line. 

While the output of the compiler does not have any dependencies or virtual machine requirements,
the compiler itself and the Gradle build system require Java runtime 1.8 or 11. Checkout the 
[https://jdk.java.net/11](https://jdk.java.net/11/) or [https://adoptopenjdk.net/](https://adoptopenjdk.net/)
for the best JRE, openjdk, or JDK distribution.

On a macOS we also need the macOS SDK which can be installed by installing Xcode.

## Creating Hello Kotlin

Our first application is going to simply print some text on the standard output. In our case, this will be "Hello Kotlin/Native"
 
We can open up our favorite IDE or an editor and write the following code in a file named `hello.kt` 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main(args: Array<String>) {
    println("Hello Kotlin/Native!")
}
```
</div>

## Compiling the code from console 

The manual way to compile the application is to call the download compiler command to generate
`hello.kexe` (Linux and macOS) or `hello.exe` (windows)
binary file:

```bash
kotlinc-native hello.kt
```

## Setting up an IDE

We will use [IntelliJ IDEA](https://jetbrains.com/idea) Ultimate or Community edition for the tutorial.
We may download and install it from [https://jetbrains.com/idea](https://jetbrains.com/idea) if necessary.
Kotlin plugin is included in IntelliJ IDEA by default, still we need to make sure Kotlin plugin version
is {{ site.data.releases.latest.version }} (or newer) in the _Settings_ or _Preferences_ dialog, under
the Language & Frameworks | Kotlin section.

It requires few more efforts to start with a Gradle project builds, and we'd have IDE support in exchange.
The shortest path could be to use the _New Project_ wizard in IntelliJ IDEA and select Kotlin | Native | Gradle
in the list of new project templates. 

For the better understanding and explanation in the tutorial, we'll create a simple project manually.
Let's create a project folder. All paths below will be relative to that folder. Sometimes
you may need to create missing directories to create files.

We need to create an empty `settings.gradle.kts` file in the project root directory.
Gradle support two types of build scripts, where the oldest one uses Groovy programming
language in `build.gradle` files. Kotlin language can be used on Gradle build script files too,
name such files as `build.gradle.kts`.

We create either `build.gradle.kts` (for Kotlin, recommended) or `build.gradle` (Groovy) Gradle build file.
Note, there must be only one file, preferably
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

At that point we created the Gradle project and that is ready to be opened in an IDE.
IntelliJ IDEA, CLion and AppCode will help to generate
[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
scripts for our project. To continue without an IDE, we'll need to download 
[Gradle](https://gradle.org) and run `gradle wrapper` command.
[Getting Started with Gradle](https://docs.gradle.org/current/userguide/getting_started.html) article
explains more details on how to start using Gradle projects.
For advanced scenarios with Kotlin, it is recommended to refer to the
[the more detailed](/docs/reference/building-mpp-with-gradle.html#setting-up-a-multiplatform-project)
documentation in the Kotlin plugin.

Now let's open the project in IntelliJ IDEA. For that we click on the File | Open... and select
our `build.gradle.kts` (or `build.gradle`) project file. Confirm to open the file _as Project_.
Select _Use gradle 'wrapper' task configuration in the Gradle import dialog to complete the import. 

## Running the application

To run the application, we can invoke it with a Gradle `runDebugExecutableNative` or
`runReleaseExecutableNative` task:
<div class="multi-os-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew runDebugExecutableNative
```
</div>
</div>

<div class="multi-os-sample" data-os="macOS">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew runDebugExecutableNative
```
</div>
</div>

<div class="multi-os-sample" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat runDebugExecutableNative
```
</div>
</div>

It's important to understand that this is now a native application, and no runtime or virtual machine
is required. The output should be

```
> Task :runDebugExecutableNative
Hello Kotlin/Native!

BUILD SUCCESSFUL
```

Usually, a native binary can be compiled as _debug_ with more debug information and less optimizations and _release_,
where optimizations are enabled and less to none debug information is available.  
The binary files are created in the `bin/native/debugExecutable` or `bin/native/releaseExecutable`
folders respectively. The file has `.kexe` extension on Linux and macOS and `.exe` extension on Windows. Use the following command
to instruct the build to produce binaries:

<div class="multi-os-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-os-sample" data-os="macOS">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-os-sample" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat build
```
</div>
</div>

