import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class LambdasExercise2Test {

    @Test
    fun `repeat an action and print Hello five times`() {
        var count3 = 0
        repeatN(3) { count3++ }

        var count0 = 0
        repeatN(0) { count0++ }

        val lines = outputLines

        when {
            count3 == 3 && count0 == 0 && lines == List(5) { "Hello" } -> passed()

            count3 == 0 -> hint(
                "Call action() inside repeatN. " +
                        "Use a loop to run the action n times.",
                ""
            )

            count3 == 4 || count0 == 1 -> hint(
                "Make the loop run exactly n times. The action currently runs once too often. " +
                        "The range 1..n covers exactly n steps.",
                ""
            )

            count3 != 3 -> hint(
                "Check the loop inside repeatN." +
                        "For n = 3, the action runs $count3 times instead of 3.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Call repeatN(5) inside main() and pass a lambda that prints \"Hello\"."
            )

            output.isEmpty() -> hint(
                "Print \"Hello\" inside the lambda. println() currently prints an empty line."
            )

            lines.all { it == "Hello" } && lines.size != 5 -> hint(
                "Repeat the action 5 times. " +  
                "\"Hello\" is printed ${lines.size} times."
            )

            lines.map { it.lowercase() } == List(5) { "hello" } -> hint(
                "Print \"Hello\" with a capital H."
            )

            else -> hint(
                "Call repeatN(5) with a lambda that prints \"Hello\". " +
                        "The program should print \"Hello\" on 5 separate lines."
            )
        }
    }
}