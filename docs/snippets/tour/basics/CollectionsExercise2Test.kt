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
                    "can't see how isSupported is computed. The intended way is " +
                    "checking the requested protocol against the SUPPORTED set."
        )

        firedTodo != null ->
            hint(
                "Replace the TODO() with a check of whether the requested protocol " +
                        "is in the SUPPORTED set. The program stops at the TODO() " +
                        "until then."
            )

        actualOutput.isEmpty() ->
            hint(
                "Bring back the println(\"Support for \$requested: \$isSupported\") " +
                        "line the exercise starts with and complete the isSupported " +
                        "value. Nothing is printed yet."
            )

        output.isEmpty() ->
            hint(
                "Print the support message: Support for \$requested: \$isSupported. " +
                        "println() is called, but the message is empty."
            )

        output == "Support for smtp: true" ->
            hint(
                "Check the requested protocol against the SUPPORTED set. " +
                        "SMTP isn't in that set, so isSupported is false."
            )

        "SMTP" in output ->
            hint(
                "Uppercase the protocol only inside the check. " +
                        "Keep printing the original \$requested value."
            )

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("Match the capitalization. Print \"Support for smtp: false\".")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("Remove the extra output. Print only \"Support for smtp: false\".")

        output.equals("true", ignoreCase = true) || output.equals("false", ignoreCase = true) ->
            hint(
                "Print the whole message: Support for \$requested: \$isSupported. " +
                        "Only the Boolean is printed."
            )

        "true" in output || "false" in output ->
            hint(
                "Keep the exact message format: Support for \$requested: \$isSupported. " +
                        "The output contains the Boolean, but not that format."
            )

        else ->
            hint(
                "Make isSupported a Boolean: check whether the requested protocol " +
                        "is in the SUPPORTED set. The output contains neither true nor false."
            )
    }
}
