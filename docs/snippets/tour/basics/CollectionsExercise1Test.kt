import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise1Test {
    // Order matters: the success condition goes first, then the symptoms from
    // the most specific to the most general.
    @Test
    fun `the total over both lists is printed`() = when {
        output.toIntOrNull() == greenNumbers.count() + redNumbers.count() ->
            passed()

        actualOutput.isEmpty() ->
            hint("Nothing is printed yet. Add a println() call inside main() and run again.")

        output.isEmpty() -> hint(
            "println() is called, but the message is empty. " +
                    "Print the total number of numbers in both lists."
        )

        '\n' in output -> hint(
            "There is more than one line of output. " +
                    "Print only one line - the total count of numbers in both lists."
        )

        '[' in output ->
            hint(
                "You printed the list itself. Print how many numbers it contains " +
                        "instead - try the .count() function."
            )

        output.toIntOrNull() == null ->
            hint("The output should be a single number - the total count of numbers in both lists.")

        output.toIntOrNull() == greenNumbers.count() ->
            hint("That's only the green numbers. Don't forget the red ones!")

        output.toIntOrNull() == redNumbers.count() ->
            hint("That's only the red numbers. Add the green ones too.")

        else ->
            hint("Not quite the right total. Count the items in both lists and add them together.")
    }
}
