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
                "Call action() inside repeatN - the action never runs at the moment. " +
                        "Repeat that call n times with a loop.",
                ""
            )

            count3 == 4 || count0 == 1 -> hint(
                "Make the loop run exactly n times - it repeats the action once too often. " +
                        "The range 1..n covers exactly n steps.",
                ""
            )

            count3 != 3 -> hint(
                "Check the loop inside repeatN - asked for 3 repeats, " +
                        "but the action ran $count3 times.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Call repeatN(5) in main() with a lambda that prints \"Hello\" - " +
                        "repeatN itself already works!"
            )

            output.isEmpty() -> hint(
                "Print \"Hello\" inside the lambda - println() is called with an empty message."
            )

            lines.all { it == "Hello" } && lines.size != 5 -> hint(
                "Repeat the action 5 times - \"Hello\" is printed ${lines.size} times so far."
            )

            lines.map { it.lowercase() } == List(5) { "hello" } -> hint(
                "Print \"Hello\" with a capital H - only the capitalization is off. So close!"
            )

            else -> hint(
                "Call repeatN(5) with a lambda that prints \"Hello\" - " +
                        "the output should be \"Hello\" on 5 separate lines."
            )
        }
    }
}