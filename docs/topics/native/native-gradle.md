[//]: # (title: Get started with Kotlin/Native using Gradle)

[Gradle](https://gradle.org) is a build system that is very commonly used in the Java, Android, and other ecosystems. It is the default choice for Kotlin/Native and Multiplatform
when it comes to build systems.

While most IDE's including [IntelliJ IDEA](https://www.jetbrains.com/idea) can generate the corresponding Gradle file, we're going to 
take a look at how to create this manually, to have a better understanding of how things work under the covers. If you'd like to use the IDE, check out 
[Using IntelliJ IDEA](native-get-started.md). 

Gradle supports two languages for build scripts:

- Groovy scripts in `build.gradle` files
- Kotlin scripts in `build.gradle.kts` files

The Groovy language is the first supported scripting language for Gradle, 
it leverages the power of dynamic typing and runtime features of the language. It is also possible to use Kotlin in Gradle scripts. Being a statically-typed language, it plays better with IDEs when 
it comes to compilation and error detection. 

Either can be used and samples will show the syntax for both languages.

## Create project files 

First, create a project directory. Inside it, create `build.gradle` or `build.gradle.kts` 
Gradle build file with the following contents:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") { // on macOS
  // linuxX64("native") // on Linux
  // mingwX64("native") // on Windows
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "%gradleVersion%"
  distributionType = Wrapper.DistributionType.BIN
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64('native') { // on macOS
  // linuxX64('native') // on Linux
  // mingwX64('native') // on Windows
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '%gradleVersion%'
  distributionType = 'BIN'
}
```

</tab>
</tabs>

Next, create an empty `settings.gradle` or `settings.gradle.kts` file in the project folder.

Depending on the target platform, different [functions](mpp-supported-platforms.md),
such as `macosX64`, `mingwX64`, `linuxX64`, `iosX64`,
are used for creating the Kotlin target. The function name is the platform for which you are compiling your code. 
These functions optionally take the target name as a parameter, which is `"native"` in our case. 
The specified _target name_ is used to generate the source paths and task names in the project.  

By convention, all sources are located in the `src/<target name>[Main|Test]/kotlin` folders, where `main` is for the source code
and `test` is for tests. `<target name>` corresponds to the target platform (in this case `native`), as specified in the build file. 

Create a folder `src/nativeMain/kotlin` and inside it place the file `hello.kt` with the following contents:

```kotlin
fun main() {
  println("Hello Kotlin/Native!")
}
```

## Build the project

From the root project folder, execute the build by running 

`gradle nativeBinaries`

This should create a folder `build/bin/native` with two subfolders `debugExecutable` and `releaseExecutable` with the corresponding binary.
By default, the binary's name is the same as the project folder. 

## Open the project in an IDE

Any IDE that supports Gradle should allow for opening the project in the IDE. In the case of [IntelliJ IDEA](https://www.jetbrains.com/idea),
just open the project folder, and it will automatically detect it as Kotlin/Native project. 

## What's next?

Learn how to [write Gradle build scripts for real-life Kotlin/Native projects](mpp-dsl-reference.md).

