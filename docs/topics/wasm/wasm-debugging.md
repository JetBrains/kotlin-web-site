[//]: # (title: Debug Kotlin/Wasm code)

> Kotlin/Wasm is in [Alpha](components-stability.md). It may be changed at any time.
>
{type="note"}

This tutorial demonstrates how to debug a web application built with Kotlin/Wasm, based on a 
[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) example from our 
`kotlin-wasm-examples` [repository](https://github.com/Kotlin/kotlin-wasm-examples/tree/main).

## Before you start

1. Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. Clone the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples/tree/main) repository
   by selecting **File** | **New** | **Project from Version Control** in IntelliJ IDEA.

   You can also clone it from the command line:

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-examples.git
   ```

> Alternatively, you can use our experimental [web wizard](https://kmp.jetbrains.com/) to download a sample project.
>
{type="note"}

## Run the application

1. In IntelliJ IDEA, a **Gradle build scripts found** notification appears. Click **Load**. 

2. Open the **Gradle** tool window by selecting **View** | **Tool Windows** | **Gradle**.

   > You need at least Java 11 as your Gradle JVM for the examples to load successfully.
   >
   {type="note"}

3. In **compose-example** | **Tasks** | **kotlin browser**, select and run the **wasmJsBrowserRun** task.

   ![Run the Gradle task](wasm-gradle-task-window.png){width=650}

    You can also run the following command in the terminal from the `compose-example` directory:

   ```bash
   ./gradlew wasmJsBrowserRun
   ```
   >Alternatively, you can load **compose-example** by opening it directly from the file explorer in **File | Open**.
   >
   {type="note"}

4. Once the application starts, open the following URL in your browser:

   ```bash
   http://localhost:8080/
   ```
   
   > The port number can vary. If the 8080 port is unavailable, you can find the corresponding port number printed in the console
   > after building the application.
   >
   {type="tip"}

   You see a **Hello World!** button. Click it:

   ![Click hello world](wasm-composeapp-browser-hello.png){width=650}

   You see the Compose Multiplatform logo:

   ![Compose app in browser](wasm-composeapp-browser.png){width=650}

## Debug in the browser

> Currently, debugging is only available in the browser. Debugging in 
> [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA) and 
> [Fleet](https://youtrack.jetbrains.com/issue/KT-64684) is in the plan. 
>
{type="note"}

You can debug this Compose Multiplatform application and the rest of the [Kotlin/Wasm examples](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
in your browser out of the box without additional configurations. However, for other projects, you may need to set the required configuration in the Gradle 
build file. For more information, see [Configuration for debugging](#configuration-for-debugging).

For this tutorial, we are using Chrome. If you use a different browser, the experience should be similar and the following 
steps should also work. 

To debug a Kotlin/Wasm application:

1. In the browser window of the application, access developer tools by right-clicking and selecting the **Inspect** action.
Alternatively, you can use the **Fn + F12** shortcut.

2. Switch to the **Sources** tab and find the Kotlin file to debug.

3. Set breakpoints in the Kotlin file by clicking on the numbers of the code lines you want to inspect. Only the code lines 
with darker numbers accept breakpoints.

![Set breakpoints](wasm-breakpoints.png){width=700}

4. Interact with the application by clicking on the **Hello World!** button. This action triggers the execution of the 
code, and the debugger pauses at each breakpoint.

5. Inspect variables and code execution at the breakpoints by using the debugging control buttons (step over, step into, step out, and more).

![Debug controls](wasm-debug-controls.png){width=700}

6. Check the **Call stack** and **Scope** tool windows to trace the sequence of function calls and pinpoint the location of any errors.

![Check call stack](wasm-debug-scope.png){width=700}

7. Make the required changes to the code and [run the application](#run-the-application) again.

### Configuration for debugging

In projects requiring additional debugging configuration, you need to allow Webpack servers to access your sources. 
Add the following code snippet to the Gradle build file:

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
> unavailable. [We are working to address this limitation](https://youtrack.jetbrains.com/issue/KT-64685).
>
{type="note"}

## Leave feedback

* ![Slack](slack.svg){width=25}{type="joined"} Slack: provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel. [Get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
* Report any issues in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).

## What's next?

* See Kotlin/Wasm debugging in action in this [YouTube video](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s).
* Try other Kotlin/Wasm examples from the `kotlin-wasm-examples` repository:
   * [Compose image viewer](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack application](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)