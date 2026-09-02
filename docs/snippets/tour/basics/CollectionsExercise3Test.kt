import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "2 is spelled as 'two'"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise3Test {

    @Test
    fun `look up a word in the map`() = when {
        output.isNotEmpty() && "null" !in output -> passed()

        actualOutput.isEmpty() ->
            hint(
                "Define the number2word map, then print the spelling of n with " +
                        "println(). Nothing is printed yet."
            )

        output.isEmpty() ->
            hint(
                "Print the spelling message, for example: 1 is spelled as 'one'. " +
                        "println() is called, but the message is empty."
            )

        else ->
            hint(
                "Add all three numbers 1, 2, and 3 as keys to your map, each " +
                        "with its spelling as the value. The lookup prints null, " +
                        "so the map has no value for n yet."
            )
    }

    @Test
    fun `print the spelling of 2 as 'two'`() = when {
        output == EXPECTED -> passed(
            "Checked: the program prints \"2 is spelled as 'two'\". " +
                    "The test doesn't check that the word comes from a map. " +
                    "The example solution looks it up with number2word[n]."
        )

        output.isEmpty() || "null" in output ->
            hint("Make the map lookup print a word first.")

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
                        "The line should read \"2 is spelled as 'two'\"."
            )
    }
}
