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

## Suspending functions

Some APIs initiate long-running operations (such as network IO, file IO, CPU- or GPU-intensive work, etc) and require the caller to block until they complete. Coroutines provide a way to avoid blocking a thread and replace it with a cheaper and more controllable operation: *suspension* of a coroutine.

A suspension happens when we call a function marked with the special modifier: `suspend`:

``` kotlin 
suspend fun foo(bar: Bar): Baz {
    ...
}
```

Such functions are called *suspending functions*, because calls to them suspend a coroutine. They can take parameters and return values in the same manner as regular functions, but they can only be called from other suspending functions (including suspending lambdas). 
 
The rule above is recursive, and the Standard Library provides a set of entry-points which initiate coroutines



## The `kotlinx.coroutines` library

Only core APIs related to coroutines are available from the Kotlin Standard Library. This mostly consists of core primitives and interfaces that all coroutine-based libraries are likely to use.   

Most application-level APIs based on coroutines are released as a separate library: [kotlinx.corotuines](https://github.com/Kotlin/kotlinx.coroutines). This library covers
 * Platform-agnostic asynchronous programming with `kotlinx-coroutines-core`
   * this module includes Go-like channels that support `select` and other convenient primitives
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
    
    