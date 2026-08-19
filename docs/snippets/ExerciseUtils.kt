import java.io.ByteArrayOutputStream
import java.io.PrintStream

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

// The learner's output with the surrounding whitespace stripped - what the step
// checks compare against. To tell an empty output from a blank one, check the
// raw actualOutput directly.
val output: String by lazy { actualOutput.trim() }

// Passes the step. Together with hint() it lets every step read as a single
// when expression over the output: the success condition goes first, then the
// symptoms from the most specific to the most general, and the compiler
// guarantees an exhaustive else fallback. Touching the lazy actualOutput
// guarantees the learner sees their output in the console - exactly once, and
// only when it is not empty - even if the step's check never read it.
fun passed() {
    actualOutput.let {}
}

// Fails the step and shows the hint to the learner. shownOutput is attached to
// the message unless it is empty: by default it is the learner's whole output,
// but a step can pass only the relevant part of a long output, or "" to attach
// nothing.
fun hint(hint: String, shownOutput: String = output): Nothing =
    kotlin.test.fail(if (shownOutput.isEmpty()) hint else withOutput(hint, shownOutput))

// The playground renders test messages as raw HTML, so the actual output is attached
// as an extra console block that is displayed in the regular (non-error) text color.
private fun withOutput(hint: String, output: String): String {
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
