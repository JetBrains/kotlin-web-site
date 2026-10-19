import kotlin.test.Test

class TestPageRegionTest {

    @Test
    fun `print the value of status`() = when {
        "Ready" in output.lines() -> passed(
            "The program prints the value of status on its own line."
        )

        output.isEmpty() ->
            hint("Print the status variable with println(status).")

        "status" in output ->
            hint("Print the value of status, not the name of the variable.")

        else -> hint("Print only the value of status: Ready.")
    }
}
