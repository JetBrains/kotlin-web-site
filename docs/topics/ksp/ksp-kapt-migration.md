[//]: # (title: Migrate from kapt to KSP)

[Kapt](kapt.md) (Kotlin Annotation Processing Tool) was created to allow Java annotation processors to be used in Kotlin. 
It works by first translating the Kotlin source code into Java "stubs", and then running 
the annotation processors on those stubs. This is an expensive process that causes a significant increase in build time, 
and some Kotlin specific features are lost in translation.

[KSP](ksp-overview.md) (Kotlin Symbol Processing) is an alternative to kapt, designed specifically for Kotlin. KSP understands all Kotlin 
features and can analyze it directly, greatly increasing build speed.

To see if the processors in your project support KSP, check the [supported libraries](ksp-overview.md#supported-libraries)
or their own documentation.

You can migrate your project in stages, one library or module at a time, as kapt and KSP can run alongside each other.

## Add the KSP plugin to your project

In the top-level `build.gradle(.kts)`, add KSP to the `plugins {}` block:

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.3.6" apply false 
}
```
> Find out what the latest version of the plugin is in the [KSP repository](https://github.com/google/ksp/releases)
>
{style=”tip”}

Next, enable KSP in the module that uses the library you want to migrate. In the module-level `build.gradle(.kts)`:

```kotlin
plugins {
    id("com.google.devtools.ksp")
}
```

## Update your project’s dependencies

In the module-level `build.gradle(.kts)` file, replace `kapt` with `KSP` in the dependency declaration:

```kotlin
dependencies {
    implementation("com.google.dagger:dagger:2.48")
    // kapt("com.google.dagger:dagger-compiler:2.48")
    ksp("com.google.dagger:dagger-compiler:2.48") // KSP processor dependency
}
```

> For most libraries, this replacement is enough. Make sure to consult each specific library's
> documentation to see if more changes are needed.
{style="note"}

## Remove the kapt plugin

Once all your dependencies are included with KSP, you can safely remove the kapt plugin from all build files:

```kotlin
plugins {
   id("org.jetbrains.kotlin.kapt") // Delete this line
}
```

Make sure to delete all leftover kapt configurations, if applicable.