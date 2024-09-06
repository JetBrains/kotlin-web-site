[//]: # (title: Migrate to the new memory manager)

> Support for the legacy memory manager has been completely removed in Kotlin 1.9.20. Migrate your projects to 
> the current memory model, enabled by default since Kotlin 1.7.20.
>
{style="note"}

This guide compares the new [Kotlin/Native memory manager](native-memory-manager.md) with the legacy one and
describes how to migrate your projects.

The most noticeable change in the new memory manager is lifting restrictions on object sharing. You don't
need to freeze objects to share them between threads, specifically:

* Top-level properties can be accessed and modified by any thread without using `@SharedImmutable`.
* Objects passing through interop can be accessed and modified by any thread without freezing them.
* `Worker.executeAfter` no longer requires operations to be frozen.
* `Worker.execute` no longer requires producers to return an isolated object subgraph.
* Reference cycles containing `AtomicReference` and `FreezableAtomicReference` do not cause memory leaks.

Apart from easy object sharing, the new memory manager also brings other major changes:

* Global properties are initialized lazily when the file they are defined in is accessed first. Previously global
  properties were initialized at the program startup. As a workaround, you can mark
  properties that must be initialized at the program start with the `@EagerInitialization` annotation. Before using, check
  its [documentation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/).
* `by lazy {}` properties support thread-safety modes and do not handle unbounded recursion.
* Exceptions that escape `operation` in `Worker.executeAfter` are processed like in other runtime parts, by trying to
  execute a user-defined unhandled exception hook or terminating the program if the hook was not found or failed with
  an exception itself.
* Freezing is deprecated and always disabled.

Follow these guidelines to migrate your projects from the legacy memory manager:

## Update Kotlin

The new Kotlin/Native memory manager has been enabled by default since Kotlin 1.7.20. Check the Kotlin version and [update
to the latest one](releases.md#update-to-a-new-release) if necessary.

## Update dependencies

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>Update to version 1.6.0 or later. Do not use versions with the <code>native-mt</code> suffix.</p>
        <p>There are also some specifics with the new memory manager you should keep in mind:</p>
        <list>
            <li>Every common primitive (channels, flows, coroutines) works through the Worker boundaries, since freezing is not required.</li>
            <li><code>Dispatchers.Default</code> is backed by a pool of Workers on Linux and Windows and by a global queue on Apple targets.</li>
            <li>Use <code>newSingleThreadContext</code> to create a coroutine dispatcher that is backed by a Worker.</li>
            <li>Use <code>newFixedThreadPoolContext</code> to create a coroutine dispatcher backed by a pool of <code>N</code> Workers.</li>
            <li><code>Dispatchers.Main</code> is backed by the main queue on Darwin and by a standalone Worker on other platforms.</li>
        </list>
    </def>
    <def title="Ktor">
        Update to version 2.0 or later.
    </def>
    <def title="Other dependencies">
        <p>The majority of libraries should work without any changes, however, there might be exceptions.</p>
        <p>Make sure that you update dependencies to the latest versions, and there is no difference between library versions for the legacy and the new memory manager.</p>
    </def>
</deflist>

## Update your code

To support the new memory manager, remove usages of the affected API:

| Old API                                                                                                                                         | What to do                                                                                                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                                  | You can remove all usages, though there are no warnings for using this API in the new memory manager.                                                             |
| [The `FreezableAtomicReference` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/)      | Use [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/) instead.                                        |
| [The `FreezingException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)                     | Remove all usages.                                                                                                                                                |                                                                                                      |
| [The `InvalidMutabilityException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/)  | Remove all usages.                                                                                                                                                |
| [The `IncorrectDereferenceException` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/)       | Remove all usages.                                                                                                                                                |
| [The `freeze()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                                    | Remove all usages.                                                                                                                                                |
| [The `isFrozen` property](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                                 | You can remove all usages. Since freezing is deprecated, the property always returns `false`.                                                                     |                                                                                                                  
| [The `ensureNeverFrozen()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html)            | Remove all usages.                                                                                                                                                |
| [The `atomicLazy()` function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                           | Use [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) instead.                                                                            |
| [The `MutableData` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                                 | Use any regular collection instead.                                                                                                                               |
| [The `WorkerBoundReference<out T : Any>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | Use `T` directly.                                                                                                                                                 |
| [The `DetachedObjectGraph<T>` class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/)             | Use `T` directly. To pass the value through the C interop, use [the StableRef class](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/). |

## What's next

* [Learn about the new memory manager](native-memory-manager.md)
* [Configure integration with iOS](native-ios-integration.md)