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
    fun `only the words starting with 'l' are printed`() {
        val lines = outputLines
        val wrongWord = lines.firstOrNull { line ->
            ALL_WORDS.any { it.equals(line, ignoreCase = true) } &&
                    EXPECTED_WORDS.none { it.equals(line, ignoreCase = true) }
        }
        val missingWord = EXPECTED_WORDS.firstOrNull { it !in lines }
        when {
            lines == EXPECTED_WORDS -> passed()

            actualOutput.isEmpty() ->
                hint(
                    "Nothing is printed yet. Loop over the list with for and print the " +
                            "words that start with \"l\". If you already have a condition " +
                            "but nothing matches, make sure it checks for a lowercase \"l\"."
                )

            output.isEmpty() ->
                hint(
                    "println() is called, but the message is empty. " +
                            "Print the words that start with \"l\"."
                )

            lines.size == 1 && lines[0].equals("limousinelanguage", ignoreCase = true) ->
                hint(
                    "The right words are there, but they are glued together. " +
                            "Use println() instead of print() to put each word on its own line."
                )

            lines.containsAll(ALL_WORDS) ->
                hint(
                    "Every word is printed. Add an if condition with " +
                            "startsWith(\"l\") inside the loop so that only " +
                            "\"limousine\" and \"language\" pass the check."
                )

            lines.map { it.lowercase() } == EXPECTED_WORDS ->
                hint("So close! Only the capitalization is off.")

            wrongWord != null ->
                hint(
                    "\"$wrongWord\" doesn't start with \"l\", so it shouldn't be " +
                            "printed. Check the condition of your if."
                )

            missingWord != null && lines.all { it in EXPECTED_WORDS } ->
                hint(
                    "\"$missingWord\" starts with \"l\", but it isn't printed. " +
                            "Check the condition of your if."
                )

            lines.size == EXPECTED_WORDS.size && lines.toSet() == EXPECTED_WORDS.toSet() ->
                hint(
                    "Both words are there, but not in the right order. Print the " +
                            "words in the order they appear in the list."
                )

            else ->
                hint(
                    "The output should be \"limousine\" and \"language\", " +
                            "each on its own line."
                )
        }
    }
}
