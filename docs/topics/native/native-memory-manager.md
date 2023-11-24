[//]: # (title: Kotlin/Native memory management)

Kotlin/Native uses a modern memory manager that is similar to the JVM, Go, and other mainstream technologies, including
the following features:

* Objects are stored in a shared heap and can be accessed from any thread.
* Tracing garbage collection (GC) is performed periodically to collect objects that are not reachable from the "roots",
  like local and global variables.

## Garbage collector

Kotlin/Native's GC algorithm is constantly evolving. Currently, it functions as a stop-the-world mark and concurrent sweep
collector that does not separate the heap into generations.

The GC uses a full parallel mark that combines paused mutators, the GC thread, and optional marker threads to process
the mark queue. By default, paused mutators and at least one GC thread participate in the marking process.
You can disable the full parallel mark with the `-Xbinary=gcMarkSingleThreaded=true` compilation option.
However, this may increase the pause time of the garbage collector.

When the marking phase is completed, the GC processes weak references and nullifies reference points to an unmarked object.
To decrease the GC pause time, you can enable the concurrent processing of weak references by using
the `-Xbinary=concurrentWeakSweep=true` compilation option.

The GC is executed on a separate thread and started based on the timer
and memory pressure heuristics. Alternatively, it can be [called manually](#enable-garbage-collection-manually).

### Enable garbage collection manually

To force-start the garbage collector, call `kotlin.native.internal.GC.collect()`. This method triggers a new collection
and waits for its completion.

### Monitor GC performance

No special instruments are currently available to monitor the GC performance. However, it's possible to look through GC
logs to diagnose issues. To enable logging, set the following compilation flag in the Gradle build script:

```none
-Xruntime-logs=gc=info
```

Currently, the logs are only printed to `stderr`.

### Disable garbage collection

It's recommended to keep GC enabled. However, you can disable it in certain cases, such as for testing purposes or
if you encounter issues and have a short-lived program. To do so, set the following compilation flag in the Gradle
build script:

```none
-Xgc=noop
```

> With this option enabled, the GC doesn't collect Kotlin objects, so memory consumption will keep rising as long as the
> program runs. Be careful not to exhaust the system memory.
>
{type="warning"}

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

### Check for memory leaks

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

### Adjust memory consumption

If there are no memory leaks in the program, but you still see unexpectedly high memory consumption,
try updating Kotlin to the latest version. We're constantly improving the memory manager, so even a simple compiler
update might improve memory consumption.

If you continue to experience high memory consumption after updating, several options are available:

* Switch to a different memory allocator by using one of the following compilation options in your Gradle build script:

  * `-Xallocator=mimalloc` for the [mimalloc](https://github.com/microsoft/mimalloc) allocator.
  * `-Xallocator=std` for the system allocator.

* If you use the mimalloc allocator, you can instruct it to promptly release memory back to the system.
  To do so, enable the following binary option in your `gradle.properties` file:

  ```none
  kotlin.native.binary.mimallocUseCompaction=true
  ```

  It's a smaller performance cost, but it yields less certain results than the standard system allocator does.

If none of these options improves your memory consumption, report an issue in [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt).

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
{initial-collapse-state="collapsed"}

Then, compile the test binary with the `-e testlauncher.mainBackground` compiler flag.

## What's next

* [Migrate from the legacy memory manager](native-migration-guide.md)
* [Configure integration with iOS](native-ios-integration.md)
