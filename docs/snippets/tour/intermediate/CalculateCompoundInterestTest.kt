import kotlin.math.abs
import kotlin.test.Test

class CalculateCompoundInterestTest {
    private fun amount(P: Double, r: Double, n: Int, t: Int): Any? =
        calculateCompoundInterest(P, r, n, t)

    private fun near(actual: Any?, value: Double): Boolean =
        actual is Number && abs(actual.toDouble() - value) < 0.5

    @Test
    fun `apply the compound interest formula`() {
        val checks = listOf(
            expect(
                "calculateCompoundInterest(2000.0, 0.04, 2, 3)",
                2252.3248385280003, tolerance = 1e-6,
            ) { amount(2000.0, 0.04, 2, 3) },
            expect(
                "calculateCompoundInterest(500.0, 0.1, 1, 2)",
                605.0, tolerance = 1e-6,
            ) { amount(500.0, 0.1, 1, 2) },
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: calculateCompoundInterest() computes P times " +
                        "(1 + r / n) raised to the power of n * t for any inputs."
            )

            else -> when {
                failed.thrown != null -> hint(
                    "Return the accumulated amount from the function. Multiply P " +
                            "by (1 + r / n) raised to the power of n * t.",
                    failed
                )

                near(failed.actual, 2240.0) -> hint(
                    "Raise (1 + r / n) to the power of n * t with the pow() " +
                            "function. Compound interest is not P * (1 + r * t).",
                    failed
                )

                near(failed.actual, 2122.416) -> hint(
                    "Use n * t as the exponent. The interest compounds n times " +
                            "per year for t years.",
                    failed
                )

                near(failed.actual, 2530.638) -> hint(
                    "Divide the rate r by n before adding 1. Each compounding " +
                            "period applies only a fraction of the annual rate.",
                    failed
                )

                else -> hint(
                    "Follow the formula from the task: multiply P by (1 + r / n) " +
                            "raised to the power of n * t.",
                    failed
                )
            }
        }
    }
}
