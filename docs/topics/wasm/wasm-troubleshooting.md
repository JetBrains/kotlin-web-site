[//]: # (title: Troubleshooting)

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time. Use it in scenarios before production.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).
>
{type="note"}

Kotlin/Wasm relies on new [WebAssembly proposals](https://webassembly.org/roadmap/) like garbage collection and 
exception handling to introduce improvements and new features within WebAssembly. 

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
  {type="note"}

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
   {type="note"}

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

<p>&nbsp;</p>

> Learn more about setting up projects, using dependencies, and other tasks with our 
> [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{type="tip"}
