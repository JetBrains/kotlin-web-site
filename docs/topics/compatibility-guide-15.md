[//]: # (title: Compatibility guide for Kotlin 1.5)

[*Keeping the Language Modern* and *Comfortable Updates*](kotlin-evolution.md) are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 1.4 to Kotlin 1.5.

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

## Language and stdlib

### Forbid spread operator in signature-polymorphic calls

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw the use of spread operator (*) on signature-polymorphic calls
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic operator at call-site
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` can be used to temporarily revert to pre-1.5 behavior

### Forbid non-abstract classes containing abstract members invisible from that classes (internal/package-private)

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw non-abstract classes containing abstract members invisible from that classes (internal/package-private)
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic classes
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` can be used to temporarily revert to pre-1.5 behavior

### Forbid using array based on non-reified type parameters as reified type arguments on JVM

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw using array based on non-reified type parameters as reified type arguments on JVM
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic calls
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` can be used to temporarily revert to pre-1.5 behavior

### Forbid secondary enum class constructors which do not delegate to the primary constructor

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw secondary enum class constructors which do not delegate to the primary constructor
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic constructors
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` can be used to temporarily revert to pre-1.5 behavior

### Forbid exposing anonymous types from private inline functions

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw exposing anonymous types from private inline functions
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic constructors
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` can be used to temporarily revert to pre-1.5 behavior

### Use correct arguments execution order in calls with named vararg

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 will change arguments execution order in calls with named vararg
>
> **Deprecation cycle**:
>
> - < 1.5: introduce warning for the problematic constructors
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` can be used to temporarily revert to pre-1.5 behavior

### Use default value of the parameter in operator functional calls

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 will use default value of the parameter in operator calls
>
> **Deprecation cycle**:
>
> - < 1.5: old behavior (see details in the issue)
> - \>= 1.5: behavior changed,
>  `-XXLanguage:-JvmIrEnabledByDefault` can be used to temporarily revert to pre-1.5 behavior

### Produce empty reversed progressions in for loops if regular progression is also empty 

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 will produce empty reversed progressions in for loops if regular progression is also empty
>
> **Deprecation cycle**:
>
> - < 1.5: old behavior (see details in the issue)
> - \>= 1.5: behavior changed,
>  `-XXLanguage:-JvmIrEnabledByDefault` can be used to temporarily revert to pre-1.5 behavior