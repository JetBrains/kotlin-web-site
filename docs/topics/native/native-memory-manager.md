[//]: # (title: Kotlin/Native memory management)

Kotlin/Native uses a modern memory manager that is similar to the JVM, Go, and other mainstream technologies, including
the following features:

* Objects are stored in a shared heap and can be accessed from any thread.
* Tracing garbage collection is performed periodically to collect objects that are not reachable from the "roots",
  like local and global variables.

## Garbage collector

Kotlin/Native's garbage collector (GC) algorithm is constantly evolving. Currently, it functions as a stop-the-world mark
and concurrent sweep collector that does not separate the heap into generations.

The GC is executed on a separate thread and started based on the memory pressure heuristics or by a timer. Alternatively,
it can be [called manually](#enable-garbage-collection-manually).

The GC processes the mark queue on several threads in parallel, including application threads, the GC thread,
and optional marker threads. Application threads and at least one GC thread participate in the marking process.
By default, application threads must be paused when the GC is marking objects in the heap.

> You can disable the parallelization of the mark phase with the `kotlin.native.binary.gcMarkSingleThreaded=true` compiler option.
> However, this may increase the garbage collector's pause time on large heaps.
>
{style="tip"}

When the marking phase is completed, the GC processes weak references and nullifies reference points to an unmarked object.
By default, weak references are processed concurrently to decrease the GC pause time.

See how to [monitor](#monitor-gc-performance) and [optimize](#optimize-gc-performance) garbage collection.

### Enable garbage collection manually

To force-start the garbage collector, call `kotlin.native.internal.GC.collect()`. This method triggers a new collection
and waits for its completion.

### Monitor GC performance

To monitor the GC performance, you can look through its logs and diagnose issues. To enable logging,
set the following compiler option in your Gradle build script:

```none
-Xruntime-logs=gc=info
```

Currently, the logs are only printed to `stderr`.

On Apple platforms, you can take advantage of the Xcode Instruments toolkit to debug iOS app performance.
The garbage collector reports pauses with signposts available in Instruments.
Signposts enable custom logging within your app, allowing you to check if a GC pause corresponds to an application freeze.

To track GC-related pauses in your app:

1. To enable the feature, set the following compiler option in your `gradle.properties` file:
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. Open Xcode, go to **Product** | **Profile** or press <shortcut>Cmd + I</shortcut>. This action compiles your app and
   launches Instruments.
3. In the template selection, select **os_signpost**.
4. Configure it by specifying `org.kotlinlang.native.runtime` as **subsystem** and `safepoint` as **category**.
5. Click the red record button to run your app and start recording signpost events:

   ![Tracking GC pauses as signposts](native-gc-signposts.png){width=700}

   Here, each blue blob on the lowest graph represents a separate signpost event, which is a GC pause.

### Optimize GC performance

To improve GC performance, you can enable concurrent marking to decrease the GC pause time. This allows the marking phase of garbage collection to run simultaneously with application threads.

The feature is currently [Experimental](components-stability.md#stability-levels-explained). To enable it, set the
following compiler option in your `gradle.properties` file:
  
```none
kotlin.native.binary.gc=cms
```

### Disable garbage collection

It's recommended to keep the GC enabled. However, you can disable it in certain cases, such as for testing purposes or
if you encounter issues and have a short-lived program. To do so, set the following binary option in your
`gradle.properties` file:

```none
kotlin.native.binary.gc=noop
```

> With this option enabled, the GC doesn't collect Kotlin objects, so memory consumption will keep rising as long as the
> program runs. Be careful not to exhaust the system memory.
>
{style="warning"}

## Memory consumption

Kotlin/Native uses its own [memory allocator](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md).
It divides system memory into pages, allowing independent sweeping in consecutive order. Each allocation becomes a memory
block within a page, and the page keeps track of block sizes. Different page types are optimized for various allocation
sizes. The consecutive arrangement of memory blocks ensures efficient iteration through all allocated blocks.

When a thread allocates memory, it searches for a suitable page based on the allocation size. Threads maintain a set of
pages for different size categories. Typically, the current page for a given size can accommodate the allocation.
If not, the thread requests a different page from the shared allocation space. This page may already be available,
require sweeping, or have to be created first.

The Kotlin/Native memory allocator comes with protection against sudden spikes in memory allocations. It prevents
situations where the mutator starts to allocate a lot of garbage quickly and the GC thread cannot keep up with it,
making the memory usage grow endlessly. In this case, the GC forces a stop-the-world phase until the iteration is completed.

You can monitor memory consumption yourself, check for memory leaks, and adjust memory consumption.

### Monitor memory consumption

To debug memory issues, you can check memory manager metrics. In addition, it's possible to track Kotlin's memory
consumption on Apple platforms.

#### Check for memory leaks

To access the memory manager metrics, call `kotlin.native.internal.GC.lastGCInfo()`. This method returns statistics for the last
run of the garbage collector. The statistics can be useful for:

* Debugging memory leaks when using global variables
* Checking for leaks when running tests

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // The test will fail if you remove the next line
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

#### Track memory consumption on Apple platforms

When debugging memory issues on Apple platforms, you can see how much memory is reserved by Kotlin code.
Kotlin's share is tagged with an identifier and can be tracked through tools like VM Tracker in Xcode Instruments.

The feature is available only for the default Kotlin/Native memory allocator when _all_ the following conditions are met:

* **Tagging enabled**. The memory should be tagged with a valid identifier. Apple recommends numbers between 240 and 255;
  the default value is 246.

  If you set up the `kotlin.native.binary.mmapTag=0` Gradle property, tagging is disabled.

* **Allocation with mmap**. The allocator should use the `mmap` system call to map files into memory.

  If you set up the `kotlin.native.binary.disableMmap=true` Gradle property, the default allocator uses `malloc` instead
  of `mmap`.

* **Paging enabled**. Paging of allocations (buffering) should be enabled.

  If you set up the [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradle property, the memory is
  reserved on a per-object basis instead.

### Adjust memory consumption

If you experience unexpectedly high memory consumption, try the following solutions:

#### Update Kotlin

Update Kotlin to the latest version. We're constantly improving the memory manager, so even a simple compiler
update might improve memory consumption.

#### Disable allocator paging 
<primary-label ref="experimental-opt-in"/>

You can disable paging of allocations (buffering) so that the memory allocator reserves memory on a per-object basis.
In some cases, it may help you satisfy strict memory limitations or reduce memory consumption on the application's startup.

To do that, set the following option in your `gradle.properties` file:

```none
kotlin.native.binary.pagedAllocator=false
```

> With allocator paging disabled, [tracking memory consumption on Apple platforms](#track-memory-consumption-on-apple-platforms)
> is not possible.
> 
{style="note"}

#### Enable support for Latin-1 strings
<primary-label ref="experimental-opt-in"/>

By default, strings in Kotlin are stored using UTF-16 encoding, where each character is represented by two bytes.
In some cases, it leads to strings taking up twice as much space in the binary compared to the source code
and reading data taking up twice as much memory.

To reduce the application's binary size and adjust memory consumption, you can enable support for Latin-1-encoded strings.
The [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) encoding represents each of the first 256
Unicode characters by just one byte.

To enable it, set the following option in your `gradle.properties` file:

```none
kotlin.native.binary.latin1Strings=true
```

With the Latin-1 support, strings are stored in Latin-1 encoding as long as all the characters fall within its range.
Otherwise, the default UTF-16 encoding is used.

> While the feature is Experimental, the cinterop extension functions [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html),
> [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), and
> [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) become less efficient.
> Each call to them may trigger an automatic string conversion to UTF-16.
> 
{style="note"}

If none of these options helped, create an issue in [YouTrack](https://kotl.in/issue).

## Unit tests in the background

In unit tests, nothing processes the main thread queue, so don't use `Dispatchers.Main` unless it was mocked. Mocking it can
be done by calling `Dispatchers.setMain` from `kotlinx-coroutines-test`.

If you don't rely on `kotlinx.coroutines` or if `Dispatchers.setMain` doesn't work for you for some reason, try the
following workaround for implementing the test launcher:

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

Then, compile the test binary with the `-e testlauncher.mainBackground` compiler option.

## What's next

* [Migrate from the legacy memory manager](native-migration-guide.md)
* [Check the specifics of integration with Swift/Objective-C ARC](native-arc-integration.md)
