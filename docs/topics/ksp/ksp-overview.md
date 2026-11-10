[//]: # (title: Kotlin Symbol Processing API)

<web-summary>Learn what Kotlin Symbol Processing (KSP) is, how KSP runs symbol processors that generate code during 
compilation, and which popular libraries support KSP.</web-summary>

Kotlin Symbol Processing (KSP) is a source code generation framework for Kotlin. With the KSP API, you can create
processors that inspect static information about your source code and generate new code from it. The most common use case
is generating code based on [annotations](annotations.md).

KSP aims to simplify the creation of lightweight compiler plugins. A compiler plugin built with KSP is called a _symbol
processor_, or _processor_ for short. KSP's well-defined API hides compiler changes, so you don't need to spend much effort
maintaining your processors. However, this approach comes with trade-offs. For example, KSP-based processors can't
examine expressions or statements, and they can't modify the source code.

Typical use cases for KSP-based processors include:

* Dependency injection ([Dagger](https://dagger.dev/dev-guide/ksp))
* Serialization ([Moshi](https://github.com/square/moshi))
* Database management ([Room](https://developer.android.com/training/data-storage/room))

To learn how to create your first KSP-based processor, see [Getting started with KSP](ksp-quickstart.md).

## Requirements

The latest KSP version, %kspVersion%, supports the following dependency versions:

| Dependency                      | Min and max versions                                   |
| ------------------------------- | ------------------------------------------------------ |
| Kotlin Gradle plugin (KGP)      | 2.3.20–2.4.x                                           |
| Android Gradle plugin (AGP)     | 8.13.0 or later                                        |
| Gradle                          | 8.13 or later. For AGP 9.0 or later, use Gradle 9.x.   |
| JDK                             | 17 or later                                            |

## How KSP works during compilation

KSP represents Kotlin source code as a hierarchy of symbols based on the [Kotlin grammar](https://kotlinlang.org/grammar/).
Processors then use these symbols to inspect declarations such as classes, functions, properties, and types.

> KSP models declarations and type information, but doesn't give processors access to expressions or
> function bodies.
>
{style="note"}

KSP fits into the compilation process as follows:

1. KSP loads the processors and runs them.
2. Processors use KSP to analyze the source code and its dependencies. They inspect symbols and types and generate 
   new files, such as source files and resources. Importantly, they cannot modify existing files.
3. The Kotlin compiler compiles the original source code together with the generated code.

To learn more about KSP, watch this video:

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## How KSP runs a processor

KSP uses an implementation of `SymbolProcessorProvider` as the entry point for creating a `SymbolProcessor` instance:

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

The `SymbolProcessor` interface contains the processing logic. KSP calls the `process()` function and provides a
`Resolver`, which the processor uses to access symbols in the source code:

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated>
    fun finish() {}
    fun onError() {}
}
```

For a step-by-step guide on how to implement and register a processor, see [Getting started with KSP](ksp-quickstart.md).

## Supported libraries

This table lists popular libraries and their various stages of support for KSP:

| Library          | Status                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Room             | [Officially supported](https://developer.android.com/jetpack/androidx/releases/room3#3.0.0)       |
| Moshi            | [Officially supported](https://github.com/square/moshi/)                                          |
| RxHttp           | [Officially supported](https://github.com/liujingxing/rxhttp)                                     |
| Kotshi           | [Officially supported](https://github.com/ansman/kotshi)                                          |
| Lyricist         | [Officially supported](https://github.com/adrielcafe/lyricist)                                    |
| Lich SavedState  | [Officially supported](https://github.com/line/lich/tree/master/savedstate)                       |
| gRPC Dekorator   | [Officially supported](https://github.com/mottljan/grpc-dekorator)                                |
| EasyAdapter      | [Officially supported](https://github.com/AmrDeveloper/EasyAdapter)                               |
| Koin Annotations | [Officially supported](https://github.com/InsertKoinIO/koin-annotations)                          |
| Glide            | [Officially supported](https://github.com/bumptech/glide)                                         | 
| Micronaut        | [Officially supported](https://docs.micronaut.io/5.2.x/core/#core-ksp)                            |
| Epoxy            | [Officially supported](https://github.com/airbnb/epoxy)                                           |
| Paris            | [Officially supported](https://github.com/airbnb/paris)                                           |
| Auto Dagger      | [Officially supported](https://github.com/ansman/auto-dagger)                                     |
| SealedX          | [Officially supported](https://github.com/skydoves/sealedx)                                       |
| Ktorfit          | [Officially supported](https://github.com/Foso/Ktorfit)                                           |
| Mockative        | [Officially supported](https://github.com/mockative/mockative)                                    |
| Kotest           | [Officially supported](https://github.com/kotest/kotest)                                          |
| Dagger           | [Officially supported](https://dagger.dev/dev-guide/ksp)                                          |
| Hilt             | [Officially supported](https://dagger.dev/dev-guide/ksp)                                          |
| DeeplinkDispatch | [Supported via airbnb/DeepLinkDispatch#323](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Auto Factory     | [Not yet supported](https://github.com/google/auto/issues/982)                                    |

## See also

* [Getting started with KSP](ksp-quickstart.md)
* [How KSP models Kotlin code](ksp-kotlin-model.md)
* [Java annotation processing to KSP reference](ksp-reference.md)
* [Incremental processing](ksp-incremental.md)
* [Multiple-round processing](ksp-multi-round.md)
* [KSP with Kotlin Multiplatform](ksp-multiplatform.md)
* [Migrate from kapt to KSP](ksp-kapt-migration.md)
* [Running KSP from the command line](ksp-command-line.md)
* [Example projects](https://github.com/google/ksp/tree/main/examples) in the KSP repository
