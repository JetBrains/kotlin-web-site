[//]: # (title: Compatibility guide for Kotlin 2.2)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.1 to Kotlin 2.2.

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

### Prohibit constructor call and inheritance on type aliases with variance in expanded types in K2

> **Issue**: [KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Constructor calls and inheritance using type aliases that expand to types that use variance modifiers such as `out` are no longer allowed in K2.
> This resolves inconsistencies where using the original type wasn't allowed but the same usage through a type alias was permitted.
> To migrate, use the original type explicitly where needed.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning for constructor calls or supertype usage on type aliases that expand to types with variance modifiers
> - 2.2.0: raise the warning to an error

### Prohibit synthetic properties from Kotlin getters

> **Issue**: [KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Synthetic properties are no longer allowed for getters defined in Kotlin.
> This affects cases where Java classes extend Kotlin ones and when working with mapped types like `java.util.LinkedHashSet`.
> To migrate, replace property access with direct calls to the corresponding getter functions.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning for accessing synthetic properties created from Kotlin getters
> - 2.2.0: raise the warning to an error

### Change the default method generation for interface functions on the JVM

> **Issue**: [KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **Component**: Core language
>
> **Incompatible change type**: binary
>
> **Short summary**: Functions declared in interfaces are now compiled to JVM default methods unless configured otherwise.
> This may result in compilation errors in Java code when unrelated supertypes define conflicting implementations.
> The behavior is controlled by the stable `-jvm-default` compiler option, which replaces the now deprecated `-Xjvm-default` option.
> To restore the previous behavior, where default implementations are generated only in `DefaultImpls` classes and subclasses, use `-jvm-default=disable`.
>
> **Deprecation cycle**:
>
> - 2.2.0: `-jvm-default` compiler option is set to `enable` by default

### Forbid field-targeted annotations on annotation properties

> **Issue**: [KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Field-targeted annotations are no longer allowed on annotation properties.
> Although these annotations had no observable effect, this change may affect custom IR plugins that relied on them.
> To migrate, remove the field-targeted annotation from the property.
>
> **Deprecation cycle**:
>
> - 2.1.0: `@JvmField` annotation is deprecated with a warning on annotation properties
> - 2.1.20: report a warning for all field-targeted annotations on annotation properties
> - 2.2.0: raise the warning to an error

## Standard library

## Tools