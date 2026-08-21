import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private fun expectedFor(number: Int): String = when {
    number % 15 == 0 -> "fizzbuzz"
    number % 3 == 0 -> "fizz"
    number % 5 == 0 -> "buzz"
    else -> "$number"
}

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise2Test {
    // Order matters: the success condition goes first, then the symptoms from
    // the most specific to the most general - the shape of the output before
    // the content of the lines.
    // Known limitation: stdout alone can't prove a loop was used - a hardcoded
    // line-by-line printout would also pass; the exercise text already asks
    // for a for loop.
    @Test
    fun `every number from 1 to 100 follows the fizz buzz rules`() {
        val lines = outputLines
        when {
            lines.size == 100 && (0..99).all { lines[it] == expectedFor(it + 1) } ->
                return passed()

            actualOutput.isEmpty() ->
                hint(
                    "Nothing is printed yet. Use a for loop over 1..100 and println() " +
                            "to print a number or word on each step."
                )

            output.isEmpty() ->
                hint(
                    "println() is called, but the message is empty. " +
                            "Print the number, \"fizz\", \"buzz\", or \"fizzbuzz\"."
                )

            lines.size == 1 ->
                hint(
                    "Everything is printed on a single line. " +
                            "Use println() instead of print() to put each answer on its own line."
                )

            lines.size != 100 ->
                hint(
                    "${lines.size} lines are printed, but 100 are expected - " +
                            "one for every number from 1 to 100. Check the range of your for loop.",
                    // Show only the edges of the output to keep the message readable.
                    shownOutput = lines.take(3).joinToString("\n") + "\n...\n" +
                            lines.takeLast(3).joinToString("\n")
                )

            else -> {}
        }

        // 100 lines are printed, but at least one is wrong: report the first
        // wrong line, so the mismatch details and a window of the output
        // around it are prepared before choosing a hint.
        val mismatch = (0..99).firstOrNull { lines[it] != expectedFor(it + 1) }
            ?: return
        val number = mismatch + 1
        val expected = expectedFor(number)
        val actual = lines[mismatch]
        val details = "Line $number: expected \"$expected\", " +
                "but was \"${escapeHtml(actual)}\". "
        // Show a small window of the output around the first wrong line.
        val window = (maxOf(0, mismatch - 2)..minOf(99, mismatch + 2))
            .joinToString("\n") { "${it + 1}: ${lines[it]}" }
        when {
            actual.equals(expected, ignoreCase = true) ->
                hint(
                    details + "So close! Only the capitalization is off - " +
                            "use lowercase: \"$expected\".",
                    window
                )

            expected == "fizzbuzz" && actual in listOf("fizz", "buzz") ->
                hint(
                    details + "$number is divisible by both 3 and 5. Check the order " +
                            "of your when branches: the \"fizzbuzz\" check must come " +
                            "before \"fizz\" and \"buzz\".",
                    window
                )

            expected == "fizz" && actual == "$number" ->
                hint(
                    details + "$number is divisible by 3, so it should be replaced " +
                            "with \"fizz\". Check your number % 3 == 0 condition.",
                    window
                )

            expected == "buzz" && actual == "$number" ->
                hint(
                    details + "$number is divisible by 5, so it should be replaced " +
                            "with \"buzz\". Check your number % 5 == 0 condition.",
                    window
                )

            expected == "fizzbuzz" && actual == "$number" ->
                hint(
                    details + "$number is divisible by both 3 and 5, so it should be " +
                            "replaced with \"fizzbuzz\".",
                    window
                )

            expected == "$number" ->
                hint(
                    details + "$number is not divisible by 3 or 5, so the number " +
                            "itself should be printed. Check your conditions.",
                    window
                )

            else ->
                hint(details + "Almost there - every character counts.", window)
        }
    }
}
