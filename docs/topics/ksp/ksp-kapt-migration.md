[//]: # (title: Migrate from kapt to KSP)
[//]: # (description: Learn how to migrate annotation processors in your Kotlin project from kapt to KSP.)

In this guide, you will learn how to migrate your annotation processors from [kapt](kapt.md) to [KSP](ksp-overview.md)
so that your project can take full advantage of Kotlin features and improve build performance.

[kapt](kapt.md) (Kotlin Annotation Processing Tool) is a useful tool that lets you use Java annotation processors in Kotlin. 
It works by translating Kotlin source code into Java "stubs" and then running 
the annotation processors on those stubs. However, this process is expensive, significantly increases build time, 
and loses some Kotlin-specific features in translation.

In contrast, [KSP](ksp-overview.md) (Kotlin Symbol Processing) is an alternative to kapt designed specifically for Kotlin. KSP understands all
Kotlin features and analyzes the source code directly, reducing build time.

Before you begin, check whether the processors in your project support KSP. See the list of [supported libraries](ksp-overview.md#supported-libraries)
or consult their documentation.

> KSP and kapt can run alongside each other, so you can migrate your project in stages, one library or module at a time.
> 
{style="note"}

## Add the KSP plugin to your project

Add KSP to the `plugins {}` block in the project-level `build.gradle(.kts)` file:

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
   
2. In the `dependencies {}` block, replace `kapt` with `ksp`:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")
        
        // KSP processor dependency:
        ksp("com.google.dagger:dagger-compiler:2.48") 
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
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

Delete any leftover kapt configurations if you have them.

## What's next?

* Learn how to make your own KSP-based annotation processor in [Getting started with KSP](ksp-quickstart.md#create-your-own-processor)
* Explore example projects that use KSP in the [KSP repository](https://github.com/google/ksp/tree/main/examples).
* Read more about KSP in the [Overview](ksp-overview.md).