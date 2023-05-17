[//]: # (title: Kotlin Wasm)

> Kotlin Wasm is [Experimental](components-stability.md).
> It may be changed at any time. Use it only for evaluation purposes.
> 
> We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

[WebAssembly (Wasm)](https://webassembly.org) is a binary instruction format for a stack-based virtual machine.
This format is platform-independent because it runs on its own virtual machine.
Wasm is designed to be fast and secure, and it can compile code from various programming languages, including Kotlin.

Kotlin/Wasm is a new compilation target for Kotlin. You can use it in your Kotlin Multiplatform projects.
With Kotlin/Wasm, you can create applications that run on different environments and devices supporting WebAssembly and meeting Kotlin's requirements.

You can use Kotlin standard library (`stdlib`) and test library (`kotlin.test`) for Kotlin/Wasm out of the box.

> Learn more about Kotlin/Wasm in the ["Introducing Kotlin/Wasm" video by Zalim Bashorov & Sébastien Deleuze @ Wasm I/O 2023](https://www.youtube.com/watch?v=LCtMC_IVCKo).
> 
{type="note"}

## Browser support

Almost all major browsers already support WebAssembly 1.0.
To run applications built with Kotlin/Wasm in a browser, you need to enable an experimental [garbage collection feature](https://github.com/WebAssembly/gc).

[Learn how to enable Kotlin/Wasm in Get started with Kotlin/Wasm](wasm-get-started.md#troubleshooting).

## Interoperability

Kotlin/Wasm allows you to both use JavaScript code and Browser API from Kotlin, and Kotlin code from JavaScript.

[Learn more about Kotlin Wasm interoperability with JavaScript](wasm-js-interop.md).

## Compose Multiplatform for Web 

> Web support is [Experimental](components-stability.md) and may be changed at any time. Use it only for evaluation purposes.
> We would appreciate your feedback on it in the public Slack channel [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web).
> If you face any issues, please report them on [GitHub](https://github.com/JetBrains/compose-multiplatform/issues).
>
{type="warning"}

Compose Multiplatform for Web is based on new Kotlin/Wasm target.
You can create a Kotlin Multiplatform project and experiment with sharing your mobile or desktop UIs with the web.
With Compose Multiplatform for Web, you can run your code in the browser with all the benefits of WebAssembly.

## How to get started

* [Get started with Kotlin/Wasm in IntelliJ IDEA](wasm-get-started.md)
* Check out the [GitHub repository with Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples)

## Feedback

* Provide your feedback directly to developers in Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  and join the [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Report any problems you faced with Kotlin/Wasm on [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-56492).
