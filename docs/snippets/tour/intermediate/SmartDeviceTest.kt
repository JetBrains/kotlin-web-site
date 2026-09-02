import java.io.ByteArrayOutputStream
import java.io.PrintStream
import kotlin.test.Test

class SmartDeviceTest {
    private fun thermostatReport(name: String, temperature: Int): Pair<Any, String> {
        val thermostat = SmartThermostat(name)
        val captured = ByteArrayOutputStream()
        val originalOut = System.out
        try {
            System.setOut(PrintStream(captured))
            thermostat.turnOn()
            thermostat.adjustTemperature(temperature)
            thermostat.turnOff()
        } finally {
            System.setOut(originalOut)
        }
        return thermostat to captured.toString().trim()
    }

    @Test
    fun `turn a thermostat on, adjust it and turn it off`() {
        val (thermostat, report) = try {
            thermostatReport("Hallway Thermostat", 23)
        } catch (e: Throwable) {
            hint(
                "Make SmartThermostat usable the way main() uses it. Creating " +
                        "one and calling its functions throws ${e::class.simpleName}.",
                ""
            )
        }
        val lines = report.lines()
        when {
            thermostat !is SmartDevice -> hint(
                "Make SmartThermostat inherit from SmartDevice, like SmartLight " +
                        "does: class SmartThermostat(name: String) : SmartDevice(name).",
                ""
            )

            report.isBlank() -> hint(
                "Print the messages with println() inside SmartThermostat's " +
                        "turnOn(), adjustTemperature() and turnOff() functions.",
                ""
            )

            "Bedroom Thermostat" in report -> hint(
                "Build the messages from the name property instead of fixed text. " +
                        "This thermostat is called Hallway Thermostat, not Bedroom " +
                        "Thermostat.",
                report
            )

            lines.getOrNull(0) != "Hallway Thermostat thermostat is now heating." -> hint(
                "Make turnOn() print \"\$name thermostat is now heating.\". For " +
                        "this thermostat that is \"Hallway Thermostat thermostat is " +
                        "now heating.\".",
                report
            )

            lines.getOrNull(1) != "Hallway Thermostat thermostat set to 23°C." -> hint(
                "Make adjustTemperature() print \"\$name thermostat set to " +
                        "\$temperature°C.\". For 23 that is \"Hallway Thermostat " +
                        "thermostat set to 23°C.\".",
                report
            )

            lines.getOrNull(2) != "Hallway Thermostat thermostat is now off." -> hint(
                "Make turnOff() print \"\$name thermostat is now off.\". For this " +
                        "thermostat that is \"Hallway Thermostat thermostat is now " +
                        "off.\".",
                report
            )

            lines.size != 3 -> hint(
                "Print exactly one line from each function. turnOn(), " +
                        "adjustTemperature() and turnOff() print ${lines.size} " +
                        "lines instead of 3.",
                report
            )

            output.lines() != listOf(
                "Living Room Light is now ON.",
                "Adjusting Living Room Light brightness to 10%.",
                "Living Room Light is now OFF.",
                "Bedroom Thermostat thermostat is now heating.",
                "Bedroom Thermostat thermostat set to 5°C.",
                "Bedroom Thermostat thermostat is now off.",
            ) -> hint(
                "Keep the code in main() and the SmartLight class as they are. " +
                        "Together with your SmartThermostat they print the six " +
                        "lines shown in main()'s comments."
            )

            else -> passed(
                "Checked: SmartThermostat inherits from SmartDevice, and its " +
                        "turnOn(), adjustTemperature() and turnOff() build their " +
                        "messages from the name and temperature. Whether turnOn() and " +
                        "turnOff() are abstract in SmartDevice is not checked. " +
                        "Compare with the example solution."
            )
        }
    }
}
