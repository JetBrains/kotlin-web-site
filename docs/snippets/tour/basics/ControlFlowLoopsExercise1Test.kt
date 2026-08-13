import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class ControlFlowLoopsExercise1Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val expected = (1..7).map { "There's only $it slice/s of pizza :(" } +
            "There are 8 slices of pizza. Hooray! We have a whole pizza! :D"
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
