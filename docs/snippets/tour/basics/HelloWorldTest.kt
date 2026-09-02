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
            hint("Add a println() call inside main().")

        else -> hint(
            ""Add some text to println(). The program prints an empty line." "

        )
    }

    @Test
    fun `print the expected output`() = when {

    output == EXPECTED -> passed(
        "Checked: the program prints exactly \"Mary is 20 years old\". " +
                "The test doesn't check how you build the string. " +
                "The example solution uses a string template with the name and age variables."
    )

        output.isEmpty() -> hint("Make the program print something.")

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
            hint("Make the output include both variable values: Mary and 20.")

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("Check the capitalization.")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("Remove the extra output. Print only \"Mary is 20 years old\".")

        else -> hint("Check the output carefully. Every character counts.")
    }
}