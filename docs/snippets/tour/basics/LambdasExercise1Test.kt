import org.junit.FixMethodOrder
import org.junit.runners.MethodSorters
import kotlin.test.Test

private val ACTIONS = listOf("title", "year", "author")
private const val PREFIX = "https://example.com/book-info"
private val EXPECTED = ACTIONS.map { "$PREFIX/5/$it" }

private const val ALT_PREFIX = "https://books.example.org/catalog"

private val ALT_ACTIONS = listOf("genre", "rating")
private val ALT_EXPECTED = ALT_ACTIONS.map { "$ALT_PREFIX/7/$it" }

private val outputLines: List<String> by lazy {
    output.lines().map { it.trim() }.filter { it.isNotEmpty() }
}

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
class LambdasExercise1Test {

    @Test
    fun `buildUrls builds a URL for every action`() {
        val reference = try {
            buildUrls(ACTIONS, PREFIX, 5)
        } catch (e: NotImplementedError) {
            hint(
                "Replace the TODO() with an actions.map call. " +
                        "map turns each action into a new list item - " +
                        "build one URL for every action.",
                ""
            )
        }
        val alternate = buildUrls(ALT_ACTIONS, ALT_PREFIX, 7)
        when {
            reference == EXPECTED && alternate == ALT_EXPECTED &&
                    (output == EXPECTED.toString() || outputLines == EXPECTED) -> passed()

            reference == EXPECTED && alternate != ALT_EXPECTED -> hint(
                "Build the URLs from the parameters instead of fixed values. " +
                        "They are correct for this list of actions, " +
                        "but buildUrls returns the same URLs for any other list.",
                ""
            )

            reference.any { "/5/" !in it && it.startsWith(PREFIX) } -> hint(
                "Put the id between the prefix and the action: " +
                        "the URL for \"${ACTIONS[0]}\" should be \"${EXPECTED[0]}\".",
                ""
            )

            reference.isNotEmpty() && reference.none { it.startsWith(PREFIX) } -> hint(
                "Start every URL with the prefix parameter: \"$PREFIX\".",
                ""
            )

            reference.size != ACTIONS.size -> hint(
                "Build one URL for every action - try actions.map. " +
                        "buildUrls returned ${reference.size} URLs for ${ACTIONS.size} actions.",
                ""
            )

            reference != EXPECTED && reference.toSet() == EXPECTED.toSet() -> hint(
                "Keep the URLs in the order of the actions list. " +
                        "All of them are there, just in a different order.",
                ""
            )

            reference != EXPECTED -> hint(
                "Check how each URL is built: buildUrls returned $reference, " +
                        "but $EXPECTED was expected.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Bring the println(urls) call back in main() - buildUrls itself already works!"
            )

            else -> hint(
                "Print the urls list - buildUrls itself already works, " +
                        "only the output doesn't match."
            )
        }
    }
}