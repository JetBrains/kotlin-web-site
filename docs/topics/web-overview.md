[//]: # (title: Overview)

Kotlin, through Kotlin Multiplatform, offers two approaches for web development:

* [JavaScript-based (using the Kotlin/JavaScript compiler)](#kotlin-javascript)
* [WebAssembly-based (using the Kotlin/Wasm compiler)](#kotlin-wasm)

Both approaches let you share code in your web app, but they support different use cases. 
They also differ in technical aspects such as target browser support.

## Kotlin/JavaScript

[Kotlin/JavaScript (Kotlin/JS)](js-overview.md) enables running Kotlin apps in JavaScript 
environments by transpiling your code, standard library, and all the supported dependencies into JavaScript.

When developing with Kotlin/JS, you can run your apps either in the browser or the Node.js environment.

> For information about configuring Kotlin/JS targets, see the [Configure a Gradle project](gradle-configure-project.md#targeting-javascript) guide.
>
{style="tip"}

### Kotlin/JavaScript use cases

Kotlin/JS is suitable when your goal is to:

* [Share business logic with a JavaScript/TypeScript codebase](#share-business-logic-with-a-javascript-typescript-codebase).
* [Build non-shareable web apps with Kotlin](#build-web-apps-with-kotlin-without-sharing-the-code).

#### Share business logic with a JavaScript/TypeScript codebase

If you need to share Kotlin code (such as domain or data logic) with a native JavaScript/TypeScript app,
the JS target offers:

* Direct interoperability with JavaScript/TypeScript
* Minimal overhead in interoperability (for example, avoiding unnecessary data copying).
  This allows the shared code to integrate smoothly into a JS-based workflow.

#### Build web apps with Kotlin without sharing the code

For projects where the web app is implemented entirely in Kotlin, 
without sharing it with other platforms (iOS, Android, or Desktop),
an HTML-based solution provides better control.

HTML-based solutions improve SEO and accessibility.
They also provide better browser integration, including features such as find on page and page translation.

For HTML-based solutions, Kotlin/JS supports multiple approaches:

* Using Compose HTML-based frameworks, such as 
  [Kobweb](https://kobweb.varabyte.com/) or [Kilua](https://kilua.dev/),
  to build UIs with a Compose-style architecture.
* Using React-based solutions with Kotlin wrappers to implement [React components in Kotlin](https://kotlinlang.org/docs/js-react.html).

## Kotlin/Wasm
<primary-label ref="beta"/> 

[](wasm-overview.md) compiles Kotlin code into WebAssembly (Wasm), enabling apps to run across
environments and devices that support Wasm while meeting Kotlin’s requirements.

In browsers,
Kotlin/Wasm lets you build web apps with [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/).
Outside the browser, it runs in standalone Wasm virtual machines,
using the [WebAssembly System Interface (WASI)](https://wasi.dev/)
to access platform APIs.

When developing with Kotlin/Wasm, you can target:

* **`wasmJs`**: for running in browsers or Node.js.
* **`wasmWasi`**: for running in Wasm environments supporting WASI, such as Wasmtime, WasmEdge, and so on.

> For information about configuring Kotlin/Wasm targets, see the [Configure a Gradle project](gradle-configure-project.md#targeting-webassembly) guide.
>
{style="tip"}

### Kotlin/Wasm use cases

Use Kotlin/Wasm if you want to share both logic and UI across multiple platforms.

#### Build cross-platform apps with Compose Multiplatform

If you want to share both logic and UI across multiple platforms, including web,
Kotlin/Wasm with [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) provides a shared UI layer:

* Ensuring a consistent UI implementation for all platforms.
* Using Wasm for improved rendering and smoother UI updates, such as responsive animations.
* Supporting the latest version of the
  [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc) proposal,
  which allows Kotlin/Wasm to run on all major modern browsers.

## Choose your web approach

The table below summarizes the recommended target based on your use case:

| Use case                              | Recommended target | Description                                                                                                                                                                                                               |
|---------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sharing business logic, but native UI | JS                 | Offers straightforward interop with JavaScript and minimal overhead.                                                                                                                                                      |
| Sharing both UI and business logic    | Wasm               | Provides better performance for rendering with [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/).                                                                                                 |
| Non-shareable UI                      | JS                 | Allows building UIs with HTML-based frameworks like [Kobweb](https://kobweb.varabyte.com/), [Kilua](https://kilua.dev/), or [React](https://kotlinlang.org/docs/js-react.html), using existing JS ecosystems and tooling. |

> If you need guidance on selecting the appropriate target, 
> join our [Slack community](https://slack-chats.kotlinlang.org/c/multiplatform).
> You can ask about platform differences, performance considerations, and recommended practices for specific use cases.
>
{style="note"}

## Compatibility mode for web targets

You can enable compatibility mode for your web app to ensure it works on all browsers out of the box. 
In this mode, you can build the UI with Wasm for modern browsers, 
while older ones fall back to JS. 

This mode is achieved through cross-compilation for both the `js` and `wasmJs` targets.
[See more information about compatibility mode for web and how to enable it](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets).