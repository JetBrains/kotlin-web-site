import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "5"

// Symptom -> hint table. Order matters: the most specific hints go first.
private val HINTS: List<Hint> = listOf(
    Hint(
        { '\n' in it },
        "There is more than one line of output. " +
                "Print only one line - the total count of numbers in both lists."
    ),
    Hint(
        { it == "3" },
        "That's only the green numbers. Don't forget the red ones!"
    ),
    Hint(
        { it == "2" },
        "That's only the red numbers. Add the green ones too."
    ),
    Hint(
        { '[' in it },
        "You printed the list itself. Print how many numbers it contains " +
                "instead - try the .count() function."
    ),
    Hint(
        { it.toIntOrNull() == null },
        "The output should be a single number - the total count of numbers in both lists."
    ),
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise1Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(
        emptyHint, blankHint, HINTS,
        "Not quite the right total. Count the items in both lists and add them together.",
        isOk
    )

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Add a println() call inside main() and run again.",
        blankHint = "println() is called, but the message is empty. " +
                "Print the total number of numbers in both lists.",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - the output is a single line`() = check { it.isNotEmpty() && '\n' !in it }

    @Test
    fun `step 3 - the output is the total count 5`() = check { it == EXPECTED }
}
