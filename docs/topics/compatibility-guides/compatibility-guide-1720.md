[//]: # (title: Compatibility guide for Kotlin 1.7.20)

_[Keeping the Language Modern](kotlin-evolution.md)_ and _[Comfortable Updates](kotlin-evolution.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

Usually incompatible changes happen only in feature releases, but this time we have to introduce two such changes
in an incremental release to limit spread of the problems introduced by changes in Kotlin 1.7.

This document summarizes them, providing a reference for migration from Kotlin 1.7.0 and 1.7.10 to Kotlin 1.7.20.

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### Rollback attempt to fix proper constraints processing

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Rollback an attempt of fixing issues in type inference constraints processing appeared in 1.7.0
> after implementing the change described in [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668). 
> The attempt was made in 1.7.10, but it in turn introduced new problems.
>
> **Deprecation cycle**:
>
> - 1.7.20: Rollback to 1.7.0 behavior


### Forbid some builder inference cases to avoid problematic interaction with multiple lambdas and resolution

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 introduced a feature called unrestricted builder inference, so that even the lambdas passed
> to parameters not annotated with `@BuilderInference` could benefit from the builder inference. 
> However, that could cause several problems if more than one such lambda occurred in a function invocation. 
> 
> Kotlin 1.7.20 will report an error if more than one lambda function having 
> the corresponding parameter not annotated with `@BuilderInference` requires using builder inference
> to complete inferring the types in the lambda.
>
> **Deprecation cycle**:
>
> - 1.7.20: report an error on such lambda functions,  
> `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` can be used to temporarily revert to the pre-1.7.20 behavior
