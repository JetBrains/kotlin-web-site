import kotlin.test.Test

class RandomEmployeeGeneratorTest {
    private class Generated(val raw: Any?) {
        val text = raw.toString()
        val salary = Regex("salary=(-?\\d+)").find(text)?.groupValues?.get(1)?.toIntOrNull()
        val name = Regex("name=([^,)]+)").find(text)?.groupValues?.get(1)
        val isEmployee = raw !is Throwable && salary != null && name != null
    }

    private fun generate(gen: RandomEmployeeGenerator, count: Int): List<Generated> =
        List(count) {
            Generated(try { gen.generateEmployee() } catch (e: Throwable) { e })
        }

    @Test
    fun `keep every generated salary within the current limits`() {
        val gen = RandomEmployeeGenerator(10, 30)
        val first = generate(gen, 40)

        gen.minSalary = 100
        gen.maxSalary = 103

        val second = generate(gen, 40)
        val thrown = (first + second).firstOrNull { it.raw is Throwable }?.raw as Throwable?
        val alien = (first + second).firstOrNull { !it.isEmployee }

        when {
            alien == null &&
                    first.all { it.salary!! in 10..30 && it.name!!.isNotBlank() } &&
                    first.mapTo(HashSet()) { it.name }.size > 1 &&
                    first.mapTo(HashSet()) { it.salary }.size > 1 &&
                    second.all { it.salary!! in 100..103 } ->
                passed(
                    "Checked: names are picked from your list at random, and salaries " +
                            "always stay between the current minSalary and maxSalary, " +
                            "even after they change."
                )

            thrown != null -> hint(
                "Pass the limits in order: Random.nextInt(from = minSalary, until = maxSalary). " +
                        "Calling generateEmployee() throws ${thrown::class.simpleName}" +
                        (thrown.message?.let { ": " + escapeHtml(it) } ?: "") + ".",
                ""
            )

            alien != null -> hint(
                "Return an Employee from generateEmployee(). The Employee data class " +
                        "is at the top of the code, and generateEmployee() returns " +
                        "${escapeHtml(alien.text)} instead.",
                ""
            )

            first.mapTo(HashSet()) { it.name }.size < 2 -> hint(
                "Pick a random name from your list for every employee. The .random() " +
                        "function from Hint 1 does exactly that. 40 employees in a row " +
                        "are all named ${escapeHtml(first[0].name ?: "")}.",
                ""
            )

            first.mapTo(HashSet()) { it.salary }.size < 2 -> hint(
                "Make the salary random between minSalary and maxSalary. Hint 2 shows " +
                        "how Random.nextInt does that. 40 employees in a row all get " +
                        "the salary ${first[0].salary}.",
                ""
            )

            first.any { it.salary!! < 10 } -> hint(
                "Use minSalary as the lower limit for the salary: " +
                        "Random.nextInt(from = minSalary, until = maxSalary). " +
                        "generateEmployee() produces the salary " +
                        "${first.first { it.salary!! < 10 }.salary}, but minSalary is 10.",
                ""
            )

            first.any { it.salary!! > 30 } -> hint(
                "Use maxSalary as the upper limit for the salary: " +
                        "Random.nextInt(from = minSalary, until = maxSalary). " +
                        "generateEmployee() produces the salary " +
                        "${first.first { it.salary!! > 30 }.salary}, but maxSalary is 30.",
                ""
            )

            second.any { it.salary!! !in 100..103 } -> hint(
                "Read minSalary and maxSalary inside generateEmployee() so that later " +
                        "changes take effect. After they are set to 100 and 103, " +
                        "generateEmployee() produces the salary " +
                        "${second.first { it.salary!! !in 100..103 }.salary}.",
                ""
            )

            else -> hint(
                "Give every employee a non-blank name from your list of names. " +
                        "One generated employee is " +
                        "${escapeHtml((first.firstOrNull { it.name!!.isBlank() } ?: first[0]).text)}.",
                ""
            )
        }
    }
}
