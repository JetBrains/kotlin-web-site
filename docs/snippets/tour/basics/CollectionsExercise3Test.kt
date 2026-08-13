import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertTrue

class CollectionsExercise3Test {
    @Test
    fun testOutput() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        main()
        val output = out.toString().trim()
        assertTrue(output.contains("2") && output.contains("two"), "Unexpected output: $output")
    }
}
