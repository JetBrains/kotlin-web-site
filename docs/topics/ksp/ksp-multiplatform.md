[//]: # (title: KSP with Kotlin Multiplatform)
[//]: # (description: Add KSP to a Kotlin multiplatform project)

This document explains how to use Kotlin Symbol Processing (KSP) in a Kotlin Multiplatform project. To get started with 
Kotlin Multiplatform, see the [Kotlin Multiplatform overview](https://kotlinlang.org/docs/multiplatform/kmp-overview.html).

To use KSP-based processors in a multiplatform project, assign a processor to each target that needs symbol processing:

```
add(ksp<Target>, <processor>)
```

`<processor>` is a Gradle project path. It can be:

* the specific folder in your project that contains the logic for your symbol processor.
* an external processor such as Room or Dagger.

> For a full list of targets, see [Multiplatform Gradle DSL reference](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets) 
> and [Kotlin/Native supported targets](https://kotlinlang.org/docs/native-target-support.html).
>
{style=”tip”}

For example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

// This example demonstrates various ways to declare KSP dependencies
// in a Kotlin project, covering multiplatform setups.

plugins {
    // Apply the KSP plugin
    id("com.google.devtools.ksp") version "%kspVersion%"     
    // Apply other plugins as needed (e.g., kotlin("jvm"), 
    // kotlin("multiplatform"), etc.)
}

dependencies {
    // ===============================================================
    // 1. MAIN COMPILATIONS (Production Code)
    // ===============================================================

    // In KMP, the global 'ksp' configuration is deprecated to avoid running 
    // processors on targets unnecessarily. Use target-specific configurations instead.

    // Local processor for a specific target (JVM)
    add("kspJvm", project(":test-processor"))

    // External processor for a specific target (Android)
    add("kspAndroid", "androidx.room:room-compiler:2.6.1")

    // Target with multiple processors (JVM)
    add("kspJvm", project(":another-local-processor"))
    add("kspJvm", "com.example:external-processor:1.0")

    // Different processors for different targets
    add("kspJvm", project(":jvm-only-processor"))
    add("kspJs", project(":js-only-processor"))

    // iOS Targets
    // KSP configurations are per-compilation target. Shared intermediate 
    // source sets like 'iosMain' do NOT have their own KSP configuration.
    // You must specify them for each iOS target individually.
    add("kspIosX64", project(":test-processor"))
    add("kspIosArm64", project(":test-processor"))
    add("kspIosSimulatorArm64", project(":test-processor"))
    
    // TIP: If you have many iOS targets, you can avoid repetition by looping:
    kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
        add("ksp${target.name.capitalize()}", project(":test-processor"))
    }
    
    // ===============================================================
    // 2. TEST COMPILATIONS
    // ===============================================================

    // Specify KSP for the test compilation of each target:
    add("kspJvmTest", project(":test-processor"))
    add("kspJsTest", project(":test-processor"))
    add("kspIosX64Test", project(":test-processor"))


    // ===============================================================
    // 3. NEW ANDROID KOTLIN MULTIPLATFORM (Android-KMP)
    // Using id("com.android.kotlin.multiplatform.library")
    // ===============================================================
    
    // Main Android compilation (Target name is 'android')
    add("kspAndroid", project(":test-processor"))
    
    // Host Tests / Device Tests:
    // KSP generates these configurations dynamically based on the source set names.
    // The test source sets are named 'androidHostTest', 'androidDeviceTest', etc.
    
    add("kspAndroidHostTest", project(":test-processor"))
    add("kspAndroidDeviceTest", project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
// build.gradle

// This example demonstrates various ways to declare KSP dependencies
// in a Kotlin project, covering multiplatform setups.

plugins {
    // Apply the KSP plugin
    id 'com.google.devtools.ksp' version '%kspVersion%'

    // Apply other plugins as needed (e.g., kotlin("jvm"),
    // kotlin("multiplatform"), etc.)
}

dependencies {
    // ===============================================================
    // 1. MAIN COMPILATIONS (Production Code)
    // ===============================================================

    // In KMP, the global 'ksp' configuration is deprecated to avoid running
    // processors on targets unnecessarily. Use target-specific configurations instead.

    // Local processor for a specific target (JVM)
    add('kspJvm', project(':test-processor'))

    // External processor for a specific target (Android)
    add('kspAndroid', 'androidx.room:room-compiler:2.6.1')

    // Target with multiple processors (JVM)
    add('kspJvm', project(':another-local-processor'))
    add('kspJvm', 'com.example:external-processor:1.0')

    // Different processors for different targets
    add('kspJvm', project(':jvm-only-processor'))
    add('kspJs', project(':js-only-processor'))

    // iOS Targets
    // KSP configurations are per-compilation target. Shared intermediate
    // source sets like 'iosMain' do NOT have their own KSP configuration.
    // You must specify them for each iOS target individually.
    add('kspIosX64', project(':test-processor'))
    add('kspIosArm64', project(':test-processor'))
    add('kspIosSimulatorArm64', project(':test-processor'))

    // TIP: If you have many iOS targets, you can avoid repetition by looping:
    kotlin.targets.findAll { it.name.startsWith('ios') }.each { target ->
        add("ksp${target.name.capitalize()}", project(':test-processor'))
    }

    // ===============================================================
    // 2. TEST COMPILATIONS
    // ===============================================================

    // Specify KSP for the test compilation of each target:
    add('kspJvmTest', project(':test-processor'))
    add('kspJsTest', project(':test-processor'))
    add('kspIosX64Test', project(':test-processor'))

    // ===============================================================
    // 3. NEW ANDROID KOTLIN MULTIPLATFORM (Android-KMP)
    // Using id("com.android.kotlin.multiplatform.library")
    // ===============================================================

    // Main Android compilation (Target name is 'android')
    add('kspAndroid', project(':test-processor'))

    // Host Tests / Device Tests:
    // KSP generates these configurations dynamically based on the source set names.
    // The test source sets are named 'androidHostTest', 'androidDeviceTest', etc.

    add('kspAndroidHostTest', project(':test-processor'))
    add('kspAndroidDeviceTest', project(':test-processor'))
}
```

</tab>
</tabs>

Since configuration names for tests in Multiplatform depend on the exact source set names generated by the Kotlin 
plugin, you can run the following command in your terminal to see the definitive list of all generated KSP configurations 
for your module:

```
./gradlew :<your-module-name>:dependencies | grep ksp
```

Look for configurations matching your target names to find the right one.

Since KSP 2 the catch-all `ksp(...)` configuration has been deprecated. Although this may lead to some duplication in 
the build file, specifying each platform individually avoids the cost of applying target-specific processors to targets 
in which they do nothing.

> To use the deprecated ksp(...) configuration, set the flag `ksp.allow.all.target.configuration=true`
> in gradle.properties.
>
{style=”tip”}

To see an example of a multiplatform project with several targets using KSP, 
visit the [source repository](https://github.com/google/ksp/tree/main/examples/multiplatform).


## Compilation and processing

In a multiplatform project, Kotlin compilation may happen multiple times for each platform (for example with main, test, 
or other build flavors). Symbol processing may also happen multiple times. For each Kotlin compilation task whose target 
is marked for KSP processing, KSP generates a corresponding symbol processing task.

In the [example project](https://github.com/google/ksp/tree/main/examples/multiplatform), there are 6 target platforms 
configured: JVM, JS, Linux X64, Android Native X64, Android Native Arm64, and Mingw X64. Each of these targets has a 
main and a test compilation, resulting in at least 12 compilation tasks.

In this specific example's `workload/build.gradle.kts`, KSP dependencies are added to 10 specific configurations:

* `kspJvm` and `kspJvmTest`
* `kspJs` and `kspJsTest`
* `kspAndroidNativeX64` and `kspAndroidNativeX64Test`
* `kspAndroidNativeArm64` and `kspAndroidNativeArm64Test`
* `kspLinuxX64` (test is omitted/commented out)
* `kspMingwX64` (test is omitted/commented out)

Therefore, in this example, there are at least 12 compilation tasks and 10 symbol processing tasks: one for 
each of the configurations listed above where KSP was explicitly applied.

