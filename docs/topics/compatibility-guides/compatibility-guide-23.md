[//]: # (title: Compatibility guide for Kotlin 2.3)

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

### Drop support in `-language-version` for 1.8 and 1.9

> **Issue**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **Component**: Compiler
>
> **Incompatible change type**: source
>
> **Short summary**: Starting with Kotlin 2.3, the compiler no longer supports [`-language-version=1.8`](compiler-reference.md#language-version-version).
> Support for `-language-version=1.9` is also removed for non-JVM platforms.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when using `-language-version` with versions 1.8 and 1.9
> - 2.3.0: raise the warning to an error for `-language-version` with version 1.8 on all platforms and for version 1.9 on non-JVM platforms

### Report upper-bound constraint violation errors for inferred types with typealiases

> **Issue**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Previously, the compiler never reported errors about upper-bound violation constraints for the inferred types. This
> has been fixed in Kotlin 2.3.0 so that the error is reported consistently across all type parameters.
>
> **Deprecation cycle**:
>
> - 2.2.20: report deprecation warnings for bounds violations by implicit type arguments
> - 2.3.0: raise the warning to an error for `UPPER_BOUND_VIOLATED` on implicit type arguments

### Prohibit `@JvmSerializableLambda` annotation on `inline` and `crossinline` lambdas

> **Issue**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: You can no longer apply the `@JvmSerializableLambda` annotation to `inline` or `crossinline` lambdas.
> These lambdas aren't serializable, so applying `@JvmSerializableLambda` had no effect.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning when the `@JvmSerializableLambda` is applied to `inline` and `crossinline` lambdas
> - 2.3.0: raise the warning to an error; this change can be enabled in progressive mode

### Prohibit delegating a Kotlin interface to a Java class when the generic signatures don't match

> **Issue**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 forbids delegation to a Java class that implements a generic interface method with
> a non-generic override. Previously, allowing this behavior led to type mismatches and `ClassCastException` reported at runtime.
> This change shifts the error from runtime to compile time.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate use of `return` in expression-bodied functions without explicit return type

> **Issue**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now deprecates using `return` inside expression bodies when the function's return type isn't
> explicitly declared.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning
> - 2.4.0: raise the warning to an error

### Prohibit inheritance from nullable supertypes introduced via typealias

> **Issue**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin now reports an error when attempting to inherit from a nullable typealias, which is consistent with
> how it already handles direct nullable supertypes.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning
> - 2.3.0: raise the warning to an error

### Unify generic signature generation for top-level lambdas and call arguments

> **Issue**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **Component**: Reflection
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 2.3.0 uses the same type-checking logic for top-level lambdas as it does for lambdas passed 
> as call arguments, ensuring consistent generic signature generation across both cases.
>
> **Deprecation cycle**:
>
> - 2.3.0: introduce the new behavior; not applicable in progressive mode

### Prohibit reified type parameters from being inferred as intersection types

> **Issue**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 prohibits situations where a reified type parameter is inferred to an intersection type, 
> as this could lead to incorrect runtime behavior.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning when a reified type parameter is inferred as an intersection type
> - 2.3.0: raise the warning to an error

### Prohibit exposing less-visible types through type parameter bounds

> **Issue**: [KTLC-275](https://youtrack.jetbrains.com/issue/KTLC-275)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 forbids using type parameter bounds that expose types with more restrictive visibility
> than the function or declaration itself, aligning the rules for functions with those already applied to classes.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning on the problematic type parameter bound
> - 2.3.0: raise the warning to an error

## Standard library

### Deprecate Char-to-number conversions and introduce explicit digit and code APIs

> **Issue**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 deprecates `Char.toX()` and `X.toChar()` conversions for numeric types and introduces new,
> explicit APIs for accessing a character's code and digit value.
>
> **Deprecation cycle**:
>
> - 1.4.30: introduce new functions as Experimental
> - 1.5.0: promote the new functions to Stable; report warnings for old functions with suggestions for replacements
> - 2.3.0: raise the warnings to errors

### Deprecate `Number.toChar()` function

> **Issue**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `Number.toChar()` function is deprecated. Use `toInt().toChar()` or the `Char` constructor instead.
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning when using the `Number.toChar()` function
> - 2.3.0: raise the warning to an error

### Deprecate `String.subSequence(start, end)` function

> **Issue**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `String.subSequence(start, end)` function is deprecated. Use the [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) function instead.
>
> **Deprecation cycle**:
>
> - 1.0: report a warning when using `String.subSequence(start, end)`
> - 2.3.0: raise the warning to an error

### Deprecate `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions

> **Issue**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions are deprecated. 
> Use the [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) and [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) functions instead.
>
> **Deprecation cycle**:
>
> - 1.4.20: report a warning when using `kotlin.io.createTempDirectory()` and `kotlin.io.createTempFile()` functions
> - 2.3.0: raise the warning to an error

### Hide `InputStream.readBytes(Int)` function

> **Issue**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: After being deprecated for a long time, the `InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` function is now hidden.
>
> **Deprecation cycle**:
>
> - 1.3.0: report a warning
> - 1.5.0: raise the warning to an error
> - 2.3.0: hide the function

### Unify Kotlin/Native stack trace printing with other platforms

> **Issue**: [KT-81431](https://youtrack.jetbrains.com/issue/KT-81431)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: behavioral
>
> **Short summary**: When formatting an exception stack trace, additional causes aren't printed if the same exception cause has already been printed.
>
> **Deprecation cycle**:
>
> - 2.3.20: Unify Kotlin/Native exception stack trace formatting with other Kotlin platforms

### Correct `Iterable<T>.intersect()` and `Iterable<T>.subtract()` behavior

> **Issue**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) and [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) functions now test membership for each
> receiver element before adding it to the result set. The result set compares elements using `Any::equals`,
> ensuring correct results even when the argument collection uses referential equality (for example, `IdentityHashMap.keys`).
>
> **Deprecation cycle**:
>
> - 2.3.0: enable the new behavior

## Tools

### Unsupported KGP version warning when using `kotlin-dsl` and `kotlin("jvm")` plugins

> **Issue**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: In Kotlin 2.3, if you use both the `kotlin-dsl` **and** the `kotlin("jvm")` plugin in your Gradle
> project, you may see a Gradle warning about an unsupported Kotlin Gradle plugin (KGP) version.
>
> **Migration steps**:
> 
> In general, we don't recommend using both the `kotlin-dsl` and the `kotlin("jvm")` plugins in the same Gradle project. This setup isn't supported.
> 
> For convention plugins, precompiled script plugins or any other form of unpublished build logic, you have three options:
> 
> 1. Don't apply the `kotlin("jvm")` plugin explicitly. Instead, let the `kotlin-dsl` plugin automatically provide a compatible KGP version.
> 2. If you want to apply the `kotlin("jvm")` plugin explicitly, use the [`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) constant to specify the embedded Kotlin version.
>
>     To upgrade the embedded Kotlin and language versions, update your Gradle version. You can find compatible Gradle versions in Gradle's [Compatibility Notes for Kotlin](https://docs.gradle.org/current/userguide/compatibility.html#kotlin).
> 
> 3. Don't use the `kotlin-dsl` plugin. This may be more appropriate for binary plugins that aren't tied to a specific Gradle version.
>
> As a last resort, you can configure your project to use language version 2.1 or higher, which overrides the conflicting behavior of the `kotlin-dsl` plugin. However, we strongly recommend not doing so.
> 
> If you experience difficulties during migration, reach out in the #gradle channel in our [Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) for support.
> 
> **Deprecation cycle**:
>
> - 2.3.0: introduce a diagnostic that detects when the `kotlin-dsl` plugin is used with an incompatible language or API version of the compiler

### Deprecate `kotlin-android` plugin for AGP versions 9.0.0 and later

> **Issue**: [KT-81199](https://youtrack.jetbrains.com/issue/KT-81199)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: In Kotlin 2.3.0, the `org.jetbrains.kotlin.android` plugin is deprecated when using Android Gradle plugin (AGP) versions 9.0.0 or later.
> Starting with AGP 9.0.0, [AGP provides built-in support for Kotlin](https://kotl.in/gradle/agp-built-in-kotlin), so the `kotlin-android` plugin is no longer required.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when the `kotlin-android` plugin is used with AGP versions 9.0.0 or later, and both the `android.builtInKotlin` and `android.newDsl=false` Gradle properties are set to `false`

### Deprecate `testApi` configuration

> **Issue**: [KT-63285](https://youtrack.jetbrains.com/issue/KT-63285)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 deprecates the `testApi` configuration. This configuration exposed test dependencies
> and sources to other modules, but Gradle doesn't support this behavior.
> 
> **Migration options**:
> Replace any instances of `testApi()` with `testImplementation()`, and do the same for other variants. For example,
> replace `kotlin.sourceSets.commonTest.dependencies.api()` with `kotlin.sourceSets.commonTest.dependencies.implementation()`.
> 
> For Kotlin/JVM projects, consider using Gradle's [test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) instead.
> If you'd like to see support for test fixtures in multiplatform projects, share your use case in [YouTrack](https://youtrack.jetbrains.com/issue/KT-63142).
> 
> **Deprecation cycle**:
>
> - 2.3.0: report a warning

### Deprecate `createTestExecutionSpec()` function

> **Issue**: [KT-75449](https://youtrack.jetbrains.com/issue/KT-75449)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 deprecates the `createTestExecutionSpec()` function in the `KotlinJsTestFramework`
> interface since it is no longer used.
>
> **Deprecation cycle**:
>
> - 2.2.20: report a warning
> - 2.3.0: raise the warning to an error

### Remove `closureTo()`, `createResultSet()`, and `KotlinToolingVersionOrNull()` functions

> **Issue**: [KT-64273](https://youtrack.jetbrains.com/issue/KT-64273)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 removes the `closureTo()`, `createResultSet()` functions from the `closure` DSL since they
> are no longer used. In addition, the `KotlinToolingVersionOrNull()` function is removed. Use the `KotlinToolingVersion()` function instead.
>
> **Deprecation cycle**:
> 
> - 1.7.20: report an error
> - 2.3.0: remove the functions

### Deprecate the `ExtrasProperty` API

> **Issue**: [KT-74915](https://youtrack.jetbrains.com/issue/KT-74915)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `ExtrasProperty` API, which has been deprecated since Kotlin 2.0.0, is now internalized in Kotlin 2.3.0.
> Use Gradle's [`ExtraPropertiesExtension`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html) API as an alternative.
> 
> **Deprecation cycle**:
>
> - 2.0.0: report a warning
> - 2.1.0: raise the warning to an error
> - 2.3.0: make the API internal

### Deprecate `HasKotlinDependencies` in `KotlinCompilation`

> **Issue**: [KT-67290](https://youtrack.jetbrains.com/issue/KT-67290)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 deprecates the `HasKotlinDependencies` interface in [`KotlinCompilation`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compilation/).
> Dependency-related APIs are now exposed through the [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) interface instead.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning

### Deprecate npm and Yarn package manager internal functions and properties

> **Issue**: [KT-81009](https://youtrack.jetbrains.com/issue/KT-81009)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The following functions and properties related to the npm and Yarn package managers are deprecated:
> 
> * `CompositeDependency.dependencyName`, `CompositeDependency.dependencyVersion`, `CompositeDependency.includedBuildDir`.
> * `KotlinNpmInstallTask.Companion.NAME`.
> * `LockCopyTask.Companion.STORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.RESTORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.UPGRADE_PACKAGE_LOCK`.
> * `Npm.npmExec()`.
> * `NpmProject.require()`, `NpmProject.useTool()`.
> * `PublicPackageJsonTask.jsIrCompilation`.
> * `YarnBasics.yarnExec()`.
> * `YarnPlugin.Companion.STORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.RESTORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.UPGRADE_YARN_LOCK`.
> * `YarnSetupTask.Companion.NAME`.
>
> **Deprecation cycle**:
>
> - 2.2.0 and 2.2.20: report warnings when using these functions or properties
> - 2.3.0: raise the warnings to errors

### Deprecate support for PhantomJS

> **Issue**: [KT-76019](https://youtrack.jetbrains.com/issue/KT-76019)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Since PhantomJS is no longer maintained, Kotlin 2.3.0 deprecates the `karmaPhantomjsLauncher` property
> in the `NpmVersions` API.
> 
> **Deprecation cycle**:
>
> - 2.3.0: report a warning

### Prohibit subclassing of classes that set up test runs or JavaScript runtime

> **Issue**: [KT-75869](https://youtrack.jetbrains.com/issue/KT-75869), [KT-81007](https://youtrack.jetbrains.com/issue/KT-81007)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.3.0 prohibits subclassing the following classes:
> * `KotlinTest`
> * `KotlinNativeTest`
> * `KotlinJsTest`
> * `KotlinJsIrTarget`
> * `KotlinNodeJsIr`
> * `KotlinD8Ir`
> * `KotlinKarma`
> * `KotlinMocha`
> * `KotlinWebpack`
> * `TypeScriptValidationTask`
> * `YarnRootExtension`
> 
> These classes were never intended to be subclassed. All use cases for subclassing should now be covered by
> the configuration blocks provided by the Kotlin Gradle plugin DSL.
> If the existing APIs for these tasks don't meet your needs for setting up test runs or the JavaScript runtime,
> share your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-75869).
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning for code that creates subclasses from these classes
> - 2.3.0: raise the warnings to errors

### Deprecate `ExperimentalWasmDsl` annotation class

> **Issue**: [KT-81005](https://youtrack.jetbrains.com/issue/KT-81005)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `ExperimentalWasmDsl` annotation class is deprecated since the functionality has moved to the `kotlin-plugin-annotations` module.
>
> **Deprecation cycle**:
>
> - 2.0.20: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate `ExperimentalDceDsl` annotation class

> **Issue**: [KT-81008](https://youtrack.jetbrains.com/issue/KT-81008)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `ExperimentalDceDsl` annotation class isn't used anymore, so it's been deprecated.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate JavaScript utilities

> **Issue**: [KT-81010](https://youtrack.jetbrains.com/issue/KT-81010)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The following functions and properties are only used internally, so they've been deprecated:
> * `JsIrBinary.generateTs`
> * `KotlinJsIrLink.mode`
> * `NodeJsSetupTask.Companion.NAME`
> * `Appendable.appendConfigsFromDir()`
> * `ByteArray.toHex()`
> * `FileHasher.calculateDirHash()`
> * `String.jsQuoted()`
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when the `KotlinJsIrLink.mode` property is used
> - 2.2.0: report a warning when the `NodeJsSetupTask.Companion.NAME` property and functions are used
> - 2.2.20: report a warning when the `JsIrBinary.generateTs` property is used
> - 2.3.0: raise the warnings to errors

### Deprecate migrated D8 and Binaryen properties

> **Issue**: [KT-81006](https://youtrack.jetbrains.com/issue/KT-81006)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The following properties are deprecated because they've been migrated from the `org.jetbrains.kotlin.gradle.targets.js` package
> to the `org.jetbrains.kotlin.gradle.targets.wasm` package:
> 
> * `binaryen.BinaryenEnvSpec`
> * `binaryen.BinaryenExtension`
> * `binaryen.BinaryenPlugin`
> * `binaryen.BinaryenRootPlugin`
> * `BinaryenSetupTask.Companion.NAME`
> * `d8.D8EnvSpec`
> * `d8.D8Plugin`
> * `D8SetupTask.Companion.NAME`
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate `create()` function in `NodeJsExec` DSL

> **Issue**: [KT-81004](https://youtrack.jetbrains.com/issue/KT-81004)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `create()` function in the companion object of the `NodeJsExec` DSL is deprecated. Use
> the `register()` function instead.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning
> - 2.3.0: raise the warning to an error

### Deprecate properties in `kotlinOptions` DSL

> **Issue**: [KT-76720](https://youtrack.jetbrains.com/issue/KT-76720)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The ability to configure compiler options through the `kotlinOptions` DSL and the related
> `KotlinCompile<KotlinOptions>` task interface has been deprecated in favor of the new `compilerOptions` DSL since Kotlin 2.2.0.
> Kotlin 2.3.0 continues the deprecation cycle for all properties in the `kotlinOptions` interface.
> To migrate, use the `compilerOptions` DSL to configure compiler options. For guidance on the migration, see [Migrate from `kotlinOptions {}` to `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions).
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning for `kotlinOptions` DSL
> - 2.2.0: raise the warning to an error and deprecate all properties in `kotlinOptions`
> - 2.3.0: raise the warning to an error for all properties in `kotlinOptions`

### Deprecate `kotlinArtifacts` API

> **Issue**: [KT-77066](https://youtrack.jetbrains.com/issue/KT-77066)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The experimental `kotlinArtifacts` API is deprecated. Use the current DSL available in the Kotlin Gradle
> plugin to [build final native binaries](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html).
> If it's not sufficient for migration, leave a comment in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-74953).
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when the `kotlinArtifacts` API is used
> - 2.3.0: raise this warning to an error

### Remove `kotlin.mpp.resourcesResolutionStrategy` Gradle property

> **Issue**: [KT-74955](https://youtrack.jetbrains.com/issue/KT-74955)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Previously the `kotlin.mpp.resourcesResolutionStrategy` Gradle property was deprecated because it wasn't
> used. In Kotlin 2.3.0, the Gradle property is removed completely.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a configuration-time diagnostic
> - 2.3.0: remove the Gradle property

### Deprecated old mode of multiplatform IDE import

> **Issue**: [KT-61127](https://youtrack.jetbrains.com/issue/KT-61127)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Before Kotlin 2.3.0, we supported multiple modes of multiplatform IDE import. Now, the older mode is deprecated,
> leaving only one mode available. Previously, the old mode was enabled using the `kotlin.mpp.import.enableKgpDependencyResolution=false`
> Gradle property. Using this property now triggers a deprecation warning.
>
> **Deprecation cycle**:
>
> - 2.3.0: report a warning when the `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle property is used

### Remove properties to disable precise compilation backup

> **Issue**: [KT-81038](https://youtrack.jetbrains.com/issue/KT-81038)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9.0 introduced an experimental optimization for incremental compilation called precise
> compilation backup. After successful testing, this optimization was enabled by default in Kotlin 2.0.0. Kotlin 2.3.0
> removes the `kotlin.compiler.preciseCompilationResultsBackup` and `kotlin.compiler.keepIncrementalCompilationCachesInMemory`
> Gradle properties that opt out of this optimization.
>
> **Deprecation cycle**:
>
> - 2.1.20: report a warning
> - 2.3.0: remove the properties

### Deprecate `destinationDir` in `CInteropProcess`

> **Issue**: [KT-74910](https://youtrack.jetbrains.com/issue/KT-74910)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `destinationDir` property in the `CInteropProcess` task is deprecated.
> Use the `CInteropProcess.destinationDirectory.set()` function instead.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning when the `destinationDir` property is used
> - 2.2.0: raise this warning to an error
> - 2.3.0: hide the `destinationDir` property

### Deprecate `konanVersion` in `CInteropProcess`

> **Issue**: [KT-74911](https://youtrack.jetbrains.com/issue/KT-74911)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `konanVersion` property in the `CInteropProcess` task is deprecated.
> Use `CInteropProcess.kotlinNativeVersion` instead.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning when the `konanVersion` property is used
> - 2.2.0: raise this warning to an error
> - 2.3.0: hide the `konanVersion` property

### Remove `KotlinCompile.classpathSnapshotProperties` properties

> **Issue**: [KT-76177](https://youtrack.jetbrains.com/issue/KT-76177)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.incremental.useClasspathSnapshot` Gradle property was removed in Kotlin 2.2.0.
> In Kotlin 2.3.0, the following properties are also removed:
> * `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot`
> * `KotlinCompile.classpathSnapshotProperties.classpath`
>
> **Deprecation cycle**:
>
> - 2.0.20: deprecate the `kotlin.incremental.useClasspathSnapshot` property with a warning
> - 2.2.0: remove the `kotlin.incremental.useClasspathSnapshot` property
> - 2.3.0: remove the `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot` and `KotlinCompile.classpathSnapshotProperties.classpath` properties

### Deprecate `getPluginArtifactForNative()` function

> **Issue**: [KT-78870](https://youtrack.jetbrains.com/issue/KT-78870)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: In Kotlin 2.2.20, [the `getPluginArtifactForNative()` function was deprecated](whatsnew2220.md#reduced-size-of-kotlin-native-distribution). 
> Use the [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) function instead.
>
> **Deprecation cycle**:
>
> - 2.2.20: report a warning
> - 2.3.0: raise the warning to an error

## Build tool removal

### Remove support for Ant

> **Issue**: [KT-75875](https://youtrack.jetbrains.com/issue/KT-75875)
>
> **Component**: Ant
>
> **Short summary**: Kotlin 2.3.0 removes support for Ant as a build tool. Use [Gradle](gradle.md) or [Maven](maven.md) instead.
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning
> - 2.3.0: remove support
