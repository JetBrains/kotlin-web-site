[//]: # (title: KSP with Kotlin Multiplatform)

For a quick start, see a [sample Kotlin Multiplatform project](https://github.com/google/ksp/tree/main/examples/multiplatform) 
defining a KSP processor.

Starting from KSP 1.0.1, applying KSP on a multiplatform project is similar to that on a single platform, JVM project.
The main difference is that, instead of writing the `ksp(...)` configuration in dependencies, `add(ksp<Target>)` or `add(ksp<SourceSet>)`
is used to specify which compilation targets need symbol processing, before compilation.

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    jvm()
    linuxX64 {
        binaries {
            executable()
        }
    }
}

dependencies {
    add("kspCommonMainMetadata", project(":test-processor"))
    add("kspJvm", project(":test-processor"))
    add("kspJvmTest", project(":test-processor")) // Not doing anything because there's no test source set for JVM
    // There is no processing for the Linux x64 main source set, because kspLinuxX64 isn't specified
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## Compilation and processing

In a multiplatform project, Kotlin compilation may happen multiple times (`main`, `test`, or other build flavors) for each platform.
So is symbol processing. A symbol processing task is created whenever there is a Kotlin compilation task and a
corresponding `ksp<Target>` or `ksp<SourceSet>` configuration is specified.

For example, in the above `build.gradle.kts`, there are 4 compilation tasks: common/metadata, JVM main, Linux x64 main, Linux x64 test,
and 3 symbol processing tasks: common/metadata, JVM main, Linux x64 test.

## Avoid the ksp(...) configuration on KSP 1.0.1+

Before KSP 1.0.1, there is only one, unified `ksp(...)` configuration available. Therefore, processors either applies to all
compilation targets, or nothing at all. Note that the `ksp(...)` configuration not only applies to the main source set, but also
the test source set if it exists, even on traditional, non-multiplatform projects. This brought unnecessary overheads to build time.

Starting from KSP 1.0.1, per-target configurations are provided as shown in the above example. In the future:
1. For multiplatform projects, the `ksp(...)` configuration will be deprecated and removed.
2. For single platform projects, the `ksp(...)` configuration will only apply to the main, default compilation. 
   Other targets like `test` will need to specify `kspTest(...)` in order to apply processors.

Starting from KSP 1.0.1, there is an early access flag `-DallowAllTargetConfiguration=false` to switch to the more efficient behavior.
If the current behavior is causing performance issues, please give it a try. 
The default value of the flag will be flipped from `true` to `false` on KSP 2.0.
