import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_ACTIONS = listOf(
    "A" to "Yes",
    "B" to "No",
    "X" to "Menu",
    "Y" to "Nothing",
    "C" to "There is no such button",
    "a" to "There is no such button",
    "" to "There is no such button"
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowConditionalExercise2Test {

    @Test
    fun `print Yes for button press`() {
        val originalButton = button
        val runs = try {
            EXPECTED_ACTIONS.map { (pressed, expected) ->
                button = pressed
                Triple(pressed, expected, runMain(echo = false))
            }
        } finally {
            button = originalButton
        }

        val (pressed, expected, rawOutput) = runs.firstOrNull { (_, action, raw) -> raw.trim() != action }
            ?: return passed(
                "Checked: buttons A, B, X, Y, C, a, and an empty string print their expected actions."
            )
        val actual = rawOutput.trim()
        val lines = actual.lines().map { it.trim() }.filter { it.isNotEmpty() }
        val details = "Button \"$pressed\" should print \"$expected\"."
        when {
            rawOutput.isEmpty() ->
                hint(
                    "$details Write a when expression inside println() that turns the button " +
                            "name into its action. Your program doesn't print anything yet.",
                    shownOutput = ""
                )

            actual.isEmpty() ->
                hint(
                    "$details Pass println() a when expression that turns the button " +
                            "name into its action. It prints an empty line so far.",
                    shownOutput = ""
                )

            lines.size > 1 ->
                hint(
                    "$details Remove the extra output. A when expression returns a " +
                            "single value, so print only the action for the pressed button.",
                    shownOutput = actual
                )

            actual.equals(expected, ignoreCase = true) ->
                hint(
                    "$details Match the capitalization of the actions in the table.",
                    shownOutput = actual
                )

            actual == pressed ->
                hint(
                    "$details Return the action from your when expression, not the " +
                            "button name.",
                    shownOutput = actual
                )

            EXPECTED_ACTIONS.any { (_, action) -> actual == action } ->
                hint(
                    "$details Check which branch of your when expression matches " +
                            "\"$pressed\". \"${escapeHtml(actual)}\" is the action for another button.",
                    shownOutput = actual
                )

            else ->
                hint(
                    "$details Check the value each branch of your when expression " +
                            "returns. \"${escapeHtml(actual)}\" isn't the expected action.",
                    shownOutput = actual
                )
        }
    }
}
