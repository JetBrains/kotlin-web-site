[//]: # (title: Debug Kotlin/JS in the browser)

Kotlin/JS Gradle plugin automatically generates source maps for the project builds. These enable support for debugging
the code using browser development tools. To get started debugging your code, execute the `run` task in a project using
the JS Gradle plugin, or `browserDevelopmentRun` in a multiplatform project. Once the development server is running,
you can start a debugging session from the browser.

To begin debugging, navigate to the page and launch the developer tools of the browser (for example by right-clicking and
selecting the _Inspect_ action). If your program is logging information to the console, navigate to the _Console_ tab to
see this output. Depending on your browser and its developer tools, these logs will also reference the Kotlin source files
they originate from:

![Chrome DevTools console](devtools-console.png)

You can click the file reference on the right to navigate directly to the corresponding statement. Alternatively, you can
manually switch to the _Sources_ tab, and find the correct file in the file tree. Navigating to the Kotlin file actually
shows you the regular Kotlin code (as opposed to minified JavaScript):

![Debugging in Chrome DevTools](devtools-sources.png)

You can now start debugging the program. For example, set a breakpoint by clicking on one of the line numbers.
The developer tools even support setting breakpoints within a statement. As with regular JavaScript code, any set
breakpoints will persist across page reloads. This also makes it possible to debug Kotlin's main method which is executed
when the script is loaded for the first time.

<!-- TODO: Debugging Node.js – awaiting https://youtrack.jetbrains.com/issue/WEB-43747 -->