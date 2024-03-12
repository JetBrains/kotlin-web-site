[//]: # (title: Debug Kotlin/Wasm code)

> Kotlin/Wasm is in [Alpha](components-stability.md). It may be changed at any time.
>
{type="note"}

This tutorial demonstrates how to debug in the browser a [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
application built with Kotlin/Wasm.

## Before you start

Create a project using the Kotlin Multiplatform wizard:

1. Open the [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject).
2. On the **New Project** tab, you can change the project name to "WasmDemo" and the project ID to "wasm.project.demo".
3. Select the **Web** option.
4. Click the **Download** button and unpack the resulting archive.

![Kotlin Multiplatform wizard](wasm-compose-wizard.png){width=600}

## Open the project in IntelliJ IDEA

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. On the Welcome screen of IntelliJ IDEA, click **Open** or select **File | Open** in the menu bar.
3. Navigate to the unpacked "WasmDemo" folder and click **Open**.

## Run the application

1. In IntelliJ IDEA, open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.

   > You need at least Java 11 as your Gradle JVM for the tasks to load successfully.
   >
   {type="note"}

2. In **composeApp** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserRun** task.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=600}

   Alternatively, you can run the following command in the terminal from the `WasmDemo` root directory:

   ```bash
   ./gradlew wasmJsBrowserRun
   ```

3. Once the application starts, open the following URL in your browser:

   ```bash
   http://localhost:8080/
   ```

   >The port number can vary because the 8080 port may be unavailable. You can find the actual port number printed
   > in the Gradle build console.
   >
   {type="tip"}

   You can see a "Click me!" button. Click it:

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   Now you can see the Compose Multiplatform logo:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Debug in the browser

> Currently, debugging is only available in the browser. Debugging in 
> [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) and 
> [Fleet](https://youtrack.jetbrains.com/issue/KT-64684) is in the plan. 
>
{type="note"}

You can debug this Compose Multiplatform application
in your browser out of the box without additional configurations. 

However, for other projects, you may need to set the required configuration in the Gradle 
build file. For more information, see [Configuration for debugging](#configuration-for-debugging).

> For this tutorial, we are using Chrome. If you use a different browser, the experience should be similar and the following 
> steps should also work. 
> 
{type="tip"}

To debug a Kotlin/Wasm application:

1. In the browser window of the application, access developer tools by right-clicking and selecting the **Inspect** action.
Alternatively, you can use the **F12** shortcut or select **View** | **Developer** | **Developer Tools**.

2. Switch to the **Sources** tab and select the Kotlin file to debug. In this tutorial, we'll work with the `Greeting.kt` file.

3. Set breakpoints in the Kotlin file by clicking on the numbers of the code lines you want to inspect. Only the code lines 
with darker numbers accept breakpoints.

![Set breakpoints](wasm-breakpoints.png){width=700}

4. Interact with the application by clicking on the **Click me!** button. This action triggers the execution of the 
code, and the debugger pauses when the execution reaches a breakpoint.

5. Inspect variables and code execution at the breakpoints by using debugging control buttons such as: 
   * Step into to investigate a function deeper
   * Step over to execute the current line and pause on the next line
   * Step out to execute the code until it exits the current function

![Debug controls](wasm-debug-controls.png){width=700}

6. Check the **Call stack** and **Scope** tool windows to trace the sequence of function calls and pinpoint the location of any errors.

![Check call stack](wasm-debug-scope.png){width=700}

7. Make the required changes to the code and [run the application](#run-the-application) again.

### Configuration for debugging

By default, browsers lack access to the project sources necessary for debugging. To gain access, you can configure the Webpack DevServer 
to serve these sources. Add the following code snippet to the Gradle build file inside the `ComposeApp` directory:

```kotlin
// Add this line in the dependencies block
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig

// Add these lines inside commonWebpackConfig{}
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.projectDir.path)
        add(project.projectDir.path + "/commonMain/")
        add(project.projectDir.path + "/wasmJsMain/")
    }
}
```

> Debugging sources of libraries is currently 
> unavailable. [We are working on addressing this limitation](https://youtrack.jetbrains.com/issue/KT-64685).
>
{type="note"}

## Leave feedback

* ![Slack](slack.svg){width=25}{type="joined"} Slack: provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel. [Get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
* Provide your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).

## What's next?

* See Kotlin/Wasm debugging in action in this [YouTube video](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s).
* Try the Kotlin/Wasm examples from our `kotlin-wasm-examples` repository:
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)