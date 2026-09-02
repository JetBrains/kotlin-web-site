import kotlin.test.Test

class ButtonEventTest {
    @Test
    fun `print Double click! when the event is a double click`() {
        when {
            "Double click!" in output.lines() -> passed(
                "Checked: the handler prints \"Double click!\" for the " +
                        "simulated double-click event. Whether it checks " +
                        "isRightClick and amount is not checked. Compare with " +
                        "the example solution."
            )

            output.isEmpty() -> hint(
                "Print \"Double click!\" when the event is a double click. " +
                        "Inside the lambda you can read the event's isRightClick " +
                        "and amount properties directly. The simulated event is " +
                        "a left click with amount 2."
            )

            else -> hint(
                "Make the printed line exactly \"Double click!\", including " +
                        "the exclamation mark."
            )
        }
    }
}
