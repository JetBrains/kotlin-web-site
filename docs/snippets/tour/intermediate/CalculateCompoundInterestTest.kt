import kotlin.test.Test
import kotlin.test.assertEquals

class CalculateCompoundInterestTest {
    @Test
    fun testCalculateCompoundInterest() {
        val amount = calculateCompoundInterest(1000.0, 0.05, 4, 5)
        assertEquals(1282.0372317085844, amount, 0.0001)
    }
}
