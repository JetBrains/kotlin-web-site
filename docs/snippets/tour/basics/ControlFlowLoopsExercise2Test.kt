import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class ControlFlowLoopsExercise2Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val expected = (1..100).map {
            when {
                it % 15 == 0 -> "fizzbuzz"
                it % 3 == 0 -> "fizz"
                it % 5 == 0 -> "buzz"
                else -> "$it"
            }
        }
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
