import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val WIN = "You win :)"
private const val LOSE = "You lose :("

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise1Test {

    @Test
    fun `step 1 - the if-else picks one game result`() {
        val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
        // Order matters: the most specific symptoms go first.
        when {
            output == WIN || output == LOSE -> passed()

            actualOutput.isEmpty() ->
                hint(
                    "Nothing is printed yet. Add an if/else that compares the dice " +
                            "and prints the result, then run again."
                )

            output.isEmpty() ->
                hint(
                    "println() is called, but the message is empty. " +
                            "Print \"You win :)\" or \"You lose :(\"."
                )

            lines.any { it.equals(WIN, ignoreCase = true) } &&
                    lines.any { it.equals(LOSE, ignoreCase = true) } ->
                hint(
                    "Both results are printed, but the dice can't win and lose at " +
                            "the same time. Use if/else so that only one branch runs."
                )

            lines.size > 1 ->
                hint(
                    "The right idea, but there is extra output. " +
                            "Print only one line: \"You win :)\" or \"You lose :(\"."
                )

            output.equals(WIN, ignoreCase = true) || output.equals(LOSE, ignoreCase = true) ->
                hint("So close! Only the capitalization is off.")

            output.startsWith("You win", ignoreCase = true) ||
                    output.startsWith("You lose", ignoreCase = true) ->
                hint(
                    "Almost there! Don't forget the smiley: " +
                            "\"You win :)\" or \"You lose :(\"."
                )

            else ->
                hint("The output should be exactly \"You win :)\" or \"You lose :(\".")
        }
    }

    // The dice are random, so this step runs main() many times on its own instead
    // of inspecting the single shared run.
    @Test
    fun `step 2 - the result depends on the dice`() {
        var wins = 0
        var losses = 0
        repeat(100) {
            when (val result = runMain(echo = false).trim()) {
                WIN -> wins++
                LOSE -> losses++
                else -> hint("Fix step 1 first.", shownOutput = result)
            }
        }
        when {
            losses == 0 ->
                hint(
                    "The program always prints \"You win :)\", no matter what the dice show. " +
                            "Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result.",
                    shownOutput = ""
                )

            wins == 0 ->
                hint(
                    "The program always prints \"You lose :(\", no matter what the dice show. " +
                            "Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result.",
                    shownOutput = ""
                )
        }
    }
}
