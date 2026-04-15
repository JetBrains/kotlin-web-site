[//]: # (title: Migrate from kapt to KSP)
[//]: # (description: Guide on how to migrate processors from kapt to KSP.)

[Kapt](kapt.md) (Kotlin Annotation Processing Tool) lets you use Java annotation processors in Kotlin. 
It works by translating Kotlin source code into Java "stubs" and then running 
the annotation processors on those stubs. This process is expensive, causes a significant increase in build time, 
and loses some Kotlin-specific features in translation.

[KSP](ksp-overview.md) (Kotlin Symbol Processing) is an alternative to kapt designed specifically for Kotlin. KSP understands all
Kotlin features and analyzes the source code directly, reducing build speed.

To check if the processors in your project support KSP, see the list of [supported libraries](ksp-overview.md#supported-libraries)
or consult their documentation.

> Kapt and KSP can run alongside each other, so you can migrate your project in stages, one library or module at a time.
> 
{style="note"}

## Add the KSP plugin to your project

Add KSP to the `plugins {}` block in the project-level `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false 
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false 
}
```

</tab>
</tabs>

> To find the latest version of KSP, check the GitHub [Releases](https://github.com/google/ksp/releases).
> 
{style="tip"}

## Update your processor

Find the module that uses the processor you want to migrate. In the module's `build.gradle(.kts)` file:

1. Add KSP to the `plugins {}` block:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>
   
2. Replace `kapt` with `KSP` in the `dependencies {}` block:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        ksp("com.google.dagger:dagger-compiler:2.48") // KSP processor dependency
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy"> 

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'
        // KSP processor dependency:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>
    

> For most libraries, this replacement is enough. Check each library's
> documentation to see if you need to make any additional changes.
> 
{style="note"}

## Remove the kapt plugin

After migrating all your processors to KSP, you can safely remove the kapt plugin from all build files:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   // Delete this line:
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Delete this line:
    id 'org.jetbrains.kotlin.kapt' // Delete this line
}
```

</tab>
</tabs>

Delete any leftover kapt configurations if you have them.