[//]: # (title: Android source set layout)

The new Android source set layout was introduced in Kotlin 1.8.0 and became default in 1.9.0. Follow this guide to
understand the key differences between the deprecated and the new layout and migrate your projects.

> You don't need to implement all the suggestions. Only those that are applicable to your particular projects. 
> 
{type="tip"}

## Check the compatibility

The new layout requires Android Gradle plugin 7.0 or later and is supported in Android Studio 2022.3 and later.
Check your version of the Android Gradle plugin and upgrade if necessary.

## Rename Kotlin source sets

If applicable, rename source sets in your project, following this pattern:

| Previous source set layout             | New source set layout               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` maps to `{KotlinSourceSet.name}` as follows:

|             | Previous source set layout | New source set layout          |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## Move source files

If applicable, move your source files to the new directories, following this pattern:

| Previous source set layout                            | New source set layout               |
|-------------------------------------------------------|-------------------------------------|
| The layout had additional `/kotlin` SourceDirectories | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` maps to `{SourceDirectories included}` as follows:

|             | Previous source set layout                                    | New source set layout                                                                             |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## Move the AndroidManifest.xml file

If you have the `AndroidManifest.xml` file in your project, move it to the new directory, following this pattern:

| Previous source set layout                             | New source set layout                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` maps to `{AndroidManifest.xml location}` as follows:

|       | Previous source set layout    | New source set layout                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## Check the relation between Android and common tests

The new Android source set layout changes the relation between Android-instrumented tests (renamed to `androidInstrumentedTest` in the new layout)
and common tests.

Previously, there was a default `dependsOn` relation between `androidAndroidTest` and `commonTest`. It meant the following:

* The code in `commonTest` was available in `androidAndroidTest`.
* `expect` declarations in `commonTest` had to have corresponding `actual` implementations in `androidAndroidTest`.
* Tests declared in `commonTest` were also running as Android instrumented tests.

In the new Android source set layout, the `dependsOn` relation is not added by default. If you prefer the previous behavior,
manually declare this relation in your `build.gradle.kts` file:

```kotlin
kotlin {
// ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

## Adjust the implementation of Android flavors

Previously, the Kotlin Gradle plugin eagerly created source sets that correspond to Android source sets with `debug` and
`release` build types or custom flavors like `demo` and `full`.
It made them accessible by constructions like `val androidDebug by getting { ... }`.

The new Android source set layout makes use of Android [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1))
to create source sets. It makes such expressions invalid,
leading to errors like `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`.

To work around that, use the new `invokeWhenCreated()` API in your `build.gradle.kts` file:

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```
