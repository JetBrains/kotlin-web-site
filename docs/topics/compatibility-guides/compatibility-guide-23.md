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

### Drop support in `-language-version` for 1.8 and 1.9

> **Issue**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **Component**: Compiler
>
> **Incompatible change type**: source
>
> **Short summary**: Starting with Kotlin 2.3, the compiler no longer supports [`-language-version=1.8`](compiler-reference.md#language-version-version).
> Support for `-language-version=1.9` is also removed for non-JVM platforms.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when using `-language-version` with versions 1.8 and 1.9.
> - 2.3.0: raise the warning to an error for language version 1.8 on all platforms and for language version 1.9 on non-JVM platforms.

### Report upper-bound constraint violation errors for inferred types with typealiases

> **Issue**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Previously, the compiler never reported errors about upper-bound violation constraints for the inferred types. This
> has been fixed in Kotlin 2.3.0 so that the error is reported consistently across all type parameters.
>
> **Deprecation cycle**:
>
> - 2.2.20: report deprecation warnings for bounds violations by implicit type arguments
> - 2.3.0: raise the warning to an error for `UPPER_BOUND_VIOLATED` on implicit type arguments

### Prohibit `@JvmSerializableLambda` annotation on `inline` and `crossinline` lambdas

> **Issue**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Prohibit adding the `@JvmSerializableLambda` annotation on `inline` and `crossinline` lambdas
> because it has no effect. `inline` and `crossinline` lambdas are not serializable.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning when the `@JvmSerializableLambda` is applied to `inline` and `crossinline` lambdas
> - 2.3.0: raise the warning to an error; this change can be enabled in progressive mode

### Prohibit delegating a Kotlin interface to a Java class when the generic signatures don't match

> **Issue**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 forbids delegation to a Java class that implements a generic interface method with
> a non-generic override. Previously, allowing this behavior led to type mismatches and `ClassCastException` reported at runtime.
> This change shifts the error from runtime to compile time.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate unintended use of `return` in expression-bodied functions without explicit return type

> **Issue**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now deprecates using `return` inside expression bodies when the function's return type is not
> explicitly declared.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning
> - 2.4.0: raise the warning to an error

### Prohibit inheritance from nullable supertypes introduced via typealias

> **Issue**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when attempting to inherit from a nullable typealias, consistent with
> how it already handles direct nullable supertypes.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning
> - 2.3.0: raise the warning to an error

### Unify generic signature generation for top-level lambdas and call arguments

> **Issue**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **Component**: Reflection
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 2.3 uses the same type-checking logic for top-level lambdas as it does for lambdas passed 
> as call arguments, ensuring consistent generic signature generation across both cases.
>
> **Deprecation cycle**:
>
> - 2.3.0: introduce new behavior; not applicable for progressive mode

### Prohibit reified type parameters from being inferred as intersection types

> **Issue**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3 prohibits situations where a reified type parameter is inferred to an intersection type, 
> due to the risk of incorrect runtime behavior.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning when a reified type parameter is inferred to an intersection type
> - 2.3.0: raise the warning to an error

### Prohibit exposing less-visible types through type parameter bounds

> **Issue**: [KTLC-275](https://youtrack.jetbrains.com/issue/KTLC-275)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3 forbids using type parameter bounds that expose types with more restrictive visibility
> than the function or declaration itself, aligning the rules for functions with those already applied to classes.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning on the problematic type parameter bound
> - 2.3.0: raise the warning to an error

## Standard library

### Deprecate misleading Char-to-number conversions and introduce explicit digit and code APIs

> **Issue**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3 deprecates `Char.toX()` and `X.toChar()` conversions for numeric types and introduces new,
> explicit APIs for accessing a character's code and digit value.
>
> **Deprecation cycle**:
>
> - 1.4.30: introduce new functions as Experimental
> - 1.5.0: promote the new functions to Stable; report warnings for old functions with suggestions for replacements
> - 2.3.0: raise the warnings to errors

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

### Deprecate `String.subSequence(start, end)` function

> **Issue**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `String.subSequence(start, end)` function is deprecated. Use the [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) function instead.
>
> **Deprecation cycle**:
>
> - 1.0: report a warning when using `String.subSequence(start, end)`
> - 2.3.0: raise the warning to an error

### Deprecate `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions

> **Issue**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
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

### Hide `InputStream.readBytes(Int)` function

> **Issue**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
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
> **Incompatible change type**: behavioral
>
> **Short summary**: When formatting an exception stacktrace, no additional causes are printed once a previously seen exception cause has already been printed.
>
> **Deprecation cycle**:
>
> - 2.3.20: Unify Kotlin/Native exception stacktrace formatting with other Kotlin platforms

### Correct `Iterable<T>.intersect()` and `Iterable<T>.subtract()` behavior for referential-equality collections

> **Issue**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) and [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) functions now test membership for each
> receiver element before adding it to the result set. The result set compares elements using `Any::equals`,
> ensuring correct results even when the argument collection uses referential equality (for example, `IdentityHashMap.keys˙).
>
> **Deprecation cycle**:
>
> - 2.3.0: enable the new behavior

## Tools

### Unsupported KGP version warning when using `kotlin-dsl` and `kotlin("jvm")` plugins

> **Issue**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: In Kotlin 2.3, if you use both the `kotlin-dsl` **and** the `kotlin("jvm")` plugin in your Gradle
> project, you may see a Gradle warning about an unsupported Kotlin Gradle plugin (KGP) version.
>
> **Deprecation cycle**:
>
> - 2.3.0: introduce a diagnostic that detects when the `kotlin-dsl` plugin is used with an incompatible language or API version of the compiler.
> 
> **Migration steps**:
> 
> In general, we don't recommend using both the `kotlin-dsl` and the `kotlin("jvm")` plugins in the same Gradle project. This setup isn't supported.
> 
> For convention plugins, precompiled script plugins or any other form of unpublished build logic, you have three options:
> 
> 1. Don't apply the `kotlin("jvm")` plugin explicitly. Instead, let the `kotlin-dsl` plugin automatically provide a compatible KGP version.
> 2. If you want to apply the `kotlin("jvm")` plugin explicitly, use the [`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) constant to specify the embedded Kotlin version.
>
>     To upgrade the embedded Kotlin and language versions, update your Gradle version. You can find compatible Gradle versions in Gradle's [Compatibility Notes for Kotlin](https://docs.gradle.org/current/userguide/compatibility.html#kotlin).
> 
> 3. Don't use the `kotlin-dsl` plugin. This may be more appropriate for binary plugins that aren't tied to a specific Gradle version.
>
> As a last resort, you can configure your project to use language version 2.1 or higher, which overrides the conflicting behavior of the `kotlin-dsl` plugin. However, we strongly recommend not doing so.
> 
> If you experience difficulties during migration, reach out in the #gradle channel in our [Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) for support.


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
