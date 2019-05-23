---
type: tutorial
layout: tutorial
title:  "A Basic Kotlin/Native Application"
description: "A look at how to compile our first Kotlin/Native application and open it in an IDE"
authors: 
  - Hadi Hariri
  - Eugene Petrenko 
date: 2019-04-15
---


In this tutorial, we'll look at how to

* [Obtain the Kotlin/Native compiler](#obtaining-the-compiler)
* [Write the application](#creating-hello-kotlin)
* [Create build files](#creating-a-kotlinnative-gradle-project)
* [Set up an IDE](#open-in-ide)
* [Run the application](#running-the-application)


## Obtaining the Compiler

The Kotlin/Native compiler is available for macOS, Linux, and Windows. It supports
different targets including iOS (arm32, arm64, simulator x86_64), Windows (mingw32 and x86_64),
Linux (x86_64, arm64, MIPS), macOS (x86_64), Raspberry PI, SMT32, WASM. For the full list of targets
we can refer to the [Kotlin/Native overview](/docs/reference/native-overview.html).
While cross-platform compilation is possible
(i.e., using one platform to compile for another), in this first tutorial
we are only compiling for the operating system we're running on. 

The best way to use the Kotlin/Native compiler is with a build system.
It helps by downloading and caching the Kotlin/Native compiler binaries and libraries with
transitive dependencies, and running the compiler and tests.
It caches the compilation results too.
A build system can also be used by an IDE to understand the project layout.

Kotlin/Native uses the [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) plugin.
We'll look at how to configure a Gradle build below.
For some corner cases, a Kotlin/Native compiler can still be obtained manually (not recommended)
from the [Kotlin releases page on GitHub](https://github.com/JetBrains/kotlin/releases).
In the tutorial, we are focusing on using the Gradle builds. 

While the output of the compiler does not have any dependencies or virtual machine requirements,
the compiler itself and the Gradle build system require a Java 1.8 or 11 runtime. Check out the 
[https://jdk.java.net/11](https://jdk.java.net/11/) or another resource 
for the best JRE, OpenJDK, or JDK distribution.

## Creating Hello Kotlin

Our first application is simply going to print some text on the standard output. In our case, this text is "Hello Kotlin/Native". 
We can open up our favorite IDE or editor and write the following code in a file named `hello.kt`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
  println("Hello Kotlin/Native!")
}
```
</div>

## Compiling the code from the console 

To manually compile the application call the [downloaded](https://github.com/JetBrains/kotlin/releases)
compiler and generate a `hello.kexe` (Linux and macOS) or `hello.exe` (Windows)
binary file:

```bash
kotlinc-native hello.kt -o hello
```

While compilation from the console seems to be easy and clear, we should notice, that it
does not scale well for bigger projects with hundreds of files and libraries.
In addition to this, the command line approach does not explain to an IDE how to open such a project,
where the sources are located, what dependencies are used, or how the dependencies are downloaded and so on.  

<a name="create-gradle-project"></a>
## Creating a Kotlin/Native Gradle project

The _New Project_ wizard in IntelliJ IDEA can be used to start a new Kotlin/Native project with just one click. 
Check out the _Kotlin_ section and select the _Native | Gradle_ option to generate the project.
For a better understanding and to explain what's happening, in this tutorial we'll create the project manually.

Let's first create a project folder. All the paths in this tutorial will be relative to this folder. Sometimes
the missing directories will have to be created before new files are added.

Gradle supports two languages for the build scripts. We have the following
options:
- Groovy scripts in `build.gradle` files
- Kotlin scripts in `build.gradle.kts` files

Groovy language is the oldest supported scripting language for Gradle, 
it leverages the power of the dynamic typing and runtime features of the language.
Sometimes it can be harder to maintain Groovy build scripts. IDEs are struggling
to get through the dynamism of Groovy to provide helpful insights or
code completion.

Kotlin as a statically typed programming language plays well for writing
Gradle build scripts.
Thanks to the static type inference, the Kotlin compiler detects errors earlier and
shows important compilation error messages and warnings.
Both an IDE and the compiler can use the information about types to infer
the available functions and properties in a given scope. 

We create
<span class="multi-language-span" data-lang="groovy">
`build.gradle` 
</span>
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span>
Gradle build file with the following contents:
[[include pages-includes/docs/tutorials/native/basic-kotlin-native-app-codeblocks-code.md]]

The prepared project sources can be directly downloaded from 
[[include pages-includes/docs/tutorials/native/basic-kotlin-native-app-codeblocks-link.md]]

Now need to create an empty
<span class="multi-language-span" data-lang="kotlin">
`settings.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`settings.gradle`
</span>
file in the project root directory.

Depending on the target platform, we use different [functions](/docs/reference/building-mpp-with-gradle.html),
e.g. `macosX64`, `mingwX64`, `linuxX64`, `iosX64`,
to create the Kotlin target. The function name is the platform which we are compiling our code for. 
These functions optionally take the target name as a parameter, which is `"native"` in our case. 
The specified _target name_ is used to generate the source paths and task names in the project.  

By the convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` folders.
It creates _main_ and _test_ source sets for every target. Let's place the `hello.kt`
we previously created into the _main_ source set folder, which is `src/nativeMain/kotlin`. 
The `nativeMain` folder comes from the `"native"` target name, which we specified in the build script above.

The project is ready. The next step is to open it in IntelliJ IDEA. For advanced build scenarios,
it is recommended to refer to the
[more detailed](/docs/reference/building-mpp-with-gradle.html#setting-up-a-multiplatform-project)
documentation.

Anyone wanting to continue on without an IDE, will need to download and install the
[Gradle](https://gradle.org) build tool.
Make sure to use the right version of Gradle (e.g. {{ site.data.releases.tutorials.native.gradle_version }} or newer).
Running the `gradle wrapper` command will complete the project creation.
[Getting Started with Gradle](https://docs.gradle.org/current/userguide/getting_started.html)
explains in detail how to start using Gradle projects. 

<a name="open-in-ide"></a>
## Opening the Project in IDE

We are using [IntelliJ IDEA](https://jetbrains.com/idea) for this tutorial.
Both the [free and open source](https://www.jetbrains.com/idea/features/editions_comparison_matrix.html)
IntelliJ IDEA [Community Edition](https://www.jetbrains.com/idea/download) and
IntelliJ IDEA Ultimate Edition work for this tutorial. 
We can download and install both of them from [https://jetbrains.com/idea/download](https://jetbrains.com/idea/download) if necessary.
The Kotlin plugin is included with IntelliJ IDEA by default, but still, we need to make sure the Kotlin plugin version
is {{ site.data.releases.latest.version }} (or newer) in the _Settings_ or _Preferences_ dialog, under
the Language & Frameworks | Kotlin section.


At this point, we should have a Gradle project that is ready to be opened in an IDE.
IntelliJ IDEA (CLion, AppCode, or AndroidStudio) helps us to generate the
[Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)
scripts for our project. 

Now let's open the project in IntelliJ IDEA. For that we click on the File | Open... and select
our 
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`build.gradle`
</span>
project file. 

![Open Project Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-open-as-project.png')}}){: width="70%"}

Confirm to open the file _as Project_.

![Gradle Import Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-import-gradle.png')}})

Select _Use gradle 'wrapper' task configuration_ option in the Gradle import dialog to complete the import.
For existing projects, which already have Gradle wrapper scripts, the _Use default Gradle wrapper_
option should be selected instead.

Use the path to the Java runtime version 1.8 or 11 for the _Gradle JVM_ field. Check out the 
[https://jdk.java.net/11](https://jdk.java.net/11/) or [https://adoptopenjdk.net/](https://adoptopenjdk.net/)
for the best JRE, OpenJDK, or JDK distribution.  

<a name="run-in-ide"></a>
## Running the application

Usually, a native binary can be compiled as _debug_ with more debug information and fewer optimizations, and _release_
where optimizations are enabled and there is no (or at least less) debug information available.  
The binary files are created in the `build/bin/native/debugExecutable` or `build/bin/native/releaseExecutable`
folders respectively. The file has a `.kexe` extension on Linux and macOS and an `.exe` extension on Windows. Use the following command
to instruct the build to produce binaries:

<div class="multi-language-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-language-sample" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew build
```
</div>
</div>

<div class="multi-language-sample" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
gradlew.bat build
```
</div>
</div>

It's important to understand that this is now a native application, and no
runtime or virtual machine is required.
We can now run the compiled binary from the console:

```
Hello Kotlin/Native!
```

In addition to the build tasks, the Gradle build includes helpful
tasks to run the application directly via
`runDebugExecutableNative` and `runReleaseExecutableNative`.

The names of these tasks were created from the formula:
`run[Debug|Release]Executable<target name>`,
where `target name` is the capitalized target name that we specified in the
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`build.gradle`
</span>
file out of our build, `"native"` in our case.
Let's run the task in the IDE. For that, let's open the Gradle Tool Window
and find the task in the list: 
![Gradle Import Dialog]({{ url_for('tutorial_img', filename='native/basic-kotlin-native/idea-run-gradle-task.png')}})

Alternatively, we may call the following command from the console:
[[include pages-includes/docs/tutorials/native/runDebugExecutableNative.md]]

The output should be:

```
> Task :runDebugExecutableNative
Hello Kotlin/Native!

BUILD SUCCESSFUL
```

## Next Steps

Kotlin/Native can be used for many 
[targets](targeting-multiple-platforms.html) and applications,
including, but not limited to
macOS, Windows, Linux, and [iOS](/docs/tutorials/native/mpp-ios-android.html).

Calling C, Objective-C, or Swift from Kotlin/Native is easy. Take a look at
the [C Interop documentation](/docs/reference/native/c_interop.html) or
[Objective-C and Swift](/docs/reference/native/objc_interop.html) interop
documentation or check out one of our tutorials.

With Kotlin [multiplatform](/docs/reference/multiplatform.html) projects, it is possible to
share the same Kotlin code between all the supported platforms. 
Check out the tutorial on [sharing Kotlin code between iOS and Android](/docs/tutorials/native/mpp-ios-android.html)
or have a look at how to build your own [multiplatform library](/docs/tutorials/multiplatform-library.html).
