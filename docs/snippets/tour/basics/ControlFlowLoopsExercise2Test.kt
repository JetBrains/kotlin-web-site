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

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 1 - the for loop covers 1 to 100`() = when {
        outputLines.size == 100 -> ok()

        actualOutput.isEmpty() ->
            fail(
                "Nothing is printed yet. Use a for loop over 1..100 and println() " +
                        "to print a number or word on each step."
            )

        output.isEmpty() ->
            fail(
                "println() is called, but the message is empty. " +
                        "Print the number, \"fizz\", \"buzz\", or \"fizzbuzz\"."
            )

        outputLines.size == 1 ->
            fail(
                "Everything is printed on a single line. " +
                        "Use println() instead of print() to put each answer on its own line."
            )

        else ->
            fail(
                "${outputLines.size} lines are printed, but 100 are expected - " +
                        "one for every number from 1 to 100. Check the range of your for loop.",
                // Show only the edges of the output to keep the message readable.
                shownOutput = outputLines.take(3).joinToString("\n") + "\n...\n" +
                        outputLines.takeLast(3).joinToString("\n")
            )
    }

    // This step reports the first wrong line, so it prepares the mismatch
    // details and a window of the output around it before choosing a hint.
    @Test
    fun `step 2 - every line follows the fizz buzz rules`() {
        val lines = outputLines
        if (lines.size != 100) {
            fail("Fix step 1 first.", shownOutput = "")
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
                    details + "So close! Only the capitalization is off - " +
                            "use lowercase: \"$expected\".",
                    window
                )

            expected == "fizzbuzz" && actual in listOf("fizz", "buzz") ->
                fail(
                    details + "$number is divisible by both 3 and 5. Check the order " +
                            "of your when branches: the \"fizzbuzz\" check must come " +
                            "before \"fizz\" and \"buzz\".",
                    window
                )

            expected == "fizz" && actual == "$number" ->
                fail(
                    details + "$number is divisible by 3, so it should be replaced " +
                            "with \"fizz\". Check your number % 3 == 0 condition.",
                    window
                )

            expected == "buzz" && actual == "$number" ->
                fail(
                    details + "$number is divisible by 5, so it should be replaced " +
                            "with \"buzz\". Check your number % 5 == 0 condition.",
                    window
                )

            expected == "fizzbuzz" && actual == "$number" ->
                fail(
                    details + "$number is divisible by both 3 and 5, so it should be " +
                            "replaced with \"fizzbuzz\".",
                    window
                )

            expected == "$number" ->
                fail(
                    details + "$number is not divisible by 3 or 5, so the number " +
                            "itself should be printed. Check your conditions.",
                    window
                )

            else ->
                fail(details + "Almost there - every character counts.", window)
        }
    }
}


private fun escapeHtml(text: String): String = text
    .replace("&", "&#38;")
    .replace("<", "&#60;")
    .replace(">", "&#62;")
