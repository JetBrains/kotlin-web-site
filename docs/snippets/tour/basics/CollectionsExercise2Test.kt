import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Support for smtp: false"

// Note: skipping .uppercase() is indistinguishable by stdout - both
// "smtp" in SUPPORTED and "smtp".uppercase() in SUPPORTED evaluate to false.
// The hint in the article guides the learner towards .uppercase().

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise2Test {

    @Test
    fun `step 1 - the program prints output`() = when {
        output.isNotEmpty() -> ok()

        actualOutput.isEmpty() ->
            fail("Nothing is printed yet. Complete the isSupported value and run again.")

        else ->
            fail(
                "println() is called, but the message is empty. " +
                        "Print the support message: Support for \$requested: \$isSupported."
            )
    }

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 2 - the output says that smtp is not supported`() = when {
        output == EXPECTED -> ok()

        output.isEmpty() ->
            fail("Fix step 1 first.")

        output == "Support for smtp: true" ->
            fail(
                "isSupported should reflect whether the requested protocol is in the " +
                        "SUPPORTED set. SMTP isn't there, so the result should be false."
            )

        "SMTP" in output ->
            fail(
                "Uppercase the protocol only inside the check. " +
                        "Keep printing the original \$requested value."
            )

        output.equals(EXPECTED, ignoreCase = true) ->
            fail("So close! Only the capitalization is off.")

        output.lines().any { it.trim() == EXPECTED } ->
            fail("The right message is there, but there is extra output. Print only the expected line.")

        "false" in output ->
            fail(
                "The Boolean is right, but keep the exact message format: " +
                        "Support for \$requested: \$isSupported."
            )

        else ->
            fail("Almost there - every character counts.")
    }
}
