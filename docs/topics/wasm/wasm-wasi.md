[//]: # (title: Get started with Kotlin/Wasm and WASI)

> Kotlin/Wasm is in [Alpha](components-stability.md). It may be changed at any time.
>
> [Join the Kotlin/Wasm community.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

This tutorial demonstrates how to run a simple [Kotlin/Wasm](wasm-overview.md) application using the [WebAssembly System Interface (WASI)](https://wasi.dev/) 
in various WebAssembly virtual machines.

You can find examples of an application running on [Node.js](https://nodejs.org/en), [Deno](https://deno.com/),
and [WasmEdge](https://wasmedge.org/) virtual machines. The output is a simple application that uses the standard WASI API.

Currently, Kotlin/Wasm supports WASI 0.1, also known as Preview 1.
[Support for WASI 0.2 is planned for future releases](https://youtrack.jetbrains.com/issue/KT-64568).

> The Kotlin/Wasm toolchain provides Node.js tasks (`wasmWasiNode*`) out of the box.
> Other task variants in the project, such as those utilizing Deno or WasmEdge, are included as custom tasks.
>
{style="tip"}

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).

2. Clone the [Kotlin/Wasm WASI template repository](https://github.com/Kotlin/kotlin-wasm-wasi-template) by selecting 
   **File | New | Project from Version Control** in IntelliJ IDEA.

   You can also clone it from the command line:
   
   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## Run the application

1. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**. 
   
   In the **Gradle** tool window, you can find the Gradle tasks under **kotlin-wasm-wasi-example** once the project loads.

   > You need at least Java 11 as your Gradle JVM for the tasks to load successfully.
   >
   {style="note"}

2. From **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node**, select and run one of the following Gradle tasks:

   * **wasmWasiNodeRun** to run the application in Node.js.
   * **wasmWasiDenoRun** to run the application in Deno.
   * **wasmWasiWasmEdgeRun** to run the application in WasmEdge.

     > When using Deno on a Windows platform, ensure `deno.exe` is installed. For more information,
     > see [Deno's installation documentation](https://docs.deno.com/runtime/manual/getting_started/installation).
     >
     {style="tip"}

   ![Kotlin/Wasm and WASI tasks](wasm-wasi-gradle-task.png){width=600}
   
Alternatively, run one of the following commands 
in the terminal from the ` kotlin-wasm-wasi-template` root directory:

* To run the application in Node.js:

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* To run the application in Deno:

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* To run the application in WasmEdge:

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

  The terminal displays a message when your application is built successfully:

  ![Kotlin/Wasm and WASI app](wasm-wasi-apps.png){width=600}

## Test the application

You can also test that the Kotlin/Wasm application works correctly across various virtual machines.

In the Gradle tool window, run one of the following Gradle tasks from **kotlin-wasm-wasi-example** | **Tasks** | **verification**:

* **wasmWasiNodeTest** to test the application in Node.js.
* **wasmWasiDenoTest** to test the application in Deno.
* **wasmWasiWasmEdgeTest** to test the application in WasmEdge.

![Kotlin/Wasm and WASI test tasks](wasm-wasi-test-task.png){width=600}

Alternatively, run one of the following commands
in the terminal from the ` kotlin-wasm-wasi-template` root directory:
    
* To test the application in Node.js:

  ```bash
  ./gradlew wasmWasiNodeTest
  ```
   
* To test the application in Deno:
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* To test the application in WasmEdge:

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

You can see the test results:

![Kotlin/Wasm and WASI test](wasm-wasi-test-result.png){width=600}

## What's next?

Join the Kotlin/Wasm community in Kotlin Slack:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="700" alt="Join the Kotlin/Wasm community" style="block"/></a>

Try more Kotlin/Wasm examples:

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)