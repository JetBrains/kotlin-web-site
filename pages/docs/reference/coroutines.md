---
type: doc
layout: reference
category: "Syntax"
title: "Coroutines"
---

# Coroutines

> Coroutines are *experimental* in Kotlin 1.1. See details [below](#experimental-status-of-coroutines) 
{:.note}

_The term "coroutines" has been in use in Computer Science since late 1950'ies to denote "[a generalization of subroutines with non-preemptive multitasking](https://en.wikipedia.org/wiki/Coroutine)". We will not delve into the theoretic side of things here, though._

Some APIs initiate long-running operations (such as network IO, file IO, CPU- or GPU-intensive work, etc) and require the caller to block until they complete. Coroutines provide a way to avoid blocking a thread and replace it with a cheaper and more controllable operation: *suspension* of a coroutine.

## Blocking vs Suspending

Basically, coroutines are computations that can be *suspended* without *blocking a thread*. Blocking threads is often expensive, especially under high load, because only a relatively small number of threads is practical to keep around, so blocking one of them leads to some important work to be delayed.
 
Coroutine suspension is almost free, on the other hand. No context switch or any other involvement of the OS is required. And on top of that, suspension can be controlled by a user library to a large extent: as library authors, we can decide what happens upon a suspension and optimize/log/intercept according to our needs.     

Another difference is that coroutines can not be suspended at random instructions, but rather only at so called *suspension points*, which are calls to specially marked functions.  

## Suspending functions

A suspension happens when we call a function marked with the special modifier: `suspend`:

``` kotlin 
suspend fun doSomething(foo: Foo): Bar {
    ...
}
```

Such functions are called *suspending functions*, because calls to them may suspend a coroutine (the library can decide to proceed without suspension, if the result for the call in question is already available). Such functions can take parameters and return values in the same manner as regular functions, but they can only be called from coroutines and other suspending functions. In fact, to start a coroutines, there must be at least one suspending function, and it is usually anonymous (i.e. it is a suspending lambda). Let's look at an example from [kotlinx.coroutines](#the-kotlinx.coroutines-library):
   
``` kotlin
async(CommonPool) {
    val bar = doSomething(foo)
    ...
}
```

Here, `async()` is a regular function (not a suspension function), but the lambda that it takes as an argument is a suspension function:
 
``` kotlin
fun <T> async(..., block: suspend CoroutineScope.() -> T)
``` 

So, `doSomething()` can be called from this lambda, but can not be called from a regular function like `main()`:

``` kotlin
fun main(args: Array<String>) {
    doSomething() // ERROR: Suspending function called from a non-coroutine context 
}
```

Note: suspending functions can be virtual, when overriding them, the `suspend` modifier has to be specified. 

## The inner workings of coroutines

We are not trying here to give a complete explanation of how coroutines work under the hoods, but a rough sense of what's going on is rather important.

Since coroutines are completely implemented through a compilation technique (no support from the VM or OS side is required), suspension works through code transformation. Basically, every suspending function (optimizations may apply, but we'll not go into this here) is transformed to a state machine where states correspond to suspending calls. Right before a suspension, the next state is stored in a field of a compiler-generated class along with relevant local variables, etc. Upon resumption of tat coroutine, local variables are restored and the state machine proceeds from the state right after suspension.
     
A suspended coroutine can be stored and passed around as an object that keeps its suspended state and locals. The type of such objects is `Continuation`, and the overall code transformation described here corresponds to the classical [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style). Consequently, suspending functions take an extra parameter of type `Continuation` under the hoods.

More details on how coroutines work may be found in [this design document](https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md). Similar descriptions of async/await in other languages (such as C# or ECMAScript 2016) are relevant here, although the language features they implement may not be as general as Kotlin coroutines. 

## Standard APIs
 
 

### The `kotlinx.coroutines` library

Only core APIs related to coroutines are available from the Kotlin Standard Library. This mostly consists of core primitives and interfaces that all coroutine-based libraries are likely to use.   

Most application-level APIs based on coroutines are released as a separate library: [kotlinx.corotuines](https://github.com/Kotlin/kotlinx.coroutines). This library covers
 * Platform-agnostic asynchronous programming with `kotlinx-coroutines-core`
   * this module includes Go-like channels that support `select` and other convenient primitives
   * A comprehensive guide to this library is available [here](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md).
 * APIs based on `CompletableFuture` from JDK 8: `kotlinx-coroutines-jdk8`
 * Non-blocking IO (NIO) based on APIs from JDK 7 and higher: `kotlinx-coroutines-nio`
 * Support for Swing (`kotlinx-coroutines-swing`) and JavaFx (`kotlinx-coroutines-javafx`)
 * Support for RxJava: `kotlinx-coroutines-rx`
 
These libraries serve as both convenient APIs that make common tasks easy and end-to-end examples of how to build coroutine-based libraries. 

## Experimental status of coroutines

The design of coroutines is [experimental](compatibility.html#), which means that it may be changed in the upcoming releases. When compiling coroutines in Kotlin 1.1, a warning is reported by default: *The feature "coroutines" is experimental*. To remove the warning, you need to specify an [opt-in flag](diagnostics/experimental-coroutines.html).

Due to its experimental status, the coroutine-related API in the Standard Library is put under the `kotlin.coroutines.experimental` package. When the design is finalized and the experimental status lifted, the final API will be moved to `kotlin.coroutines`, and the experimental package will be kept around (probably in a separate artifact) for backward compatibility. 

**IMPORTANT NOTE**: We advise library authors to follow the same convention: add the "experimental" (e.g. `com.example.experimental`) suffix to your packages exposing coroutine-based APIs so that your library remains binary compatible. When the final API is released, follow these steps:
 * copy all the APIs to `com.example` (without the experimental suffix),
 * keep the experimental package around for backward compatibility. 
 
 This will minimize migration issues for your users. 
    
    