import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Mary is 20 years old"

private val HINTS: List<Hint> = listOf(
    Hint(
        { "name" in it || "age" in it },
        "The words 'name' and 'age' appear as plain text. " +
                "Add a dollar sign to print a variable's value: \"\$name is ...\"."
    ),
    Hint(
        { !(it.contains("Mary", ignoreCase = true) && "20" in it) },
        "The output should include the values of both variables: Mary and 20."
    ),
    Hint(
        { it.equals(EXPECTED, ignoreCase = true) },
        "So close! Only the capitalization is off."
    ),
    Hint(
        { out -> out.lines().any { it.trim() == EXPECTED } },
        "The right message is there, but there is extra output. Print only the expected line."
    ),
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class HelloWorldTest {
    @Test
    fun `step 1 - print something`() = checkStep(
        emptyHint = "Nothing is printed yet. Add a println() call inside main() and run again.",
        blankHint = "println() is called, but the message is empty. " +
                "Put the text to print inside the quotes: println(\"...\").",
        isOk = { it.isNotEmpty() }
    )

    @Test
    fun `step 2 - print exactly 'Mary is 20 years old'`() = checkStep(
        emptyHint = "Fix step 1 first.",
        blankHint = "Fix step 1 first.",
        hints = HINTS,
        fallbackHint = "Almost there - every character counts.",
        isOk = { it == EXPECTED }
    )
}
