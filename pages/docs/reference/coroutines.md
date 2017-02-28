---
type: doc
layout: reference
category: "Syntax"
title: "Coroutines"
---

# Coroutines

> Coroutines are *experimental* in Kotlin 1.1. See details [below](#experimental-status-of-coroutines) 
{:.note}

Some APIs initiate long-running operations (such as network IO, file IO, CPU- or GPU-intensive work, etc) and require the caller to block until they complete. Coroutines provide a way to avoid blocking a thread and replace it with a cheaper and more controllable operation: *suspension* of a coroutine.

## Blocking vs Suspending

Basically, coroutines are computations that can be *suspended* without *blocking a thread*. Blocking threads is often expensive, especially under high load, because only a relatively small number of threads is practical to keep around, so blocking one of them leads to some important work to be delayed.
 
Coroutine suspension is almost free, on the other hand. No context switch or any other involvement of the OS is required. And on top of that, suspension can be controlled by a user library to a large extent: as library authors, we can decide what happens upon a suspension and optimize/log/intercept according to our needs.     

Another difference is that coroutines can not be suspended at random instructions, but rather only at so called *suspension points*, which are calls to specially marked functions.  

## Suspending functions

A suspension happens when we call a function marked with the special modifier, `suspend`:

``` kotlin 
suspend fun doSomething(foo: Foo): Bar {
    ...
}
```

Such functions are called *suspending functions*, because calls to them may suspend a coroutine (the library can decide to proceed without suspension, if the result for the call in question is already available). Suspending functions can take parameters and return values in the same manner as regular functions, but they can only be called from coroutines and other suspending functions. In fact, to start a coroutine, there must be at least one suspending function, and it is usually anonymous (i.e. it is a suspending lambda). Let's look at an example, a simplified `async()` function (from the [`kotlinx.coroutines`](#other-high-level-apis-kotlinxcoroutines) library):
    
``` kotlin
fun <T> async(block: suspend () -> T)
``` 

Here, `async()` is a regular function (not a suspending function), but the `block` parameter has a function type with the `suspend` modifier: `suspend () -> T`. So, when we pass a lambda to `async()`, it is a *suspending lambda*, and we can call a suspending function from it:
   
``` kotlin
async {
    doSomething(foo)
    ...
}
```

To continue the analogy, `await()` can be a suspending function (hence also callable from within an `async {}` block) that suspends a coroutine until some computation is done and returns its result:

``` kotlin
async {
    ...
    val result = computation.await()
    ...
}
```

More information on how actual `async/await` functions work in `kotlinx.coroutines` can be found [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#composing-suspending-functions).

Note that suspending functions `await()` and `doSomething()` can not be called from a regular function like `main()`:

``` kotlin
fun main(args: Array<String>) {
    doSomething() // ERROR: Suspending function called from a non-coroutine context 
}
```

Also note that suspending functions can be virtual, and when overriding them, the `suspend` modifier has to be specified:
 
``` kotlin
interface Base {
    suspend fun foo()
}

class Derived: Base {
    override suspend fun foo() { ... }
}
``` 

### `@RestrictsSuspension` annotation
 
Extensions functions and lambdas can also be marked `suspend`, just like regular functions. This enables creation of [DSLs](type-safe-builders.html) and other APIs that users can extend. In some cases the library author needs to prevent the user from adding *new ways* of suspending a coroutine. 

To achieve this, the [`@RestricsSuspension`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/-restricts-suspension/index.html) annotation may be used. When a receiver class `R` is annotated with it, all suspending extensions are required to delegate to either members of `R` or other extensions to it. Since extensions can't delegate to each other indefinitely (the program would not terminate), this guarantees that all suspensions happen through calling members of `R` that the author of the library can fully control.

This is relevant in the _rare_ cases when every suspension is handled in a special way in the library. For example, when implementing generators through the [`buildSequence()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html) function described below, we need to make sure that any suspending call in the coroutine ends up calling either `yield()` or `yieldAll()` and not any other function. See the sources [on Github](https://github.com/JetBrains/kotlin/blob/master/libraries/stdlib/src/kotlin/coroutines/experimental/SequenceBuilder.kt).   

## The inner workings of coroutines

We are not trying here to give a complete explanation of how coroutines work under the hood, but a rough sense of what's going on is rather important.

Since coroutines are completely implemented through a compilation technique (no support from the VM or OS side is required), suspension works through code transformation. Basically, every suspending function (optimizations may apply, but we'll not go into this here) is transformed to a state machine where states correspond to suspending calls. Right before a suspension, the next state is stored in a field of a compiler-generated class along with relevant local variables, etc. Upon resumption of that coroutine, local variables are restored and the state machine proceeds from the state right after suspension.
     
A suspended coroutine can be stored and passed around as an object that keeps its suspended state and locals. The type of such objects is `Continuation`, and the overall code transformation described here corresponds to the classical [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style). Consequently, suspending functions take an extra parameter of type `Continuation` under the hood.

More details on how coroutines work may be found in [this design document](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md). Similar descriptions of async/await in other languages (such as C# or ECMAScript 2016) are relevant here, although the language features they implement may not be as general as Kotlin coroutines. 

## Experimental status of coroutines

The design of coroutines is [experimental](compatibility.html#experimental-features), which means that it may be changed in the upcoming releases. When compiling coroutines in Kotlin 1.1, a warning is reported by default: *The feature "coroutines" is experimental*. To remove the warning, you need to specify an [opt-in flag](/docs/diagnostics/experimental-coroutines.html).

Due to its experimental status, the coroutine-related API in the Standard Library is put under the `kotlin.coroutines.experimental` package. When the design is finalized and the experimental status lifted, the final API will be moved to `kotlin.coroutines`, and the experimental package will be kept around (probably in a separate artifact) for backward compatibility. 

**IMPORTANT NOTE**: We advise library authors to follow the same convention: add the "experimental" (e.g. `com.example.experimental`) suffix to your packages exposing coroutine-based APIs so that your library remains binary compatible. When the final API is released, follow these steps:
 * copy all the APIs to `com.example` (without the experimental suffix),
 * keep the experimental package around for backward compatibility. 
 
This will minimize migration issues for your users. 

## Standard APIs
 
Coroutines come in three main ingredients: 
 - language support (i.s. suspending functions, as described above),
 - low-level core API in the Kotlin Stadard Library,
 - high-level APIs that can be used directly in the user code.
 
## Low-level API: `kotlin.coroutines` 

Low-level API is relatively small and should never be used other than for creating higher-level libraries. It consists of two main packages: 
- [`kotlin.coroutines.experimental`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/index.html) with main types and primitives such as
  - [`createCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/create-coroutine.html)
  - [`startCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/start-coroutine.html)
  - [`suspendCoroutine()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/suspend-coroutine.html)
- [`kotlin.coroutines.experimental.intrinsics`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/index.html) with even lower-level intrinsics such as [`suspendCoroutineOrReturn`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental.intrinsics/suspend-coroutine-or-return.html)
 
 More details about the usage of these APIs can be found [here](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md).

### High-level API in `kotlin.coroutines`
  
The only "application-level" functions in `kotlin.coroutines.experimental` are
- [`buildSequence()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-sequence.html)
- [`buildIterator()`](/api/latest/jvm/stdlib/kotlin.coroutines.experimental/build-iterator.html)

These are shipped within `kotlin-stdlib` because they are related to sequences. In fact, these functions (and we can limit ourselves to `buildSequence()` alone here) implement _generators_, i.e. provide a way to cheaply build a lazy sequence:
 
``` kotlin
val fibonacciSeq = buildSequence {
    var a = 0
    var b = 1
    
    yield(1)
    
    while (true) {
        yield(a + b)
        
        val tmp = a + b
        a = b
        b = tmp
    }
}
```
  
This generates a lazy, potentially infinite Fibonacci sequence by creating a coroutine that yields consecutive Fibonacci numbers by calling the `yield()` function. When iterating over such a sequence every step of the iterator executes another portion of the coroutine that generates the next number. So, we can take any finite list of numbers out of this sequence, e.g. `fibonacciSeq.take(8).toList()` results in `[1, 1, 2, 3, 5, 8, 13, 21]`. And coroutines are cheap enough to make this practical. 
   
To yield a collection (or sequence) of values at once, the `yieldAll()` function is available.

The `buildIterator()` works similarly to `buildSequence()`, but returns a lazy iterator.

One can add custom yielding logic to `buildSequence()` by writing suspending extensions to the `SequenceBuilder` class that bares the `@RestrictsSuspension` annotation described [above](#restrictssuspension-annotation).
  
### Other high-level APIs: `kotlinx.coroutines`

Only core APIs related to coroutines are available from the Kotlin Standard Library. This mostly consists of core primitives and interfaces that all coroutine-based libraries are likely to use.   

Most application-level APIs based on coroutines are released as a separate library: [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines). This library covers
 * Platform-agnostic asynchronous programming with `kotlinx-coroutines-core`
   * this module includes Go-like channels that support `select` and other convenient primitives
   * a comprehensive guide to this library is available [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md).
 * APIs based on `CompletableFuture` from JDK 8: `kotlinx-coroutines-jdk8`
 * Non-blocking IO (NIO) based on APIs from JDK 7 and higher: `kotlinx-coroutines-nio`
 * Support for Swing (`kotlinx-coroutines-swing`) and JavaFx (`kotlinx-coroutines-javafx`)
 * Support for RxJava: `kotlinx-coroutines-rx`
 
These libraries serve as both convenient APIs that make common tasks easy and end-to-end examples of how to build coroutine-based libraries. 