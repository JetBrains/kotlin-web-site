[//]: # (title: Kotlin/Native memory management)

> This page describes features of the new memory manager enabled by default since Kotlin 1.7.20.
> See our [Migration guide](native-migration-guide.md) to move your projects from the legacy memory manager.
>
{type="note"}

Kotlin/Native uses a modern memory manager that is similar to JVM, Go, and other mainstream technologies:
* Objects are stored in a shared heap and can be accessed from any thread.
* Tracing garbage collector (GC) is executed periodically to collect objects that are not reachable from the "roots",
like local and global variables.

The memory manager is the same across all the Kotlin/Native targets, except for wasm32, which is only supported in the
[legacy memory manager](#legacy-memory-manager).

## Garbage collector

The exact algorithm of GC is constantly evolving. As of 1.7.20, it is the Stop-the-World Mark and Concurrent Mark Sweep
collector that does not separate heap into generations.

GC is executed on a separate thread and kicked off based on the timer
and memory pressure heuristics, or can be [called manually](#enable-garbage-collection-manually).

### Enable garbage collection manually

To force start garbage collector, call `kotlin.native.internal.GC.collect()`. It triggers a new collection and waits for
its completion.

### Monitor GC performance

There are no special instruments to monitor the GC performance yet. However, it's still possible to look through GC logs
for diagnosis. To enable logging, set the following compilation flag in the Gradle build script:

```properties
-Xruntime-logs=gc=info
```

Currently, the logs are only printed to `stderr`.

### Disable garbage collection

It's recommended to keep GC enabled. However, you can disable it in certain cases, for example, for testing purposes or
if you encounter issues and have a short-lived program. To do that, set the following compilation flag in the Gradle
build script:

```properties
-Xgc=noop
```

> With this option enabled, GC doesn't collect Kotlin objects, so memory consumption will keep rising as long as the
> program runs. Be careful not to exhaust the system memory.
>
{type="warning"}

## Memory consumption

If there are no memory leaks in the program, but you still see unexpectedly high memory consumption, switch the memory
allocator from [`mimalloc`](https://github.com/microsoft/mimalloc), which is used by default on many targets to a system
one. For that, set the following compilation flag in the Gradle build script:

```properties
-Xallocator=std
```

* If the memory consumption goes down to the expected levels, everything is OK. The `mimalloc` allocator pre-allocates system
  memory for performance reasons.
* If the memory consumption still doesn't go down, report an issue in [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt).

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

## Legacy memory manager

If it's necessary, you can switch back to the legacy memory manager. Set the following option in your `gradle.properties`:

```properties
kotlin.native.binary.memoryModel=strict
```

> * Compiler cache support is not available for the legacy memory manager, so compilation times might
become worse.
> * This Gradle option for reverting to the legacy memory manager will be removed in future releases.
>
{type="note"}

If you encounter issues with migrating from the legacy memory manager, or you want to temporarily support both the current
and legacy memory managers, see our recommendations in the [Migration guide](native-migration-guide.md).

## What's next

* [Migrate from the legacy memory manager](native-migration-guide.md)
* [Configure integration with iOS](native-ios-integration.md)