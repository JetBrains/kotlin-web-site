import kotlin.test.Test

class SalaryByIdTest {
    private fun salaryOf(id: Int, expected: Int) =
        expect("salaryById($id)", expected) { salaryById(id) }

    @Test
    fun `return each salary, and 0 for a missing employee`() {
        val checks = listOf(
            salaryOf(1, expected = 20),
            salaryOf(2, expected = 0),
            salaryOf(3, expected = 21),
            salaryOf(4, expected = 23),
            salaryOf(5, expected = 0),
        )

        when (val failed = checks.firstMismatch()) {
            null ->
                if ("64" in output.lines()) passed(
                    "Checked: salaryById returns each employee's salary, and 0 when there is " +
                            "no employee with that id, so main() prints the total of 64."
                ) else hint(
                    "Keep the println(...) call in main() as it is. It prints the " +
                            "total of all five salaries, 64."
                )

            else -> when {
                failed.isTodo -> hint(
                    "Replace the TODO() with your expression. " +
                            "Return the salary of the employee that employeeById(id) " +
                            "finds, or 0 when there is no employee."
                )

                failed.thrown != null -> hint(
                    "Use the safe call operator (?.) to read the salary, so that a missing " +
                            "employee does not stop the program.",
                    failed
                )

                failed.expected == 0 -> hint(
                    "Return 0 when there is no employee with the given id. The Elvis " +
                            "operator (?:) returns a default value when a null is detected.",
                    failed
                )

                else -> hint(
                    "Return the salary of the employee that employeeById(id) finds.",
                    failed
                )
            }
        }
    }
}
