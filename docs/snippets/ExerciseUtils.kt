@file:OptIn(ExperimentalStdlibApi::class)

import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.math.abs

private var caughtTodo: NotImplementedError? = null

fun runMain(echo: Boolean = false): String {
    val out = ByteArrayOutputStream()
    val originalOut = System.out

    try {
        System.setOut(PrintStream(out))
        main()
    } catch (e: NotImplementedError) {
        caughtTodo = e
    } finally {
        System.setOut(originalOut)
    }

    return out.toString().also { if (echo) print(it) }
}

val actualOutput: String by lazy { runMain(echo = true) }
val output: String by lazy { actualOutput.trim() }

/** The TODO() that stopped main(), if any. Null once the learner replaced every reached TODO(). */
val firedTodo: NotImplementedError? by lazy {
    actualOutput
    caughtTodo
}

fun passed(note: String = "") {
    actualOutput.let {}
    if (note.isNotEmpty()) println(note)
}

fun hint(hint: String, shownOutput: String = output): Nothing =
    kotlin.test.fail(if (shownOutput.isEmpty()) hint else withOutput(hint, shownOutput))

fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")

private fun withOutput(hint: String, output: String): String {
    val display = escapeHtml(output.trimEnd('\n'))
    val separator = if ('\n' in display) "\n" else " "
    return consoleBlock(hint, "Output: " + separator + display)
}

private fun consoleBlock(hint: String, text: String): String =
    hint +
            "</div></div>" +
            "<div class=\"console-block\"><span class=\"console-icon\"></span>" +
            "<div style=\"white-space:pre-wrap\">" + text

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
        null -> "${escapeHtml(call)} returns ${show(actual)}, but ${show(expected)} is expected."
        else -> "${escapeHtml(call)} throws ${thrown::class.simpleName ?: "an exception"}" +
                (thrown.message?.let { ": " + escapeHtml(it) } ?: "") +
                ", but ${show(expected)} is expected."
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
    kotlin.test.fail(consoleBlock(hint, failed.report))

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
