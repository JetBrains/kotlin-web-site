import kotlin.test.Test

class OrderTwoTest {
    private fun orderTwo(): Any = OrderTwo

    @Test
    fun `print a second order that stays unique`() {
        val two = orderTwo() as? Order ?: hint(
            "Make OrderTwo implement the Order interface, like OrderOne does. " +
                    "Declare it as data object OrderTwo : Order and override the " +
                    "interface's three properties.",
            ""
        )
        val printed = two.toString()
        when {
            "@" in printed -> hint(
                "Add the data keyword in front of your object declaration. A " +
                        "data object prints its name, but a plain object prints " +
                        "only its class and a code, as below.",
                printed
            )

            printed == "OrderOne" -> hint(
                "Declare OrderTwo as its own data object instead of reusing " +
                        "OrderOne. main() expects the two orders to be unique.",
                ""
            )

            printed != "OrderTwo" -> hint(
                "Let the data object print its own name. Printing OrderTwo " +
                        "shows the text below instead of \"OrderTwo\".",
                printed
            )

            two.customerName == "Alice" -> hint(
                "Give OrderTwo its own customerName. It is \"Alice\", the same " +
                        "as OrderOne's, but the last line of main() expects the " +
                        "names to differ.",
                ""
            )

            output.lines() != listOf(
                "Order name: OrderOne",
                "Order name: OrderTwo",
                "Are the two orders identical? false",
                "The orders are unique.",
                "Do the orders have the same customer name? false",
            ) -> hint(
                "Keep the code in main() as it is. It prints the five " +
                        "lines shown in its comments."
            )

            else -> passed(
                "Checked: OrderTwo is a data object implementing Order, with its " +
                        "own customer name, and printing it shows its name. The " +
                        "orderId and orderTotal values are your choice. The example " +
                        "solution uses \"002\", Bob and 12.75."
            )
        }
    }
}
