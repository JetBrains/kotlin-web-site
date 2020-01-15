---
type: tutorial
layout: tutorial
title:  "Hello World using Command Line Compiler"
description: "A look at how to compile our first Kotlin/Native application using the command line compiler"
authors: 
  - Hadi Hariri
date: 2020-01-15
---


<!--- To become a How-To. Need to change type to new "HowTo" --->




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

