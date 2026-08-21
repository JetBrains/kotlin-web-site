import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class LambdasExercise2Test {
    @Test
    fun `repeatN repeats the action and main prints Hello five times`() {
        var count3 = 0
        repeatN(3) { count3++ }
        var count0 = 0
        repeatN(0) { count0++ }
        val lines = outputLines
        when {
            count3 == 3 && count0 == 0 && lines == List(5) { "Hello" } -> passed()

            count3 == 0 -> hint(
                "repeatN(3) { ... } never calls the action. " +
                        "Call action() inside a loop that runs n times.",
                ""
            )

            count3 == 4 || count0 == 1 -> hint(
                "repeatN runs the action one extra time - " +
                        "check the loop range: 1..n runs exactly n times.",
                ""
            )

            count3 != 3 -> hint(
                "repeatN(3) { ... } ran the action $count3 times instead of 3. " +
                        "Check the loop inside repeatN.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "repeatN works! Now call it in main() to print \"Hello\" 5 times."
            )

            output.isEmpty() -> hint(
                "println() is called, but the message is empty. Print \"Hello\"."
            )

            lines.all { it == "Hello" } && lines.size != 5 -> hint(
                "\"Hello\" is printed ${lines.size} time/s instead of 5."
            )

            lines.map { it.lowercase() } == List(5) { "hello" } -> hint(
                "So close! Only the capitalization is off - print \"Hello\"."
            )

            else -> hint(
                "The output should be \"Hello\" on 5 separate lines. " +
                        "Call repeatN(5) with a lambda that prints \"Hello\"."
            )
        }
    }
}
