import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class ControlFlowLoopsExercise3Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        assertEquals("limousine\nlanguage", out.toString().trim())
    }
}
