import kotlin.test.Test
import kotlin.test.assertEquals

class CircleAreaExpressionTest {
    @Test
    fun testArea() {
        assertEquals(12.57, circleArea(2), 0.01)
    }
}
