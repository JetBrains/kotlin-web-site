import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class CreditCardTest {
    @Test
    fun testCreditCard() {
        val visa = CreditCard("Visa")
        assertTrue(visa is Refundable)
        assertTrue(visa is PaymentMethod)

        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))
        visa.authorize(100.0)
        visa.processPayment(100.0)
        visa.refund(50.0)

        val expected = listOf(
            "Authorizing payment of \$100.0.",
            "Processing credit card payment of \$100.0.",
            "Refunding \$50.0 to the credit card."
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
