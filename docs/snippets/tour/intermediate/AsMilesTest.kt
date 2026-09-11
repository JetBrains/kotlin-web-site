import kotlin.math.abs
import kotlin.test.Test

class AsMilesTest {
    private fun milesOf(km: Double): Any? = km.asMiles

    private fun check(km: Double, expected: Double) =
        expect("$km.asMiles", expected, tolerance = 1e-4) { milesOf(km) }

    private fun near(actual: Any?, value: Double): Boolean =
        actual is Number && abs(actual.toDouble() - value) < 0.005

    @Test
    fun `convert any kilometer value to miles`() {
        val checks = listOf(
            check(10.0, expected = 6.21371),
            check(3.5, expected = 2.1747985),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: asMiles converts any kilometer value to miles with " +
                        "the formula from the note above the exercise."
            )

            else -> when {
                failed.thrown != null -> hint(
                    "Return the converted value from the property's getter. " +
                            "asMiles works for any kilometer value.",
                    failed
                )

                near(failed.actual, 16.09344) -> hint(
                    "Multiply the kilometer value by 0.621371. Your property " +
                            "converts miles to kilometers instead.",
                    failed
                )

                near(failed.actual, 6.2) && failed.expected == 6.21371 -> hint(
                    "Use the exact conversion factor 0.621371 from the note. " +
                            "A rounded factor drifts too far from the expected " +
                            "distance.",
                    failed
                )

                else -> hint(
                    "Compute miles as the kilometer value times 0.621371. The " +
                            "note above the exercise gives the formula.",
                    failed
                )
            }
        }
    }
}
