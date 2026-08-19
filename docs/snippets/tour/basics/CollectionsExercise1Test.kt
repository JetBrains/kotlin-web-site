import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "5"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise1Test {

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 1 - count() gives a single number`() = when {
        output.isNotEmpty() && '\n' !in output && output.toIntOrNull() != null -> passed()

        actualOutput.isEmpty() ->
            hint("Nothing is printed yet. Add a println() call inside main() and run again.")

        output.isEmpty() ->
            hint(
                "println() is called, but the message is empty. " +
                        "Print the total number of numbers in both lists."
            )

        '\n' in output ->
            hint(
                "There is more than one line of output. " +
                        "Print only one line - the total count of numbers in both lists."
            )

        '[' in output ->
            hint(
                "You printed the list itself. Print how many numbers it contains " +
                        "instead - try the .count() function."
            )

        else ->
            hint("The output should be a single number - the total count of numbers in both lists.")
    }

    @Test
    fun `step 2 - the total over both lists is 5`() = when {
        output == EXPECTED -> passed()

        '\n' in output || output.toIntOrNull() == null ->
            hint("Fix step 1 first.")

        output == "3" ->
            hint("That's only the green numbers. Don't forget the red ones!")

        output == "2" ->
            hint("That's only the red numbers. Add the green ones too.")

        else ->
            hint("Not quite the right total. Count the items in both lists and add them together.")
    }
}
