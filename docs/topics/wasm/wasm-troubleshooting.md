[//]: # (title: Troubleshooting)

Kotlin/Wasm relies on new [WebAssembly proposals](https://webassembly.org/roadmap/) like garbage collection and 
exception handling. These proposals introduce improvements and new features within WebAssembly. 

However, to ensure proper execution and utilization of these features, you require an environment that supports the new proposals. 
In some cases, you might need to set up the environment to make it compatible with the proposals.

## Browser versions

To run applications built with Kotlin/Wasm in a browser, you need a browser version supporting the new 
[WebAssembly garbage collection (WasmGC) feature](https://github.com/WebAssembly/gc). Check if the browser version supports 
the new WasmGC by default or if you need to set the environment up.

### Chrome 

* For version 119 or later:

  Works by default.

* For older versions:

  1. Go to `chrome://flags/#enable-webassembly-garbage-collection` in your browser.
  2. Enable **WebAssembly Garbage Collection**.
  3. Relaunch your browser.

  Besides updating the browser settings, make sure you use the Kotlin toolchain before 1.9.20.

### Chromium-based

Including Chromium-based browsers such as Edge, Brave, Opera, or Samsung Internet.

* For version 119 or later:

  Works by default.

* For older versions:

  Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

  Besides updating the browser settings, make sure you use the Kotlin toolchain before 1.9.20.

### Firefox

* For version 120 or later:

  Works by default.

* For version 119:

  1. Go to `about:config` in your browser.
  2. Enable `javascript.options.wasm_gc` option.
  3. Refresh the page.

### Safari/WebKit

For Safari and WebKit, the WebAssembly garbage collection support is currently under
[active development](https://bugs.webkit.org/show_bug.cgi?id=247394).

> Learn more about setting up projects, using dependencies, and other tasks with the 
> [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{type="tip"}
