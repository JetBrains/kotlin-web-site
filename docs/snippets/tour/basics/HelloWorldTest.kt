import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class HelloWorldTest {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        assertEquals("Mary is 20 years old", out.toString().trim())
    }
}
