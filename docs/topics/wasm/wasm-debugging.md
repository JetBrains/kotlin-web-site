[//]: # (title: Debug Kotlin/Wasm code)

<primary-label ref="beta"/> 

This tutorial demonstrates how to use IntelliJ IDEA and the browser 
to debug your [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)
application built with Kotlin/Wasm.

## Before you start

1. [Set up your environment for Kotlin Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html#set-up-the-environment).
2. Follow the instructions to [create a Kotlin Multiplatform project targeting Kotlin/Wasm](wasm-get-started.md#create-a-project).

## Debug in IntelliJ IDEA

The Kotlin Multiplatform project you created contains a Compose Multiplatform application powered by Kotlin/Wasm.
You can debug this application
in IntelliJ IDEA out of the box, without additional configurations.

> * Debugging Kotlin/Wasm code in IntelliJ IDEA is available starting from version 2025.3 of the IDE. If you created the
> `WasmDemo` project in a different version of IntelliJ IDEA, switch to version 2025.3 and open the project there 
> to continue this tutorial.
> * To debug Kotlin/Wasm code in IntelliJ IDEA, you must have the JavaScript Debugger plugin installed. [See more information
> about the plugin and how to install it.](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

1. In IntelliJ IDEA, open the Kotlin file to debug. In this tutorial, we'll work with the `Greeting.kt` file from the following directory
   of the Kotlin Multiplatform project:

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. Click on the line numbers to set breakpoints on the code that you want to inspect.

   ![Set breakpoints](wasm-breakpoints-intellij.png){width=650}

3. In the list of run configurations, select `wasmJsBrowserDevelopmentRun`.
4. Run the code in debug mode by clicking the debug icon at the top of the screen. Make sure
   you run the `wasmJsBrowserDevelopmentRun` configuration.

   ![Run in debug mode](wasm-debug-run-configurations.png){width=600}

   Once the application starts, it opens in a new browser window, and the **Debug** panel appears automatically in IntelliJ IDEA.

   ![Compose app in browser](wasm-composeapp-browser.png){width=600}

### Inspect your application

> If you're [debugging in your browser](#debug-in-your-browser), you can follow the same steps for inspecting your application.
>
{style="note"}

1. In the application's browser window, click on the **Click me!** button to interact with the application. This action triggers the execution of the
   code, and the debugger pauses when the execution reaches a breakpoint.

2. In the debugging pane, use the debugging control buttons to inspect variables and code execution at the breakpoints:
    * ![Step over](wasm-debug-step-over.png){width=30}{type="joined"} Step over to execute the current line and pause on the next line.
    * ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} Step into to investigate a function more deeply.
    * ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} Step out to execute the code until it exits the current function.

3. Check the **Threads & Variables** pane to trace the sequence of function calls and pinpoint the location of any errors.

   ![Check Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4. Make changes to your code and run the application again to verify that everything works as expected.
5. Click on the line numbers with breakpoints to remove the breakpoints.

## Debug in your browser

You can also debug this Compose Multiplatform application
in your browser without additional configuration. 

When you run development tasks (`*DevRun`), Kotlin automatically serves the source files to the browser,
allowing you to set breakpoints, inspect variables,
and step through Kotlin code without extra setup.

The configuration to serve the Kotlin/Wasm project sources in the browser is now included in the Kotlin Gradle plugin.
If you [previously added this configuration](whatsnew2220.md#support-for-debugging-in-browsers-without-configuration)
to your `build.gradle.kts` file, you should remove it to avoid conflicts.

> This tutorial uses the Chrome browser, but you should be able to follow these steps with other browsers. For more information,
> see [Browser versions](wasm-configuration.md#browser-versions).
>
{style="tip"}

1. Follow the instructions to [run the Compose Multiplatform application](wasm-get-started.md#run-the-application).

2. In the application's browser window, right-click and select the **Inspect** action to access developer tools.
   Alternatively, you can use the **F12** shortcut or select **View** | **Developer** | **Developer Tools**.

3. Switch to the **Sources** tab and select the Kotlin file to debug. In this tutorial, we'll work with the `Greeting.kt` file.

4. Click on the line numbers to set breakpoints on the code that you want to inspect. Only the lines
   with darker numbers can have breakpoints.

   ![Set breakpoints](wasm-breakpoints-browser.png){width=700}

5. Follow the instructions from Debugging in IntelliJ IDEA to [inspect your application](#inspect-your-application).

   > When debugging in your browser, the panes to trace the sequence of function
   > calls and pinpoint any errors are **Scope** and **Call Stack**.
   {style="tip"}

   ![Check the call stack](wasm-debug-scope.png){width=450}

### Use custom formatters

Custom formatters help display and locate variable values in a more user-friendly and comprehensible manner when debugging Kotlin/Wasm code
in your browser.

Custom formatters are enabled by default in development builds, but
you still need to ensure that custom formatters are enabled in your browser's developer tools:

* In Chrome DevTools, find the **Custom formatters** checkbox in **Settings | Preferences | Console**:

  ![Enable custom formatters in Chrome](wasm-custom-formatters-chrome.png){width=400}

* In Firefox DevTools, find the **Enable custom formatters** checkbox in **Settings | Advanced settings**:

  ![Enable custom formatters in Firefox](wasm-custom-formatters-firefox.png){width=400}

This feature is supported in Firefox and Chromium-based browsers as
it uses the [custom formatters API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html).

Given that custom formatters work by default only for Kotlin/Wasm development builds,
you need to adjust your Gradle configuration if you want to use them for production builds.
Add the following compiler option to the `wasmJs {}` block:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

## Leave feedback

We would appreciate any feedback you may have on your debugging experience!

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [get a Slack invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and provide your feedback directly to the developers in our [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel.
* Provide your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).

## What's next?

* See Kotlin/Wasm debugging in action in this [YouTube video](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s).
* Try more Kotlin/Wasm examples:
  * [KotlinConf application](https://github.com/JetBrains/kotlinconf-app)
  * [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Jetsnack application](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
  * [Node.js example](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI example](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose example](https://github.com/Kotlin/kotlin-wasm-compose-template)
