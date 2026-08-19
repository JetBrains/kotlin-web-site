import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.fail

// Shared support code for the tour exercise tests. The playground compiles all
// files listed in kotlin-hidden-files together with the learner's code.

// Runs the learner's main() with stdout captured. System.out is always restored,
// even when main() throws. When echo is true, the captured output is printed
// back so the learner still sees it in the console.
fun runMain(echo: Boolean = false): String {
    val out = ByteArrayOutputStream()
    val originalOut = System.out
    try {
        System.setOut(PrintStream(out))
        main()
    } finally {
        System.setOut(originalOut)
    }
    return out.toString().also { if (echo) print(it) }
}

// main() runs exactly once per test run; every step inspects the same snapshot,
// and the learner sees their output in the console exactly once.
val actualOutput: String by lazy { runMain(echo = true) }

// A symptom -> hint rule: when matches() is true for the learner's output,
// the hint is shown.
class Hint(val matches: (String) -> Boolean, val hint: String)

// Checks one step of an exercise: passes when isOk() is true for the trimmed
// output, otherwise fails with the most specific hint. Order of hints matters -
// the most specific ones go first.
fun checkStep(
    emptyHint: String,
    blankHint: String,
    hints: List<Hint> = emptyList(),
    fallbackHint: String = "Not quite. Compare your output with the expected one.",
    isOk: (String) -> Boolean,
) {
    val output = actualOutput.trim()
    if (isOk(output)) return
    when {
        actualOutput.isEmpty() -> fail(emptyHint)
        actualOutput.isBlank() -> fail(blankHint)
        else -> {
            val hint = hints.firstOrNull { it.matches(output) }?.hint ?: fallbackHint
            fail(withOutput(hint, output))
        }
    }
}

// The playground renders test messages as raw HTML, so the actual output is attached
// as an extra console block that is displayed in the regular (non-error) text color.
fun withOutput(hint: String, output: String): String {
    val display = output.trimEnd('\n')
        .replace("&", "&#38;")
        .replace("<", "&#60;")
        .replace(">", "&#62;")
    val separator = if ('\n' in display) "\n" else " "
    return hint +
            "</div></div>" +
            "<div class=\"console-block\"><span class=\"console-icon\"></span>" +
            "<div style=\"white-space:pre-wrap\">Output: " + separator + display
}
