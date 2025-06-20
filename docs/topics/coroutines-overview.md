[//]: # (title: Coroutines)

Applications often need to perform multiple tasks at the same time, such as responding to user input, loading data, or updating the screen.
To support this, they rely on concurrency, which allows operations to run independently without blocking each other.

The most common way to run tasks concurrently is by using threads, which are independent paths of execution managed by the operating system.
However, threads are relatively heavy, and creating many of them can lead to performance issues.

To support efficient concurrency, Kotlin uses asynchronous programming built around _coroutines_, which let you write asynchronous code in a natural, sequential style using suspending functions.
Coroutines are lightweight alternatives to threads.
They can suspend without blocking system resources and are resource-friendly, making them better suited for fine-grained concurrency.

Most coroutine features are provided by the [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) library,
which includes tools for launching coroutines, handling concurrency, working with asynchronous streams, and more.

If you're new to coroutines in Kotlin, start with the [Coroutine basics](coroutines-basics.md) guide before diving into more complex topics.
This guide introduces the key concepts of suspending functions, coroutine builders, and structured concurrency through simple examples:

<a href="coroutines-basics.md"><img src="get-started-coroutines.svg" width="700" alt="Get started with coroutines" style="block"/></a>

> Check out the [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) for a sample project to see how coroutines are used in practice.
> 
{style="tip"}

## Coroutine concepts

The `kotlinx.coroutines` library provides the core building blocks for running tasks concurrently, structuring coroutine execution, and managing shared state.

### Suspending functions and coroutine builders

Coroutines in Kotlin are built on suspending functions, which allow code to pause and resume without blocking a thread.
The `suspend` keyword marks functions that can perform long-running operations asynchronously.

To launch new coroutines, use coroutine builders like [`.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) and [`.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html).
These builders are extension functions on [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/),
which defines the coroutine’s lifecycle and provides the coroutine context.

You can learn more about these builders in [Coroutine basics](coroutines-basics.md) and [Composing suspend functions](coroutines-and-channels.md).

### Coroutine context and behavior

Launching a coroutine from a `CoroutineScope` creates a context that governs its execution.
Builder functions like `.launch()` and `.async()` automatically create a set of elements that define how the coroutine behaves:

* The [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) interface tracks the coroutine's lifecycle and enables structured concurrency.
* [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/) controls where the coroutine runs, such as on a background thread or the main thread in UI applications.
* [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/) handles uncaught exceptions.

These, along with other possible elements, make up the [_coroutine context_](coroutine-context-and-dispatchers.md), which is inherited by default from the coroutine's parent.
This context forms a hierarchy that enables structured concurrency, where related coroutines can be [canceled](cancellation-and-timeouts.md) together or [handle exceptions](exception-handling.md) as a group.

### Asynchronous flow and shared mutable state

Kotlin provides several ways for coroutines to communicate.
Use one of the following options based on how you want to share values between coroutines:

* [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) produces values only when a coroutine actively collects them.
* [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/) allows multiple coroutines to send and receive values, with each value delivered to exactly one coroutine.
* [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) continuously shares every value with all active collecting coroutines.

When multiple coroutines need to access or update the same data, they _share mutable state_.
Without coordination, this can lead to race conditions, where operations interfere with each other in unpredictable ways.
To safely manage shared mutable state, use [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/#) to wrap the shared data.
Then, you can update it from one coroutine and collect its latest value from others.
<!-- Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md). -->

For more information, see [Asynchronous flow](flow.md), [Channels](channels.md), and the [Coroutines and channels tutorial](coroutines-and-channels.md).

## What's next

* Learn the fundamentals of coroutines, suspending functions, and builders in the [Coroutine basics guide](coroutines-basics.md).
* Explore how to combine suspending functions and build coroutine pipelines in [Composing suspending functions](coroutine-context-and-dispatchers.md).
* Learn how to [debug coroutines](debug-coroutines-with-idea.md) using built-in tools in IntelliJ IDEA.
* For flow-specific debugging, see the [Debug Kotlin Flow using IntelliJ IDEA](debug-flow-with-idea.md) tutorial.
* Read the [Guide to UI programming with coroutines](https://github.com/Kotlin/kotlinx.coroutines/blob/master/ui/coroutines-guide-ui.md) to learn about coroutine-based UI development.
* Review [best practices for using coroutines in Android](https://developer.android.com/kotlin/coroutines/coroutines-best-practices).
* Check out the [`kotlinx.coroutines` API reference](https://kotlinlang.org/api/kotlinx.coroutines/).
