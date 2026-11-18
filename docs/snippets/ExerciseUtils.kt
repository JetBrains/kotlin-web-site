@file:OptIn(ExperimentalStdlibApi::class)

import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.io.PrintStream
import kotlin.math.abs

private var caughtTodo: NotImplementedError? = null
private val callSites = mutableListOf<Int>()

private class CallSiteRecordingStream(out: OutputStream) : PrintStream(out) {
    override fun println(x: Any?) {
        recordCallSite()
        super.println(x)
    }

    override fun println(x: String?) {
        recordCallSite()
        super.println(x)
    }
}

/** Records the line in the learner's main() that called println(). */
private fun recordCallSite() {
    Throwable().stackTrace.firstOrNull { it.methodName == "main" }?.let { callSites += it.lineNumber }
}

fun runMain(echo: Boolean = false): String {
    val out = ByteArrayOutputStream()
    val originalOut = System.out

    try {
        System.setOut(CallSiteRecordingStream(out))
        main()
    } catch (e: NotImplementedError) {
        caughtTodo = e
    } finally {
        System.setOut(originalOut)
    }

    return out.toString().also { if (echo) print(it) }
}

val actualOutput: String by lazy { runMain() }
val output: String by lazy { actualOutput.trim() }

/** Source line of each println() call made by main(), in call order. */
val printCallLines: List<Int> by lazy {
    actualOutput
    callSites
}

/** The TODO() that stopped main(), if any. Null once the learner replaced every reached TODO(). */
val firedTodo: NotImplementedError? by lazy {
    actualOutput
    caughtTodo
}

/** Prints [text] to stdout, where Playground shows it as the test's Output. Skips empty text. */
private fun printOutput(text: String) {
    if (text.isNotEmpty()) println(text)
}

/** Prints the learner's output to stdout, so Playground shows it under the passed test, then the [note]. */
fun passed(note: String = "", showOutput: Boolean = false) {
    actualOutput.let {}
    if (showOutput) printOutput(output)
    if (note.isNotEmpty()) println(note)
}

/** Prints [shownOutput] to stdout, so Playground shows it under the failed test, then fails with [hint]. */
fun hint(hint: String, shownOutput: String = output): Nothing {
    printOutput(shownOutput)
    kotlin.test.fail(hint)
}

fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")

/** Adds [line] below [message] in the same element, so it keeps the message color and gets no extra icon. */
private fun appendLine(message: String, line: String): String =
    if (message.isEmpty()) line else message + "\n" + line

class Expectation internal constructor(
    val call: String,
    val expected: Any?,
    val actual: Any?,
    val thrown: Throwable?,
    tolerance: Double,
) {
    val isCorrect: Boolean = thrown == null && valuesMatch(actual, expected, tolerance)

    /** True when the learner's code stopped at a TODO() instead of computing a value. */
    val isTodo: Boolean = thrown is NotImplementedError

    val report: String = when (thrown) {
        null -> "${escapeHtml(call)} returns ${show(actual)}, but it should be ${show(expected)}."
        else -> "${escapeHtml(call)} threw ${thrown::class.simpleName ?: "an exception"}" +
                (thrown.message?.let { ": " + escapeHtml(it) } ?: "") +
                ", but it should be ${show(expected)}."
    }
}

fun expect(call: String, expected: Any?, tolerance: Double = 1e-9, actual: () -> Any?): Expectation {
    var value: Any? = null
    var thrown: Throwable? = null
    try {
        value = actual()
    } catch (e: Throwable) {
        thrown = e
    }
    return Expectation(call, expected, value, thrown, tolerance)
}

fun List<Expectation>.firstMismatch(): Expectation? = firstOrNull { !it.isCorrect }

fun hint(hint: String, failed: Expectation): Nothing =
    kotlin.test.fail(appendLine(hint, failed.report))

private fun valuesMatch(actual: Any?, expected: Any?, tolerance: Double): Boolean = when {
    expected is Double && actual is Number -> abs(actual.toDouble() - expected) <= tolerance
    expected is Float && actual is Number -> abs(actual.toDouble() - expected) <= tolerance
    else -> actual == expected
}

private fun show(value: Any?): String = when (value) {
    null -> "null"
    Unit -> "no value"
    is String -> "\"" + escapeHtml(value) + "\""
    is Char -> "'" + escapeHtml(value.toString()) + "'"
    else -> escapeHtml(value.toString())
}
