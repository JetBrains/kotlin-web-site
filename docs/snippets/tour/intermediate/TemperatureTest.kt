import kotlin.math.abs
import kotlin.test.Test

class TemperatureTest {
    private fun temperatureFrom(fahrenheit: Double): Temperature =
        Temperature.fromFahrenheit(fahrenheit)

    private fun celsiusOf(fahrenheit: Double, expected: Double) =
        expect("Temperature.fromFahrenheit($fahrenheit).celsius", expected) {
            temperatureFrom(fahrenheit).celsius
        }

    private fun near(actual: Any?, value: Double): Boolean =
        actual is Number && abs(actual.toDouble() - value) < 0.01

    @Test
    fun `convert any Fahrenheit value to degrees Celsius`() {
        val checks = listOf(
            celsiusOf(212.0, expected = 100.0),
            celsiusOf(32.0, expected = 0.0),
        )
        when (val failed = checks.firstMismatch()) {
            null ->
                if ("32.22222222222222°C is 90.0 °F" in output.lines()) passed(
                    "Checked: Temperature.fromFahrenheit() creates a Temperature " +
                            "whose celsius is (fahrenheit - 32) * 5 / 9 for any input. " +
                            "Calling it on the class name works because it lives in a " +
                            "companion object. Compare with the example solution."
                ) else hint(
                    "Keep the code in main() as it is. It prints " +
                            "\"32.22222222222222°C is 90.0 °F\"."
                )

            else -> when {
                failed.thrown != null -> hint(
                    "Return a Temperature built from the converted value. " +
                            "fromFahrenheit() works for any input.",
                    failed
                )

                near(failed.actual, 413.6) -> hint(
                    "Convert in the opposite direction: subtract 32 first, then " +
                            "multiply by 5 and divide by 9. fromFahrenheit() " +
                            "receives a Fahrenheit value and builds a Temperature " +
                            "in Celsius.",
                    failed
                )

                near(failed.actual, 0.0) && failed.expected == 100.0 -> hint(
                    "Multiply by 5 and divide by 9 in separate steps. Dividing " +
                            "whole numbers like 5 / 9 gives 0 in Kotlin.",
                    failed
                )

                near(failed.actual, 117.77777777777777) -> hint(
                    "Subtract 32 from the Fahrenheit value before multiplying by " +
                            "5 and dividing by 9.",
                    failed
                )

                else -> hint(
                    "Compute the celsius value as (fahrenheit - 32) * 5 / 9 and " +
                            "pass it to the Temperature constructor.",
                    failed
                )
            }
        }
    }
}
