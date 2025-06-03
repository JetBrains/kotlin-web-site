[//]: # (title: Build tools API)

<primary-label ref="experimental-general"/>

<!-- Add diagram -->

Kotlin 2.2.0 introduces an experimental Build tools API (BTA) that simplifies how build systems integrate with the 
Kotlin compiler.

Traditionally, adding full Kotlin support to a build system (like incremental compilation, Kotlin compiler plugins, 
daemons, and Kotlin Multiplatform) required significant effort. The BTA aims to reduce this complexity by providing
a unified API between build systems and the Kotlin compiler ecosystem.

The BTA defines a single entry point that build systems can implement. This removes the need to deeply integrate with internal compiler details.

Currently, the BTA supports Kotlin/JVM **only**.

> The BTA itself is not yet publicly available for direct use in your own build tool integrations.
> If you're interested in the proposal or want to share feedback, see the [KEEP](https://github.com/Kotlin/KEEP/issues/421).
> 
{style="warning"}

## Integration with Gradle

The Kotlin Gradle plugin (KGP) already supports the BTA.

### How to enable

Add the following property to your `gradle.properties` file:

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```

### Configure different compiler versions

With the BTA, you can now use a different Kotlin compiler version than the version used by the KGP. This is useful when:

* You want to try new Kotlin features but haven't updated your build scripts yet.
* You need the latest plugin fixes but want to stay on an older compiler version for now.

Here's an example of how to configure this in your `build.gradle.kts` file:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
	kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
	mavenCentral()
}

kotlin {
	jvmToolchain(8)
	@OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
	compilerVersion.set("2.1.21") // <-- different version than 2.2.0
}
```

#### Compatible Kotlin compiler and KGP versions

The BTA supports:

* The three previous major Kotlin compiler versions.
* One major version forward.

For example, in KGP 2.2.0, the supported Kotlin compiler versions are:

* 2.1.x
* 2.0.x 
* 1.9.25
* Forward-compatible with 2.2.x and 2.3.x

#### Limitations

Using different compiler versions together with compiler plugins may lead to Kotlin compiler exceptions. The Kotlin team
plans to address this in future Kotlin releases.

### Enable incremental compilation with "in process" compiler execution strategy

The KGP supports three [compiler execution strategies](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
Ordinarily, the "in-process" strategy (which runs the compiler in the Gradle daemon) doesn't support incremental compilation.

With the BTA, the "in-process" strategy now supports incremental compilation. To enable it, add the following property to
your `gradle.properties` file:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Integration with Maven

From Kotlin 2.2.0, the BTA is enabled by default in the `kotlin-maven-plugin`.

Although the BTA doesn't provide direct benefits for Maven users yet, it provides a solid foundation for developing features like:

* [Kotlin daemon support](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default)
* [Incremental compilation stabilization](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)