[//]: # (title: Debug Kotlin/Wasm code)

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time.
>
{type="note"}

This tutorial demonstrates how to use your browser to debug your [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
application built with Kotlin/Wasm.

## Before you start

Create a project using the Kotlin Multiplatform wizard:

1. Open the [Kotlin Multiplatform wizard](https://kmp.jetbrains.com/#newProject).
2. On the **New Project** tab, change the project name and ID to your preference. In this tutorial, we set the name to "WasmDemo" and the ID to "wasm.project.demo".

   > These are the name and ID of the project directory. You can also leave them as they are.
   >
   {type="tip"}

3. Select the **Web** option. Make sure that no other options are selected.
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

   > The port number can vary because the 8080 port may be unavailable. You can find the actual port number printed
   > in the Gradle build console.
   >
   {type="tip"}

   You see a "Click me!" button. Click it:

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   Now you see the Compose Multiplatform logo:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Debug in your browser

> Currently, debugging is only available in your browser. In the future, you will be able to debug your code in 
> [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) and 
> [Fleet](https://youtrack.jetbrains.com/issue/KT-64684). 
>
{type="note"}

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
        add(project.rootDir.path)
        add(project.projectDir.path)
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
                        add(project.rootDir.path)
                        add(project.projectDir.path)
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

### Debug your Kotlin/Wasm application

> This tutorial uses the Chrome browser, but you should be able to follow these steps with other browsers. For more information,
> see [Browser versions](wasm-troubleshooting.md#browser-versions).
> 
{type="tip"}

1. In the browser window of the application, right-click and select the **Inspect** action to access developer tools.
   Alternatively, you can use the **F12** shortcut or select **View** | **Developer** | **Developer Tools**.

2. Switch to the **Sources** tab and select the Kotlin file to debug. In this tutorial, we'll work with the `Greeting.kt` file.

3. Click on the line numbers to set breakpoints on the code that you want to inspect. Only the lines
   with darker numbers can have breakpoints.

![Set breakpoints](wasm-breakpoints.png){width=700}

4. Click on the **Click me!** button to interact with the application. This action triggers the execution of the 
   code, and the debugger pauses when the execution reaches a breakpoint.

5. In the debugging pane, use the debugging control buttons to inspect variables and code execution at the breakpoints:
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} Step into to investigate a function more deeply.
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} Step over to execute the current line and pause on the next line.
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} Step out to execute the code until it exits the current function.

![Debug controls](wasm-debug-controls.png){width=700}

6. Check the **Call stack** and **Scope** panes to trace the sequence of function calls and pinpoint the location of any errors.

![Check call stack](wasm-debug-scope.png){width=700}

7. Make changes to your code and [run the application](#run-the-application) again to verify that everything works as expected.
8. Click on the line numbers with breakpoints to remove the breakpoints.

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
