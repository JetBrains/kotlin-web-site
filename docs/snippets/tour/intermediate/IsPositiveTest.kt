import kotlin.test.Test

class IsPositiveTest {
    private fun check(n: Int, expected: Boolean): Expectation {
        val call = if (n < 0) "($n).isPositive()" else "$n.isPositive()"
        return expect(call, expected) { n.isPositive() }
    }

    @Test
    fun `report that only numbers above zero are positive`() {
        val checks = listOf(
            check(1, expected = true),
            check(42, expected = true),
            check(-3, expected = false),
            check(0, expected = false),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: isPositive() returns true for positive numbers and " +
                        "false for zero and negative numbers."
            )

            else -> when {
                failed.expected == true -> hint(
                    "Return true when the number is greater than 0. Inside an " +
                            "extension function, this is the number the function " +
                            "is called on.",
                    failed
                )

                failed.call == "0.isPositive()" -> hint(
                    "Return false for 0. Zero is not a positive number.",
                    failed
                )

                else -> hint(
                    "Return false for negative numbers. Only numbers greater " +
                            "than 0 are positive.",
                    failed
                )
            }
        }
    }
}
