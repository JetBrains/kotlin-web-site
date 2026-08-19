import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Support for smtp: false"

// Note: skipping .uppercase() is indistinguishable by stdout - both
// "smtp" in SUPPORTED and "smtp".uppercase() in SUPPORTED evaluate to false.
// The hint in the article guides the learner towards .uppercase().

// The in check produced a Boolean if either result shows up in the message.
private val hasBoolean: Boolean by lazy {
    output.contains("true", ignoreCase = true) || output.contains("false", ignoreCase = true)
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise2Test {

    @Test
    fun `step 1 - isSupported holds a Boolean`() = when {
        hasBoolean -> passed()

        actualOutput.isEmpty() ->
            hint("Nothing is printed yet. Complete the isSupported value and run again.")

        output.isEmpty() ->
            hint(
                "println() is called, but the message is empty. " +
                        "Print the support message: Support for \$requested: \$isSupported."
            )

        else ->
            hint(
                "There is no true or false in the output. Make isSupported a Boolean: " +
                        "check whether the requested protocol is in the SUPPORTED set."
            )
    }

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 2 - smtp is reported as not supported`() = when {
        output == EXPECTED -> passed()

        !hasBoolean ->
            hint("Fix step 1 first.")

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

        "false" in output ->
            hint(
                "The Boolean is right, but keep the exact message format: " +
                        "Support for \$requested: \$isSupported."
            )

        else ->
            hint("Almost there - every character counts.")
    }
}
