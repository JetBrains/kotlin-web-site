[//]: # (title: What's new in Kotlin 1.5.30)

_[Release date: 24 August 2021](releases.md#release-details)_

Kotlin 1.5.30 offers language updates including previews of future changes, various improvements in platform support and tooling, and new standard library functions.

Here are some major improvements:
* Language features, including experimental sealed `when` statements, changes in using opt-in requirement, and others
* Native support for Apple silicon
* Kotlin/JS IR backend reaches Beta
* Improved Gradle plugin experience

You can also find a short overview of the changes in the [release blog post](https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/) and this video:

<video href="rNbb3A9IdOo" title="Kotlin 1.5.30"/>

## Language features

Kotlin 1.5.30 is presenting previews of future language changes and bringing improvements to the opt-in requirement mechanism
and type inference:
* [Exhaustive when statements for sealed and Boolean subjects](#exhaustive-when-statements-for-sealed-and-boolean-subjects)
* [Suspending functions as supertypes](#suspending-functions-as-supertypes)
* [Requiring opt-in on implicit usages of experimental APIs](#requiring-opt-in-on-implicit-usages-of-experimental-apis)
* [Changes to using opt-in requirement annotations with different targets](#changes-to-using-opt-in-requirement-annotations-with-different-targets)
* [Improvements to type inference for recursive generic types](#improvements-to-type-inference-for-recursive-generic-types)
* [Eliminating builder inference restrictions](#eliminating-builder-inference-restrictions)

### Exhaustive when statements for sealed and Boolean subjects

> Support for sealed (exhaustive) when statements is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-12380).
>
{type="warning"}

An _exhaustive_ [`when`](control-flow.md#when-expression) statement contains branches for all possible types or values of its subject or for some types plus an `else` branch. In other words, it covers all possible cases.

We’re planning to prohibit non-exhaustive `when` statements soon to make the behavior consistent with `when` expressions. To ensure smooth migration, you can configure the compiler to report warnings about non-exhaustive `when` statements with a sealed class or a Boolean. Such warnings will appear by default in Kotlin 1.6 and will become errors later.

> Enums already get a warning.
>
{type="note"}

```kotlin
sealed class Mode {
    object ON : Mode()
    object OFF : Mode()
}

fun main() {
    val x: Mode = Mode.ON
    when (x) { 
        Mode.ON -> println("ON")
    }
// WARNING: Non exhaustive 'when' statements on sealed classes/interfaces 
// will be prohibited in 1.7, add an 'OFF' or 'else' branch instead

    val y: Boolean = true
    when (y) {  
        true -> println("true")
    }
// WARNING: Non exhaustive 'when' statements on Booleans will be prohibited 
// in 1.7, add a 'false' or 'else' branch instead
}
```

To enable this feature in Kotlin 1.5.30, use language version `1.6`. You can also change the warnings to errors by enabling [progressive mode](whatsnew13.md#progressive-mode).

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
            //progressiveMode = true // false by default
        }
    }
}
```

</tab>
</tabs>

### Suspending functions as supertypes

> Support for suspending functions as supertypes is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-18707).
>
{type="warning"}

Kotlin 1.5.30 provides a preview of the ability to use a `suspend` functional type as a supertype with some limitations.

```kotlin
class MyClass: suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}
```

Use the `-language-version 1.6` compiler option to enable the feature:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.6"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '1.6'
        }
    }
}
```

</tab>
</tabs>

The feature has the following restrictions:
* You can’t mix an ordinary functional type and a `suspend` functional type as supertype. This is because of the implementation details of `suspend` functional types in the JVM backend. They are represented in it as ordinary functional types with a marker interface. Because of the marker interface, there is no way to tell which of the superinterfaces are suspended and which are ordinary.
* You can't use multiple `suspend` functional supertypes. If there are type checks, you also can’t use multiple ordinary functional supertypes.

### Requiring opt-in on implicit usages of experimental APIs

> The opt-in requirement mechanism is [Experimental](components-stability.md).
> It may change at any time. [See how to opt-in](opt-in-requirements.md#experimental-status-of-the-opt-in-requirements).
> Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

The author of a library can mark an experimental API as [requiring opt-in](opt-in-requirements.md#create-opt-in-requirement-annotations) to inform users about its experimental state. The compiler raises a warning or error when the API is used and requires [explicit consent](opt-in-requirements.md#opt-in-to-using-api) to suppress it.

In Kotlin 1.5.30, the compiler treats any declaration that has an experimental type in the signature as experimental. Namely, it requires opt-in even for implicit usages of an experimental API. For example, if the function’s return type is marked as an experimental API element, a usage of the function requires you to opt-in even if the declaration is not marked as requiring an opt-in explicitly.

```kotlin
// Library code

@RequiresOptIn(message = "This API is experimental.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime
class DateProvider // A class requiring opt-in

// Client code

// Warning: experimental API usage
fun createDateSource(): DateProvider { /* ... */ }

fun getDate(): Date {
    val dateSource = createDateSource() // Also warning: experimental API usage
    // ... 
}
```

Learn more about [opt-in requirements](opt-in-requirements.md).

### Changes to using opt-in requirement annotations with different targets

> The opt-in requirement mechanism is [Experimental](components-stability.md).
> It may change at any time. [See how to opt-in](opt-in-requirements.md#experimental-status-of-the-opt-in-requirements).
> Use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Kotlin 1.5.30 presents new rules for using and declaring opt-in requirement annotations on different [targets](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/). The compiler now reports an error for use cases that are impractical to handle at compile time. In Kotlin 1.5.30:
* Marking local variables and value parameters with opt-in requirement annotations is forbidden at the use site.
* Marking override is allowed only if its basic declaration is also marked.
* Marking backing fields and getters is forbidden. You can mark the basic property instead.
* Setting `TYPE` and `TYPE_PARAMETER` annotation targets is forbidden at the opt-in requirement annotation declaration site.

Learn more about [opt-in requirements](opt-in-requirements.md).

### Improvements to type inference for recursive generic types

In Kotlin and Java, you can define a recursive generic type, which references itself in its type parameters. In Kotlin 1.5.30, the Kotlin compiler can infer a type argument based only on upper bounds of the corresponding type parameter if it is a recursive generic. This makes it possible to create various patterns with recursive generic types that are often used in Java to make builder APIs.

```kotlin
// Kotlin 1.5.20
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
    withDatabaseName("db")
    withUsername("user")
    withPassword("password")
    withInitScript("sql/schema.sql")
}

// Kotlin 1.5.30
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
    .withDatabaseName("db")
    .withUsername("user")
    .withPassword("password")
    .withInitScript("sql/schema.sql")
```

You can enable the improvements by passing the `-Xself-upper-bound-inference` or the `-language-version 1.6` compiler options. See other examples of newly supported use cases in [this YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-40804).

### Eliminating builder inference restrictions

Builder inference is a special kind of type inference that allows you to infer the type arguments of a call based on type information from other calls inside its lambda argument. This can be useful when calling generic builder functions such as [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) or [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html): `buildList { add("string") }`.

Inside such a lambda argument, there was previously a limitation on using the type information that the builder inference tries to infer. This means you can only specify it and cannot get it. For example, you cannot call [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) inside a lambda argument of `buildList()` without explicitly specified type arguments.

Kotlin 1.5.30 removes these limitations with the `-Xunrestricted-builder-inference` compiler option. Add this option to enable previously prohibited calls inside a lambda argument of generic builder functions:

```kotlin
@kotlin.ExperimentalStdlibApi
val list = buildList {
    add("a")
    add("b")
    set(1, null)
    val x = get(1)
    if (x != null) {
        removeAt(1)
    }
}

@kotlin.ExperimentalStdlibApi
val map = buildMap {
    put("a", 1)
    put("b", 1.1)
    put("c", 2f)
}
```

Also, you can enable this feature with the `-language-version 1.6` compiler option.

## Kotlin/JVM

With Kotlin 1.5.30, Kotlin/JVM receives the following features:
* [Instantiation of annotation classes](#instantiation-of-annotation-classes)
* [Improved nullability annotation support configuration](#improved-nullability-annotation-support-configuration)

See the [Gradle](#gradle) section for Kotlin Gradle plugin updates on the JVM platform.

### Instantiation of annotation classes

> Instantiation of annotation classes is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see the details below), and you should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-45395).
>
{type="warning"}

With Kotlin 1.5.30 you can now call constructors of [annotation classes](annotations.md) in arbitrary code to obtain a resulting instance. This feature covers the same use cases as the Java convention that allows the implementation of an annotation interface.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker) = ...

fun main(args: Array<String>) {
    if (args.size != 0)
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

Use the `-language-version 1.6` compiler option to enable this feature. Note that all current annotation class limitations, such as restrictions to define non-`val` parameters or members different from secondary constructors, remain intact.

Learn more about instantiation of annotation classes in [this KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)

### Improved nullability annotation support configuration

The Kotlin compiler can read various types of [nullability annotations](java-interop.md#nullability-annotations) to get nullability information from Java. This information allows it to report nullability mismatches in Kotlin when calling Java code.

In Kotlin 1.5.30, you can specify whether the compiler reports a nullability mismatch based on the information from specific types of nullability annotations. Just use the compiler option `-Xnullability-annotations=@<package-name>:<report-level>`. In the argument, specify the fully qualified nullability annotations package and one of these report levels:
* `ignore` to ignore nullability mismatches
* `warn` to report warnings
* `strict` to report errors.

See the [full list of supported nullability annotations](java-interop.md#nullability-annotations) along with their fully qualified package names.

Here is an example showing how to enable error reporting for the newly supported [RxJava](https://github.com/ReactiveX/RxJava) 3 nullability annotations: `-Xnullability-annotations=@io.reactivex.rxjava3.annotations:strict`. Note that all such nullability mismatches are warnings by default.

## Kotlin/Native

Kotlin/Native has received various changes and improvements:
* [Apple silicon support](#apple-silicon-support)
* [Improved Kotlin DSL for the CocoaPods Gradle plugin](#improved-kotlin-dsl-for-the-cocoapods-gradle-plugin)
* [Experimental interoperability with Swift 5.5 async/await](#experimental-interoperability-with-swift-5-5-async-await)
* [Improved Swift/Objective-C mapping for objects and companion objects](#improved-swift-objective-c-mapping-for-objects-and-companion-objects)
* [Deprecation of linkage against DLLs without import libraries for MinGW targets](#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)

### Apple silicon support

Kotlin 1.5.30 introduces native support for [Apple silicon](https://support.apple.com/en-us/HT211814).

Previously, the Kotlin/Native compiler and tooling required the [Rosetta translation environment](https://developer.apple.com/documentation/apple-silicon/about-the-rosetta-translation-environment) for working on Apple silicon hosts. In Kotlin 1.5.30, the translation environment is no longer needed – the compiler and tooling can run on Apple silicon hardware without requiring any additional actions.

We’ve also introduced new targets that make Kotlin code run natively on Apple silicon:
* `macosArm64`
* `iosSimulatorArm64`
* `watchosSimulatorArm64`
* `tvosSimulatorArm64`

They are available on both Intel-based and Apple silicon hosts. All existing targets are available on Apple silicon hosts as well.

Note that in 1.5.30 we provide only basic support for Apple silicon targets in the `kotlin-multiplatform` Gradle plugin. Particularly, the new simulator targets aren’t included in the [`ios`, `tvos`, and `watchos` target shortcuts](mpp-share-on-platforms.md#use-target-shortcuts). Learn how to [use Apple silicon targets with the target shortcuts](mpp-share-on-platforms.md#target-shortcuts-and-arm64-apple-silicon-simulators).
We will keep working to improve the user experience with the new targets.

### Improved Kotlin DSL for the CocoaPods Gradle plugin

#### New parameters for Kotlin/Native frameworks

Kotlin 1.5.30 introduces the improved CocoaPods Gradle plugin DSL for Kotlin/Native frameworks. In addition to the name of the framework, you can specify other parameters in the pod configuration:
* Specify the dynamic or static version of the framework
* Enable export dependencies explicitly
* Enable Bitcode embedding

To use the new DSL, update your project to Kotlin 1.5.30, and specify the parameters in the `cocoapods` section of your `build.gradle(.kts)` file:

```kotlin
cocoapods {
    frameworkName = "MyFramework" // This property is deprecated 
    // and will be removed in future versions
    // New DSL for framework configuration:
    framework {
        // All Framework properties are supported
        // Framework name configuration. Use this property instead of 
        // deprecated 'frameworkName'
        baseName = "MyFramework"
        // Dynamic framework support
        isStatic = false
        // Dependency export
        export(project(":anotherKMMModule"))
        transitiveExport = true
        // Bitcode embedding
        embedBitcode(BITCODE)
    }
}
```

#### Support custom names for Xcode configuration

The Kotlin CocoaPods Gradle plugin supports custom names in the Xcode build configuration. It will also help you if you’re using special names for the build configuration in Xcode, for example `Staging`.

To specify a custom name, use the `xcodeConfigurationToNativeBuildType` parameter in the `cocoapods` section of your `build.gradle(.kts)` file:

```kotlin
cocoapods {
    // Maps custom Xcode configuration to NativeBuildType
    xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
    xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
}
```

This parameter will not appear in the podspec file. When Xcode runs the Gradle build process, the Kotlin CocoaPods Gradle plugin will select the necessary native build type.

> There’s no need to declare the `Debug` and `Release` configurations because they are supported by default.
>
{type="note"}

### Experimental interoperability with Swift 5.5 async/await

> Concurrency interoperability with Swift async/await is [Experimental](components-stability.md). It may be dropped or changed at any time.
> You should use it only for evaluation purposes. We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610).
>
{type="warning"}

We added [support for calling Kotlin’s suspending functions from Objective-C and Swift in 1.4.0](whatsnew14.md#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c), and now we’re improving it to keep up with a new Swift 5.5 feature – [concurrency with `async` and `await` modifiers](https://github.com/apple/swift-evolution/blob/main/proposals/0296-async-await.md).

The Kotlin/Native compiler now emits the `_Nullable_result` attribute in the generated Objective-C headers for suspending functions with nullable return types. This makes it possible to call them from Swift as `async` functions with the proper nullability.

Note that this feature is experimental and can be affected in the future by changes in both Kotlin and Swift. For now, we’re offering a preview of this feature that has certain limitations, and we are eager to hear what you think. Learn more about its current state and leave your feedback in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610).

### Improved Swift/Objective-C mapping for objects and companion objects

Getting objects and companion objects can now be done in a way that is more intuitive for native iOS developers. For example, if you have the following objects in Kotlin:

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

To access them in Swift, you can use the `shared` and `companion` properties:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

Learn more about [Swift/Objective-C interoperability](native-objc-interop.md).

### Deprecation of linkage against DLLs without import libraries for MinGW targets

[LLD](https://lld.llvm.org/) is a linker from the LLVM project, which we plan to start using in Kotlin/Native for MinGW targets because of its benefits over the default ld.bfd – primarily its better performance.

However, the latest stable version of LLD doesn’t support direct linkage against DLL for MinGW (Windows) targets. Such linkage requires using [import libraries](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527#3573527). Although they aren’t needed with Kotlin/Native 1.5.30, we’re adding a warning to inform you that such usage is incompatible with LLD that will become the default linker for MinGW in the future.

Please share your thoughts and concerns about the transition to the LLD linker in [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47605).

## Kotlin Multiplatform

1.5.30 brings the following notable updates to Kotlin Multiplatform:
* [Ability to use custom `cinterop` libraries in shared native code](#ability-to-use-custom-cinterop-libraries-in-shared-native-code)
* [Support for XCFrameworks](#support-for-xcframeworks)
* [New default publishing setup for Android artifacts](#new-default-publishing-setup-for-android-artifacts)

### Ability to use custom `cinterop` libraries in shared native code

Kotlin Multiplatform gives you an [option](mpp-share-on-platforms.md#use-native-libraries-in-the-hierarchical-structure) to use platform-dependent interop libraries in shared source sets. Before 1.5.30, this worked only with [platform libraries](native-platform-libs.md) shipped with Kotlin/Native distribution. Starting from 1.5.30, you can use it with your custom `cinterop` libraries. To enable this feature, add the `kotlin.mpp.enableCInteropCommonization=true` property in your `gradle.properties`:

```properties
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
kotlin.mpp.enableCInteropCommonization=true
```

### Support for XCFrameworks

All Kotlin Multiplatform projects can now have XCFrameworks as an output format. Apple introduced XCFrameworks as a replacement for universal (fat) frameworks. With the help of XCFrameworks you:
* Can gather logic for all the target platforms and architectures in a single bundle.
* Don't need to remove all unnecessary architectures before publishing the application to the App Store.

XCFrameworks is useful if you want to use your KMM framework for devices and simulators on Apple M1.

To use XCFrameworks, update your `build.gradle(.kts)` script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
  
    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)

    ios {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    watchos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
    tvos {
        binaries.framework {
            baseName = "shared"
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

When you declare XCFrameworks, these new Gradle tasks will be registered:
* `assembleXCFramework`
* `assembleDebugXCFramework` (additionally debug artifact that [contains dSYMs](native-ios-symbolication.md))
* `assembleReleaseXCFramework`

Learn more about XCFrameworks in [this WWDC video](https://developer.apple.com/videos/play/wwdc2019/416/).

### New default publishing setup for Android artifacts

Using the `maven-publish` Gradle plugin, you can [publish your multiplatform library for the Android target](mpp-publish-lib.md#publish-an-android-library) by specifying [Android variant](https://developer.android.com/studio/build/build-variants) names in the build script. The Kotlin Gradle plugin will generate publications automatically.

Before 1.5.30, the generated publication [metadata](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html) included the build type attributes for every published Android variant, making it compatible only with the same build type used by the library consumer. Kotlin 1.5.30 introduces a new default publishing setup:
* If all Android variants that the project publishes have the same build type attribute, then the published variants won't have the build type attribute and will be compatible with any build type.
* If the published variants have different build type attributes, then only those with the `release` value will be published without the build type attribute. This makes the release variants compatible with any build type on the consumer side, while non-release variants will only be compatible with the matching consumer build types.

To opt-out and keep the build type attributes for all variants, you can set this Gradle property: `kotlin.android.buildTypeAttribute.keep=true`.

## Kotlin/JS

Two major improvements are coming to Kotlin/JS with 1.5.30:
* [JS IR compiler backend reaches Beta](#js-ir-compiler-backend-reaches-beta)
* [Better debugging experience for applications with the Kotlin/JS IR backend](#better-debugging-experience-for-applications-with-the-kotlin-js-ir-backend)

### JS IR compiler backend reaches Beta

The [IR-based compiler backend](whatsnew14.md#unified-backends-and-extensibility) for Kotlin/JS, which was introduced in 1.4.0 in [Alpha](components-stability.md), has reached Beta.

Previously, we published the [migration guide for the JS IR backend](js-ir-migration.md) to help you migrate your projects to the new backend. Now we would like to present the [Kotlin/JS Inspection Pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) IDE plugin, which displays the required changes directly in IntelliJ IDEA.

### Better debugging experience for applications with the Kotlin/JS IR backend

Kotlin 1.5.30 brings JavaScript source map generation for the Kotlin/JS IR backend. This will improve the Kotlin/JS debugging experience when the IR backend is enabled, with full debugging support that includes breakpoints, stepping, and readable stack traces with proper source references.

Learn more about [how to debug Kotlin/JS in the browser or IntelliJ IDEA Ultimate](js-debugging.md).

## Gradle

As a part of our mission to [improve the Kotlin Gradle plugin user experience](https://youtrack.jetbrains.com/issue/KT-45778), we’ve implemented the following features:
* [Support for Java toolchains](#support-for-java-toolchains), which includes an [ability to specify a JDK home with the `UsesKotlinJavaToolchain` interface for older Gradle versions](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface)
* [An easier way to explicitly specify the Kotlin daemon’s JVM arguments](#easier-way-to-explicitly-specify-kotlin-daemon-jvm-arguments)

### Support for Java toolchains

Gradle 6.7 introduced the ["Java toolchains support"](https://docs.gradle.org/current/userguide/toolchains.html) feature.
Using this feature, you can:
* Run compilations, tests, and executables using JDKs and JREs that are different from the Gradle ones.
* Compile and test code with an unreleased language version.

With toolchains support, Gradle can autodetect local JDKs and install missing JDKs that Gradle requires for the build. Now Gradle itself can run on any JDK and still reuse the [build cache feature](gradle.md#gradle-build-cache-support).

The Kotlin Gradle plugin supports Java toolchains for Kotlin/JVM compilation tasks.
A Java toolchain:
* Sets the [`jdkHome` option](gradle.md#attributes-specific-to-jvm) available for JVM targets.
  > [The ability to set the `jdkHome` option directly has been deprecated](https://youtrack.jetbrains.com/issue/KT-46541).
  >
  {type="warning"}

* Sets the [`kotlinOptions.jvmTarget`](gradle.md#attributes-specific-to-jvm) to the toolchain's JDK version if the user didn’t set the `jvmTarget` option explicitly.
  If the toolchain is not configured, the `jvmTarget` field uses the default value. Learn more about [JVM target compatibility](gradle.md#check-for-jvm-target-compatibility).

* Affects which JDK [`kapt` workers](kapt.md#running-kapt-tasks-in-parallel) are running on.

Use the following code to set a toolchain. Replace the placeholder `<MAJOR_JDK_VERSION>` with the JDK version you would like to use:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // “8”
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // “8”
    }
}
```

</tab>
</tabs>

Note that setting a toolchain via the `kotlin` extension will update the toolchain for Java compile tasks as well.

You can set a toolchain via the `java` extension, and Kotlin compilation tasks will use it:

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // “8”
    }
}
```

For information about setting any JDK version for `KotlinCompile` tasks, look through the docs about [setting the JDK version with the Task DSL](gradle.md#setting-jdk-version-with-the-task-dsl).

For Gradle versions from 6.1 to 6.6, [use the `UsesKotlinJavaToolchain` interface to set the JDK home](#ability-to-specify-jdk-home-with-useskotlinjavatoolchain-interface).

### Ability to specify JDK home with UsesKotlinJavaToolchain interface

All Kotlin tasks that support setting the JDK via [`kotlinOptions`](gradle.md#compiler-options) now implement the `UsesKotlinJavaToolchain` interface. To set the JDK home, put a path to your JDK and replace the `<JDK_VERSION>` placeholder:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
project.tasks
    .withType<UsesKotlinJavaToolchain>()
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            "/path/to/local/jdk",
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```


</tab>
<tab title="Groovy" group-key="groovy">

```groovy
project.tasks
    .withType(UsesKotlinJavaToolchain.class)
    .configureEach {
        it.kotlinJavaToolchain.jdk.use(
            '/path/to/local/jdk',
            JavaVersion.<LOCAL_JDK_VERSION>
        )
    }
```

</tab>
</tabs>

Use the `UsesKotlinJavaToolchain` interface for Gradle versions from 6.1 to 6.6. Starting from Gradle 6.7, use the [Java toolchains](#support-for-java-toolchains) instead.

When using this feature, note that [kapt task workers](kapt.md#running-kapt-tasks-in-parallel) will only use [process isolation mode](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode), and the `kapt.workers.isolation` property will be ignored.

### Easier way to explicitly specify Kotlin daemon JVM arguments

In Kotlin 1.5.30, there’s a new logic for the Kotlin daemon’s JVM arguments. Each of the options in the following list overrides the ones that came before it:

* If nothing is specified, the Kotlin daemon inherits arguments from the Gradle daemon (as before). For example, in the `gradle.properties` file:

    ```properties
    org.gradle.jvmargs=-Xmx1500m -Xms=500m
    ```

* If the Gradle daemon’s JVM arguments have the `kotlin.daemon.jvm.options` system property, use it as before:

    ```properties
    org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
    ```

* You can add the`kotlin.daemon.jvmargs` property in the `gradle.properties` file:

    ```properties
    kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
    ```

* You can specify arguments in the `kotlin` extension:

  <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
    }
    ```

    </tab>
    </tabs>

* You can specify arguments for a specific task:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks
        .matching { it.name == "compileKotlin" && it is CompileUsingKotlinDaemon }
        .configureEach {
            (this as CompileUsingKotlinDaemon).kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
        }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">
  
    ```groovy
    tasks
        .matching {
            it.name == "compileKotlin" && it instanceof CompileUsingKotlinDaemon
        }
        .configureEach {
            kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
        }
    ```

    </tab>
    </tabs>

    > In this case a new Kotlin daemon instance can start on task execution. Learn more about [the Kotlin daemon’s interactions with JVM arguments](gradle.md#setting-kotlin-daemon-s-jvm-arguments).
    >
    {type="note"}

For more information about the Kotlin daemon, see [the Kotlin daemon and using it with Gradle](gradle.md#kotlin-daemon-and-using-it-with-gradle).

## Standard library

Kotlin 1.5.30 is bringing improvements to the standard library’s `Duration` and `Regex` APIs:
* [Changing `Duration.toString()` output](#changing-duration-tostring-output)
* [Parsing Duration from String](#parsing-duration-from-string)
* [Matching with Regex at a particular position](#matching-with-regex-at-a-particular-position)
* [Splitting Regex to a sequence](#splitting-regex-to-a-sequence)

### Changing Duration.toString() output

> The Duration API is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We would appreciate hearing your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issues/KT).
>
{type="warning"}

Before Kotlin 1.5.30, the [`Duration.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html) function would return a string representation of its argument expressed in the unit that yielded the most compact and readable number value.
From now on, it will return a string value expressed as a combination of numeric components, each in its own unit.
Each component is a number followed by the unit’s abbreviated name: `d`, `h`, `m`, `s`. For example:

|**Example of function call**|**Previous output**|**Current output**|
| --- | --- | --- |
Duration.days(45).toString()|`45.0d`|`45d`|
Duration.days(1.5).toString()|`36.0h`|`1d 12h`|
Duration.minutes(1230).toString()|`20.5h`|`20h 30m`|
Duration.minutes(2415).toString()|`40.3h`|`1d 16h 15m`|
Duration.minutes(920).toString()|`920m`|`15h 20m`|
Duration.seconds(1.546).toString()|`1.55s`|`1.546s`|
Duration.milliseconds(25.12).toString()|`25.1ms`|`25.12ms`|

The way negative durations are represented has also been changed. A negative duration is prefixed with a minus sign (`-`), and if it consists of multiple components, it is surrounded with parentheses: `-12m` and `-(1h 30m)`.

Note that small durations of less than one second are represented as a single number with one of the subsecond units. For example, `ms` (milliseconds), `us` (microseconds), or `ns` (nanoseconds): `140.884ms`, `500us`, `24ns`. Scientific notation is no longer used to represent them.

If you want to express duration in a single unit, use the overloaded `Duration.toString(unit, decimals)` function.

> We recommend using [`Duration.toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) in certain cases, including serialization and interchange. `Duration.toIsoString()` uses the stricter [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) format instead of `Duration.toString()`.
>
{type="note"}

### Parsing Duration from String

> The Duration API is [Experimental](components-stability.md). It may be dropped or changed at any time.
> Use it only for evaluation purposes. We would appreciate hearing your feedback on it in [this issue](https://github.com/Kotlin/KEEP/issues/190).
>
{type="warning"}

In Kotlin 1.5.30, there are new functions in the Duration API:
* [`parse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse.html), which supports parsing the outputs of:
    * [`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    * [`toString(unit, decimals)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-string.html).
    * [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html).
* [`parseIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string.html), which only parses from the format produced by `toIsoString()`.
* [`parseOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-or-null.html) and [`parseIsoStringOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/parse-iso-string-or-null.html), which behave like the functions above but return `null` instead of throwing `IllegalArgumentException` on invalid duration formats.

Here are some examples of `parse()` and `parseOrNull()` usages:

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    val singleUnitFormatString = "1.5h"
    val invalidFormatString = "1 hour 30 minutes"
    println(Duration.parse(isoFormatString)) // "1h 30m"
    println(Duration.parse(defaultFormatString)) // "1h 30m"
    println(Duration.parse(singleUnitFormatString)) // "1h 30m"
    //println(Duration.parse(invalidFormatString)) // throws exception
    println(Duration.parseOrNull(invalidFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

And here are some examples of `parseIsoString()` and `parseIsoStringOrNull()` usages:

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val isoFormatString = "PT1H30M"
    val defaultFormatString = "1h 30m"
    println(Duration.parseIsoString(isoFormatString)) // "1h 30m"
    //println(Duration.parseIsoString(defaultFormatString)) // throws exception
    println(Duration.parseIsoStringOrNull(defaultFormatString)) // "null"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### Matching with Regex at a particular position

> `Regex.matchAt()` and `Regex.matchesAt()` functions are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Use them only for evaluation purposes. We would appreciate hearing your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-34021).
>
{type="warning"}

The new `Regex.matchAt()` and `Regex.matchesAt()` functions provide a way to check whether a regex has an exact match at a particular position in a `String` or `CharSequence`.

`matchesAt()` returns a boolean result:

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    // regular expression: one digit, dot, one digit, dot, one or more digits
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchesAt(releaseText, 0)) // "false"
    println(versionRegex.matchesAt(releaseText, 7)) // "true"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

`matchAt()` returns the match if one is found or `null` if one isn’t:

```kotlin
fun main(){
//sampleStart
    val releaseText = "Kotlin 1.5.30 is released!"
    val versionRegex = "\\d[.]\\d[.]\\d+".toRegex()
    println(versionRegex.matchAt(releaseText, 0)) // "null"
    println(versionRegex.matchAt(releaseText, 7)?.value) // "1.5.30"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### Splitting Regex to a sequence

> `Regex.splitToSequence()` and `CharSequence.splitToSequence(Regex)` functions are [Experimental](components-stability.md). They may be dropped or changed at any time.
> Use them only for evaluation purposes. We would appreciate hearing your feedback on them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-23351).
>
{type="warning"}

The new `Regex.splitToSequence()` function is a lazy counterpart of [`split()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/split.html). It splits the string around matches of the given regex, but it returns the result as a [Sequence](sequences.md) so that all operations on this result are executed lazily.

```kotlin
fun main(){
//sampleStart
    val colorsText = "green, red , brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

A similar function was also added to `CharSequence`:

```kotlin
    val mixedColor = colorsText.splitToSequence(regex)
```
{kotlin-runnable="false"}

## Serialization 1.3.0-RC

`kotlinx.serialization` [1.3.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC) is here with 
new JSON serialization capabilities:
* Java IO streams serialization
* Property-level control over default values
* An option to exclude null values from serialization
* Custom class discriminators in polymorphic serialization

Learn more in the [changelog](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC).
<!-- and the [kotlinx.serialization 1.3.0 release blog post](TODO). -->