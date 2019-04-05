---
type: tutorial
layout: tutorial
title:  "Gradle for Kotlin/Native"
description: "Using Gradle when working with Kotlin/Native"
authors: 
 - Hadi Hariri
 - Eugene Petrenko 
date: 2019-04-24
---


While it is certainly possible to use the command line, be it directly or
combine it with a script file (i.e. bash or bat file), we should notice,
that it does not scale well for bigger projects with hundreds of files and libraries.
It is more recommendable to use the Kotlin/Native compiler is with a build system which
helps by downloading and caching the Kotlin/Native compiler binaries and libraries with
transitive dependencies, and it runs the compiler and tests.
The compilation results are cached too.
A build system can also be used by an IDE to understand the project layout.
Kotlin/Native uses the [Gradle](https://gradle.org) build system through the
[kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html) plugin.

We cover the basics of an IDE compatible project setup with Gradle in the
[A Basic Kotlin/Native Application](basic-kotlin-native-app.html)
tutorial. In this tutorial we'll see advanced aspects of the Kotlin/Native and multiplatform
builds with Gradle.

* [Build an application with Gradle](#building-an-application)
* [Build and reference a library with Gradle](#building-and-referencing-a-library)


**Note**: This tutorial assumes basic familiarity with Gradle. If you're new to Gradle,
while you should be able to follow along, it would be beneficial to review some of the 
[Getting Started guides](https://gradle.org/guides/#getting-started). To install Gradle
on your system please see the [Install guide](https://gradle.org/install/).

## Building an Application

Let's first create a
<span class="multi-language-span" data-lang="groovy">
`build.gradle` 
</span>
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span>
Gradle build file with the following contents:

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

We also need an empty
<span class="multi-language-span" data-lang="kotlin">
`settings.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`settings.gradle`
</span>
file in the project root directory.

The `plugins` block enables the Gradle plugin for Kotlin/Native which is `org.jetbrains.kotlin.multiplatform`
<span class="multi-language-span" data-lang="kotlin">
(or `kotlin("multiplatform"))`
</span>
. Then plugin configuration is done in the `kotlin{..}` block below. 
Depending on the target platform, we use different [functions](/docs/reference/building-mpp-with-gradle.html),
e.g. `macosX64`, `mingwX64`, `linuxX64`,
to create the Kotlin target. The function name is the platform which we compile our code for. 
These functions optionally take the target name as a parameter, which is `"native"`
in our case. The specified target name is used to generate the source paths and task names in the project.
We may find the full list of the supported targets in [the documentation](/docs/reference/building-mpp-with-gradle.html).

At that point, the project is ready to be opened in an IDE. Let's use [IntelliJ IDEA](https://jetbrains.com/idea)
for it. Please refer to the [Basic Kotlin/Native Application](basic-kotlin-native-app.html#openning-in-ide) tutorial
for detailed steps.

The `binaries{..}` block is used to instruct Gradle on what output we expect. It supports
generating an executable, a static or dynamic C library, or macOS framework. 
We may use code completion in the IDE so get the full list of possibilities.

In the example above we specify that we need an `executable()` to be create from our code.

An important aspect for this build script to work is that we follow the default convention of where our source
files are located, which is `src/nativeMain/kotlin`.
We can now create a Kotlin file with the following contents and place it in the directory:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main(args: Array<String>) {
    println("Hello Gradle!")
}
```
</div>


From the root directory, where our
<span class="multi-language-span" data-lang="kotlin">
`build.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`build.gradle`
</span>
file is, we can now run the following command:

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

which will build the application. 

We can see that there is a new `build` directory with a subdirectory for each target. Inside this 
we have the actual executable with the name
we passed to the the parameter `native` in the build script.

## Building and referencing a library

A common process in building applications is to build and reference libraries, be these native libraries we create from scratch in Kotlin, or as a result of interop with C or other languages.

In Gradle we can combine all of this in a single script:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id 'org.jetbrains.kotlin.konan' version '0.9.1'
}

konanArtifacts {
    library('utils') {
        srcFiles fileTree('src/libs/utils')
    }

    program('hello') {
        libraries {
            artifact 'utils'
        }
    }
}
```
</div>

In this example we're building our library, with the source being in a custom directory and not the default one by convention. We then reference this library 
during the building of our actual application.

The output structure after running `gradle build` should be:

![Directory Structure After Lib Build]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/dir-lib-build.png')}})

We can execute our application by referencing it directly or use Gradle via:

```bash
    gradle run
```
    
resulting in:
    
![Gradle Run Result]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/gradle-run.png')}})    

