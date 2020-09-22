---
type: tutorial
layout: tutorial
title: "Debug coroutines using IntelliJ IDEA"
description: "This tutorial demonstrates how to create Kotlin coroutines and debug them using IntelliJ IDEA."
authors: Andrey Polyakov
date: 2020-09-17
showAuthorInfo: false
---

The tutorial assumes you have prior knowledge of the [coroutines](https://kotlinlang.org/docs/reference/coroutines/coroutines-guide.html) concept.

> Debugging works for versions 1.3.8 or later of `kotlinx-coroutines-core`.
{:.note}

## Create coroutines

1. Open a Kotlin project in IntelliJ IDEA. If you don't have a project, [create one](/docs/tutorials/jvm-get-started.html#create-an-application).

2. Open the `main.kt` file in `src/main/kotlin`.

   The `src` directory contains Kotlin source files and resources. The `main.kt` file contains sample code that will print `Hello World!`.

2. Change code the `main()` function:

   * Use the [`runBlocking()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) block to wrap a coroutine.
   * Use the [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) function to create coroutines that compute deferred values `a` and `b`.
   * Use the [`await()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) function to await the computing result.
   * Use the [`println()`](/api/latest/jvm/stdlib/stdlib/kotlin.io/println.html) function to print computing status and the result of multiplication to the output.

   <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

   ```kotlin
   import kotlinx.coroutines.*
   
   fun main() = runBlocking<Unit> {
       val a = async {
           println("I'm computing a piece of the answer")
           6
       }
       val b = async {
           println("I'm computing another piece of the answer")
           7
       }
       println("The answer is ${a.await() * b.await()}")
   }
   ```

   </div>

4. Build the code by clicking **Build Project**.

   ![Build an application]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/flow-build-project.png') }})

## Debug coroutines

1. Set breakpoints at the lines with the `println()` function call:

   ![Build a console application]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/coroutine-breakpoint.png') }})

2. Run code in debug mode by clicking **Debug** next to the run configuration at the top of the screen.

   ![Build a console application]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/flow-debug-project.png') }})

   The **Debug** tool window appears: 
      * The **Frames** tab contains the call stacks.
      * The **Variables** tab contains variables in the current context.
      * The **Coroutines** tab contains the information on running or suspended coroutines. It shows that there are three coroutines.
      The first one has the **RUNNING** status, and two others have **CREATED**.

   ![Debug the coroutine]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/coroutine-debug-1.png') }})

3. Resume a debugger session by clicking **Resume program** of the **Debug** tool window:

   ![Debug the coroutine]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/coroutine-debug-2.png') }})
   
   Now the **Coroutines** tab shows the following:
   * The first coroutine has the **SUSPENDED** status – it waits for the values to multiplicate them.
   * The second coroutine calculates the `a` value – it has the **RUNNING** status.
   * The third coroutine has the **CREATED** status and doesn't compute the `b` value.

4. Resume a debugger session by clicking **Resume program** of the **Debug** tool window:

   ![Build a console application]({{ url_for('tutorial_img', filename='coroutines-basic-jvm/coroutine-debug-3.png') }})

   Now the **Coroutines** tab shows the following:
   * The first coroutine has the **SUSPENDED** status – it waits for the values to multiplicate them.
   * The second coroutine computed the value and disappeared.
   * The third coroutine calculates the `b` value – it has the **RUNNING** status.

Using IntelliJ IDEA debugger, you can dig deep into each coroutine to debug your code.