[//]: # (title: Kotlin/Native memory management)

Kotlin/Native uses a modern memory manager that is similar to JVM, Go, and other mainstream technologies:
* Objects are stored in a shared heap and can be accessed from any thread.
* Tracing garbage collector (GC) is executed periodically to collect objects that are not reachable from the "roots",
  like local and global variables.

## Garbage collector

The exact algorithm of GC is constantly evolving. Currently, it is the Stop-the-World Mark and Concurrent Sweep
collector that does not separate the heap into generations.

The GC uses a full parallel mark that combines paused mutators, the GC thread, and optional marker threads to process
the mark queue. By default, paused mutators and at least one GC thread participate in the marking process.
You can disable the full parallel mark with `-Xbinary=gcMarkSingleThreaded=true` compilation option.
However, it may increase the pause time of the garbage collector.

When the marking phase is completed, GC processes weak references and returns `null` if the reference points to an unmarked object.
To decrease the GC pause time, you can enable the concurrent processing of weak references. To do that, use
the `-Xbinary=concurrentWeakSweep=true` compilation option.

GC is executed on a separate thread and kicked off based on the timer
and memory pressure heuristics, or can be [called manually](#enable-garbage-collection-manually).

### Enable garbage collection manually

To force-start the garbage collector, call `kotlin.native.internal.GC.collect()`. It triggers a new collection and waits for
its completion.

### Monitor GC performance

There are no special instruments to monitor the GC performance yet. However, it's still possible to look through GC logs
for diagnosis. To enable logging, set the following compilation flag in the Gradle build script:

```none
-Xruntime-logs=gc=info
```

Currently, the logs are only printed to `stderr`.

### Disable garbage collection

It's recommended to keep GC enabled. However, you can disable it in certain cases, for example, for testing purposes or
if you encounter issues and have a short-lived program. To do that, set the following compilation flag in the Gradle
build script:

```none
-Xgc=noop
```

> With this option enabled, GC doesn't collect Kotlin objects, so memory consumption will keep rising as long as the
> program runs. Be careful not to exhaust the system memory.
>
{type="warning"}

## Memory consumption

Kotlin/Native uses its own [memory allocator](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/custom_alloc/README.md).
It divides system memory into pages, allowing independent sweeping in consecutive order. Each allocation becomes a memory
block within a page, and the page keeps track of block sizes. Different page types are optimized for various allocation
sizes. The consecutive arrangement of memory blocks ensures efficient iteration through all allocated blocks.

When a thread allocates memory, it searches for a suitable page based on the allocation size. Threads maintain a set of
pages for different size categories. Typically, the current page for a given size can accommodate the allocation.
If not, the thread requests a different page from the shared allocation space. This page may already be available,
require sweeping, or have to be created first.

The Kotlin/Native memory allocator comes with protection against sudden spikes in memory allocations. It prevents
situations when the mutator starts to allocate a lot of garbage quickly, and the GC thread cannot keep up with it,
making the memory usage grow endlessly. In this case, the GC forces Stop-the-World phase until the iteration is completed.

You can monitor memory consumption yourself, check for memory leaks, and adjust memory consumption if necessary.

### Check for memory leaks

To access the memory manager metrics, call `kotlin.native.internal.GC.lastGCInfo()`. It returns statistics for the last
run of the garbage collector. The statistics can be useful for:

* Debugging memory leaks when using global variables
* Checking if there are any leaks when running tests

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage() : Long {
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

If you experience high memory consumption anyway, a few options are available:

* Switch to a different memory allocator. To do that, use the following compilation options in your Gradle build script:
  * `-Xallocator=mimalloc` for the [mimalloc](https://github.com/microsoft/mimalloc) allocator.
  * `-Xallocator=std` for the system allocator.
* If you use the mimalloc allocator, you can instruct it to promptly release memory back to the system. It's a smaller
  performance cost, but it gives less definitive results. To do that,
  enable the `kotlin.native.binary.mimallocUseCompaction=true` binary option in your `gradle.properties` file.

If none of these options improved the memory consumption, report an issue in [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt).

## Unit tests in the background

In unit tests, nothing processes the main thread queue, so don't use `Dispatchers.Main` unless it was mocked, which can
be done by calling `Dispatchers.setMain` from `kotlinx-coroutines-test`.

If you don't rely on `kotlinx.coroutines` or `Dispatchers.setMain` doesn't work for you for some reason, try the
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
