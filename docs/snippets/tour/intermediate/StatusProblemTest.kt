import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class StatusProblemTest {
    @Test
    fun testHandleStatus() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))

        handleStatus(Status.Error(Status.Error.Problem.NETWORK))
        handleStatus(Status.Error(Status.Error.Problem.TIMEOUT))
        handleStatus(Status.Error(Status.Error.Problem.UNKNOWN))
        handleStatus(Status.OK(listOf("Data1", "Data2")))

        val expected = listOf(
            "Network issue",
            "Request timed out",
            "Unknown error occurred",
            "Data received: [Data1, Data2]"
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
