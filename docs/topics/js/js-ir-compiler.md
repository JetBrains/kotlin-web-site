[//]: # (title: Kotlin/JS compiler features)

Kotlin/JS includes compiler features to optimize code for performance, size, and development speed.
This works through the compilation process, which transforms Kotlin code into an intermediate representation (IR) before
generating the JavaScript code.

## Configure output JavaScript versions

The Kotlin/JS compiler can generate JavaScript for the ES5, ES2015, and ES2020 versions of the ECMAScript standard.
Choose the newest version supported by your target environment by setting the `target` property in your `build.gradle(.kts)` file:

```kotlin
tasks.withType<KotlinJsCompile>().configureEach {
    compilerOptions {
        target = "es2020"
    }
}
```

For the list of supported versions and the features, see [Set an ECMAScript target](js-project-setup.md#set-an-ecmascript-target).

## Configure the module system

The Kotlin/JS compiler can produce code for several popular module systems, such as UMD, CommonJS, AMD, and ES modules.
To select the target module system, set the `moduleKind` compiler option in your build script:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.js.ir.KotlinJsIrLink> {
    compilerOptions.moduleKind.set(org.jetbrains.kotlin.gradle.dsl.JsModuleKind.MODULE_COMMONJS)
}
```

For the available values and more details, see [JavaScript modules](js-modules.md).

## Generate TypeScript declaration files (`d.ts`)
<primary-label ref="experimental-opt-in"/>

The Kotlin/JS compiler can generate TypeScript definitions from your Kotlin code. JavaScript tools and IDEs can use these
definitions to provide autocompletion, support static analyzers, and make it easier to include Kotlin code in JavaScript
and TypeScript projects.

The compiler collects any top-level declarations marked with the [`@JsExport`](js-to-kotlin-interop.md#jsexport-annotation)
annotation and generates TypeScript definitions in a `.d.ts` file. To enable this, add the `generateTypeScriptDefinitions()`
function to the `js {}` block in your `build.gradle.kts` file:

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

For more details, see [Generation of TypeScript declaration files (`d.ts`)](js-project-setup.md#generation-of-typescript-declaration-files-d-ts).

## Configure output granularity

You can choose how the compiler outputs `.js` files in your project:

* **Per module** (default). The compiler outputs a separate `.js` file for each project module.
* **Whole program**. The compiler compiles the whole project into a single `.js` file.
* **Per file**. The compiler generates one (or two, if the file contains exported declarations) `.js` file per each Kotlin file.

To change the granularity, set the `kotlin.js.ir.output.granularity` property in your `gradle.properties` file:

```none
kotlin.js.ir.output.granularity=whole-program // 'per-module' is the default
```

For more details, including the requirements for the per-file mode, see [Configure output granularity](js-project-setup.md#configure-output-granularity).

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

This type of minification is automatically applied when you build your Kotlin/JS application in [production](js-project-setup.md#building-executables) mode and is enabled by default. To disable member name minification, use the `-Xir-minimized-member-names` compiler option:

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
