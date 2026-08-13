import kotlin.test.Test
import kotlin.test.assertEquals

class CircleAreaTest {
    @Test
    fun testArea() {
        assertEquals(12.57, circleArea(2), 0.01)
    }
}
