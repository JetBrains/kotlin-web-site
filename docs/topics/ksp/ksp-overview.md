[//]: # (title: Kotlin Symbol Processing API)

<web-summary>Learn what Kotlin Symbol Processing (KSP) is, how KSP runs symbol processors that generate code during 
compilation, and which popular libraries support KSP.</web-summary>

Kotlin Symbol Processing (KSP) is a framework for Kotlin source code generation. With the KSP API, you can create
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

| Dependency                  | Supported versions                                                                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kotlin Gradle plugin (KGP)  | 2.3.20–2.4.x                                                                                                                                                      |
| Android Gradle plugin (AGP) | 8.13.0 or later                                                                                                                                                   |
| Gradle                      | 8.13 or later. For Android projects, also check the [AGP and Gradle compatibility table](https://developer.android.com/build/releases/about-agp#updating-gradle). |
| JDK                         | 17 or later                                                                                                                                                       |

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

The following table lists popular libraries and their various stages of support for KSP:

| Library          | Status                                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Room 2.x         | [Officially supported](https://developer.android.com/jetpack/androidx/releases/room#declaring_dependencies)                |
| Room 3.x         | [Officially supported, KSP required](https://developer.android.com/jetpack/androidx/releases/room3#declaring_dependencies) |
| Moshi            | [Officially supported](https://github.com/square/moshi#codegen)                                                            |
| RxHttp           | [Officially supported](https://github.com/liujingxing/rxhttp#required)                                                     |
| Kotshi           | [Officially supported](https://github.com/ansman/kotshi#download)                                                          |
| Lyricist         | [Officially supported](https://github.com/adrielcafe/lyricist#import-to-your-project)                                      |
| Lich SavedState  | [Officially supported](https://github.com/line/lich/tree/master/savedstate#set-up)                                         |
| gRPC Dekorator   | [Officially supported](https://github.com/mottljan/grpc-dekorator#installation)                                            |
| EasyAdapter      | [Officially supported](https://github.com/AmrDeveloper/EasyAdapter/blob/master/docs/install.md)                            |
| Glide            | [Officially supported](https://bumptech.github.io/glide/doc/download-setup.html#kotlin---ksp)                              |
| Micronaut        | [Officially supported](https://docs.micronaut.io/5.2.x/core/#core-ksp)                                                     |
| Epoxy            | [Officially supported](https://github.com/airbnb/epoxy#kotlin-with-ksp-recommended)                                        |
| Paris            | [Officially supported](https://github.com/airbnb/paris#installation)                                                       |
| Auto Dagger      | [Officially supported](https://auto-dagger.ansman.se/latest/getting-started/#installation)                                 |
| SealedX          | [Officially supported](https://github.com/skydoves/sealedx#1-enable-ksp-in-your-module)                                    |
| Ktorfit          | [Officially supported](https://foso.github.io/Ktorfit/installation/#gradle-plugins)                                        |
| Mockative        | [Officially supported](https://github.com/mockative/mockative#installation-for-multiplatform-projects)                     |
| Kotest           | [Officially supported](https://kotest.io/docs/framework/project-setup.html)                                                |
| Dagger           | [Officially supported](https://dagger.dev/dev-guide/ksp)                                                                   |
| Hilt             | [Officially supported](https://dagger.dev/dev-guide/ksp)                                                                   |
| DeepLinkDispatch | [Officially supported](https://github.com/airbnb/DeepLinkDispatch#ksp)                                                     |
| Motif            | [Alpha](https://github.com/uber/motif/blob/main/CHANGELOG.md#040-alpha01)                                                  |
| Auto Factory     | [Not yet supported](https://github.com/google/auto/issues/982)                                                             |
| Koin Annotations | [KSP processor is deprecated in favor of the Koin Compiler Plugin](https://insert-koin.io/docs/setup/annotations-ksp/)                      |

## See also

* Learn how to [add a processor to your project or create your own](ksp-quickstart.md).
* Learn how [KSP represents source code as symbols and when to resolve types](ksp-kotlin-model.md).
* Learn how to [use KSP in a Kotlin Multiplatform project](ksp-multiplatform.md).
* Find the [KSP equivalents of Java annotation processing APIs](ksp-reference.md).
* Learn how to [migrate your annotation processors from kapt to KSP](ksp-kapt-migration.md).
* Explore the [example projects](https://github.com/google/ksp/tree/main/examples) in the KSP repository.
