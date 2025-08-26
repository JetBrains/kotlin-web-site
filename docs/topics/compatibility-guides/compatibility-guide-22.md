[//]: # (title: Compatibility guide for Kotlin 2.2)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.1 to Kotlin 2.2.

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
> **Short summary**: Constructor calls and inheritance using type aliases that expand to types that use variance modifiers such as `out` are no longer supported by the K2 compiler.
> This resolves inconsistencies where using the original type wasn't allowed, but the same usage through a type alias was permitted.
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

### Change default method generation for interface functions on JVM

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

### Forbid reified type parameters in type aliases

> **Issue**: [KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The `reified` modifier is no longer allowed on type parameters in type aliases.
> Reified type parameters are only valid in inline functions, so using them in type aliases had no effect.
> To migrate, remove the `reified` modifier from `typealias` declarations.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning for reified type parameters in type aliases
> - 2.2.0: raise the warning to an error

### Correct type checks on inline value classes for `Number` and `Comparable`

> **Issue**: [KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Inline value classes are no longer treated as implementors of `java.lang.Number` or `java.lang.Comparable` in `is` and `as` checks.
> These checks previously returned incorrect results when applied to boxed inline classes.
> The optimization now applies only to primitive types and their wrappers.
>
> **Deprecation cycle**:
>
> - 2.2.0: enable the new behavior

### Prohibit inaccessible generic types from indirect dependencies

> **Issue**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The K2 compiler now reports errors when using types from indirect dependencies that are not visible to the compiler.
> This affects cases such as lambda parameters or generic type arguments, where the referenced type is not available due to a missing dependency.
>
> **Deprecation cycle**:
>
> - 2.0.0: report errors for inaccessible generic types in lambdas and selected usages of inaccessible generic type arguments; report warnings for inaccessible non-generic types in lambdas and inaccessible type arguments in expression and super types
> - 2.1.0: raise the warning on inaccessible non-generic types in lambdas to an error
> - 2.2.0: raise the warning on inaccessible type arguments in expression types to an error

### Enforce visibility checks on type parameter bounds

> **Issue**: [KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Functions and properties can no longer use a type parameter bound that has more restrictive visibility than the declaration itself.
> This prevents exposing inaccessible types indirectly, which previously compiled without errors but led to runtime failures or IR validation errors in some cases.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning when a type parameter has a bound that is not visible from the declaration's visibility scope
> - 2.2.0: raise the warning to an error

### Report errors when exposing private types in non-private inline functions

> **Issue**: [KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Accessing private types, functions, or properties from non-private inline functions is no longer allowed.
> To migrate, either avoid referencing private entities, make the function private, or remove the `inline` modifier. 
> Note that removing `inline` breaks binary compatibility.
>
> **Deprecation cycle**:
>
> - 2.2.0: report an error when accessing private types or members from non-private inline functions

### Forbid non-local returns in lambdas used as parameter's default value

> **Issue**: [KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Non-local return statements are no longer allowed in lambdas used as parameter's default value.
> This pattern previously compiled but led to runtime crashes. To migrate, rewrite the lambda to avoid non-local returns or move the logic outside the default value.
>
> **Deprecation cycle**:
>
> - 2.2.0: report an error for non-local returns in lambdas used as parameter's default value

## Standard library

### Deprecate `kotlin.native.Throws`

> **Issue**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **Component**: Kotlin/Native
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.native.Throws` is deprecated; use the common [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) annotation instead. 
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning when using `kotlin.native.Throws`
> - 2.2.0: raise the warning to an error

### Deprecate `AbstractDoubleTimeSource`

> **Issue**: [KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: `AbstractDoubleTimeSource` is deprecated; use [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/) instead.
>
> **Deprecation cycle**:
>
> - 1.8.20: report a warning when using `AbstractDoubleTimeSource`
> - 2.2.0: raise the warning to an error

## Tools

### Correct `setSource()` function in `KotlinCompileTool` to replace sources

> **Issue**: [KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) function in the [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) interface now replaces configured sources instead of adding to them.
> If you want to add sources without replacing existing ones, use the [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) function.
>
> **Deprecation cycle**:
>
> - 2.2.0: enable the new behavior

### Deprecate `KotlinCompilationOutput#resourcesDirProvider` property

> **Issue**: [KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `KotlinCompilationOutput#resourcesDirProvider` property is deprecated.
> Use [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) in your Gradle build script instead to add additional resource directories.
>
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` is deprecated with a warning
> - 2.2.0: raise the warning to an error

### Deprecate `BaseKapt.annotationProcessorOptionProviders` property

> **Issue**: [KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The [`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) property is deprecated in favor of 
> `BaseKapt.annotationProcessorOptionsProviders`, which accepts a `ListProperty<CommandLineArgumentProvider>` instead of a `MutableList<Any>`.
> This clearly defines the expected element type and prevents runtime failures caused by adding incorrect elements, such as nested lists.
> If your current code adds a list as a single element, replace the `add()` function with the `addAll()` function.
>
> **Deprecation cycle**:
>
> - 2.2.0: enforce the new type in the API

### Deprecate `kotlin-android-extensions` plugin

> **Issue**: [KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin-android-extensions` plugin is deprecated. Use a separate plugin, [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize),
> for the `Parcelable` implementation generator and the Android Jetpack's [view bindings](https://developer.android.com/topic/libraries/view-binding)
> for synthetic views instead.
>
> **Deprecation cycle**:
>
> - 1.4.20: the plugin is deprecated
> - 2.1.20: a configuration error is introduced, and no plugin code is executed
> - 2.2.0: the plugin code is removed

### Deprecate `kotlinOptions` DSL

> **Issue**: [KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The ability to configure compiler options through the `kotlinOptions` DSL and the related
> `KotlinCompile<KotlinOptions>` task interface is deprecated in favor of the new `compilerOptions` DSL.
> As part of this deprecation, all properties in the `kotlinOptions` interface are now also individually marked as deprecated.
> To migrate, use the `compilerOptions` DSL to configure compiler options. For guidance on the migration, see [Migrate from `kotlinOptions {}` to `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions).
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning for `kotlinOptions` DSL
> - 2.2.0: raise the warning to an error and deprecate all properties in `kotlinOptions`

### Remove `kotlin.incremental.useClasspathSnapshot` property

> **Issue**: [KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin.incremental.useClasspathSnapshot` Gradle property is removed.
> This property controlled the deprecated JVM history-based incremental compilation mode, which has been replaced by the classpath-based approach enabled by default since Kotlin 1.8.20.
>
> **Deprecation cycle**:
>
> - 2.0.20: deprecate the `kotlin.incremental.useClasspathSnapshot` property with a warning
> - 2.2.0: remove the property

### Deprecations to Kotlin scripting

> **Issues**: [KT-71685](https://youtrack.jetbrains.com/issue/KT-71685), [KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/), [KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/).
>
> **Component**: Scripting
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 2.2.0 deprecates support for:
>   * REPL: To continue to use REPL via `kotlinc`, opt in with the `-Xrepl` compiler option.
>   * JSR-223: Since the [JSR](https://jcp.org/en/jsr/detail?id=223) is in **Withdrawn** state. The JSR-223 implementation continues to work with language version 1.9 but there are no plans to migrate to the K2 compiler in the future.
>   * The `KotlinScriptMojo` Maven plugin. You will see compiler warnings if you continue to use it.
>
> For more information, see our [blog post](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/).
>
> **Deprecation cycle**:
>
> - 2.1.0: deprecate the use of REPL in `kotlinc` with a warning
> - 2.2.0: to use REPL via `kotlinc`, opt in with the `-Xrepl` compiler option; deprecate JSR-223, support can be restored by switching to language version 1.9; deprecate the `KotlinScriptMojo` Maven plugin

### Deprecate disambiguation classifier properties

> **Issue**: [KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Options that were used to control how the Kotlin Gradle plugin disambiguates source set names and
> IDE imports became obsolete. Therefore, the following properties are now deprecated in the `KotlinTarget` interface:
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **Deprecation cycle**:
>
> - 2.0.0: report a warning when the Gradle properties are used
> - 2.1.0: raise this warning to an error
> - 2.2.0: remove Gradle properties

### Deprecate commonization parameters

> **Issue**: [KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The parameters for experimental commonization modes are deprecated in the Kotlin Gradle plugin.
> These parameters may produce invalid compilation artifacts that are then cached. To delete affected artifacts:
>
> 1. Remove the following options from your `gradle.properties` file:
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2. Clear the commonization cache in the `~/.konan/*/klib/commonized` directory or run the following command: 
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **Deprecation cycle**:
>
> - 2.2.0: deprecate commonization parameters with an error
> - 2.2.20: remove commonization parameters

### Deprecate support for legacy metadata compilation

> **Issue**: [KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Options that were used to set up hierarchical structure and create intermediate source sets
> between the common and intermediate source sets became obsolete.
> The following compiler options are removed:
> 
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **Deprecation cycle**:
>
> - 2.2.0: remove compiler options from the Kotlin Gradle plugin

### Deprecate `KotlinCompilation.source` API

> **Issue**: [KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The access to `KotlinCompilation.source` API that allowed adding Kotlin source sets directly to the
> Kotlin compilation has been deprecated.
>
> **Deprecation cycle**:
>
> - 1.9.0: report a warning when `KotlinCompilation.source` is used
> - 1.9.20: raise this warning to an error
> - 2.2.0: remove `KotlinCompilation.source` from the Kotlin Gradle plugin; attempts to use it lead to "unresolved reference"
> errors during the buildscript compilation

### Deprecate target presets APIs

> **Issue**: [KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Target presets for Kotlin Multiplatform targets became obsolete; target DSL functions like `jvm()`
> or `iosSimulatorArm64()` now cover the same use cases. All presets-related APIs are deprecated:
> 
> * The `presets` property in `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`
> * The `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` interface and all its inheritors
> * The `fromPreset` overloads
>
> **Deprecation cycle**:
>
> - 1.9.20: report a warning on any usages of the presets-related API
> - 2.0.0: raise this warning to an error
> - 2.2.0: remove the presets-related API from the public API of the Kotlin Gradle plugin; sources that still use it fail
> with "unresolved reference" errors, and binaries (for example, Gradle plugins) might fail with linkage errors unless
> recompiled against the latest versions of the Kotlin Gradle plugin

### Deprecate Apple target shortcuts

> **Issue**: [KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `ios()`, `watchos()`, and `tvos()` target shortcuts are deprecated in Kotlin Multiplatform DSL.
> The shortcuts were designed to partially create a source set hierarchy for Apple targets. The Kotlin Multiplatform Gradle
> plugin now provides a built-in hierarchy template. Instead of shortcuts, specify the list of targets, and then the plugin
> automatically sets up intermediate source sets for them.
>
> **Deprecation cycle**:
>
> - 1.9.20: report a warning when target shortcuts are used; the default hierarchy template is enabled by default instead
> - 2.1.0: report an error when target shortcuts are used
> - 2.2.0: remove target shortcut DSL from the Kotlin Multiplatform Gradle plugin

### Deprecate `publishAllLibraryVariants()` function

> **Issue**: [KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `publishAllLibraryVariants()` function is deprecated. It was designed to publish all build variants
> for Android targets. This approach is not recommended now, as it can cause problems with variant resolution, especially
> when multiple flavors and build types are used. Use the `publishLibraryVariants()` function, which specifies build variants,
> instead.
>
> **Deprecation cycle**:
>
> - 2.2.0: `publishAllLibraryVariants()` is deprecated

### Deprecate `android` target

> **Issue**: [KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `android` target name is deprecated in the current Kotlin DSL. Use `androidTarget` instead.
>
> **Deprecation cycle**:
>
> - 1.9.0: introduce a deprecation warning when the `android` name is used in Kotlin Multiplatform projects 
> - 2.1.0: raise this warning to an error
> - 2.2.0: remove the `android` target DSL from the Kotlin Multiplatform Gradle plugin

### Deprecate `konanVersion` in `CInteropProcess`

> **Issue**: [KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
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
> - 2.3.0: remove the `konanVersion` property from the Kotlin Gradle plugin

### Deprecate `destinationDir` in `CInteropProcess`

> **Issue**: [KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
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
> - 2.3.0: remove the `destinationDir` property from the Kotlin Gradle plugin

### Deprecate `kotlinArtifacts` API

> **Issue**: [KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The experimental `kotlinArtifacts` API is deprecated. Use the current DSL available in the Kotlin Gradle
> plugin to [build final native binaries](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html).
> If it's not sufficient for migration, leave a comment in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-74953).
>
> **Deprecation cycle**:
>
> - 2.2.0: report a warning when the `kotlinArtifacts` API is used
> - 2.3.0: raise this warning to an error
