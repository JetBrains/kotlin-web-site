[//]: # (title: Adding dependencies on multiplatform libraries)

Every program requires a set of libraries to operate successfully. A Kotlin Multiplatform project can depend on
multiplatform libraries that work for all target platforms, platform-specific libraries, and other multiplatform projects.

To add a dependency on a library, update your `build.gradle(.kts)` file in the `shared` directory of your project. Set a
dependency of the required [type](gradle.md#dependency-types) (for example, `implementation`) in the [`dependencies`](multiplatform-dsl-reference.md#dependencies)
block: 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
``` 

</tab>
</tabs>

Alternatively, you can [set dependencies at the top level](gradle.md#set-dependencies-at-the-top-level).

## Dependency on a Kotlin library

### Standard library

A dependency on a standard library (`stdlib`) in each source set is added automatically. The version of the standard
library is the same as the version of the `kotlin-multiplatform` plugin.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common
standard library is added to the rest. The Kotlin Gradle plugin will select the appropriate JVM standard library
depending on the `kotlinOptions.jvmTarget` [compiler option](gradle.md#compiler-options) of your Gradle build script

Learn how to [change the default behavior](gradle.md#dependency-on-the-standard-library).

### Test libraries

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/) is available for multiplatform tests. When
you [create a multiplatform project](multiplatform-create-lib.md), the Project Wizard automatically adds test
dependencies to common and platform-specific source sets.

If you didn't use the Project Wizard to create your project, you
can [add the dependencies manually](gradle.md#set-dependencies-on-test-libraries).

### kotlinx libraries

If you use a multiplatform library and need to [depend on the shared code](#library-shared-for-all-source-sets), set the
dependency only once in the shared source set. Use the library base artifact name, such as `kotlinx-coroutines-core`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
``` 

</tab>
</tabs>

If you use a kotlinx library and need a [platform-specific dependency](#library-used-in-specific-source-sets), you can
use platform-specific variants of libraries with suffixes such as `-jvm` or `-js`, for
example, `kotlinx-coroutines-core-jvm`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:%coroutinesVersion%")
            }
        }
    }
}

```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:%coroutinesVersion%'
            }
        }
    }
}
``` 

</tab>
</tabs>

## Dependency on Kotlin Multiplatform libraries

You can add dependencies on libraries that have adopted Kotlin Multiplatform technology, such
as [SQLDelight](https://github.com/cashapp/sqldelight). The authors of these libraries usually provide guides for adding
their dependencies to your project.

Check out this [community-maintained list of Kotlin Multiplatform libraries](https://libs.kmp.icerock.dev/).

### Library shared for all source sets

If you want to use a library from all source sets, you can add it only to the common source set. The Kotlin
Multiplatform Mobile plugin will automatically add the corresponding parts to any other source sets.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation("io.ktor:ktor-client-core:%ktorVersion%")
    }
    sourceSets["androidMain"].dependencies {
        //dependency to platform part of kotlinx.coroutines will be added automatically
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
            }
        }
        androidMain {
            dependencies {
                //dependency to platform part of kotlinx.coroutines will be added automatically
            }
        }
    }
}
```

</tab>
</tabs>

### Library used in specific source sets

If you want to use a multiplatform library just for specific source sets, you can add it exclusively to them. The
specified library declarations will then be available only in those source sets.

> Don't use a platform-specific name in such cases, like SQLDelight `native-driver` in the example below. Find the exact name in the library's documentation.
>
{type="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        //kotlinx.coroutines will be available in all source sets
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
    sourceSets["androidMain"].dependencies {
    }
    sourceSets["iosX64Main"].dependencies {
        //SQLDelight will be available only in the iOS source set, but not in Android or common
        implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines will be available in all source sets
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight will be available only in the iOS source set, but not in Android or common
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

> When using a multiplatform library that does not have [hierarchical structure support](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)
> in a multiplatform project that does, you won't be able to use IDE features, such as code completion and highlighting, for the shared iOS source set.
>
> This is a [known issue](https://youtrack.jetbrains.com/issue/KT-40975), and we are working on resolving it. In the meantime,
> you can use [this workaround](multiplatform-mobile-ios-dependencies.md#workaround-to-enable-ide-support-for-the-shared-ios-source-set).
>
{type="note"}

## Dependency on another multiplatform project

You can connect one multiplatform project to another as a dependency. To do this, simply add a project dependency to the
source set that needs it. If you want to use a dependency in all source sets, add it to the common one. In this case,
other source sets will get their versions automatically.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation(project(":some-other-multiplatform-module"))
    }
    sourceSets["androidMain"].dependencies {
        //platform part of :some-other-multiplatform-module will be added automatically
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                //platform part of :some-other-multiplatform-module will be added automatically
            }
        }
    }
}
```

</tab>
</tabs>

## What's next?

Check out other resources on adding dependencies in multiplatform projects and learn more about:

* [Adding Android dependencies](multiplatform-mobile-android-dependencies.md)
* [Adding iOS dependencies](multiplatform-mobile-ios-dependencies.md)