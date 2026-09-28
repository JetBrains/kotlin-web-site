import kotlin.test.Test

class ButtonEventTest {
    @Test
    fun `print Double click! for a double-click event`() {
        when {
            "Double click!" in output.lines() -> passed(
                "The handler prints \"Double click!\" for the simulated " +
                        "double-click event. The test doesn't check whether " +
                        "your handler checks isRightClick and amount."
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
