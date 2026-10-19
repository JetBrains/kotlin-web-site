import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class TestPageMultiTest {

    @Test
    fun `a print the first line`() = when {
        output.lines().firstOrNull() == "Hello, Mary!" -> passed(
            "The first line is correct."
        )

        actualOutput.isEmpty() ->
            hint("Add a println() call inside main().")

        else -> hint("The first line must be exactly \"Hello, Mary!\".")
    }

    @Test
    fun `b print the second line`() = when {
        output.lines() == listOf("Hello, Mary!", "Ready") -> passed(
            "Checked: the program prints both lines.",
            showOutput = true
        )

        output.lines().size < 2 ->
            hint("Print the second line: Ready.")

        else -> hint("Print exactly two lines: Hello, Mary! and then Ready.")
    }
}
