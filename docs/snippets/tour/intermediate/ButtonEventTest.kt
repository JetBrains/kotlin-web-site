import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class ButtonEventTest {
    @Test
    fun testDoubleClick() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        assertEquals("Double click!", out.toString().trim())
    }
}
