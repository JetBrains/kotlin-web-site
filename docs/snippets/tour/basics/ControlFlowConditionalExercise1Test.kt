import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val WIN = "You win :)"
private const val LOSE = "You lose :("

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise1Test {
    // The dice are random, so a single run proves nothing: the same code can
    // print a different result - or nothing at all - on every run. The test
    // runs main() many times and diagnoses the series as a whole, so the
    // verdict is the same on every run. The success condition also requires
    // losing more often than winning: the dice match only one time in six, so
    // a correct solution wins about 17 runs out of 100, and the chance of a
    // wrong verdict on it is negligible.
    @Test
    fun `the result depends on the dice`() {
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
                    "Nothing is printed yet. Add an if/else that compares the dice " +
                            "and prints the result, then run again.",
                    shownOutput = ""
                )

            runs.all { it.isEmpty() } ->
                hint(
                    "println() is called, but the message is empty. " +
                            "Print \"You win :)\" or \"You lose :(\".",
                    shownOutput = ""
                )

            sample != null && sampleLines.any { it.equals(WIN, ignoreCase = true) } &&
                    sampleLines.any { it.equals(LOSE, ignoreCase = true) } ->
                hint(
                    "Both results are printed, but the dice can't win and lose at " +
                            "the same time. Use if/else so that only one branch runs.",
                    shownOutput = sample
                )

            sample != null && sampleLines.size > 1 ->
                hint(
                    "The right idea, but there is extra output. " +
                            "Print only one line: \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            sample != null &&
                    (sample.equals(WIN, ignoreCase = true) || sample.equals(LOSE, ignoreCase = true)) ->
                hint("So close! Only the capitalization is off.", shownOutput = sample)

            sample != null && (sample.startsWith("You win", ignoreCase = true) ||
                    sample.startsWith("You lose", ignoreCase = true)) ->
                hint(
                    "Almost there! Don't forget the smiley: " +
                            "\"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            sample != null ->
                hint(
                    "The output should be exactly \"You win :)\" or \"You lose :(\".",
                    shownOutput = sample
                )

            runs.any { it.isEmpty() } ->
                hint(
                    "Sometimes a result is printed and sometimes nothing at all - " +
                            "one branch of the if/else is missing. Print \"You win :)\" " +
                            "when the dice match and \"You lose :(\" otherwise.",
                    shownOutput = ""
                )

            losses == 0 ->
                hint(
                    "The program always prints \"You win :)\", no matter what the dice " +
                            "show. Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result.",
                    shownOutput = ""
                )

            wins == 0 ->
                hint(
                    "The program always prints \"You lose :(\", no matter what the " +
                            "dice show. Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result.",
                    shownOutput = ""
                )

            else ->
                hint(
                    "Both results show up, but winning should be the rare one: " +
                            "the dice match only one time in six. Check that you print " +
                            "\"You win :)\" when firstResult == secondResult, not the " +
                            "other way round.",
                    shownOutput = ""
                )
        }
    }
}
