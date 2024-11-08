[//]: # (title: Kotlin Wasm)

> Kotlin Wasm is [Alpha](components-stability.md).
> It may be changed at any time. You can use it in scenarios before production. We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).
>
> [Join the Kotlin/Wasm community](https://slack-chats.kotlinlang.org/c/webassembly).
>
{style="note"}

With Kotlin, you have the power to build applications and reuse mobile and desktop user interfaces (UIs) in your web projects through
Compose Multiplatform and Kotlin/Wasm.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) is a declarative framework based on Kotlin
and [Jetpack Compose](https://developer.android.com/jetpack/compose) that allows you to implement the UI
once and share it across all the platforms you target. Specifically for web platforms, Compose Multiplatform uses 
Kotlin/Wasm as its compilation target.

[Explore our online demo of an application built with Compose Multiplatform and Kotlin/Wasm](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm demo](wasm-demo.png){width=700}

> To run applications built with Kotlin/Wasm in a browser, you need a browser version that supports the new garbage collection
> and exception handling proposals. To check the browser support status, see the [WebAssembly
> roadmap](https://webassembly.org/roadmap/).
>
{style="tip"}

[WebAssembly (Wasm)](https://webassembly.org/) is a binary instruction format for a stack-based virtual machine. This
format is platform-independent because it runs on its own virtual machine. Wasm provides Kotlin and other languages with 
a compilation target to run on the web.

Kotlin/Wasm compiles your Kotlin code into Wasm format. Using Kotlin/Wasm, you can create applications that run on 
different environments and devices, which support Wasm and meet Kotlin's requirements. 

Kotlin/Wasm benefits from [WebAssembly System Interface (WASI)](https://wasi.dev/), which provides 
a secure standard interface for running Kotlin applications compiled to WebAssembly across different environments.

Kotlin/Wasm leverages WASI to abstract away platform-specific details, enabling the same Kotlin code to be executed on diverse 
platforms without requiring custom handling for each runtime and expanding the reach of Kotlin/Wasm beyond web applications.

> To see Kotlin/Wasm and WASI in action with Node.js, Deno, and WasmEdge, check the [Get started with Kotlin/Wasm and WASI tutorial](wasm-wasi.md).
>
{style="tip"}

Additionally, you can use the most popular Kotlin libraries in Kotlin/Wasm out of the box. Like other Kotlin and Multiplatform
projects, you can include dependency declarations in the build script. For more information, 
see [Adding dependencies on multiplatform libraries](multiplatform-add-dependencies.md).

Would you like to try it yourself?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="700" alt="Get started with Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm performance

Although Kotlin/Wasm is still in Alpha, Compose Multiplatform running on Kotlin/Wasm already shows encouraging performance 
traits. You can see that its execution speed outperforms JavaScript and is approaching that of the JVM:

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

We regularly run benchmarks on Kotlin/Wasm, and these results come from our testing in a recent version of Google Chrome.

## Browser API support

The Kotlin/Wasm standard library provides declarations for browser APIs, including the DOM API.
With these declarations, you can directly use the Kotlin API to access and utilize various browser functionalities. 
For example, in your Kotlin/Wasm applications, you can use manipulation with DOM elements or fetch the API 
without defining these declarations from scratch. To learn more, see our [Kotlin/Wasm browser example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example).

The declarations for browser API support are defined using JavaScript [interoperability capabilities](wasm-js-interop.md). 
You can use the same capabilities to define your own declarations. In addition, Kotlin/Wasm–JavaScript interoperability 
allows you to use Kotlin code from JavaScript. For more information, see [Use Kotlin code in JavaScript](wasm-js-interop.md#use-kotlin-code-in-javascript).

## Leave feedback

### Kotlin/Wasm feedback

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and provide your feedback directly to developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Report any issues in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).

### Compose Multiplatform feedback

* ![Slack](slack.svg){width=25}{type="joined"} Slack: provide your feedback in the [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) public channel.
* [Report any issues in GitHub](https://github.com/JetBrains/compose-multiplatform/issues).

## Learn more

* Learn more about Kotlin/Wasm in this [YouTube playlist](https://kotl.in/wasm-pl).
* Explore the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples) in our GitHub repository.
