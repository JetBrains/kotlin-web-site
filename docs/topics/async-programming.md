[//]: # (title: Asynchronous control flow and suspending functions)

An application can become unresponsive when it has to wait for an operation to finish before it can handle other work.

On the JVM, code runs on threads.
If the thread responsible for handling events has to wait for an operation to finish, it can't do other work in the meantime.
An operation that causes the thread to wait in this way is known as a _blocking operation_.

To remain responsive, an application needs to let independent work continue while an operation is in progress.
_Asynchronous control flow_ determines which work can continue while an operation is in progress and which work must wait for it to finish.

The following sections use examples from a small reminder application to demonstrate different ways to manage asynchronous control flow and show how suspending functions make this control flow easy to express.

> You can find the complete project for the reminder application, including the source files for all examples, in the [PLACEHOLDER GitHub repository](<repository-url>).
>
> These resources are intended for teaching purposes rather than as production-ready implementations.
> To get started with writing production-ready asynchronous code in Kotlin, see [Coroutine basics](coroutines-basics.md).
>
{style="note"}

## Concurrent computations

The simplest form of asynchronous control flow is running two operations concurrently.
Two operations run concurrently when one can start before the other has finished.

When a JVM application starts, the JVM invokes its `main()` function on the _main thread_.
You can start another operation on a separate thread with the [`Thread`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html) class while the main thread continues running other code.

In [`src/Example1.kt`](repository-url./blob/main/src/Example1.kt) of the reminder application, each reminder starts on a new thread while the main thread continues processing user input:

```kotlin
// Starts a new thread that waits for the specified duration before printing the reminder
fun scheduleReminder(remindIn: Duration, reminderText: List<String>) {
    Thread {
        // Waits for the specified duration on a separate thread
        Thread.sleep(remindIn.inWholeMilliseconds)

        println(/* reminder text */)
    }.apply {
        // Keeps the JVM running until the reminder thread finishes
        isDaemon = false

        // Starts the thread
        start()
    }
}

fun main() {
    while (true) {
        // The main thread continues accepting commands
        println("Please enter your input:")
        val input = readlnOrNull() ?: return

        when (/* parsed command */) {
            "remind" -> {
                // The reminder starts on a new thread
                scheduleReminder(remindInParsed, command)
            }
        }
    }
}
```

In this example, you can continue interacting with the application while a reminder is pending.
The [`start()`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html#start()) method starts each reminder thread, and setting the `isDaemon` property to `false` keeps the JVM running until all reminder threads finish.
When a reminder is triggered, the reminder thread prints its text to the same console that the main thread uses for other output.

The application also has a `fun_animation` command that prints a sequence of frames on the main thread:

```kotlin
"fun_animation" -> {
    for (frame in funAnimationFrames) {
        // The main thread prints each animation frame
        println(frame)

        // The main thread waits 200 milliseconds before printing the next frame
        Thread.sleep(200)
    }
}
```

Because reminders run concurrently with the animation, a reminder can be triggered while the animation is being printed.
As a result, the reminder text can appear in the middle of the animation:

```none
==============================
    



       _---_
*** REMINDER (SCHEDULED 2m AGO): Turn off the stove! ***
     / o o o \
    <=========>
     /       \
    /         \
   /           \


==============================
```

This interleaving shows a problem with concurrent access to shared resources:
although the operations can run independently, they can interfere with each other.

In real applications, similar interference can occur when concurrent operations update shared state. 
For example, one operation might recalculate a UI layout while another changes the displayed content.
Without coordination, the result can depend on which operation finishes first and leave the UI in an inconsistent state.
This type of unpredictable interference is known as a _race condition_.

Here's the complete implementation for this version of the reminder application:

```kotlin
import kotlin.time.Clock
import kotlin.time.ComparableTimeMark
import kotlin.time.Duration
import kotlin.time.TimeSource

fun scheduleReminder(remindIn: Duration, reminderText: List<String>) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)
        println(buildString {
            append("*** REMINDER (SCHEDULED $remindIn AGO)")
            if (reminderText.isNotEmpty()) {
                append(": ")
                for (word in reminderText) {
                    append(word)
                    append(' ')
                }
            } else {
                append(' ')
            }
            append("***")
        })
    }.apply {
        isDaemon = false
        start()
    }
}

fun main() {
    while (true) {
        println("Please enter your input:")
        val input = readlnOrNull() ?: return
        val command = input
            .trim().split("\\s".toRegex())
            .toMutableList()
        val operation = command.removeFirstOrNull() ?: continue
        when (val operationInLowerCase = operation.lowercase()) {
            "remind" -> {
                val remindIn = command.removeFirstOrNull()
                val remindInParsed = remindIn?.let(Duration::parseOrNull)
                if (remindInParsed == null) {
                    println(buildString {
                        append("The 'remind' command requires a 'Duration' argument")
                        if (remindIn != null) {
                            append(", got '$remindIn'")
                        }
                    })
                    println()
                    printRemindSyntax()
                } else {
                    scheduleReminder(remindInParsed, command)
                    println("Scheduled a reminder in $remindInParsed")
                    println("    (fires at ${Clock.System.now() + remindInParsed})")
                }
            }
            "help" -> printHelp()
            "fun_animation" -> {
                for (frame in funAnimationFrames) {
                    println(frame)
                    Thread.sleep(200) // 200 milliseconds
                }
            }
            "quit" -> break
            else -> {
                println("Unknown command '$operationInLowerCase'")
                println()
                printHelp()
            }
        }
    }
    println("All done! The program will exit once all pending reminders fire.")
}

private fun printHelp() {
    println("Usage:")
    printRemindSyntax()
    printFunAnimationSyntax()
    printHelpSyntax()
    printQuitSyntax()
    println()
}

private fun printRemindSyntax() {
    println("remind duration [message] - remind about something")
    println("\texample: remind 10m Turn off stove")
}

private fun printFunAnimationSyntax() {
    println("fun_animation - show a fun animation to pass the time")
}

private fun printHelpSyntax() {
    println("help - show a list of available commands")
}

private fun printQuitSyntax() {
    println("quit - exit this program")
}

private val funAnimationFrames = (
        "#       _---_#     / o o o \\#    <=========>####       o#    " +
                "  /|\\#      / \\#~@##       _---_#     / o o o \\#    <=======" +
                "==>###       o#      /|\\#      / \\#~@###       _---_#     / " +
                "o o o \\#    <=========>##       o#      /|\\#      / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /         \\#   /    o      \\#       /|\\#       / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /   o     \\#   /   /|\\     \\#       / \\##~@##       _---" +
                "_#     / o o o \\#    <=========>#     /  o    \\#    /  /|\\" +
                "    \\#   /   / \\     \\###~@##       _---_#     / o o o \\#  " +
                "  <=========>#     /       \\#    /         \\#   /          " +
                " \\###~@##       _---_#     / - - - \\#    <=========>######~" +
                "@#       _---_#     / - - - \\#    <=========>#       * * *#" +
                "#####~@       * * *#         *#########~"
        ).replace("~", "==============================")
    .replace("#", "\n")
    .split("@")
)
```
{collapsible="true" collapsed-title="Complete Example1.kt file"}

## Actor-based shared resource coordination

When concurrent operations use the same resource, they need to coordinate how they use it.

One way to coordinate access to a shared resource is to use an _actor-based approach_, 
where a single component controls access to the resource and processes requests one at a time.
If the component is already processing a request, new requests wait in a queue.

> Many UI frameworks use a similar approach with a _UI thread_.
> The UI thread processes requests to update UI elements one at a time.
>
{style="tip"}

In [`src/Example2.kt`](repository-url./blob/main/src/Example2.kt), the reminder application uses a `SimpleActor` class to coordinate access to the console.
An actor runs requests on a dedicated thread in the order it receives them:

```kotlin
// Coordinates access to a shared resource by processing requests one at a time
class SimpleActor {
    private val requests = mutableListOf<() -> Unit>()

    init {
        Thread {
            while (true) {
                // Gets the next request from the queue when available
                val request = /* ... */

                // Executes one request at a time
                request()
            }
        }.apply {
            // Allows the JVM to exit while the actor thread is still running
            isDaemon = true

            // Starts the actor thread
            start()
        }
    }

    fun sendRequest(request: () -> Unit) {
        // Adds the request to the queue
        /* ... */
    }
}
```

Instead of calling the `println()` function directly, operations send requests to the same actor.
For example, a reminder sends its output to the actor after its specified duration elapses:

```kotlin
fun scheduleReminder(
    printlnActor: SimpleActor,
    remindIn: Duration,
    reminderText: List<String>
) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)

        val stringToPrint = /* Creates the reminder text */

        // Sends the reminder output to the actor
        printlnActor.sendRequest {
            println(stringToPrint)
        }
    }.apply {
        isDaemon = false
        start()
    }
}
```

The `fun_animation` command also sends its output to the actor, with all animation frames grouped into a single request:

```kotlin
// Sends the animation output to the actor as a single request
"fun_animation" -> printlnActor.sendRequest {
    for (frame in funAnimationFrames) {
        println(frame)
        Thread.sleep(200)
    }
}
```

In this example, the `sendRequest()` function submits a request to the actor and returns without waiting for the request to finish.

The actor processes requests one at a time. If a reminder is triggered while the actor is processing another request,
its print request waits in the queue until the current request finishes.
This prevents interleaving issues, such as reminder text appearing in the middle of the animation.

However, the actor only coordinates the requests it processes.
It doesn't determine when the main thread continues, so the main thread can keep accepting user input while the actor is still processing an earlier request.
This matters when work on the main thread depends on that request finishing.

Here's the complete implementation for this version of the reminder application:

```kotlin
import kotlin.time.Clock
import kotlin.time.ComparableTimeMark
import kotlin.time.Duration
import kotlin.time.TimeSource

@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
class SimpleActor {
    private val requests = mutableListOf<() -> Unit>()

    init {
        Thread {
            while (true) {
                val request = synchronized(requests) {
                    val request = requests.removeFirstOrNull()
                    if (request == null) {
                        (requests as Object).wait()
                        continue
                    }
                    request
                }
                request()
            }
        }.apply {
            isDaemon = true
            start()
        }
    }

    /**
     * Sends a request that will execute on the thread of this actor.
     *
     * Requests to any given actor execute one-by-one,
     * never in parallel.
     */
    fun sendRequest(
        request: () -> Unit,
    ) {
        synchronized(requests) {
            requests.add(request)
            (requests as Object).notify()
        }
    }
}

fun scheduleReminder(
    printlnActor: SimpleActor,
    remindIn: Duration,
    reminderText: List<String>
) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)
        val stringToPrint = buildString {
            append("*** REMINDER (SCHEDULED $remindIn AGO)")
            if (reminderText.isNotEmpty()) {
                append(": ")
                for (word in reminderText) {
                    append(word)
                    append(' ')
                }
            } else {
                append(' ')
            }
            append("***")
        }
        printlnActor.sendRequest {
            println(stringToPrint)
        }
    }.apply {
        isDaemon = false
        start()
    }
}

fun main() {
    val printlnActor = SimpleActor()
    while (true) {
        printlnActor.sendRequest {
            println("Please enter your input:")
        }
        val input = readlnOrNull() ?: return
        val command = input
            .trim().split("\\s".toRegex())
            .toMutableList()
        val operation = command.removeFirstOrNull() ?: continue
        when (val operationInLowerCase = operation.lowercase()) {
            "remind" -> {
                val remindIn = command.removeFirstOrNull()
                val remindInParsed = remindIn?.let(Duration::parseOrNull)
                if (remindInParsed == null) {
                    printlnActor.sendRequest {
                        println(buildString {
                            append("The 'remind' command requires a 'Duration' argument")
                            if (remindIn != null) {
                                append(", got '$remindIn'")
                            }
                        })
                        println()
                        printRemindSyntax()
                    }
                } else {
                    scheduleReminder(printlnActor, remindInParsed, command)
                    printlnActor.sendRequest {
                        println("Scheduled a reminder in $remindInParsed")
                        println("    (fires at ${Clock.System.now() + remindInParsed})")
                    }
                }
            }
            "help" -> printlnActor.sendRequest {
                printHelp()
            }
            "fun_animation" -> printlnActor.sendRequest {
                for (frame in funAnimationFrames) {
                    println(frame)
                    Thread.sleep(200) // 200 milliseconds
                }
            }
            "quit" -> break
            else -> printlnActor.sendRequest {
                println("Unknown command '$operationInLowerCase'")
                println()
                printHelp()
            }
        }
    }
    printlnActor.sendRequest {
        println("All done! The program will exit once all pending reminders fire.")
    }
}

private fun printHelp() {
    println("Usage:")
    printRemindSyntax()
    printFunAnimationSyntax()
    printHelpSyntax()
    printQuitSyntax()
    println()
}

private fun printRemindSyntax() {
    println("remind duration [message] - remind about something")
    println("\texample: remind 10m Turn off stove")
}

private fun printFunAnimationSyntax() {
    println("fun_animation - show a fun animation to pass the time")
}

private fun printHelpSyntax() {
    println("help - show a list of available commands")
}

private fun printQuitSyntax() {
    println("quit - exit this program")
}

private val funAnimationFrames = (
        "#       _---_#     / o o o \\#    <=========>####       o#    " +
                "  /|\\#      / \\#~@##       _---_#     / o o o \\#    <=======" +
                "==>###       o#      /|\\#      / \\#~@###       _---_#     / " +
                "o o o \\#    <=========>##       o#      /|\\#      / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /         \\#   /    o      \\#       /|\\#       / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /   o     \\#   /   /|\\     \\#       / \\##~@##       _---" +
                "_#     / o o o \\#    <=========>#     /  o    \\#    /  /|\\" +
                "    \\#   /   / \\     \\###~@##       _---_#     / o o o \\#  " +
                "  <=========>#     /       \\#    /         \\#   /          " +
                " \\###~@##       _---_#     / - - - \\#    <=========>######~" +
                "@#       _---_#     / - - - \\#    <=========>#       * * *#" +
                "#####~@       * * *#         *#########~"
        ).replace("~", "==============================")
    .replace("#", "\n")
    .split("@")
```
{collapsible="true" collapsed-title="Complete Example2.kt file"}

## Callbacks

When some work has to start after an asynchronous operation finishes, an application needs to control when that subsequent work runs.
You can define the subsequent work in a _callback_.
A callback is a function that you pass to another function to invoke later when a specified condition is met, such as after an operation finishes. 

In [src/Example3.kt](repository-url./blob/main/src/Example3.kt), the reminder application uses callbacks to resume processing user input only after the animation finishes.
To achieve this, the example adds a second `SimpleActor` for processing user input:

```kotlin
fun main() {
    val printlnActor = SimpleActor()
    val userInputActor = SimpleActor()

    // Passes a callback that starts processing user input
    userInputActor.sendRequest {
        processUserInput(
            printlnActor,
            userInputActor,
            // Runs after input processing stops
            doLast = {
                printlnActor.sendRequest {

                    println("All done! The program will exit once all pending reminders fire.")
                }
            }
        )
    }

    // Keeps the main thread running until the application can terminate
    while (!shouldTerminate.load()) {
        Thread.sleep(100)
    }
}
```

The `userInputActor` calls the `processUserInput()` function on its dedicated thread.
Unlike the `while` loop in the [actor-based shared resource coordination example](#actor-based-shared-resource-coordination), each call to the `processUserInput()` function reads and processes only one command.

After processing a `remind` command, a `help` command, or an unknown command, the function sends another request to `userInputActor`:

```kotlin
fun processUserInput(
    printlnActor: SimpleActor,
    userInputActor: SimpleActor,
    doLast: () -> Unit
) {
    // Processes the current command
    /* ... */

    // Schedules processing of the next command
    userInputActor.sendRequest {
        processUserInput(printlnActor, userInputActor, doLast)
    }
}
```

The `userInputActor` queues the callback instead of invoking it immediately.
The current call to the `processUserInput()` function returns before the actor processes the next request.
This starts another input-processing operation, similar to starting the next iteration of a loop.

For the `fun_animation` command, the application delays the next input request until the animation finishes.
The request sent to `printlnActor` prints all animation frames before it requests processing of the next command:

```kotlin
"fun_animation" -> {
    // Sends a request to print the animation
    printlnActor.sendRequest {
        for (frame in funAnimationFrames) {
            println(frame)
            Thread.sleep(200)
        }

        // Passes a callback that processes the next command
        // after the animation finishes
        userInputActor.sendRequest {
            processUserInput(printlnActor, userInputActor, doLast)
        }
    }

    // Prevents processUserInput() from scheduling another input request
    // before the animation finishes
    return
}
```

For the `quit` command, the function calls the `doLast` callback instead of scheduling another input request:

```kotlin
"quit" -> {
    // Invokes the callback that runs after input processing stops
    doLast()
    return
}
```

With callbacks, each execution path must explicitly schedule the work that follows it.
The application has to schedule another input-processing operation, start an asynchronous operation that schedules input processing when it finishes, or invoke the final callback.

As control flows become more complex, omitting one of these actions, performing it more than once, or performing it on the wrong execution path can change the application's behavior.
This makes the code harder to maintain and more error-prone.

Here's the complete implementation for this version of the reminder application:

```kotlin
@file:OptIn(kotlin.concurrent.atomics.ExperimentalAtomicApi::class)
import kotlin.concurrent.atomics.AtomicBoolean
        import kotlin.time.Clock
        import kotlin.time.ComparableTimeMark
        import kotlin.time.Duration
        import kotlin.time.TimeSource

        @Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
        class SimpleActor {
            private val requests = mutableListOf<() -> Unit>()

            init {
                Thread {
                    while (true) {
                        val request = synchronized(requests) {
                            val request = requests.removeFirstOrNull()
                            if (request == null) {
                                (requests as Object).wait()
                                continue
                            }
                            request
                        }
                        request()
                    }
                }.apply {
                    isDaemon = true
                    start()
                }
            }

            /**
             * Sends a request that will execute on the thread of this actor.
             *
             * Requests to any given actor execute one-by-one,
             * never in parallel.
             */
            fun sendRequest(
                request: () -> Unit,
            ) {
                synchronized(requests) {
                    requests.add(request)
                    (requests as Object).notify()
                }
            }
        }

fun scheduleReminder(
    printlnActor: SimpleActor,
    remindIn: Duration,
    reminderText: List<String>
) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)
        val stringToPrint = buildString {
            append("*** REMINDER (SCHEDULED $remindIn AGO)")
            if (reminderText.isNotEmpty()) {
                append(": ")
                for (word in reminderText) {
                    append(word)
                    append(' ')
                }
            } else {
                append(' ')
            }
            append("***")
        }
        printlnActor.sendRequest {
            println(stringToPrint)
        }
    }.apply {
        isDaemon = false
        start()
    }
}

val shouldTerminate = AtomicBoolean(false)

fun processUserInput(
    printlnActor: SimpleActor,
    userInputActor: SimpleActor,
    doLast: () -> Unit
) {
    printlnActor.sendRequest {
        println("Please enter your input:")
    }
    val input = readlnOrNull() ?: return
    val command = input
        .trim().split("\\s".toRegex())
        .toMutableList()
    val operation = command.removeFirstOrNull()
    if (operation == null) {
        /* We emulate the `continue` from the earlier versions */
        userInputActor.sendRequest {
            processUserInput(printlnActor, userInputActor, doLast)
        }
        return
    }
    when (val operationInLowerCase = operation.lowercase()) {
        "remind" -> {
            val remindIn = command.removeFirstOrNull()
            val remindInParsed = remindIn?.let(Duration::parseOrNull)
            if (remindInParsed == null) {
                printlnActor.sendRequest {
                    println(buildString {
                        append("The 'remind' command requires a 'Duration' argument")
                        if (remindIn != null) {
                            append(", got '$remindIn'")
                        }
                    })
                    println()
                    printRemindSyntax()
                }
            } else {
                scheduleReminder(printlnActor, remindInParsed, command)
                printlnActor.sendRequest {
                    println("Scheduled a reminder in $remindInParsed")
                    println("    (fires at ${Clock.System.now() + remindInParsed})")
                }
            }
        }
        "help" -> printlnActor.sendRequest {
            printHelp()
        }
        "fun_animation" -> {
            printlnActor.sendRequest {
                for (frame in funAnimationFrames) {
                    println(frame)
                    Thread.sleep(200) // 200 milliseconds
                }
                userInputActor.sendRequest {
                    processUserInput(printlnActor, userInputActor, doLast)
                }
            }
            /* We don't need to reschedule reading user input, because the
            println actor will do that on its own once it finishes. */
            return
        }
        "quit" -> {
            /* We emulate the `break` from the earlier versions by exiting the
            current iteration without rescheduling a new one, instead scheduling
            the code that comes *after* the loop. */
            doLast()
            return
        }
        else -> printlnActor.sendRequest {
            println("Unknown command '$operationInLowerCase'")
            println()
            printHelp()
        }
    }
    // Scheduling the next iteration of the loop
    userInputActor.sendRequest {
        processUserInput(printlnActor, userInputActor, doLast)
    }
}

fun main() {
    val printlnActor = SimpleActor()
    val userInputActor = SimpleActor()
    userInputActor.sendRequest {
        processUserInput(printlnActor, userInputActor, doLast = {
            printlnActor.sendRequest {
                println("All done! The program will exit once all pending reminders fire.")
                // Allow the main thread to exit
                shouldTerminate.store(true)
            }
        })
    }
    // Keep the program alive: if we simply exit the main thread,
    // everything will terminate.
    while (!shouldTerminate.load()) {
        Thread.sleep(100)
    }
}

private fun printHelp() {
    println("Usage:")
    printRemindSyntax()
    printFunAnimationSyntax()
    printHelpSyntax()
    printQuitSyntax()
    println()
}

private fun printRemindSyntax() {
    println("remind duration [message] - remind about something")
    println("\texample: remind 10m Turn off stove")
}

private fun printFunAnimationSyntax() {
    println("fun_animation - show a fun animation to pass the time")
}

private fun printHelpSyntax() {
    println("help - show a list of available commands")
}

private fun printQuitSyntax() {
    println("quit - exit this program")
}

private val funAnimationFrames = (
        "#       _---_#     / o o o \\#    <=========>####       o#    " +
                "  /|\\#      / \\#~@##       _---_#     / o o o \\#    <=======" +
                "==>###       o#      /|\\#      / \\#~@###       _---_#     / " +
                "o o o \\#    <=========>##       o#      /|\\#      / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /         \\#   /    o      \\#       /|\\#       / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /   o     \\#   /   /|\\     \\#       / \\##~@##       _---" +
                "_#     / o o o \\#    <=========>#     /  o    \\#    /  /|\\" +
                "    \\#   /   / \\     \\###~@##       _---_#     / o o o \\#  " +
                "  <=========>#     /       \\#    /         \\#   /          " +
                " \\###~@##       _---_#     / - - - \\#    <=========>######~" +
                "@#       _---_#     / - - - \\#    <=========>#       * * *#" +
                "#####~@       * * *#         *#########~"
        ).replace("~", "==============================")
    .replace("#", "\n")
    .split("@")
```
{collapsible="true" collapsed-title="Complete Example3.kt file"}

### Control-flow abstractions

To make callback-based control flow easier to follow, you can move repeated scheduling logic into helper functions that represent familiar control-flow structures, such as loops.

In [src/Example4.kt](repository-url./blob/main/src/Example4.kt), the reminder application uses a `runInfiniteLoop()` function to process user input asynchronously.
Each loop iteration returns a `LoopIterationResult` enum value that determines whether the loop continues, exits, or resumes later after an asynchronous operation finishes:

```kotlin
enum class LoopIterationResult {
    BREAK,
    CONTINUE,
    WILL_BE_RESUMED_ASYNCHRONOUSLY
}
```

The `runInfiniteLoop()` function handles each result and schedules the next iteration when necessary:

```kotlin
// Runs the input-processing loop asynchronously
fun runInfiniteLoop(
    schedule: (RequestType) -> Unit,
    iteration: (scheduleNextIteration: () -> Unit) -> LoopIterationResult,
    actionOnLoopExit: () -> Unit,
) {
    fun helper() {
        when (iteration { schedule(::helper) }) {
            LoopIterationResult.BREAK -> {
                // Runs the action that follows the loop
                actionOnLoopExit()
            }

            LoopIterationResult.CONTINUE -> {
                // Schedules the next loop iteration
                schedule(::helper)
            }

            LoopIterationResult.WILL_BE_RESUMED_ASYNCHRONOUSLY -> {
                // Another operation schedules the next iteration
            }
        }
    }

    // Schedules the first loop iteration
    schedule(::helper)
}
```

The reminder application passes its input-processing logic to the `runInfiniteLoop()` function.
For execution paths that can continue immediately, the iteration returns `CONTINUE`, similarly to calling `continue` in a loop:

```kotlin
val operation = command.removeFirstOrNull()
    ?: return@iteration LoopIterationResult.CONTINUE
```

For operations that resume later, the iteration returns `WILL_BE_RESUMED_ASYNCHRONOUSLY`.
For example, the `fun_animation` command schedules the next iteration after the animation finishes:

```kotlin
"fun_animation" -> {
    printlnActor.sendRequest {
        for (frame in funAnimationFrames) {
            println(frame)
            Thread.sleep(200)
        }

        // Schedules the next iteration after the animation finishes
        userInputActor.sendRequest {
            scheduleNextIteration()
        }
    }

    return@iteration LoopIterationResult.WILL_BE_RESUMED_ASYNCHRONOUSLY
}
```

Finally, to stop processing user input, the iteration returns `BREAK`:

```kotlin
"quit" -> {
    return@iteration LoopIterationResult.BREAK
}
```

As you can see, the `runInfiniteLoop()` function centralizes the logic for continuing and exiting the loop instead of requiring each execution path to schedule the next operation directly.

However, correctly implementing control-flow abstractions using functions such as `runInfiniteLoop()` can be difficult.
For example, this implementation doesn't handle exceptions thrown from the loop iteration, the schedule callback, or the `actionOnLoopExit` callback.

Here's the complete implementation for this version of the reminder application:

```kotlin
@file:OptIn(kotlin.concurrent.atomics.ExperimentalAtomicApi::class)
import kotlin.concurrent.atomics.AtomicBoolean
        import kotlin.time.Clock
        import kotlin.time.ComparableTimeMark
        import kotlin.time.Duration
        import kotlin.time.TimeSource

typealias RequestType = () -> Unit

@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
class SimpleActor {
    private val requests = mutableListOf<RequestType>()

    init {
        Thread {
            while (true) {
                val request = synchronized(requests) {
                    val request = requests.removeFirstOrNull()
                    if (request == null) {
                        (requests as Object).wait()
                        continue
                    }
                    request
                }
                request()
            }
        }.apply {
            isDaemon = true
            start()
        }
    }

    /**
     * Sends a request that will execute on the thread of this actor.
     *
     * Requests to any given actor execute one-by-one,
     * never in parallel.
     */
    fun sendRequest(
        request: RequestType,
    ) {
        synchronized(requests) {
            requests.add(request)
            (requests as Object).notify()
        }
    }
}

fun scheduleReminder(
    printlnActor: SimpleActor,
    remindIn: Duration,
    reminderText: List<String>
) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)
        val stringToPrint = buildString {
            append("*** REMINDER (SCHEDULED $remindIn AGO)")
            if (reminderText.isNotEmpty()) {
                append(": ")
                for (word in reminderText) {
                    append(word)
                    append(' ')
                }
            } else {
                append(' ')
            }
            append("***")
        }
        printlnActor.sendRequest {
            println(stringToPrint)
        }
    }.apply {
        isDaemon = false
        start()
    }
}

// NEW APIS ///////////////////////////////////////////////////////////////////

enum class LoopIterationResult {
    BREAK,
    CONTINUE,
    WILL_BE_RESUMED_ASYNCHRONOUSLY
}

/**
 * Runs an infinite loop asynchronously.
 *
 * [schedule] is the command that will be invoked to schedule
 * the next loop iteration.
 *
 * [iteration] is the loop body.
 * It accepts a value of type `() -> Unit` invoking which will cause
 * the next iteration to be scheduled.
 * Use this in conjunction with
 * [LoopIterationResult.WILL_BE_RESUMED_ASYNCHRONOUSLY].
 *
 * [actionOnLoopExit] will be run once the loop exits.
 *
 * This function returns immediately after scheduling the first iteration.
 */
fun runInfiniteLoop(
    schedule: (RequestType) -> Unit,
    iteration: (scheduleNextIteration: () -> Unit) -> LoopIterationResult,
    actionOnLoopExit: () -> Unit,
) {
    fun helper() {
        when (iteration { schedule(::helper) }) {
            LoopIterationResult.BREAK -> {
                /* We exited the loop. No need to reschedule anything. */
                actionOnLoopExit()
            }
            LoopIterationResult.CONTINUE -> {
                /* Schedule the next loop iteration */
                schedule(::helper)
            }
            LoopIterationResult.WILL_BE_RESUMED_ASYNCHRONOUSLY -> {
                /* No need to do anything, someone else will resume the loop. */
            }
        }
    }
    schedule(::helper)
}

// NEW API USAGE //////////////////////////////////////////////////////////////

val shouldTerminate = AtomicBoolean(false)

fun main() {
    val printlnActor = SimpleActor()
    val userInputActor = SimpleActor()

    runInfiniteLoop(
        schedule = userInputActor::sendRequest,
        iteration = iteration@{ scheduleNextIteration ->
            printlnActor.sendRequest {
                println("Please enter your input:")
            }
            val input = readlnOrNull()
                ?: return@iteration LoopIterationResult.BREAK
            val command = input
                .trim().split("\\s".toRegex())
                .toMutableList()
            val operation = command.removeFirstOrNull()
                ?: return@iteration LoopIterationResult.CONTINUE
            when (val operationInLowerCase = operation.lowercase()) {
                "remind" -> {
                    val remindIn = command.removeFirstOrNull()
                    val remindInParsed = remindIn?.let(Duration::parseOrNull)
                    if (remindInParsed == null) {
                        printlnActor.sendRequest {
                            println(buildString {
                                append("The 'remind' command requires a 'Duration' argument")
                                if (remindIn != null) {
                                    append(", got '$remindIn'")
                                }
                            })
                            println()
                            printRemindSyntax()
                        }
                    } else {
                        scheduleReminder(printlnActor, remindInParsed, command)
                        printlnActor.sendRequest {
                            println("Scheduled a reminder in $remindInParsed")
                            println("    (fires at ${Clock.System.now() + remindInParsed})")
                        }
                    }
                }
                "help" -> printlnActor.sendRequest {
                    printHelp()
                }
                "fun_animation" -> {
                    printlnActor.sendRequest {
                        for (frame in funAnimationFrames) {
                            println(frame)
                            Thread.sleep(200) // 200 milliseconds
                        }
                        userInputActor.sendRequest {
                            scheduleNextIteration()
                        }
                    }
                    return@iteration LoopIterationResult.WILL_BE_RESUMED_ASYNCHRONOUSLY
                }
                "quit" -> {
                    return@iteration LoopIterationResult.BREAK
                }
                else -> printlnActor.sendRequest {
                    println("Unknown command '$operationInLowerCase'")
                    println()
                    printHelp()
                }
            }
            LoopIterationResult.CONTINUE
        },
        actionOnLoopExit = {
            printlnActor.sendRequest {
                println("All done! The program will exit once all pending reminders fire.")
                // Allow the main thread to exit
                shouldTerminate.store(true)
            }
        }
    )
    // Keep the program alive: if we simply exit the main thread,
    // everything will terminate.
    while (!shouldTerminate.load()) {
        Thread.sleep(100)
    }
}

private fun printHelp() {
    println("Usage:")
    printRemindSyntax()
    printFunAnimationSyntax()
    printHelpSyntax()
    printQuitSyntax()
    println()
}

private fun printRemindSyntax() {
    println("remind duration [message] - remind about something")
    println("\texample: remind 10m Turn off stove")
}

private fun printFunAnimationSyntax() {
    println("fun_animation - show a fun animation to pass the time")
}

private fun printHelpSyntax() {
    println("help - show a list of available commands")
}

private fun printQuitSyntax() {
    println("quit - exit this program")
}

private val funAnimationFrames = (
        "#       _---_#     / o o o \\#    <=========>####       o#    " +
                "  /|\\#      / \\#~@##       _---_#     / o o o \\#    <=======" +
                "==>###       o#      /|\\#      / \\#~@###       _---_#     / " +
                "o o o \\#    <=========>##       o#      /|\\#      / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /         \\#   /    o      \\#       /|\\#       / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /   o     \\#   /   /|\\     \\#       / \\##~@##       _---" +
                "_#     / o o o \\#    <=========>#     /  o    \\#    /  /|\\" +
                "    \\#   /   / \\     \\###~@##       _---_#     / o o o \\#  " +
                "  <=========>#     /       \\#    /         \\#   /          " +
                " \\###~@##       _---_#     / - - - \\#    <=========>######~" +
                "@#       _---_#     / - - - \\#    <=========>#       * * *#" +
                "#####~@       * * *#         *#########~"
        ).replace("~", "==============================")
    .replace("#", "\n")
    .split("@")
```
{collapsible="true" collapsed-title="Complete Example4.kt file"}

## Suspending functions

[Callback-based control flow](#callbacks) can become difficult to maintain as the number of dependent operations grows.

Kotlin provides _suspending functions_, which let you express asynchronous control flow in a clear, sequential style.

With callbacks, you define the work that follows an asynchronous operation separately and schedule it as a callback.
A suspending function can instead pause at a _suspension point_ and continue later from that point.
This preserves familiar control-flow structures without requiring you to express each subsequent step as a separately scheduled callback.

To declare a suspending function, use the `suspend` keyword.

In [src/Example5.kt](repository-url./blob/main/src/Example5.kt), the reminder application uses suspending functions to process user input in the `suspendMain()` function:

```kotlin
// Processes user input in a suspending function
suspend fun suspendMain(
    printlnActor: SimpleActor,
    userInputActor: SimpleActor
) {
    while (true) {
        printlnActor.sendRequest {
            println("Please enter your input:")
        }

        val input = readlnOrNull() ?: break
        val command = input
            .trim().split("\\s".toRegex())
            .toMutableList()
        val operation = command.removeFirstOrNull() ?: continue

        when (val operationInLowerCase = operation.lowercase()) {
            // Handles other commands
            /* ... */

            "quit" -> break
        }
    }

    printlnActor.sendRequest {
        println("All done! The program will exit once all pending reminders fire.")
        shouldTerminate.store(true)
    }
}
```

The `suspendMain()` function can use a `while` loop, `continue`, and `break` directly instead of manually coordinating each execution path with callbacks.
Suspending functions can also use familiar constructs such as `return`, `try`, `catch`, and `finally`, and call other suspending functions.
Recreating this behavior with helper functions such as `runInfiniteLoop()` in the [Control-flow abstractions example](#control-flow-abstractions) would be difficult and require increasingly complex scheduling logic.

For the `fun_animation` command, the `suspendCoroutine()` function creates a suspension point, suspends while the animation runs, and resumes after it finishes:

```kotlin
"fun_animation" -> {
    // Suspends execution until another operation resumes it
    suspendCoroutine { continuation ->
        printlnActor.sendRequest {
            for (frame in funAnimationFrames) {
                println(frame)
                Thread.sleep(200)
            }

            userInputActor.sendRequest {
                // Resumes execution after the animation finishes
                continuation.resumeWith(Result.success(Unit))
            }
        }
    }
}
```

Here, the [`suspendCoroutine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/suspend-coroutine.html) function suspends execution and provides an implementation of the [`Continuation`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/-continuation/) interface that represents the execution that follows the suspension point.
This is similar to the [control-flow abstractions example](#control-flow-abstractions), where the `helper()` function in the `runInfiniteLoop()` function represented the next loop iteration to schedule.

Compared to using callbacks, suspending functions don't require you to define the subsequent work separately.
The compiler creates a continuation that represents the execution following a suspension point.

After the animation finishes, the [`Continuation.resumeWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines/-continuation/resume-with.html) function resumes that execution with a result.
The `suspendMain()` function then continues after the suspension point and starts the next loop iteration.

> The `suspendCoroutine()` function is used here only to demonstrate how suspension works.
> Don't use it in production code that needs to support [cancellation](coroutines-cancellation.md).
> 
{style="warning"}

To run the suspending `suspendMain()` function from the `main()` function, the application starts a [_coroutine_](coroutines-overview.md), a suspendable computation that can pause and resume execution.
The `main()` function wraps the `suspendMain()` call in a suspending lambda and starts the coroutine with the [`startCoroutineUninterceptedOrReturn()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.intrinsics/start-coroutine-unintercepted-or-return.html) function:

```kotlin
userInputActor.sendRequest {
    suspend {
        suspendMain(printlnActor, userInputActor)
    }.startCoroutineUninterceptedOrReturn(
        Continuation<Unit>(EmptyCoroutineContext) {
        }
    )
}
```

With suspending functions, the application can express dependencies between asynchronous operations without manually scheduling each execution path.
This keeps the order of operations visible in the code and reduces the amount of control-flow logic you need to maintain.

Here's the complete implementation for this version of the reminder application:

```kotlin
@file:OptIn(kotlin.concurrent.atomics.ExperimentalAtomicApi::class)
import kotlin.concurrent.atomics.AtomicBoolean
        import kotlin.time.Clock
        import kotlin.time.ComparableTimeMark
        import kotlin.time.Duration
        import kotlin.time.TimeSource
        import kotlin.coroutines.*
        import kotlin.coroutines.intrinsics.startCoroutineUninterceptedOrReturn

typealias RequestType = () -> Unit

@Suppress("PLATFORM_CLASS_MAPPED_TO_KOTLIN")
class SimpleActor {
    private val requests = mutableListOf<RequestType>()

    init {
        Thread {
            while (true) {
                val request = synchronized(requests) {
                    val request = requests.removeFirstOrNull()
                    if (request == null) {
                        (requests as Object).wait()
                        continue
                    }
                    request
                }
                request()
            }
        }.apply {
            isDaemon = true
            start()
        }
    }

    /**
     * Sends a request that will execute on the thread of this actor.
     *
     * Requests to any given actor execute one-by-one,
     * never in parallel.
     */
    fun sendRequest(
        request: RequestType,
    ) {
        synchronized(requests) {
            requests.add(request)
            (requests as Object).notify()
        }
    }
}

fun scheduleReminder(
    printlnActor: SimpleActor,
    remindIn: Duration,
    reminderText: List<String>
) {
    Thread {
        Thread.sleep(remindIn.inWholeMilliseconds)
        val stringToPrint = buildString {
            append("*** REMINDER (SCHEDULED $remindIn AGO)")
            if (reminderText.isNotEmpty()) {
                append(": ")
                for (word in reminderText) {
                    append(word)
                    append(' ')
                }
            } else {
                append(' ')
            }
            append("***")
        }
        printlnActor.sendRequest {
            println(stringToPrint)
        }
    }.apply {
        isDaemon = false
        start()
    }
}

val shouldTerminate = AtomicBoolean(false)

suspend fun suspendMain(printlnActor: SimpleActor, userInputActor: SimpleActor) {
    while (true) {
        printlnActor.sendRequest {
            println("Please enter your input:")
        }
        val input = readlnOrNull() ?: break
        val command = input
            .trim().split("\\s".toRegex())
            .toMutableList()
        val operation = command.removeFirstOrNull() ?: continue
        when (val operationInLowerCase = operation.lowercase()) {
            "remind" -> {
                val remindIn = command.removeFirstOrNull()
                val remindInParsed = remindIn?.let(Duration::parseOrNull)
                if (remindInParsed == null) {
                    printlnActor.sendRequest {
                        println(buildString {
                            append("The 'remind' command requires a 'Duration' argument")
                            if (remindIn != null) {
                                append(", got '$remindIn'")
                            }
                        })
                        println()
                        printRemindSyntax()
                    }
                } else {
                    scheduleReminder(printlnActor, remindInParsed, command)
                    printlnActor.sendRequest {
                        println("Scheduled a reminder in $remindInParsed")
                        println("    (fires at ${Clock.System.now() + remindInParsed})")
                    }
                }
            }
            "help" -> printlnActor.sendRequest {
                printHelp()
            }
            "fun_animation" -> {
                suspendCoroutine { cont ->
                    printlnActor.sendRequest {
                        for (frame in funAnimationFrames) {
                            println(frame)
                            Thread.sleep(200) // 200 milliseconds
                        }
                        userInputActor.sendRequest {
                            cont.resumeWith(Result.success(Unit))
                        }
                    }
                }
            }
            "quit" -> {
                break
            }
            else -> printlnActor.sendRequest {
                println("Unknown command '$operationInLowerCase'")
                println()
                printHelp()
            }
        }
    }
    printlnActor.sendRequest {
        println("All done! The program will exit once all pending reminders fire.")
        // Allow the main thread to exit
        shouldTerminate.store(true)
    }
}

fun main() {
    val printlnActor = SimpleActor()
    val userInputActor = SimpleActor()

    userInputActor.sendRequest {
        suspend {
            suspendMain(printlnActor, userInputActor)
        }.startCoroutineUninterceptedOrReturn(
            Continuation<Unit>(EmptyCoroutineContext) {
            }
        )
    }

    // Keep the program alive: if we simply exit the main thread,
    // everything will terminate.
    while (!shouldTerminate.load()) {
        Thread.sleep(100)
    }
}

private fun printHelp() {
    println("Usage:")
    printRemindSyntax()
    printFunAnimationSyntax()
    printHelpSyntax()
    printQuitSyntax()
    println()
}

private fun printRemindSyntax() {
    println("remind duration [message] - remind about something")
    println("\texample: remind 10m Turn off stove")
}

private fun printFunAnimationSyntax() {
    println("fun_animation - show a fun animation to pass the time")
}

private fun printHelpSyntax() {
    println("help - show a list of available commands")
}

private fun printQuitSyntax() {
    println("quit - exit this program")
}

private val funAnimationFrames = (
        "#       _---_#     / o o o \\#    <=========>####       o#    " +
                "  /|\\#      / \\#~@##       _---_#     / o o o \\#    <=======" +
                "==>###       o#      /|\\#      / \\#~@###       _---_#     / " +
                "o o o \\#    <=========>##       o#      /|\\#      / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /         \\#   /    o      \\#       /|\\#       / \\#~@## " +
                "      _---_#     / o o o \\#    <=========>#     /       \\# " +
                "   /   o     \\#   /   /|\\     \\#       / \\##~@##       _---" +
                "_#     / o o o \\#    <=========>#     /  o    \\#    /  /|\\" +
                "    \\#   /   / \\     \\###~@##       _---_#     / o o o \\#  " +
                "  <=========>#     /       \\#    /         \\#   /          " +
                " \\###~@##       _---_#     / - - - \\#    <=========>######~" +
                "@#       _---_#     / - - - \\#    <=========>#       * * *#" +
                "#####~@       * * *#         *#########~"
        ).replace("~", "==============================")
    .replace("#", "\n")
    .split("@")
```
{collapsible="true" collapsed-title="Complete Example5.kt file"}

## What's next

* Learn more about coroutines and how they support asynchronous and concurrent programming in [Coroutines](coroutines-overview.md).
