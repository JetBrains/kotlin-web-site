[//]: # (title: Kotlin/Wasm FAQ)
[//]: # (description: Find answers to common questions about browser compatibility, WebAssembly features, compiler configuration, and troubleshooting in Kotlin/Wasm.)

## What are the Kotlin/Wasm target support tiers?

Kotlin/Wasm targets belong to two support tiers that describe how the Kotlin team tests the targets and their tooling. 
The absence of dedicated tests doesn't necessarily mean a tooling feature is unavailable.

| Target     | Tier   | Automated testing                                                                   | 
|------------|--------|-------------------------------------------------------------------------------------|
| `wasmJs`   | Tier 1 | Broader QA coverage, including Kotlin Gradle plugin integration tests and IDE tests |
| `wasmWasi` | Tier 2 | More limited QA and Kotlin Gradle plugin test coverage, with no dedicated IDE tests |

Tooling support also differs between the targets:

* **Kotlin Gradle plugin:** support for `wasmWasi` is more limited, and WASI-specific functionality requires opt-in.
* **IDE:** `wasmWasi` has more limited support. For example, debugging and gutter icons for running code aren't available.

## Which Kotlin/Wasm targets should my library support?

Prefer supporting both `wasmJs` and `wasmWasi` where your library's functionality and dependencies allow it. 
This makes your library available both in JavaScript environments and in WASI-compatible runtimes.

* Prioritize `wasmJs` when introducing Kotlin/Wasm support, as it is the more mature target and receives broader tooling
and QA coverage.
* Add `wasmWasi` support to make platform-independent functionality available outside JavaScript environments.

Test your library on each target you support, since their available APIs and runtime environments may differ.

## Which browsers support Kotlin/Wasm?

To support Kotlin's language features on WebAssembly, Kotlin/Wasm relies on [WebAssembly features](#which-webassembly-features-does-kotlin-wasm-use) such as garbage
collection (WasmGC) and exception handling.

Applications work without additional browser configuration in the following versions:

| Browser        | Minimum supported version |
|----------------|---------------------------|
| Chrome         | 119                       |
| Chromium-based | 119                       |
| Firefox        | 120                       |
| Safari         | 18.2                      |


> For the best performance and development experience, use the latest available browser version.
> 
{style="tip"}

## Which WebAssembly features does Kotlin/Wasm use?

Kotlin/Wasm relies on [WebAssembly features](https://webassembly.org/features/), including:

* [Garbage collection (WasmGC)](https://github.com/WebAssembly/gc), which supports managed objects in WebAssembly. Starting with Kotlin 1.9.20, the
  toolchain uses the updated WasmGC version.
* Exception handling, for which the toolchain supports both the [legacy](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/legacy/Exceptions.md) and [new](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) versions.

> Use the latest Kotlin version and a compatible browser or runtime to benefit from current support.
>
{style="tip"}

## How do I choose the exception handling version?

The default exception handling version depends on your target:

| Target     | Default version           |
|------------|---------------------------|
| `wasmJs`   | Legacy exception handling |
| `wasmWasi` | New exception handling    |

To enable the new exception handling version for `wasmJs`, add the following to your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-use-new-exception-proposal")
        }
    }
}
```

For `wasmWasi`, the new version is enabled by default. If your runtime requires the legacy proposal, configure:

```kotlin
kotlin {
    wasmWasi {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-use-new-exception-proposal=false")
        }
    }
}
```

## How can I use a default JavaScript import?

Kotlin/Wasm uses named exports. To use a default import, create a JavaScript wrapper module that re-exports them as a
single object:

1. Create a `.mjs` file with the following content:

   ```javascript
   import * as moduleExports from "./wasm-test.mjs";

   export { moduleExports as default };
   ```
2. Replace `wasm-test.mjs` with your generated module's filename. 

Place the wrapper in your source set's resources directory. This way the build copies it next to the generated `.mjs` file.
If you place the wrapper elsewhere, adjust the import path or copy the wrapper next to the generated module.

## Does Kotlin/Wasm support incremental compilation?

Yes. Incremental compilation is enabled by default for Kotlin/Wasm targets. It reduces compilation time by recompiling
only the files affected by changes.

To disable it, add the following to your project's `gradle.properties` or `local.properties` file:

```properties
kotlin.incremental.wasm=false
```

## Can I access fully qualified class names at runtime?

Yes. Starting with Kotlin 2.3.0, `KClass.qualifiedName` is enabled by default on Kotlin/Wasm targets.

Fully qualified names include the package name. This makes runtime errors more informative and helps you reuse code
that relies on this information.

For earlier Kotlin versions, explicitly enable support in your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

Enabling this option for earlier Kotlin versions increases the application size.

## How does Kotlin/Wasm handle out-of-bounds array access?

Kotlin/Wasm enables array bounds checks by default. If you try to access an array with an index outside its bounds, the
compiler throws an `IndexOutOfBoundsException`.

However, explicit bounds checks can add performance overhead. To disable them, add the `-Xwasm-enable-array-range-checks=false`
option to your `build.gradle.kts` file. 

This way, out-of-bounds access triggers a WebAssembly trap. A trap stops the current execution stack. In JavaScript
environments, these traps appear as `WebAssembly.RuntimeError` and can be caught on the JavaScript side.

## How can I import and export functions directly between Wasm modules?

Use the experimental WebAssembly interoperability annotations:

* [`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/) imports a function from the host environment or another Wasm module.
* [`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/) exports a Kotlin function to the host environment or other Wasm modules.

These annotations operate directly at the Wasm module boundary, without JavaScript type adapters.

Their design and behavior may change in future Kotlin versions. You must explicitly [opt in](opt-in-requirements.md) to use them.

## Why does my application reload repeatedly during debugging?

When you run development Gradle tasks (`*DevRun`), Kotlin automatically serves source files to the browser for debugging.
Watching these files can cause the browser to reload before compilation and bundling finish.

To avoid it, configure webpack to ignore Kotlin source files and stop watching served static files. Create a `.js` file in 
the `webpack.config.d` directory at the root of your project:

```javascript
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
};

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            };
        } else {
            return file;
        }
    });
}
```

For more information about debugging, see [Debug Kotlin/Wasm code](wasm-debugging.md).

## Where can I find Kotlin/Wasm configuration examples?

Browse the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples) for sample projects, dependency
configuration, and integrations.
