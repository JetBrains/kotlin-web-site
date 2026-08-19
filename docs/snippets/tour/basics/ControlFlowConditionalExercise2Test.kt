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

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise2Test {

    @Test
    fun `step 1 - the program prints output`() = when {
        output.isNotEmpty() -> ok()

        actualOutput.isEmpty() ->
            fail(
                "Nothing is printed yet. Write a when expression inside println() " +
                        "that turns the button name into its action."
            )

        else ->
            fail(
                "println() prints an empty line so far. Pass it a when expression " +
                        "that turns the button name into its action."
            )
    }

    @Test
    fun `step 2 - pressing button A prints 'Yes'`() {
        val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
        // Order matters: the most specific symptoms go first.
        when {
            output == EXPECTED -> ok()

            output.isEmpty() ->
                fail("Fix step 1 first.")

            output == "A" ->
                fail(
                    "The button name is printed instead of its action. " +
                            "Your when expression should turn \"A\" into \"Yes\"."
                )

            output in OTHER_ACTIONS ->
                fail(
                    "\"$output\" is the action for ${OTHER_ACTIONS[output]}, " +
                            "but the pressed button is \"A\". " +
                            "Check which branch of your when expression matches \"A\"."
                )

            lines.size > 1 && EXPECTED in lines ->
                fail(
                    "\"Yes\" is there, but so is extra output. A when expression " +
                            "returns a single value - print only the action for \"A\"."
                )

            lines.size > 1 ->
                fail(
                    "There is more than one line of output. " +
                            "Print only the action for the pressed button: \"Yes\"."
                )

            output.equals(EXPECTED, ignoreCase = true) ->
                fail("So close! Only the capitalization is off.")

            else ->
                fail(
                    "Pressing \"A\" should print \"Yes\". " +
                            "Check the branches of your when expression."
                )
        }
    }
}
