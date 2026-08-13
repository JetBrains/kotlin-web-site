import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class LambdasExercise2Test {
    @Test
    fun testRepeatNFunction() {
        var count = 0
        repeatN(3) { count++ }
        assertEquals(3, count)
    }

    @Test
    fun testMainOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val expected = (1..5).joinToString("\n") { "Hello" }
        assertEquals(expected, out.toString().trim())
    }
}
