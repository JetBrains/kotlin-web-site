[//]: # (title: KSP with Kotlin Multiplatform)

<web-summary>Learn how to use KSP in a Kotlin Multiplatform project: apply the KSP plugin and add processors to 
targets and test compilations.</web-summary>

In this guide, you will learn how to use Kotlin Symbol Processing (KSP) in a Kotlin Multiplatform project.
For a quick start, see the [example multiplatform project](https://github.com/google/ksp/tree/main/examples/multiplatform)
in the KSP repository. It uses KSP with several targets, and its processor generates a `Foo` class used by the project.

## Add KSP to a multiplatform project

Apply the KSP plugin to the client module (the module that uses the processor). In the module's `build.gradle(.kts)`
file, add the plugin to the `plugins {}` block:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    id("com.google.devtools.ksp") version "%kspVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'com.google.devtools.ksp' version '%kspVersion%'
}
```

</tab>
</tabs>

In the same file, add the processor dependency for each target that requires symbol processing:

```kotlin
dependencies {
    add("ksp<Target>", <processor>)
}
```

* `<Target>` is the name of one of the targets used in your multiplatform project, with the first letter capitalized.
  For example, for the `iosArm64` target, use the `kspIosArm64` configuration.

  > For a full list of targets, see the [Multiplatform Gradle DSL reference](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)
  > and [Kotlin/Native supported targets and hosts](native-target-support.md).
  >
  {style="tip"}

* `<processor>` is the processor dependency. It can be:

  * A module in your project that contains the logic for your symbol processor:

    ```kotlin
    add("kspJvm", project(":local-processor"))
    ```

  * An external processor, such as Room:

    ```kotlin
    add("kspJvm", "androidx.room3:room3-compiler:3.0.3")
    ```

<anchor name="avoid-the-ksp-configuration-on-ksp-1-0-1"/>

> Since KSP 2.3.12, the catch-all `ksp(...)` configuration causes a build error in multiplatform projects. Earlier
> versions report it as deprecated. Configure each target explicitly to avoid running processors where they aren't
> needed.
>
{style="warning"}

### Use multiple processors in a single target

You can add more than one processor to a target:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    add("kspAndroid", project(":test-processor"))
    add("kspAndroid", "androidx.room3:room3-compiler:3.0.3")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    add('kspAndroid', project(':test-processor'))
    add('kspAndroid', 'androidx.room3:room3-compiler:3.0.3')
}
```

</tab>
</tabs>

### Use the same processor in multiple targets

You can add the same processor to more than one target:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    add("kspIosX64", project(":test-processor"))
    add("kspIosArm64", project(":test-processor"))
    add("kspIosSimulatorArm64", project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    add('kspIosX64', project(':test-processor'))
    add('kspIosArm64', project(':test-processor'))
    add('kspIosSimulatorArm64', project(':test-processor'))
}
```

</tab>
</tabs>

If you have many iOS targets, you can use a loop to avoid repetition:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
        add(
            "ksp${target.name.replaceFirstChar { it.uppercaseChar() }}",
            project(":test-processor")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    kotlin.targets.findAll { it.name.startsWith('ios') }.each { target ->
        add("ksp${target.name.capitalize()}", project(':test-processor'))
    }
}
```

</tab>
</tabs>

### Configure KSP for test compilations

To run KSP during test compilation, add the processor to the corresponding test configurations:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    add("kspJvmTest", project(":test-processor"))
    add("kspJsTest", project(":test-processor"))
    add("kspIosX64Test", project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    add('kspJvmTest', project(':test-processor'))
    add('kspJsTest', project(':test-processor'))
    add('kspIosX64Test', project(':test-processor'))
}
```

</tab>
</tabs>

For Android host and device tests, KSP derives configuration names from the corresponding source set names:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    add("kspAndroidHostTest", project(":test-processor"))
    add("kspAndroidDeviceTest", project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    add('kspAndroidHostTest', project(':test-processor'))
    add('kspAndroidDeviceTest', project(':test-processor'))
}
```

</tab>
</tabs>

## Find KSP configuration names

KSP derives configuration names from the Kotlin Multiplatform source sets. To view the complete list of KSP
configurations for a module, run:

```bash
./gradlew :<your-module-name>:dependencies | grep ksp
```

Look for the configuration names that correspond to your target source sets.

## Compilation and processing

In a multiplatform project, Kotlin creates separate [compilations](https://kotlinlang.org/docs/multiplatform/multiplatform-advanced-project-structure.html#compilations)
for each target, such as `main` and `test`. For each Kotlin compilation task with one or more configured processors,
KSP creates a corresponding symbol processing task.

The [example project](https://github.com/google/ksp/tree/main/examples/multiplatform) defines six targets. Each target
has `main` and `test` compilations, resulting in the following compilation and symbol processing tasks:

* **JVM**: `jvmMain` and `jvmTest`
* **JS**: `jsMain` and `jsTest`
* **LinuxX64**: `linuxX64Main` and `linuxX64Test`
* **AndroidNativeX64**: `androidNativeX64Main` and `androidNativeX64Test`
* **AndroidNativeArm64**: `androidNativeArm64Main` and `androidNativeArm64Test`
* **MingwX64**: `mingwX64Main` and `mingwX64Test`

In the example's `workload/build.gradle.kts` file, KSP dependencies are declared for the following configurations:

* `kspJvm` and `kspJvmTest`
* `kspJs` and `kspJsTest`
* `kspAndroidNativeX64` and `kspAndroidNativeX64Test`
* `kspAndroidNativeArm64` and `kspAndroidNativeArm64Test`
* `kspLinuxX64`
* `kspMingwX64`

KSP creates a symbol processing task for each configuration where a KSP dependency is declared. In this example, the
project has at least 12 Kotlin compilation tasks and 10 symbol processing tasks. The remaining compilations don't
have corresponding KSP tasks because KSP isn't configured for them.

## See also

* [Example multiplatform project](https://github.com/google/ksp/tree/main/examples/multiplatform) in the KSP repository
* The list of entry points for each platform when [running KSP from the command line](ksp-command-line.md#main-class)
