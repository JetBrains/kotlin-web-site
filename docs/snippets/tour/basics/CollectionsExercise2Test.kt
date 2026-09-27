import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Support for smtp: false"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise2Test {

    @Test
    fun `print the support message for smtp`() = when {
        output == EXPECTED -> passed(
            "Checked: the program prints \"Support for smtp: false\". The test " +
                    "can't see how your code computes isSupported."
        )

        firedTodo != null ->
            hint(
                "Replace the TODO() function with code to check whether the requested protocol " +
                        "is in the SUPPORTED set."
            )

        actualOutput.isEmpty() ->
            hint(
                "Bring back the println(\"Support for \$requested: \$isSupported\") " +
                        "line that exercise starts with and complete the code in the isSupported " +
                        "variable. Your program doesn't print anything yet."
            )

        output.isEmpty() ->
            hint(
                "Print the support message: Support for \$requested: \$isSupported. " +
                        "Your program calls println(), but doesn't pass it a value."
            )

        output == "Support for smtp: true" ->
            hint(
                "Check if the requested protocol is in the SUPPORTED set. " +
                        "SMTP isn't in the set so the isSupported variable is false."
            )

        "SMTP" in output ->
            hint(
                "Capitalize the protocol inside the check. " +
                        "Keep printing the original \$requested value."
            )

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("Match the capitalization. Print \"Support for smtp: false\".")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("Remove the extra output. Print only \"Support for smtp: false\".")

        output.equals("true", ignoreCase = true) || output.equals("false", ignoreCase = true) ->
            hint(
                "Print the whole message: 'Support for \$requested: \$isSupported.' " +
                        "Your program prints only the boolean value."
            )

        "true" in output || "false" in output ->
            hint(
                "Use the exact message format: Support for \$requested: \$isSupported. " +
                        "The output contains the boolean value but not the correct message format."
            )

        else ->
            hint(
                "Make the isSupported variable a boolean check to see whether the requested protocol " +
                        "is in the SUPPORTED set. The output contains neither true nor false."
            )
    }
}
