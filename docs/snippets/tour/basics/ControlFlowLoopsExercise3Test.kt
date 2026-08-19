import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val ALL_WORDS = listOf("dinosaur", "limousine", "magazine", "language")
private val EXPECTED_WORDS = listOf("limousine", "language")

// Symptom -> hint table for step 2. Order matters: the most specific hints go first.
// Built lazily because some hint texts quote the learner's actual output.
private val HINTS: List<Hint> by lazy {
    val lines = actualOutput.trim().lines().map { it.trim() }.filter { it.isNotEmpty() }
    val wrongWord = lines.firstOrNull { it in ALL_WORDS && it !in EXPECTED_WORDS }
    val missingWord = EXPECTED_WORDS.firstOrNull { it !in lines }
    listOf(
        Hint(
            { lines.containsAll(ALL_WORDS) },
            "Every word is printed. Add an if condition with " +
                    "startsWith(\"l\") inside the loop so that only " +
                    "\"limousine\" and \"language\" pass the check."
        ),
        Hint(
            { lines.size == 1 && lines[0].equals("limousinelanguage", ignoreCase = true) },
            "The right words are there, but they are glued together. " +
                    "Use println() instead of print() to put each word on its own line."
        ),
        Hint(
            { _ -> lines.map { it.lowercase() } == EXPECTED_WORDS },
            "So close! Only the capitalization is off."
        ),
        Hint(
            { wrongWord != null },
            "\"$wrongWord\" doesn't start with \"l\", so it shouldn't be " +
                    "printed. Check the condition of your if."
        ),
        Hint(
            { _ -> missingWord != null && lines.all { it in EXPECTED_WORDS } },
            "\"$missingWord\" starts with \"l\", but it isn't printed. " +
                    "Check the condition of your if."
        ),
    )
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise3Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(
        emptyHint,
        blankHint,
        HINTS,
        "The output should be \"limousine\" and \"language\", " +
                "each on its own line.",
        isOk
    )

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Loop over the list with for and print the " +
                "words that start with \"l\". If you already have a condition " +
                "but nothing matches, make sure it checks for a lowercase \"l\".",
        blankHint = "println() is called, but the message is empty. " +
                "Print the words that start with \"l\".",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - only the words starting with 'l' are printed`() = check { output ->
        output.lines().map { it.trim() }.filter { it.isNotEmpty() } == EXPECTED_WORDS
    }
}
