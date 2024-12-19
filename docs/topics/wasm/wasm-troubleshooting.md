[//]: # (title: Troubleshooting)

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time. Use it in scenarios before production.
> We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).
>
{style="note"}

Kotlin/Wasm relies on new [WebAssembly proposals](https://webassembly.org/roadmap/) like [garbage collection](#garbage-collection-proposal) and 
[exception handling](#exception-handling-proposal) to introduce improvements and new features within WebAssembly. 

However, to ensure these features work properly, you need an environment that supports the new proposals. 
In some cases, you may need to set up the environment to make it compatible with the proposals.

## Browser versions

To run applications built with Kotlin/Wasm in a browser, you need a browser version supporting the new 
[WebAssembly garbage collection (WasmGC) feature](https://github.com/WebAssembly/gc). Check if the browser version supports 
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

WebAssembly garbage collection support is currently under
[active development](https://bugs.webkit.org/show_bug.cgi?id=247394).

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