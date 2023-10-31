[//]: # (title: What's new in Kotlin 1.9.20)

_[Released: October 31, 2023](releases.md#release-details)_

The Kotlin 1.9.20 release is out, and the K2 compiler for all the targets is now in **Beta**.  
Additionally, here are some of the main highlights:

* [Preview kapt compiler plugin with K2](#preview-kapt-compiler-plugin-with-k2)
* [New default hierarchy template for setting up multiplatform projects](#template-for-configuring-multiplatform-projects)
* [Full support for the Gradle Configuration cache in Kotlin Multiplatform](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [Custom memory allocator enabled by default in Kotlin/Native](#custom-memory-allocator-enabled-by-default)
* [Performance improvements for the garbage collector in Kotlin/Native](#performance-improvements-for-the-garbage-collector)
* [Support for Xcode 15 in Kotlin/Native](#support-for-xcode-15)
* [New and renamed targets in Kotlin/Wasm](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Support for the WASI API in the standard library for Kotlin/Wasm](#support-for-the-wasi-api-in-the-standard-library)

## IDE support

The Kotlin plugins that support 1.9.20 are available for:

| IDE            | Supported versions                      |
|----------------|-----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x                      |
| Android Studio | Hedgehog (2023.1.1)*, Iguana (2023.2.1) |

* The Kotlin 1.9.20 plugin will be included with Android Studio Hedgehog (231) and Iguana (232) in their upcoming releases.

## New Kotlin K2 compiler updates

### Support for Kotlin/Wasm

Since this release, the Kotlin/Wasm supports the new K2 compiler.  
[Learn how to enable it in your project](#how-to-enable-the-kotlin-k2-compiler).

### Preview kapt compiler plugin with K2

> Support for K2 in the kapt compiler plugin is [Experimental](components-stability.md).
> Opt-in is required (see details below), and you should use it only for evaluation purposes.
>
{type="warning"}

In 1.9.20-RC, you can try using the [kapt compiler plugin](kapt.md) with the K2 compiler.
To use the K2 compiler in your project, add the following options to your `gradle.properties` file:

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

Alternatively, you can enable K2 for kapt by completing the following steps:
1. In your `build.gradle.kts` file, [set the language version](gradle-compiler-options.md#example-of-setting-a-languageversion) to `2.0`.
2. In your `gradle.properties` file, add `kapt.use.k2=true`.

If you encounter any issues when using kapt with the K2 compiler, please report them to our
[issue tracker](http://kotl.in/issue).

### How to enable the Kotlin K2 compiler

To enable and test the Kotlin K2 compiler, use the new language version with the following compiler option:

```bash
-language-version 2.0
```

You can specify it in your `build.gradle.kts` file:

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

### Leave your feedback on the new K2 compiler

We would appreciate any feedback you may have!

* Provide your feedback directly to K2 developers on Kotlin
  Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you faced with the new K2 compiler
  on [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to
  allow JetBrains to collect anonymous data about K2 usage.

## Kotlin Multiplatform

* [Template for configuring multiplatform projects](#template-for-configuring-multiplatform-projects)
* [Full support for the Gradle Configuration cache](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)

### Template for configuring multiplatform projects

Starting with Kotlin 1.9.20, the Kotlin Gradle plugin automatically creates shared source sets for popular multiplatform scenarios.
If your project setup is one of them, you don't need to configure the source set hierarchy manually.
Just explicitly specify the targets necessary for your project.

Setup is now easier thanks to the default hierarchy template, a new feature of the Kotlin Gradle plugin.
It's a predefined template of a source set hierarchy built into the plugin.
It includes intermediate source sets that Kotlin automatically creates for the targets you declared.
[See the full template](#see-the-full-hierarchy-template).

#### Create your project easier

Consider a multiplatform project that targets both Android and iPhone devices and is developed on an Apple silicon MacBook.
Compare how this project is set up between different versions of Kotlin:

<table header-style="top">
   <tr>
       <td>Kotlin 1.9.0 and earlier (a standard setup)</td>
       <td>Kotlin 1.9.20</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
   
    // The iosMain source set is created automatically
}
```

</td>
</tr>
</table>

Notice how the use of the default hierarchy template considerably reduces the amount of boilerplate code needed to set
up your project.

When you declare the `androidTarget`, `iosArm64`, and `iosSimulatorArm64` targets in your code, the Kotlin Gradle plugin finds
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of the default target hierarchy in use](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

Green source sets are actually created and included in the project, while gray ones from the default template are ignored.

#### Enjoy improved tooling support

To make it easier to work with the created project structure, IntelliJ IDEA now provides completion for source sets created with the default hierarchy template:

<img src="multiplatform-hierarchy-completion.png" alt="IDE completion for source set names" width="350" animated="true"/>

The IDE also warns you if you attempt to access a source set that doesn't exist because you haven't declared the respective target.
In the example below, there is no JVM target (only `androidTarget`, which is not the same). But let's try to use the `jvmMain` source set
and see what happens:

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

In this case, Kotlin reports a warning in the build log:

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### Set up the target hierarchy

Starting with Kotlin 1.9.20, the default hierarchy template is automatically enabled. In most cases, no additional setup is required.

However, if you're migrating existing projects created before 1.9.20, you might encounter a warning if you had previously
introduced intermediate sources manually with  `dependsOn()` calls. To solve this issue, do the following:

* If your intermediate source sets are currently covered by the default hierarchy template, remove all manual `dependsOn()`
calls and source sets created with `by creating` constructions.

  To check the list of all default source sets, see the [full hierarchy template](#see-the-full-hierarchy-template).

* If you want to have additional source sets that the default hierarchy template doesn't provide, for example between JS and the JVM,
adjust the hierarchy by reapplying the template explicitly with `applyDefaultHierarchyTemplate()` and configuring additional
source sets manually as usual with `dependsOn()`:

```kotlin
kotlin {
    jvm()
    js { browser() }
    iosArm64()
    iosSimulatorArm64()

    // Apply the default hierarchy explicitly. It'll create, for example, the iosMain source set:
    applyDefaultHierarchyTemplate()

    sourceSets {
        // Create an additional jsAndJvmMain source set
        val jsAndJvmMain by creating {
            dependsOn(commonMain.get())
    }

        jsMain.get().dependsOn(jsAndJvmMain)
        jvmMain.get().dependsOn(jsAndJvmMain)
    }
}
```

* If there are already source sets in your project that have the exact same names as those generated by the template
but that are shared among different sets of targets, there's currently no way to modify the default `dependsOn` relations between
the template's source sets.

  One option you have here is to find different source sets for your purposes, either in the default hierarchy template
  or ones that have been manually created. Another is to opt out of the template completely.

  To opt out, add `kotlin.mpp.applyDefaultHierarchyTemplate=false` to your `gradle.properties` and configure all other
  source sets manually.

  We're currently working on an API for creating your own hierarchy templates to simplify the setup process in such cases.

#### See the full hierarchy template {initial-collapse-state="collapsed"}

When you declare the targets to which your project compiles,
the plugin picks the shared source sets from the template accordingly and creates them in your project.

![Default hierarchy template](full-template-hierarchy.svg)

> This example only shows the production part of the project, omitting the `Main` suffix
> (for example, using `common` instead of `commonMain`). However, everything is the same for `*Test` sources as well.
>
{type="tip"}

### Full support for the Gradle configuration cache in Kotlin Multiplatform

Previously, we introduced a [preview](whatsnew19.md#preview-of-the-gradle-configuration-cache) of the Gradle configuration
cache, which was available for Kotlin multiplatform libraries. With 1.9.20, the Kotlin Multiplatform plugin takes a step further.

It now supports the Gradle configuration cache in the [Kotlin CocoaPods Gradle plugin](native-cocoapods-dsl-reference.md),
as well as in the integration tasks that are necessary for Xcode builds, like `embedAndSignAppleFrameworkForXcode`.

Now all multiplatform projects can take advantage of the improved build time.
The Gradle configuration cache speeds up the build process by reusing the results of the configuration phase for subsequent builds.
For more details and setup instructions, see the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).

## Kotlin/Native

* [Custom memory allocator enabled by default](#custom-memory-allocator-enabled-by-default)
* [Performance improvements for garbage collector](#performance-improvements-for-the-garbage-collector)
* [Incremental compilation of klib artifacts](#incremental-compilation-of-klib-artifacts)

### Custom memory allocator enabled by default

Kotlin 1.9.20 comes with the new memory allocator enabled by default. It's designed to replace the previous default allocator,
`mimaloc`, to make garbage collection more efficient and improve the runtime performance of the [Kotlin/Native memory manager](native-memory-manager.md).

The new custom allocator divides system memory into pages, allowing independent sweeping in consecutive order.
Each allocation becomes a memory block within a page, and the page keeps track of block sizes.
Different page types are optimized for various allocation sizes.
The consecutive arrangement of memory blocks ensures efficient iteration through all allocated blocks.

When a thread allocates memory, it searches for a suitable page based on the allocation size.
Threads maintain a set of pages for different size categories.
Typically, the current page for a given size can accommodate the allocation.
If not, the thread requests a different page from the shared allocation space.
This page may already be available, require sweeping, or have to be created first.

The new allocator allows for multiple independent allocation spaces simultaneously,
which will enable the Kotlin team to experiment with different page layouts to improve performance even further.

#### How to enable the custom memory allocator

Starting with Kotlin 1.9.20, the new memory allocator is the default. No additional setup is required.

If you experience high memory consumption, you can switch back to `mimaloc` or the system allocator with `-Xallocator=mimalloc`
or `-Xallocator=std` in your Gradle build script. Please report such issues in [YouTrack](https://kotl.in/issue) to help
us improve the new memory allocator.

For the technical details of the new allocator's design, see this [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md).

### Performance improvements for the garbage collector

The Kotlin team continues to improve the performance and stability of the new Kotlin/Native memory manager.
This release brings a number of significant changes to the garbage collector (GC), including the following 1.9.20 highlights:

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### Full parallel mark to reduce the pause time for the GC

Previously, the default garbage collector performed only a partial parallel mark. When the mutator thread was paused,
it would mark the GC's start from its own roots, like thread-local variables and the call stack.
Meanwhile, a separate GC thread was responsible for marking the start from global roots, as well as the roots of all mutators
that were actively running the native code and therefore not paused.

This approach worked well in cases where there were a limited number of global objects and the mutator threads spent
a considerable amount of time in a runnable state executing Kotlin code. However, this is not the case for typical iOS applications.

Now the GC uses a full parallel mark that combines paused mutators, the GC thread, and optional marker threads to process
the mark queue. By default, the marking process is performed by:

* Paused mutators. Instead of processing their own roots and then being idle while not actively executing code, they contribute
to the whole marking process.
* The GC thread. This ensures that at least one thread will perform marking.

This new approach makes the marking process more efficient, reducing the pause time of the GC.

#### Tracking memory in big chunks to improve the allocation performance

Previously, the GC scheduler tracked the allocation of each object individually. However, neither the new default custom
allocator nor the `mimalloc` memory allocator allocates separate storage for each object; they allocate large areas for several objects at once.

In Kotlin 1.9.20, the GC tracks areas instead of individual objects. This speeds up the allocation of small objects by reducing
the number of tasks performed on each allocation and, therefore, helps to minimize the garbage collector's memory usage.

### Incremental compilation of klib artifacts

> This feature is [Experimental](components-stability.md#stability-levels-explained).
> It may be dropped or changed at any time. Opt-in is required (see details below).
> Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

Kotlin 1.9.20 introduces a new compilation time optimization for Kotlin/Native.
The compilation of `klib` artifacts into native code is now partially incremental.

When compiling Kotlin source code into native binary in debug mode, the compilation goes through two stages:

1. Source code is compiled into `klib` artifacts.
2. `klib` artifacts, along with dependencies, are compiled into a binary.

To optimize the compilation time in the second stage, the team has already implemented compiler caches for dependencies.
They are compiled into native code only once, and the result is reused every time a binary is compiled.
But `klib` artifacts built from project sources were always fully recompiled into native code at every project change.

With new incremental compilation, if the project module change causes only a partial recompilation of source code into
`klib` artifacts, just a part of the `klib` is further recompiled into a binary.

To enable incremental compilation, add the following option to your `gradle.properties` file:

```none
kotlin.incremental.native=true
```

If you face any issues, report such cases to [YouTrack](https://kotl.in/issue).

### Support for Xcode 15

Kotlin/Native 1.9.20 supports Xcode 15.0 – the latest version of Xcode. 
As part of this, platform libraries have been updated to reflect the changes to Objective-C frameworks for Apple targets. 
Feel free to update your Xcode and continue working on your Kotlin projects for Apple operating systems.

## Kotlin/Wasm

* [New `wasm-wasi` target, and the renaming of the `wasm` target to `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [Support for the WASI API in standard library](#support-for-the-wasi-api-in-the-standard-library)

> Kotlin Wasm is [Experimental](components-stability.md).
> It may be changed at any time. Use it only for evaluation purposes.
>
> We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

### New `wasm-wasi` target, and the renaming of the `wasm` target to `wasm-js`

In this release, we're introducing a new target for Kotlin/Wasm – `wasm-wasi`. We're also renaming the `wasm` target to `wasm-js`.
In the Gradle DSL, these targets are available as `wasmWasi {}` and `wasmJs {}`, respectively.

To use these targets in your project, update the `build.gradle.kts` file:

```kotlin
kotlin {
   wasmWasi {
      // ...
   }
   wasmJs {
      // ...
   }
}
```

The previously introduced `wasm {}` block has been deprecated in favor of `wasmJs {}`.

To migrate your existing Kotlin/Wasm project, do the following:
* In the `build.gradle.kts` file, rename the `wasm {}` block to `wasmJs {}`.
* In your project structure, rename the `wasmMain` directory to `wasmJsMain`.

### Support for the WASI API in the standard library

In this release, we have included support for [WASI](https://github.com/WebAssembly/WASI), a system interface for the Wasm platform.
WASI support makes it easier for you to use Kotlin/Wasm outside of browsers, for example in server-side applications, by offering
a standardized set of APIs for accessing system resources. In addition, WASI provides capability-based security – another
layer of security when accessing external resources.

To run Kotlin/Wasm applications, you need a VM that supports Wasm Garbage Collection (GC), for example, Node.js or Deno.
Wasmtime, WasmEdge, and others are still working towards full Wasm GC support.

To import a WASI function, use the `@WasmImport` annotation:

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[You can find a full example in our GitHub repository](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example).

> It isn't possible to use [interoperability with JavaScript](wasm-js-interop.md), while targeting `wasmWasi`.
>
{type="note"}

## Install Kotlin 1.9.20

### Check the IDE version

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x and 2023.2.x automatically suggest updating the Kotlin
plugin to version 1.9.20. IntelliJ IDEA 2023.3 will include the Kotlin 1.9.20 plugin.

Android Studio Hedgehog (231) and Iguana (232) will support Kotlin 1.9.20 in their upcoming releases.

The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20).

### Configure Gradle settings

To download Kotlin artifacts and dependencies, update your `settings.gradle(.kts)` file to use the Maven Central repository:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

If the repository is not specified, Gradle uses the sunset JCenter repository, which could lead to issues with Kotlin artifacts.