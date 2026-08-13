import kotlin.test.Test
import kotlin.test.assertEquals

class IntervalInSecondsTest {
    @Test
    fun testDefaultsAndNamedArgs() {
        assertEquals(4815, intervalInSeconds(1, 20, 15))
        assertEquals(85, intervalInSeconds(minutes = 1, seconds = 25))
        assertEquals(7200, intervalInSeconds(hours = 2))
        assertEquals(600, intervalInSeconds(minutes = 10))
        assertEquals(3601, intervalInSeconds(hours = 1, seconds = 1))
    }
}
