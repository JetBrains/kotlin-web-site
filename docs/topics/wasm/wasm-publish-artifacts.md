[//]: # (title: Publish artifacts)

> Kotlin/Wasm is an [Alpha](components-stability.md) feature. It may be dropped or changed at any time. It is available only starting with [Kotlin 1.8.20](releases.md).
>
{type="note"}

With Kotlin/Wasm, you can generate artifacts to publish as a site on static hosting services. This tutorial
demonstrates how to generate artifacts for a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
 app and publish them as a site on [GitHub pages](https://pages.github.com/).

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. Clone the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples/) repository
   by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA.

   You can also clone it from the command line:

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-examples.git
   ```

## Generate artifacts

1. In IntelliJ IDEA, a **Gradle build scripts found** notification appears. Click **Load**.
  > You need at least Java 11 as your Gradle JVM for the examples to load successfully.
  >
  {type="note"}

2. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.
3. In **compose-example** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserDistribution** task.

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

3. In a browser, navigate to your GitHub pages domain and click **Hello World!**.

   ![Click hello world in browser](wasm-composeapp-browser-hello.png){width=650}

   You see the Compose Multiplatform logo:
   
   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

   Congratulations! You have published your artifacts on GitHub pages.

## What's next?

Explore a more complex example by generating artifacts for the [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack).
