import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val ALL_WORDS = listOf("dinosaur", "limousine", "magazine", "language")
private val EXPECTED_WORDS = listOf("limousine", "language")

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class ControlFlowLoopsExercise3Test {

    @Test
    fun `step 1 - the program prints output`() = when {
        output.isNotEmpty() -> ok()

        actualOutput.isEmpty() ->
            fail(
                "Nothing is printed yet. Loop over the list with for and print the " +
                        "words that start with \"l\". If you already have a condition " +
                        "but nothing matches, make sure it checks for a lowercase \"l\"."
            )

        else ->
            fail(
                "println() is called, but the message is empty. " +
                        "Print the words that start with \"l\"."
            )
    }

    @Test
    fun `step 2 - only the words starting with 'l' are printed`() {
        val lines = output.lines().map { it.trim() }.filter { it.isNotEmpty() }
        val wrongWord = lines.firstOrNull { it in ALL_WORDS && it !in EXPECTED_WORDS }
        val missingWord = EXPECTED_WORDS.firstOrNull { it !in lines }
        // Order matters: the most specific symptoms go first.
        when {
            lines == EXPECTED_WORDS -> ok()

            output.isEmpty() ->
                fail("Fix step 1 first.")

            lines.containsAll(ALL_WORDS) ->
                fail(
                    "Every word is printed. Add an if condition with " +
                            "startsWith(\"l\") inside the loop so that only " +
                            "\"limousine\" and \"language\" pass the check."
                )

            lines.size == 1 && lines[0].equals("limousinelanguage", ignoreCase = true) ->
                fail(
                    "The right words are there, but they are glued together. " +
                            "Use println() instead of print() to put each word on its own line."
                )

            lines.map { it.lowercase() } == EXPECTED_WORDS ->
                fail("So close! Only the capitalization is off.")

            wrongWord != null ->
                fail(
                    "\"$wrongWord\" doesn't start with \"l\", so it shouldn't be " +
                            "printed. Check the condition of your if."
                )

            missingWord != null && lines.all { it in EXPECTED_WORDS } ->
                fail(
                    "\"$missingWord\" starts with \"l\", but it isn't printed. " +
                            "Check the condition of your if."
                )

            else ->
                fail(
                    "The output should be \"limousine\" and \"language\", " +
                            "each on its own line."
                )
        }
    }
}
