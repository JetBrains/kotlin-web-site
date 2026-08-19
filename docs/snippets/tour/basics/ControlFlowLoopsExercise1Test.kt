import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test
import kotlin.test.fail

private val EXPECTED_LINES =
    (1..7).map { "There's only $it slice/s of pizza :(" } +
            "There are 8 slices of pizza. Hooray! We have a whole pizza! :D"

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    actualOutput.trim().lines().map { it.trim() }.filter { it.isNotEmpty() }
}

// Symptom -> hint table for step 2. Order matters: the most specific hints go first.
// Built lazily because the hint texts include the actual line count.
private val STEP_2_HINTS: List<Hint> by lazy {
    listOf(
        Hint(
            { outputLines.size == 1 },
            "Everything is printed on a single line. " +
                    "Use println() instead of print() to put each message on its own line."
        ),
        Hint(
            { outputLines.size < 8 },
            "Only ${outputLines.size} lines are printed, but 8 are expected. " +
                    "The loop stops too early - check its condition."
        ),
    )
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise1Test {

    @Test
    fun `step 1 - the program prints output`() = checkStep(
        emptyHint = "Nothing is printed yet. Refactor the repeated code into a loop " +
                "that counts the slices and run again.",
        blankHint = "println() is called, but the message is empty. " +
                "Print how many slices of pizza there are.",
        hints = emptyList(),
        fallbackHint = "Fix step 1 first.",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - the program prints 8 lines`() = checkStep(
        emptyHint = "Fix step 1 first.",
        blankHint = "Fix step 1 first.",
        hints = STEP_2_HINTS,
        fallbackHint = "${outputLines.size} lines are printed, but only 8 are expected. " +
                "The loop runs too many times - check its condition.",
    ) { outputLines.size == 8 }

    // This step reports the first wrong line, so it builds its own detailed
    // messages instead of using a fixed hint table.
    @Test
    fun `step 3 - every line tells the pizza story correctly`() {
        val lines = outputLines
        if (lines.size != 8) {
            fail("Fix step 2 first.")
        }
        val mismatch = EXPECTED_LINES.indices.firstOrNull { lines[it] != EXPECTED_LINES[it] }
            ?: return
        val expected = EXPECTED_LINES[mismatch]
        val actual = lines[mismatch]
        val details = "Line ${mismatch + 1}: expected \"${escapeHtml(expected)}\", " +
                "but was \"${escapeHtml(actual)}\". "
        val output = lines.joinToString("\n")
        when {
            mismatch == 7 && "There's only" in actual ->
                fail(
                    withOutput(
                        details + "The last line should celebrate the whole pizza. " +
                                "The loop should stop before the 8th slice so the final " +
                                "println() can run after it.",
                        output
                    )
                )

            mismatch == 7 && "There are" in actual ->
                fail(
                    withOutput(
                        details + "By the final line, pizzaSlices should be 8. " +
                                "Don't forget the last pizzaSlices++ after the loop.",
                        output
                    )
                )

            "There's only" in actual && "$mismatch " in actual ->
                fail(
                    withOutput(
                        details + "The count is one behind. Increment pizzaSlices " +
                                "before printing it, so the first line says 1.",
                        output
                    )
                )

            "There's only" in actual ->
                fail(
                    withOutput(
                        details + "Line ${mismatch + 1} should say there are ${mismatch + 1} " +
                                "slice/s. Check where you increment pizzaSlices inside the loop.",
                        output
                    )
                )

            else ->
                fail(withOutput(details + "Almost there - every character counts.", output))
        }
    }
}


private fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")
