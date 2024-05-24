[//]: # (title: Compatibility guide for Kotlin 1.5)

_[Keeping the Language Modern](kotlin-evolution.md)_ and _[Comfortable Updates](kotlin-evolution.md)_ are among the fundamental
principles in Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed,
and the latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

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

### Forbid passing non-spread arrays after arguments with SAM-conversion

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw passing non-spread arrays after arguments with SAM-conversion
>
> **Deprecation cycle**:
>
> - 1.3.70: introduce warning for the problematic calls
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` can be used to temporarily revert to pre-1.5 behavior

### Support special semantics for underscore-named catch block parameters

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw references to the underscore symbol (`_`) that is used to omit parameter name of an exception in the catch block
>
> **Deprecation cycle**:
>
> - 1.4.20: introduce warning for the problematic references
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` can be used to temporarily revert to pre-1.5 behavior

### Change implementation strategy of SAM conversion from anonymous class-based to invokedynamic

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Since Kotlin 1.5, implementation strategy of SAM (single abstract method) conversion will be changed from generating an anonymous class to using the `invokedynamic` JVM instruction
>
> **Deprecation cycle**:
>
> - 1.5: change implementation strategy of SAM conversion,
>  `-Xsam-conversions=class` can be used to revert implementation scheme to the one that used before

### Performance issues with the JVM IR-based backend

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 uses the [IR-based backend](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)
> for the Kotlin/JVM compiler by default. The old backend is still used by default for earlier language versions.
>
> You might encounter some performance degradation issues using the new compiler in Kotlin 1.5. We are working on fixing
> such cases.
>
> **Deprecation cycle**:
>
> - < 1.5: by default, the old JVM backend is used
> - \>= 1.5: by default, the IR-based backend is used. If you need to use the old backend in Kotlin 1.5,
> add the following lines to the project's configuration file to temporarily revert to pre-1.5 behavior:
>
> In Gradle:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> In Maven:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> Support for this flag will be removed in one of the future releases.

### New field sorting in the JVM IR-based backend

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Since version 1.5, Kotlin uses the [IR-based backend](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)
> that sorts JVM bytecode differently: it generates fields declared in the constructor before fields declared in the body,
> while it's vice versa for the old backend. The new sorting may change the behavior of programs that use
> serialization frameworks that depend on the field order, such as Java serialization.
>
> **Deprecation cycle**:
>
> - < 1.5: by default, the old JVM backend is used. It has fields declared in the body before fields declared
> in the constructor.
> - \>= 1.5: by default, the new IR-based backend is used. Fields declared in the constructor are generated before fields
> declared in the body. As a workaround, you can temporarily switch to the old backend in Kotlin 1.5. To do that,
> add the following lines to the project's configuration file:
>
> In Gradle:
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> In Maven:
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> Support for this flag will be removed in one of the future releases.

### Generate nullability assertion for delegated properties with a generic call in the delegate expression

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Since Kotlin 1.5, the Kotlin compiler will emit nullability assertions for delegated properties with a generic call in the delegate expression
>
> **Deprecation cycle**:
>
> - 1.5: emit nullability assertion for delegated properties (see details in the issue),
>  `-Xuse-old-backend` or `-language-version 1.4` can be used to temporarily revert to pre-1.5 behavior

### Turn warnings into errors for calls with type parameters annotated by @OnlyInputTypes

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.5 will outlaw calls like `contains`, `indexOf`, and `assertEquals` with senseless arguments to improve type safety
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce warning for the problematic constructors
> - \>= 1.5: raise this warning to an error,
>  `-XXLanguage:-StrictOnlyInputTypesChecks` can be used to temporarily revert to pre-1.5 behavior

### Use the correct order of arguments execution in calls with named vararg

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 1.5 will change the order of arguments execution in calls with named vararg
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

### Straighten Char-to-code and Char-to-digit conversions out

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Since Kotlin 1.5, conversions of Char to number types will be deprecated
>
> **Deprecation cycle**:
>
> - 1.5: deprecate `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` and the reverse functions like `Long.toChar()`, and propose replacement 

### Inconsistent case-insensitive comparison of characters in kotlin.text functions

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Since Kotlin 1.5, `Char.equals` will be improved in case-insensitive case by first comparing whether the uppercase variants of characters are equal, then whether the lowercase variants of those uppercase variants (as opposed to the characters themselves) are equal
>
> **Deprecation cycle**:
>
> - < 1.5: old behavior (see details in the issue)
> - 1.5: change behavior for `Char.equals` function 

### Remove default locale-sensitive case conversion API

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Since Kotlin 1.5, default locale-sensitive case conversion functions like `String.toUpperCase()` will be deprecated
>
> **Deprecation cycle**:
>
> - 1.5: deprecate case conversions functions with the default locale (see details in the issue), and propose replacement 

### Gradually change the return type of collection `min` and `max` functions to non-nullable

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: return type of collection `min` and `max` functions will be changed to non-nullable in 1.6
>
> **Deprecation cycle**:
>
> - 1.4: introduce `...OrNull` functions as synonyms and deprecate the affected API (see details in the issue)
> - 1.5.0: raise the deprecation level of the affected API to error
> - \>=1.6: reintroduce the affected API but with non-nullable return type

### Raise the deprecation level of conversions of floating-point types to `Short` and `Byte`

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: source
>
> **Short summary**: conversions of floating-point types to `Short` and `Byte` deprecated in Kotlin 1.4 with `WARNING`
> level will cause errors since Kotlin 1.5.0.
>
> **Deprecation cycle**:
>
> - 1.4: deprecate `Double.toShort()/toByte()` and `Float.toShort()/toByte()` and propose replacement
> - 1.5.0: raise the deprecation level to error

## Tools

### Do not mix several JVM variants of kotlin-test in a single project

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: several mutually exclusive `kotlin-test` variants for different testing frameworks could have been in a project if one
> of them is brought by a transitive dependency. From 1.5.0, Gradle won't allow having mutually exclusive `kotlin-test` 
> variants for different testing frameworks.
>
> **Deprecation cycle**:
>
> - < 1.5: having several mutually exclusive `kotlin-test` variants for different testing frameworks is allowed
> - \>= 1.5: behavior changed,  
> Gradle throws an exception like "Cannot select module with conflict on capability...". Possible solutions:
>    * use the same `kotlin-test` variant and the corresponding testing framework as the transitive dependency brings.
>    * find another variant of the dependency that doesn't bring the `kotlin-test` variant transitively, so you can use the testing framework you would like to use.
>    * find another variant of the dependency that brings another `kotlin-test` variant transitively, which uses the same testing framework you would like to use.
>    * exclude the testing framework that is brought transitively. The following example is for excluding JUnit 4:
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      After excluding the testing framework, test your application. If it stopped working, rollback excluding changes, 
> use the same testing framework as the library does, and exclude your testing framework.
