import kotlin.test.Test

class TestPageExpectationTest {

    @Test
    fun `return the greeting wrapped in a bold tag`() {
        val checks = listOf(
            expect("greetingFor(\"Tom & Jerry\")", "<b>Hello, Tom & Jerry</b>") {
                greetingFor("Tom & Jerry")
            },
            expect("greetingFor(\"Ann\")", "<b>Hello, Ann</b>") {
                greetingFor("Ann")
            },
        )
        when (val failed = checks.firstMismatch()) {
            null -> passed(
                "greetingFor() wraps the name in the bold tag for every name it was checked with."
            )

            else -> when {
                failed.isTodo -> hint(
                    "Replace TODO() in greetingFor() with the greeting.",
                    failed
                )

                else -> hint(
                    "Return the greeting wrapped in a bold tag, as shown in the task.",
                    failed
                )
            }
        }
    }
}
