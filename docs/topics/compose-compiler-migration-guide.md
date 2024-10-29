[//]: # (title: Compose compiler migration guide)

The Compose compiler is supplemented by a Gradle plugin, which simplifies setup and offers
easier access to compiler options.
When applied with the Android Gradle plugin (AGP), this Compose compiler plugin will override the coordinates
of the Compose compiler supplied automatically by AGP.

The Compose compiler has been merged into the Kotlin repository since Kotlin 2.0.0.
This helps smooth the migration of your projects to Kotlin 2.0.0 and later, as the Compose compiler ships
simultaneously with Kotlin and will always be compatible with Kotlin of the same version.

To use the new Compose compiler plugin in your project, apply it for each module that uses Compose.
Read on for details on how to [migrate a Jetpack Compose project](#migrating-a-jetpack-compose-project). For a Compose Multiplatform project, 
refer to the [multiplatform migration guide](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project).

## Migrating a Jetpack Compose project

When migrating to Kotlin 2.0.0 or newer from 1.9, you should adjust your project configuration depending on the way you deal with
the Compose compiler. We recommend using the Kotlin Gradle plugin and the Compose compiler Gradle plugin
to automate configuration management.

### Managing the Compose compiler with Gradle plugins

For Android modules:

1. Add the Compose compiler Gradle plugin to the [Gradle version catalog](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml):

 ```
 [versions]
 # ...
 kotlin = "%kotlinVersion%"
 
 [plugins]
 # ...
 org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
 compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
 ```

2. Add the Gradle plugin to the root `build.gradle.kts` file:

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler) apply false
 }
 ```

3. Apply the plugin to every module that uses Jetpack Compose:

 ```kotlin
 plugins {
     // ...
     alias(libs.plugins.compose.compiler)
 }
 ```

4. If you are using compiler options for the Jetpack Compose compiler, set them in the `composeCompiler {}` block.
   See [the list of compiler options](compose-compiler-options.md) for reference.

5. If you reference Compose compiler artifacts directly, you can remove these references and let the Gradle plugins
   take care of things.

### Using Compose compiler without Gradle plugins

If you are not using Gradle plugins to manage the Compose compiler, update any direct references to old Maven
artifacts in your project:

* Change `androidx.compose.compiler:compiler` to `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* Change `androidx.compose.compiler:compiler-hosted` to `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## What's next

* See [Google's announcement](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html) about the Compose compiler moving to the Kotlin repository.
* If you are using Jetpack Compose to build an Android app, check out [our guide on how to make it multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html).