[//]: # (title: What's new in Kotlin 2.3.20)

<show-structure depth="1"/>

<web-summary>Read the Kotlin 2.3.20 release notes covering new language features, updates to Kotlin Multiplatform, JVM, Native, JS, and Wasm, and build tool support for Gradle and Maven.</web-summary>

_[Released: March 16, 2026](releases.md#release-history)_

The Kotlin 2.3.20 release is out! Here are the main highlights:

* **Gradle**: [Compatibility with Gradle 9.3.0](#compatibility-with-gradle-9-3-0) and [Kotlin/JVM compilation uses BTA by default](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**: [Simplified setup for Kotlin projects](#simplified-setup-for-kotlin-projects)
* **Kotlin compiler plugins**: [Lombok is in Alpha](#lombok-is-now-alpha) and [improved JPA support in the `kotlin.plugin.jpa` plugin](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Language**: [Support for name-based destructuring declarations](#name-based-destructuring)
* **Standard library**: [New API for creating immutable copies of `Map.Entry`](#new-api-for-creating-immutable-copies-of-map-entry)
* **Kotlin/Native**: [New interoperability mode for C and Objective-C libraries](#new-interoperability-mode-for-c-or-objective-c-libraries)

## Update to Kotlin 2.3.20

The latest version of Kotlin is included in the latest versions of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) and [Android Studio](https://developer.android.com/studio).

To update to the new Kotlin version, make sure your IDE is updated to the latest version and [change the Kotlin version](releases.md#update-to-a-new-kotlin-version) to 2.3.20 in your build scripts.

## New features {id=new-stable-features}
<primary-label ref="stable"/>

The following feature is [Stable](components-stability.md#stability-levels-explained) in this release:

<snippet id="simplified-setup-for-kotlin-projects-content">

<var name="id1" value="simplified-setup-for-kotlin-projects"/>

<var name="id2" value="simplified-setup-for-kotlin-projects-how-to-enable"/>

### Simplified setup for Kotlin projects {id="%id1%"}
<secondary-label ref="maven"/>

Kotlin 2.3.20 makes it easier to set up Kotlin in Maven projects. Now Kotlin supports the automatic configuration of source roots and Kotlin's standard library.

With the new automatic configuration, when you create a new Kotlin project with the Maven build system or introduce Kotlin to your existing Java Maven project,
you don't need to manually specify source root paths or add the `kotlin-stdlib` dependency in your POM build file.

#### How to enable {id="%id2%"}

In your `pom.xml` file, add `<extensions>true</extensions>` to the `<build><plugins>` section of the Kotlin Maven plugin:

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinVersion%</version>
             <extensions>true</extensions> <!-- Add this extension  -->
         </plugin>
    </plugins>
</build>
```

The new extension automatically:

* Registers `src/main/kotlin` and `src/test/kotlin` directories as source roots in case they already exist but are not specified in the plugin configuration.
* Adds the `kotlin-stdlib` dependency in case it's not explicitly defined already.

You can also opt out of the automatic addition of Kotlin's standard library. For that, add the following to the `<properties>` section:

```xml
<project>
    <properties>
        <!-- Disable smart defaults via property -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

Note that the property disables all simplified setup features, including the registration of source root paths.

For more information on configuring Kotlin Maven projects, see [Configure a Maven project](maven-configure-project.md).

</snippet>

## New features {id=new-experimental-features}
<primary-label ref="experimental-exp"/>

The following pre-stable features are available in this release.
This includes features with [Beta](components-stability.md#stability-levels-explained), [Alpha](components-stability.md#stability-levels-explained), and [Experimental](components-stability.md#stability-levels-explained) status:

* [Compiler: Lombok is now in Alpha](#lombok-is-now-alpha)
* [Language: Name-based destructuring](#name-based-destructuring)
* [Standard library: New API for creating immutable copies of `Map.Entry`](#new-api-for-creating-immutable-copies-of-map-entry)
* [Kotlin/Native: New interoperability mode for C or Objective-C libraries](#new-interoperability-mode-for-c-or-objective-c-libraries)

<snippet id="lombok-is-now-alpha-content">

<var name="id3" value="lombok-is-now-alpha"/>

### Lombok is now in Alpha {id="%id3%"}
<primary-label ref="alpha"/>
<secondary-label ref="compiler"/>

Kotlin 1.5.20 introduced the experimental [Lombok compiler plugin](lombok.md), which lets you generate and use [Java's Lombok declarations](https://projectlombok.org/) in modules that mix Kotlin and Java code.

In 2.3.20, the Lombok compiler plugin has been promoted to [Alpha](components-stability.md#stability-levels-explained) because we plan to make this functionality production-ready, but it's still under development.

</snippet>

<snippet id="name-based-destructuring-content">

<var name="id4" value="name-based-destructuring"/>

<var name="id5" value="name-based-destructuring-how-to-enable"/>

### Name-based destructuring {id="%id4%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="language"/>

Kotlin 2.3.20 introduces *name-based destructuring declarations*,
which match variables to property names instead of relying on position-based `componentN()` functions.

Previously, [destructuring declarations](destructuring-declarations.md) used position-based destructuring:

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // alice

    println(username)
    // alice@example.com
}
```
{kotlin-runnable="true"}

In this example, because destructuring relies on the order of `componentN()` functions, `email` receives the value of `username`, and `username` receives the value of `email`.

Starting with Kotlin 2.3.20, you can use name-based destructuring where each variable refers to a property by name:

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // Uses name-based destructuring with explicit form
    (val mail = email, val name = username) = user

    println(name)
    // alice

    println(mail)
    // alice@example.com
}
```

Name-based destructuring is [Experimental](components-stability.md#stability-levels-explained).
You can control how the compiler interprets destructuring declarations with the `-Xname-based-destructuring` compiler option.

It has the following modes:

* `only-syntax` enables the explicit form of name-based destructuring without changing the behavior of existing destructuring declarations.
* `name-mismatch` reports warnings when position-based destructuring in data classes uses variable names that don't match the property names.
* `complete` enables short-form name-based destructuring with parentheses and continues supporting position-based destructuring with square bracket syntax.

If you use `complete` mode, the short-form destructuring syntax with parentheses matches variables to property names instead of relying on position:

```kotlin
val (email, username) = user
```
#### How to enable {id="%id5%"}

To use named-based destructuring in your project, add the compiler option to your build configuration file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab> 
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab> 
</tabs>

Opting in to name-based destructuring also introduces a new syntax for position-based destructuring using square brackets:

```kotlin
// Uses explicit position-based destructuring
val [username, email] = user
```

We plan to gradually move toward destructuring declarations using name-based matching by default, while preserving position-based destructuring with the new square bracket syntax.

For more information, see the feature's [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md).

We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-19627).

</snippet>

<snippet id="new-api-for-creating-immutable-copies-of-map-entry-content">

<var name="id6" value="new-api-for-creating-immutable-copies-of-map-entry"/>

### New API for creating immutable copies of `Map.Entry` {id="%id6%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.3.20 introduces the `Map.Entry.copy()` extension function for creating an immutable copy of a [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/).
This function allows you to reuse entries obtained from [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) after modifying the map by copying them first.

`Map.Entry.copy()` is [Experimental](components-stability.md#stability-levels-explained).
To opt in, use the `@OptIn(ExperimentalStdlibApi::class)` annotation or the compiler option `-opt-in=kotlin.ExperimentalStdlibApi`.

Here's an example of using `Map.Entry.copy()` to remove entries from a mutable map:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // map = {1=1, 3=3}
}
```

</snippet>

<snippet id="new-interoperability-mode-for-c-or-objective-c-libraries-content">

<var name="id7" value="new-interoperability-mode-for-c-or-objective-c-libraries"/>

<var name="id8" value="new-interoperability-mode-for-c-or-objective-c-libraries-how-to-enable"/>

<var name="id9" value="new-interoperability-mode-for-c-or-objective-c-libraries-report-your-results"/>

### New interoperability mode for C or Objective-C libraries {id="%id7%"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="native"/>

If you use C or Objective-C libraries in your Kotlin Multiplatform libraries or applications, we invite you to test the new interoperability mode and share the results.

In general, Kotlin/Native enables importing C and Objective-C libraries into Kotlin.
However, for Kotlin Multiplatform libraries, this functionality is currently [affected](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) by the KMP compatibility issues with older compiler versions.

In other words, if you publish a Kotlin Multiplatform library compiled with one Kotlin version, importing C or Objective-C libraries might make it impossible to use that Kotlin library in projects with an earlier Kotlin version.

To address this and other issues, the Kotlin team has been revising the interoperability mechanism used under the hood.
Starting with Kotlin 2.3.20-Beta1, you can try the new mode through a compiler option.

#### How to enable {id="%id8%"}

1. In your Gradle build file, check whether you have a `cinterops {}` block or a `pod()` dependency.
   If these are present, your project uses C or Objective-C libraries.

2. Ensure your project uses `2.3.20-Beta1` or a later version.
3. In the same build file, add the `-Xccall-mode` compiler option to the cinterop tool invocation:

   ```kotlin
   kotlin {
       targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
           compilations.configureEach {
               cinterops.configureEach {
                   extraOpts += listOf("-Xccall-mode", "direct")
               }
           }
       }
   }
   ```

4. Build and test your project as usual by running unit tests, the app, and so on.
   You can also use the `--continue` option to allow Gradle to continue executing tasks even after failures, helping to find more problems at once.

> Do **not** publish libraries compiled with the new interoperability mode yet, as it's still [Experimental](components-stability.md#stability-levels-explained).
>
{style="warning"}

#### Report your results {id="%id9%"}

The new interoperability mode is supposed to be a drop-in replacement in most cases.
We're planning to eventually enable it by default. But to achieve that, we need to ensure it works as well as possible and test it on a wide range of projects, because:

* Some C and Objective-C declarations aren't yet supported in the new mode (mostly because of compatibility issues). We'd like to better understand the real-world impact of this and prioritize future steps accordingly.
* There may be bugs or things we haven't considered. Testing languages with numerous interacting features is challenging, and testing the interaction between languages (each with a unique set of features) is even more so.

Help us examine real-world projects and identify challenging cases.
Whether you encounter any issues or not, share your results in the comments to [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-83218).

</snippet>

## Language

Kotlin 2.3.20 adds name-based destructuring declarations that match variables to property names instead of relying on position.
It also introduces changes to overload resolution for declarations with context parameters.

### Changes to overload resolution for context parameters
<secondary-label ref="language"/>

Kotlin 2.3.20 introduces changes to overload resolution for declarations with context parameters.

Previously, overload resolution treated declarations with context parameters as more specific than those without them.

Starting with Kotlin 2.3.20, this rule no longer applies, making overload selection more uniform.
As a result, calls that previously resolved now become ambiguous, resulting in a compilation error when overloads differ only by context parameters.
In such cases, the compiler warns about potential ambiguity.

Here's an example:

```kotlin
class Logger {
    fun info(msg: String) = println("INFO: $msg")
}

fun saveUser(id: Int) {
    println("Saving user $id (no logger)")
}

// Reports a warning: Contextual declaration is shadowed
context(logger: Logger)
fun saveUser(id: Int) {
    logger.info("Saving user $id")
}

fun main() {
    val logger = Logger()

    context(logger) {
        // Reports an ambiguity error in 2.3.20
        saveUser(1)
    }
}
```

Additionally, Kotlin 2.3.20 reduces the number of `kotlin.context` overloads from 22 to 6 to reduce excessive overload candidates during resolution and code completion.

<include from="whatsnew2320.md" element-id="name-based-destructuring-content">
<var name="id4" value="language-name-based-destructuring"/>
<var name="id5" value="language-name-based-destructuring-how-to-enable"/>
</include>

## Standard library

Kotlin 2.3.20 includes a new experimental feature for the standard library.

<include from="whatsnew2320.md" element-id="new-api-for-creating-immutable-copies-of-map-entry-content">
<var name="id6" value="standard-library-new-api-for-creating-immutable-copies-of-map-entry"/>
</include>

## Kotlin compiler plugins

Kotlin 2.3.20 brings important updates to the Lombok and `kotlin.plugin.jpa` compiler plugins.

### Improved JPA support in the `kotlin.plugin.jpa` plugin
<secondary-label ref="compiler"/>

The `kotlin.plugin.jpa` plugin now automatically applies the [`all-open`](all-open-plugin.md) compiler plugin with the newly added built-in JPA preset,
in addition to applying the existing [`no-arg`](no-arg-plugin.md) compiler plugin.

Previously, using `kotlin("plugin.jpa")` enabled only the `no-arg` plugin with JPA presets.

In this release, we improved the `kotlin.plugin.jpa` preset so the `all-open` plugin is configured automatically.
This ensures that lazy associations work as expected instead of causing eager loading and triggering extra queries.

Starting with Kotlin 2.3.20:

* The `all-open` compiler plugin provides a JPA preset.
* The Gradle `org.jetbrains.kotlin.plugin.jpa` plugin automatically applies the `org.jetbrains.kotlin.plugin.all-open` plugin with the JPA preset enabled.
* The [Maven JPA setup](no-arg-plugin.md#jpa-support) enables `all-open` with the JPA preset by default. (Support in IntelliJ IDEA is available from 2026.1.)
* The Maven dependency `org.jetbrains.kotlin:kotlin-maven-noarg` now implicitly includes `org.jetbrains.kotlin:kotlin-maven-allopen`, so you no longer need to add it explicitly in the `<plugin><dependencies>` block.

As a result, JPA entities annotated with the following annotations
are automatically treated as `open` and receive no-argument constructors without additional configuration:

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

This change simplifies build configuration and improves the out-of-the-box experience when using Kotlin with JPA frameworks.

> The upcoming release of [IntelliJ IDEA 2026.1](https://www.jetbrains.com/idea/whatsnew/) automatically configures the `kotlin.plugin.jpa` plugin when setting up Kotlin in a project. The IDE offers a quick-fix to add the plugin and remove any redundant no-arg constructor declarations.
>
{style="tip"}

<include from="whatsnew2320.md" element-id="lombok-is-now-alpha-content">
<var name="id3" value="compiler-lombok-is-now-alpha"/>
</include>

## Kotlin/JVM

Kotlin 2.3.20 introduces several improvements to Java interoperability. The compiler now recognizes the Vert.x `@Nullable` annotation for nullability checks.
This release also adds support for the Java `@Unmodifiable` and `@UnmodifiableView` annotations to treat annotated collections as read-only in Kotlin.

### Support for Vert.x `@Nullable` annotation
<secondary-label ref="jvm"/>

Kotlin 2.3.20 adds support for the [`io.vertx.codegen.annotations.Nullable`](https://www.javadoc.io/doc/io.vertx/vertx-codegen/3.5.0/io/vertx/codegen/annotations/Nullable.html) annotation.
The compiler now recognizes this annotation and reports nullability mismatches as warnings by default.

To enforce strict nullability checks and upgrade these warnings to errors, add the following compiler option to your build file:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnullability-annotations=@io.vertx.codegen.annotations:strict")
    }
}
```
</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xnullability-annotations=@io.vertx.codegen.annotations:strict</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```
</tab>
</tabs>

### Support for Java unmodifiable collection annotations
<secondary-label ref="jvm"/>

Kotlin 2.3.20 adds support for the [`org.jetbrains.annotations.Unmodifiable`](https://javadoc.io/doc/org.jetbrains/annotations/20.1.0/org/jetbrains/annotations/Unmodifiable.html) and [`org.jetbrains.annotations.UnmodifiableView`](https://javadoc.io/doc/org.jetbrains/annotations/24.0.1/org/jetbrains/annotations/UnmodifiableView.html) Java annotations.

Starting from Kotlin 2.3.20, collections returned from Java declarations marked with these annotations are treated as read-only in Kotlin. Assigning them to a mutable collection type results in a type mismatch warning. This warning is scheduled to become an error in Kotlin 2.5.0.

Here's an example:

```java
// Java
public class Java {
    public static @UnmodifiableView List<Object> unmodifiableView() {
        return List.of();
    }

    public static @Unmodifiable List<Object> unmodifiable() {
        return List.of();
    }
}
```

```kotlin
// Kotlin

fun main() {
    // Reports a warning: Java type mismatch
    val mutableView: MutableList<Any> = Java.unmodifiableView()
    val mutableCopy: MutableList<Any> = Java.unmodifiable()
}
```

## Kotlin/Native

Kotlin 2.3.20 introduces a new experimental interoperability mode for C and Objective-C libraries, a cross-compilation checker, and a new DSL for disabling the compilation cache in Kotlin/Native projects.

###  Cross-compilation checker
<secondary-label ref="native"/>

Kotlin 2.3.20 introduces a way to determine if cross-compilation is supported for the given target.
This can be useful for third-party plugins that follow the status of compilation tasks.

Generally, Kotlin/Native allows cross-compilation, meaning that any supported host can produce `.klib` artifacts for supported targets.
However, artifact production for Apple targets is still limited if your project uses [cinterop dependencies](native-c-interop.md).

The new `crossCompilationSupported` API now checks whether cross-compilation is supported: the target should be enabled by the host manager, and none of the target's compilations should involve cinterop dependencies.
The checker is enabled by default.

For more information on supported targets and hosts, see the [Kotlin/Native documentation](native-target-support.md).

### New DSL for disabling compilation cache
<secondary-label ref="native"/>

Kotlin 2.3.20 comes with a new DSL for disabling the compilation cache in Kotlin/Native projects.
It's intended to make the decision of disabling the cache more considered and explicit.

Since disabling the cache makes Kotlin/Native builds significantly slower, it should be used only temporarily and in exceptional cases.
That's why disabling the cache is now tied to a specific Kotlin version and must include a reason, which acts as documentation.

If you do need to disable the compilation cache in your project, update the `binaries {}` block in your Gradle build file as follows:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach {
        // Specify your binary kind
        it.binaries.framework {
            baseName = "CacheKind"
            isStatic = true

            // Disable cache with the new DSL
            disableNativeCache(
                 version = DisableCacheInKotlinVersion.2_3_0, 
                 reason = "Cache bug",
                 issue = URI("https://youtrack.com/YY-1111")
            )
        }
    }
}
```

* `version` − the Kotlin version for which the compilation cache is disabled.
* `reason` (mandatory) − the reason why the compilation cache is disabled.
* `issue` (optional) − a URL to the corresponding issue in your bug tracker.

The new DSL replaces the deprecated `kotlin.native.cacheKind` Gradle property. You can safely remove it from your `gradle.properties` file.

For more tips on improving compilation times, see the [Kotlin/Native documentation](native-improving-compilation-time.md).

<include from="whatsnew2320.md" element-id="new-interoperability-mode-for-c-or-objective-c-libraries-content">
<var name="id7" value="native-new-interoperability-mode-for-c-or-objective-c-libraries"/>
<var name="id8" value="native-new-interoperability-mode-for-c-or-objective-c-libraries-how-to-enable"/>
<var name="id9" value="native-new-interoperability-mode-for-c-or-objective-c-libraries-report-your-results"/>
</include>

## Kotlin/Wasm

Kotlin 2.3.20 improves the performance of string operations, compilation time, and memory usage.
It also adds support for the experimental `@nativeInvoke` annotation, which lets you call Kotlin objects or classes like JavaScript functions.

### Improved string performance
<secondary-label ref="wasm"/>

Kotlin/Wasm now uses JS String builtins for operations on `kotlin.String` values.
This allows Kotlin/Wasm to benefit from JavaScript engine string optimizations in browsers and Wasm runtimes supporting the proposal.
The optimization applies to operations such as concatenation, interpolation, `StringBuilder.append()`, and number-to-string conversion.

It results in:

* Up to 4.6 times faster string interpolation in targeted benchmarks.
* Approximately 5% smaller Wasm binaries in the [KotlinConf application](https://github.com/JetBrains/kotlinconf-app) build.
* Around 1% median improvement across all Wasm benchmarks.
* At least 20% faster `StringBuilder.append()` and concatenation of `kotlin.String` instances in append-heavy workloads.

### Improved compilation time and memory optimizations
<secondary-label ref="wasm"/>

Kotlin 2.3.20 adds compiler optimizations that significantly reduce memory consumption during compilation, especially in large projects.
These optimizations also improve incremental build performance.

In our testing, we observed a 65% improvement in full build times and a 21% improvement in incremental builds.

### Support for `@nativeInvoke` annotation
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="wasm"/>

Kotlin 2.3.20 introduces support for the `@nativeInvoke` annotation for the `wasmJs` target.
This annotation allows you to treat a Kotlin object or a class as if it were a function in JavaScript.
It's designed to mark a member function of an `external` declaration (a class or an interface) as the "invoke operator" of a JavaScript object.

When you annotate a function, every call to that function in Kotlin is translated into a direct call of the JavaScript object itself:

```kotlin
import kotlin.js.nativeInvoke

@OptIn(ExperimentalWasmJsInterop::class)
external class JsAction {
    @nativeInvoke
    operator fun invoke(data: String)
}

fun main() {
    val action = JsAction() 
    action("Run task")
}
```

This is a temporary solution until a stable interoperability between Kotlin/Wasm and JavaScript is designed.
It may be modified or removed in future releases, and the compiler reports a warning when you use it.

For more information on the Kotlin/Wasm interoperability with JavaScript, see our [documentation](wasm-js-interop.md).

## Kotlin/JS

Kotlin 2.3.20 makes it possible to implement Kotlin interfaces from TypeScript and introduces experimental support for the SWC compilation platform.

###  Implementing Kotlin interfaces from JavaScript/TypeScript
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Kotlin 2.3.20 lifts the limitation on implementing Kotlin interfaces on the JavaScript/TypeScript side. Previously, it was only possible to export Kotlin interfaces to TypeScript as TypeScript interfaces; implementing them from TypeScript was forbidden.

Now you can implement any Kotlin interface in the following way:

```kotlin
// Kotlin
@JsExport
interface DataProcessor {
    suspend fun process(): String
}


@JsExport
fun registerProcessor(processor: DataProcessor) { ... }
```

```TypeScript
// TypeScript
import { DataProcessor, registerProcessor } from "my-kmp-library"


class JsonProcessor implements DataProcessor {
    readonly [DataProcessor.Symbol] = true


    async process(): Promise<string> {
        return "processed JSON data"
    }
}

registerProcessor(new JsonProcessor())
```

It's also possible to reuse Kotlin default implementations from TypeScript.
Even though TypeScript has no concept of default implementations in interfaces, you can work around that by delegating to the `DefaultImpls` object:

```kotlin
// Kotlin
@JsExport
interface Logger {
    fun log(): String = "[INFO] Default log entry"
    val prefix: String get() = "LOG"
}
```

```TypeScript
// TypeScript
import { Logger, acceptLogger } from "my-kmp-library"

class ConsoleLogger implements Logger {
    readonly [Logger.Symbol] = true


    // Delegates to the default method implementation
    log(): string {
        return Logger.DefaultImpls.log(this);
    }

    // Delegates to the default property implementation
    get prefix(): string {
        return Logger.DefaultImpls.prefix.get(this);
    }
}

acceptLogger(new ConsoleLogger())
```

#### How to enable {id="how-to-enable-implementing-interfaces-from-typescript"}

In your build file, add the new compiler option:

```kotlin
kotlin { 
    js {
        // ...
        generateTypeScriptDefinitions()
        compilerOptions {
            freeCompilerArgs.add("-Xenable-implementing-interfaces-from-typescript")
        }
    }
}
```

For more information on the `@JsExport` annotation, see our [documentation](js-to-kotlin-interop.md#jsexport-annotation).

### Support for SWC compilation platform
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Starting with Kotlin 2.3.20, Kotlin/JS supports the [SWC](https://swc.rs/) compilation platform.
It helps transpile newer versions of JavaScript/TypeScript code into older and more compatible JavaScript code.

Delegating code conversion to an external tool allows us to reduce the number of variants produced by the Kotlin/JS compiler and speed up compiler modernization, only focusing on supporting the latest JavaScript features.
Currently, the latest supported ECMAScript version is still `es2015`.

Additionally, delegating the transpilation work lets us improve the [inlined JavaScript](js-interop.md#inline-javascript) feature.
Currently, it only supports ES5 syntax (this will change in 2.4.0).
Supporting newer syntax while targeting lower versions would be challenging, as it would require the compiler to transpile the JS code within the inlined JS block itself.
With SWC, we'll be able to add modern JS syntax, and the tool will transpile the code to the required syntax for the end-user version.

Migrating to SWC also gives you an opportunity to implement a [browserlist](https://browsersl.ist/)-based DSL inside the Kotlin Gradle plugin.
This allows you to declare target browsers or environments instead of specific JS versions.

#### How to enable {id="how-to-enable-swc-compilation"}

In your `gradle.properties` file, add the following option:

```properties
kotlin.js.delegated.transpilation=true
```

We're planning to stabilize transpilation through SWC in future Kotlin releases.
After it becomes the default, the functionality of compiling multiple JS targets will be fully delegated from the Kotlin/JS compiler to the transpiler.

For more information on the SWC platform, see the official [documentation](https://swc.rs/docs/getting-started).

## Gradle

Kotlin 2.3.20 is compatible with new versions of Gradle and includes changes to Kotlin/JVM compilation in the Kotlin Gradle plugin.

### Compatibility with Gradle 9.3.0
<secondary-label ref="gradle"/>

Kotlin 2.3.20 is fully compatible with Gradle 7.6.3 through 9.3.0. You can also use Gradle versions up to the latest Gradle release.
However, be aware that doing so may result in deprecation warnings, and some new Gradle features might not work.

### Improvements to binary compatibility validation in KGP
<secondary-label ref="gradle"/>

Kotlin 2.2.0 brought support for [binary compatibility validation in the Kotlin Gradle plugin](gradle-binary-compatibility-validation.md) for the first time. Kotlin 2.3.20 adds two improvements.

First, the binary compatibility validation Gradle tasks no longer include "Legacy" in their names.
We made this change because the old naming convention confused Kotlin developers:

| Old name           | New name                 |
|--------------------|--------------------------|
| `checkLegacyAbi`   | `checkKotlinAbi`         |
| `updateLegacyAbi`  | `updateKotlinAbi`        |
| `dumpLegacyAbi`    | `internalDumpKotlinAbi`  |

The old task names still exist in Kotlin 2.3.20 to ease the transition to the new names.

Second, if you enable binary compatibility validation in your project, Gradle now runs the `checkKotlinAbi` task automatically when you run the `check` task.
Previously, Gradle didn't run the `checkKotlinAbi` task, even though the `check` task is supposed to run all verification tasks.
This led to inconsistent behavior in Gradle projects.

### Kotlin/JVM compilation uses Build tools API by default
<primary-label ref="experimental-general"/>
<secondary-label ref="gradle"/>

In Kotlin 2.3.20, Kotlin/JVM compilation in the Kotlin Gradle plugin uses the [Build tools API](build-tools-api.md)
(BTA) by default. This change in the internal compilation infrastructure enables faster development of build tool support for the Kotlin compiler.

If you notice any issues, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration).

## Maven

Kotlin 2.3.20 brings an important change to make it easier to set up your Maven projects.

<include from="whatsnew2320.md" element-id="simplified-setup-for-kotlin-projects-content">
<var name="id1" value="maven-simplified-setup-for-kotlin-projects"/>
<var name="id2" value="maven-simplified-setup-for-kotlin-projects-how-to-enable"/>
</include>

## Build tools API

Kotlin 2.3.20 introduces more changes for developers who want to integrate their build systems with the Kotlin compiler using the build tools API (BTA).

### Improvements to build operations

In this release, the BTA improves how build tools manage build operations.
Build operations let build tools interact with the Kotlin compiler.
Each build operation is an implementation of the [`BuildOperation`](https://github.com/JetBrains/kotlin/blob/master/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L25) interface.

You can now cancel build operations that implement the [`CancellableBuildOperation`](https://github.com/JetBrains/kotlin/blob/master/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L94) interface with the [`cancel()`](https://github.com/JetBrains/kotlin/blob/master/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/BuildOperation.kt#L108) function.

The `cancel()` function works on a "best effort" basis. This means the operation isn't guaranteed to be canceled.

For example:

```kotlin
val operation = toolchains.jvm.jvmCompilationOperationBuilder(sources, destination) {}

toolchains.createBuildSession().use {
    try {
        it.executeOperation(operation.build())
    } catch (e: OperationCancelledException) {
        println("Build operation has been cancelled.")
    }
}

// ...

// From another thread:
operation.cancel()
```

In addition, build operations are now more robust because you can create them so that they can't be changed once they start. To do this, a build tool must use the builder pattern:

1. Configure the object using a mutable builder.
2. Call the [`build()`](https://github.com/JetBrains/kotlin/blob/master/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/jvm/operations/JvmCompilationOperation.kt#L59) function to create an immutable instance of the object.

For example:

```kotlin
fun prepareBuildOperation(toolchains: KotlinToolchains, sources: List<Path>, destination: Path): JvmCompilationOperation {
    val builder = toolchains.jvm.jvmCompilationOperationBuilder(sources, destination)

    // Configure the operation using the builder
    builder.compilerArguments[CommonToolArguments.VERBOSE] = true
    builder[COMPILER_ARGUMENTS_LOG_LEVEL] = CompilerArgumentsLogLevel.ERROR

    // Return an immutable operation
    return builder.build()
}
```

### Consistent metric collection across build tools

Before Kotlin 2.3.20, the build metrics infrastructure was centered around Gradle, which influenced parts of the infrastructure, like metric names.
In addition, not all metrics were available for different [compiler execution strategies](compiler-execution-strategy.md).

In Kotlin 2.3.20, the BTA provides build-tool-agnostic metric collection for the JVM.
The BTA also introduces a consistent set of metrics, regardless of the compiler execution strategy.
Metrics that are specific to a particular compilation approach or compiler execution strategy are reported only when applicable.
For example, incremental compilation metrics are only available for incremental builds, and daemon-specific metrics are only available when using the Kotlin daemon.

Build tools can now configure a [`BuildMetricsCollector`](https://github.com/JetBrains/kotlin/blob/v2.3.20/compiler/build-tools/kotlin-build-tools-api/src/main/kotlin/org/jetbrains/kotlin/buildtools/api/trackers/BuildMetricsCollector.kt#L16) object for a build operation to capture build metrics that provide the user with insight into build performance:

```kotlin
val operation =
    kotlinToolchains.jvm.jvmCompilationOperationBuilder(sources, outputDirectory)
operation[BuildOperation.METRICS_COLLECTOR] = object : BuildMetricsCollector {
    override fun collectMetric(
        name: String,
        type: BuildMetricsCollector.ValueType,
        value: Long
    ) {
        // ...
    }
}
```

### Easier configuration of compiler plugins by build tools

In Kotlin 2.3.20, the BTA provides a new and simpler way for build tools to configure compiler plugins.
This approach allows build tools to propagate the configuration directly to their users.

Instead of configuring compiler plugins through the command line with experimental compiler options,
build tools can use the `kotlin.buildtools.api.arguments.CommonCompilerArguments.COMPILER_PLUGINS` option to configure a list of objects that represent compiler plugin configurations:

```kotlin
import org.jetbrains.kotlin.buildtools.api.KotlinToolchains
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPlugin
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPluginOption
import org.jetbrains.kotlin.buildtools.api.arguments.CommonCompilerArguments.Companion.COMPILER_PLUGINS
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPlugin
import org.jetbrains.kotlin.buildtools.api.arguments.CompilerPluginOption
import org.jetbrains.kotlin.buildtools.api.jvm.JvmPlatformToolchain
import org.jetbrains.kotlin.buildtools.api.jvm.JvmPlatformToolchain.Companion.jvm
import org.jetbrains.kotlin.buildtools.api.jvm.operations.JvmCompilationOperation
import java.nio.file.Path

...

val toolchains: KotlinToolchains = ...
val jvmToolchain: JvmPlatformToolchain = toolchains.jvm
val operation: JvmCompilationOperation.Builder = jvmToolchain.jvmCompilationOperationBuilder(...)
val noArgPluginClasspath: List<Path> = ...
operation.compilerArguments[COMPILER_PLUGINS] = listOf(
    CompilerPlugin(
        pluginId = "org.jetbrains.kotlin.noarg",
        classpath = noArgPluginClasspath,
        rawArguments = listOf(CompilerPluginOption("annotation", "GenerateNoArgsConstructor")),
        orderingRequirements = emptySet(),
    )
)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example code"}

## Breaking changes and deprecations

This section highlights important breaking changes and deprecations. For more information about deprecations in Kotlin 2.3.0 and 2.3.20, see the [Compatibility guide](compatibility-guide-23.md).

* In Kotlin 2.3.20, Kotlin/Wasm performs module initialization as part of the Wasm module's instantiation, instead of relying on external JavaScript to call an `_initialize()` function afterward.
  This change makes Kotlin/Wasm more independent and prepares it for the [ES module integration proposal](https://github.com/WebAssembly/esm-integration).

  If you use the [`@EagerInitialization`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-eager-initialization/) annotation, related code may fail if it runs before module initialization completes. We recommend avoiding using the `@EagerInitialization` annotation unless you truly need it.
* Experimental context receivers are no longer supported and are replaced by [context parameters](context-parameters.md).
* This release takes the next step in the [deprecation cycle for Intel chip-based Apple targets](whatsnew2220.md#deprecation-of-x86-64-apple-targets). Starting with Kotlin 2.3.20, we deprecate the `macosX64`, `tvosX64`, and `watchosX64` targets. We plan to completely remove support for these targets in the next Kotlin release.

  Because many third-party libraries still rely on the `iosX64` target, we'll keep it in support tier 3 for now. This means we don't guarantee CI testing, and we may not provide source and binary compatibility between different compiler releases. For more information about support tiers, see [Kotlin/Native target support](native-target-support.md).
* In Kotlin 2.3.20, stricter dependency matching in Kotlin Multiplatform can cause metadata compilation failures when dependency resolution differs between common and platform source sets. See the issue in [YouTrack](https://youtrack.jetbrains.com/issue/KT-84533#tldr-workaround) for details and a workaround.

## Documentation updates

We made the following documentation changes in the Kotlin ecosystem:

* [Kotlin roadmap](roadmap.md) – See the updated list of Kotlin's priorities on language and ecosystem evolution.
* [Upgrading to AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html) – Explore our advice for migrating your multiplatform projects with Android apps to AGP 9.
* [Configure CI for a KMP app](https://kotlinlang.org/docs/multiplatform/kmp-ci-tutorial.html) – Follow a tutorial to configure GitHub Actions for continuous integration in a multiplatform project.
* [Compose UI previews](https://kotlinlang.org/docs/multiplatform/compose-previews.html) – Learn how to preview composables in the IDE without running an emulator.
* [Handling web resources](https://kotlinlang.org/docs/multiplatform/compose-web-resources.html) – Find information about how to handle web resources in Compose Multiplatform.
* [Setting up the viewport](https://kotlinlang.org/docs/multiplatform/compose-css-styles.html) – Learn how to use the `ComposeViewport()` function to render your UI on an HTML canvas with Compose Multiplatform for web.
* [Custom compiler plugins](custom-compiler-plugins.md) – Learn how compiler plugins work and what you can do if you can't find one that fits your use case.
* [Application structure](https://ktor.io/docs/server-application-structure.html) – Choose the best application structure for your Ktor Server app.
* [HTTP request lifecycle](https://ktor.io/docs/server-http-request-lifecycle.html) – Learn how to cancel request processing in Ktor when a client disconnects using the HTTP request lifecycle.
* [Dependency injection](https://ktor.io/docs/server-dependency-injection.html) – Learn how to configure dependency injection in Ktor Server, with updated guidance and practical examples.
* [Exposed’s Spring Boot integration](https://www.jetbrains.com/help/exposed/spring-boot-integration.html#requirements) – Learn how to use Exposed with Spring Boot 3 and 4.