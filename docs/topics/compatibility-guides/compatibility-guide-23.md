[//]: # (title: Compatibility guide for Kotlin 2.3)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.2 to Kotlin 2.3.

## Basic terms

In this document, we introduce several kinds of compatibility:

- _source_: source-incompatible change stops code that used to compile fine (without errors or warnings) from compiling
  anymore
- _binary_: two binary artifacts are said to be binary-compatible if interchanging them doesn't lead to loading or
  linkage errors
- _behavioral_: a change is said to be behavioral-incompatible if the same program demonstrates different behavior
  before and after applying the change

Remember that those definitions are given only for pure Kotlin. Compatibility of Kotlin code from the other languages
perspective (for example, from Java) is out of the scope of this document.

## Language

### Enable invokedynamic for annotated lambdas by default

> **Issue**: [KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Lambdas with annotations now use `invokedynamic` through `LambdaMetafactory` by default, aligning their behavior with Java lambdas.
> This affects reflection-based code that relied on retrieving annotations from generated lambda classes.
> To revert to the old behavior, use the `-Xindy-allow-annotated-lambdas=false` compiler option.
>
> **Deprecation cycle**:
>
> - 2.2.0: enable `invokedynamic` for annotated lambdas by default

## Standard library

### Deprecate `kotlin.native.Throws`

> **Issue**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.native.Throws` is deprecated; use the common [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) annotation instead. 
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning when using `kotlin.native.Throws`
> - 2.2.0: raise the warning to an error

## Kotlin/Native

## Tools

### Correct `setSource()` function in `KotlinCompileTool` to replace sources

> **Issue**: [KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) function in the [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) interface now replaces configured sources instead of adding to them.
> If you want to add sources without replacing existing ones, use the [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) function.
>
> **Deprecation cycle**:
>
> - 2.2.0: enable the new behavior
