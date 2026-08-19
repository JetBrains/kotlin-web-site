import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Mary is 20 years old"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class HelloWorldTest {
    @Test
    fun `step 1 - print something`() = when {
        output.isNotEmpty() -> ok()

        actualOutput.isEmpty() ->
            fail("Nothing is printed yet. Add a println() call inside main() and run again.")

        else -> fail(
            "println() is called, but the message is empty. "
                + "Put the text to print inside the quotes: println(\"...\")."
        )
    }

    @Test
    fun `step 2 - print exactly 'Mary is 20 years old'`() = when {
        output == EXPECTED -> ok()

        output.isEmpty() -> fail("Fix step 1 first.")

        "name" in output || "age" in output -> fail(
            "The words 'name' and 'age' appear as plain text. " +
                "Add a dollar sign to print a variable's value: \"\$name is ...\"."
        )

        !(output.contains("Mary", ignoreCase = true) && "20" in output) ->
            fail("The output should include the values of both variables: Mary and 20.")

        output.equals(EXPECTED, ignoreCase = true) ->
            fail("So close! Only the capitalization is off.")

        output.lines().any { it.trim() == EXPECTED } ->
            fail("The right message is there, but there is extra output. Print only the expected line.")

        else -> fail("Almost there - every character counts.")
    }
}
