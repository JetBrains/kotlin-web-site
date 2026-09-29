import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_MAP = mapOf(
    1 to "one",
    2 to "two",
    3 to "three",
)

private const val EXPECTED = "2 is spelled as 'two'"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise3Test {

    @Test
    fun `define number2word with the spelling of 1, 2 and 3`() {
        val check = expect("number2word", EXPECTED_MAP) { number2word }

        when {
            check.isCorrect -> passed()

            check.thrown != null ->
                hint("Creating number2word shouldn't throw an exception.", check)

            (check.actual as? Map<*, *>)?.isEmpty() == true ->
                hint("The number2word map is empty. Add entries for 1, 2, and 3.", check)

            else ->
                hint("Check that number2word maps 1, 2, and 3 to their correct spelling.", check)
        }
    }

    @Test
    fun `print the spelling of 2 as 'two'`() = when {
        output == EXPECTED -> passed(
            "Checked: the program prints exactly \"2 is spelled as 'two'\"."
        )

        actualOutput.isEmpty() ->
            hint("Print the spelling of n with println(). Your program doesn't print anything yet.")

        output.isEmpty() ->
            hint(
                "Print the spelling message, for example: 1 is spelled as 'one'. " +
                        "Your program calls println(), but doesn't pass it a value."
            )

        "null" in output ->
            hint("Look up n in number2word. The spelling message shouldn't contain null.")

        "two" in output && "'two'" !in output ->
            hint("Keep the single quotes around the word: ... is spelled as 'two'.")

        "spelt" in output.lowercase() ->
            hint("Use \"spelled\" instead of \"spelt\". Print \"2 is spelled as 'two'\".")

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("Match the capitalization. Print \"2 is spelled as 'two'\".")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("Remove the extra output. Print only \"2 is spelled as 'two'\".")

        else ->
            hint(
                "Print the word for n from your map, in single quotes. " +
                        "Your program should print \"2 is spelled as 'two'\"."
            )
    }
}
