[//]: # (title: Compatibility guide for Kotlin 1.6)

> This page describes changes that will happen in the upcoming version 1.6.0. It isn't released yet. You can try
> its preview version [1.6.0-RC](eap.md#build-details).
>
{type="note"}

[*Keeping the Language Modern* and *Comfortable Updates*](kotlin-evolution.md) are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 1.5 to Kotlin 1.6.

## Basic terms

In this document we introduce several kinds of compatibility:

- _source_: source-incompatible change stops code that used to compile fine (without errors or warnings) from compiling
  anymore
- _binary_: two binary artifacts are said to be binary-compatible if interchanging them doesn't lead to loading or
  linkage errors
- _behavioral_: a change is said to be behavioral-incompatible if the same program demonstrates different behavior
  before and after applying the change

Remember that those definitions are given only for pure Kotlin. Compatibility of Kotlin code from the other languages
perspective
(for example, from Java) is out of the scope of this document.

## Language

### Make `when` statements with enum, sealed, and Boolean subjects exhaustive by default

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will warn about the `when` statement with an enum, sealed, or Boolean subject being non-exhaustive
>
> **Deprecation cycle**:
>
> - 1.6.0: introduce a warning when the `when` statement with an enum, sealed, or Boolean subject is non-exhaustive (error in the progressive mode)
> - 1.7.0: raise this warning to an error

### Deprecate confusing grammar in `when-with-subject`

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will deprecate several confusing grammar constructs in `when` condition expressions
>
> **Deprecation cycle**:
>
> - 1.6.20: introduce a deprecation warning on the affected expressions
> - 1.8.0: raise this warning to an error
> - \>= 1.8: repurpose some deprecated constructs for new language features

### Prohibit access to class members in the super constructor call of its companion and nested objects

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will report an error for arguments of super constructor call of companion and regular objects if the receiver of such arguments refers to the containing declaration
>
> **Deprecation cycle**:
>
> - 1.5.20: introduce a warning on the problematic arguments
> - 1.6.0: raise this warning to an error,  
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects` can be used to temporarily revert to the pre-1.6 behavior

### Type nullability enhancement improvements

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will change how it loads and interprets type nullability annotations in Java code
>
> **Deprecation cycle**:
>
> - 1.4.30: introduce warnings for cases where more precise type nullability could lead to an error
> - 1.6.0: infer more precise nullability of Java types,  
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` can be used to temporarily revert to the pre-1.6 behavior

### Prevent implicit coercions between different numeric types

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin will avoid converting numeric values automatically to a primitive numeric type where only a downcast to that type was needed semantically
> 
> **Deprecation cycle**:
>
> - < 1.5.30: the old behavior in all affected cases
> - 1.5.30: fix the downcast behavior in generated property delegate accessors,  
>   `-Xuse-old-backend` can be used to temporarily revert to the pre-1.5.30 fix behavior 
> - \>= 1.6.X: fix the downcast behavior in other affected cases

### Prohibit declarations of repeatable annotation classes whose container annotation violates JLS

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will check that the container annotation of a repeatable annotation satisfies the same requirements as in [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3): array-typed value method, retention, and target
>
> **Deprecation cycle**:
>
> - 1.5.30: introduce a warning on repeatable container annotation declarations violating JLS requirements (error in the progressive mode)
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` can be used to temporarily disable the error reporting

### Prohibit declaring a nested class named `Container` in a repeatable annotation class

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will check that a repeatable annotation declared in Kotlin doesn't have a nested class with the predefined name `Container`
>
> **Deprecation cycle**:
>
> - 1.5.30: introduce a warning on nested classes with the name `Container` in a Kotlin-repeatable annotation class (error in the progressive mode)
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` can be used to temporarily disable the error reporting

### Prohibit @JvmField on a property in the primary constructor that overrides an interface property

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will outlaw annotating a property declared in the primary constructor that overrides an interface property with the `@JvmField` annotation
>
> **Deprecation cycle**:
> 
> - 1.5.20: introduce a warning on the `@JvmField` annotation on such properties in the primary constructor
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` can be used to temporarily disable the error reporting

### Prohibit super calls from public-abi inline functions

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will outlaw calling functions with a `super` qualifier from public or protected inline functions and properties
>
> **Deprecation cycle**:
>
> - 1.5.0: introduce a warning on super calls from public or protected inline functions or property accessors
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline` can be used to temporarily disable the error reporting

### Prohibit protected constructor calls from public inline functions

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will outlaw calling protected constructors from public or protected inline functions and properties
>
> **Deprecation cycle**:
>
> - 1.4.30: introduce a warning on protected constructor calls from public or protected inline functions or property accessors
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` can be used to temporarily disable the error reporting

### Prohibit exposing private nested types from private-in-file types

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will outlaw exposing private nested types and inner classes from private-in-file types
>
> **Deprecation cycle**:
>
> - 1.5.0: introduce a warning on private types exposed from private-in-file types
> - 1.6.0: raise this warning to an error,  
>   `-XXLanguage:-PrivateInFileEffectiveVisibility` can be used to temporarily disable the error reporting

### Annotation target is not analyzed in several cases for annotations on a type 

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will no longer allow annotations on types that should not be applicable to types
>
> **Deprecation cycle**:
>
> - 1.5.20: introduce an error in the progressive mode 
> - 1.6.0: introduce an error,  
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` can be used to temporarily disable the error reporting

### Prohibit calls to functions named `suspend` with a trailing lambda

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 will no longer allow calling functions named `suspend` that have the single argument of a functional type passed as a trailing lambda
>
> **Deprecation cycle**:
>
> - 1.3.0: introduce a warning on such function calls
> - 1.6.0: raise this warning to an error
> - \>= 1.7.0: introduce changes to the language grammar, so that `suspend` before `{` is parsed as a keyword


## Standard library

### Remove brittle `contains` optimization in minus/removeAll/retainAll

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.6 will no longer perform conversion to set for the argument of functions and operators that remove several elements from collection/iterable/array/sequence.
>
> **Deprecation cycle**:
>
> - < 1.6: the old behavior: the argument is converted to set in some cases
> - 1.6.0: if the function argument is a collection, it's no longer converted to `Set`. If it's not a collection, it can be converted to `List` instead.  
>   The old behavior can be temporarily turned back on JVM by setting the system property `kotlin.collections.convert_arg_to_set_in_removeAll=true`
> - \>= 1.7: the system property above will no longer have an effect

### Change value generation algorithm in `Random.nextLong`

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 changes the value generation algorithm in `Random.nextLong` function to avoid producing values out of the specified range.
>
> **Deprecation cycle**:
>
> - 1.6.0: the behavior is fixed immediately

### Gradually change the return type of collection `min` and `max` functions to non-nullable

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: the return type of collection `min` and `max` functions will be changed to non-nullable in Kotlin 1.7
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce `...OrNull` functions as synonyms and deprecate the affected API (see details in the issue)
> - 1.5.0: raise the deprecation level of the affected API to an error
> - 1.6.0: hide the deprecated functions from the public API
> - \>= 1.7: reintroduce the affected API but with non-nullable return type

### Deprecate floating-point array functions: `contains`, `indexOf`, `lastIndexOf`

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin deprecates floating-point array functions `contains`, `indexOf`, `lastIndexOf` that compare values using the IEEE-754 order instead of the total order
>
> **Deprecation cycle**:
>
> - 1.4.0: deprecate the affected functions with a warning
> - 1.6.0: raise the deprecation level to an error
> - \>= 1.7: hide the deprecated functions from the public API

### Migrate declarations from `kotlin.dom` and `kotlin.browser` packages to `kotlinx.*`

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: declarations from the `kotlin.dom` and `kotlin.browser` packages are moved to the corresponding `kotlinx.*` packages to prepare for extracting them from stdlib
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce the replacement API in `kotlinx.dom` and `kotlinx.browser` packages
> - 1.4.0: deprecate the API in `kotlin.dom` and `kotlin.browser` packages and propose the new API above as a replacement
> - 1.6.0: raise the deprecation level to an error
> - \>= 1.7: remove the deprecated functions from stdlib
> - \>= 1.7: move the API in kotlinx.* packages to a separate library

### Make `Regex.replace` function not inline in Kotlin/JS

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: the `Regex.replace` function with the functional `transform` parameter will no longer be inline in Kotlin/JS
>
> **Deprecation cycle**:
> 
> - 1.6.0: remove the `inline` modifier from the affected function

### Different behavior of `Regex.replace` function in JVM and JS when replacement string contains group reference

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: the function `Regex.replace` in Kotlin/JS with the replacement pattern string will follow the same syntax of that pattern as in Kotlin/JVM
>
> **Deprecation cycle**:
>
> - 1.6.0: change the replacement pattern handling in `Regex.replace` of the Kotlin/JS stdlib

### Use the Unicode case folding in JS Regex

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: behavioral
>
> **Short summary**: the `Regex` class in Kotlin/JS will use [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) flag when calling the underlying JS Regular expressions engine to search and compare characters according to the Unicode rules.
> This brings certain version requirements of the JS environment and causes more strict validation of unnecessary escaping in the regex pattern string.
>
> **Deprecation cycle**:
>
> - 1.5.0: enable the Unicode case folding in most functions of the JS `Regex` class
> - 1.6.0: enable the Unicode case folding in the `Regex.replaceFirst` function

### Deprecate some JS-only API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: a number of JS-only functions in stdlib are deprecated for removal. They include: `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, and the `sort` functions on arrays taking a comparison function, for example, `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0: deprecate the affected functions with a warning
> - 1.7.0: raise the deprecation level to an error
> - 1.8.0: remove the deprecated functions from the public API

### Hide implementation- and interop-specific functions from the public API of classes in Kotlin/JS  

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source, binary
>
> **Short summary**: the functions `HashMap.createEntrySet` and `AbstactMutableCollection.toJSON` change their visibility to internal
>
> **Deprecation cycle**:
>
> - 1.6.0: make the functions internal, thus removing them from the public API
