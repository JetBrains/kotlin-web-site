import kotlin.test.Test
import kotlin.test.assertEquals

class GetPriceInEurosTest {
    @Test
    fun testGetPriceInEuros() {
        val product = Product()
        assertEquals(85.0, product.getPriceInEuros())
    }
}
