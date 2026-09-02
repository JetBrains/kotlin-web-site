import kotlin.test.Test

class EmployeeTest {
    private fun looksLikeEmployee(line: String, salary: Int) =
        line.startsWith("Employee(") && "=Mary" in line && "salary=$salary" in line

    @Test
    fun `print the employee before and after the raise`() {
        val lines = output.lines()

        when {
            lines.size == 2 && looksLikeEmployee(lines[0], 20) && looksLikeEmployee(lines[1], 30) ->
                passed(
                    "Checked: Employee is a data class, and its mutable salary " +
                            "goes up from 20 to 30."
                )

            actualOutput.isBlank() -> hint(
                "Keep both println(emp) calls in main(). They show the employee " +
                        "before and after the raise.",
                ""
            )

            "@" in output -> hint(
                "Add the data keyword in front of your class declaration. " +
                        "A data class prints its properties, but a regular class prints " +
                        "only its name and a code, as below."
            )

            lines.size != 2 -> hint(
                "Print the employee exactly twice: once before and once after the raise. " +
                        "Your program prints ${lines.size} line(s) instead of 2."
            )

            lines.none { "salary=30" in it } -> hint(
                "Give the raise before the second println: emp.salary += 10 " +
                        "should turn 20 into 30."
            )

            else -> hint(
                "Declare a data class with two properties: a name and a mutable salary. " +
                        "The two lines then read Employee(name=Mary, salary=20) and " +
                        "Employee(name=Mary, salary=30)."
            )
        }
    }
}
