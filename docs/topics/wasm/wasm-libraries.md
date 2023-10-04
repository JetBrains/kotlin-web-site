[//]: # (title: Add dependencies on Kotlin libraries to Kotlin/Wasm project)

You can use the Kotlin standard library (`stdlib`) and test library ([`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/))
in Kotlin/Wasm out of the box. The version of these libraries is the same as the version of the `kotlin-multiplatform` plugin.

Other official Kotlin (`kotlinx`) and multiplatform libraries are not fully supported yet. You can try experimental versions of such libraries
by adding the Kotlin [experimental repository](https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental/) to your Gradle project.

> For Kotlin 1.9.0 and later, use the latest available libraries' versions.
>
{type="note"}

## Supported Kotlin libraries for Kotlin/Wasm

You can use one of the following repositories to add Kotlin libraries to your project:

* **Maven** Central for `stdlib` and `kotlin.test` libraries:

  ```kotlin
  // build.gradle.kts
  repositories { 
      mavenCentral()
  }
  ```

* **Custom** Maven repository for experimental Kotlin/Wasm artifacts:

  ```kotlin
  // build.gradle.kts
  repositories {
      maven("https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental")
  }
  ```

* **Custom** Maven repository for Compose Multiplatform dev artifacts:

  ```kotlin
  // build.gradle.kts
  repositories {
      maven("https://maven.pkg.jetbrains.space/public/p/compose/dev/")
  }
  ```

| Library                       | Version          | Repository                                     |
|-------------------------------|------------------|------------------------------------------------|
| stdlib                        | %kotlinVersion%  | Maven Central                                  | 
| kotlin-test                   | %kotlinVersion%  | Maven Central                                  |
| kotlinx-coroutines            | 1.7.2-wasm0      | Custom for experimental Kotlin/Wasm artifacts  |
| Compose Multiplatform         | 1.4.0-dev-wasm09 | Custom for experimental Kotlin/Wasm artifacts  |
| kotlinx-serialization         | 1.5.2-wasm0      | Custom for experimental Kotlin/Wasm artifacts  |
| Ktor                          | 2.3.3-wasm0      | Custom for experimental Kotlin/Wasm artifacts  |
| kotlinx-atomicfu              | 0.21.0-wasm0     | Custom for experimental Kotlin/Wasm artifacts  |
| kotlinx-collections-immutable | 0.4-wasm0        | Custom for experimental Kotlin/Wasm artifacts  |
| kotlinx-datetime              | 0.4.0-wasm1      | Custom for experimental Kotlin/Wasm artifacts  |
| skiko                         | 0.0.7.68-wasm03  | Custom for Compose Multiplatform dev artifacts |

## Enable libraries in your project

To set a dependency on a library, such as [`kotlinx.serilization`](serialization.md) and [`kotlinx.coroutines`](coroutines-guide.md),
update your `build.gradle.kts` file:

```kotlin
// `build.gradle.kts`

repositories {
    maven("https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental")
}

kotlin {
    sourceSets {
        val wasmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core-wasm:1.5.1-wasm0")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-wasm:1.6.4-wasm0")
                implementation("io.ktor:ktor-client-core-wasm:2.3.1-wasm0")
            }
        }
    }
}
```

## What's next?

[Explore the Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md)