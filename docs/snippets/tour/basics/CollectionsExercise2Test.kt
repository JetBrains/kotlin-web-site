import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class CollectionsExercise2Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        assertEquals("Support for smtp: false", out.toString().trim())
    }
}
