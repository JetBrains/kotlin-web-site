[//]: # (title: Compatibility guide for Kotlin 1.7.0)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 1.6 to Kotlin 1.7.

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

### Make safe call result always nullable

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 will consider the type of safe call result always nullable, even when the receiver of the safe call is non-nullable
>
> **Deprecation cycle**:
>
> - &lt;1.3: report a warning on an unnecessary safe call on non-nullable receivers
> - 1.6.20: warn additionally that the result of an unnecessary safe call will change its type in the next version
> - 1.7.0: change the type of safe call result to nullable,  
> `-XXLanguage:-SafeCallsAreAlwaysNullable` can be used to temporarily revert to the pre-1.7 behavior

### Prohibit the delegation of super calls to an abstract superclass member

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: Kotlin will report a compile error when an explicit or implicit super call is delegated 
> to an _abstract_ member of the superclass, even if there's a default implementation in a super interface
>
> **Deprecation cycle**:
>
> - 1.5.20: introduce a warning when non-abstract classes that do not override all abstract members are used
> - 1.7.0: report an error if a super call, in fact, accesses an abstract member from a superclass
> - 1.7.0: report an error if the `-Xjvm-default=all` or `-Xjvm-default=all-compatibility` compatibility modes are enabled;
>   report an error in the progressive mode
> - &gt;=1.8.0: report an error in all cases

### Prohibit exposing non-public types through public properties declared in a non-public primary constructor

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin will prevent declaring public properties having non-public types in a private primary constructor.
> Accessing such properties from another package could lead to an `IllegalAccessError`
>
> **Deprecation cycle**:
>
> - 1.3.20: report a warning on a public property that has a non-public type and is declared in a non-public constructor
> - 1.6.20: raise this warning to an error in the progressive mode
> - 1.7.0: raise this warning to an error

### Prohibit access to uninitialized enum entries qualified with the enum name 

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 will prohibit access to uninitialized enum entries from the enum static initializer block
> when these entries are qualified with the enum name
>
> **Deprecation cycle**:
>
> - 1.7.0: report an error when uninitialized enum entries are accessed from the enum static initializer block

### Prohibit computing constant values of complex boolean expressions in when condition branches and conditions of loops

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin will no longer make exhaustiveness and control flow assumptions based on
> constant boolean expressions other than literal `true` and `false`
>
> **Deprecation cycle**:
>
> - 1.5.30: report a warning when exhaustiveness of `when` or control flow reachability
>   is determined based on a complex constant boolean expression in `when` branch or loop condition 
> - 1.7.0: raise this warning to an error

### Make when statements with enum, sealed, and Boolean subjects exhaustive by default

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 will report an error about the `when` statement with an enum, sealed, or Boolean subject being non-exhaustive
>
> **Deprecation cycle**:
>
> - 1.6.0: introduce a warning when the `when` statement with an enum, sealed, or Boolean subject is non-exhaustive (error in the progressive mode)
> - 1.7.0: raise this warning to an error

### Deprecate confusing grammar in when-with-subject

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 deprecated several confusing grammar constructs in `when` condition expressions
>
> **Deprecation cycle**:
>
> - 1.6.20: introduce a deprecation warning on the affected expressions
> - 1.8.0: raise this warning to an error
> - &gt;= 1.8: repurpose some deprecated constructs for new language features

### Type nullability enhancement improvements

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 will change how it loads and interprets type nullability annotations in Java code
>
> **Deprecation cycle**:
>
> - 1.4.30: introduce warnings for cases where more precise type nullability could lead to an error
> - 1.7.0: infer more precise nullability of Java types,
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` can be used to temporarily revert to the pre-1.7 behavior

### Prevent implicit coercions between different numeric types

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin will avoid converting numeric values automatically to a primitive numeric type where only a downcast to that type was needed semantically
>
> **Deprecation cycle**:
>
> - < 1.5.30: the old behavior in all affected cases
> - 1.5.30: fix the downcast behavior in generated property delegate accessors,
>   `-Xuse-old-backend` can be used to temporarily revert to the pre-1.5.30 fix behavior
> - &gt;= 1.7.20: fix the downcast behavior in other affected cases

### Deprecate the enable and the compatibility modes of the compiler option -Xjvm-default

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 warns about the usage of `enable` and `compatibility` modes of the `-Xjvm-default` compiler option
>
> **Deprecation cycle**:
>
> - 1.6.20: introduce a warning on the `enable` and `compatibility` modes of the `-Xjvm-default` compiler option
> - &gt;= 1.8.0: raise this warning to an error

### Prohibit calls to functions named suspend with a trailing lambda

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 no longer allows calling user functions named `suspend` that have the single argument of a functional type passed as a trailing lambda
>
> **Deprecation cycle**:
>
> - 1.3.0: introduce a warning on such function calls
> - 1.6.0: raise this warning to an error
> - 1.7.0: introduce changes to the language grammar so that `suspend` before `{` is parsed as a keyword

### Prohibit smart cast on a base class property if the base class is from another module

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 will no longer allow smart casts on properties of a superclass 
> if that class is located in another module
>
> **Deprecation cycle**:
>
> - 1.6.0: report a warning on a smart cast on a property declared in the superclass located in another module
> - 1.7.0: raise this warning to an error,  
> `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` can be used to temporarily revert to the pre-1.7 behavior

### Do not neglect meaningful constraints during type inference

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.4−1.6 neglected some type constraints during type inference due to an incorrect optimization.
> It could allow writing unsound code, causing `ClassCastException` at runtime.
> Kotlin 1.7 takes these constraints into account, thus prohibiting the unsound code
>
> **Deprecation cycle**:
>
> - 1.5.20: report a warning on expressions where a type mismatch would happen if all the type inference constraints were taken into account 
> - 1.7.0: take all the constraints into account, thus raising this warning to an error,  
> `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` can be used to temporarily revert to the pre-1.7 behavior


## Standard library

### Gradually change the return type of collection min and max functions to non-nullable

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: the return type of collection `min` and `max` functions will be changed to non-nullable in Kotlin 1.7
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce `...OrNull` functions as synonyms and deprecate the affected API (see details in the issue)
> - 1.5.0: raise the deprecation level of the affected API to an error
> - 1.6.0: hide the deprecated functions from the public API
> - 1.7.0: reintroduce the affected API but with non-nullable return type

### Deprecate floating-point array functions: contains, indexOf, lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin deprecates floating-point array functions `contains`, `indexOf`, `lastIndexOf` that compare values using the IEEE-754 order instead of the total order
>
> **Deprecation cycle**:
>
> - 1.4.0: deprecate the affected functions with a warning
> - 1.6.0: raise the deprecation level to an error
> - 1.7.0: hide the deprecated functions from the public API

### Migrate declarations from kotlin.dom and kotlin.browser packages to kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: declarations from the `kotlin.dom` and `kotlin.browser` packages are moved to the corresponding `kotlinx.*` packages to prepare for extracting them from stdlib
>
> **Deprecation cycle**:
>
> - 1.4.0: introduce the replacement API in `kotlinx.dom` and `kotlinx.browser` packages
> - 1.4.0: deprecate the API in `kotlin.dom` and `kotlin.browser` packages and propose the new API above as a replacement
> - 1.6.0: raise the deprecation level to an error
> - &gt;= 1.8: remove the deprecated functions from stdlib
> - &gt;= 1.8: move the API in kotlinx.* packages to a separate library


### Deprecate some JS-only API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: a number of JS-only functions in stdlib are deprecated for removal. They include: `String.concat(String)`, `String.match(regex: String)`, `String.matches(regex: String)`, and the `sort` functions on arrays taking a comparison function, for example, `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0: deprecate the affected functions with a warning
> - 1.8.0: raise the deprecation level to an error
> - 1.9.0: remove the deprecated functions from the public API


## Tools

### Remove KotlinGradleSubplugin class

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the `KotlinGradleSubplugin` class. Use the `KotlinCompilerPluginSupportPlugin` class instead
>
> **Deprecation cycle**:
>
> - 1.6.0: raise the deprecation level to an error
> - 1.7.0: remove the deprecated class

### Remove useIR compiler option

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the deprecated and hidden `useIR` compiler option
>
> **Deprecation cycle**:
>
> - 1.5.0: raise the deprecation level to a warning
> - 1.6.0: hide the option
> - 1.7.0: remove the deprecated option

### Deprecate kapt.use.worker.api Gradle property

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: deprecate the `kapt.use.worker.api` property that allowed to run kapt via Gradle Workers API (default: true)
>
> **Deprecation cycle**:
>
> - 1.6.20: raise the deprecation level to a warning
> - &gt;= 1.8.0: remove this property

### Remove kotlin.experimental.coroutines Gradle DSL option and kotlin.coroutines Gradle property

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the `kotlin.experimental.coroutines` Gradle DSL option and the `kotlin.coroutines` property
>
> **Deprecation cycle**:
>
> - 1.6.20: raise the deprecation level to a warning
> - 1.7.0: remove the DSL option, its enclosing `experimental` block, and the property

### Deprecate useExperimentalAnnotation compiler option

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the hidden `useExperimentalAnnotation()` Gradle function used to opt in to using an API in a module.
> `optIn()` function can be used instead
> 
> **Deprecation cycle:**
> 
> - 1.6.0: hide the deprecation option
> - 1.7.0: remove the deprecated option

### Deprecate kotlin.compiler.execution.strategy system property

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: deprecate the `kotlin.compiler.execution.strategy` system property used to choose a compiler execution strategy. 
> Use the Gradle property `kotlin.compiler.execution.strategy` or the compile task property `compilerExecutionStrategy` instead
>
> **Deprecation cycle:**
>
> - 1.7.0: raise the deprecation level to a warning
> - &gt; 1.7.0: remove the property

### Remove kotlinOptions.jdkHome compiler option

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the `kotlinOptions.jdkHome` compiler option used to include a custom JDK from the specified location 
> into the classpath instead of the default `JAVA_HOME`. Use [Java toolchains](gradle-configure-project.md#gradle-java-toolchains-support) instead
>
> **Deprecation cycle:**
>
> - 1.5.30: raise the deprecation level to a warning
> - &gt; 1.7.0: remove the option

### Remove noStdlib compiler option

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the `noStdlib` compiler option. The Gradle plugin uses the `kotlin.stdlib.default.dependency=true` property to control whether the Kotlin standard library is present
>
> **Deprecation cycle:**
>
> - 1.5.0: raise the deprecation level to a warning
> - 1.7.0: remove the option

### Remove kotlin2js and kotlin-dce-plugin plugins

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: remove the `kotlin2js` and `kotlin-dce-plugin` plugins. Instead of `kotlin2js`, use the new `org.jetbrains.kotlin.js` plugin. 
> Dead code elimination (DCE) works when the Kotlin/JS Gradle plugin is properly configured

>
> **Deprecation cycle:**
>
> - 1.4.0: raise the deprecation level to a warning
> - 1.7.0: remove the plugins

### Changes in compile tasks

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin compile tasks no longer inherit the Gradle `AbstractCompile` task and that's why 
> the `sourceCompatibility` and `targetCompatibility` inputs are no longer available in Kotlin users' scripts. 
> The `SourceTask.stableSources` input is no longer available. The `sourceFilesExtensions` input was removed. 
> The deprecated `Gradle destinationDir: File` output was replaced with the `destinationDirectory: DirectoryProperty` output. 
> The `classpath` property of the `KotlinCompile` task is deprecated
>
> **Deprecation cycle:**
>
> - 1.7.0: inputs are not available, the output is replaced, the `classpath` property is deprecated
