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

### Remove language versions 1.8 and 1.9

> **Issue**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3 introduces language version 2.3 and removes support for language version 1.8.
> Support for language version 1.9 is also removed for non-JVM platforms. Language versions 1.8 and 1.9 are deprecated.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning for language versions 1.8 and 1.9
> - 2.3.0: raise the warning to an error for language version 1.8 on all platforms and for language version 1.9 on non-JVM platforms.

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

### Deprecate `String.subSequence(start, end)` function

> **Issue**: [KT-74493](https://youtrack.jetbrains.com/issue/KT-74493)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `String.subSequence(start, end)` function is deprecated. Use the [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) function instead.
>
> **Deprecation cycle**:
>
> - 2.3.0: report an error when using `String.subSequence(start, end)`

### Deprecate `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions

> **Issue**: [KT-81078](https://youtrack.jetbrains.com/issue/KT-81078)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions are deprecated. 
> Use the [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) and [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) functions instead.
>
> **Deprecation cycle**:
>
> - 1.4.20: report a warning when using `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions
> - 2.3.0: raise the warning to an error

### Deprecate `Number.toChar()` function

> **Issue**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `Number.toChar()` function is deprecated. Use `toInt().toChar()` or the `Char` constructor instead.
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning when using the `Number.toChar()` function
> - 2.3.0: raise the warning to an error

### Hide `InputStream.readBytes(Int)` function

> **Issue**: [KT-79192](https://youtrack.jetbrains.com/issue/KT-79192)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: After being deprecated for a long time, the `InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` function is hidden.
>
> **Deprecation cycle**:
>
> - 1.3.0: report a warning
> - 1.5.0: raise the warning to an error
> - 2.3.0: hide the function

### Unify Kotlin/Native stacktrace printing with other platforms

> **Issue**: [KT-81431](https://youtrack.jetbrains.com/issue/KT-81431)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: behavior
>
> **Short summary**: When formatting an exception stacktrace, no additional causes are printed once a previously seen exception cause has already been printed.
>
> **Deprecation cycle**:
>
> - 2.3.20: Unify Kotlin/Native exception stacktrace formatting with other Kotlin platforms

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
