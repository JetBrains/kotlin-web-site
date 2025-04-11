[//]: # (title: Coroutines)

Applications often need to perform multiple tasks at the same time, such as responding to user input, loading data, or updating the screen.
To support this, applications rely on asynchronous programming, which allows operations to run independently without blocking each other.

The most common way to run tasks asynchronously is by using threads, which are independent paths of execution managed by the operating system.
However, threads are relatively heavy, and creating many of them can lead to performance issues.

In Kotlin, asynchronous programming is built around _coroutines_, which let you write asynchronous code in a natural, sequential style using suspending functions.
Coroutines are lightweight alternatives to threads.
They can suspend without blocking system resources and are cheap to create, making them better suited for fine-grained concurrency.

Most coroutine features are provided by the [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) library,
which includes tools for launching coroutines, handling concurrency, working with asynchronous streams, and more.

If you're new to coroutines in Kotlin, start with the [Coroutine basics](coroutines-basics.md) guide before diving into more complex topics.
It introduces the key concepts of suspending functions, coroutine builders, and structured concurrency through simple examples.

> Check out these sample projects to see how coroutines are used in practice: 
>
> * [kotlinx.coroutines examples and sources](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
> * [KotlinConf app](https://github.com/JetBrains/kotlinconf-app)
> 
{style="tip"}

## Add the kotlinx.coroutines library to your project

To include the `kotlinx.coroutines` library in your project, add the corresponding dependency configuration based on your build tool.

### Gradle

Add the following dependency to your `build.gradle(.kts)` file:

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>
</tabs>

### Maven

Add the following dependency to your `pom.xml` file.

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

## Coroutine concepts

The `kotlinx.coroutines` library provides the core building blocks for running tasks concurrently, coordinating work, and managing shared state.

### Suspending functions and coroutine builders

Coroutines in Kotlin are built on suspending functions, which allow code to pause and resume without blocking a thread.
The `suspend` keyword marks functions that can perform long-running operations asynchronously.

To launch new coroutines, you can use coroutine builders like [`launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) and [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html).
These builders let you run tasks concurrently, return results, or enforce structured lifecycles.

You can learn more about these builders in [Coroutine basics](coroutine-basics.md) and [Composing suspend functions](coroutines-and-channels.md).

### Coroutine context and behavior

Builder functions like `launch()` and `async()` automatically create a set of elements that define how the coroutine behaves:

* [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) interface: Tracks the coroutine’s lifecycle and enables structured concurrency.
* [`CoroutineDispatcher`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/): Controls where the coroutine runs, such as on a background thread or the main thread in UI applications.
* [`CoroutineExceptionHandler`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-exception-handler/): Handles uncaught exceptions.

Together, these elements make up the [_coroutine context_](coroutine-context-and-dispatchers.md), which is inherited by default from the coroutine’s parent.
This context forms a hierarchy that enables structured concurrency, where related coroutines can be [cancelled](cancellation-and-timeouts.md) together or [handle exceptions](exception-handling.md) as a group.

### Asynchronous flow and shared mutable state

Kotlin Coroutines provides the [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/) interface for working with asynchronous streams of values.
While suspending functions return only a single result, flows let you emit and collect multiple values over time without blocking a thread.
For more information, see [Asynchronous flow](flow.md)

For direct communication between coroutines, use [`Channel`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-channel/), which allows one coroutine to send values to another.
See [Channels](channels.md) for more information.

When multiple coroutines need to access or update the same data, they _share mutable state_.
Without coordination, this can lead to race conditions, where operations interfere with each other in unpredictable ways.
To safely manage shared mutable state, the `kotlinx.coroutines` library provides constructs like [`Mutex`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.sync/-mutex/) and atomic variables.
Learn more in [Shared mutable state and concurrency](shared-mutable-state-and-concurrency.md).

## What's next

* Learn the fundamentals of coroutines, suspending functions, and builders in the [Coroutine basics guide](coroutines-basics.md).
* Explore how to combine suspending functions and build coroutine pipelines in [Composing suspending functions](coroutine-context-and-dispatchers.md).
* Learn how to [debug coroutines](debug-coroutines-with-idea.md) using the built-in tools in IntelliJ IDEA.
* For flow-specific debugging, see [Debug Kotlin Flow using IntelliJ IDEA - tutorial](debug-flow-with-idea.md).
* See how to write unit tests for coroutine-based code on Android in [Testing Kotlin coroutines on Android](https://developer.android.com/kotlin/coroutines/test).
