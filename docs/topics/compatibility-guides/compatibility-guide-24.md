[//]: # (title: Compatibility guide for Kotlin 2.4.0)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.2 to Kotlin 2.3.
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

### Drop support in `-language-version` for 1.9

> **Issue**: [KT-80590](https://youtrack.jetbrains.com/issue/KT-80590)
>
> **Component**: Compiler
>
> **Incompatible change type**: source
>
> **Short summary**: Starting with Kotlin 2.4, the compiler no longer supports [`-language-version=1.9`](compiler-reference.md#language-version-version).
> As a result, the K1 compiler is no longer supported.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when using `-language-version` with versions 1.8 and 1.9
> - 2.4.0: raise the warning to an error

### Prohibit flexible explicit nullable type arguments for Java types

> **Issue**: [KTLC-284](https://youtrack.jetbrains.com/issue/KTLC-284)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Previously, when calling Java APIs from Kotlin, the compiler could treat explicitly specified nullable type arguments as flexible type arguments.
> Kotlin 2.4.0 no longer applies this behavior for nullable type arguments, so the compiler now reports errors for code that could break type safety or fail at runtime.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning for explicitly specified nullable type arguments that are treated as flexible types
> - 2.4.0: raise the warning to an error

### Prohibit always-false `is` checks for definitely incompatible types

> **Issue**: [KTLC-365](https://youtrack.jetbrains.com/issue/KTLC-365)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Starting with Kotlin 2.4.0, the compiler prevents meaningless `is` checks that are always false because the checked types are definitely incompatible.
> This keeps the behavior consistent with other operations involving incompatible types.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning for `is` checks with definitely incompatible types
> - 2.4.0: raise the warning to an error


### Prohibit exposing types and declarations with lower visibility in inline functions

> **Issue**: [KTLC-283](https://youtrack.jetbrains.com/issue/KTLC-283)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now prevents inline functions from exposing types and declarations that have lower visibility than the inline function itself.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning for exposing types and declarations with lower visibility in inline functions
> - 2.4.0: raise the warning to an error

### Change default use-site target selection for annotations

> **Issue**: [KTLC-391](https://youtrack.jetbrains.com/issue/KTLC-391)
>
> **Component**: Core language
>
> **Incompatible change type**: binary
>
> **Short summary**: Kotlin 2.4.0 updates the defaulting rules for propagating annotations to parameters, properties, and fields.
> This can affect annotation processing, reflection, and binary metadata after recompilation.
> When you don't specify a use-site target, the compiler now uses `param` and `property` if they apply, and uses `field` only if `property` doesn't apply.
>
> You can specify a use-site target explicitly, such as `@param:Annotation` instead of `@Annotation`.
> To use the previous defaulting rule for your whole project, add `-Xannotation-default-target=first-only` to your build file.
>  
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when the new defaulting rule changes the chosen use-site targets
> - 2.4.0: enable the new defaulting rule


### Forbid implicit references to inaccessible types

> **Issue**: [KTLC-384](https://youtrack.jetbrains.com/issue/KTLC-384)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Using declarations that implicitly reference inaccessible types from indirect dependencies now results in an error.
> 
> **Deprecation cycle**:
>
> - 2.3.0: report a warning for implicit references to inaccessible types
> - 2.4.0: raise the warning to an error


### Deprecate `kotlin.io.readLine()` function

> **Issue**: [KTLC-394](https://youtrack.jetbrains.com/issue/KTLC-394)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.io.readLine()` function is deprecated. Use `readln()` instead of `readLine()!!`, and `readlnOrNull()` instead of `readLine()`.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when using `kotlin.io.readLine()`

<!--

### Title

> **Issue**: [KTLC-xxx](xxx)
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