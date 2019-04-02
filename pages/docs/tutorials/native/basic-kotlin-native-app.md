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
It helps to download and cache Kotlin/Native compiler binaries and libraries with
transitive dependencies, it runs the compiler and tests.
Compilation results are cached too.
Lastly, a build system is used by an IDE to understand project layout.

Kotlin/Native uses [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) plugin.
We'll see how to configure a Gradle build below.

For some corner cases, Kotlin/Native compiler can still be obtained manually (not recommended)
from the [Kotlin releases page on GitHub](https://github.com/JetBrains/kotlin/releases).
In the tutorial, we will focus on using the Gradle builds. 

While the output of the compiler does not have any dependencies or virtual machine requirements,
the compiler itself and the Gradle build system require Java 1.8 or 11 runtime. Checkout the 
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

While compilation from the console looks easy and clear, we should notice, that it
does not scale well enough for bigger projects with hundreds of files and libraries.
In addition to that, the command line approach does not explain an IDE how the project
is to be loaded, what dependencies (if any) are used, how to download dependencies and so on. 
Let's configure an IDE for our project 

## Setting up an IDE

We will use [IntelliJ IDEA](https://jetbrains.com/idea) for the tutorial.
Both the [free and open source](https://www.jetbrains.com/idea/features/editions_comparison_matrix.html)
IntelliJ IDEA [Community edition](https://www.jetbrains.com/idea/download) and IntelliJ IDEA Ultimate Edition
are compatible with the tutorial. 
We may download and install it from [https://jetbrains.com/idea](https://jetbrains.com/idea/downlaod) if necessary.
Kotlin plugin is included in IntelliJ IDEA by default, still we need to make sure Kotlin plugin version
is {{ site.data.releases.latest.version }} (or newer) in the _Settings_ or _Preferences_ dialog, under the
the Language & Frameworks | Kotlin section.

The _New Project_ wizard can be used to start a new Kotlin/Native project in one click. 
Check out the _Kotlin_ section and select _Native | Gradle_ option to have the
project generated. 

## Creating Kotlin/Native Gradle project

For the better understanding and explanation in the tutorial, we'll create a simple project manually.
Let's create a project folder first. All paths in the tutorial will be relative to that folder. Sometimes
missing directories has to be created before new files are added.

Gradle supports two languages for the build scripts. We have the following
options:
- Groovy scripts in `build.gradle` files
- Kotlin scripts in `build.gradle.kts` files

Groovy language is the oldest supported scripting language for Gradle, 
it leverages the power of dynamic typing and runtime features of the language.
Sometimes it is harder to maintain Groovy build scripts. IDEs are struggling
to get through the dynamism of Groovy to provide helpful insides or
code completion.

Kotlin as a statically typed programming language plays well for writing
Gradle build scripts.
Thanks to static types, the Kotlin compiler detects errors earlier and
shows helpful compilation error messages and warnings.
Both an IDE and the compiler use the information about types to infer
available functions and properties in a given scope. 

We create
<span class="multi-language-span" data-lang="groovy">
`build.gradle` 
</span>
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span>
Gradle build file with the following contents 

<div class="multi-language-sample" data-lang="groovy" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = "ALL"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = "ALL"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  mingwX64("native") {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = "ALL"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.ALL
}
```
</div>
</div>
<div class="multi-language-sample" data-lang="kotlin" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.ALL
}
```
</div>
</div>

<div class="multi-language-sample" data-lang="kotlin" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  mingwX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.ALL
}
```
</div>
</div>

We need to create an empty
<span class="multi-language-span" data-lang="kotlin">
`settings.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`settings.gradle`
</span>
file in the project root directory.
Let's move the created `hello.kt` file onto the `src/nativeMain/kotlin` folder under the project
root.

The project is ready. The next step is to open in IntelliJ IDEA. For advanced build scenarios,
it is recommended to refer to the
[the more detailed](/docs/reference/building-mpp-with-gradle.html#setting-up-a-multiplatform-project)
documentation.

For those who want to continue without an IDE, the 
[Gradle](https://gradle.org) build tool has to be downloaded and installed.
Make sure you use the actual version of Gradle (e.g. {{ site.data.releases.tutorials.native.gradle_version }} or newer).
Running the `gradle wrapper` command will complete the project creation.
[Getting Started with Gradle](https://docs.gradle.org/current/userguide/getting_started.html) article
explains more details on how to start using Gradle projects. 

## Opening the Project in IDE

At that point we have the Gradle project that is ready to be opened in an IDE.
IntelliJ IDEA (CLion, AppCode or AndroidStudio) will help to generate
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
For existing projects which already have Gradle wrapper scripts, the _Use default Gradle wrapper_
option should be selected instead.

Use the path to the Java 1.8 or 11 runtime for the _Gradle JVM_ field. Checkout the 
[https://jdk.java.net/11](https://jdk.java.net/11/) or [https://adoptopenjdk.net/](https://adoptopenjdk.net/)
for the best JRE, openjdk, or JDK distribution.  

## Running the application

To run the application, we can invoke it with a Gradle `runDebugExecutableNative` or
`runReleaseExecutableNative` task:
<div class="multi-language-sample" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew runDebugExecutableNative
```
</div>
</div>

<div class="multi-language-sample" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode='bash' data-highlight-only>

```bash
./gradlew runDebugExecutableNative
```
</div>
</div>

<div class="multi-language-sample" data-os="windows">
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
The binary files are created in the `build/bin/native/debugExecutable` or `build/bin/native/releaseExecutable`
folders respectively. The file has `.kexe` extension on Linux and macOS and `.exe` extension on Windows. Use the following command
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

