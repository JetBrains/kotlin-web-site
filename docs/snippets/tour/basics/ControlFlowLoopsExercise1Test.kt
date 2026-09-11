import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_LINES =
    (1..7).map { "There's only $it slice/s of pizza :(" } +
            "There are 8 slices of pizza. Hooray! We have a whole pizza! :D"

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise1Test {

    @Test
    fun `print a line for every pizza slice`() {
        val lines = outputLines
        when {
            lines == EXPECTED_LINES -> return passed(
                "Checked: the story output only. The test can't see your loop. " +
                        "The task asks for two versions: one with while and one with " +
                        "do-while, so make sure you try both."
            )

            actualOutput.isEmpty() ->
                hint(
                    "Refactor the repeated code into a loop that counts the slices, " +
                            "then run again. Nothing is printed yet."
                )

            output.isEmpty() ->
                hint(
                    "Print how many slices of pizza there are. " +
                            "println() is called, but the message is empty."
                )

            lines.size == 1 ->
                hint(
                    "Use println() instead of print() to put each message on its " +
                            "own line. Everything is printed on a single line so far."
                )

            lines.first().startsWith("There's only 0") ->
                hint(
                    "Increment pizzaSlices before printing it, so the first line " +
                            "says 1. Right now the story starts at 0 slices."
                )

            lines.size < 8 ->
                hint(
                    "Check the loop condition. Only ${lines.size} lines are printed, " +
                            "but 8 are expected, so the loop stops too early."
                )

            lines.size > 8 ->
                hint(
                    "Check the loop condition. ${lines.size} lines are printed, " +
                            "but only 8 are expected, so the loop runs too many times."
                )

            else -> {}
        }

        val mismatch = EXPECTED_LINES.indices.firstOrNull { lines[it] != EXPECTED_LINES[it] }
            ?: return
        val expected = EXPECTED_LINES[mismatch]
        val actual = lines[mismatch]
        val details = "Line ${mismatch + 1}: the output is \"${escapeHtml(actual)}\", " +
                "but \"${escapeHtml(expected)}\" is expected."
        when {
            mismatch == 7 && "There's only" in actual ->
                hint(
                    "Stop the loop before the 8th slice so the final println() can " +
                            "run after it. The last line should celebrate the whole " +
                            "pizza. " + details
                )

            mismatch == 7 && "There are" in actual && "There are 8" !in actual ->
                hint(
                    "Add the last pizzaSlices++ after the loop. " +
                            "By the final line, pizzaSlices is 8. " + details
                )

            "There's only" in actual && "$mismatch " in actual ->
                hint(
                    "Increment pizzaSlices before printing it. " +
                            "The count is one behind. " + details
                )

            "There's only" in actual ->
                hint(
                    "Check where you increment pizzaSlices inside the loop. " +
                            "Line ${mismatch + 1} should say there are ${mismatch + 1} " +
                            "slice/s. " + details
                )

            else ->
                hint("Check the line carefully. Every character counts. " + details)
        }
    }
}
