[//]: # (title: Compatibility guide for Kotlin 2.5.x)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.4 to Kotlin 2.5.
This document also includes information about tool-related changes.

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

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning
> - 2.5.0: raise the warning to an error
-->

### Report type variance conflicts in definitely non-nullable and flexible types

> **Issue**: [KTLC-392](https://youtrack.jetbrains.com/issue/KTLC-392)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports a variance conflict error when a type parameter is used in a position that
> conflicts with its declared variance inside a [definitely non-nullable type](generics.md#definitely-non-nullable-types), such as `T & Any`,
> or inside a flexible type, such as the `T!` type inferred from a Java call.
> Previously, the compiler didn't check these types, which made it possible to accidentally violate variance restrictions.
>
> To temporarily use the previous behavior, add the `-XXLanguage:-ReportTypeVarianceConflictsInDnnAndFlexible` compiler option.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for type variance conflicts in definitely non-nullable and flexible types

### Report conflicting inherited implementations of functions named `toString`, `equals`, or `hashCode`

> **Issue**: [KTLC-415](https://youtrack.jetbrains.com/issue/KTLC-415)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: When a class inherits the same function from a common superinterface through several delegated interfaces,
> the compiler reports an error because the class has more than one implementation of that function.
> Previously, the compiler didn't report this error for functions named `toString`, `equals`, or `hashCode` that also have
> an extension receiver or context parameters, because it treated them as the corresponding functions of `Any`.
> To migrate, override the function explicitly in the class.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for conflicting inherited implementations of such functions

### Disable unsound non-null smart casts after equality checks

> **Issue**: [KTLC-410](https://youtrack.jetbrains.com/issue/KTLC-410)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: After an equality (`==`) or identity (`===`) check, the compiler could smart cast a nullable operand
> to a non-nullable type when the other operand had a type parameter type with nullable upper bounds or a flexible type
> from Java. These smart casts were unsound and could lead to a `NullPointerException` at runtime.
>
> Kotlin 2.5.0 considers that such operands can be `null`: type parameters are treated as non-nullable only if they have
> a non-nullable upper bound, and flexible types are treated as nullable. As a result, code that relied on these smart casts
> no longer compiles. To migrate, add an explicit null check, or annotate the relevant Java declarations with `@NotNull`.
>
> **Deprecation cycle**:
>
> - 2.5.0: disable the unsound smart casts

### Report repeated annotations on expressions after expect and actual annotation resolution

> **Issue**: [KTLC-409](https://youtrack.jetbrains.com/issue/KTLC-409)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: In multiplatform projects, the compiler now reports a `REPEATED_ANNOTATION` error when two annotations on the same expression
> resolve to the same non-repeatable annotation class on a platform.
> For example, this happens when an `expect annotation class` is actualized by a typealias to another annotation class that's already
> applied to the same expression.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for annotations on expressions that become repeated after expect and actual annotation resolution

### Change the type of class literals for unbounded reified type parameters

> **Issue**: [KTLC-360](https://youtrack.jetbrains.com/issue/KTLC-360)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: For a reified type parameter `T` without a non-nullable upper bound, the type of the `T::class` expression
> changes from `KClass<T>` to `KClass<T & Any>`. The previous type violated the upper bound of the `KClass` type parameter.
> Accordingly, the signature of the [`.java`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/java.html) extension property
> changes to `KClass<T & Any>.java: Class<T>`.
>
> The behavior of `T::class` doesn't change, but in rare cases the new types can lead to type mismatches or select a different
> overload. For example, when you assign `T::class.java` to a variable without an explicit type, the variable type becomes
> `Class<T & Any>` instead of `Class<T>`.
> To migrate, specify the expected type explicitly, such as `val c: Class<T> = T::class.java`, or specify the type arguments of the called function explicitly.
>
> **Deprecation cycle**:
>
> - 2.5.0: introduce the new type for class literals of unbounded reified type parameters

### Preserve upper bounds of intersection types after the `!!` operator

> **Issue**: [KTLC-405](https://youtrack.jetbrains.com/issue/KTLC-405)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: Kotlin 2.5.0 fixes type inference for expressions with the [not-null assertion operator `!!`](null-safety.md#not-null-assertion-operator) whose type is
> an intersection type with an upper bound. Previously, the compiler lost the upper bound,
> so for `fun <T : Number> select(vararg t: T): T?`, the type of `select(1.0, 1L)!!` was approximated to `Any` instead of `Number`.
>
> As a result, declarations without an explicit type can get a more precise type. This can lead to type mismatches in existing code,
> and it can change the signatures of public declarations after recompilation.
> To keep the previous type, specify it explicitly.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

### Parse `error` before local declarations as a modifier

> **Issue**: [KTLC-420](https://youtrack.jetbrains.com/issue/KTLC-420)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The [rich errors proposal](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0462-rich-errors.md)
> introduces `error` as a soft keyword modifier.
> Starting with Kotlin 2.5.0, when a standalone `error` expression is directly followed by a local class or function declaration,
> the parser treats `error` as a modifier of that declaration, such as `error class NoData`.
> As a result, code that uses a standalone `error` expression before a local declaration no longer compiles.
>
> **Deprecation cycle**:
>
> - 2.5.0: parse `error` before local declarations as a modifier

### Normalize NaN values produced by compile-time constant evaluation

> **Issue**: [KTLC-419](https://youtrack.jetbrains.com/issue/KTLC-419)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: When the compiler evaluates a constant expression to NaN, for example, in an initializer of a `const val` property
> or in an annotation argument, it now always produces the standard `Float.NaN` or `Double.NaN` bit pattern.
> Previously, the bit pattern of such NaN values depended on the platform where the code was compiled.
> This change only affects code that relies on the exact bit pattern of NaN values, for example, through the `toRawBits()` function.
>
> To use the previous behavior, add the `-Xdo-not-normalize-nan-values-in-const-context` compiler option.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

## Standard library

### Make equality of ranges and progressions symmetric

> **Issue**: [KTLC-421](https://youtrack.jetbrains.com/issue/KTLC-421), [KT-48530](https://youtrack.jetbrains.com/issue/KT-48530)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Previously, comparing a range with a progression that has the same bounds and a step of 1 returned
> different results depending on the order of the operands: `1..2 == 1..2 step 1` returned `false`, while `1..2 step 1 == 1..2` returned `true`.
>
> Starting with Kotlin 2.5.0, iterable ranges (`CharRange`, `IntRange`, `LongRange`, `UIntRange`, and `ULongRange`) use the `equals()`
> and `hashCode()` implementations of their parent progression classes, so both comparisons return `true`.
> This can change the contents of sets and maps that contain both ranges and progressions. The `hashCode()` values of ranges also change.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

## Tools

### Deprecate `kotlin.mpp.freeCompilerArgsForSourceSet` Gradle property

> **Issue**: [KT-86611](https://youtrack.jetbrains.com/issue/KT-86611)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.mpp.freeCompilerArgsForSourceSet.<source-set-name>` Gradle property, which passes Kotlin
> compiler arguments as strings to the specified Kotlin Multiplatform source set, is deprecated.
> Use the [`compilerOptions.freeCompilerArgs`](gradle-compiler-options.md) DSL instead. If you need to configure compiler arguments
> through a Gradle property, connect your custom property to the `compilerOptions.freeCompilerArgs` DSL in your build script.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when using the `kotlin.mpp.freeCompilerArgsForSourceSet` Gradle property

### Raise the minimum supported AGP version to 8.8.2

> **Issue**: [KT-88619](https://youtrack.jetbrains.com/issue/KT-88619)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The minimum supported version of the Android Gradle plugin (AGP) that you can use in the same build with
> the Kotlin Gradle plugin 2.5.0 is 8.8.2. Previously, the minimum supported AGP version was 8.5.2.
> To migrate, update the AGP version in your project.
>
> **Deprecation cycle**:
>
> - 2.5.0: raise the minimum supported AGP version to 8.8.2

### Remove the `ExperimentalWasmDsl` annotation from Wasm JS target declarations

> **Issue**: [KT-87562](https://youtrack.jetbrains.com/issue/KT-87562)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: As part of making Kotlin/Wasm Stable, the Kotlin Gradle plugin declarations related to the `wasmJs` target are
> no longer marked with the `@ExperimentalWasmDsl` annotation. You no longer need to opt in to use them.
>
> **Deprecation cycle**:
>
> - 2.5.0: remove the `@ExperimentalWasmDsl` annotation from declarations related to the `wasmJs` target

### Deprecate `applyArgumentStrings()` function

> **Issue**: [KT-86169](https://youtrack.jetbrains.com/issue/KT-86169)
>
> **Component**: Build tools API
>
> **Incompatible change type**: source
>
> **Short summary**: The `applyArgumentStrings()` function in the [Build tools API](build-tools-api.md) is deprecated because
> its behavior is unsafe and unintuitive: it silently resets previously set values to their defaults.
> Use the new `applyCommandLineArguments()` function instead. It only sets the values that you specify explicitly and
> doesn't affect other options.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when using the `applyArgumentStrings()` function
