import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class LazyHealthCheckTest {
    @Test
    fun testMainOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val expected = listOf(
            "Performing application server health check...",
            "Application server is online and healthy"
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
