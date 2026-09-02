import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val WIN = "You win :)"
private const val LOSE = "You lose :("

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise1Test {

    @Test
    fun `print a win only when the dice match`() {
        val rawRuns = List(100) { runMain(echo = false) }
        val runs = rawRuns.map { it.trim() }
        val wins = runs.count { it == WIN }
        val losses = runs.count { it == LOSE }

        val sample = runs.firstOrNull { it.isNotEmpty() && it != WIN && it != LOSE }
        val sampleLines = sample.orEmpty().lines().map { it.trim() }.filter { it.isNotEmpty() }

        when {
            wins > 0 && losses > wins && wins + losses == runs.size ->
                passed()

            rawRuns.all { it.isEmpty() } ->
                hint(
                    "Add an if/else that compares the dice and prints the result, " +
                            "then run again. Nothing is printed yet.",
                    shownOutput = ""
                )

            runs.all { it.isEmpty() } ->
                hint(
                    "Print \"You win :)\" or \"You lose :(\". " +
                            "println() is called, but the message is empty.",
                    shownOutput = ""
                )

            sample != null && sampleLines.any { it.equals(WIN, ignoreCase = true) } &&
                    sampleLines.any { it.equals(LOSE, ignoreCase = true) } ->
                hint(
                    "Use if/else so that only one branch runs. Both results are " +
                            "printed, but the dice can't win and lose at the same time.",
                    shownOutput = sample
                )

            sample != null && sampleLines.size > 1 ->
                hint(
                    "Remove the extra output. " +
                            "Print only one line: \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            sample != null &&
                    (sample.equals(WIN, ignoreCase = true) || sample.equals(LOSE, ignoreCase = true)) ->
                hint(
                    "Match the capitalization. " +
                            "Print \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            sample != null && (sample.startsWith("You win", ignoreCase = true) ||
                    sample.startsWith("You lose", ignoreCase = true)) ->
                hint(
                    "Add the smiley to the message. " +
                            "Print \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            sample != null ->
                hint(
                    "Print exactly \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            runs.any { it.isEmpty() } ->
                hint(
                    "Print \"You win :)\" when the dice match and \"You lose :(\" " +
                            "otherwise. Some runs print nothing at all, so one branch " +
                            "of the if/else is missing.",
                    shownOutput = ""
                )

            losses == 0 ->
                hint(
                    "Compare the two dice with firstResult == secondResult instead " +
                            "of always printing the same result. The program prints " +
                            "\"You win :)\", no matter what the dice show.",
                    shownOutput = ""
                )

            wins == 0 ->
                hint(
                    "Compare the two dice with firstResult == secondResult instead " +
                            "of always printing the same result. The program prints " +
                            "\"You lose :(\", no matter what the dice show.",
                    shownOutput = ""
                )

            else ->
                hint(
                    "Check that you print \"You win :)\" when firstResult == " +
                            "secondResult, and \"You lose :(\" otherwise. Winning is " +
                            "the rare result: the dice match only one time in six.",
                    shownOutput = ""
                )
        }
    }
}
