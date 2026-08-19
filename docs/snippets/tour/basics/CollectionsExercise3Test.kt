import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "2 is spelled as 'two'"

// The older example solution printed "spelt" instead of "spelled",
// so both spellings are accepted as a correct answer.
private const val EXPECTED_ALT = "2 is spelt as 'two'"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise3Test {

    @Test
    fun `step 1 - the map lookup finds a word`() = when {
        output.isNotEmpty() && "null" !in output -> ok()

        actualOutput.isEmpty() ->
            fail(
                "Nothing is printed yet. Fill in both gaps: the map definition " +
                        "and the lookup inside println()."
            )

        output.isEmpty() ->
            fail(
                "println() is called, but the message is empty. " +
                        "Print the spelling message: \$n is spelled as '...'."
            )

        else ->
            fail(
                "The map lookup returned null. Check that the map keys are " +
                        "the numbers 1, 2, and 3 (Int), not strings."
            )
    }

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 2 - the number 2 is spelled as 'two'`() = when {
        output == EXPECTED || output == EXPECTED_ALT -> ok()

        output.isEmpty() || "null" in output ->
            fail("Fix step 1 first.")

        "two" in output && "'two'" !in output ->
            fail("Keep the single quotes around the word: ... is spelled as 'two'.")

        output.equals(EXPECTED, ignoreCase = true) || output.equals(EXPECTED_ALT, ignoreCase = true) ->
            fail("So close! Only the capitalization is off.")

        output.lines().any { it.trim() == EXPECTED || it.trim() == EXPECTED_ALT } ->
            fail("The right message is there, but there is extra output. Print only the expected line.")

        else ->
            fail("Almost there - the expected output is: 2 is spelled as 'two'.")
    }
}
