[//]: # (title: Compatibility guide for Kotlin 2.0)

_[Keeping the Language Modern](kotlin-evolution.md)_ and _[Comfortable Updates](kotlin-evolution.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like updated changelogs or compiler
warnings, this document provides a complete reference for migration from Kotlin 1.9 to Kotlin 2.0.

> The Kotlin K2 compiler is introduced as part of Kotlin 2.0. For information on the benefits of the new compiler, changes
> you might encounter during migration, and how to roll back to the previous compiler, see [K2 compiler migration guide](k2-compiler-migration-guide.md).
>
{style="note"}

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
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### Deprecate use of a synthetic setter on a projected receiver

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: If you use the synthetic setter of a Java class to assign a type that conflicts with the class's
> projected type, an error is triggered.
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning when a synthetic property setter has a projected parameter type in contravariant position
>   making call-site argument types incompatible
> - 2.0.0: raise the warning to an error

### Correct mangling when calling functions with inline class parameters that are overloaded in a Java subclass

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: use the correct mangling behavior in function invocations; to revert to the previous behaviour,
>   use the `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` compiler option.

### Correct type approximation algorithm for contravariant captured types

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning on problematic calls
> - 2.0.0: raise the warning to an error

### Prohibit accessing property value before property initialization

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when a property is accessed before initialization in the affected contexts 

### Report error when there's ambiguity in imported classes with the same name

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when resolving a class name that is present in several packages imported with a star import

### Generate Kotlin lambdas via invokedynamic and LambdaMetafactory by default

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; lambdas are generated using `invokedynamic` and `LambdaMetafactory` by default

### Forbid if condition with one branch when an expression is required

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error in case the `if` condition has only one branch

### Prohibit violation of self upper bounds by passing a star-projection of a generic type

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when self upper bounds are violated by passing a star-projection of a generic type

### Approximate anonymous types in private inline functions return type

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning on private inline functions if the inferred return type contains an anonymous type
> - 2.0.0: approximate return type of such private inline functions to a supertype

### Change overload resolution behavior to prioritize local extension function calls over invoke conventions of local functional type properties

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 2.0.0: new overload resolution behavior; function calls are consistently prioritized over invoke conventions

### Report error when an inherited member conflict occurs due to a change in a supertype from binary dependency

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning CONFLICTING_INHERITED_MEMBERS_WARNING on declarations where inherited member conflict has
>   occurred in the supertype from binary dependency
> - 2.0.0: raise the warning to an error: CONFLICTING_INHERITED_MEMBERS

### Ignore @UnsafeVariance annotations on parameters in invariant types

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; the `@UnsafeVariance` annotation is ignored when reporting errors about type mismatch
>   in contravariant parameters

### Change type for out-of-call references to a companion object's member

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning on a companion object function reference type inferred as an unbound reference
> - 2.0.0: change the behavior so that companion object function references are inferred as bound references in all usage contexts

### Prohibit exposure of anonymous types from private inline functions

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: report a warning on calls to own members of anonymous objects, returned from private inline functions
> - 2.0.0: approximate return type of such private inline functions to a supertype and don't resolve calls to anonymous object members

### Report error for an unsound smart cast after a while-loop break

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; the old behavior can be restored by switching to language version 1.9

### Report error when a variable of an intersection type is assigned a value that is not a subtype of that intersection type

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when a variable having an intersection type is assigned a value that is not a subtype of that
>   intersection type

### Require opt-in when an interface constructed with a SAM constructor contains a method that requires an opt-in

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning for `OptIn` usages via SAM constructor
> - 2.0.0: raise the warning to an error for `OptIn` usages via SAM constructor (or keep reporting the warning if `OptIn`
>   marker severity is a warning)

### Prohibit upper bound violation in typealias constructors

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: introduce a warning for cases when the upper bound is violated in typealias constructors
> - 2.0.0: raise the warning to an error in the K2 compiler

### Make the real type of a destructuring variable consistent with the explicit type when specified

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; the real type of destructuring variable is now consistent with the explicit type
>   when specified

### Require opt-in when calling a constructor that has parameter types with default values that require an opt-in

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning on constructor calls that has parameter types which require opt-in
> - 2.0.0: raise the warning to an error (or keep reporting a warning if the `OptIn` marker severity is a warning)

### Report ambiguity between a property and an enum entry with the same name at the same scope level

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning when the compiler resolves to a property instead of an enum entry at the same scope level
> - 2.0.0: report ambiguity when the compiler encounters both a property and an enum entry with the same name at the same
>   scope level in the K2 compiler (leaving the warning as is in the old compiler)

### Change qualifier resolution behavior to prefer companion property over enum entry

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new resolution behavior; companion property is preferred over enum entry

### Resolve invoke call receiver type and the invoke function type as if written in desugared form

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: resolve invoke call receiver type and the invoke function type independently as if they were written in a
>   desugared form

### Prohibit exposing private class members through non-private inline functions

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: report the `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` warning when calling private class companion object
>   member from internal inline functions
> - 2.0.0: raise this warning to the `PRIVATE_CLASS_MEMBER_FROM_INLINE` error

### Correct nullability of definitely non-null types in projected generic types

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; projected types take into account all in-place not-null types

### Change inferred type of prefix increment to match getter's return type instead of inc() operator's return type

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; inferred type of prefix increment is changed to match getter's return type instead of
>   the `inc()` operator's return type

### Enforce bound checks when inheriting inner classes from generic inner classes declared in superclasses

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when upper bound of the type parameter of a generic inner superclass is violated

### Forbid assigning callable references with SAM types when the expected type is a function type with a function type parameter

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report a compilation error on callable references with SAM types when the expected type is a function type
>   with a function type parameter

### Consider companion object scope for annotation resolution on companion objects

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; the companion object scope is now not ignored during annotation resolution on companion objects

### Change evaluation semantics for combination of safe calls and convention operators

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: report warnings on each incorrect call
> - 2.0.0: implement new resolution behavior

### Require properties with backing field and a custom setter to be immediately initialized

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: introduce the `MUST_BE_INITIALIZED` warning for cases where there is no primary constructor
> - 2.0.0: raise the warning to an error

### Prohibit Unit conversion on arbitrary expressions in invoke operator convention call

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: report an error when Unit conversion is applied to an arbitrary expression on variable and invoke resolution;
> use the `-XXLanguage:+UnitConversionsOnArbitraryExpressions` compiler option to keep the previous behavior with affected
> expressions.

### Forbid nullable assignment to non-null Java field when the field is accessed with a safe call

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: report to an error in case a nullable is assigned to a non-null Java field

### Require star-projected type when overriding a Java method containing a raw-type parameter

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; overriding is forbidden for raw type parameters

### Change (V)::foo reference resolution when V has a companion

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: report a warning on callable references currently bound to companion object instances
> - 2.0.0: implement new behavior; adding parentheses around a type no longer makes it a reference to the type's companion
>   object instance

### Forbid implicit non-public API access in effectively public inline functions

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: report a compilation warning when implicit non-public API is accessed in public inline functions
> - 2.0.0: raise the warning to an error

### Prohibit use-site get annotations on property getters

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning (an error in the progressive mode) on use-site `get` annotations on getters
> - 2.0.0: raise the warning to the `INAPPLICABLE_TARGET_ON_PROPERTY` error;
>   use `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` to revert to a warning

### Prevent implicit inference of type parameters into upper bounds in builder inference lambda functions

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning (or an error in the progressive mode) when the type parameter for a type argument
>   cannot be inferred into declared upper bounds
> - 2.0.0: raise the warning to an error

### Keep nullability when approximating local types in public signatures

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: flexible types are approximated by flexible supertypes; report a warning when a declaration is inferred to have
>   a non-nullable type that should be nullable, prompting to specify the type explicitly to avoid NPEs
> - 2.0.0: nullable types are approximated by nullable supertypes

### Remove special handling for `false && ...` and `false || ...` for the purposes of smart-casting

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: implement new behavior; no special handling for `false && ...` and `false || ...`

### Forbid inline open functions in enums

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: report a warning on inline open functions in enums
> - 2.0.0: raise the warning to an error

## Tools

### Visibility changes in Gradle

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Previously, certain Kotlin DSL functions and properties intended for a specific DSL context would 
> inadvertently leak into other DSL contexts. We've added the `@KotlinGradlePluginDsl` annotation,
> which prevents the exposure of the Kotlin Gradle plugin DSL functions and properties to levels where they are not intended
> to be available. The following levels are separated from each other:
> * Kotlin extension
> * Kotlin target
> * Kotlin compilation
> * Kotlin compilation task
>
> **Deprecation cycle**:
>
> - 2.0.0: for most popular cases, the compiler reports warnings with suggestions on how to fix them if your build script
>   is configured incorrectly; otherwise, the compiler reports an error

### Deprecate kotlinOptions DSL

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The ability to configure compiler options through the `kotlinOptions` DSL and the related
> `KotlinCompile<KotlinOptions>` task interface have been deprecated.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning

### Deprecate compilerOptions in KotlinCompilation DSL

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The ability to configure the `compilerOptions` property in the `KotlinCompilation` DSL has been deprecated.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning

### Deprecate old ways of CInteropProcess handling

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: the `CInteropProcess` task and the `CInteropSettings` class now use the `definitionFile` property
> instead of `defFile` and `defFileProperty`.
> 
> This eliminates the need to add extra `dependsOn` relations between the `CInteropProcess` task and the task that
> generates `defFile` when the `defFile` is dynamically generated.
> 
> In Kotlin/Native projects, Gradle now lazily verifies the presence of the `definitionFile` property after the connected
> task has run later in the build process.
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` and `defFileProperty` parameters are deprecated

### Remove kotlin.useK2 Gradle property

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The `kotlin.useK2` Gradle property has been removed. In Kotlin 1.9.*, it could be used to enable the
> K2 compiler. In Kotlin 2.0.0 and later, the K2 compiler is enabled by default, so the property has no effect
> and cannot be used to switch back to the previous compiler.
>
> **Deprecation cycle**:
>
> - 1.8.20: the `kotlin.useK2` Gradle property is deprecated
> - 2.0.0: the `kotlin.useK2` Gradle property is removed

### Remove deprecated platform plugin IDs

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: support for these platform plugin IDs have been removed:
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: the platform plugin IDs are deprecated
> - 2.0.0: the platform plugin IDs are no longer supported