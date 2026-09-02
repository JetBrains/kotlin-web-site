import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise1Test {

    @Test
    fun `print the total of both lists`() = when {
        output.toIntOrNull() == greenNumbers.count() + redNumbers.count() ->
            passed(
                "Checked: the printed total is ${greenNumbers.count() + redNumbers.count()}. " +
                        "The test doesn't check how you count them, only the number you print."
            )

        actualOutput.isEmpty() ->
            hint("Add a println() call inside main() and run again. Nothing is printed yet.")

        output.isEmpty() -> hint(
            "Print the total number of numbers in both lists. " +
                    "println() is called, but the message is empty."
        )

        '\n' in output -> hint(
            "Print only one line with the total count of numbers in both lists. " +
                    "The output has more than one line."
        )

        '[' in output ->
            hint(
                "Print how many numbers the lists contain instead of the lists themselves. " +
                        "The .count() function returns that number."
            )

        output.toIntOrNull() == null ->
            hint(
                "Print a single number: the total count of numbers in both lists. " +
                        "The output is not a number."
            )

        output.toIntOrNull() == greenNumbers.count() ->
            hint(
                "Add the count of the red numbers to the total. " +
                        "The printed number counts only the green ones."
            )

        output.toIntOrNull() == redNumbers.count() ->
            hint(
                "Add the count of the green numbers to the total. " +
                        "The printed number counts only the red ones."
            )

        else ->
            hint(
                "Count the items in both lists and add the two counts together. " +
                        "The printed total is not the number of items in greenNumbers " +
                        "plus redNumbers."
            )
    }
}
