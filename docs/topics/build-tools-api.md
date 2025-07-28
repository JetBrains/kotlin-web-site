[//]: # (title: Build tools API)

<primary-label ref="experimental-general"/>

<tldr>Currently, the BTA supports Kotlin/JVM only.</tldr>

Kotlin 2.2.0 introduces an experimental Build tools API (BTA) that simplifies how build systems integrate with the 
Kotlin compiler.

Previously, adding full Kotlin support to a build system (like incremental compilation, Kotlin compiler plugins, 
daemons, and Kotlin Multiplatform) required significant effort. The BTA aims to reduce this complexity by providing
a unified API between build systems and the Kotlin compiler ecosystem.

The BTA defines a single entry point that build systems can implement. This removes the need to deeply integrate with internal compiler details.

> The BTA itself is not yet publicly available for direct use in your own build tool integrations.
> If you're interested in the proposal or want to share feedback, see the [KEEP](https://github.com/Kotlin/KEEP/issues/421).
> Follow the status of its implementation in [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255).
> 
{style="warning"}

## Integration with Gradle

The Kotlin Gradle plugin (KGP) has experimental support for the BTA, and you need to opt in to use it.

> We'd appreciate your feedback on your experience with the KGP in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574).
> 
{style="note"}

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

* 1.9.25
* 2.0.x
* 2.1.x
* 2.2.x
* 2.3.x

#### Limitations

Using different compiler versions together with compiler plugins may lead to Kotlin compiler exceptions. The Kotlin team
plans to address this in future Kotlin releases.

### Enable incremental compilation with "in process" strategy

The KGP supports three [compiler execution strategies](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
Ordinarily, the "in-process" strategy (which runs the compiler in the Gradle daemon) doesn't support incremental compilation.

With the BTA, the "in-process" strategy now supports incremental compilation. To enable it, add the following property to
your `gradle.properties` file:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Integration with Maven

From Kotlin 2.2.0, the BTA is enabled by default in the [`kotlin-maven-plugin`](maven.md).

Although the BTA doesn't give direct benefits for Maven users yet, it provides a solid foundation for developing features like:

* [Kotlin daemon support](https://youtrack.jetbrains.com/issue/KT-77587)
* [Incremental compilation stabilization](https://youtrack.jetbrains.com/issue/KT-77086)