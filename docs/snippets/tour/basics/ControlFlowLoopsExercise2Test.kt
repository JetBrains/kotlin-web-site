import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test
import kotlin.test.fail

private fun expectedFor(number: Int): String = when {
    number % 15 == 0 -> "fizzbuzz"
    number % 3 == 0 -> "fizz"
    number % 5 == 0 -> "buzz"
    else -> "$number"
}

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    actualOutput.trim().lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise2Test {

    @Test
    fun `step 1 - the program prints output`() = checkStep(
        emptyHint = "Nothing is printed yet. Use a for loop over 1..100 and println() " +
                "to print a number or word on each step.",
        blankHint = "println() is called, but the message is empty. " +
                "Print the number, \"fizz\", \"buzz\", or \"fizzbuzz\".",
        hints = emptyList(),
        fallbackHint = "Fix step 1 first.",
    ) { it.isNotEmpty() }

    // This step shows only the edges of the 100-line output, so it builds its own
    // messages instead of using a fixed hint table.
    @Test
    fun `step 2 - the program prints 100 lines`() {
        val output = actualOutput.trim()
        val lines = outputLines
        when {
            lines.size == 100 -> return

            output.isEmpty() ->
                fail("Fix step 1 first.")

            lines.size == 1 ->
                fail(
                    withOutput(
                        "Everything is printed on a single line. " +
                                "Use println() instead of print() to put each answer on its own line.",
                        output
                    )
                )

            else ->
                fail(
                    withOutput(
                        "${lines.size} lines are printed, but 100 are expected - " +
                                "one for every number from 1 to 100. Check the range of your for loop.",
                        // Show only the edges of the output to keep the message readable.
                        lines.take(3).joinToString("\n") + "\n...\n" +
                                lines.takeLast(3).joinToString("\n")
                    )
                )
        }
    }

    // This step reports the first wrong line with a window of the output around it,
    // so it builds its own detailed messages instead of using a fixed hint table.
    @Test
    fun `step 3 - every line follows the fizz buzz rules`() {
        val lines = outputLines
        if (lines.size != 100) {
            fail("Fix step 2 first.")
        }
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
                fail(
                    withOutput(
                        details + "So close! Only the capitalization is off - " +
                                "use lowercase: \"$expected\".",
                        window
                    )
                )

            expected == "fizzbuzz" && actual in listOf("fizz", "buzz") ->
                fail(
                    withOutput(
                        details + "$number is divisible by both 3 and 5. Check the order " +
                                "of your when branches: the \"fizzbuzz\" check must come " +
                                "before \"fizz\" and \"buzz\".",
                        window
                    )
                )

            expected == "fizz" && actual == "$number" ->
                fail(
                    withOutput(
                        details + "$number is divisible by 3, so it should be replaced " +
                                "with \"fizz\". Check your number % 3 == 0 condition.",
                        window
                    )
                )

            expected == "buzz" && actual == "$number" ->
                fail(
                    withOutput(
                        details + "$number is divisible by 5, so it should be replaced " +
                                "with \"buzz\". Check your number % 5 == 0 condition.",
                        window
                    )
                )

            expected == "fizzbuzz" && actual == "$number" ->
                fail(
                    withOutput(
                        details + "$number is divisible by both 3 and 5, so it should be " +
                                "replaced with \"fizzbuzz\".",
                        window
                    )
                )

            expected == "$number" ->
                fail(
                    withOutput(
                        details + "$number is not divisible by 3 or 5, so the number " +
                                "itself should be printed. Check your conditions.",
                        window
                    )
                )

            else ->
                fail(withOutput(details + "Almost there - every character counts.", window))
        }
    }
}


private fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")
