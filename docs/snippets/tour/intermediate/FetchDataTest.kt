import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class FetchDataTest {
    @Test
    fun testFetchData() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        assertEquals("Data received - Processed", out.toString().trim())
    }
}
