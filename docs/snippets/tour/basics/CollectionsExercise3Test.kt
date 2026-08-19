import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "2 is spelled as 'two'"

// The older example solution printed "spelt" instead of "spelled",
// so both spellings are accepted as a correct answer.
private const val EXPECTED_ALT = "2 is spelt as 'two'"

// Symptom -> hint table. Order matters: the most specific hints go first.
private val HINTS: List<Hint> = listOf(
    Hint(
        { "null" in it },
        "The map lookup returned null. Check that the map keys are " +
                "the numbers 1, 2, and 3 (Int), not strings."
    ),
    Hint(
        { "two" in it && "'two'" !in it },
        "Keep the single quotes around the word: ... is spelled as 'two'."
    ),
    Hint(
        { it.equals(EXPECTED, ignoreCase = true) || it.equals(EXPECTED_ALT, ignoreCase = true) },
        "So close! Only the capitalization is off."
    ),
    Hint(
        { out -> out.lines().any { it.trim() == EXPECTED || it.trim() == EXPECTED_ALT } },
        "The right message is there, but there is extra output. Print only the expected line."
    ),
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise3Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(
        emptyHint, blankHint, HINTS,
        "Almost there - the expected output is: 2 is spelled as 'two'.",
        isOk
    )

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Fill in both gaps: the map definition " +
                "and the lookup inside println().",
        blankHint = "println() is called, but the message is empty. " +
                "Print the spelling message: \$n is spelled as '...'.",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - the output is the spelling of 2`() = check { it == EXPECTED || it == EXPECTED_ALT }
}
