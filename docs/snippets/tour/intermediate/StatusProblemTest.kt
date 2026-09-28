import kotlin.test.Test

class StatusProblemTest {
    private fun sampleProblem(): Any = Status.Error.Problem.NETWORK

    @Test
    fun `main prints the network issue and received data`() {
        val expectedLines = listOf(
            "Network issue",
            "Data received: [Data1, Data2]",
        )
        when {
            !sampleProblem().javaClass.isEnum -> hint(
                "Declare Problem as an enum class. The exercise asks for an " +
                        "enum class with the constants NETWORK, TIMEOUT, and " +
                        "UNKNOWN.",
                ""
            )

            output.lines() != expectedLines -> hint(
                "Keep the given handleStatus() and main() code as it is. " +
                        "main() prints \"Network issue\" and " +
                        "\"Data received: [Data1, Data2]\"."
            )

            else -> passed(
                "Problem is an enum class, and main() prints \"Network issue\" " +
                        "and \"Data received: [Data1, Data2]\"."
            )
        }
    }
}
