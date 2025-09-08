[//]: # (title: Get started with Kotlin/Wasm and Compose Multiplatform)

<primary-label ref="beta"/> 

This tutorial demonstrates how to run a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 
app with [](wasm-overview.md) in IntelliJ IDEA and generate artifacts to publish as part of a website.

## Create a project

1. [Set up your environment for Kotlin Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment).
2. In IntelliJ IDEA, select **File | New | Project**.
3. In the panel on the left, select **Kotlin Multiplatform**.

   > If you're not using the Kotlin Multiplatform IDE plugin, you can generate the same project using the [KMP web wizard](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true).
   >
   {style="note"}

4. Specify the following fields in the **New Project** window:

   * **Name:** WasmDemo
   * **Group:** wasm.project.demo
   * **Artifact:** wasmdemo

   > If you use the web wizard, specify "WasmDemo" as Project Name and "wasm.project.demo" as Project ID.
   >
   {style="note"}

5. Select the **Web** target. Make sure that no other options are selected.
6. Click **Create**.

   ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## Run the application

Once the project loads, select **composeApp [wasmJs]** in the list of run configurations and click **Run**.

![Run the Compose Multiplatform app on web](compose-run-web-black.png){width=300}

The web application opens automatically in your browser. Alternatively, you can open the following URL in your browser when the run is finished:

```shell
   http://localhost:8080/
```
> The port number can vary because the 8080 port may be unavailable.
> You can find the actual port number in the output of the Gradle build.
>
{style="tip"}

Click the "Click me!" button:

![Click me](wasm-composeapp-browser-clickme.png){width=600}

It reveals the Compose Multiplatform logo:

![Compose app in browser](wasm-composeapp-browser.png){width=600}

## Generate artifacts

Generate your project's artifacts to publish on a website:

1. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.
2. In **wasmdemo** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserDistribution** task.

   > You need at least Java 11 as your Gradle JVM for the tasks to load successfully, and we recommend at least 
   > Java 17 for Compose Multiplatform projects in general.
   >
   {style="note"}

   ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

   Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

Once the application task completes, you can find the generated artifacts in the `composeApp/build/dist/wasmJs/productionExecutable`
directory:

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## Publish the application

Use the generated artifacts to deploy your Kotlin/Wasm application. 
Select a publishing option of your preference
and follow the instructions to deploy the artifacts. 
Some alternatives are:

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

Once your site is created, open the browser and navigate to your platform's page domain. For example, GitHub pages:

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   Congratulations! You have published your artifacts.

## What's next?

* [Learn how to share UIs between iOS and Android using Compose Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
* Try more Kotlin/Wasm examples:

  * [KotlinConf application](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI example](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)

* Join the Kotlin/Wasm community in Kotlin Slack:

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>