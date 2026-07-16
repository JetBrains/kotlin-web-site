[//]: # (title: KSP with Kotlin Multiplatform)
[//]: # (description: Add KSP to a Kotlin multiplatform project)

Here you'll learn how to use Kotlin Symbol Processing (KSP) in a Kotlin Multiplatform project. For a quick start, see 
an example of a multiplatform project with several targets using KSP in the 
[source repository](https://github.com/google/ksp/tree/main/examples/multiplatform). The processor in this example
generates a `Foo` class used by the project.

## Add KSP to a multiplatform project

In the `build.gradle.kts` file of the client module (the module that uses the processor), add the appropriate KSP 
processor dependency for each target that requires symbol processing.

`dependencies {}` block:

```
add("ksp<Target>", <processor>)
```

Where:

* `<Target>` is one of the targets used in your multiplatform project. 

  > For a full list of targets, see [Multiplatform Gradle DSL reference](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)
  > and [Kotlin/Native supported targets](https://kotlinlang.org/docs/native-target-support.html).
  >
  {style="tip"}

* `<processor>` is a Gradle project path. It can be:

  * a specific directory in your project that contains the logic for your symbol processor:

      ```
      add("kspJvm", project(":local-processor"))
      ```

  * an external processor such as Room:

      ```
      add("kspJvm", "androidx.room:room-compiler:2.6.1")
      ```

> Since KSP 2, the catch-all `ksp(...)` configuration is deprecated. Configure each target explicitly to avoid running
> processors where they are not needed.
>
{style="warning"}

### Use mutiple processors in a single target

You can add more than one processor to a target:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspAndroid", project(":test-processor"))
add("kspAndroid", "androidx.room:room-compiler:2.6.1")
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspAndroid', project(':test-processor'))
add('kspAndroid', 'androidx.room:room-compiler:2.6.1')
```

</tab>
</tabs> 

### Use the same processor in multiple targets

You can add the same processor to more than one target:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspIosX64", project(":test-processor"))
add("kspIosArm64", project(":test-processor"))
add("kspIosSimulatorArm64", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspIosX64', project(':test-processor'))
add('kspIosArm64', project(':test-processor'))
add('kspIosSimulatorArm64', project(':test-processor'))
```

</tab>
</tabs> 

If you have many iOS targets, you can avoid repetition by looping:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
    add(
        "ksp${target.name.replaceFirstChar { it.uppercaseChar() }}",
        project(":test-processor")
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
    add(
        "ksp${target.name.replaceFirstChar { it.uppercaseChar() }}",
        project(":test-processor")
    )
}
```

</tab>
</tabs>

### Configure KSP for test compilations

To run KSP during test compilation, add the processor to the corresponding test configurations:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspJvmTest", project(":test-processor"))
add("kspJsTest", project(":test-processor"))
add("kspIosX64Test", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspJvmTest', project(':test-processor'))
add('kspJsTest', project(':test-processor'))
add('kspIosX64Test', project(':test-processor'))
```

</tab>
</tabs> 

For Android host and device tests, KSP derives configuration names from the corresponding source set names:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspAndroidHostTest", project(":test-processor"))
add("kspAndroidDeviceTest", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspAndroidHostTest', project(':test-processor'))
add('kspAndroidDeviceTest', project(':test-processor'))
```

</tab>
</tabs>

## Find KSP configuration names

KSP derives configuration names from the Kotlin Multiplatform source sets. To view the complete 
list of KSP configurations for a module, run:

```Bash
./gradlew :<your-module-name>:dependencies | grep ksp
```

Look for the configuration names that correspond to your target source sets.

## Compilation and processing

In a multiplatform project, Kotlin creates a separate [compilation](https://kotlinlang.org/docs/multiplatform/multiplatform-advanced-project-structure.html#compilations) 
for each target and source set, such as `main` and`test`. For each Kotlin compilation task with one or more configured 
KSP processors, KSP creates a corresponding symbol processing task.

The [example project](https://github.com/google/ksp/tree/main/examples/multiplatform) defines six targets. Each target has `main` and `test` compilations, resulting in the 
following compilation and symbol processing tasks:

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
project creates at least 12 Kotlin compilation tasks and 10 symbol processing tasks. The remaining compilations don't 
have corresponding KSP tasks because KSP isn't configured for them.