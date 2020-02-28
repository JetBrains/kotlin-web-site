---
type: tutorial
layout: tutorial
title:  "Debugging Kotlin/JS"
description: "How to debug Kotlin/JS code using the browser developer tools."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false

---

Starting with Kotlin 1.3.60, the Kotlin/JS Gradle plugin automatically generates source maps for our builds. These enable support for debugging our code using browser development tools. To get started debugging our code, execute the `run` task in a project using the JS Gradle plugin, or `browserDevelopmentRun` in a multiplatform project. Once the development server is running, we can start our debugging session from the browser.

To begin debugging, let's navigate to the page and launch the developer tools of our browser (for example by right-clicking and selecting the _Inspect_ action). If our program is logging information to the console, we can navigate to the _Console_ tab to see this output. Depending on our browser and its developer tools, these logs will also reference the Kotlin source files they originate from:

![Chrome DevTools console]({{ url_for('tutorial_img', filename='javascript/debugging-kotlin-in-browser/devtools-console.png')}})


We can click the file reference on the right to navigate directly to the corresponding statement. Alternatively, we can manually switch to the _Sources_ tab, and find the correct file in the file tree. Navigating to the Kotlin file actually shows us regular Kotlin code (as opposed to minified JavaScript):

![Debugging in Chrome DevTools]({{ url_for('tutorial_img', filename='javascript/debugging-kotlin-in-browser/devtools-sources.png')}})

We can now start debugging our program. For example, we can set a breakpoint by clicking on one of the line numbers. The developer tools even support setting breakpoints within a statement. As with regular JavaScript code, any set breakpoints will persist across page reloads. This also makes it possible to debug Kotlin's main method which is executed when the script is first loaded.

<!-- TODO: Debugging Node.js – awaiting https://youtrack.jetbrains.com/issue/WEB-43747 -->