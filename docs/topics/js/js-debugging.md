[//]: # (title: Debug Kotlin/JS - tutorial)

This tutorial shows how to debug Kotlin/JS code using different tools and execution environments: browser, IDE, and Node.js.

JavaScript [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) provide mappings between
the minified code produced by bundlers or minifiers and the actual source code a developer works with. This way, source
maps enable support for debugging the code during its execution.

Kotlin/JS Gradle plugin automatically generates source maps for the project builds, so they are available automatically
without any additional configuration.

## Debug in browser

Most modern browsers provide tools that allow inspecting the page content and debugging the code that executes
on it. Refer to your browser's documentation for the detailed information about its developer tools.

To debug Kotlin/JS in the browser:

1. Run the project by calling one of the available `*Run` Gradle tasks, for example, `browserDevelopmentRun` or
   `jsBrowserDevelopmentRun` in a multiplatform project.
   Learn more in [this tutorial](running-kotlin-js.md#run-the-browser-target).
2. Navigate to the page in the browser and launch its developer tools, for example, by right-clicking and
   selecting the **Inspect** action.
3. If your program is logging information to the console, navigate to the **Console** tab to see this output.
   Depending on your browser, these logs can reference the Kotlin source files and lines they come from:

   ![Chrome DevTools console](devtools-console.png)
   {width="600"}

4. Click the file reference on the right to navigate to the corresponding line of code.
   Alternatively, you can manually switch to the **Sources** tab, and find the file you need in the file tree. Navigating
   to the Kotlin file shows you the regular Kotlin code (as opposed to minified JavaScript):

   ![Debugging in Chrome DevTools](devtools-sources.png)
   {width="600"}

You can now start debugging the program. For example, set a breakpoint by clicking on one of the line numbers.
The developer tools even support setting breakpoints within a statement. As with regular JavaScript code, any set
breakpoints will persist across page reloads. This also makes it possible to debug Kotlin's main method which is executed
when the script is loaded for the first time.

## Debug in the IDE

[IntelliJ IDEA](https://www.jetbrains.com/idea/) provides a powerful set of tools for debugging code during the development.

For debugging Kotlin/JS in IntelliJ IDEA, you'll need a **Debug JavaScript** debug configuration. To add such a configuration:

1. Go to **Run | Edit configurations**.
2. Click **+** and select **JavaScript debug**.
3. Specify the configuration **Name** and provide the **URL** on which the project runs (`http://localhost:8080` by default).

   ![JavaScript debug configuration](debug-config.png)
   {width="600"}

4. Save the configuration.

Now you're ready to debug your project:

1. Run the project by calling one of the available `*Run` Gradle tasks, for example, `browserDevelopmentRun` or
   `jsBrowserDevelopmentRun` in a multiplatform project.
   Learn more in [this tutorial](running-kotlin-js.md#run-the-browser-target).
2. Start the debugging session by running the JavaScript debug configuration you've created previously:

   ![JavaScript debug configuration](debug-config-run.png)
   {width="600"}

3. You can see the console output of your program in the **Debug** window in IntelliJ IDEA. The output items reference the
   Kotlin source files and lines they come from:

   ![JavaScript debug output in IDE](ide-console-output.png)
   {width="600"}

4. Click the file reference on the right to navigate to the corresponding line of code.

You can now start debugging the program using the whole set of tools that the IDE offers: breakpoints, stepping, expression
evaluation, [coroutine debugger](debug-coroutines-with-idea.md) and more. Learn more about [debugging in IntelliJ IDEA](https://www.jetbrains.com/help/idea/debugging-code.html).

## Debug in Node.js

If your projects targets Node.js, you can debug it right in this runtime.

To debug a Kotlin/JS application targeting Node.js:

1. Build the project by running the `build` Gradle task.
2. Find the resulting `.js` file for executing in Node.js in the `build/js/packages/your-module/kotlin/` directory inside
   your project's directory.
3. Debug it in Node.js as described in the [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## What's next?

Now when you know how to start debug sessions with your Kotlin/JS project, learn to make efficient use of the debugging tools:

* Learn how to [debug JavaScript in Google Chrome](https://developer.chrome.com/docs/devtools/javascript/)
* Get familiar with [IntelliJ IDEA debugger](https://www.jetbrains.com/help/idea/debugging-code.html)
* Learn how to [debug in Node.js](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## If you run into any problems

If you face any issues with debugging Kotlin/JS, please report them to our issue tracker, [YouTrack](https://kotl.in/issue)