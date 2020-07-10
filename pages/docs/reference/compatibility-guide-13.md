---
type: doc
layout: reference
title: "Compatibility Guide for Kotlin 1.3"
---

# Compatibility Guide for Kotlin 1.3

*Keeping the Language Modern* and *Comfortable Updates* are among the fundamental principles in Kotlin Language Design. The former says that constructions which obstruct language evolution should be removed, and the latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 1.2 to Kotlin 1.3

## Basic terms

In this document we introduce several kinds of compatibility:

- Source: source-incompatible change stops code that used to compile fine (without errors or warnings) from compiling anymore
- Binary: two binary artifacts are said to be binary-compatible if interchanging them doesn't lead to loading or linkage errors 
- Behavioral: a change is said to be behavioral-incompatible if one and the same program demonstrates different behavior before and after applying the change

One has to remember that those definitions are given only for pure Kotlin. Compatibility of Kotlin code from the other languages perspective (e.g. from Java) is out of the scope of this document.

### Evaluation order of constructor arguments regarding `<clinit>` call

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: evaluation order with respect to class initialization is changed in 1.3
>
> **Deprecation cycle**: 
>
> - <1.3: old behavior (see details in the Issue)
> - \>= 1.3: behavior changed,
>  `-Xnormalize-constructor-calls=disable` can be used to temporarily revert to pre-1.3 behavior. Support for this flag is going to be removed in the next major release.

### Missing getter-targeted annotations on annotation constructor parameters

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: getter-target annotations on annotations constructor parameters will be properly written to classfiles in 1.3
>
> **Deprecation cycle**: 
>
> - <1.3: getter-target annotations on annotation constructor parameters are not applied
> - \>=1.3: getter-target annotations on annotation constructor parameters are properly applied and written to the generated code 

### Missing errors in class constructor’s `@get:` annotations

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: errors in getter-target annotations will be reported properly in 1.3
>
> **Deprecation cycle**:
>
> - <1.2: compilation errors in getter-target annotations were not reported, causing incorrect code to be compiled fine.
> - 1.2.x: errors reported only by tooling, the compiler still compiles such code without any warnings
> - \>=1.3: errors reported by the compiler too, causing erroneous code to be rejected

### Nullability assertions on access to Java types annotated with `@NotNull`

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: nullability assertions for Java-types annotated with not-null annotations will be generated more aggressively, causing code which passes `null` here to fail faster.
>
> **Deprecation cycle**:
>
> - <1.3: the compiler could miss such assertions when type inference was involved, allowing potential `null` propagation during compilation against binaries (see Issue for details).
> - \>=1.3: the compiler generates missed assertions. This can case code which was (erroneously) passing `null`s here fail faster.  
 `-XXLanguage:-StrictJavaNullabilityAssertions` can be used to temporarily return to the pre-1.3 behavior. Support for this flag will be removed in the next major release.

### Unsound smartcasts on enum members

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: a smartcast on a member of one enum entry will be correctly applied to only this enum entry
>
> **Deprecation cycle**:
>
> - <1.3: a smartcast on a member of one enum entry could lead to an unsound smartcast on the same member of other enum entries.
> - \>=1.3: smartcast will be properly applied only to the member of one enum entry.   
`-XXLanguage:-SoundSmartcastForEnumEntries` will temporarily return old behavior. Support for this flag will be removed in the next major release.

### `val` backing field reassignment in getter

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: reassignment of the backing field of `val`-property in its getter is now prohibited
>
> **Deprecation cycle**:
>
> - <1.2: Kotlin compiler allowed to modify backing field of `val` in its getter. Not only it violates Kotlin semantic, but also generates ill-behaved JVM bytecode which reassigns `final` field.
> - 1.2.X: deprecation warning is reported on code which reassigns backing field of `val`
> - \>=1.3: deprecation warnings are elevated to errors 

### Array capturing before the `for`-loop where it is iterated

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: Source
>
> **Short summary**: if an expression in for-loop range is a local variable updated in a loop body, this change affects loop execution. This is inconsistent with iterating over other containers, such as ranges, character sequences, and collections.
>
> **Deprecation cycle**:
> 
> - <1.2: described code patterns are compiled fine, but updates to local variable affect loop execution
> - 1.2.X: deprecation warning reported if a range expression in a for-loop is an array-typed local variable which is assigned in a loop body
> - 1.3: change behavior in such cases to be consistent with other containers 

