import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertTrue

class ControlFlowConditionalExercise1Test {
    @Test
    fun testOutput() {
        repeat(20) {
            val out = ByteArrayOutputStream()
            System.setOut(PrintStream(out))
            main()
            val output = out.toString().trim()
            assertTrue(output == "You win :)" || output == "You lose :(", "Unexpected output: $output")
        }
    }
}
