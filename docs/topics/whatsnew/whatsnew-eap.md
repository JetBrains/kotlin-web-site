[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

<primary-label ref="eap"/>

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out! Here are some details of this EAP release:

* **Kotlin compiler plugin**: [Lombok is Alpha](#lombok-is-now-alpha) and [improved JPA support in the `kotlin.plugin.jpa` plugin](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Kotlin/Native**: [New interoperability mode for C and Objective-C libraries](#new-interoperability-mode-for-c-or-objective-c-libraries) and [concurrent marking in the garbage collector is enabled by default for 2.3.20-Beta releases](#default-concurrent-marking-in-garbage-collector)
* **Gradle**: [Compatibility with Gradle 9.3.0](#gradle-compatibility-with-gradle-9-3-0) and [Kotlin/JVM compilation uses BTA by default](#gradle-kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**: [Simplified setup for Kotlin projects](#maven-simplified-setup-for-kotlin-projects)
* **Standard library**: [New API for creating immutable copies of `Map.Entry`](#standard-library-new-api-for-creating-immutable-copies-of-map-entry)

> For information about the Kotlin release cycle, see [Kotlin release process](releases.md).
>
{style="tip"}

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin compiler plugins

### Lombok is now Alpha
<primary-label ref="alpha"/>

Kotlin 1.5.20 introduced the experimental [Lombok compiler plugin](lombok.md), which lets you generate and use [Java's Lombok declarations](https://projectlombok.org/) in modules that mix Kotlin and Java code.

In %kotlinEapVersion%, the Lombok compiler plugin is promoted to [Alpha](components-stability.md#stability-levels-explained) because we plan to productize this functionality, but it's still under development.

### Improved JPA support in the `kotlin.plugin.jpa` plugin

The `kotlin.plugin.jpa` plugin now automatically applies the [`all-open`](all-open-plugin.md) compiler plugin with the newly added built-in JPA preset,
in addition to the existing [`no-arg`](no-arg-plugin.md) support.

Previously, using `kotlin("plugin.jpa")` enabled only the `no-arg` plugin with JPA presets. And when working with JPA entities, you had to explicitly apply and configure the `all-open` plugin to make JPA entity classes `open`.

Starting with %kotlinEapVersion%:

* The `all-open` compiler plugin provides a JPA preset.
* The Gradle `org.jetbrains.kotlin.plugin.jpa` plugin automatically applies the `org.jetbrains.kotlin.plugin.all-open` plugin with the JPA preset enabled.
* The [Maven JPA setup](no-arg-plugin.md#jpa-support) enables `all-open` with the JPA preset by default.
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


## Kotlin/Native

### New interoperability mode for C or Objective-C libraries
<primary-label ref="experimental-opt-in"/>

If you use C or Objective-C libraries in your Kotlin Multiplatform libraries or applications, we invite you to test the new interoperability mode and share the results.

In general, Kotlin/Native enables importing C and Objective-C libraries into Kotlin. However, for Kotlin Multiplatform libraries, this functionality is currently [affected](native-lib-import-stability.html#stability-of-c-and-objective-c-library-import) by the KMP compatibility issues with older compiler versions.

In other words, if you publish a Kotlin Multiplatform library compiled with one Kotlin version, importing C or Objective-C libraries might make it impossible to use that Kotlin library in projects with an earlier Kotlin version.

To address this and other issues, the Kotlin team has been revising the interoperability mechanism used under the hood. Starting with Kotlin 2.3.20-Beta1, you can try the new mode through a compiler option.

#### How to try

In your Gradle build file, check whether you have a `cinterops {}` block or a `pod()` dependency. If these are present, your project uses C or Objective-C libraries.
Ensure your project uses `2.3.20-Beta1` or a later version.
In the same build file, add the `-Xccall-mode` compiler option to the cinterop tool invocation:

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

Build and test your project as usual by running unit tests, the app, and so on.

You can also use the `--continue` option to allow Gradle to continue executing tasks even after failures, helping to find more problems at once.

> Do **not** publish libraries compiled with the new interoperability mode yet, as it's still [Experimental](components-stability.md#stability-levels-explained).
>
{style="warning"}

#### Report your results

The new interoperability mode is supposed to be a drop-in replacement in most cases.
We're planning to eventually enable it by default. But to achieve that, we need to ensure it works as well as possible and test it on a wide range of projects, because:

* Some C and Objective-C declarations aren't supported yet in the new mode (mostly because they conflict with the compatibility issues). We'd like to better understand the real-world impact of this and prioritize future steps accordingly.
* There may be bugs or things we didn't consider. Testing languages with numerous interacting features is challenging, and testing the interaction between languages (each with a unique set of features) is even more so.

Help us examine real-world projects and identify challenging cases.
Whether you encounter any issues or not, share your results in the comments to [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-83218).

### Default concurrent marking in garbage collector
<primary-label ref="experimental-opt-in"/>

Kotlin 2.0.20 [introduced experimental support](whatsnew2020.md#concurrent-marking-in-garbage-collector) for CMS, also known as concurrent mark and sweep in the garbage collector (GC). Since then, the Kotlin team has fixed several critical and major problems and already uses CMS in [Swift export](native-swift-export.md) in its default setup.

As the next step, we're enabling CMS by default for all projects in both Kotlin 2.3.20-Beta1 and Beta2 releases to gather more feedback and ensure we've discovered all the issues.

Compared to the current default parallel mark concurrent sweep (PMCS) setup in the garbage collector, where application threads must be paused while the GC marks objects in the heap, CMS allows the marking phase to run concurrently with application threads.

This greatly affects the duration of GC pauses and app responsiveness, which is important for the performance of latency-critical applications. CMS has already shown its effectiveness by significantly improving benchmarks on UI applications built with [Compose Multiplatform](https://blog.jetbrains.com/kotlin/2024/10/compose-multiplatform-1-7-0-released/#performance-improvements-on-ios).

#### Leave feedback
Although CMS GC is the default in this release, it's still [Experimental](components-stability.md#stability-levels-explained). In some cases, it may lead to runtime crashes, throughput issues, or increased memory consumption.

This is why we're taking a cautious approach here: we're enabling CMS by default only in Beta releases to gather additional feedback. It will be rolled back to PMCS in Kotlin 2.3.20-RC and final releases.

If you observe regressions, switch to PMCS manually. To do that, set the following [binary option](native-binary-options.md) in your `gradle.properties` file:

```none
kotlin.native.binary.gc=pmcs
```

Report any problems to our issue tracker [YouTrack](https://kotl.in/issue).

## Standard library: New API for creating immutable copies of `Map.Entry`
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% introduces the `Map.Entry.copy()` extension function for creating an immutable copy of a [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/).
This function allows you to reuse entries obtained from [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) after modifying the map by copying them first.

`Map.Entry.copy()` is [Experimental](components-stability.md#stability-levels-explained). To opt in, use the `@OptIn(ExperimentalStdlibApi::class)` annotation or the compiler option `-opt-in=kotlin.ExperimentalStdlibApi`.

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

## Gradle: Compatibility with Gradle 9.3.0

Kotlin %kotlinEapVersion% is fully compatible with Gradle 7.6.3 through 9.3.0. You can also use Gradle versions up to the latest Gradle release. However, be aware that doing so may result in deprecation warnings, and some new Gradle features might not work.

## Gradle: Kotlin/JVM compilation uses Build tools API by default
<primary-label ref="experimental-general"/>

In Kotlin %kotlinEapVersion%, Kotlin/JVM compilation in the Kotlin Gradle plugin uses the [Build tools API](build-tools-api.md)
(BTA) by default. This change in the internal compilation infrastructure enables faster development of build tool support for the Kotlin compiler.

If you notice any issues, share your feedback in our [issue tracker](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration).

## Maven: Simplified setup for Kotlin projects

Kotlin %kotlinEapVersion% makes it easier to set up Kotlin in Maven projects. Now Kotlin supports automatic configuration of source roots and Kotlin's standard library.

With the new configuration, when you create a new Kotlin project with the Maven build system or introduce Kotlin to your existing Java Maven project, you don't need to manually create source roots or add the `kotlin-stdlib` dependency in your POM build file.

### How to enable

In your `pom.xml` file, add `<extensions>true</extensions>` to the `<build><plugins>` section of the Kotlin Maven plugin:

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinEapVersion%</version>
             <extensions>true</extensions> <!-- Add this extension  -->
         </plugin>
    </plugins>
</build>
```

The new extension automatically:

* Creates `src/main/kotlin` and `src/test/kotlin` directories without changing existing Kotlin or Java source roots.
* Adds the `kotlin-stdlib` dependency unless it's already defined.

You can also opt out of the automatic addition of Kotlin's standard library. For that, add the following `<properties>` section to the Kotlin Maven plugin entry:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>%kotlinEapVersion%</version>
    <extensions>true</extensions>
    <properties>
        <!-- Disable smart defaults via property -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</plugin>

```

For more information on Maven configuration in Kotlin projects, see [Configure a Maven project](maven-configure-project.md).
