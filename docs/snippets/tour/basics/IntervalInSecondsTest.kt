import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val EXPECTED_OUTPUT = listOf("4815", "85", "7200", "600", "3601")

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

private class Check(
    val call: String,
    val actual: Int,
    val expected: Int,
    val omitsArguments: Boolean,
)

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class IntervalInSecondsTest {

    @Test
    fun `intervalInSeconds supports defaults and named arguments`() {
        val checks = listOf(
            Check("intervalInSeconds(1, 20, 15)", intervalInSeconds(1, 20, 15), 4815, false),
            Check("intervalInSeconds(minutes = 1, seconds = 25)", intervalInSeconds(minutes = 1, seconds = 25), 85, true),
            Check("intervalInSeconds(hours = 2)", intervalInSeconds(hours = 2), 7200, true),
            Check("intervalInSeconds(minutes = 10)", intervalInSeconds(minutes = 10), 600, true),
            Check("intervalInSeconds(hours = 1, seconds = 1)", intervalInSeconds(hours = 1, seconds = 1), 3601, true),
        )

        val firstWrong = checks.firstOrNull { it.actual != it.expected }

        when {
            firstWrong == null && outputLines == EXPECTED_OUTPUT -> passed(
                "Nice - every parameter now defaults to 0, so a call can pass only what it needs. " +
                        "Named arguments are the other half: intervalInSeconds(minutes = 1, seconds = 25) " +
                        "says much more than intervalInSeconds(0, 1, 25)."
            )

            firstWrong != null && firstWrong.omitsArguments -> hint(
                "Give hours, minutes, and seconds a default value of 0. " +
                        "${firstWrong.call} returned ${firstWrong.actual}, " +
                        "but ${firstWrong.expected} was expected.",
                ""
            )

            firstWrong != null -> hint(
                "Keep the original formula - only the parameters change. " +
                        "${firstWrong.call} returned ${firstWrong.actual}, " +
                        "but ${firstWrong.expected} was expected.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Bring the println() calls back in main() - the function itself already works!"
            )

            else -> hint(
                "Print the same five intervals as before: " +
                        EXPECTED_OUTPUT.joinToString(", ") + "."
            )
        }
    }
}