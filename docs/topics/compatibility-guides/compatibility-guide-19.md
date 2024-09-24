[//]: # (title: Compatibility guide for Kotlin 1.9)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 1.8 to Kotlin 1.9.

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

### Remove language version 1.3

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 introduces language version 1.9 and removes support for language version 1.3. 
>
> **Deprecation cycle**:
>
> - 1.6.0: report a warning
> - 1.9.0: raise the warning to an error

### Prohibit super constructor call when the super interface type is a function literal

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: If an interface inherits from a function literal type, Kotlin 1.9 prohibits super constructor calls because no such constructor exists.
>
> **Deprecation cycle**:
> * 1.7.0: report a warning (or an error in progressive mode)
> * 1.9.0: raise the warning to an error

### Prohibit cycles in annotation parameter types

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 prohibits the type of an annotation being used as one of its parameter types, either directly or indirectly. This prevents cycles from being created.
> However, you are allowed to have parameter types that are an `Array` or a `vararg` of the annotation type.
>
> **Deprecation cycle**:
> * 1.7.0: report a warning (or an error in progressive mode) on cycles in types of annotation parameters
> * 1.9.0: raise the warning to an error, `-XXLanguage:-ProhibitCyclesInAnnotations` can be used to temporarily revert to pre-1.9 behavior

### Prohibit use of @ExtensionFunctionType annotation on function types with no parameters

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 prohibits using the `@ExtensionFunctionType` annotation on function types with no parameters, or on types that aren't function types.
>
> **Deprecation cycle**:
> * 1.7.0: report a warning for annotations on types that aren't function types, report an error for annotations on types that **are** function types
> * 1.9.0: raise the warning for function types to an error

### Prohibit Java field type mismatch on assignment

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 reports a compiler error if it detects that the type of a value assigned to a Java field doesn't match the Java field's projected type.
>
> **Deprecation cycle**:
> * 1.6.0: report a warning (or an error in the progressive mode) when a projected Java field type doesn't match the assigned value type
> * 1.9.0: raise the warning to an error, `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` can be used to temporarily revert to pre-1.9 behavior

### No source code excerpts in platform-type nullability assertion exceptions

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: In Kotlin 1.9, exception messages for expression null checks do not include source code excerpts. Instead, the name of the method or field is displayed.
> If the expression is not a method or field, there is no additional information provided in the message.
>
> **Deprecation cycle**:
>  * < 1.9.0: exception messages generated by expression null checks contain source code excerpts
>  * 1.9.0: exception messages generated by expression null checks contain method or field names only, `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` can be used to temporarily revert to pre-1.9 behavior


### Prohibit the delegation of super calls to an abstract superclass member

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin will report a compile error when an explicit or implicit super call is delegated 
> to an _abstract_ member of the superclass, even if there's a default implementation in a super interface.
>
> **Deprecation cycle**:
>
> - 1.5.20: introduce a warning when non-abstract classes that do not override all abstract members are used
> - 1.7.0: report a warning if a super call, in fact, accesses an abstract member from a superclass
> - 1.7.0: report an error in all affected cases if the `-Xjvm-default=all` or `-Xjvm-default=all-compatibility` compatibility modes are enabled;
>   report an error in the progressive mode
> - 1.8.0: report an error in cases of declaring a concrete class with a non-overridden abstract method from the superclass, and 
>   super calls of `Any` methods are overridden as abstract in the superclass
> - 1.9.0: report an error in all affected cases, including explicit super calls to an abstract method from the super class

### Deprecate confusing grammar in when-with-subject

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 deprecated several confusing grammar constructs in `when` condition expressions.
>
> **Deprecation cycle**:
>
> - 1.6.20: introduce a deprecation warning on the affected expressions
> - 1.8.0: raise this warning to an error,
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` can be used to temporarily revert to the pre-1.8 behavior
> - \>= 2.1: repurpose some deprecated constructs for new language features

### Prevent implicit coercions between different numeric types

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin will avoid converting numeric values automatically to a primitive numeric type where only a downcast to that type is needed semantically.
>
> **Deprecation cycle**:
>
> - < 1.5.30: the old behavior in all affected cases
> - 1.5.30: fix the downcast behavior in generated property delegate accessors,
>   `-Xuse-old-backend` can be used to temporarily revert to the pre-1.5.30 fix behavior
> - \>= 2.0: fix the downcast behavior in other affected cases

### Prohibit upper bound violation in a generic type alias usage (a type parameter used in a generic type argument of a type argument of the aliased type)

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin will prohibit using a type alias with type arguments that violate the upper bound 
> restrictions of the corresponding type parameters of the aliased type in case when the typealias type parameter is used as 
> a generic type argument of a type argument of the aliased type, for example, `typealias Alias<T> = Base<List<T>>`.
>
> **Deprecation cycle**:
>
> - 1.8.0: report a warning when a generic typealias usage has type arguments violating upper bound constraints of
>   the corresponding type parameters of the aliased type
> - 2.0.0: raise the warning to an error

### Keep nullability when approximating local types in public signatures

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: when a local or anonymous type is returned from an expression-body function without an explicitly specified return type,
> Kotlin compiler infers (or approximates) the return type using the known supertype of that type.
> During this, the compiler can infer a non-nullable type where the null value could in fact be returned.
>
> **Deprecation cycle**:
>
> - 1.8.0: approximate flexible types by flexible supertypes
> - 1.8.0: report a warning when a declaration is inferred to have a non-nullable type that should be nullable, prompting users to specify the type explicitly
> - 2.0.0: approximate nullable types by nullable supertypes, 
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` can be used to temporarily revert to the pre-2.0 behavior

### Do not propagate deprecation through overrides

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will no longer propagate deprecation from a deprecated member in the superclass
> to its overriding member in the subclass, thus providing an explicit mechanism for deprecating a member of 
> the superclass while leaving it non-deprecated in the subclass.
>
> **Deprecation cycle**:
>
> - 1.6.20: reporting a warning with the message of the future behavior change and a prompt to either suppress this warning 
>   or explicitly write a `@Deprecated` annotation on an override of a deprecated member
> - 1.9.0: stop propagating deprecation status to the overridden members. This change also takes effect immediately in the progressive mode

### Prohibit using collection literals in annotation classes anywhere except their parameters declaration

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin allows using collection literals in a restricted way - for passing arrays to parameters of annotation classes
> or specifying default values for these parameters.
> However besides that, Kotlin allowed using collections literals anywhere else inside an annotation class, for example,
> in its nested object. Kotlin 1.9 will prohibit using collection literals in annotation classes anywhere except 
> their parameters' default values.
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning (or an error in the progressive mode) on array literals in nested objects in annotation classes
> - 1.9.0: raise the warning to an error

### Prohibit forward referencing of parameters in default value expressions

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will prohibit forward referencing of parameters in default value expressions
> of other parameters. This ensures that by the time the parameter is accessed in a default value expression, 
> it would already have a value either passed to the function or initialized by its own default value expression.
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning (or an error in the progressive mode) when a parameter with default value is references in default value of another parameter that comes before it
> - 1.9.0: raise the warning to an error,
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` can be used to temporarily revert to the pre-1.9 behavior

### Prohibit extension calls on inline functional parameters

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: while Kotlin allowed passing an inline functional parameter to another inline function
> as a receiver, it always resulted in compiler exceptions when compiling such code.
> Kotlin 1.9 will prohibit this, thus reporting an error instead of crashing the compiler.
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning (or an error in the progressive mode) for inline extension calls on inline functional parameters
> - 1.9.0: raise the warning to an error

### Prohibit calls to infix functions named suspend with an anonymous function argument

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will no longer allow calling infix functions named `suspend` that have a single argument of 
> a functional type passed as an anonymous function literal.
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning on suspend infix calls with an anonymous function literal
> - 1.9.0: raise the warning to an error,
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError` can be used to temporarily revert to the pre-1.9 behavior
> - TODO: Change how the `suspend fun` token sequence is interpreted by the parser

### Prohibit using captured type parameters in inner classes against their variance

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will prohibit using type parameters of an outer class having `in` or `out` variance in 
> an inner class of that class in positions violating that type parameters' declared variance.
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning (or an error in the progressive mode) when an outer class' type parameter usage position violates the variance rules of that parameter
> - 1.9.0: raise the warning to an error,
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` can be used to temporarily revert to the pre-1.9 behavior

### Prohibit recursive call of a function without explicit return type in compound assignment operators

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will prohibit calling a function without explicitly specified return type in an argument
> of a compound assignment operator inside that function's body, as it currently does in other expressions inside the body of that function.
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning (or an error in the progressive mode) when a function without explicitly specified return type is
>   called recursively in that function's body in a compound assignment operator argument
> - 1.9.0: raise the warning to an error

### Prohibit unsound calls with expected @NotNull T and given Kotlin generic parameter with nullable bound

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will prohibit method calls where a value of a potentially nullable generic type is passed
> for a `@NotNull`-annotated parameter of a Java method.
>
> **Deprecation cycle**:
>
> - 1.5.20: report a warning when an unconstrained generic type parameter is passed where a non-nullable type is expected
> - 1.9.0: report a type mismatch error instead of the warning above,  
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` can be used to temporarily revert to the pre-1.8 behavior

### Prohibit access to members of a companion of an enum class from entry initializers of this enum

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 will prohibit all kinds of access to the companion object of an enum from an enum entry initializer.
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning (or an error in the progressive mode) on such companion member access
> - 1.9.0: raise the warning to an error,
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` can be used to temporarily revert to the pre-1.8 behavior

### Deprecate and remove Enum.declaringClass synthetic property

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin allowed using the synthetic property `declaringClass` on `Enum` values produced from
> the method `getDeclaringClass()` of the underlying Java class `java.lang.Enum` even though this method is not available
> for Kotlin `Enum` type. Kotlin 1.9 will prohibit using this property, proposing to migrate to the extension property
> `declaringJavaClass` instead.
>
> **Deprecation cycle**:
>
> - 1.7.0: report a warning (or an error in the progressive mode) on `declaringClass` property usages,
>   propose the migration to `declaringJavaClass` extension
> - 1.9.0: raise the warning to an error,
>   `-XXLanguage:-ProhibitEnumDeclaringClass` can be used to temporarily revert to the pre-1.9 behavior
> - 2.0.0: remove `declaringClass` synthetic property

### Deprecate enable and compatibility modes of the compiler option -Xjvm-default

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 prohibits using the `enable` and `compatibility` modes of the `-Xjvm-default` compiler option.
>
> **Deprecation cycle**:
>
> - 1.6.20: introduce a warning on the `enable` and `compatibility` modes of the `-Xjvm-default` compiler option
> - 1.9.0: raise this warning to an error

### Prohibit implicit inferring a type variable into an upper bound in the builder inference context

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.0 will prohibit inferring a type variable into the corresponding type parameter's upper bound
> in the absence of any use-site type information in the scope of builder inference lambda functions, the same way as it does currently in other contexts.
>
> **Deprecation cycle**:
>
> - 1.7.20: report a warning (or an error in the progressive mode) when a type parameter is inferred into declared upper bounds in the absence of use-site type information
> - 2.0.0: raise the warning to an error

## Standard library

### Warn about potential overload resolution change when Range/Progression starts implementing Collection

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: it is planned to implement the `Collection` interface in the standard progressions and concrete ranges
> inherited from them in Kotlin 1.9. This could make a different overload selected in the overload resolution if there
> are two overloads of some method, one accepting an element and another accepting a collection.
> Kotlin will make this situation visible by reporting a warning or an error when such overloaded method is called
> with a range or progression argument.
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning when an overloaded method is called with the standard progression or its range inheritor as an argument
>   if implementing the `Collection` interface by this progression/range leads to another overload being selected in this call in future
> - 1.8.0: raise this warning to an error 
> - 2.1.0: stop reporting the error, implement `Collection` interface in progressions thus changing
>   the overload resolution result in the affected cases

### Migrate declarations from kotlin.dom and kotlin.browser packages to kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: declarations from the `kotlin.dom` and `kotlin.browser` packages are moved to the corresponding `kotlinx.*` packages to prepare for extracting them from stdlib.
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce the replacement API in `kotlinx.dom` and `kotlinx.browser` packages
> - 1.4.0: deprecate the API in `kotlin.dom` and `kotlin.browser` packages and propose the new API above as a replacement
> - 1.6.0: raise the deprecation level to an error
> - 1.8.20: remove the deprecated functions from stdlib for JS-IR target
> - \>= 2.0: move the API in kotlinx.* packages to a separate library

### Deprecate some JS-only API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: a number of JS-only functions in stdlib are deprecated for removal. They include: `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, and the `sort` functions on arrays taking a comparison function, for example, `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`.
>
> **Deprecation cycle**:
>
> - 1.6.0: deprecate the affected functions with a warning
> - 1.9.0: raise the deprecation level to an error
> - \>=2.0: remove the deprecated functions from the public API

## Tools

### Remove enableEndorsedLibs flag from Gradle setup

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: the `enableEndorsedLibs` flag is no longer supported in Gradle setup.
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` flag is supported in Gradle setup
> - 1.9.0: `enableEndorsedLibs` flag is **not** supported in Gradle setup

### Remove Gradle conventions

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle conventions were deprecated in Gradle 7.1 and have been removed in Gradle 8.
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradle conventions deprecated
> - 1.9.0: Gradle conventions removed

### Remove classpath property of KotlinCompile task

> **Issue**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: the `classpath` property of the `KotlinCompile` task is removed.
>
> **Deprecation cycle**:
>
> - 1.7.0: the `classpath` property is deprecated
> - 1.8.0: raise the deprecation level to an error
> - 1.9.0: remove the deprecated functions from the public API

### Deprecate kotlin.internal.single.build.metrics.file property

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: deprecate the `kotlin.internal.single.build.metrics.file` property used to define a single file for 
> build reports.
> Use the property `kotlin.build.report.single_file` instead with `kotlin.build.report.output=single_file`.
>
> **Deprecation cycle:**
>
> * 1.8.0: raise the deprecation level to a warning
> * \>= 1.9: delete the property
