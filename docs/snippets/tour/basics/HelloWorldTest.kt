import java.io.ByteArrayOutputStream
import java.io.PrintStream
import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test
import kotlin.test.fail

private const val EXPECTED = "Mary is 20 years old"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class HelloWorldTest {

    private fun runMain(): String {
        val out = ByteArrayOutputStream()
        val originalOut = System.out
        try {
            System.setOut(PrintStream(out))
            main()
        } finally {
            System.setOut(originalOut)
        }
        val output = out.toString()
        print(output)
        return output
    }

    @Test
    fun `step 1 - the program prints output`() {
        val rawOutput = runMain()
        when {
            rawOutput.isEmpty() ->
                fail("Nothing is printed yet. Add a println() call inside main() and run again.")

            rawOutput.isBlank() ->
                fail(
                    "println() is called, but the message is empty. " +
                            "Put the text to print inside the quotes: println(\"...\")."
                )
        }
    }

    @Test
    fun `step 2 - the output is 'Mary is 20 years old'`() {
        val output = runMain().trim()
        when {
            output == EXPECTED -> return
            output.isEmpty() ->
                fail("Fix step 1 first.")

            "name" in output || "age" in output ->
                fail(
                    withOutput(
                        "The words 'name' and 'age' appear as plain text. " +
                                "Add a dollar sign to print a variable's value: \"\$name is ...\".",
                        output
                    )
                )

            !(output.contains("Mary", ignoreCase = true) && "20" in output) ->
                fail(
                    withOutput(
                        "The output should include the values of both variables: Mary and 20.",
                        output
                    )
                )

            output.equals(EXPECTED, ignoreCase = true) ->
                fail(withOutput("So close! Only the capitalization is off.", output))

            output.lines().any { it.trim() == EXPECTED } ->
                fail(
                    withOutput(
                        "The right message is there, but there is extra output. Print only the expected line.",
                        output
                    )
                )

            else ->
                fail(withOutput("Almost there - every character counts.", output))
        }
    }
}


// The playground renders test messages as raw HTML, so the actual output is attached
// as an extra console block that is displayed in the regular (non-error) text color.
private fun withOutput(hint: String, output: String): String {
    val display = output.trimEnd('\n')
        .replace("&", "&#38;")
        .replace("<", "&#60;")
        .replace(">", "&#62;")
    val separator = if ('\n' in display) "\n" else " "
    return hint +
            "</div></div>" +
            "<div class=\"console-block\"><span class=\"console-icon\"></span>" +
            "<div style=\"white-space:pre-wrap\">Output: " + separator + display
}
