import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Mary is 20 years old"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class HelloWorldTest {

    @Test
    fun `print something`() = when {
        output.isNotEmpty() -> passed()

        actualOutput.isEmpty() ->
            hint("Add a println() call inside main() and run again. Nothing is printed yet.")

        else -> hint(
            "Put the text to print inside the quotes: println(\"...\"). "
                    + "println() is called, but the message is empty."
        )
    }

    @Test
    fun `then print exactly 'Mary is 20 years old'`() = when {

        output == EXPECTED -> passed(
            "Checked: the printed text is exactly right. The test can't see how you " +
                    "built it - the example solution prints the name and age variables " +
                    "with a string template."
        )

        output.isEmpty() -> hint("Make the program print something first.")

        "name" in output && "age" in output -> hint(
            "Add a dollar sign before both variable names: \$name and \$age. " +
                    "Right now 'name' and 'age' are printed as plain text, not as values."
        )

        "name" in output -> hint(
            "Add a dollar sign before name to print its value: \$name. " +
                    "Right now 'name' is printed as plain text instead of Mary."
        )

        "age" in output -> hint(
            "Add a dollar sign before age to print its value: \$age. " +
                    "Right now 'age' is printed as plain text instead of 20."
        )

        !(output.contains("Mary", ignoreCase = true) && "20" in output) ->
            hint("The output should include the values of both variables: Mary and 20.")

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("So close! Only the capitalization is off.")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("The right message is there, but there is extra output. Print only the expected line.")

        else -> hint("Almost there - every character counts.")
    }
}