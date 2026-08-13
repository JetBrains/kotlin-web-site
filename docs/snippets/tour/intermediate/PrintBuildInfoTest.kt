import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class PrintBuildInfoTest {
    @Test
    fun testPrintBuildInfo() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        printBuildInfo()
        assertEquals("experimental build info", out.toString().trim())
    }
}
