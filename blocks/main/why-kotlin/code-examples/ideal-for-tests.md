// Tests
// The following example works for JVM only
import org.junit.Test
import kotlin.test.*

class SampleTest {
    @Test
    fun `test sum`() {                  // Write test names with whitespaces in backticks
        val a = 1
        val b = 41
        assertEquals(42, sum(a, b), "Wrong result for sum($a, $b)")
    }

    @Test
    fun `test computation`() {
        assertTrue("Computation failed") {
            setup()                     // Use lambda returning the test subject
            compute()
        }
    }
}

// Sources
fun sum(a: Int, b: Int) = a + b
fun setup() {}
fun compute() = true