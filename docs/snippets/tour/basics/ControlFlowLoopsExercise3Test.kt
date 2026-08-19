import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val ALL_WORDS = listOf("dinosaur", "limousine", "magazine", "language")
private val EXPECTED_WORDS = listOf("limousine", "language")

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

// The loop works if every printed line is a word from the list.
private fun printsWordsFromTheList(lines: List<String>): Boolean =
    lines.isNotEmpty() && lines.all { line -> ALL_WORDS.any { it.equals(line, ignoreCase = true) } }

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise3Test {

    // Order matters: the most specific symptoms go first.
    @Test
    fun `step 1 - the loop prints words from the list`() = when {
        printsWordsFromTheList(outputLines) -> passed()

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

        outputLines.size == 1 && outputLines[0].equals("limousinelanguage", ignoreCase = true) ->
            hint(
                "The right words are there, but they are glued together. " +
                        "Use println() instead of print() to put each word on its own line."
            )

        else ->
            hint(
                "The output should contain only words from the list, " +
                        "each on its own line."
            )
    }

    @Test
    fun `step 2 - only the words starting with 'l' are printed`() {
        val lines = outputLines
        val wrongWord = lines.firstOrNull { it in ALL_WORDS && it !in EXPECTED_WORDS }
        val missingWord = EXPECTED_WORDS.firstOrNull { it !in lines }
        // Order matters: the most specific symptoms go first.
        when {
            lines == EXPECTED_WORDS -> passed()

            !printsWordsFromTheList(lines) ->
                hint("Fix step 1 first.")

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

            else ->
                hint(
                    "The output should be \"limousine\" and \"language\", " +
                            "each on its own line."
                )
        }
    }
}
