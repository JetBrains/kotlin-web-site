[//]: # (title: Supported versions and configuration)

<primary-label ref="beta"/> 

This page provides details about the [WebAssembly proposals](https://webassembly.org/roadmap/), supported browsers, and configuration recommendations 
for efficient development with Kotlin/Wasm.

## Browser versions

Kotlin/Wasm relies on new WebAssembly proposals, such as [garbage collection (WasmGC)](#garbage-collection-proposal) and
[exception handling](#exception-handling-proposal), to introduce improvements and new features within WebAssembly.

To ensure these features work properly, you need an environment that supports the new proposals.
In some cases, you may need to set up the environment to make it compatible with the proposals. 
Check if your browser version supports 
the new WasmGC by default or if you need to make changes to the environment.

### Chrome 

* **For version 119 or later:**

  Works by default.

* **For older versions:**

  > To run applications in an older browser, you need a Kotlin version older than 1.9.20.
  >
  {style="note"}

  1. In your browser, go to `chrome://flags/#enable-webassembly-garbage-collection`.
  2. Enable **WebAssembly Garbage Collection**.
  3. Relaunch your browser.

### Chromium-based

Including Chromium-based browsers such as Edge, Brave, Opera, or Samsung Internet.

* **For version 119 or later:**

  Works by default.

* **For older versions:**

   > To run applications in an older browser, you need a Kotlin version older than 1.9.20.
   >
   {style="note"}

  Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

### Firefox

* **For version 120 or later:**

  Works by default.

* **For version 119:**

  1. In your browser, go to `about:config`.
  2. Enable `javascript.options.wasm_gc` option.
  3. Refresh the page.

### Safari/WebKit

* **For version 18.2 or later:**

  Works by default.

* **For older versions:**

   Not supported.

> Safari 18.2 is available for iOS 18.2, iPadOS 18.2, visionOS 2.2, macOS 15.2, macOS Sonoma, and macOS Ventura.
> On iOS and iPadOS, Safari 18.2 is bundled with the operating system. To get it, update your device to version 18.2 or later.
>
> For more information, see the [Safari release notes](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview).
>
{style="note"}

## Wasm proposals support

Kotlin/Wasm improvements are based on [WebAssembly proposals](https://webassembly.org/roadmap/). Here you can find details about the support for WebAssembly's 
garbage collection and (legacy) exception handling proposals. 

### Garbage collection proposal

Since Kotlin 1.9.20, the Kotlin toolchain uses the latest version of the [Wasm garbage collection](https://github.com/WebAssembly/gc) (WasmGC) proposal. 

For this reason, we strongly recommend that you update your Wasm projects to the latest version of Kotlin. We also recommend you use the latest versions of browsers with the Wasm environment.

### Exception handling proposal

The Kotlin toolchain uses the [legacy exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md) by default which allows running produced Wasm binaries in wider range of environments.

Since Kotlin 2.0.0, we have introduced support for the new version of Wasm [exception handling proposal](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) within Kotlin/Wasm.

This update ensures the new exception handling proposal aligns with Kotlin requirements, enabling the use of Kotlin/Wasm on virtual machines that only support the latest version of the proposal.

The new exception handling proposal is activated using the `-Xwasm-use-new-exception-proposal` compiler option. It is turned off by default.

<p>&nbsp;</p>

> Learn more about setting up projects, using dependencies, and other tasks with our
> [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{style="tip"}

## Use default import

[Importing Kotlin/Wasm code into Javascript](wasm-js-interop.md) has shifted to named exports, moving away from default exports.

If you still want to use a default import, generate a new JavaScript wrapper module. Create a `.mjs` file with the following snippet:

```Javascript
// Specifies the path to the main .mjs file
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

You can place your new `.mjs` file in the resources folder, and it will automatically be placed next to the main `.mjs` file during the build process.

You can also place your `.mjs` file in a custom location. In this case, you need to either manually move it next to the main `.mjs` file or 
adjust the path in the import statement to match its location.

## Slow Kotlin/Wasm compilation

When working on Kotlin/Wasm projects, you may experience slow compilation times. This happens because the Kotlin/Wasm 
toolchain recompiles the entire codebase every time you make a change.

To mitigate this issue, Kotlin/Wasm targets support incremental compilation, which enables the compiler to recompile only 
those files relevant to changes from the last compilation.

Using incremental compilation reduces the compilation time. It doubles 
the development speed for now, with plans to improve it further in future releases.

In the current setup, incremental compilation for the Wasm targets is disabled by default.
To enable it, add the following line to your project's `local.properties` or `gradle.properties` file:

```text
kotlin.incremental.wasm=true
```

> Try out the Kotlin/Wasm incremental compilation and [share your feedback](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback).
> Your insights help make the feature stable and enabled by default sooner.
>
{style="note"}

## Diagnostics in fully qualified class names

On Kotlin/Wasm, the compiler does not store fully qualified names (FQNs) of classes in the generated binary by default,
to avoid increasing the application size.

For this reason, the compiler reports an error when you call the `KClass::qualifiedName` property in Kotlin/Wasm projects,
unless you explicitly enable the qualified names feature.

This diagnostic is enabled by default, and errors are reported automatically. To disable the diagnostic and allow `qualifiedName` in
Kotlin/Wasm, instruct the compiler to store fully qualified names for all classes by adding the following option to your
`build.gradle.kts` file:

```kotlin
// build.gradle.kts
kotlin {
   wasmJs {
       ...
       compilerOptions {
           freeCompilerArgs.add("-Xwasm-kclass-fqn")
       }
   }
}
```

Keep in mind that enabling this option increases the application size.

## Array out-of-bounds access and traps

In Kotlin/Wasm, accessing an array with an index outside its bounds triggers a WebAssembly trap instead of a regular Kotlin exception. 
The trap immediately stops the current stack of execution.

You can avoid such traps by using the following compiler option in the command line when linking an executable:

```
-Xwasm-enable-array-range-checks
```

Or add it to the `compilerOptions {}` block of your Gradle build file:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

With the compiler option enabled, an `IndexOutOfBoundsException` is thrown instead of a trap. 

When running in a JavaScript environment, these traps appear as
`WebAssembly.RuntimeError` and can be caught on the JavaScript side.

See more details and share your feedback in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default).

## Experimental annotations

Kotlin/Wasm provides several experimental annotations for general WebAssembly interoperability.

[`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/) and [`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/) let you call functions defined outside a Kotlin/Wasm module and expose Kotlin functions to the host or other Wasm modules, respectively.

Because these mechanisms are still evolving, all annotations are marked as experimental. 
You must explicitly [opt in to use them](opt-in-requirements.md), and their design or behavior may change in future Kotlin 
versions.


