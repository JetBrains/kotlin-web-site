[//]: # (title: Gradle best practices)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) is a build system used by many Kotlin projects to automate
and manage the build process.

Getting the best out of Gradle is essential to help you spend less time managing and waiting for builds, and more time 
coding. Here we provide a set of best practices split into two key areas: **organizing** and **optimizing** your projects.

## Organize

This section focuses on structuring your Gradle projects to improve clarity, maintainability, and scalability.

### Use Kotlin DSL

Use Kotlin DSL instead of the traditional Groovy DSL. You avoid learning another language and gain the benefits of strict
typing. Strict typing lets IDEs provide better support for refactoring and auto-completion, making development more efficient.

Find more information in [Gradle’s Kotlin DSL primer](https://docs.gradle.org/current/userguide/kotlin_dsl.html).

Read Gradle's [blog](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds) about Kotlin DSL becoming
the default for Gradle builds.

### Use a version catalog

Use a version catalog in a `libs.versions.toml` file to centralize dependency management. This enables you to define and 
reuse versions, libraries, and plugins consistently across projects.

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

With the following dependency added to your `build.gradle.kts` file:

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

Learn more in Gradle's documentation about [Dependency management basics](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog).

### Use convention plugins

<primary-label ref="advanced"/>

Use convention plugins to encapsulate and reuse common build logic across multiple build files. Moving shared configurations
into a plugin helps simplify and modularize your build scripts.

Although the initial setup may be time-consuming, it's easy to maintain and add new build logic once you complete it.

Learn more in Gradle's documentation about [Convention plugins](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins).

## Optimize

This section provides strategies to enhance the performance and efficiency of your Gradle builds.

### Use local build cache

Use a local build cache to save time by reusing outputs produced by other builds. The build cache can retrieve outputs from 
any earlier build that you have already created.

Learn more in Gradle's documentation about their [Build cache](https://docs.gradle.org/current/userguide/build_cache.html).

### Use configuration cache

> The configuration cache doesn't support all core Gradle plugins yet. For the latest information, see Gradle's
> [table of supported plugins](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core).
>
{style="note"}

Use the configuration cache to significantly improve build performance by caching the result of the configuration phase
and reusing it for subsequent builds. If Gradle detects no changes in the build configuration or related
dependencies, it skips the configuration phase.

Learn more in Gradle's documentation about their [Configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html).

### Improve build times for multiple targets

When your multiplatform project includes multiple targets, tasks like `build` and `assemble` can compile the same code 
multiple times for each target, leading to longer compilation times.

If you're actively developing and testing a specific platform, run the corresponding `linkDebug*` task instead.

For more information, see [Tips for improving compilation time](native-improving-compilation-time.md#gradle-configuration).

### Migrate from kapt to KSP

If you're using a library that relies on the [kapt](kapt.md) compiler plugin, check whether you can switch to using the [Kotlin Symbol Processing (KSP) API](ksp-overview.md)
instead. The KSP API improves build performance by reducing annotation processing time. KSP is faster and more efficient
than kapt, as it processes source code directly without generating intermediary Java stubs.

For guidance on the migration steps, see Google's [migration guide](https://developer.android.com/build/migrate-to-ksp).

To learn more about how KSP compares to kapt, check out [why KSP](ksp-why-ksp.md).

### Use modularization

<primary-label ref="advanced"/>

> Modularization only benefits projects of moderate to large size. It doesn't provide advantages for projects based
> on a microservices architecture.
>
{style="note"}

Use a modularized project structure to increase build speed and enable easier parallel development. Structure your
project into one root project and one or more subprojects. If changes only affect one of the subprojects, Gradle
rebuilds only that specific subproject.

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

Learn more in Gradle's documentation about [Structuring projects with Gradle](https://docs.gradle.org/current/userguide/multi_project_builds.html).

### Set up CI/CD
<primary-label ref="advanced"/>

Set up a CI/CD process to significantly reduce build time by using incremental builds and caching dependencies. Add 
persistent storage or use a remote build cache to see these benefits. This process doesn't have to be time-consuming, 
as some providers, like [GitHub](https://github.com/features/actions), offer this service almost out of the box.

Explore Gradle's community cookbook on [Using Gradle with Continuous Integration systems](https://cookbook.gradle.org/ci/).

### Use remote build cache
<primary-label ref="advanced"/>

Like the [local build cache](#use-local-build-cache), the remote build cache helps you save time by reusing outputs
from other builds. It can retrieve task outputs from any earlier build that anyone has already run, not just the last one.

The remote build cache uses a cache server to share task outputs across builds. For example, in a development environment
with a CI/CD server, all builds on the server populate the remote cache. When you check out the main branch to 
start a new feature, you can immediately access incremental builds.

Keep in mind that a slow internet connection might make transferring cached results slower than running tasks locally.

Learn more in Gradle's documentation about their [Build cache](https://docs.gradle.org/current/userguide/build_cache.html).