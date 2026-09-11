import kotlin.test.Test

class DeliveryStatusTest {
    private fun statuses(): List<Any> = listOf(
        DeliveryStatus.Pending("Alice"),
        DeliveryStatus.InTransit("2024-11-20"),
        DeliveryStatus.Delivered("2024-11-18", "Bob"),
        DeliveryStatus.Canceled("Address not found"),
    )

    @Test
    fun `print a line for every delivery status`() {
        val nonData = statuses().firstOrNull {
            it.toString().startsWith(it.javaClass.name + "@")
        }
        val expectedLines = listOf(
            "The package is pending pickup from Alice.",
            "The package is in transit and expected to arrive by 2024-11-20.",
            "The package was delivered to Bob on 2024-11-18.",
            "The delivery was canceled due to: Address not found.",
        )
        when {
            nonData != null -> hint(
                "Add the data keyword to the ${nonData.javaClass.simpleName} " +
                        "class. The exercise asks for data classes inside " +
                        "DeliveryStatus.",
                ""
            )

            "The package was delivered to 2024-11-18 on Bob." in output.lines() -> hint(
                "Swap the constructor parameters of Delivered. main() passes " +
                        "the delivery date first and the recipient second.",
                "The package was delivered to 2024-11-18 on Bob."
            )

            output.lines() != expectedLines -> hint(
                "Keep the given printDeliveryStatus() and main() code as it is. " +
                        "main() prints the four status lines shown in its " +
                        "comments."
            )

            else -> passed(
                "Checked: DeliveryStatus contains the four data classes and " +
                        "main() prints every status line. Because the class is " +
                        "sealed, the compiler guarantees the given when covers " +
                        "every subclass."
            )
        }
    }
}
