[//]: # (title: Add dependencies on Kotlin libraries to Kotlin/Wasm project)

You can use the most popular Kotlin libraries in Kotlin/Wasm out of the box.

## Supported Kotlin libraries for Kotlin/Wasm

Use Maven central repository to add Kotlin libraries to your project:

  ```kotlin
  // build.gradle.kts
  repositories { 
      mavenCentral()
  }
  ```

| Supported libraries           |
|-------------------------------|
| stdlib                        | 
| kotlin-test                   |
| kotlinx-coroutines            |
| Compose Multiplatform         |
| Compose Compiler              |
| kotlinx-serialization         |
| kotlinx-atomicfu              |
| kotlinx-collections-immutable |
| kotlinx-datetime              |
| skiko                         |

## Enable libraries in your project

To set a dependency on a library, such as [`kotlinx.serilization`](serialization.md) and [`kotlinx.coroutines`](coroutines-guide.md),
update your `build.gradle.kts` file:

```kotlin
// `build.gradle.kts`

repositories {
    mavenCentral()
}

kotlin {
    sourceSets {
        val wasmJsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:%serializationVersion%")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

## What's next?

[Explore the Kotlin/Wasm interoperability with JavaScript](wasm-js-interop.md)
