[//]: # (title: Build tools API)

<primary-label ref="beta"/>

<tldr>The BTA supports Kotlin/JVM, Kotlin/JS, and Kotlin/Wasm.<p/>  It currently doesn't support Kotlin/Native.</tldr>

Kotlin has the Build tools API (BTA) that simplifies how build systems integrate with the 
Kotlin compiler.

Adding full Kotlin support to a build system (like incremental compilation, Kotlin compiler plugins, 
daemons, and Kotlin Multiplatform) requires significant effort. The BTA aims to reduce this complexity by providing
a unified API between build systems and the Kotlin compiler ecosystem.

The BTA defines a single entry point that build systems can implement. This removes the need to deeply integrate with internal compiler details.

The stability level differs per target: the BTA is Beta for Kotlin/JVM, and Alpha for Kotlin/JS and Kotlin/Wasm.
For more details, see [](components-stability.md#build-tools-api-bta). Using the BTA requires an opt-in with
`@OptIn(ExperimentalBuildToolsApi::class)`.

> If you're interested in the proposal or want to share feedback, see the [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).
> Follow the status of its implementation in [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255).
> 
{style="note"}

## Integration with Gradle

The Kotlin Gradle plugin (KGP) uses the BTA by default when compiling:

* Kotlin/JVM
* Kotlin/JS
* Kotlin metadata
* Kotlin/Wasm

> We'd appreciate your feedback on your experience with the KGP in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574).
> 
{style="note"}

### Configure different compiler versions

With the BTA, you can now use a different Kotlin compiler version than the version used by the KGP. This is useful when you:

* Want to try new Kotlin features but haven't updated your build scripts yet.
* Need the latest plugin fixes but want to stay on an older compiler version for now.

For a Kotlin/JVM project, set the `compilerVersion` property in your `build.gradle.kts`:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.4.20"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.3.21") // different version than 2.4.20
}
```

If your project contains Kotlin/JS or Kotlin/Wasm targets, you also need to configure the [`coreLibrariesVersion`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl/-kotlin-top-level-extension-config/core-libraries-version.html)
property to match the `compilerVersion`:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("multiplatform") version "2.4.20"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

// Keep the compiler and core libraries on the same version
val kotlinCompilerVersion = "2.5.0"

kotlin {
    js {
        browser()
    }

    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set(kotlinCompilerVersion) // different version
                                               // than 2.4.20

    // Aligns kotlin-stdlib and dependencies declared with kotlin()
    coreLibrariesVersion = kotlinCompilerVersion

    sourceSets {
        commonTest.dependencies {
            // Resolved to kotlinCompilerVersion through coreLibrariesVersion
            implementation(kotlin("test"))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example with Kotlin/JS target"}

> The `coreLibrariesVersion` property doesn't override dependencies that declare an explicit version, such as in a
> version catalog. Set these dependencies to the same version as `compilerVersion`.
>
{style="note"}

If you use compiler plugins with any target, you currently need to align their versions separately. The following example
configures all `org.jetbrains.kotlin` dependencies in configurations whose names start with `kotlinCompilerPluginClasspath`
to use the same version as `compilerVersion`:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.4.20"
    kotlin("plugin.serialization") version "2.4.20"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(17)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.3.21") // different version 
                                  // than 2.4.20
}

@OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
configurations
    .matching { it.name.startsWith("kotlinCompilerPluginClasspath") }
    .configureEach {
        resolutionStrategy.eachDependency {
            if (requested.group == "org.jetbrains.kotlin") {
                useVersion(kotlin.compilerVersion.get())
            }
        }
    }
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example with compiler plugin"}

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

The KGP supports three [compiler execution strategies](compiler-execution-strategy.md).
Ordinarily, the "in-process" strategy (which runs the compiler in the Gradle daemon) doesn't support incremental compilation.

With the BTA, the "in-process" strategy now supports incremental compilation. To enable it, add the following property to
your `gradle.properties` file:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## Integration with Maven

The BTA enables the [`kotlin-maven-plugin`](maven.md) to support the [Kotlin daemon](kotlin-daemon.md), which is the default
[compiler execution strategy](maven-kotlin-compiler.md#choose-execution-strategy). The `kotlin-maven-plugin` uses BTA by default,
so there's no need to configure anything.

The BTA makes it possible to deliver more features like [Incremental compilation stabilization](https://youtrack.jetbrains.com/issue/KT-77086) in the future.
