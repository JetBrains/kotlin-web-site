[//]: # (title: Get started with Kotlin/Wasm and Compose Multiplatform)

> Kotlin/Wasm is in [Alpha](components-stability.md). It may be changed at any time.
> 
> [Join the Kotlin/Wasm community.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

This tutorial demonstrates how to run a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 
app with [Kotlin/Wasm](wasm-overview.md) in IntelliJ IDEA, and generate artifacts to publish as a site on [GitHub pages](https://pages.github.com/).

## Before you start

Create a project using the Kotlin Multiplatform wizard:

1. Open the [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject).
2. On the **New Project** tab, change the project name and ID to your preference. In this tutorial, we set the name to "WasmDemo" and the ID to "wasm.project.demo".

   > These are the name and ID of the project directory. You can also leave them as they are.
   >
   {style="tip"}

3. Select the **Web** option. Make sure that no other options are selected.
4. Click the **Download** button and unpack the resulting archive.

![Kotlin Multiplatform wizard](wasm-compose-web-wizard.png){width=400}

## Open the project in IntelliJ IDEA

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. On the Welcome screen of IntelliJ IDEA, click **Open** or select **File | Open** in the menu bar.
3. Navigate to the unpacked "WasmDemo" folder and click **Open**.

## Run the application

1. In IntelliJ IDEA, open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.
   
   You can find the Gradle tasks in the Gradle tool window once the project loads.

   > You need at least Java 11 as your Gradle JVM for the tasks to load successfully.
   >
   {style="note"}

2. In **composeApp** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserRun** task.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=600}

   Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

   ```bash
   ./gradlew wasmJsBrowserRun -t
   ```

3. Once the application starts, open the following URL in your browser:

   ```bash
   http://localhost:8080/
   ```

   > The port number can vary because the 8080 port may be unavailable. You can find the actual port number printed
   > in the Gradle build console.
   >
   {style="tip"}

   You see a "Click me!" button. Click it:

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   Now you see the Compose Multiplatform logo:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Generate artifacts

In **composeApp** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserDistribution** task.

![Run the Gradle task](wasm-gradle-task-window-compose.png){width=600}

Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

```bash
./gradlew wasmJsBrowserDistribution
```

Once the application task completes, you can find the generated artifacts in the `composeApp/build/dist/wasmJs/productionExecutable`
directory:

![Artifacts directory](wasm-composeapp-directory.png){width=600}

## Publish on GitHub pages

1. Copy all the contents in your `productionExecutable` directory into the repository where you want to create a site.
2. Follow GitHub's instructions for [creating your site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site).

   > It can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.
   >
   {style="note"}

3. In a browser, navigate to your GitHub pages domain.

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   Congratulations! You have published your artifacts on GitHub pages.

## What's next?

Join the Kotlin/Wasm community in Kotlin Slack:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

Try more Kotlin/Wasm examples:

* [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)