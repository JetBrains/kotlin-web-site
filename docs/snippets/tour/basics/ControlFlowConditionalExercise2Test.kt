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
    fun `print Yes for button A`() {
        val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
        when {
            output == EXPECTED -> passed(
                "Checked: the action for button \"A\" only. The test can't press the " +
                        "other buttons. Check the rest of your when branches against " +
                        "the table yourself, or change the button value and rerun."
            )

            actualOutput.isEmpty() ->
                hint(
                    "Write a when expression inside println() that turns the button " +
                            "name into its action. Nothing is printed yet."
                )

            output.isEmpty() ->
                hint(
                    "Pass println() a when expression that turns the button name " +
                            "into its action. It prints an empty line so far."
                )

            output == "A" ->
                hint(
                    "Return the action from your when expression, not the button " +
                            "name. The when expression turns \"A\" into \"Yes\"."
                )

            output in OTHER_ACTIONS ->
                hint(
                    "Check which branch of your when expression matches \"A\". " +
                            "\"$output\" is the action for ${OTHER_ACTIONS[output]}, " +
                            "but the pressed button is \"A\"."
                )

            lines.size > 1 && (EXPECTED in lines || lines.any { it in OTHER_ACTIONS }) ->
                hint(
                    "Remove the extra output. A when expression returns a single " +
                            "value, so print only the action for the pressed button."
                )

            lines.size > 1 ->
                hint(
                    "Print only the action for the pressed button. " +
                            "The output has more than one line."
                )

            output.equals(EXPECTED, ignoreCase = true) ||
                    OTHER_ACTIONS.keys.any { it.equals(output, ignoreCase = true) } ->
                hint(
                    "Match the capitalization of the actions in the table. " +
                            "Button \"A\" prints \"Yes\"."
                )

            else ->
                hint(
                    "Check the value each branch of your when expression returns. " +
                            "\"$output\" isn't one of the actions from the table."
                )
        }
    }
}
