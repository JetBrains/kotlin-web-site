import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private const val PREFIX = "https://example.com/book-info"
private val ACTIONS = listOf("title", "year", "author")
private val EXPECTED = ACTIONS.map { "$PREFIX/5/$it" }

// The learner's output as trimmed, non-empty lines; main() still runs only once.
private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class LambdasExercise1Test {

    @Test
    fun `a URL is built for every action`() {
        val lines = outputLines
        when {
            output == EXPECTED.toString() || lines == EXPECTED -> passed()

            actualOutput.isEmpty() -> hint(
                "Nothing is printed. The starter code contained a println(urls) " +
                        "call - bring it back and fill in the urls list."
            )

            output.isEmpty() -> hint(
                "println() is called, but the message is empty. Print the urls list."
            )

            "book-info/title" in output -> hint(
                "Don't forget the id between the prefix and the action: " +
                        "the URL for \"title\" should be \"${EXPECTED[0]}\"."
            )

            ACTIONS.all { it in output } && PREFIX !in output -> hint(
                "The actions are there, but each URL should start with the prefix: " +
                        "\"$PREFIX\"."
            )

            EXPECTED.any { it in output } && EXPECTED.any { it !in output } -> hint(
                "The URL for \"${ACTIONS[EXPECTED.indexOfFirst { it !in output }]}\" " +
                        "is missing. Build one URL for every action in the list."
            )

            lines.size == EXPECTED.size && lines.toSet() == EXPECTED.toSet() -> hint(
                "All three URLs are there, but not in the right order. " +
                        "Keep the URLs in the order of the actions list."
            )

            // Catches both extra output and a list printed in the wrong order.
            EXPECTED.all { it in output } -> hint(
                "All three URLs are there, but the output doesn't match exactly. " +
                        "Print them in the order of the actions list, with nothing extra."
            )

            else -> hint("The output should be the list of URLs: $EXPECTED.")
        }
    }
}
