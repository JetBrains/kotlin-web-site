import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class CreditCardTest {
    private fun cardReport(amount: Double, refundAmount: Double): Pair<Any, String> {
        val card = CreditCard("Test Card")
        val captured = ByteArrayOutputStream()
        val originalOut = System.out
        try {
            System.setOut(PrintStream(captured))
            card.authorize(amount)
            card.processPayment(amount)
            card.refund(refundAmount)
        } finally {
            System.setOut(originalOut)
        }
        return card to captured.toString().trim()
    }

    @Test
    fun `authorize, process and refund a credit card payment`() {
        val (card, report) = try {
            cardReport(250.0, 75.0)
        } catch (e: Throwable) {
            hint(
                "Make CreditCard usable the way main() uses it. Creating one " +
                        "and calling its functions throws ${e::class.simpleName}.",
                ""
            )
        }
        val lines = report.lines()
        when {
            card !is PaymentMethod && card !is Refundable -> hint(
                "Make CreditCard inherit from both PaymentMethod(name) and " +
                        "Refundable. List them after a colon in the class header " +
                        "and mark processPayment() and refund() with override.",
                ""
            )

            card !is PaymentMethod -> hint(
                "Make CreditCard inherit from the PaymentMethod abstract class. " +
                        "Add PaymentMethod(name) to its supertype list and mark " +
                        "processPayment() with override.",
                ""
            )

            card !is Refundable -> hint(
                "Make CreditCard also implement the Refundable interface. Add " +
                        "Refundable to its supertype list and mark refund() with " +
                        "override.",
                ""
            )

            report.isBlank() -> hint(
                "Print a message from each function with println(). authorize(), " +
                        "processPayment() and refund() print nothing.",
                ""
            )

            lines.getOrNull(0) != "Authorizing payment of \$250.0." -> hint(
                "Make authorize() in PaymentMethod print a message with the " +
                        "amount. For 250.0 main()'s comments expect \"Authorizing " +
                        "payment of \$250.0.\".",
                report
            )

            lines.getOrNull(1) != "Processing credit card payment of \$250.0." -> hint(
                "Make CreditCard's processPayment() print \"Processing credit " +
                        "card payment of \$amount.\". For 250.0 that is " +
                        "\"Processing credit card payment of \$250.0.\".",
                report
            )

            lines.getOrNull(2) != "Refunding \$75.0 to the credit card." -> hint(
                "Make CreditCard's refund() print \"Refunding \$amount to the " +
                        "credit card.\". For 75.0 that is \"Refunding \$75.0 to " +
                        "the credit card.\".",
                report
            )

            lines.size != 3 -> hint(
                "Print exactly one line from each function. authorize(), " +
                        "processPayment() and refund() print ${lines.size} lines " +
                        "instead of 3.",
                report
            )

            output.lines() != listOf(
                "Authorizing payment of \$100.0.",
                "Processing credit card payment of \$100.0.",
                "Refunding \$50.0 to the credit card.",
            ) -> hint(
                "Keep the code in main() as it is. It prints the three " +
                        "lines shown in its comments."
            )

            else -> passed(
                "Checked: CreditCard implements Refundable and PaymentMethod, and " +
                        "authorize(), processPayment() and refund() each print their " +
                        "own message with the amount. Whether authorize() is declared in " +
                        "PaymentMethod and processPayment() is abstract is not " +
                        "checked. Compare with the example solution."
            )
        }
    }
}
