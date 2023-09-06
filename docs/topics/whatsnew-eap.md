[//]: # (title: What's new in %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release, but it highlights the latest
> ones and some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/%kotlinEapVersion%).
>
{type="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some highlights from this preview version of Kotlin:

* [New default hierarchy template for setting up multiplatform projects](#configuring-multiplatform-projects-with-a-template)
* [Full support for Gradle Configuration cache in Kotlin Multiplatform](#full-support-for-gradle-configuration-cache-in-kotlin-multiplatform)
* [Custom memory allocator enabled by default in Kotlin/Native](#custom-memory-allocator-enabled-by-default)
* [Performance improvements for garbage collector in Kotlin/Native](#performance-improvements-for-garbage-collector)
* [New and renamed targets in Kotlin/Wasm](#new-wasm-wasi-target-and-rename-wasm-target-to-wasm-js)
* [Support of WASI API in the standard library for Kotlin/Wasm](#support-of-wasi-api-in-standard-library)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are available for:

| IDE            | Supported versions                                            |
|----------------|---------------------------------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x                                            |
| Android Studio | Hedgehog (2023.1.1 Beta 2), Iguana (Iguana 2023.2.1 Canary 2) |

## Kotlin Multiplatform

* Configuring multiplatform projects with a template
* Full support for Gradle Configuration cache

### Configuring multiplatform projects with a template

Since Kotlin %kotlinEapVersion%, the Kotlin Gradle Plugin automatically creates shared source sets for popular multiplatform scenarios.
If your project setup is one of them, you don't need to configure the source set hierarchy manually.
Just explicitly specify the targets necessary for your project.

Setup is now easier thanks to the default hierarchy template, a new feature of the Kotlin Gradle plugin.
It includes intermediate source sets that Kotlin automatically creates for the targets you declared.
[See the full template](#see-the-full-hierarchy-template).

#### Create your project

Consider a multiplatform project that targets both Android and iPhone devices and is developed on an Apple silicon MacBook.
Compare this project setup between different versions of Kotlin:

<table header-style="top">
   <tr>
       <td>Kotlin 1.9.0 and earlier (a standard setup)</td>
       <td>Kotlin 1.9.20-Beta</td>
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
   
    // The `iosMain` source set is created automatically
}
```

</td>
</tr>
</table>

Notice how the use of the default hierarchy template considerably reduces the amount of boilerplate code in your project setup.

When you declare the `android`, `iosArm64`, and `iosSimulatorArm64` targets in your code, the Kotlin Gradle plugin finds 
suitable shared source sets from the template and creates them for you. The resulting hierarchy looks like this:

![An example of using the default target hierarchy](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

Green source sets are actually created and present in the project, while gray ones from the default template are ignored.

#### Discover improved tooling support

To make it easier to work with the created project structure, IntelliJ IDEA now provides completion for source sets created with the default hierarchy template:

![The IDE completion for source sets names](multiplatform-hierarchy-completion.gif){width=700}

Kotlin also warns you if you attempt to access a source set which doesn't exist because you haven't declared the respective target.
In the example below, there is no JVM target (only `androidTarget`, which is not the same). But let's try to access the `jvmMain` source set
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

#### Set up target hierarchy

Starting with Kotlin %kotlinEapVersion%, the default hierarchy template is enabled by default. In most cases, no additional setup is required.

However, if you're migrating existing projects created before 1.9.20, you might encounter a warning if you had previously
introduced intermediate sources manually with  `dependsOn()` calls. To solve this issue, do the following:

* If your intermediate source sets are currently covered by the default hierarchy template, remove all manual `dependsOn()`
calls and source sets created with `by creating` constructions. 

  To check the list of all default source sets, see the [full hierarchy template](#see-the-full-hierarchy-template).

* If you want to have additional source sets that the default hierarchy template doesn't provide, for example between JS and JVM,
adjust the hierarchy by reapplying the template explicitly with `applyDefaultHierarchyTemplate()` and configuring additional
source sets manually as usual with `dependsOn()`:

```kotlin
kotlin {
    jvm()
    js { browser() }
    iosArm64()
    iosSimulatorArm64()

    // Apply the default hierarchy explicitly. It'll create, for example,the iosMain source set:
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

* If there are already source sets in your project with the exact same name but shared among a different set of targets 
than the ones that the template now generates, there's currently no way to modify default `dependsOn` relations between
the template's source sets.

  One option you have here is to find different source sets for your purposes, either in the default hierarchy template
  or created manually. Another is to opt out of the template completely.


#### See the full hierarchy template {initial-collapse-state="collapsed"}

When you declare the targets to which your project compiles,
the plugin picks the shared source sets from the template accordingly and creates them in your project.

![Default hierarchy template](full-template-hierarchy.svg)

> This example only shows the production part of the project, omitting the `Main` suffix
> (for example, using `common` instead of `commonMain`). However, everything is the same for `*Test` sources as well.
>
{type="tip"}

### Full support for Gradle configuration cache in Kotlin Multiplatform

Previously, we introduced a [preview](whatsnew19.md#preview-of-the-gradle-configuration-cache) of the Gradle configuration
cache available for Kotlin multiplatform libraries. With %kotlinEapVersion%, the Kotlin Multiplatform plugin takes a step further.

It now supports the Gradle configuration cache in the [Kotlin CocoaPods Gradle plugin](native-cocoapods-dsl-reference.md),
as well as with integration tasks that are necessary for Xcode builds, like `embedAndSignAppleFrameworkForXcode`.

Now all multiplatform projects can take advantage of the improved build time.
The Gradle configuration cache speeds up the build process by reusing the results of the configuration phase for subsequent builds.
For more details and setup instructions, see the [Gradle documentation](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).

## Kotlin/Native

* Custom memory allocator enabled by default
* Performance improvements for garbage collector

### Custom memory allocator enabled by default

Kotlin %kotlinEapVersion% comes with the new memory allocator enabled by default. It's designed to replace the previous default allocator,
`mimaloc` to make garbage collection more efficient and improve the runtime performance of the [Kotlin/Native memory manager](native-memory-manager.md).

The new custom allocator divides system memory into pages, allowing independent sweeping in consecutive order.
Each allocation becomes a memory block within a page, and the page keeps track of block sizes.
Different page types are optimized for various allocation sizes.
The consecutive arrangement of memory blocks ensures efficient iteration through all allocated blocks.

When a thread allocates memory, it searches for a suitable page based on the allocation size.
Threads maintain a set of pages for different size categories.
Typically, the current page for a given size can accommodate the allocation.
If not, the thread requests a different page from the shared allocation space.
This page may already be available, require sweeping, or should be created first.

The new allocator allows for multiple independent allocation spaces simultaneously,
which will enable the Kotlin team to experiment with different page layouts to improve performance even further.

#### How to enable custom memory allocator

Starting with Kotlin %kotlinEapVersion%, the new memory allocator is the default. No additional setup is required.

If you experience high memory consumption, you can switch back to `mimaloc` or the system allocator with `-Xallocator=mimalloc`
or `-Xallocator=std` in your Gradle build script. Please report such issues in [YouTrack](https://kotl.in/issue) to help
us improve the new memory allocator.

For technical details of the new allocator's design, see this [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/custom_alloc/README.md).

### Performance improvements for garbage collector

The Kotlin team continues to improve performance and stability of the new Kotlin/Native memory manager.
This release brings a number of significant changes to the garbage collector (GC), including the following %kotlinEapVersion% highlights:

* [](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### Full parallel mark to reduce the pause time for the GC

Previously, the default garbage collector performed only a partial parallel mark. When the mutator thread was paused, 
it would mark the GC start from its own roots, like thread-local variables and the call stack. 
Meanwhile, a separate GC thread was responsible for marking the start from global roots, as well as the roots of all mutators
that were actively running the native code and therefore not paused.

This approach worked well for cases where there were a limited number of global objects and the mutator threads spent 
a considerable amount of time in a runnable state, executing Kotlin code. However, this is not the case for typical iOS applications.

Now GC uses a full parallel mark that coordinates paused mutators, the GC thread, and optional marker threads to process
the mark queue together. By default, the marking process is performed by:

* Paused mutators. Instead of processing their own roots and then being idle while not actively executing code, they contribute
to the whole marking process.
* The GC thread. It ensures that at least one thread is guaranteed to perform marking.

This new approach makes the marking process more efficient, reducing the pause time of the GC.

#### Tracking memory in big chunks to improve the allocation performance

Previously, the GC scheduler tracked each object allocation individually. However, both the new default custom allocator
and the `mimalloc` memory allocator do not allocate separate storage for each object; they allocate large areas for several objects at once.

In Kotlin %kotlinEapVersion%, the GC tracks areas instead of individual objects. This speeds up the allocation of small objects by reducing 
the number of tasks performed on each allocation and, therefore, helps to keep down the garbage collector's memory usage.

## Kotlin/Wasm

* New `wasm-wasi` target, and rename `wasm` target to `wasm-js`
* Support of WASI API in standard library

> Kotlin Wasm is [Experimental](components-stability.md).
> It may be changed at any time. Use it only for evaluation purposes.
>
> We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

### New `wasm-wasi` target, and rename `wasm` target to `wasm-js`

In this release, we're introducing a new target for Kotlin/Wasm `wasm-wasi`. We're also renaming the `wasm` target to `wasm-js`.
In the Gradle DSL, these targets are available as `wasmWasi` and `wasmJs`, respectively.

To use these targets to your project, update the `build.gradle.kts` file:

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

The previously introduced `wasm` block has been deprecated in favor of `wasmJs`.

To migrate your existing Kotlin/Wasm project, do the following:
* In the `build.gradle.kts` file, rename the `wasm` block to `wasmJs`.
* In your project structure, rename the `wasmMain` folder to `wasmJsMain`.

### Support of WASI API in standard library

In this release, we have included support of [WASI](https://github.com/WebAssembly/WASI), a system interface for the Wasm platform.
WASI support makes it easier for you to use Kotlin/Wasm outside of browsers, like in server-side applications, by offering
a standardized set of APIs to access system resources. In addition, WASI provides capability-based security – another 
layer of security when accessing external resources.

To run Kotlin/Wasm applications, you need a VM supporting Wasm Garbage Collection (GC). For example, Node.js or Deno. 
Wasmtime, WasmEdge, and others are still working towards full Wasm GC support.

To import a WASI function, use the `@WasmImport` annotation:

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[See the full example in our GitHub repository](https://github.com/Kotlin/kotlin-wasm-examples/tree/wasi/wasi-example).

> It isn't possible to use [interoperability with JavaScript](wasm-js-interop.md), while targeting `wasmWasi`.
>
{type="note"}

## How to update to Kotlin %kotlinEapVersion%

Install Kotlin %kotlinEapVersion% in any of the following ways:

* If you use the _Early Access Preview_ update channel, the IDE will suggest automatically updating to %kotlinEapVersion% as
  soon as it becomes available.
* If you use the _Stable_ update channel, you can change the channel to _Early Access Preview_ at any time by selecting
  **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** in your IDE. You'll then be able to install the latest
  preview release. Check out [these instructions](install-eap-plugin.md) for details.

Once you've installed %kotlinEapVersion% don't forget to [change the Kotlin version](configure-build-for-eap.md)
to %kotlinEapVersion% in your build scripts.