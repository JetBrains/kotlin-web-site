---
type: tutorial
layout: tutorial
title:  "Hello Kotlin/Native using Gradle"
description: "A look at how to compile Kotlin/Native applications using Gradle"
authors: 
  - Hadi Hariri
date: 2020-01-15
---


<!--- To become a How-To. Need to change type to new "HowTo" --->


## Creating a Kotlin/Native Gradle project

[Gradle](https://gradle.org) is a build system that is very commonly used in the Java, Android, and other ecosystems. It is the default choice for Kotlin/Native and Multiplatform
when it comes to build systems.

While most IDE's including [IntelliJ IDEA](https://www.jetbrains.com/idea) can generate the corresponding Gradle file, we're going to 
take a look at how to create this manually, to have a better understanding of how things work under the covers. If you'd like to use the IDE, check out 
[Using IntelliJ IDEA](using-intellij-idea.html). 


Gradle supports two languages for build scripts:

- Groovy scripts in `build.gradle` files
- Kotlin scripts in `build.gradle.kts` files

The Groovy language is the first supported scripting language for Gradle, 
it leverages the power of dynamic typing and runtime features of the language. It is also possible to use Kotlin in Gradle scripts. Being a statically-typed language, it plays better with IDEs when 
it comes to compilation and error detection. 

Either can be used and samples will show the syntax for both languages.

First step is to create a project folder. Inside it we create
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

Next create an empty
<span class="multi-language-span" data-lang="kotlin">
`settings.gradle.kts` 
</span><span class="multi-language-span" data-lang="groovy">
`settings.gradle`
</span>
file in the project folder.

Depending on the target platform, different [functions](/docs/reference/building-mpp-with-gradle.html),
e.g. `macosX64`, `mingwX64`, `linuxX64`, `iosX64`,
are used to create the Kotlin target. The function name is the platform which we are compiling our code for. 
These functions optionally take the target name as a parameter, which is `"native"` in our case. 
The specified _target name_ is used to generate the source paths and task names in the project.  

By convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` folders, where `main` is for the source code
and `test` is for tests. `<target name>` corresponds to the target platform (in this case `native`), as specified in the build file. 

Create a folder `src/nativeMain/kotlin` and inside it place the file `hello.kt` with the following contents:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
  println("Hello Kotlin/Native!")
}
```
</div>


## Building the project

From the root project folder, execute the build by running 

`gradle nativeBinaries`

This should create a folder `build/native/bin` with two subfolders `debugExecutable` and `releaseExecutable` with the corresponding binary.
By default, the binary is named the same as the project folder. 


## Opening the project in an IDE

Any IDE that supports Gradle should allow for opening the project in the IDE. In the case of [IntelliJ IDEA](https://www.jetbrains.com/idea), just open the project folder, and it will automatically
detect it as Kotlin/Native project. 

## What's next?

To learn how to write Gradle build scripts for real-life Kotlin/Native projects, see [Building Multiplatform Projects with Gradle](/docs/reference/building-mpp-with-gradle.html).

