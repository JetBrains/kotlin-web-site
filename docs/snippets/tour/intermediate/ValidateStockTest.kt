import kotlin.test.Test
import kotlin.test.assertEquals

class ValidateStockTest {
    @Test
    fun testValidateStock() {
        assertEquals(5, validateStock(5, 10))
        assertEquals(-1, validateStock(null, 10))
        assertEquals(-1, validateStock(5, null))
        assertEquals(-1, validateStock(-2, 10))
        assertEquals(-1, validateStock(20, 10))
    }
}
