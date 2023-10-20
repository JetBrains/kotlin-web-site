[//]: # (title: iOS integration)

Integration of Kotlin/Native garbage collector with Swift/Objective-C ARC is seamless and generally requires no additional
work to be done. Learn more about [Swift/Objective-C interoperability](native-objc-interop.md).

However, there are some specifics you should keep in mind:

## Threads

### Deinitializers

Deinitialization on the Swift/Objective-C objects and the objects they refer to is called on the main thread if
these objects are passed to Kotlin on the main thread, for example:

```kotlin
// Kotlin
class KotlinExample {
    fun action(arg: Any) {
        println(arg)
    }
}
```

```swift
// Swift
class SwiftExample {
    init() {
        print("init on \(Thread.current)")
    }

    deinit {
        print("deinit on \(Thread.current)")
    }
}

func test() {
    KotlinExample().action(arg: SwiftExample())
}
```

The resulting output:

```text
init on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
shared.SwiftExample
deinit on <_NSMainThread: 0x600003bc0000>{number = 1, name = main}
```

Deinitialization on the Swift/Objective-C objects is called on a special GC thread if:

* Swift/Objective-C objects are passed to Kotlin on a thread other than main.
* The main dispatch queue isn't processed.

If you want to call deinitialization on a special GC thread explicitly,
set `kotlin.native.binary.objcDisposeOnMain=false` in your `gradle.properties`. This option
enables deinitialization on a special GC thread, even if Swift/Objective-C objects were passed to Kotlin on the main thread.

### Completion handlers

When calling Kotlin suspending functions from Swift, completion handlers might be called on threads other than the main
one, for example:

```kotlin
// Kotlin
// coroutineScope, launch, and delay are from kotlinx.coroutines
suspend fun asyncFunctionExample() = coroutineScope {
    launch {
        delay(1000L)
        println("World!")
    }
    println("Hello")
}
```

```swift
// Swift
func test() {
    print("Running test on \(Thread.current)")
    PlatformKt.asyncFunctionExample(completionHandler: { _ in
        print("Running completion handler on \(Thread.current)")
    })
}
```

The resulting output:

```text
Running test on <_NSMainThread: 0x600001b100c0>{number = 1, name = main}
Hello
World!
Running completion handler on <NSThread: 0x600001b45bc0>{number = 7, name = (null)}
```

### Calling Kotlin suspending functions 

The Kotlin/Native memory manager has a restriction on calling Kotlin suspending functions from Swift and Objective-C from
threads other than the main one.

This restriction was originally introduced in the legacy memory manager due to cases when the code dispatched a
continuation to be resumed on the original thread. If this thread didn't have a supported event loop, the task would
never run, and the coroutine would never be resumed.

In certain cases, this restriction is not required anymore. You can lift it by adding the following option to your
`gradle.properties`:

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

## Garbage collection and lifecycle

### Object reclamation

An object is reclaimed only during the garbage collection. This applies to Swift/Objective-C objects that cross interop
boundaries into Kotlin/Native, for example:

```kotlin
// Kotlin
class KotlinExample {
    fun action(arg: Any) {
        println(arg)
    }
}
```

```swift
// Swift
class SwiftExample {
    deinit {
        print("SwiftExample deinit")
    }
}

func test() {
    swiftTest()
    kotlinTest()
}

func swiftTest() {
    print(SwiftExample())
    print("swiftTestFinished")
}

func kotlinTest() {
    KotlinExample().action(arg: SwiftExample())
    print("kotlinTest finished")
}
```

The resulting output:

```text
shared.SwiftExample
SwiftExample deinit
swiftTestFinished
shared.SwiftExample
kotlinTest finished
SwiftExample deinit
```

### Objective-C objects lifecycle

The Objective-C objects might live longer than they should, which sometimes might cause performance issues. For example,
when a long-running loop creates several temporary objects that cross the Swift/Objective-C interop boundary on each iteration.

In the [GC logs](native-memory-manager.md#monitor-gc-performance), there's a number of stable refs in the root set.
If this number keeps growing, it may indicate that the Swift/Objective-C objects are not freed up when they should.
In this case, try the `autoreleasepool` block around loop bodies that do interop calls:

```kotlin
// Kotlin
fun growingMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        NSLog("$it\n")
    }
}

fun steadyMemoryUsage() {
    repeat(Int.MAX_VALUE) {
        autoreleasepool {
            NSLog("$it\n")
        }
    }
}
```

### Garbage collection of Swift and Kotlin objects' chains

Consider the following example:

```kotlin
// Kotlin
interface Storage {
    fun store(arg: Any)
}

class KotlinStorage(var field: Any? = null) : Storage {
    override fun store(arg: Any) {
        field = arg
    }
}

class KotlinExample {
    fun action(firstSwiftStorage: Storage, secondSwiftStorage: Storage) {
        // Here, we create the following chain:
        // firstKotlinStorage -> firstSwiftStorage -> secondKotlinStorage -> secondSwiftStorage.
        val firstKotlinStorage = KotlinStorage()
        firstKotlinStorage.store(firstSwiftStorage)
        val secondKotlinStorage = KotlinStorage()
        firstSwiftStorage.store(secondKotlinStorage)
        secondKotlinStorage.store(secondSwiftStorage)
    }
}
```

```swift
// Swift
class SwiftStorage : Storage {

    let name: String

    var field: Any? = nil

    init(_ name: String) {
        self.name = name
    }

    func store(arg: Any) {
        field = arg
    }

    deinit {
        print("deinit SwiftStorage \(name)")
    }
}

func test() {
    KotlinExample().action(
        firstSwiftStorage: SwiftStorage("first"),
        secondSwiftStorage: SwiftStorage("second")
    )
}
```

It takes some time between "deinit SwiftStorage first" and "deinit SwiftStorage second" messages to appear in the
log. The reason is that `firstKotlinStorage` and `secondKotlinStorage` are collected in different GC cycles.
Here's the sequence of events:

1. `KotlinExample.action` finishes. `firstKotlinStorage` is considered "dead" because nothing references it,
    while `secondKotlinStorage` is not because it is referenced by `firstSwiftStorage`.
2. First GC cycle starts, and `firstKotlinStorage` is collected.
3. There are no references to `firstSwiftStorage`, so it is "dead" as well, and `deinit` is called.
4. Second GC cycle starts. `secondKotlinStorage` is collected because `firstSwiftStorage` is no longer referencing it.
5. `secondSwiftStorage` is finally reclaimed.

It requires two GC cycles to collect these four objects because deinitialization of Swift and Objective-C objects happens
after the GC cycle. The limitation stems from `deinit`, which can call arbitrary code, including the Kotlin code that
cannot be run during the GC pause.

## Support for background state and App Extensions

The current memory manager does not track application state by default and does not integrate
with [App Extensions](https://developer.apple.com/app-extensions/) out of the box.

It means that the memory manager doesn't adjust GC behavior accordingly, which might be harmful in some cases. To change
this behavior, add the following [Experimental](components-stability.md) binary option to your `gradle.properties`:

```none
kotlin.native.binary.appStateTracking=enabled
```

It turns off a timer-based invocation of the garbage collector when the application is in the background, so GC is called
only when memory consumption becomes too high.
