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
    fun `build a URL for every action`() {
        val reference = try {
            buildUrls(ACTIONS, PREFIX, 5)
        } catch (e: NotImplementedError) {
            hint(
                "Replace the TODO() with an actions.map call. " +
                        "Build one URL for every action.",
                ""
            )
        }
        val alternate = buildUrls(ALT_ACTIONS, ALT_PREFIX, 7)
        when {
            reference == EXPECTED && alternate == ALT_EXPECTED &&
                    (output == EXPECTED.toString() || outputLines == EXPECTED) -> passed()

            reference == EXPECTED && alternate != ALT_EXPECTED -> hint(
                "Build the URLs from the function parameters instead of fixed values. " +
                        "The URLs are correct for the example inputs, but not for different inputs.",
                ""
            )

            reference.any { "/5/" !in it && it.startsWith(PREFIX) } -> hint(
                "Put the id between the prefix and the action: " +
                        "For \"${ACTIONS[0]}\", the URL should be \"${EXPECTED[0]}\".",
                ""
            )

            reference.isNotEmpty() && reference.none { it.startsWith(PREFIX) } -> hint(
                "Start every URL with the prefix parameter: \"$PREFIX\".",
                ""
            )

            reference.size != ACTIONS.size -> hint(
                "Build one URL for every action with actions.map. " +
                        "buildUrls returns ${reference.size} URLs for ${ACTIONS.size} actions.",
                ""
            )

            reference != EXPECTED && reference.toSet() == EXPECTED.toSet() -> hint(
                "Keep the URLs in the same order as the actions list. " +
                        "All the expected URLs are there, but the order is different.",
                ""
            )

            reference != EXPECTED -> hint(
                "Check how each URL is built. buildUrls returns $reference, " +
                        "but $EXPECTED is expected.",
                ""
            )

            actualOutput.isEmpty() -> hint(
                "Add println(urls) inside main(). buildUrls already returns the expected list."
            )

            else -> hint(
                "Print the urls list with println(urls). buildUrls already returns the expected list."
            )
        }
    }
}