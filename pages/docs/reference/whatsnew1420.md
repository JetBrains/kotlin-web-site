---
type: doc
layout: reference
title: "What's New in Kotlin 1.4.20"
---

# What's New in Kotlin 1.4.0

In Kotlin 1.4.20, we offer a number of new experimental features and provide fixes and improvements for
existing features, including those added in 1.4.0.

[**Kotlin/JVM**](#kotlinjvm)
- [Java 15 target](#java-15-target)
- [invokedynamic string concatenation](#invokedynamic-string-concatenation)

[**Kotlin/JS**](#kotlinjs)
- [Gradle DSL changes](#gradle-dsl-changes)
- [New Wizard templates](#new-wizard-templates)
- [Ignoring compilation errors with IR compiler](#ignoring-compilation-errors-with-ir-compiler)

[**Kotlin/Native**](#kotlinnative)
- [Escape analysis](#escape-analysis)
- [Opt-in wrapping of Objective-C exceptions](#opt-in-wrapping-of-objective-c-exceptions)
- [Support for Xcode 12 libraries](#support-for-xcode-12-libraries)
- [Performance improvements and bug fixes](#performance-improvements-and-bug-fixes)

[**Kotlin Multiplatform**](#kotlin-multiplatform)
- [Updated structure of multiplatform library publications](#updated-structure-of-multiplatform-library-publications)

[**CocoaPods support**](#cocoapods-support)
- [Improved task execution](#improved-task-execution)
- [Extended DSL](#extended-dsl)
- [Updated integration with Xcode](#updated-integration-with-xcode)

[**Standard library**](#standard-library)
- [Extensions for java.nio.file.Path](#extensions-for-javaniofilepath)
- [Improved String.replace function performance](#improved-stringreplace-function-performance)

[**Kotlin Android Extensions**](#kotlin-android-extensions)
- [Deprecation of synthetic views](#deprecation-of-synthetic-views)
- [New plugin for Parcelable implementation generator](#new-plugin-for-parcelable-implementation-generator)

## Kotlin/JVM

### Java 15 target

Now Java 15 is available as a Kotlin/JVM target.

### invokedynamic string concatenation

> `invokedynamic` string concatenation is [experimental](evolution/components-stability.html) in Kotlin 1.4.20. It may change incompatibly in future versions.
{:.note}

Kotlin 1.4.20 can compile string concatenations into [dynamic invocations](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)
on JVM 9+ targets, therefore improving the performance.

Currently, this feature is experimental and covers the following cases:
- `String.plus` in the operator (`a + b`), explicit (`a.plus(b)`), and reference (`(a::plus)(b)`) form.
- `toString` on inline and data classes.
- string templates except for ones with a single non-constant argument (see [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)).

To enable `invokedynamic` string concatenation, add the `-Xstring-concat` compiler option with one of the following values:
- `indy-with-constants` to perform `invokedynamic` concatenation on strings with [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)
    (this is planned to be the default for JVM 9+ targets in 1.5).
- `indy` to perform `invokedynamic` concatenation on strings with [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-).
- `inline` to switch back to the classic concatenation via `StringBuilder.append()`.

[**Back to top**](#)

## Kotlin/JS

### Gradle DSL changes

The Kotlin/JS Gradle DSL receives a number of updates which simplify project setup and customization. This includes webpack
configuration adjustments, modifications to the auto-generated `package.json` file, and improved control over transitive dependencies,
among others.

#### Single point for webpack configuration

A new configuration block `commonWebpackConfig` is available for the browser target. Inside it, you can adjust common
settings from a single point, instead of having to duplicate configurations for the `webpackTask`, `runTask`, and `testTask`
respectively.

To enable CSS support by default for all three tasks, add the following snippet in the `build.gradle(.kts)` of your project:

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

Learn more about configuring webpack bundling [here](js-project-setup.html#configuring-webpack-bundling).

#### package.json customization from Gradle

Now the Gradle DSL for Kotlin/JS supports adding custom fields to the auto-generated project file `package.json`.

To add custom fields to your `package.json`, use the `customField` function in the compilation's `packageJson` block:

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

Learn more about package.json customization [here](js-project-setup.html#packagejson-customization).

#### Selective yarn dependency resolutions

> Selective yarn dependency resolutions are [experimental](evolution/components-stability.html) in 1.4.20. It may change incompatibly in future versions.
{:.note}

Kotlin 1.4.20 provides a way of configuring Yarn's [selective dependency resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) - the
mechanism for overriding dependencies of the packages you depend on.

You can use it through the `YarnRootExtension` inside the `YarnPlugin` in Gradle. To affect the resolved
version of a package for your project, use the `resolution` function passing in the package name selector (as specified by Yarn)
and the version to which it should resolve.

```kotlin
rootProject.plugins.withType(YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

Here, _all_ of your npm dependencies which require `react` will receive version `16.0.0`, and `processor` will receive its
dependency `decamelize` as version `3.0.0`.

#### Disabling granular workspaces

> Disabling granular workspaces is [experimental](evolution/components-stability.html) in 1.4.20. It may change incompatibly in future versions.
{:.note}

To speed up build times, the Kotlin/JS Gradle plugin only installs the dependencies which are required for a particular
Gradle task. For example, the `webpack-dev-server` package is only installed when you execute one of the `*Run` tasks,
and not when you execute the assemble task. Such behavior can potentially bring problems when you run multiple Gradle
processes in parallel. When the dependency requirements clash, the two installations of npm packages can cause errors.

To resolve this issue, Kotlin 1.4.20 includes a new (experimental) option to disable these so-called "granular workspaces".
This feature is currently available through the `YarnRootExtension` inside the `YarnPlugin` in Gradle.
To use it, add the following snippet to your `build.gradle.kts` file:

```kotlin
rootProject.plugins.withType(YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### New Wizard templates

To give you more convenient ways to customize your project during creation, the project wizard for Kotlin comes with new 
templates for Kotlin/JS applications:
- **Browser Application** - a minimal Kotlin/JS Gradle project that runs in the browser.
- **React Application** - a React app that uses the appropriate `kotlin-wrappers`.
    It provides options to enable integrations for style-sheets, navigational components, or state containers.
- **Node.js Application** a minimal project for running in a Node.js runtime. It comes with the option to directly
    include the experimental `kotlinx-nodejs` package.
    
Learn more how to create Kotlin/JS applications from templates [here](../tutorials/javascript/setting-up.html).

### Ignoring compilation errors with IR compiler

> _Ignore compilation errors_ mode is [experimental](evolution/components-stability.html) in 1.4.20. It may change incompatibly in future versions.
{:.note}

The [IR compiler](js-ir-compiler.html) for Kotlin/JS comes with a new experimental mode - _compilation with errors_.
In this mode, you can run you code even if it contains errors, for example, if you want to try certain things it when 
the whole application is not ready yet.
 
There are two tolerance policies for this mode:
- `SEMANTIC`: the compiler will accept code which is syntactically correct, but doesn't make sense semantically,
    such as `val x: String = 3`.

- `SYNTAX`: the compiler will accept any code, even if it contains syntax errors.

To allow compilation with errors, add the `-Xerror-tolerance-policy=` compiler option with one of the values listed above.

Learn more about ignoring compilation errors with Kotlin/JS IR compiler [here](js-ir-compiler.html#ignoring-compilation-errors).

[**Back to top**](#)

## Kotlin/Native

### Escape analysis

> The escape analysis mechanism is [experimental](evolution/components-stability.html) in 1.4.20. It may change incompatibly in future versions.
{:.note}

Kotlin/Native receives a prototype of the new [escape analysis](https://en.wikipedia.org/wiki/Escape_analysis) mechanism.
It improves the runtime performance by allocating certain objects on the stack instead of the heap. With this mecahnism, 
we've got a 10% average performance increase on our benchmarks, and we continue improving it so that it speeds up the
program even more.

The escape analysis is performed in a separate compilation phase for the release builds (with the `-opt` compiler option). 

If you want to disable the escape analysis phase, use the `-Xdisable-phases=EscapeAnalysis` compiler option.

### Opt-in wrapping of Objective-C exceptions

> The Objective-C exception wrapping mechanism is [experimental](evolution/components-stability.html) in 1.4.20. It may change incompatibly in future versions.
{:.note}

Kotlin/Native now can handle exceptions thrown from Objective-C code in runtime to avoid program crashes.

You can opt into wrapping `NSException`’s into Kotlin’s `ForeignException`’s for further handling in the Kotlin code.
Such a `ForeignExeption` holds the reference to the original `NSException`, which lets you get the information about the root cause.

To enable wrapping of Objective-C exceptions, specify the `-Xforeign-exception-mode objc-wrap` option in the `cinterop`
call or add `foreignExceptionMode = objc-wrap` property to `.def` file. If you use [CocoaPods integration](native/cocoapods.html),
specify the option in the `pod {}` build script block of a dependency like this:

```kotlin
pod("foo") {
   extraOpts = listOf("-Xforeign-exception-mode”, “objc-wrap")
}
```

The default behavior remains unchanged: the program terminates when an exception is thrown from the Objective-C code.

### Support for Xcode 12 libraries
    
We have added support for new libraries delivered with Xcode 12. Now you can use them from the Kotlin code.

### Performance improvements and bug fixes

As usual, Kotlin/Native receives performance improvements and bug fixes in various components, including the ones added
in 1.4.0, for example, the [code sharing mechanism](mpp-share-on-platforms.html#share-code-on-similar-platforms). 

[**Back to top**](#)

## Kotlin Multiplatform

### Updated structure of multiplatform library publications 

Starting from Kotlin 1.4.20, there is no longer a separate metadata publication. Metadata artifacts are now included in
the _root_ publication which stands for the whole library and is automatically resolved to the appropriate platform-specific
artifacts when added as a dependency to the common source set.

Learn more about publishing a multiplatform library [here](https://kotlinlang.org/docs/reference/mpp-publish-lib.html).

#### Compatibility with earlier versions

This change of structure breaks the compatibility between projects with [hierarchical project structure](mpp-share-on-platforms.html#share-code-on-similar-platforms).
If a multiplatform project and a library it depends on both have the hierarchical project structure, then you need to update
them to Kotlin 1.4.20 or higher simultaneously. Libraries published with Kotlin 1.4.20 are not available for using from
project published with earlier versions.

Projects and libraries without the hierarchical project structure remain compatible.

[**Back to top**](#)

## CocoaPods support

### Improved task execution

In this release, we significantly improved task execution flow. For example, if you add a new CocoaPods dependency,
existing dependencies are not rebuilt. Adding an extra target also doesn't affect rebuilding dependencies for existing ones.

### Extended DSL

In 1.4.20, we extend the DSL of adding [CocoaPods](native/cocoapods.html) dependencies to your Kotlin project.

In addition to local Pods and Pods from the CocoaPods repository, you can add dependencies on the following types of libraries:
* A library from a custom spec repository.
* A remote library from a Git repository.
* A library from an archive (also available by arbitrary HTTP address).
* A static library.
* A library with custom cinterop options.

Learn more about adding CocoaPods dependencies in Kotlin projects [here](native/cocoapods.html#add-dependencies-on-pod-libraries).
Find examples in the [Kotlin with CocoaPods sample](https://github.com/Kotlin/kotlin-with-cocoapods-sample).

### Updated integration with Xcode

To work correctly with Xcode, Kotlin requires some Podfile changes:

* If your Kotlin Pod has any Git, HTTP, or specRepo pod dependency, you should also specify it in the Podfile.
* When you add a library from the custom spec, you also should specify the [location](https://guides.cocoapods.org/syntax/podfile.html#source)
    of specs at the beginning of your Podfile.

Now integration errors have a detailed description in IDEA. So if you have problems with your Podfile, you will immediately know how to fix them.

Learn more about creating Kotlin pods [here](native/cocoapods.html#use-a-kotlin-gradle-project-as-a-cocoapods-dependency).

[**Back to top**](#)

## Standard library

### Extensions for java.nio.file.Path

> Extensions for `java.nio.file.Path` are [experimental](evolution/components-stability.html) in 1.4.20. They may change incompatibly in future versions.
{:.note}

Now the standard library provides experimental extensions for `java.nio.file.Path`.
Working with the modern JVM file API in an idiomatic Kotlin way is now similar to working with `java.io.File` extensions
from the `kotlin.io` package.

The extensions are available in the `kotlin.io.path` package in the `kotlin-stdlib-jdk7` module.
In order to use them, you need to opt-in to the experimental annotation `@ExperimentalPathApi`.

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

### Improved String.replace function performance

The new implementation of `String.replace()` function speeds up the execution in certain cases.
The case-sensitive variant uses a manual replacement loop based on `indexOf`, while the case-insensitive one uses regular
expression matching.

[**Back to top**](#)

## Kotlin Android Extensions

### Deprecation of synthetic views

_Synthetic views_ were presented in the Kotlin Android Extensions plugin a while ago to simplify the interaction with UI 
elements and reduce boilerplate. Now Google offers a native mechanism that does the same - Android Jetpack's [view bindings](https://developer.android.com/topic/libraries/view-binding),
and we're deprecating synthetic views in favor of those.

We extract the Parcelable implementations generator from `kotlin-android-extensions` and start the deprecation cycle
for the rest of it - synthetic views. For now, they will keep working with a deprecation warning. 
In the future, you’ll need to switch your project to another solution. Here are the [guidelines](https://goo.gle/kotlin-android-extensions-deprecation)
that will help you migrate your Android project from synthetics to view bindings.

### New plugin for Parcelable implementation generator

The [Parcelable implementation generator](compiler-plugins.html#parcelable-implementations-generator) is now available in the new `kotlin-parcelize` plugin. Apply this plugin instead
of `kotlin-android-extensions`, or in addition to it if you keep using synthetics.

The `@Parcelize` annotation is moved to the `kotlinx.parcelize` package.


