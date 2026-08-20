import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Support for smtp: false"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise2Test {
    // Order matters: the success condition must go first - the broad
    // "false" in output branch below would otherwise catch the correct answer.
    // After it, the symptoms go from the most specific to the most general.
    // Known limitation: skipping .uppercase() is indistinguishable by stdout
    // ("smtp" in SUPPORTED and "smtp".uppercase() in SUPPORTED both print
    // false); the exercise hint already points at .uppercase().
    @Test
    fun `the support message is printed`() = when {
        output == EXPECTED -> passed()

        actualOutput.isEmpty() ->
            hint(
                "Nothing is printed. The exercise starts with a " +
                        "println(\"Support for \$requested: \$isSupported\") line - " +
                        "bring it back and complete the isSupported value."
            )

        output.isEmpty() ->
            hint(
                "println() is called, but the message is empty. " +
                        "Print the support message: Support for \$requested: \$isSupported."
            )

        output == "Support for smtp: true" ->
            hint(
                "isSupported should reflect whether the requested protocol is in the " +
                        "SUPPORTED set. SMTP isn't there, so the result should be false."
            )

        "SMTP" in output ->
            hint(
                "Uppercase the protocol only inside the check. " +
                        "Keep printing the original \$requested value."
            )

        output.equals(EXPECTED, ignoreCase = true) ->
            hint("So close! Only the capitalization is off.")

        output.lines().any { it.trim() == EXPECTED } ->
            hint("The right message is there, but there is extra output. Print only the expected line.")

        output.equals("true", ignoreCase = true) || output.equals("false", ignoreCase = true) ->
            hint(
                "The Boolean is right, but print the whole message: " +
                        "Support for \$requested: \$isSupported."
            )

        "true" in output || "false" in output ->
            hint(
                "The Boolean is there, but keep the exact message format: " +
                        "Support for \$requested: \$isSupported."
            )

        else ->
            hint(
                "There is no true or false in the output. Make isSupported a Boolean: " +
                        "check whether the requested protocol is in the SUPPORTED set."
            )
    }
}
