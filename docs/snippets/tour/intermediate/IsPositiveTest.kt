import kotlin.test.Test
import kotlin.test.assertTrue
import kotlin.test.assertFalse

class IsPositiveTest {
    @Test
    fun testIsPositive() {
        assertTrue(1.isPositive())
        assertFalse((-1).isPositive())
        assertFalse(0.isPositive())
    }
}
