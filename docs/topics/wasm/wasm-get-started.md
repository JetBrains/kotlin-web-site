[//]: # (title: Get started with Kotlin/Wasm in IntelliJ IDEA)

> Kotlin/Wasm is an [Alpha](components-stability.md) feature. It may be dropped or changed at any time. It is available only starting with [Kotlin 1.8.20](releases.md).
>
> [Join the Kotlin/Wasm community](https://slack-chats.kotlinlang.org/c/webassembly).
> 
{type="note"}

This tutorial demonstrates how to run a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 
app with Kotlin/Wasm in IntelliJ IDEA, and generate artifacts to publish as a site on [GitHub pages](https://pages.github.com/).

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. Clone the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples/tree/main) repository 
  by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA.

   You can also clone it from the command line:

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-examples.git
   ```
   
> Alternatively, you can use our experimental [web wizard](https://kmpwasm.jetbrains.com/) to download a sample project.
>
{type="note"}

## Run the application

1. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.

   > You need at least Java 11 as your Gradle JVM for the examples to load successfully.
   >
   {type="note"}

2. In the **compose-example** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserRun** task.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=650}

    Alternatively, you can run the following command in the terminal from the `compose-example` directory:

   ```bash
   ./gradlew wasmJsBrowserRun -t
   ```

3. Once the application starts, open the following URL in your browser:

   ```bash
   http://localhost:8081/
   ```

   You see a "Hello World!" button. Click it:

   ![Click hello world](wasm-composeapp-browser-hello.png){width=650}

   You see the Compose Multiplatform logo:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Generate artifacts

In **compose-example** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserDistribution** task.

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=650}

Alternatively, you can run the following command in the terminal from the `compose-example` directory:

```bash
./gradlew wasmJsBrowserDistribution
```
Once the application task completes, you can find the generated artifacts in the `composeApp/build/dist/wasmJs/productionExecutable`
folder:

![Artifacts directory](wasm-composeapp-directory.png){width=600}

## Publish on GitHub pages

1. Copy all the contents in your `productionExecutable` directory into the repository where you want to create a site.
2. Follow GitHub's instructions for [creating your site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site).

> It can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.
>
{type="note"}

3. In a browser, navigate to your GitHub pages domain.

   ![Navigate to GitHub pages](wasm-composeapp-github-hello.png){width=650}

   Congratulations! You have published your artifacts on GitHub pages.

## What's next?

Try other Kotlin/Wasm examples from the `kotlin-wasm-examples` repository:

* [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)