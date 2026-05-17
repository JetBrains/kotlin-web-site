[//]: # (title: Get started with Kotlin/Wasm and Compose Multiplatform)

<primary-label ref="beta"/> 

This tutorial demonstrates how to run a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 
app with [](wasm-overview.md) in IntelliJ IDEA and generate artifacts you can publish as a website.

## Create a project

1. [Set up your environment for Kotlin Multiplatform development](https://kotlinlang.org/docs/multiplatform/quickstart.html#set-up-the-environment).
2. In IntelliJ IDEA, select **File | New | Project**.
3. In the list of project templates, select **Kotlin Multiplatform**.

   > If you're not using the Kotlin Multiplatform IDE plugin, you can generate the same project using the [KMP web wizard](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true).
   >
   {style="tip"}

4. Specify the following fields in the **New Project** window:

   * **Name:** WasmDemo
   * **Project ID:** wasm.project.demo

   > This tutorial uses `wasm.project.demo` as the Project ID for consistency. 
   > However, we recommend keeping your usual Project ID, such as `org.example`.
   > Whatever you enter here will be suggested as the default in future projects.
   >
   {style="note"}

5. Select the **Web** target and the **Share UI** tab. Make sure that no other options are selected.
6. Click **Create**.

   ![Kotlin Multiplatform wizard](wasm-kmp-wizard.png){width=600}

## Run the application

1. Once the project loads, select **webApp [wasmJs]** in the list of run configurations and click **Run**.

    ![Run the Compose Multiplatform app on web](compose-run-web-light.png){width=300}
    
    The web application opens automatically in your browser. 
    Alternatively, once the build finishes, you can open the following URL manually:
    
    ```shell
       http://localhost:8080/
    ```
    
    The port number may vary if port `8080` is already in use.
    You can find the actual port number in the output of the Gradle build.

2. Click the **Click me!** button:

    ![Click me](wasm-composeapp-browser-clickme.png){width=600}
    
    This reveals the Compose Multiplatform logo:
    
    ![Compose app in browser](wasm-composeapp-browser.png){width=600}

## Generate artifacts

Generate your project's artifacts to publish on a website:

1. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.
2. In **WasmDemo** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserDistribution** task.

   > You need at least Java 11 as your Gradle JVM for the tasks to load successfully.
   > For Compose Multiplatform projects in general, we recommend Java 17 or later.
   >
   {style="note"}

   ![Run the Gradle task](wasm-gradle-task-window-compose.png){width=400}

   Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

Once the task completes, you can find the generated artifacts in the `webApp/build/dist/wasmJs/productionExecutable`
directory:

![Artifacts directory](wasm-composeapp-directory.png){width=400}

## Publish the application

Use the generated artifacts to deploy your Kotlin/Wasm application. 
Select a publishing option of your preference and follow the instructions:

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

Once your site is created, open the browser and navigate to your platform's page domain. For example, GitHub pages:

   ![Navigate to GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   Congratulations! You have published your artifacts.

## What's next?

* [Learn how to share UIs between iOS and Android using Compose Multiplatform](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* Try more Kotlin/Wasm examples:

  * [KotlinConf application](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI example](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)

* Join the Kotlin/Wasm community in Kotlin Slack:

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>