import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_LINES =
    (1..7).map { "There's only $it slice/s of pizza :(" } +
            "There are 8 slices of pizza. Hooray! We have a whole pizza! :D"

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise1Test {

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 1 - the loop repeats 8 times`() = when {
        outputLines.size == 8 -> passed()

        actualOutput.isEmpty() ->
            hint(
                "Nothing is printed yet. Refactor the repeated code into a loop " +
                        "that counts the slices and run again."
            )

        output.isEmpty() ->
            hint(
                "println() is called, but the message is empty. " +
                        "Print how many slices of pizza there are."
            )

        outputLines.size == 1 ->
            hint(
                "Everything is printed on a single line. " +
                        "Use println() instead of print() to put each message on its own line."
            )

        outputLines.size < 8 ->
            hint(
                "Only ${outputLines.size} lines are printed, but 8 are expected. " +
                        "The loop stops too early - check its condition."
            )

        else ->
            hint(
                "${outputLines.size} lines are printed, but only 8 are expected. " +
                        "The loop runs too many times - check its condition."
            )
    }

    // This step reports the first wrong line, so it prepares the mismatch
    // details before choosing a hint.
    @Test
    fun `step 2 - every line tells the pizza story correctly`() {
        val lines = outputLines
        if (lines.size != 8) {
            hint("Fix step 1 first.", shownOutput = "")
        }
        val mismatch = EXPECTED_LINES.indices.firstOrNull { lines[it] != EXPECTED_LINES[it] }
            ?: return
        val expected = EXPECTED_LINES[mismatch]
        val actual = lines[mismatch]
        val details = "Line ${mismatch + 1}: expected \"${escapeHtml(expected)}\", " +
                "but was \"${escapeHtml(actual)}\". "
        when {
            mismatch == 7 && "There's only" in actual ->
                hint(
                    details + "The last line should celebrate the whole pizza. " +
                            "The loop should stop before the 8th slice so the final " +
                            "println() can run after it."
                )

            mismatch == 7 && "There are" in actual ->
                hint(
                    details + "By the final line, pizzaSlices should be 8. " +
                            "Don't forget the last pizzaSlices++ after the loop."
                )

            "There's only" in actual && "$mismatch " in actual ->
                hint(
                    details + "The count is one behind. Increment pizzaSlices " +
                            "before printing it, so the first line says 1."
                )

            "There's only" in actual ->
                hint(
                    details + "Line ${mismatch + 1} should say there are ${mismatch + 1} " +
                            "slice/s. Check where you increment pizzaSlices inside the loop."
                )

            else ->
                hint(details + "Almost there - every character counts.")
        }
    }
}


private fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")
