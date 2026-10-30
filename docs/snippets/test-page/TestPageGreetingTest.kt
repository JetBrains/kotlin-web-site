import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val EXPECTED = "Hello, Mary!"

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class TestPageGreetingTest {

    @Test
    fun `print the greeting`() = when {
        output == EXPECTED -> passed(
            "Checked: the program prints exactly \"Hello, Mary!\".",
            showOutput = true
        )

        actualOutput.isEmpty() ->
            hint("Add a println() call inside main().")

        else -> hint("Print exactly \"Hello, Mary!\". Check the spelling and the punctuation.")
    }
}
