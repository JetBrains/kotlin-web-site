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
    // Order matters: the success condition goes first, then the symptoms from
    // the most specific to the most general - the shape of the output before
    // the content of the lines.
    // Known limitation: the unchanged starter code prints exactly the expected
    // 8 lines, so by stdout alone it is indistinguishable from a loop-based
    // solution; the exercise text already asks to refactor into a loop.
    @Test
    fun `the pizza story is told slice by slice`() {
        val lines = outputLines
        when {
            lines == EXPECTED_LINES -> return passed()

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

            lines.size == 1 ->
                hint(
                    "Everything is printed on a single line. " +
                            "Use println() instead of print() to put each message on its own line."
                )

            lines.size < 8 ->
                hint(
                    "Only ${lines.size} lines are printed, but 8 are expected. " +
                            "The loop stops too early - check its condition."
                )

            lines.size > 8 ->
                hint(
                    "${lines.size} lines are printed, but only 8 are expected. " +
                            "The loop runs too many times - check its condition."
                )

            else -> {}
        }

        // 8 lines are printed, but at least one is wrong: report the first
        // wrong line, so the mismatch details are prepared before choosing a hint.
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

            mismatch == 7 && "There are" in actual && "There are 8" !in actual ->
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
