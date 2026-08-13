import kotlin.test.Test
import kotlin.test.assertEquals

class IncrementedTest {
    @Test
    fun testIncremented() {
        assertEquals(listOf(2, 3, 4), listOf(1, 2, 3).incremented())
        assertEquals(emptyList(), emptyList<Int>().incremented())
    }
}
