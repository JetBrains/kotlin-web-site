import kotlin.test.Test

class GetPriceInEurosTest {
    private fun euros() =
        expect("product.getPriceInEuros()", 85.0) { Product().getPriceInEuros() }

    @Test
    fun `return the price in euros`() {
        when (val failed = listOf(euros()).firstMismatch()) {
            null ->
                if ("Price in Euros: \u20AC85.0" in output.lines()) passed(
                    "getPriceInEuros() returns 85.0, and main() prints \"Price " +
                            "in Euros: \u20AC85.0\". The test doesn't check whether " +
                            "you use a single-expression function with safe call " +
                            "operators (?.) and let."
                ) else hint(
                    "Keep main() as it is. It prints \"Price in Euros: " +
                            "\u20AC85.0\" for the value the function returns."
                )

            else -> when {
                failed.thrown != null -> hint(
                    "Use safe call operators (?.) so that a null product info or " +
                            "price does not stop the program.",
                    failed
                )

                failed.actual == null -> hint(
                    "Return the converted price when it is available. Chain the " +
                            "calls with safe call operators (?.) and pass the price " +
                            "to convertToEuros() inside let.",
                    failed
                )

                else -> hint(
                    "Convert the price with the convertToEuros() function. " +
                            "For 100.0 dollars it returns 85.0.",
                    failed
                )
            }
        }
    }
}
