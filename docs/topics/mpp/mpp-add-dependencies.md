[//]: # (title: Add dependencies)

To add a dependency on a library, set the dependency of the required [type](gradle.md#dependency-types) (for example, `implementation`) in the 
`dependencies` block of the source sets DSL.

<tabs>

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

</tabs>

Alternatively, you can [set dependencies at the top level](gradle.md#set-dependencies-at-the-top-level).

## Dependency on the standard library

A dependency on a standard library (`stdlib`) in each source set is added automatically. The version 
of the standard library is the same as the version of the `kotlin-multiplatform` plugin.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common standard 
library is added to the rest. The Kotlin Gradle plugin will select the appropriate JVM standard library depending on 
the `kotlinOptions.jvmTarget` [compiler option](gradle.md#compiler-options) of your Gradle build script

Learn how to [change the default behavior](gradle.md#dependency-on-the-standard-library).

## Set dependencies on test libraries

The [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/) is available for multiplatform tests. When you [create a multiplatform project](mpp-create-lib.md), 
the Project Wizard automatically adds test dependencies to common source set, and for platform-specific source sets 
the dependencies are inferred automatically. 

If you didn’t use the Project Wizard to create your project, you can [add the dependencies manually](gradle.md#set-dependencies-on-test-libraries).

## Set a dependency on a kotlinx library

If you use a kotlinx library and need a platform-specific dependency, you can use platform-specific variants 
of libraries with suffixes such as `-jvm` or `-js`, for example, `kotlinx-coroutines-core-jvm`. You can also use the library 
base artifact name instead – `kotlinx-coroutines-core`.

<tabs>

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

</tabs>

If you use a multiplatform library and need to depend on the shared code, set the dependency only once in the shared 
source set. Use the library base artifact name, such as `kotlinx-coroutines-core` or `ktor-client-core`. 

<tabs>

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

</tabs>

