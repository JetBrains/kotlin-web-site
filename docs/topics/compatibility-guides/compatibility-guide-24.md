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

### Drop support for `-language-version=1.9` and the K1 compiler

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
> - 2.2.0: report a warning when using `-language-version` with version 1.9
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
> To migrate, add an explicit dependency on the module that declares the inaccessible type, or update the intermediate API so it doesn't expose that type.
> 
> **Deprecation cycle**:
>
> - 2.3.0: report a warning for implicit references to inaccessible types
> - 2.4.0: raise the warning to an error

### Enforce Jakarta nullability annotations

> **Issue**: [KTLC-285](https://youtrack.jetbrains.com/issue/KTLC-285)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now enforces declared nullability in Kotlin for Java declarations that use [`jakarta.annotation.Nullable`](https://jakarta.ee/specifications/annotations/2.1/apidocs/jakarta.annotation/jakarta/annotation/nullable) or [`jakarta.annotation.Nonnull`](https://jakarta.ee/specifications/annotations/2.1/apidocs/jakarta.annotation/jakarta/annotation/nonnull).
> If you assign a Java declaration marked as nullable by these annotations to a non-null Kotlin type, the compiler reports an error.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning for nullability mismatches in Java declarations annotated with Jakarta nullability annotations
> - 2.4.0: raise the warning to an error

### Report misplaced type arguments in callable reference qualifiers

> **Issue**: [KTLC-388](https://youtrack.jetbrains.com/issue/KTLC-388)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now checks the left-hand side of callable references and reports a warning if an inner class contains type arguments in the wrong part of the qualifier.
> 
> To migrate, update the reference so that each type argument belongs to the class that declares it.
> For example, write the full type `Outer<Int>.Inner<String>::toString` instead of `Inner<String, Int>::toString`.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when type arguments in the left-hand side of a callable reference belong to another part of the qualifier

### Report errors for class literals from reified type parameters with nullable upper bounds

> **Issue**: [KTLC-370](https://youtrack.jetbrains.com/issue/KTLC-370)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports an error when you use `::class` on an expression whose type comes from a reified type parameter with a nullable upper bound.
> If you use `::class` on such an expression, make the value non-null first with an explicit null check or the `!!` operator.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when `::class` is used on an expression whose type comes from a reified type parameter with a nullable upper bound
> - 2.4.0: raise the warning to an error

### Prohibit initialization before declarations in anonymous objects

> **Issue**: [KTLC-290](https://youtrack.jetbrains.com/issue/KTLC-290)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when you initialize a property in an `init` block of an anonymous object before declaring that property.
> 
> **Deprecation cycle**:
>
> - 2.2.20: report a warning when an `init` block in an anonymous object initializes a property before the property declaration
> - 2.4.0: raise the warning to an error

### Enforce exhaustiveness for `when` expressions with non-abstract Java sealed classes

> **Issue**: [KTLC-366](https://youtrack.jetbrains.com/issue/KTLC-366)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now checks exhaustiveness more strictly and requires an `else` branch or a branch that matches the sealed class itself when you use a `when` expression with a non-abstract Java sealed class.
> Previously, Kotlin could treat such `when` expressions as exhaustive even though the Java sealed class itself could be instantiated directly.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning for non-exhaustive `when` expressions with non-abstract Java sealed classes
> - 2.4.0: raise the warning to an error

### Prohibit `operator` modifier on `getValue()` and `setValue()` functions with too many parameters

> **Issue**: [KTLC-289](https://youtrack.jetbrains.com/issue/KTLC-289)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: When you mark the [`getValue()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.properties/-read-only-property/get-value.html) or [`setValue()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.properties/-read-write-property/set-value.html) functions with the `operator` modifier, the compiler now checks that they have the required number of value parameters.
> The `getValue()` function must have exactly two value parameters, and the `setValue()` function must have exactly three.
> To migrate, remove the `operator` modifier or change the function signature.
>
> **Deprecation cycle**:
>
> - 2.2.20: report a warning for `operator` `getValue()` and `setValue()` functions with too many value parameters
> - 2.4.0: raise the warning to an error

### Prohibit inconsistent type arguments in generic calls

> **Issue**: [KTLC-373](https://youtrack.jetbrains.com/issue/KTLC-373)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: When you specify type arguments in a generic call, the compiler now reports an error if one type argument violates an upper-bound constraint that depends on another type argument.
> If type parameters depend on each other, use type arguments that match those constraints, for example `Container<Alpha, AlphaKey>()` instead of `Container<Alpha, BetaKey>()`.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when explicit type arguments in a generic call violate upper-bound constraints between type parameters
> - 2.4.0: raise the warning to an error

### Deprecate references to the `javaClass` property

> **Issue**: [KTLC-375](https://youtrack.jetbrains.com/issue/KTLC-375)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.4.0 deprecates property references to the [`javaClass`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/java-class.html) property to reduce confusion with `::class.java`.
> Use `.javaClass` to get the runtime Java class of an object, or `::class.java` to get a Java class reference.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning for property references to the `javaClass` property

### Report errors for implicit enum constructor calls that require opt-in

> **Issue**: [KTLC-359](https://youtrack.jetbrains.com/issue/KTLC-359)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when an enum entry implicitly calls an enum primary constructor that requires opt-in.
> To migrate, add `@OptIn` to the enum class or to each enum entry that calls the constructor.
>
> **Deprecation cycle**:
>
> - 2.2.20: report a warning when an enum entry implicitly calls an enum primary constructor that requires opt-in
> - 2.4.0: raise the warning to an error

### Forbid `inline` modifier on enum entries

> **Issue**: [KTLC-361](https://youtrack.jetbrains.com/issue/KTLC-361)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when you use the `inline` modifier on an enum entry.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when the `inline` modifier is used on an enum entry
> - 2.4.0: raise the warning to an error

### Prohibit array literals outside annotation calls and parameter defaults

> **Issue**: [KTLC-369](https://youtrack.jetbrains.com/issue/KTLC-369)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Using array literals outside annotation calls and default values for annotation parameters now results in an error.
> To migrate, use `arrayOf(...)`, for example `Roles(arrayOf("admin", "user"))` instead of `Roles(["admin", "user"])`.
> 
> **Deprecation cycle**:
>
> - 2.3.0: report a warning for array literals outside annotation calls and default values for annotation parameters
> - 2.4.0: raise the warning to an error

### Prohibit `_root_ide_package_` in CLI compiler mode

> **Issue**: [KTLC-378](https://youtrack.jetbrains.com/issue/KTLC-378)
>
> **Component**: Compiler
>
> **Incompatible change type**: source
>
> **Short summary**: Using the IDE-only `_root_ide_package_` qualifier in CLI compiler mode now results in an error.
>
> **Deprecation cycle**:
>
> - 2.3.20: report a warning for `_root_ide_package_` references in CLI compiler mode
> - 2.4.0: raise the warning to an error

### Correct equality for function references with vararg conversions

> **Issue**: [KTLC-385](https://youtrack.jetbrains.com/issue/KTLC-385)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin/JVM now treats function references with different conversions as unequal.
> Previously, Kotlin/JVM ignored vararg conversion in equality checks when the same function reference also used another conversion, so `getDefault(::foo) == getDefaultAndVararg(::foo)` could return `true` even though only one side used vararg conversion.
>
> **Deprecation cycle**:
>
> - 2.4.0: introduce the new behavior

### Enforce opt-in for companion object access

> **Issue**: [KTLC-386](https://youtrack.jetbrains.com/issue/KTLC-386)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an opt-in error when a class name reference resolves to a companion object that requires opt-in.
> For example, `val p = C` requires opt-in if `C` resolves to a companion object marked with an opt-in annotation.
>
> **Deprecation cycle**:
>
> - 2.3.20: report a warning when companion object access requires opt-in
> - 2.4.0: raise the warning to an error for `ERROR`-level opt-in requirements

### Report type mismatches from supertypes with nested generic arguments

> **Issue**: [KTLC-372](https://youtrack.jetbrains.com/issue/KTLC-372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when the compiler detects a type mismatch involving a supertype with nested generic arguments.
> Previously, the compiler could miss this mismatch, which later failed with a `ClassCastException`.
> To migrate, use a type argument that matches the receiver's generic type, or remove the explicit type argument so the compiler can infer it.
>
> **Deprecation cycle**:
>
> - 2.4.0: report an error for type mismatches involving supertypes with nested generic arguments

### Prohibit inferred types with inaccessible declarations

> **Issue**: [KTLC-363](https://youtrack.jetbrains.com/issue/KTLC-363)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Using an inferred type that contains a declaration inaccessible in the current scope now results in an error.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when an inferred type contains a declaration that isn't accessible in the current scope
> - 2.4.0: raise the warning to an error

## Standard library

### Deprecate `kotlin.io.readLine()` function

> **Issue**: [KTLC-394](https://youtrack.jetbrains.com/issue/KTLC-394)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The [`kotlin.io.readLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/read-line.html) function is deprecated. Use [`readln()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/readln.html) instead of `readLine()`, and [`readlnOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io/readln-or-null.html) instead of `readLine()!!`.
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