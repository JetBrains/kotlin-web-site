[//]: # (title: Compatibility guide for Kotlin 2.5.x)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.4 to Kotlin 2.5.
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
> - 2.4.0: report a warning
> - 2.5.0: raise the warning to an error
-->

### Report type variance conflicts in definitely non-nullable and flexible types

> **Issue**: [KTLC-392](https://youtrack.jetbrains.com/issue/KTLC-392)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports a variance conflict error when a type parameter is used in a position that
> conflicts with its declared variance inside a [definitely non-nullable type](generics.md#definitely-non-nullable-types), such as `T & Any`,
> or inside a flexible type, such as the `T!` type inferred from a Java call.
> Previously, the compiler didn't check these types, which made it possible to accidentally violate variance restrictions.
>
> To temporarily use the previous behavior, add the `-XXLanguage:-ReportTypeVarianceConflictsInDnnAndFlexible` compiler
> option.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for type variance conflicts in definitely non-nullable and flexible types

### Report conflicting inherited implementations of functions named `toString`, `equals`, or `hashCode`

> **Issue**: [KTLC-415](https://youtrack.jetbrains.com/issue/KTLC-415)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: When a class inherits the same function from a common superinterface through several delegated
> interfaces, the compiler reports an error because the class has more than one implementation of that function.
> Previously, the compiler didn't report this error for functions named `toString`, `equals`, or `hashCode` that also
> have an extension receiver or context parameters, because it treated them as the corresponding functions of `Any`.
> To migrate, override the function explicitly in the class.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for conflicting inherited implementations of such functions

### Disable unsound non-null smart casts after equality checks

> **Issue**: [KTLC-410](https://youtrack.jetbrains.com/issue/KTLC-410)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: After an equality (`==`) or identity (`===`) check, the compiler could smart cast a nullable operand
> to a non-nullable type when the other operand had a type parameter type with nullable upper bounds or a flexible type
> from Java. These smart casts were unsound and could lead to a `NullPointerException` at runtime.
>
> Kotlin now considers that such operands can be `null`: type parameters are treated as non-nullable only if they have
> a non-nullable upper bound, and flexible types are treated as nullable. As a result, code that relied on these smart casts
> no longer compiles. To migrate, add an explicit null check, or annotate the relevant Java declarations with `@NotNull`.
>
> **Deprecation cycle**:
>
> - 2.5.0: disable the unsound smart casts

### Report repeated annotations on expressions after expect and actual annotation resolution

> **Issue**: [KTLC-409](https://youtrack.jetbrains.com/issue/KTLC-409)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: In multiplatform projects, the compiler now reports a `REPEATED_ANNOTATION` error when two annotations
> on the same expression resolve to the same non-repeatable annotation class on a platform. For example, this happens
> when an `expect annotation class` is actualized by a typealias to another annotation class that's already applied to
> the same expression.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error for annotations on expressions that become repeated after expect and actual annotation resolution

### Change the type of class literals for unbounded reified type parameters

> **Issue**: [KTLC-360](https://youtrack.jetbrains.com/issue/KTLC-360)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: For a reified type parameter `T` without a non-nullable upper bound, the type of the `T::class`
> expression changes from `KClass<T>` to `KClass<T & Any>`. The previous type violated the upper bound of the `KClass`
> type parameter. Accordingly, the signature of the [`.java`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/java.html) 
> extension property changes to `KClass<T & Any>.java: Class<T>`.
>
> The behavior of `T::class` doesn't change, but in rare cases the new types can lead to type mismatches or select a
> different overload. For example, when you assign `T::class.java` to a variable without an explicit type, the variable
> type becomes `Class<T & Any>` instead of `Class<T>`. To migrate, specify the expected type explicitly, such as
> `val c: Class<T> = T::class.java`, or specify the type arguments of the called function explicitly.
>
> **Deprecation cycle**:
>
> - 2.5.0: introduce the new type for class literals of unbounded reified type parameters

### Preserve upper bounds of intersection types after the `!!` operator

> **Issue**: [KTLC-405](https://youtrack.jetbrains.com/issue/KTLC-405)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: Kotlin fixes type inference for expressions with the [not-null assertion operator `!!`](null-safety.md#not-null-assertion-operator)
> whose type is an intersection type with an upper bound. Previously, the compiler lost the upper bound, so for
> `fun <T : Number> select(vararg t: T): T?`, the type of `select(1.0, 1L)!!` was approximated to `Any` instead of `Number`.
>
> As a result, declarations without an explicit type can get a more precise type. This can lead to type mismatches in
> existing code, and it can change the signatures of public declarations after recompilation. To keep the previous type,
> specify it explicitly.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

### Parse `error` before local declarations as a modifier

> **Issue**: [KTLC-420](https://youtrack.jetbrains.com/issue/KTLC-420)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The [rich errors proposal](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0462-rich-errors.md)
> introduces `error` as a soft keyword modifier.
> Starting with Kotlin 2.5.0, when a standalone `error` expression is directly followed by a local class or function
> declaration, the parser treats `error` as a modifier of that declaration, such as `error class NoData`.
> As a result, code that uses a standalone `error` expression before a local declaration no longer compiles.
>
> **Deprecation cycle**:
>
> - 2.5.0: parse `error` before local declarations as a modifier

### Normalize NaN values produced by compile-time constant evaluation

> **Issue**: [KTLC-419](https://youtrack.jetbrains.com/issue/KTLC-419)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: When the compiler evaluates a constant expression to NaN, for example, in an initializer of a
> `const val` property or in an annotation argument, it now always produces the standard `Float.NaN` or `Double.NaN`
> bit pattern. Previously, the bit pattern of such NaN values depended on the platform where the code was compiled.
> This change only affects code that relies on the exact bit pattern of NaN values, for example, through the `toRawBits()`
> function.
>
> To use the previous behavior, add the `-Xdo-not-normalize-nan-values-in-const-context` compiler option.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

### Prohibit implicit usages of inaccessible types in constructor calls

> **Issue**: [KTLC-398](https://youtrack.jetbrains.com/issue/KTLC-398)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports an error when a constructor call implicitly uses a type from an indirect
> dependency that isn't available to the compiler. For example, if the `Middle` class extends the `Missing` class from a
> module that your module doesn't depend on, the `Middle()` call results in an error. Previously, such code could compile,
> but the inferred types depended on the presence of the transitive dependency, which could lead to inconsistencies.
> To migrate, add an explicit dependency on the module that declares the inaccessible type.
>
> This change follows a similar change for other implicit references to inaccessible types. For more information, see [KTLC-384](compatibility-guide-24.md#forbid-implicit-references-to-inaccessible-types).
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning for implicit usages of inaccessible types in constructor calls
> - 2.5.0: raise the warning to an error

### Report upper-bound violations in type operators and type parameter bounds

> **Issue**: [KTLC-358](https://youtrack.jetbrains.com/issue/KTLC-358)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports `UPPER_BOUND_VIOLATED` errors for types in `as` and `is` type operators and
> in type parameter bounds, including `where` clauses. Previously, the compiler didn't report these violations, which
> could lead to ill-formed types and runtime exceptions such as `ClassCastException`. For example, for
> `interface Consumer<T : Consumer<T>>`, the `Impl() as Consumer<Any>` cast now results in an error because `Any` isn't
> a subtype of `Consumer<Any>`.
>
> **Deprecation cycle**:
>
> - 2.3.0: report warnings for upper-bound violations in type operators and type parameter bounds
> - 2.5.0: raise the warnings to errors

### Forbid `external` modifier on enum entries and primary constructor properties

> **Issue**: [KTLC-389](https://youtrack.jetbrains.com/issue/KTLC-389)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin doesn't support `external` properties on any platform. However, the compiler allowed the
> `external` modifier on enum entries and on properties declared in primary constructors.
> Such code either failed at runtime or the `external` modifier was ignored. The compiler now reports an error when
> you use the `external` modifier in these cases. To migrate, remove the `external` modifier.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when the `external` modifier is used on enum entries and primary constructor properties
> - 2.5.0: raise the warning to an error

### Prohibit conflicting projections in the left-hand side of callable references

> **Issue**: [KTLC-393](https://youtrack.jetbrains.com/issue/KTLC-393)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now checks projections in the left-hand side of callable references in the same way as
> in type references. It reports an error if a projection conflicts with the declared variance of the corresponding type
> parameter. For example, for `interface Out<out X>`, the `Out<in CharSequence>::func` reference results in an error.
> Previously, such code could compile but fail in the compiler backend or produce error types. To migrate,
> remove the projection or replace it with `*`.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning for redundant projections and a deprecation warning for conflicting projections in the
>   left-hand side of callable references
> - 2.5.0: raise the deprecation warning for conflicting projections to an error

### Report deprecations of outer classes in imports

> **Issue**: [KTLC-397](https://youtrack.jetbrains.com/issue/KTLC-397)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports deprecations of outer classes when you import their nested declarations.
> For example, the compiler reports a deprecation on `import my.C.Companion.a` if the `C` class is deprecated.
> Previously, the compiler didn't report deprecations in such cases.
>
> **Deprecation cycle**:
>
> - 2.4.20: report the missing deprecations; report a warning for deprecations with the `ERROR` or `HIDDEN` level
> - 2.5.0: report deprecations with the `ERROR` and `HIDDEN` levels as errors

### Prohibit annotations, type arguments, and parentheses on package parts of qualifiers

> **Issue**: [KTLC-396](https://youtrack.jetbrains.com/issue/KTLC-396)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports an error when you use annotations, type arguments, or parentheses on the
> package part of a qualified expression, for example, `part1<Int>.part2.foo()` or `(@MyAnnotation part1.part2).foo()`.
> Packages can't have type arguments or annotations and can't be used as expressions, so such constructs had no effect.
> To migrate, remove them.
>
> **Deprecation cycle**:
>
> - 2.4.20: report a warning for annotations, type arguments, and parentheses on package parts of qualifiers
> - 2.5.0: raise the warning to an error

### Prohibit recursive inline value classes through type parameter upper bounds

> **Issue**: [KTLC-401](https://youtrack.jetbrains.com/issue/KTLC-401)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin already prohibits inline value classes whose underlying type is recursive,
> such as `value class Rec(val x: Rec)`.
> The compiler now also reports an error when the recursion goes through a type parameter upper bound,
> for example, `value class V<T : V<T>>(val value: T)`. Previously, such declarations behaved differently depending on
> the backend: they worked on the JVM but led to non-terminating compilation on Kotlin/Native.
>
> **Deprecation cycle**:
>
> - 2.4.20: report a warning for inline value classes that are recursive through a type parameter upper bound
> - 2.5.0: raise the warning to an error

### Report deprecation and opt-in errors for companion object access in delegates, augmented assignments, and callable references

> **Issue**: [KTLC-408](https://youtrack.jetbrains.com/issue/KTLC-408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: When a class name implicitly refers to its companion object, the compiler reports deprecation and
> opt-in errors if the companion object is deprecated or requires opt-in.
> 
> Previously, the compiler didn't report these errors when such access happened in a property delegate, such as `val x by C`,
> in the left-hand side of an augmented assignment, such as `C += ""`, or in the left-hand side of some callable references.
> such as `C::foo`.
>
> **Deprecation cycle**:
>
> - 2.4.20: report a deprecation warning for such companion object accesses
> - 2.5.0: report deprecation and opt-in errors

### Remove language version 2.0 and 2.1

> **Issue**: [KT-86132](https://youtrack.jetbrains.com/issue/KT-86132)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.5.0 introduces language version 2.5 and removes support for language versions 2.0 and 2.1.
>
> **Deprecation cycle**:
>
> - 2.5.0: report an error

### Deprecate language version 2.2
>
> **Issue**: [KT-86132](https://youtrack.jetbrains.com/issue/KT-86131)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.5.0 introduces language version 2.5 and starts the deprecation cycle for the language version 2.2.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning

### Enforce read-only collection types for Java declarations annotated with `@Unmodifiable` and `@UnmodifiableView`

> **Issue**: [KTLC-377](https://youtrack.jetbrains.com/issue/KTLC-377)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now treats collection types in Java declarations annotated with `org.jetbrains.annotations.Unmodifiable`
> or `org.jetbrains.annotations.UnmodifiableView` as read-only, for example, `List` instead of `MutableList`.
> As a result, the compiler reports an error when you pass such a collection where a mutable collection is expected or
> call mutating functions on it. Previously, such code compiled but could throw an exception at runtime.
>
> **Deprecation cycle**:
>
> - 2.3.20: report warnings for mutability mismatches based on the `@Unmodifiable` and `@UnmodifiableView` annotations
> - 2.5.0: raise the warnings to errors

### Deprecate `-generate-worker-test-runner` in Kotlin/Native

> **Issue**: [KT-61582](https://youtrack.jetbrains.com/issue/KT-61582)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The `-generate-worker-test-runner` (or `-trw`) Kotlin/Native compiler option, which ran
> `kotlin.test` tests on a separate worker thread instead of the main thread, is deprecated.
> Remove the option to run tests on the main thread by default, or use the `Worker` API directly if your tests
> require execution on a separate thread.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when using `-generate-worker-test-runner` (`-trw`)

### Remove eager `GlobalData` initialization in Kotlin/Native

> **Issue**: [KT-80005](https://youtrack.jetbrains.com/issue/KT-80005)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Support for eager `GlobalData` initialization in the Kotlin/Native runtime (initializing the runtime
> at program startup instead of on first access to Kotlin) is removed, and the binary option for enabling it is deprecated.
> To migrate, remove the option from your project configuration.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when setting the option to `true`
> - 2.5.0: raise the warning to an error

### Deprecate Android NDK targets

> **Issue**: [KT-87873](https://youtrack.jetbrains.com/issue/KT-87873)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: source
>
> **Short summary**: Android NDK targets (`androidNativeArm32`, `androidNativeArm64`, `androidNativeX86`, and `androidNativeX64`)
> are deprecated because they are no longer actively maintained.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when Android NDK targets are declared

## Standard library

### Make equality of ranges and progressions symmetric

> **Issue**: [KTLC-421](https://youtrack.jetbrains.com/issue/KTLC-421), [KT-48530](https://youtrack.jetbrains.com/issue/KT-48530)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Previously, comparing a range with a progression that has the same bounds and a step of 1 returned
> different results depending on the order of the operands: `1..2 == 1..2 step 1` returned `false`, while
> `1..2 step 1 == 1..2` returned `true`.
>
> Starting with Kotlin 2.5.0, iterable ranges (`CharRange`, `IntRange`, `LongRange`, `UIntRange`, and `ULongRange`)
> use the `equals()` and `hashCode()` implementations of their parent progression classes, so both comparisons return `true`.
> This can change the contents of sets and maps that contain both ranges and progressions.
> The `hashCode()` values of ranges also change.
>
> **Deprecation cycle**:
>
> - 2.5.0: enable the new behavior

### Deprecate `StringBuilder.append(obj: Any?)` extension function

> **Issue**: [KTLC-395](https://youtrack.jetbrains.com/issue/KTLC-395)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `StringBuilder.append(obj: Any?)` extension function is deprecated. Use the `StringBuilder.append(value: Any?)
> member function instead.
> This change affects only calls that specify the parameter name explicitly, such as `append(obj = value)`,
> because calls without a named argument already resolve to the member function.
> To migrate, remove the parameter name from the call.
>
> **Deprecation cycle**:
>
> - 1.3.70: report a warning
> - 2.5.0: raise the warning to an error

## Tools

### Raising the minimum required runtime JDK version to JDK 17 or later

> **Issue**: [KT-88174](https://youtrack.jetbrains.com/issue/KT-88174)
>
> **Component**: Compiler
>
> **Incompatible change type**: source
>
> **Short summary**: Starting with Kotlin 2.5.0, the minimum required runtime JDK version for running the Kotlin compiler
> (`kotlinc`, as well as Kotlin compilations in Gradle and Maven builds) is raised from JDK 8 to JDK 17.
>
> To migrate, run your build tool or compiler with JDK 17 or later:
> * Gradle: Set the `org.gradle.java.home` property (via `-Dorg.gradle.java.home` or `gradle.properties`), set `JAVA_HOME`,
>   or add JDK 17 to your `PATH`. Note that `jvmToolchain()` only configures `-jdk-home` and the default `-jvm-target`,
>   not the JDK used to run the Gradle daemon.
> * Maven: Set `JAVA_HOME` or add JDK 17 to your `PATH`. Note that `jdkToolchain` and `maven-toolchains-plugin` do not
>   change the runtime JDK used by the Maven process.
> * Command line (`kotlinc`): Set `JAVA_HOME` or add JDK 17 to your `PATH`.
>
> Upgrading the runtime JDK does not affect the generated bytecode version (`jvmTarget` / `-jvm-target`) or compilation
> classpath (`-jdk-home`).
>
> Running the compiler on a JDK earlier than 17 now results in a compilation error.Temporarily, you can suppress the
> error by passing the `-Xallow-pre-17-runtime-jdk` compiler option in `compilerOptions.freeCompilerArgs`
> for Gradle, `<args>` for Maven, or directly to `kotlinc`.
>
> **Deprecation cycle**:
>
> - 2.5.0-Beta1: report a warning when running the Kotlin compiler on a JDK earlier than 17
> - 2.5.0-Beta2: raise the warning to an error (temporarily suppressible with `-Xallow-pre-17-runtime-jdk`)
> - 2.5.20-Beta1: require JDK 17 or later as the minimum runtime version and deprecate `-Xallow-pre-17-runtime-jdk`

### Deprecate `kotlin.mpp.freeCompilerArgsForSourceSet` Gradle property

> **Issue**: [KT-86611](https://youtrack.jetbrains.com/issue/KT-86611)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.mpp.freeCompilerArgsForSourceSet.<source-set-name>` Gradle property, which passes Kotlin
> compiler arguments as strings to the specified Kotlin Multiplatform source set, is deprecated.
> Use the [`compilerOptions.freeCompilerArgs`](gradle-compiler-options.md) DSL instead. If you need to configure compiler arguments
> through a Gradle property, connect your custom property to the `compilerOptions.freeCompilerArgs` DSL in your build script.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when using the `kotlin.mpp.freeCompilerArgsForSourceSet` Gradle property

### Remove the `ExperimentalWasmDsl` annotation from Wasm JS target declarations

> **Issue**: [KT-87562](https://youtrack.jetbrains.com/issue/KT-87562)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: As part of the Kotlin/Wasm stabilization, the Kotlin Gradle plugin declarations related to the `wasmJs`
> target are no longer marked with the `@ExperimentalWasmDsl` annotation. You don't need to opt in to use them.
>
> **Deprecation cycle**:
>
> - 2.5.0: remove the `@ExperimentalWasmDsl` annotation from declarations related to the `wasmJs` target

### Report an error when the Kotlin Gradle plugin is loaded multiple times

> **Issue**: [KT-30276](https://youtrack.jetbrains.com/issue/KT-30276), [KT-61225](https://youtrack.jetbrains.com/issue/KT-61225)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The Kotlin Gradle plugin now reports an error and fails the build when it is loaded multiple times
> across subprojects or classloaders in a build.
>
> To avoid the error, ensure the plugin is loaded once in a common parent classloader, for example, by declaring the
> plugin with a version and `apply false` in the root project's `plugins {}` block
> (or in `buildSrc` / convention plugins) and omitting explicit plugin versions in subprojects.
>
> **Deprecation cycle**:
>
> - 1.3.30: report a warning when the Kotlin Gradle plugin is loaded multiple times
> - 2.5.0: raise the warning to an error

### Deprecate `implementationMetadataConfigurationName` property

> **Issue**: [KT-55312](https://youtrack.jetbrains.com/issue/KT-55312), [KT-80897](https://youtrack.jetbrains.com/issue/KT-80897)
>
> **Component**: Gradle
>
> **Incompatible change type**: binary
>
> **Short summary**: The `implementationMetadataConfigurationName` property in the `KotlinSourceSet` interface is deprecated.
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning
> - 2.2.0: raise the warning to an error
> - 2.3.0: hide the property
> - 2.5.0: remove the property

### Deprecate `wasm()` target

> **Issue**: [KT-89510](https://youtrack.jetbrains.com/issue/KT-89510)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `wasm()` target functions are deprecated. Use the `wasmJs()` target instead.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning
> - 2.2.0: raise the warning to an error
> - 2.5.0: remove the `wasm()` target functions

### Deprecate properties in `NodeJsRootExtension`

> **Issue**: [KT-89508](https://youtrack.jetbrains.com/issue/KT-89508)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The properties in the `NodeJsRootExtension` extension are deprecated. Use the `NodeJsEnvSpec` and 
> `WasmNodeJsEnvSpec` extensions instead. Unlike `NodeJsRootExtension`, which is configured in the root project,
> these extensions are configured per project.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning
> - 2.2.0: raise the warning to an error
> - 2.5.0: remove the deprecated properties

### Deprecate Binaryen declarations

> **Issue**: [KT-89509](https://youtrack.jetbrains.com/issue/KT-89509), [KT-84258](https://youtrack.jetbrains.com/issue/KT-84258)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Several Binaryen-related declarations in the Kotlin Gradle plugin are deprecated, namely:
>
> * `inputFileProperty`
> * `outputFileName`
> * `outputFileProperty`
> * `binaryenArgs`
>
> Use the `BinaryenEnvSpec` extension instead, which is configured per project.
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning
> - 2.2.0: raise the warning to an error
> - 2.5.0: remove the deprecated declarations

### Deprecate public `KotlinJsIrTarget` constructor

> **Issue**: [KT-86112](https://youtrack.jetbrains.com/issue/KT-86112)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The public `KotlinJsIrTarget(project: Project, platformType: KotlinPlatformType, isMpp: Boolean)`
> constructor is deprecated. You don't need to create instances of `KotlinJsIrTarget` manually because the Kotlin Gradle
> plugin creates them internally.
>
> **Deprecation cycle**:
>
> - 2.4.20: report a warning when using the public `KotlinJsIrTarget` constructor
> - 2.5.0: raise the warning to an error

### Deprecate `resolveRootProject()` function with the `services` parameter

> **Issue**: [KT-84740](https://youtrack.jetbrains.com/issue/KT-84740)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `resolveRootProject()` function overload with the unused `services: ServiceRegistry` parameter
> in the `NpmApiExecution` interface is deprecated. To migrate, use the alternative suggested by the deprecation's
> `ReplaceWith` argument: the `resolveRootProject(logger, nodeJs, packageManagerEnvironment, cliArgs)` overload.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when using `resolveRootProject()` with the `services` parameter
> - 2.5.0: raise the warning to an error

### Remove the legacy mode for Kotlin/JVM compilation without the Build tools API

> **Issue**: [KT-85434](https://youtrack.jetbrains.com/issue/KT-85434)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The Kotlin Gradle plugin continues migrating to the [Build tools API](build-tools-api.md) and drops
> older ways of invoking the Kotlin compiler. Now Kotlin/JVM compilations always run through the Build tools API.
> This change shouldn't affect your builds. However, the `kotlin.compiler.runViaBuildToolsApi` Gradle property no longer
> has any effect, so you can remove it from your `gradle.properties` file.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning
> - 2.5.0: remove the legacy mode for Kotlin/JVM compilation without the Build tools API

### Deprecate `contains()` function in Build tools API compiler arguments

> **Issue**: [KT-85448](https://youtrack.jetbrains.com/issue/KT-85448)
>
> **Component**: Build tools API
>
> **Incompatible change type**: source, behavioral
>
> **Short summary**: Calling the `contains()` function on Build tools API compiler argument classes, such as `JvmCompilerArguments`,
> is deprecated. In newer Build tools API versions, all compiler arguments have default values, so this function always
> returns `true`, and checking whether an argument is present is meaningless. To migrate, remove calls to this function.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when using the `contains()` function
> - 2.5.0: raise the warning to an error

### Prohibit unsupported compiler arguments in `applyArgumentStrings()` function

> **Issue**: [KT-85439](https://youtrack.jetbrains.com/issue/KT-85439), [KT-85464](https://youtrack.jetbrains.com/issue/KT-85464)
>
> **Component**: Build tools API
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The Build tools API no longer allows passing some Kotlin compiler arguments through the `applyArgumentStrings()`
> function. These arguments either conflict with the configuration that the Build tools API manages itself or represent
> functionality that the Build tools API doesn't support:
>
> * `-Xenable-incremental-compilation`
> * `-Xrepl`
> * `-d`
> * `-expression` and its short form `-e`
> * `-include-runtime`
> * `-Xbuild-file` and its deprecated name `-module`
>
> If you pass any of these arguments to `applyArgumentStrings()`, the compilation fails. Depending on the compiler version
> and when argument validation happens, the Build tools API throws a `CompilerArgumentsParseException` or reports the
> parsing error when the compilation runs. This change affects only the Build tools API. The corresponding options are
> still available in the Kotlin command-line compiler.
>
> To migrate:
>
> * Replace `-Xenable-incremental-compilation` with the `JvmCompilationOperation.INCREMENTAL_COMPILATION` configuration
>   option.
> * Replace `-d` with the `destinationDirectory` parameter of the `JvmPlatformToolchain.jvmCompilationOperationBuilder()`
>   function.
> * Remove `-Xrepl`, `-expression` (`-e`), `-include-runtime`, and `-Xbuild-file` (`-module`) from calls to
>   `applyArgumentStrings()`, because the Build tools API doesn't support this functionality.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when these arguments are passed to `applyArgumentStrings()`
> - 2.5.0: raise the warning to an error

### Remove `MONOTONOUS_INCREMENTAL_COMPILE_SET_EXPANSION` option from `JvmSnapshotBasedIncrementalCompilationConfiguration`

> **Issue**: [KT-88776](https://youtrack.jetbrains.com/issue/KT-88776)
>
> **Component**: Build tools API
>
> **Incompatible change type**: source, behavioral
>
> **Short summary**: The experimental `JvmSnapshotBasedIncrementalCompilationConfiguration.MONOTONOUS_INCREMENTAL_COMPILE_SET_EXPANSION`
> option is deprecated. Use `BaseIncrementalCompilationConfiguration.MONOTONOUS_INCREMENTAL_COMPILE_SET_EXPANSION` instead.
>
> **Deprecation cycle**:
>
> - 2.4.0: report a warning when using `JvmSnapshotBasedIncrementalCompilationConfiguration.MONOTONOUS_INCREMENTAL_COMPILE_SET_EXPANSION`
> - 2.5.0: remove the option

### Deprecate `applyArgumentStrings()` function

> **Issue**: [KT-86169](https://youtrack.jetbrains.com/issue/KT-86169)
>
> **Component**: Build tools API
>
> **Incompatible change type**: source
>
> **Short summary**: The `applyArgumentStrings()` function in the [Build tools API](build-tools-api.md) is deprecated because
> its behavior is unsafe and unintuitive: it silently resets previously set values to their defaults.
> Use the new `applyCommandLineArguments()` function instead. It only sets the values that you specify explicitly and
> doesn't affect other options.
>
> **Deprecation cycle**:
>
> - 2.5.0: report a warning when using the `applyArgumentStrings()` function
