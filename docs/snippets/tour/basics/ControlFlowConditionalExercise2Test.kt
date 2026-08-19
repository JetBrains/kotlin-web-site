import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Yes"
private val OTHER_ACTIONS = mapOf(
    "No" to "B",
    "Menu" to "X",
    "Nothing" to "Y",
    "There is no such button" to "some other button"
)

// Symptom -> hint table for step 2. Order matters: the most specific hints go first.
// Built lazily because some hint texts quote the learner's actual output.
private val HINTS: List<Hint> by lazy {
    val output = actualOutput.trim()
    listOf(
        Hint(
            { it == "A" },
            "The button name is printed instead of its action. " +
                    "Your when expression should turn \"A\" into \"Yes\"."
        ),
        Hint(
            { it in OTHER_ACTIONS },
            "\"$output\" is the action for ${OTHER_ACTIONS[output]}, " +
                    "but the pressed button is \"A\". " +
                    "Check which branch of your when expression matches \"A\"."
        ),
        Hint(
            { out ->
                val lines = out.lines().map { it.trim() }.filter { it.isNotEmpty() }
                lines.size > 1 && EXPECTED in lines
            },
            "\"Yes\" is there, but so is extra output. A when expression " +
                    "returns a single value - print only the action for \"A\"."
        ),
        Hint(
            { out -> out.lines().map { it.trim() }.count { it.isNotEmpty() } > 1 },
            "There is more than one line of output. " +
                    "Print only the action for the pressed button: \"Yes\"."
        ),
        Hint(
            { it.equals(EXPECTED, ignoreCase = true) },
            "So close! Only the capitalization is off."
        ),
    )
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise2Test {

    private fun check(
        emptyHint: String = "Fix step 1 first.",
        blankHint: String = "Fix step 1 first.",
        isOk: (String) -> Boolean,
    ) = checkStep(
        emptyHint,
        blankHint,
        HINTS,
        "Pressing \"A\" should print \"Yes\". " +
                "Check the branches of your when expression.",
        isOk
    )

    @Test
    fun `step 1 - the program prints output`() = check(
        emptyHint = "Nothing is printed yet. Write a when expression inside println() " +
                "that turns the button name into its action.",
        blankHint = "println() prints an empty line so far. Pass it a when expression " +
                "that turns the button name into its action.",
    ) { it.isNotEmpty() }

    @Test
    fun `step 2 - pressing button A prints 'Yes'`() = check { it == EXPECTED }
}
