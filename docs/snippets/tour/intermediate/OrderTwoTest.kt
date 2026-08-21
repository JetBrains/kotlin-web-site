import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotEquals

class OrderTwoTest {
    @Test
    fun testOrderTwo() {
        assertEquals("002", OrderTwo.orderId)
        assertEquals("Bob", OrderTwo.customerName)
        assertEquals(12.75, OrderTwo.orderTotal)
        assertEquals("OrderTwo", OrderTwo.toString())
        assertNotEquals(OrderOne, OrderTwo)
    }
}
