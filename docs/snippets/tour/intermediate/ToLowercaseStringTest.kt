import kotlin.test.Test

class ToLowercaseStringTest {
    private fun check(s: String, expected: String) =
        expect("\"$s\".toLowercaseString()", expected) { s.toLowercaseString() }

    @Test
    fun `lowercase any string`() {
        val checks = listOf(
            check("Hello World!", expected = "hello world!"),
            check("KOTLIN", expected = "kotlin"),
            check("all quiet", expected = "all quiet"),
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "Checked: toLowercaseString() returns the lowercase version of " +
                        "any string."
            )

            else -> when {
                failed.actual == "HELLO WORLD!" || failed.actual == "ALL QUIET" -> hint(
                    "Return the lowercase version of the string, not the " +
                            "uppercase one.",
                    failed
                )

                failed.actual == "Hello World!" || failed.actual == "KOTLIN" -> hint(
                    "Open the Hint above the exercise. It names the standard " +
                            "function that lowercases a String. Call it on the " +
                            "receiver, this, and return the result.",
                    failed
                )

                else -> hint(
                    "Return the string unchanged except for the case: every " +
                            "letter becomes lowercase.",
                    failed
                )
            }
        }
    }
}
