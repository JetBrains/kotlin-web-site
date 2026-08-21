import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test
import kotlin.test.assertEquals

class DeliveryStatusTest {
    @Test
    fun testDeliveryStatuses() {
        val out = ByteArrayOutputStream()
        System.setOut(PrintStream(out))

        printDeliveryStatus(DeliveryStatus.Pending("Alice"))
        printDeliveryStatus(DeliveryStatus.InTransit("2024-11-20"))
        printDeliveryStatus(DeliveryStatus.Delivered("2024-11-18", "Bob"))
        printDeliveryStatus(DeliveryStatus.Canceled("Address not found"))

        val expected = listOf(
            "The package is pending pickup from Alice.",
            "The package is in transit and expected to arrive by 2024-11-20.",
            "The package was delivered to Bob on 2024-11-18.",
            "The delivery was canceled due to: Address not found."
        )
        assertEquals(expected.joinToString("\n"), out.toString().trim())
    }
}
