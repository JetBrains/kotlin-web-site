[//]: # (title: Get started with Kotlin/Wasm in Fleet)

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time.
> 
> [Join the Kotlin/Wasm community.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{type="note"}

This tutorial demonstrates how to run a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 
app with [Kotlin/Wasm](wasm-overview.md) in Fleet, and generate artifacts to publish as a site on [GitHub pages](https://pages.github.com/).

## Before you start

Create a project using the Kotlin Multiplatform wizard:

1. Open the [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject).
2. On the **New Project** tab, change the project name and ID to your preference. In this tutorial, we set the name to "WasmDemo" and the ID to "wasm.project.demo".

   > These are the name and ID of the project directory. You can also leave them as they are.
   >
   {type="tip"}

3. Select the **Web** option. You don't need to select any other platform options for this tutorial.
4. Click the **Download** button and unpack the resulting archive.

   ![Kotlin Multiplatform wizard](wasm-compose-wizard.png){width=600}

## Open the project in Fleet

1. Download and install the latest version of [Fleet](https://www.jetbrains.com/fleet/).
2. On the Welcome screen of Fleet, click **Open File or Folder** or select **File | Open** in the menu bar.
3. Navigate to the unpacked "WasmDemo" folder and click **Open**.

## Run the application in Fleet

You can run your application in Fleet using one of the following approaches:

* In the top toolbar, click the **Run** button and select **composeApp[WasmJs]** from the run configurations list.

  ![Run configurations](wasm-fleet-run-configurations.png){width=650}

* In the terminal, run the following command from the `WasmDemo` root directory:

   ```bash
   ./gradlew wasmJsBrowserRun -t
   ```
  
* In the `main.kt` file from the `composeApp/src/wasmJsMain/kotlin` directory, run the `main()` function.
  Alternatively, use the **Shift + Cmd + R** shortcut to run it.

  ![Main function](wasm-fleet-main-function.png){width=650}

Once the build is complete, the web application opens automatically in the browser. 

> You can also open the application manually by entering this URL in your browser: `http://localhost:8080/`. The port number 
> can vary because the 8080 port may be unavailable. You can find the actual port number printed in the Gradle build console.
>
{type="tip"}

You see a "Click me!" button. Click it:

![Click me](wasm-composeapp-browser-clickme.png){width=650}

Now you see the Compose Multiplatform logo:

![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Generate artifacts

1. In the Fleet top toolbar, click the **Run** button and select **Gradle commands** from the run configurations list.

   ![Gradle commands](wasm-fleet-gradle-commands.png){width=600}

2. Select the `wasmJsBrowserDistribution` Gradle command. You can also type the command name in the 
   text field.

   ![Generate artifacts](wasm-fleet-generate-artifacts.png){width=600}

Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

```bash
./gradlew wasmJsBrowserDistribution
```

Once the application task completes, you can find the generated artifacts in the `composeApp/build/dist/wasmJs/productionExecutable`
directory:

![Artifacts directory](wasm-composeapp-directory.png){width=600}

## Publish on GitHub pages

1. Copy all the contents from your `productionExecutable` directory into the repository where you want to create your site.
2. Follow GitHub's instructions for [creating your site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site).

   > It can take up to 10 minutes for changes to your site to publish after you push the changes to GitHub.
   >
   {type="note"}

3. In a browser, navigate to your GitHub pages domain.

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   Congratulations! You have published your artifacts on GitHub pages.

## What's next?

Join the Kotlin/Wasm community in Kotlin Slack:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="700" alt="Join the Kotlin/Wasm community"/></a>

Try the Kotlin/Wasm examples from the `kotlin-wasm-examples` repository:

* [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
