[//]: # (title: Compatibility guide for Kotlin 2.1)

_[Keeping the Language Modern](kotlin-evolution-principles.md)_ and _[Comfortable Updates](kotlin-evolution-principles.md)_ are among the fundamental principles in
Kotlin Language Design. The former says that constructs which obstruct language evolution should be removed, and the
latter says that this removal should be well-communicated beforehand to make code migration as smooth as possible.

While most of the language changes were already announced through other channels, like update changelogs or compiler
warnings, this document summarizes them all, providing a complete reference for migration from Kotlin 2.0 to Kotlin 2.1.

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
> - 2.1.0: report a warning
> - 2.2.0: raise the warning to an error
-->

### Change data class copy() function visibility to match private constructor

> **Issue**: [KT-11914](https://youtrack.jetbrains.com/issue/KT-11914)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.20: report a warning for visibility mismatches; apply `@ConsistentCopyVisibility` or use the `-Xconsistent-data-class-copy-visibility` flag to adopt the new behavior early, or use the `@ExposedCopyVisibility` annotation to retain the old behavior
> - 2.2.0: raise the warning to an error for incompatible `copy()` usages
> - 2.3.0: the `copy()` function defaults to the visibility of the primary constructor

### Deprecate appendln in favor of appendLine

> **Issue**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: `StringBuilder.appendln()` is deprecated in favor of `StringBuilder.appendLine()`.
>
> **Deprecation cycle**:
>
> - 1.4: the `appendln()` function is deprecated; report a warning on use
> - 2.1.0: raise the warning to an error

### Change the typeOf() function behavior on Kotlin/Native

> **Issue**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The behavior of the `typeOf()` function on Kotlin/Native is aligned with Kotlin/JVM
> to ensure consistency across platforms. 
>
> **Deprecation cycle**:
>
> - 2.1.0: align the `typeOf()` function behavior on Kotlin/Native

### Prohibit exposing types through type parameters' bounds

> **Issue**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Exposing types with lower visibility through type parameter bounds is now prohibited,
> addressing inconsistencies in type visibility rules.
> This change ensures that bounds on type parameters follow the same visibility rules as classes, preventing issues like IR validation errors in JVM.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning for exposing types via type parameter bounds with lower visibility
> - 2.2.0: raise the warning to an error

### Prohibit inheriting an abstract var property alongside a val property with the same name

> **Issue**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: If a class inherits an abstract `var` property from an interface and a `val` property with the same name from a superclass,
> it now triggers a compilation error. This resolves runtime crashes caused by missing setters in such cases.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning (or an error in progressive mode) when a class inherits an abstract `var` property from an interface and a `val` property with the same name from a superclass
> - 2.2.0: raise the warning to an error

### Report error when accessing uninitialized enum entries

> **Issue**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: The compiler now reports an error when uninitialized enum entries are accessed during enum class or entry initialization.
> This aligns behavior with member property initialization rules, preventing runtime exceptions and ensuring consistent logic.
>
> **Deprecation cycle**:
>
> - 2.1.0: report an error when accessing uninitialized enum entries

### Change Map.Entry behavior to fail-fast on structural modification

> **Issue**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Accessing a `Map.Entry` key-value pair after its associated map has been structurally modified now throws a `ConcurrentModificationException`.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning
> - 2.2.0: raise the warning to an error

### Changes in K2 smart cast propagation

> **Issue**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: K2 changes the behavior of smart cast propagation, introducing bidirectional propagation of type
> information for inferred variables, like `val x = y`. Explicitly typed variables, such as `val x: T = y`,
> no longer propagate type information, ensuring stricter adherence to declared types.
>
> **Deprecation cycle**:
>
> - 2.1.0: change the behavior in K2; K1 remains unaffected

### Correct the handling of member-extension property overrides in Java subclasses

> **Issue**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Short summary**: The getter for member-extension properties overridden by Java subclasses is now hidden in the subclass's scope,
> aligning its behavior with regular Kotlin properties.
>
> **Deprecation cycle**:
>
> - 2.1.0: enable the new behavior in K2; K1 remains unaffected

### Correct visibility alignment for getters and setters of var properties overriding a protected val

> **Issue**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **Component**: Core language
>
> **Incompatible change type**: binary
>
> **Deprecation cycle**:
>
> - 2.1.0: enforce consistent visibility for both getters and setters in K2; K1 remains unaffected

## Tools

### Deprecate KotlinCompilationOutput#resourcesDirProvider

> **Issue**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `KotlinCompilationOutput#resourcesDirProvider` field is deprecated.
> Use `KotlinSourceSet.resources` to add additional resource directories instead.
> 
> **Deprecation cycle**:
>
> - 2.1.0: `KotlinCompilationOutput#resourcesDirProvider` is deprecated

### Deprecate registerKotlinJvmCompileTask(taskName, moduleName) function

> **Issue**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `registerKotlinJvmCompileTask(taskName, moduleName)` function is deprecated
> in favor of the new `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` function, which now accepts `KotlinJvmCompilerOptions`.
> This allows you to pass a `compilerOptions` instance, typically from an extension or target, with values used as conventions for the task’s options.
>
> **Deprecation cycle**:
>
> - 2.1.0: the `registerKotlinJvmCompileTask(taskName, moduleName)` function is deprecated

### Deprecate registerKaptGenerateStubsTask(taskName) function

> **Issue**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `registerKaptGenerateStubsTask(taskName)` function is deprecated.
> Use the new `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` function instead.
> This new version allows you to link values as conventions from the relevant `KotlinJvmCompile` task, ensuring both tasks are using the same set of options.
>
> **Deprecation cycle**:
>
> - 2.1.0: the `registerKaptGenerateStubsTask(taskName)` function is deprecated

### Deprecate KotlinTopLevelExtension and KotlinTopLevelExtensionConfig interfaces

> **Issue**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `KotlinTopLevelExtension` and `KotlinTopLevelExtensionConfig` interfaces are deprecated in favor of a new `KotlinTopLevelExtension` interface.
> This interface merges `KotlinTopLevelExtensionConfig`, `KotlinTopLevelExtension`, and `KotlinProjectExtension`
> to provide a clearer API hierarchy, and official access to JVM toolchain and compiler properties.
>
> **Deprecation cycle**:
>
> - 2.1.0: the `KotlinTopLevelExtension` and `KotlinTopLevelExtensionConfig` interfaces are deprecated

### Remove kotlin-compiler-embeddable from build runtime dependencies

> **Issue**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `kotlin-compiler-embeddable` dependency is removed from the runtime in Kotlin Gradle Plugin (KGP).
> Required modules are now included directly in KGP artifacts, with a Kotlin language version limit of 2.0 to support compatibility with Gradle Kotlin runtime in versions below 8.2.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning on using `kotlin-compiler-embeddable`
> - 2.2.0: raise the warning to an error

### Hide compiler symbols from the Kotlin Gradle Plugin API

> **Issue**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Compiler module symbols bundled within the Kotlin Gradle Plugin (KGP), such as `KotlinCompilerVersion`,
> are hidden from the public API to prevent unintended access in build scripts.
>
> **Deprecation cycle**:
>
> - 2.1.0: report a warning on accessing these symbols
> - 2.2.0: raise the warning to an error

### Support for multiple stability configuration files

> **Issue**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: The `stabilityConfigurationFile` property in the Compose extension is deprecated
> in favor of a new `stabilityConfigurationFiles` property, which allows specifying multiple configuration files.
>
> **Deprecation cycle**:
>
> - 2.1.0: `stabilityConfigurationFile` property is deprecated

### Remove deprecated platform plugin IDs

> **Issue**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: support for these platform plugin IDs have been removed:
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **Deprecation cycle**:
>
> - 1.3: the platform plugin IDs are deprecated
> - 2.1.0: the platform plugin IDs are no longer supported
