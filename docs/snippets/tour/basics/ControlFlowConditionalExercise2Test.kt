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
    // Order matters: the success condition goes first, then the symptoms from
    // the most specific to the most general.
    // Known limitation: a hardcoded println("Yes") with no when expression is
    // indistinguishable by stdout from the reference solution.
    @Test
    fun `pressing button A prints 'Yes'`() {
        val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
        when {
            output == EXPECTED -> passed()

            actualOutput.isEmpty() ->
                hint(
                    "Nothing is printed yet. Write a when expression inside println() " +
                            "that turns the button name into its action."
                )

            output.isEmpty() ->
                hint(
                    "println() prints an empty line so far. Pass it a when expression " +
                            "that turns the button name into its action."
                )

            output == "A" ->
                hint(
                    "The button name is printed instead of its action. " +
                            "Your when expression should turn \"A\" into \"Yes\"."
                )

            output in OTHER_ACTIONS ->
                hint(
                    "\"$output\" is the action for ${OTHER_ACTIONS[output]}, " +
                            "but the pressed button is \"A\". " +
                            "Check which branch of your when expression matches \"A\"."
                )

            lines.size > 1 && (EXPECTED in lines || lines.any { it in OTHER_ACTIONS }) ->
                hint(
                    "An action is there, but so is extra output. A when expression " +
                            "returns a single value - print only the action for the pressed button."
                )

            lines.size > 1 ->
                hint(
                    "There is more than one line of output. " +
                            "Print only the action for the pressed button."
                )

            output.equals(EXPECTED, ignoreCase = true) ||
                    OTHER_ACTIONS.keys.any { it.equals(output, ignoreCase = true) } ->
                hint("So close! Only the capitalization is off.")

            else ->
                hint(
                    "The output isn't one of the actions from the table. " +
                            "Check the value each branch of your when expression returns."
                )
        }
    }
}
