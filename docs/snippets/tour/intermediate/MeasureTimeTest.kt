import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertTrue

class MeasureTimeTest {
    @Test
    fun testMainOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val lines = out.toString().trim().lines()
        assertTrue(lines.size == 2, "Expected 2 lines of output, got: ${lines.size}")
        assertTrue(lines[0] == "Processed data", "Unexpected first line: ${lines[0]}")
        assertTrue(lines[1].startsWith("Time taken: "), "Unexpected second line: ${lines[1]}")
    }
}
