import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class LambdasExercise1Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val expected = listOf("title", "year", "author").map { "https://example.com/book-info/5/$it" }
        assertEquals(expected.toString(), out.toString().trim())
    }
}
