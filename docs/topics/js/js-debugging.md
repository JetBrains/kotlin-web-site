[//]: # (title: Debug Kotlin/JS code)

JavaScript [source maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) provide mappings between
the minified code produced by bundlers or minifiers and the actual source code a developer works with. This way, the source
maps enable support for debugging the code during its execution.

The Kotlin/JS Gradle plugin automatically generates source maps for the project builds, making them available without any additional configuration.

## Debug in browser

Most modern browsers provide tools that allow inspecting the page content and debugging the code that executes
on it. Refer to your browser's documentation for more details.

To debug Kotlin/JS in the browser:

1. Run the project by calling one of the available `*Run` Gradle tasks, for example, `browserDevelopmentRun` or
   `jsBrowserDevelopmentRun` in a multiplatform project.
   Learn more about [running Kotlin/JS](running-kotlin-js.md#run-the-browser-target).
2. Navigate to the page in the browser and launch its developer tools (for example, by right-clicking and
   selecting the **Inspect** action). Learn how to [find the developer tools](https://balsamiq.com/support/faqs/browserconsole/)
   in popular browsers.
3. If your program is logging information to the console, navigate to the **Console** tab to see this output.
   Depending on your browser, these logs can reference the Kotlin source files and lines they come from:

![Chrome DevTools console](devtools-console.png){width="600"}

4. Click the file reference on the right to navigate to the corresponding line of code.
   Alternatively, you can manually switch to the **Sources** tab and find the file you need in the file tree. Navigating
   to the Kotlin file shows you the regular Kotlin code (as opposed to minified JavaScript):

![Debugging in Chrome DevTools](devtools-sources.png){width="600"}

You can now start debugging the program. Set a breakpoint by clicking on one of the line numbers.
The developer tools even support setting breakpoints within a statement. As with regular JavaScript code, any set
breakpoints will persist across page reloads. This also makes it possible to debug Kotlin's `main()` method which is executed
when the script is loaded for the first time.

## Debug in the IDE

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) provides a powerful set of tools for debugging code during development.

For debugging Kotlin/JS in IntelliJ IDEA, you'll need a **Debug JavaScript** debug configuration. To add such a configuration:

1. Go to **Run | Edit configurations**.
2. Click **+** and select **JavaScript debug**.
3. Specify the configuration **Name** and provide the **URL** on which the project runs (`http://localhost:8080` by default).

![JavaScript debug configuration](debug-config.png){width="600"}

4. Save the configuration.

Learn more about [setting up JavaScript debug configurations](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html).

Now you're ready to debug your project!

1. Run the project by calling one of the available `*Run` Gradle tasks, for example, `browserDevelopmentRun` or
   `jsBrowserDevelopmentRun` in a multiplatform project.
   Learn more about [running Kotlin/JS](running-kotlin-js.md#run-the-browser-target).
2. Start the debugging session by running the JavaScript debug configuration you've created previously:

![JavaScript debug configuration](debug-config-run.png){width="600"}

3. You can see the console output of your program in the **Debug** window in IntelliJ IDEA. The output items reference the
   Kotlin source files and lines they come from:

![JavaScript debug output in the IDE](ide-console-output.png){width="600"}

4. Click the file reference on the right to navigate to the corresponding line of code.

You can now start debugging the program using the whole set of tools that the IDE offers: breakpoints, stepping, expression
evaluation, and more. Learn more about [debugging in IntelliJ IDEA](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html).

> Because of the limitations of the current JavaScript debugger in IntelliJ IDEA, you may need to rerun the JavaScript
> debug to make the execution stop on breakpoints.
>
{type="note"}

## Debug in Node.js

If your project targets Node.js, you can debug it in this runtime.

To debug a Kotlin/JS application targeting Node.js:

1. Build the project by running the `build` Gradle task.
2. Find the resulting `.js` file for Node.js in the `build/js/packages/your-module/kotlin/` directory inside
   your project's directory.
3. Debug it in Node.js as described in the [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides).

## What's next?

Now that you know how to start debug sessions with your Kotlin/JS project, learn to make efficient use of the debugging tools:

* Learn how to [debug JavaScript in Google Chrome](https://developer.chrome.com/docs/devtools/javascript/)
* Get familiar with [IntelliJ IDEA JavaScript debugger](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
* Learn how to [debug in Node.js](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## If you run into any problems

If you face any issues with debugging Kotlin/JS, please report them to our issue tracker, [YouTrack](https://kotl.in/issue)

