[//]: # (title: Compatibility guide for Kotlin 1.4)

[Keeping the Language Modern* and *Comfortable Updates](kotlin-evolution.md) are among the fundamental principles in Kotlin Language Design.
The former says that constructs which obstruct language evolution should be removed, and the latter says that this
removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler warnings,
this document summarizes them all, providing a complete reference for migration from Kotlin 1.3 to Kotlin 1.4.

## Basic terms

In this document we introduce several kinds of compatibility:

- _source_: source-incompatible change stops code that used to compile fine (without errors or warnings) from compiling anymore
- _binary_: two binary artifacts are said to be binary-compatible if interchanging them doesn't lead to loading or linkage errors 
- _behavioral_: a change is said to be behavioral-incompatible if the same program demonstrates different behavior before and after applying the change

Remember that those definitions are given only for pure Kotlin. Compatibility of Kotlin code from the other languages perspective
(for example, from Java) is out of the scope of this document.

## Language and stdlib 

### Unexpected behavior with `in` infix operator and `ConcurrentHashMap`

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will outlaw auto operator `contains` coming from the implementors of `java.util.Map` written in Java
> 
> **Deprecation cycle**:
> 
> - < 1.4: introduce warning for problematic operators at call-site
> - \>= 1.4: raise this warning to an error,
>  `-XXLanguage:-ProhibitConcurrentHashMapContains` can be used to temporarily revert to pre-1.4 behavior

### Prohibit access to protected members inside public inline members

> **Issue**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will prohibit access to protected members from public inline members.
> 
> **Deprecation cycle**:
> 
> - < 1.4: introduce warning at call-site for problematic cases
> - 1.4: raise this warning to an error,
>  `-XXLanguage:-ProhibitProtectedCallFromInline` can be used to temporarily revert to pre-1.4 behavior

### Contracts on calls with implicit receivers

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **Component**: Core Language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: smart casts from contracts will be available on calls with implicit receivers in 1.4
> 
> **Deprecation cycle**: 
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` can be used to temporarily revert to pre-1.4 behavior

### Inconsistent behavior of floating-point number comparisons

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **Component**: Core language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, Kotlin compiler will use IEEE 754 standard to compare floating-point numbers
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-ProperIeee754Comparisons` can be used to temporarily revert to pre-1.4 behavior

### No smart cast on the last expression in a generic lambda

> **Issue**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **Component**: Core Language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: smart casts for last expressions in lambdas will be correctly applied since 1.4
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features. 

### Do not depend on the order of lambda arguments to coerce result to `Unit`

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, lambda arguments will be resolved independently without implicit coercion to `Unit`
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features. 

### Wrong common supertype between raw and integer literal type leads to unsound code

> **Issue**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **Components**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, common supertype between raw `Comparable` type and integer literal type will be more specific
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features. 

### Type safety problem because several equal type variables are instantiated with a different types

> **Issue**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, Kotlin compiler will prohibit instantiating equal type variables with different types   
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Type safety problem because of incorrect subtyping for intersection types

> **Issues**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: in Kotlin 1.4, subtyping for intersection types will be refined to work more correctly    
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### No type mismatch with an empty `when` expression inside lambda

> **Issue**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, there will be a type mismatch for empty `when` expression if it's used  as the last expression in a lambda
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Return type `Any` inferred for lambda with early return with integer literal in one of possible return values

> **Issue**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, integer type returning from a lambda will be more specific for cases when there is early return  
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

###  Proper capturing of star projections with recursive types

> **Issue**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, more candidates will become applicable because capturing for recursive types will work more correctly 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Common supertype calculation with non-proper type and flexible one leads to incorrect results

> **Issue**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **Component**: Core language
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, common supertype between flexible types will be more specific protecting from runtime errors 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Type safety problem because of lack of captured conversion against nullable type argument

> **Issue**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, subtyping between captured and nullable types will be more correct protecting from runtime errors 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Preserve intersection type for covariant types after unchecked cast
 
> **Issue**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, uchecked casts of covariant types produce the intersection type for smart casts,
>  not the type of the unchecked cast. 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Type variable leaks from builder inference because of using `this` expression
 
> **Issue**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, using `this` inside builder functions like `sequence {}` is prohibited if there are no other proper constraints
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Wrong overload resolution for contravariant types with nullable type arguments
 
> **Issue**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, if two overloads of a function that takes contravariant type arguments differ only
> by the nullability of the type (such as `In<T>` and `In<T?>`), the nullable type is considered more specific. 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Builder inference with non-nested recursive constraints
 
> **Issue**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, builder functions such as `sequence {}` with type that depends on a recursive
> constraint inside the passed lambda cause a compiler error. 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Eager type variable fixation leads to a contradictory constraint system
 
> **Issue**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, the type inference in certain cases works less eagerly allowing to find the 
> constraint system that is not contradictory.
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
> `-XXLanguage:-NewInference` can be used to temporarily revert to pre-1.4 behavior. Note that this flag will also
> disable several new language features.

### Prohibit `tailrec` modifier on `open` functions

> **Issue**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **Component**: Core language
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, functions can't have `open` and `tailrec` modifiers at the same time. 
> 
> **Deprecation cycle**:
> 
> - < 1.4: report a warning on functions that have `open` and `tailrec` modifiers together (error in the progressive mode).
> - \>= 1.4: raise this warning to an error.

### The `INSTANCE` field of a companion object more visible than the companion object class itself

> **Issue**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, if a companion object is private, then its field `INSTANCE` will be also private
> 
> **Deprecation cycle**:
> 
> - < 1.4: the compiler generates object `INSTANCE` with a deprecated flag
> - \>= 1.4: companion object `INSTANCE` field has proper visibility

### Outer `finally` block inserted before `return` is not excluded from the`catch` interval of the inner `try` block without `finally`

> **Issue**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, the catch interval will be computed properly for nested `try/catch` blocks
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-ProperFinally` can be used to temporarily revert to pre-1.4 behavior

### Use the boxed version of an inline class in return type position for covariant and generic-specialized overrides

> **Issues**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, functions using covariant and generic-specialized overrides will return boxed values of inline classes   
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed 

### Do not declare checked exceptions in JVM bytecode when using delegation to Kotlin interfaces

> **Issue**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will not generate checked exceptions during interface delegation to Kotlin interfaces
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` can be used to temporarily revert to pre-1.4 behavior

### Changed behavior of signature-polymorphic calls to methods with a single vararg parameter to avoid wrapping the argument into another array

> **Issue**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will not wrap the argument into another array on a signature-polymorphic call
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

### Incorrect generic signature in annotations when KClass is used as a generic parameter

> **Issue**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will fix incorrect type mapping in annotations when KClass is used as a generic parameter 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

### Forbid spread operator in signature-polymorphic calls

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin 1.4 will prohibit the use of spread operator (*) on signature-polymorphic calls 
> 
> **Deprecation cycle**:
> 
> - < 1.4: report a warning on the use of a spread operator in signature-polymorphic calls
> - \>= 1.5: raise this warning to an error,
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` can be used to temporarily revert to pre-1.4 behavior

### Change initialization order of default values for tail-recursive optimized functions

> **Issue**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Since Kotlin 1.4, the initialization order for tail-recursive functions will be the same as for regular functions 
> 
> **Deprecation cycle**:
> 
> - < 1.4: report a warning at declaration-site for problematic functions
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` can be used to temporarily revert to pre-1.4 behavior

### Do not generate `ConstantValue` attribute for non-`const` `val`s

> **Issue**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: Since Kotlin 1.4, the compiler will not generate the `ConstantValue` attribute for non-`const` `val`s 
> 
> **Deprecation cycle**:
> 
> - < 1.4: report a warning through an IntelliJ IDEA inspection
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-NoConstantValueAttributeForNonConstVals` can be used to temporarily revert to pre-1.4 behavior

### Generated overloads for `@JvmOverloads` on `open` methods should be `final`

> **Issue**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **Components**: Kotlin/JVM
> 
> **Incompatible change type**: source
> 
> **Short summary**: overloads for functions with `@JvmOverloads` will be generated as `final`
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed,
>  `-XXLanguage:-GenerateJvmOverloadsAsFinal` can be used to temporarily revert to pre-1.4 behavior

### Lambdas returning `kotlin.Result` now return boxed value instead of unboxed

> **Issue**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, lambdas returning values of `kotlin.Result` type will return boxed value instead of unboxed
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

### Unify exceptions from null checks

> **Issue**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **Component**: Kotlin/JVM
> 
> **Incompatible change type**: behavior
> 
> **Short summary**: Starting from Kotlin 1.4, all runtime null checks will throw a `java.lang.NullPointerException`
> 
> **Deprecation cycle**:
> 
> - < 1.4: runtime null checks throw different exceptions, such as `KotlinNullPointerException`, `IllegalStateException`, 
> `IllegalArgumentException`, and `TypeCastException`
> - \>= 1.4: all runtime null checks throw a `java.lang.NullPointerException`.
>   `-Xno-unified-null-checks` can be used to temporarily revert to pre-1.4 behavior

### Comparing floating-point values in array/list operations `contains`, `indexOf`, `lastIndexOf`: IEEE 754 or total order

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: the `List` implementation returned from `Double/FloatArray.asList()` will implement `contains`, `indexOf`, and `lastIndexOf`, so that they use total order equality
> 
> **Deprecation cycle**: 
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

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
> - 1.5.x: raise the deprecation level of the affected API to error
> - \>=1.6: reintroduce the affected API but with non-nullable return type

### Deprecate `appendln` in favor of `appendLine`

> **Issue**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: source
> 
> **Short summary**: `StringBuilder.appendln()` will be deprecated in favor of `StringBuilder.appendLine()`
> 
> **Deprecation cycle**:
> 
> - 1.4: introduce `appendLine` function as a replacement for `appendln` and deprecate `appendln`
> - \>=1.5: raise the deprecation level to error

### Deprecate conversions of floating-point types to `Short` and `Byte`

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **Component**: kotlin-stdlib (JVM)
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, conversions of floating-point types to `Short` and `Byte` will be deprecated 
> 
> **Deprecation cycle**:
> 
> - 1.4: deprecate `Double.toShort()/toByte()` and `Float.toShort()/toByte()` and propose replacement
> - \>=1.5: raise the deprecation level to error

### Fail fast in `Regex.findAll` on an invalid `startIndex`

> **Issue**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: since Kotlin 1.4, `findAll` will be improved to check that `startIndex` is in the range of the valid position indices of the input char sequence at the moment of entering `findAll`, and throw `IndexOutOfBoundsException` if it's not 
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

### Remove deprecated `kotlin.coroutines.experimental`

> **Issue**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, the deprecated `kotlin.coroutines.experimental` API is removed from stdlib
> 
> **Deprecation cycle**:
> 
> - < 1.4: `kotlin.coroutines.experimental` is deprecated with the `ERROR` level
> - \>= 1.4: `kotlin.coroutines.experimental` is removed from stdlib. On the JVM, a separate compatibility artifact is provided (see details in the issue).

### Remove deprecated `mod` operator

> **Issue**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: source
> 
> **Short summary**: since Kotlin 1.4, `mod` operator on numeric types is removed from stdlib
> 
> **Deprecation cycle**:
> 
> - < 1.4: `mod` is deprecated with the `ERROR` level
> - \>= 1.4: `mod` is removed from stdlib

### Hide `Throwable.addSuppressed` member and prefer extension instead

> **Issue**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: `Throwable.addSuppressed()` extension function is now preferred over the `Throwable.addSuppressed()` member function
> 
> **Deprecation cycle**:
> 
> - < 1.4: old behavior (see details in the issue)
> - \>= 1.4: behavior changed

### `capitalize` should convert digraphs to title case

> **Issue**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **Component**: kotlin-stdlib
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: `String.capitalize()` function now capitalizes digraphs from the [Serbo-Croatian Gaj's Latin alphabet](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet)
>in the title case (`ǅ` instead of `Ǆ`)
> 
> **Deprecation cycle**:
> 
> - < 1.4: digraphs are capitalized in the upper case (`Ǆ`)
> - \>= 1.4: digraphs are capitalized in the title case (`ǅ`)

## Tools

### Compiler arguments with delimiter characters must be passed in double quotes on Windows

> **Issue**: [KT-30211](https://youtrack.jetbrains.com/issue/KT-30211)
> 
> **Component**: CLI
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: on Windows, `kotlinc.bat` arguments that contain delimiter characters (whitespace, `=`, `;`, `,`) now
>require double quotes (`"`)
> 
> **Deprecation cycle**:
> 
> - < 1.4: all compiler arguments are passed without quotes
> - \>= 1.4: compiler arguments that contain delimiter characters (whitespace, `=`, `;`, `,`) require double quotes (`"`)

### KAPT: Names of synthetic `$annotations()` methods for properties have changed

> **Issue**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **Component**: KAPT
> 
> **Incompatible change type**: behavioral
> 
> **Short summary**: names of synthetic `$annotations()` methods generated by KAPT for properties have changed in 1.4
> 
> **Deprecation cycle**:
> 
> - < 1.4: names of synthetic `$annotations()` methods for properties follow the template `<propertyName>@annotations()`
> - \>= 1.4: names of synthetic `$annotations()` methods for properties include the `get` prefix: `get<PropertyName>@annotations()`