### Nested classifiers in enum entries

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, nested classifiers (classes, object, interfaces, annotation classes, enum classes) in enum entries are prohibited
>
> **Deprecation cycle**:
>
> - <1.2: nested classifiers in enum entries are compiled fine, but may fail with exception at runtime
> - 1.2.X: deprecation warnings reported on the nested classifiers
> - \>=1.3: deprecation warnings elevated to errors

### Data class overriding `copy`

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **Components**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, data classes are prohibited to override `copy()`
>
> **Deprecation cycle**:
>
> - <1.2: data classes overriding `copy()` are compiled fine but may fail at runtime/expose strange behavior
> - 1.2.X: deprecation warnings reported on data classes overriding `copy()`
> - \>=1.3: deprecation warnings elevated to errors

### Inner classes inheriting `Throwable` that capture generic parameters from the outer class

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, inner classes are not allowed to inherit `Throwable`
>
> **Deprecation cycle**:
>
> - <1.2: inner classes inheriting `Throwable` are compiled fine. If such inner classes happen to capture generic parameters, it could lead to strange code patterns which fail at runtime.
> - 1.2.X: deprecation warnings reported on inner classes inheriting `Throwable`
> - \>=1.3: deprecation warnings elevated to errors

### Visibility rules regarding complex class hierarchies with companion objects

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, rules of visibility by short names are stricter for complex class hierarchies involving companion objects and nested classifiers.   
>
> **Deprecation cycle**:
>
> - <1.2: old visibility rules (see Issue for details)
> - 1.2.X: deprecation warnings reported on short names which are not going to be accessible anymore. Tooling suggests automated migration by adding full name.  
> - \>=1.3: deprecation warnings elevated to errors. Offending code should add full qualifiers or explicit imports

### Non-constant vararg annotation parameters

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, setting non-constant values as vararg annotation parameters is prohibited   
>
> **Deprecation cycle**:
>
> - <1.2: the compiler allows to pass non-constant value for vararg annotation parameter, but actually drops that value during bytecode generation, leading to non-obvious behavior
> - 1.2.X: deprecation warnings reported on such code patterns
> - \>=1.3: deprecation warnings elevated to errors

### Local annotation classes

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3 local annotation classes are not supported
>
> **Deprecation cycle**:
>
> - <1.2: the compiler compiled local annotation classes fine
> - 1.2.X: deprecation warnings reported on local annotation classes
> - \>=1.3: deprecation warnings elevated to errors

### Smartcasts on local delegated properties

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3 smartcasts on local delegated properties are not allowed
>
> **Deprecation cycle**:
>
> - <1.2: the compiler allowed to smartcast local delegated property, which could lead to unsound smartcast in case of ill-behaved delegates
> - 1.2.X: smartcasts on local delegated properries are reported as deprecated (the compiler issues warnings)
> - \>=1.3: deprecation warnings elevated to errors

### `mod` operator convention

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3 declaration of `mod` operator is prohibited, as well as calls which resolve to such declarations 
>
> **Deprecation cycle**:
>
> - 1.1.X, 1.2.X: report warnings on declarations of `operator mod`, as well as on calls which resolve to it
> - 1.3.X: elevate warnings to error, but still allow to resolve to `operator mod` declarations
> - 1.4.X: do not resolve calls to `operator mod` anymore

