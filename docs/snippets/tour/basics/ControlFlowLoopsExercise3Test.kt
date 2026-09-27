import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val ALL_WORDS = listOf("dinosaur", "limousine", "magazine", "language")
private val EXPECTED_WORDS = listOf("limousine", "language")

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise3Test {

    @Test
    fun `print only the words that start with l`() {
        val lines = outputLines
        val missingWord = EXPECTED_WORDS.firstOrNull { it !in lines }

        val wrongWord = lines.firstOrNull { line ->
            ALL_WORDS.any { it.equals(line, ignoreCase = true) } &&
                    EXPECTED_WORDS.none { it.equals(line, ignoreCase = true) }
        }

        when {
            lines == EXPECTED_WORDS -> passed(
                "Checked: the printed words only. The test doesn't check how you pick " +
                        "them. The intended solution uses a for loop with an if condition inside."
            )

            actualOutput.isEmpty() ->
                hint(
                    "Loop over the list with for and print the words that start " +
                            "with \"l\". Your program doesn't print anything yet. If you already have a " +
                            "condition but nothing matches, make sure it checks for a " +
                            "lowercase \"l\"."
                )

            output.isEmpty() ->
                hint(
                    "Print the words that start with \"l\". " +
                            "pYour program calls println(), but doesn't pass it a value."
                )

            lines.size == 1 && lines[0].equals("limousinelanguage", ignoreCase = true) ->
                hint(
                    "Use println() instead of print() to put each word on its own " +
                            "line. Your program prints \"limousine\" and \"language\" on one line."
                )

            lines.containsAll(ALL_WORDS) ->
                hint(
                    "Add an if condition with startsWith(\"l\") inside the loop. " +
                            "Your program prints every word now, but only \"limousine\" and " +
                            "\"language\" start with \"l\"."
                )

            lines.map { it.lowercase() } == EXPECTED_WORDS ->
                hint(
                    "Print the words in lowercase, as they appear in the list. " +
                            "Only the capitalization is wrong."
                )

            wrongWord != null ->
                hint(
                    "Check the if condition. \"$wrongWord\" doesn't start " +
                            "with \"l\", so it shouldn't appear in the output."
                )

            missingWord != null && lines.all { it in EXPECTED_WORDS } ->
                hint(
                    "Check the if condition. \"$missingWord\" starts with " +
                            "\"l\", but your program doesn't print it."
                )

            lines.size == EXPECTED_WORDS.size && lines.toSet() == EXPECTED_WORDS.toSet() ->
                hint(
                    "Print the words in the order they appear in the list. " +
                            "\"limousine\" comes before \"language\"."
                )

            else ->
                hint("Print \"limousine\" and \"language\" each on its own line.")
        }
    }
}
