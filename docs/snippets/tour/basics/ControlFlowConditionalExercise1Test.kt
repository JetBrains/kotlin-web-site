import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test
import kotlin.test.fail

private const val WIN = "You win :)"
private const val LOSE = "You lose :("

// Symptom -> hint table for step 2. Order matters: the most specific hints go first.
private val HINTS: List<Hint> = listOf(
    Hint(
        { output ->
            val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
            lines.any { it.equals(WIN, ignoreCase = true) } &&
                    lines.any { it.equals(LOSE, ignoreCase = true) }
        },
        "Both results are printed, but the dice can't win and lose at " +
                "the same time. Use if/else so that only one branch runs."
    ),
    Hint(
        { output -> output.lines().map { it.trim() }.count { it.isNotEmpty() } > 1 },
        "The right idea, but there is extra output. " +
                "Print only one line: \"You win :)\" or \"You lose :(\"."
    ),
    Hint(
        { it.equals(WIN, ignoreCase = true) || it.equals(LOSE, ignoreCase = true) },
        "So close! Only the capitalization is off."
    ),
    Hint(
        {
            it.startsWith("You win", ignoreCase = true) ||
                    it.startsWith("You lose", ignoreCase = true)
        },
        "Almost there! Don't forget the smiley: " +
                "\"You win :)\" or \"You lose :(\"."
    ),
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise1Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(
        emptyHint,
        blankHint,
        HINTS,
        "The output should be exactly \"You win :)\" or \"You lose :(\".",
        isOk
    )

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Add an if/else that compares the dice " +
                "and prints the result, then run again.",
        blankHint = "println() is called, but the message is empty. " +
                "Print \"You win :)\" or \"You lose :(\".",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - the output is a valid game result`() = check { it == WIN || it == LOSE }

    // The dice are random, so this step runs main() many times on its own instead
    // of inspecting the single shared run.
    @Test
    fun `step 3 - both outcomes are possible`() {
        var wins = 0
        var losses = 0
        repeat(100) {
            when (runMain(echo = false).trim()) {
                WIN -> wins++
                LOSE -> losses++
                else -> fail("Fix step 2 first.")
            }
        }
        when {
            losses == 0 ->
                fail(
                    "The program always prints \"You win :)\", no matter what the dice show. " +
                            "Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result."
                )

            wins == 0 ->
                fail(
                    "The program always prints \"You lose :(\", no matter what the dice show. " +
                            "Compare the two dice with firstResult == secondResult " +
                            "instead of always printing the same result."
                )
        }
    }
}
