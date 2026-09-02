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
    fun `supports default and named arguments`() {
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
                "With 0 as the default, you only need to pass the values you want to change. " +
                        "Named arguments make it clear which value is which."
            )

            firstWrong != null && firstWrong.omitsArguments -> hint(
                "Set the default value of hours, minutes, and seconds to 0. " +
                        "${firstWrong.call} returns ${firstWrong.actual}, " +
                        "but ${firstWrong.expected} is expected.",
                ""
            )

            firstWrong != null -> hint(
                "Keep the original formula – only the parameters change. " +
                        "${firstWrong.call} returns ${firstWrong.actual}, " +
                        "but ${firstWrong.expected} is expected.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Add the println() calls inside main()."
            )

            else -> hint(
                "Print these five results in order: " +
                        EXPECTED_OUTPUT.joinToString(", ") + "."
            )
        }
    }
}