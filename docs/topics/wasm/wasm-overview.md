[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasm has the power to compile your Kotlin code into [WebAssembly (Wasm)](https://webassembly.org/) format. 
With Kotlin/Wasm, you can create applications that run on
different environments and devices, which support Wasm and meet Kotlin's requirements.

Wasm is a binary instruction format for a stack-based virtual machine. This
format is platform-independent because it runs on its own virtual machine. Wasm provides Kotlin and other languages with
a compilation target. 

You can use Kotlin/Wasm in different target environments, such as browsers, for developing 
web applications built with [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), or outside the 
browser in standalone Wasm virtual machines. In the outside-of-browser case,
[WebAssembly System Interface (WASI)](https://wasi.dev/) provides access to platform APIs, which you can also utilize.

> To run applications built with Kotlin/Wasm in a browser, your users need a [browser version](wasm-configuration.md#browser-versions) that supports 
> WebAssembly's garbage collection
> and legacy exception handling proposals. To check the browser support status, see the [WebAssembly
> roadmap](https://webassembly.org/roadmap/).
>
{style="tip"}

## Kotlin/Wasm and Compose Multiplatform

With Kotlin, you have the power to build applications and reuse mobile and desktop user interfaces (UIs) in your web projects through
Compose Multiplatform and Kotlin/Wasm.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) is a declarative framework based on Kotlin
and [Jetpack Compose](https://developer.android.com/jetpack/compose) that allows you to implement the UI
once and share it across all the platforms you target. 

For web platforms, Compose Multiplatform uses 
Kotlin/Wasm as its compilation target. Applications built with Kotlin/Wasm and Compose Multiplatform use a 
`wasm-js` target and run in browsers.

Additionally, you can use the most popular Kotlin libraries in Kotlin/Wasm out of the box. Like in other Kotlin and Multiplatform
projects, you can include dependency declarations in the build script. For more information,
see [Adding dependencies on multiplatform libraries](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html).

Would you like to try it yourself?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm and WASI

Kotlin/Wasm uses the [WebAssembly System Interface (WASI)](https://wasi.dev/) for backend applications.
Applications built with Kotlin/Wasm and WASI use a Wasm-WASI target, allowing you to call the WASI API and run applications 
outside the browser environment.

Kotlin/Wasm leverages WASI to abstract away platform-specific details, allowing the same Kotlin code to run across diverse 
platforms. This expands the reach of Kotlin/Wasm beyond web applications without requiring custom handling for each runtime.

WASI provides a secure, standardized interface for running Kotlin applications compiled to WebAssembly across different environments.

> To see Kotlin/Wasm and WASI in action, check the [Get started with Kotlin/Wasm and WASI tutorial](wasm-wasi.md).
>
{style="tip"}

### WebAssembly Component Model
<primary-label ref="experimental-general"/>

> Support for the WebAssembly Component Model is currently available only in an EAP release: [Kotlin %kotlinEapVersion%](whatsnew-eap.md).
>
{style="note"}

WASI 0.2 is built on the [WebAssembly Component Model](https://github.com/WebAssembly/component-model), which defines a way to build components from Wasm modules using
standardized interfaces and types. The model lets you define language-agnostic components in applications or libraries.
You can also compose Wasm modules and existing components into new components.

To explore what's possible with the WebAssembly Component Model and Kotlin/Wasm, check out this demo of [a simple server built with `wasi:http`](https://github.com/Kotlin/sample-wasi-http-kotlin/).

<img src="kotlin-wasm-wasi-http.gif" alt="Kotlin/Wasm with WebAssembly Component Model" width="600"/>

## Kotlin/Wasm performance

Although Kotlin/Wasm is still in Beta, Compose Multiplatform running on Kotlin/Wasm already shows encouraging performance 
traits. You can see that its execution speed outperforms JavaScript and is approaching that of the JVM:

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

We regularly run benchmarks on Kotlin/Wasm, and these results come from our testing in a recent version of Google Chrome.

## Browser API support

The Kotlin/Wasm standard library provides declarations for browser APIs, including the DOM API.
With these declarations, you can directly use the Kotlin API to access and utilize various browser functionalities. 
For example, in your Kotlin/Wasm applications, you can use manipulation with DOM elements or fetch the API 
without defining these declarations from scratch. To learn more, see our [Kotlin/Wasm browser example](https://github.com/Kotlin/kotlin-wasm-browser-template).

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
