[//]: # (title: Kotlin/Wasm FAQ)
[//]: # (description: Find answers to common questions about browser compatibility, WebAssembly features, compiler configuration, and troubleshooting in Kotlin/Wasm.)

## Which Kotlin/Wasm targets are supported?

Kotlin/Wasm supports `wasm-js` (Tier 1) and `wasm-wasi` (Tier 2).
For CI coverage, compatibility guarantees, tooling support, and recommendations for library authors,
see [Kotlin/Wasm target support](wasm-target-support.md).

## Which browsers support Kotlin/Wasm?

Kotlin/Wasm relies on the latest [WebAssembly proposals](#which-webassembly-proposals-does-kotlin-wasm-use), such as garbage collection (WasmGC) and
exception handling, to introduce improvements and new features within WebAssembly. Applications work in the following browsers:

<tabs>

<tab id="Chrome-wasm" title="Chrome">

* **Version 119 or later:**

  Works by default.

* **Older versions:**

  1. Use a Kotlin version older than 1.9.20.
  2. In your browser, go to `chrome://flags/#enable-webassembly-garbage-collection`.
  3. Enable **WebAssembly Garbage Collection**.
  4. Relaunch your browser.

</tab>

<tab id="chromium-wasm" title="Chromium-based">

Including Chromium-based browsers such as Edge, Brave, Opera, or Samsung Internet.

* **Version 119 or later:**

  Works by default.

* **Older versions:**

  1. Use a Kotlin version older than 1.9.20.
  2. Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

</tab>

<tab id="firefox-wasm" title="Firefox">

* **Version 120 or later:**

  Works by default.

* **Version 119:**

  1. In your browser, go to `about:config`.
  2. Enable `javascript.options.wasm_gc` option.
  3. Refresh the page.

</tab>

<tab id="safari-webkit-wasm" title="Safari/WebKit">

* **Version 18.2 or later:**

  Works by default. Available for:

  * iOS 18.2
  * iPadOS 18.2
  * visionOS 2.2
  * macOS 15.2
  * macOS Sonoma
  * macOS Ventura

* **Older versions:**

  Not supported.

For more information, see the [Safari release notes](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview).

</tab>
</tabs>

> For development, use the latest available browser version.
> 
{style="tip"}

## Which WebAssembly proposals does Kotlin/Wasm use?

Kotlin/Wasm relies on [WebAssembly proposals](https://webassembly.org/roadmap/), including:

* [Garbage collection (WasmGC)](https://github.com/WebAssembly/gc), which supports managed objects in WebAssembly. Starting with Kotlin 1.9.20, the toolchain uses the updated WasmGC proposal.
* Exception handling, for which the toolchain supports both the [legacy](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/legacy/Exceptions.md) and [new](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) proposals.

> Use the latest Kotlin version and a compatible browser or runtime to benefit from current support.
>
{style="tip"}

## How do I choose the exception handling proposal?

This depends on your target:

| Target | Default proposal |
|---|---|
| `wasmJs` | Legacy exception handling |
| `wasmWasi` | New exception handling |

To enable the new proposal for `wasmJs`, add the following to your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-use-new-exception-proposal")
        }
    }
}
```

For `wasmWasi`, the new proposal is enabled by default. If your runtime requires the legacy proposal, configure:

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

If you use Kotlin 2.2.20, you must explicitly enable support. Add the following to your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

Keep in mind that enabling this option increases the application size.

## Why does out-of-bounds array access cause a trap?

If you access an array with an index outside its bounds, the compiler triggers a WebAssembly trap. A trap immediately
stops the current execution stack.

In JavaScript environments, these traps appear as `WebAssembly.RuntimeError` and can be caught on the JavaScript side.

To avoid such traps in Kotlin/Wasm, enable array range checks when linking the executable. This way, the compiler throws
`IndexOutOfBoundsException` instead of a trap. For that, add the following to your `build.gradle.kts` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

To compile from the command line, pass `-Xwasm-enable-array-range-checks` during executable linking.

See more details and share your feedback in the [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-73452).

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
