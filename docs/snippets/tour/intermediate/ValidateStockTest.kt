import kotlin.test.Test

class ValidateStockTest {
    private fun stock(requested: Int?, available: Int?): Any? =
        validateStock(requested, available)

    private fun check(requested: Int?, available: Int?, expected: Int) =
        expect("validateStock($requested, $available)", expected) { stock(requested, available) }

    @Test
    fun `validate the requested quantity`() {
        val checks = listOf(
            check(3, 8, expected = 3),
            check(null, 8, expected = -1),
            check(3, null, expected = -1),
            check(-3, 8, expected = -1),
            check(12, 8, expected = -1),
            check(8, 8, expected = 8),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: validateStock() returns the requested amount when it " +
                        "is valid and -1 for every invalid case."
            )

            else -> when {
                failed.thrown is NullPointerException -> hint(
                    "Return -1 with the Elvis operator as soon as requested or " +
                            "available is null, instead of asserting them with !!.",
                    failed
                )

                failed.thrown != null -> hint(
                    "Return -1 early for every invalid case. The Elvis operator " +
                            "handles the null ones.",
                    failed
                )

                "null" in failed.call -> hint(
                    "Use the Elvis operator to return -1 as soon as requested or " +
                            "available is null.",
                    failed
                )

                "-3" in failed.call -> hint(
                    "Return -1 when the requested amount is negative.",
                    failed
                )

                "12" in failed.call -> hint(
                    "Return -1 when requested is higher than available.",
                    failed
                )

                "validateStock(8, 8)" == failed.call -> hint(
                    "Return -1 only when requested is strictly higher than " +
                            "available. Requesting exactly the available amount " +
                            "is valid.",
                    failed
                )

                else -> hint(
                    "Return the requested amount itself once it passes all the " +
                            "checks.",
                    failed
                )
            }
        }
    }
}
