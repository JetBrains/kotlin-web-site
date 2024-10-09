[//]: # (title: Debug Kotlin/Wasm code)

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time.
>
{type="note"}

This tutorial demonstrates how to debug your [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
application built with [Kotlin/Wasm](wasm-overview.md). The tutorial guides you through running your application in Fleet 
and debugging it in both Fleet and the browser.

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

## Run and debug your application in Fleet

1. Open the `Greeting.kt` code file from the `composeApp/src/wasmJsMain/kotlin` directory.
2. Click the line numbers to set breakpoints on the code you want to inspect.
   In this example, we set the breakpoint on the line **5**. The number turns into a red circle.

   ![Breakpoints](wasm-fleet-breakpoints.png){width=600}

3. Open the `main.kt` code file from the `composeApp/src/wasmJsMain/kotlin` directory.
4. Click the **Run** button on the `main()` function line and select **Debug 'main'**.

   ![Application main file](wasm-fleet-main-file.png){width=600}

    Once the build is complete, the web application opens automatically in the browser.

    ![Click me](wasm-composeapp-browser-clickme.png){width=650}

    > You can also open the application manually by entering this URL in your browser: `http://localhost:8080/`. The port number
    > can vary because the 8080 port may be unavailable. You can find the actual port number printed in the Gradle build console.
    >
    {type="tip"}

5. Click on the **Click me!** button to interact with the application. You see the Compose Multiplatform logo.

   ![Wasm compose app](wasm-composeapp-browser.png){width=650}
   
   Interacting with the app triggers the execution of the code and opens the debugging pane in Fleet automatically. Otherwise, click
   **View | Tools | Debug** in the menu bar to open the debugging pane.

   The debugger pauses when the execution reaches a breakpoint.

   ![Debug pane](wasm-fleet-debug-pane.png){width=600}

6. In the debugging pane, use the debugging control buttons to inspect variables and code execution at the breakpoints:
    * ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} Step into to investigate a function more deeply.
    * ![Step into](wasm-debug-step-over.png){width=30}{type="joined"} Step over to execute the current line and pause on the next line.
    * ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} Step out to execute the code until it exits the current function.

7. Check the **Threads & Frames** and **Variables** panes to trace the sequence of function calls and pinpoint the location of any errors.

   ![Debug thread](wasm-fleet-debug-thread.png){width=600}    

8. Make changes to your code and run the application again (see step 4) to verify that everything works as expected.
9. Click on the line numbers with breakpoints to remove the breakpoints.

## Debug your application in the browser

You can debug this Compose Multiplatform application
in your browser out of the box, without additional configurations.

However, for other projects, you may need to configure additional settings in your Gradle
build file. For more information about how to configure your browser for debugging, expand the next section.

### Configure your browser for debugging {initial-collapse-state="collapsed"}

By default, browsers can't access some of the project's sources necessary for debugging. To provide access, you can configure the Webpack DevServer
to serve these sources. In the `ComposeApp` directory, add the following code snippets to your `build.gradle.kts` file.

Add this import as a top-level declaration:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

Add this code snippet inside the `commonWebpackConfig{}` block, located in the `wasmJs{}` target DSL and `browser{}` platform DSL within `kotlin{}`:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // Serve sources to debug inside browser
        add(project.projectDir.path)
        add(project.projectDir.path + "/commonMain/")
        add(project.projectDir.path + "/wasmJsMain/")
    }
}
```

The resulting code block looks like this:

```kotlin
kotlin {
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        moduleName = "composeApp"
        browser {
            commonWebpackConfig {
                outputFileName = "composeApp.js"
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    static = (static ?: mutableListOf()).apply {
                        // Serve sources to debug inside browser 
                        add(project.projectDir.path)
                        add(project.projectDir.path + "/commonMain/")
                        add(project.projectDir.path + "/wasmJsMain/")
                    }
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed"}

> Currently, you can't debug library sources.
> [We will support this in the future](https://youtrack.jetbrains.com/issue/KT-64685).
>
{type="note"}

### Debug in your browser

> This tutorial uses the Chrome browser, but you should be able to follow these steps with other browsers. For more information,
> see [Browser versions](wasm-troubleshooting.md#browser-versions).
>
{type="tip"}

Debugging in the browser is similar to debugging in Fleet, as the debugging pane consists of the same features and controls.

Once your application is [running](wasm-debugging.md#run-and-debug-your-application-in-fleet), open the debugging pane in the browser:

1. In the browser window of the application, right-click and select the **Inspect** action to access developer tools.
   Alternatively, you can use the **F12** shortcut or select **View** | **Developer** | **Developer Tools**.

2. In the **Sources** tab, select the `Greeting.kt` code file from the `composeApp/src/wasmJsMain/kotlin`directory. 
3. Click the line numbers to set breakpoints on the code you want to inspect.
   In this example, we set the breakpoint on the line **5**.

   ![Set breakpoints](wasm-breakpoints.png){width=700}

4. Debug the application as explained in steps 5, 6, 7, 8, and 9 from the
   [Run and debug the application in Fleet](wasm-debugging.md#run-and-debug-your-application-in-fleet) section.

   ![Check call stack](wasm-debug-scope.png){width=700}

## Leave feedback

We would appreciate any feedback you may have on your debugging experience!

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Provide your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).

## What's next?

* See Kotlin/Wasm debugging in action in this [YouTube video](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s).
* Try the Kotlin/Wasm examples from our `kotlin-wasm-examples` repository:
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)