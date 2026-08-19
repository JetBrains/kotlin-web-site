import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Support for smtp: false"

// Note: skipping .uppercase() is indistinguishable by stdout - both
// "smtp" in SUPPORTED and "smtp".uppercase() in SUPPORTED evaluate to false.
// The hint in the article guides the learner towards .uppercase().

// Symptom -> hint table. Order matters: the most specific hints go first.
private val HINTS: List<Hint> = listOf(
    Hint(
        { it == "Support for smtp: true" },
        "isSupported should reflect whether the requested protocol is in the " +
                "SUPPORTED set. SMTP isn't there, so the result should be false."
    ),
    Hint(
        { "SMTP" in it },
        "Uppercase the protocol only inside the check. " +
                "Keep printing the original \$requested value."
    ),
    Hint(
        { it.equals(EXPECTED, ignoreCase = true) },
        "So close! Only the capitalization is off."
    ),
    Hint(
        { out -> out.lines().any { it.trim() == EXPECTED } },
        "The right message is there, but there is extra output. Print only the expected line."
    ),
    Hint(
        { "false" in it },
        "The Boolean is right, but keep the exact message format: " +
                "Support for \$requested: \$isSupported."
    ),
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class CollectionsExercise2Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(emptyHint, blankHint, HINTS, "Almost there - every character counts.", isOk)

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Complete the isSupported value and run again.",
        blankHint = "println() is called, but the message is empty. " +
                "Print the support message: Support for \$requested: \$isSupported.",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - the output says that smtp is not supported`() = check { it == EXPECTED }
}
