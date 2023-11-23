[//]: # (title: Troubleshooting)

Most of the browsers support WebAssembly. For recent browser versions, WebAssembly works by default. However,
for older browser versions, you still need to update the browser settings.

To run a Kotlin/Wasm project, check if you need to update the settings of the target environment:

<tabs>
<tab title="Chrome">

* For version 119 or later:
  
  It works by default.

* For older versions:

    1. Go to `chrome://flags/#enable-webassembly-garbage-collection` in your browser.
    2. Enable **WebAssembly Garbage Collection**.
    3. Relaunch your browser.

</tab>
<tab title="Firefox">

* For version 120 or later:
  
  It works by default.

* For version 119:

  1. Go to `about:config` in your browser.
  2. Enable `javascript.options.wasm_gc` option.
  3. Relaunch your browser.

</tab>
<tab title="Edge">

* For version 119 or later:

  It works by default.

* For older versions:

  Run the application with the `--js-flags=--experimental-wasm-gc` command line argument.

</tab>
</tabs>

For more information about running a Kotlin/Wasm project, see the [Kotlin/Wasm examples.](https://github.com/Kotlin/kotlin-wasm-examples#readme) 