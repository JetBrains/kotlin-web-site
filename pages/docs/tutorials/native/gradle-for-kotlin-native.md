---
type: tutorial
layout: tutorial
title:  "Gradle for Kotlin/Native"
description: "Using Gradle when working with Kotlin/Native"
authors: Hadi Hariri 
date: 2018-01-24
showAuthorInfo: false
---


Up to now, most of the tutorials have been using the [command line compiler](basic-kotlin-native-app.html) to build applications, including linking in any `klib` libraries
either [produced directly](working-with-klib.html) or as a result of [interoperability with C](interop-with-c.html). While it is certainly possible to use the command line, be it directly or
combine it with a script file (i.e. bash or bat file), it is more recommendable to use a build tool for this process.  

Kotlin/Native has a plugin for [Gradle](https://gradle.org) which allows us to compile, build libraries, reference libraries, and in general perform all the actions that we would need to build our application. 

In this tutorial we'll see how to

* [Build an application with Gradle](#building-an-application)
* [Build and reference a library with Gradle](#building-and-referencing-a-library)
* [Generate CMake files to use with CLion](#generating-cmake-files)


**Note**: This tutorial assumes basic familiarity with Gradle. If you're new to Gradle, while you should be able to follow along, it would be beneficial to review some of the 
[Getting Started guides](https://gradle.org/guides/#getting-started). To install Gradle on your system please see the [Install guide](https://gradle.org/install/).


## Building an Application

The following Gradle script (named `build.gradle`) is the simplest needed to compile an application 

```groovy
buildscript {
    repositories {
        mavenCentral()
        maven {
            url "https://dl.bintray.com/jetbrains/kotlin-native-dependencies"
        }
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-native-gradle-plugin:+"
    }
}

apply plugin: 'konan'

konan.targets = ['macbook']

konanArtifacts {
    program('hello')
}
```

The `buildscript` section defines the repositories and dependencies required for the Gradle plugin for Kotlin/Native which is `konan`. Then come the actual parameters for compiling:

1. The `konan.targets` can contain one or more target platforms.

2. The `konanArtifacts` contains the actual instructions telling Gradle what to build. In our case we're saying we want to build an 
executable called `hello`. 

An important aspect for this build script to work is that we follow the default convention of where our source
files are located, which is `src/main/kotlin`. We can of course change this behaviour by defining the `srcFiles`, which we'll see further down. 

We can now create a Kotlin file with the following contents and place it in the `src/main/kotlin` directory:

```kotlin
fun main(args: Array<String>) {
    println("Hello Gradle!")
}
``` 

To recap, this should be our directory structure layout:

![Directory Structure Before Build]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/dir-before-build.png')}})


From the root directory, where our `build.gradle` file is, we can now run the following command:

    gradle build
    
    
which will build the application. The end result should be the following:

![Directory Structure After Build]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/dir-after-build.png')}})
     

We can see that there is a new `build` directory with a subdirectory for each target. Inside this 
we have the actual executable with the name
we passed to the the parameter `program` in the build script.

## Building and referencing a library

A common process in building applications is to build and reference libraries, be these native libraries we create from scratch in Kotlin, or as a result of interop with C or other languages.

In Gradle we can combine all of this in a single script:
 
```groovy
buildscript {
    repositories {
        mavenCentral()
        maven {
            url "https://dl.bintray.com/jetbrains/kotlin-native-dependencies"
        }
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-native-gradle-plugin:+"
    }
}

apply plugin: 'konan'

konan.targets = ['macbook']

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

In this example we're building our library, with the source being in a custom directory and not the default one by convention. We then reference this library 
during the building of our actual application.

The output structure after running `gradle build` should be:

![Directory Structure After Lib Build]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/dir-lib-build.png')}}))

We can execute our application by referencing it directly or use Gradle via:

    gradle run

    
resulting in:
    
![Gradle Run Result]({{ url_for('tutorial_img', filename='native/gradle-for-kotlin-native/gradle-run.png')}})    

## Generating CMake files

In order to be able to use CLion, we need to have our project defined using CMake. The Gradle plugins provides us a convenient way to do this
using the the command `generateCMake`:

    gradle generateCMake
    
The result is a new file named `CMakeLists.txt` which allows us to open the project in CLion.


This is a simple taste of what the Gradle plugin for Kotlin/Native provides. For more detailed information about these, see the [corresponding README](https://github.com/JetBrains/kotlin-native/blob/master/GRADLE_PLUGIN.md).