### Passing single element to vararg in named form

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). See also [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: in Kotlin 1.3, assigning single element to vararg is deprecated and should be replaced with consecutive spread and array construction.    
>
> **Deprecation cycle**:
>
> - <1.2: assigning one value element to vararg in named form compiles fine and is treated as assigning *single* element to array, causing non-obvious behavior when assigning array to vararg
> - 1.2.X: deprecation warnings are reported on such assignments, users are suggested to switch to consecutive spread and array construction.
> - 1.3.X: warnings are elevated to errors
> - \>= 1.4: change semantic of assigning single element to vararg, making assignment of array equivalent to the assignment of a spread of an array 

### Retention of annotations with target `EXPRESSION`

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, only `SOURCE` retention is allowed for annotations with target `EXPRESSION`
>
> **Deprecation cycle**:
>
> - <1.2: annotations with target `EXPRESSION` and retention other than `SOURCE` are allowed, but silently ignored at use-sites
> - 1.2.X: deprecation warnings are reported on declarations of such annotations 
> - \>=1.3: warnings are elevated to errors

### Annotations with target `PARAMETER` shouldn't be applicable to parameter's type

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **Component**: Core language
>
> **Incompatible change type**: Source
>
> **Short summary**: since Kotlin 1.3, error about wrong annotation target will be properly reported when annotation with target `PARAMETER` is applied to parameter's type 
>
> **Deprecation cycle**:
>
> - <1.2: aforementioned code patterns are compiled fine; annotations are silently ignored and not present in the bytecode
> - 1.2.X: deprecation warnings are reported on such usages
> - \>=1.3: warnings are elevated to errors

###  `Array.copyOfRange` throws an exception when indices are out of bounds instead of enlarging the returned array

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: since Kotlin 1.3, ensure that the `toIndex` argument of `Array.copyOfRange`, which represents the exclusive end of the range being copied, is not greater than the array size and throw `IllegalArgumentException` if it is. 
>
> **Deprecation cycle**:
>
> - <1.3: in case `toIndex` in the invocation of `Array.copyOfRange` is greater than the array size, the missing elements in range fill be filled with `null`s, violating soundness of the Kotlin type system. 
> - \>=1.3: check that `toIndex` is in the array bounds, and throw exception if it isn't

### Progressions of ints and longs with a step of `Int.MIN_VALUE` and `Long.MIN_VALUE` are outlawed and won’t be allowed to be instantiated

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: since Kotlin 1.3, prohibit step value for integer progressions being the minimum negative value of its integer type (`Long` or `Int`), so that calling `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` will throw `IllegalArgumentException` 
>
> **Deprecation cycle**:
>
> - <1.3: it was possible to create an `IntProgression` with `Int.MIN_VALUE` step, which yields two values `[0, -2147483648]`, which is non-obvious behavior 
> - \>=1.3: throw `IllegalArgumentException` if the step is the minimum negative value of its integer type

### Check for index overflow in operations on very long sequences

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: since Kotlin 1.3, make sure `index`, `count` and similar methods do not overflow for long sequences. See the Issue for the full list of affected methods. 
>
> **Deprecation cycle**:
>
> - <1.3: calling such methods on very long sequences could produce negative results due to integer overflow 
> - \>=1.3: detect overflow in such methods and throw exception immediately

### Unify split by an empty match regex result across the platforms

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Behavioral
>
> **Short summary**: since Kotlin 1.3, unify behavior of `split` method by empty match regex across all platforms 
>
> **Deprecation cycle**:
>
> - <1.3: behavior of described calls is different when comparing JS, JRE 6, JRE 7 versus JRE 8+
> - \>=1.3: unify behavior across the platforms

### Discontinued deprecated artifacts in the compiler distribution

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **Component**: other
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3 discontinues the following deprecated binary artifacts:
> - `kotlin-runtime`: use `kotlin-stdlib` instead
> - `kotlin-stdlib-jre7/8`: use `kotlin-stdlib-jdk7/8` instead
> - `kotlin-jslib` in the compiler distribution: use `kotlin-stdlib-js` instead
>
> **Deprecation cycle**:
>
> - 1.2.X: the artifacts were marked as deprecated, the compiler reported warning on usage of those artifacts
> - \>=1.3: the artifacts are discontinued

### Annotations in stdlib

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: Binary
>
> **Short summary**: Kotlin 1.3 removes annotations from the package `org.jetbrains.annotations` from stdlib and moves them to the separate artifacts shipped with the compiler: `annotations-13.0.jar` and `mutability-annotations-compat.jar`
>
> **Deprecation cycle**:
>
> - <1.3: annotations were shipped with the stdlib artifact
> - \>=1.3: annotations ship in separate artifacts
