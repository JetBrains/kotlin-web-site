import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_OUTPUT = listOf("4815", "85", "7200", "600", "3601")

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class IntervalInSecondsTest {

    @Test
    fun `intervalInSeconds supports defaults and named arguments`() {
        val checks = listOf(
            Triple("intervalInSeconds(1, 20, 15)", intervalInSeconds(1, 20, 15), 4815),
            Triple("intervalInSeconds(minutes = 1, seconds = 25)", intervalInSeconds(minutes = 1, seconds = 25), 85),
            Triple("intervalInSeconds(hours = 2)", intervalInSeconds(hours = 2), 7200),
            Triple("intervalInSeconds(minutes = 10)", intervalInSeconds(minutes = 10), 600),
            Triple("intervalInSeconds(hours = 1, seconds = 1)", intervalInSeconds(hours = 1, seconds = 1), 3601),
        )

        val firstWrong = checks.firstOrNull { (_, actual, expected) -> actual != expected }

        when {
            firstWrong == null && outputLines == EXPECTED_OUTPUT -> passed()

            firstWrong != null -> hint(
                "${firstWrong.first} returned ${firstWrong.second}, " +
                        "but ${firstWrong.third} was expected. " +
                        "Omitted parameters should default to 0 - check the default values.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "The function works! main() should still print the five intervals - " +
                        "bring the println() calls back."
            )

            else -> hint(
                "main() should print the same five intervals as before: " +
                        EXPECTED_OUTPUT.joinToString(", ") + "."
            )
        }
    }
}
