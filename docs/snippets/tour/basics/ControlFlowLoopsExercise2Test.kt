import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private fun expectedFor(number: Int): String = when {
    number % 15 == 0 -> "fizzbuzz"
    number % 3 == 0 -> "fizz"
    number % 5 == 0 -> "buzz"
    else -> "$number"
}

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise2Test {

    @Test
    fun `follow the fizz buzz rules for every number from 1 to 100`() {
        val lines = outputLines
        when {
            lines.size == 100 && (0..99).all { lines[it] == expectedFor(it + 1) } ->
                return passed(
                    "Checked: all 100 lines follow the rules. The test can't see how " +
                            "you produce them. A for loop over 1..100 with a when " +
                            "expression is the intended way."
                )

            actualOutput.isEmpty() ->
                hint(
                    "Use a for loop over 1..100 and println() to print a number or " +
                            "word on each step. Nothing is printed yet."
                )

            output.isEmpty() ->
                hint(
                    "Print the number, \"fizz\", \"buzz\", or \"fizzbuzz\". " +
                            "println() is called, but the message is empty."
                )

            lines.size == 1 ->
                hint(
                    "Use println() instead of print() to put each answer on its " +
                            "own line. Everything is printed on a single line so far."
                )

            lines.size != 100 ->
                hint(
                    "Check the range of your for loop. ${lines.size} lines are " +
                            "printed, but 100 are expected, one for every number " +
                            "from 1 to 100.",
                    // Show only the edges of the output to keep the message readable.
                    shownOutput = lines.take(3).joinToString("\n") + "\n...\n" +
                            lines.takeLast(3).joinToString("\n")
                )

            else -> {}
        }

        val mismatch = (0..99).firstOrNull { lines[it] != expectedFor(it + 1) }
            ?: return
        val number = mismatch + 1
        val expected = expectedFor(number)
        val actual = lines[mismatch]
        val details = "Line $number: the output is \"${escapeHtml(actual)}\", " +
                "but \"$expected\" is expected."
        // Show a small window of the output around the first wrong line.
        val window = (maxOf(0, mismatch - 2)..minOf(99, mismatch + 2))
            .joinToString("\n") { "${it + 1}: ${lines[it]}" }
        when {
            actual.equals(expected, ignoreCase = true) ->
                hint(
                    "Use lowercase \"$expected\". Only the capitalization " +
                            "is off. " + details,
                    window
                )

            expected == "fizzbuzz" && actual in listOf("fizz", "buzz") ->
                hint(
                    "Move the \"fizzbuzz\" check before \"fizz\" and \"buzz\" in " +
                            "your when expression. $number is divisible by both 3 " +
                            "and 5. " + details,
                    window
                )

            expected == "fizz" && actual == "$number" ->
                hint(
                    "Check your number % 3 == 0 condition. $number is divisible " +
                            "by 3, so it should be replaced with \"fizz\". " + details,
                    window
                )

            expected == "buzz" && actual == "$number" ->
                hint(
                    "Check your number % 5 == 0 condition. $number is divisible " +
                            "by 5, so it should be replaced with \"buzz\". " + details,
                    window
                )

            expected == "fizzbuzz" && actual == "$number" ->
                hint(
                    "Add a check for numbers divisible by both 3 and 5. Those " +
                            "numbers are replaced with \"fizzbuzz\". " + details,
                    window
                )

            expected == "$number" ->
                hint(
                    "Check your conditions: $number is not divisible by 3 or 5, " +
                            "so the number itself should be printed. " + details,
                    window
                )

            else ->
                hint("Check the line carefully. Every character counts. " + details, window)
        }
    }
}
