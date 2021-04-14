[//]: # (title: Discover your project)

Discover main parts of your multiplatform project:

* [Multiplatform plugin](#multiplatform-plugin)
* [Targets](#targets)
* [Source sets](#source-sets)
* [Compilations](#compilations)

## Multiplatform plugin

When you [create a multiplatform project](mpp-create-lib.md), the Project Wizard automatically applies the `kotlin-multiplatform` Gradle 
plugin in the file `build.gradle`(`.kts`).

You can also apply it manually.

>The `kotlin-multiplatform` plugin works with Gradle %minGradleVersion% or later. 
>
{type="note"}

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tabs>

The `kotlin-multiplatform` plugin configures the project for creating an application or library to work on multiple platforms 
and prepares it for building on these platforms. 

In the file `build.gradle`(`.kts`), it creates the `kotlin` extension at the top level, which includes 
configuration for [targets](#targets), [source sets](#source-sets), and dependencies.

## Targets

A multiplatform project is aimed at multiple platforms that are represented by different targets. A target is part of the 
build that is responsible for building, testing, and packaging the application for a specific platform, such as macOS, 
iOS, or Android. See the list of [supported platforms](mpp-supported-platforms.md).

When you create a multiplatform project, targets are added to the `kotlin` block in the file `build.gradle` (`build.gradle.kts`).

```kotlin
kotlin {
    jvm()    
    js {
        browser {}
    }
 }
```

Learn how to [set up targets manually](mpp-set-up-targets.md).

## Source sets

The project includes the directory `src` with Kotlin source sets, which are collections of Kotlin code files, along with 
their resources, dependencies, and language settings. A source set can be used in Kotlin compilations for one or more 
target platforms. 

Each source set directory includes Kotlin code files (the `kotlin` directory) and `resources`. The Project Wizard creates 
default source sets for the `main` and `test` compilations of the common code and all added targets. 

![Source sets](source-sets.png){width=300}

>Source set names are case sensitive.
>
{type="note"}

Source sets are added to the `sourceSets` block of the top-level `kotlin` block.

<tabs>

```groovy
kotlin {
    sourceSets {
        commonMain { /* ... */} 
        commonTest { /* ... */}
        jvmMain { /* ... */}
        jvmTest { /* ... */ }
        jsMain { /* ... */}
        jsTest { /* ... */}    
    }
}
```

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
        val commonTest by getting { /* ... */ }
        val jvmMain by getting { /* ... */ }
        val jvmTest by getting { /* ... */ } 
        val jsMain by getting { /* ... */ }
        val jsTest by getting { /* ... */ } 
    }
}
```

</tabs>

Source sets form a hierarchy, which is used for sharing the common code. In a source set shared among several targets, 
you can use the platform-specific language features and dependencies that are available for all these targets.

For example, all Kotlin/Native features are available in the `desktopMain` source set, which targets the Linux (`linuxX64`), 
Windows (`mingwX64`), and macOS (`macosX64`) platforms.

![Hierarchical structure](hierarchical-structure.png)

Learn how to [build the hierarchy of source sets](mpp-share-on-platforms.md#share-code-on-similar-platforms). 

## Compilations

Each target can have one or more compilations, for example, for production and test purposes.

For each target, default compilations include:

*   `main` and `test` compilations for JVM, JS, and Native targets.
*   A compilation per [Android build variant](https://developer.android.com/studio/build/build-variants), for Android targets.

![Compilations](compilations.png)

Each compilation has a default source set, which contains sources and dependencies specific to that compilation.

Learn how to [configure compilations](mpp-configure-compilations.md). 