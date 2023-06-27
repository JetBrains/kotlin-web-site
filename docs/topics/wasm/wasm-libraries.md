[//]: # (title: Add libraries to Kotlin/Wasm project)

You can use the Kotlin standard library (`stdlib`) and test library ([`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/))
in Kotlin/Wasm out of the box. The version of these libraries is the same as the version of the `kotlin-multiplatform` plugin.

Other official Kotlin (`kotlinx`) and multiplatform libraries are not fully supported yet. You can try experimental versions of such libraries
by adding the Kotlin [experimental repository](https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental/) to your Gradle project.

> For Kotlin 1.9.0 and later, use the latest available libraries' versions.
>
{type="note"}

## Enable kotlinx libraries

To set a dependency on a Kotlin library (`kotlinx`), such as [`kotlinx.serilization`](serialization.md) and [`kotlinx.coroutines`](coroutines-guide.md),
update your `build.gradle.kts` file:

```kotlin
// `build.gradle.kts`

repositories {
    maven {
        url = uri("https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental")
    }
}

kotlin {
    sourceSets {
        val wasmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core-wasm:1.5.1-wasm0")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-wasm:1.6.4-wasm0")
            }
        }
    }
}
```

## Enable multiplatform libraries

To set a dependency on a multiplatform library, such as [Ktor](https://ktor.io/), update your `build.gradle.kts` file:

```kotlin
// `build.gradle.kts`

repositories {
    maven {
        url = uri("https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental")
    }
}

kotlin {
    sourceSets {
        val wasmMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-core-wasm:2.3.1-wasm0")
            }
        }
    }
}
```

## List of supported libraries for Kotlin/Wasm

Kotlin libraries for Wasm:

* Maven Central:

  ```kotlin
  repositories { 
      mavenCentral()
  }
  ```

* Custom Kotlin repository:

  ```kotlin
  repositories {
      maven {
          url = uri("https://maven.pkg.jetbrains.space/kotlin/p/wasm/experimental")
      }
  }
  ```

| Library                       | Version                 | Repository    |
|-------------------------------|-------------------------|---------------|
| stdlib                        | %kotlinVersion%         | Maven Central | 
| kotlin-test                   | %kotlinVersion%         | Maven Central |
| kotlinx-coroutines            | 1.7.0-RC-wasm0          | Custom        |
| Compose Multiplatform         | 1.4.0-dev-wasm08        | Custom        |
| kotlinx-serialization         | 1.5.1-wasm0             | Custom        |
| Ktor                          | 2.3.1-wasm0             | Custom        |
| kotlinx-atomicfu              | 0.20.2-wasm0            | Custom        |
| kotlinx-collections-immutable | 0.4-wasm0               | Custom        |
| kotlinx-datetime              | 0.4.0-wasm0             | Custom        |

## What's next?

[Explore the Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md)