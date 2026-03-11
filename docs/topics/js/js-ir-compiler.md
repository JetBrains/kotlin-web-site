[//]: # (title: Kotlin/JS compiler features)

Kotlin/JS includes compiler features to optimize code for performance, size, and development speed.
This works through the compilation process, which transforms Kotlin code into an intermediate representation (IR) before
generating the JavaScript code.

## Lazy initialization of top-level properties

For better application startup performance, the Kotlin/JS compiler initializes top-level properties lazily. This way,
the application loads without initializing all the top-level properties used in its code. It initializes
only the ones needed at startup; other properties receive their values later when the code that uses them actually runs.

```kotlin
val a = run {
    val result = // intensive computations
    println(result)
    result
} // value is computed upon the first usage
```

If for some reason you need to initialize a property eagerly (upon the application start), mark it with the
[`@EagerInitialization`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-eager-initialization/){nullable="true"} annotation.

## Incremental compilation for development binaries

The Kotlin/JS compiler provides the _incremental compilation mode for development binaries_ that speeds up the development process.
In this mode, the compiler caches the results of `compileDevelopmentExecutableKotlinJs` Gradle task on the module level.
It uses the cached compilation results for unchanged source files during subsequent compilations, making them complete faster,
especially with small changes.

Incremental compilation is enabled by default. To disable incremental compilation for development binaries, add the following line to the project's `gradle.properties`
or `local.properties`:

```none
kotlin.incremental.js.ir=false // true by default
```

> The clean build in the incremental compilation mode is usually slower because of the need to create and populate the caches.
>
{style="note"}

## Minification of member names in production

The Kotlin/JS compiler uses its internal information about the relationships of your Kotlin classes and functions to apply more efficient minification, shortening the names of functions, properties, and classes. This reduces the size of resulting bundled applications.

This type of minification is automatically applied when you build your Kotlin/JS application in [production](js-project-setup.md#building-executables) mode, and enabled by default. To disable member name minification, use the `-Xir-minimized-member-names` compiler option:

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
            }
        }
    }
}
```

## Dead code elimination

[Dead code elimination](https://wikipedia.org/wiki/Dead_code_elimination) (DCE) reduces the size of
the resulting JavaScript code by removing unused properties, functions, and classes.

Unused declarations can appear in cases like:

* A function is inlined and never gets called directly (which always happens except for a few cases).
* A module uses a shared library. Without DCE, parts of the library that you don't use are still included in the resulting bundle.
  For example, the Kotlin standard library contains functions for manipulating lists, arrays, char sequences,
  adapters for DOM, and so on. All of this functionality would require about 1.3 MB as a JavaScript file. A simple
  "Hello, world" application only requires console routines, which are only a few kilobytes for the entire file.

In the Kotlin/JS compiler, DCE is handled automatically:

* DCE is disabled in _development_ bundling tasks, which correspond to the following Gradle tasks:

  * `jsBrowserDevelopmentRun`
  * `jsBrowserDevelopmentWebpack`
  * `jsNodeDevelopmentRun`
  * `compileDevelopmentExecutableKotlinJs`
  * `compileDevelopmentLibraryKotlinJs`
  * Other Gradle tasks including "development" in their name

* DCE is enabled if you build a _production_ bundle, which corresponds to the following Gradle tasks:

  * `jsBrowserProductionRun`
  * `jsBrowserProductionWebpack`
  * `compileProductionExecutableKotlinJs`
  * `compileProductionLibraryKotlinJs`
  * Other Gradle tasks including "production" in their name

With the [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation) annotation, you can specify the declarations you want
DCE to treat as roots.
